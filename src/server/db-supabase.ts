import { createClient } from '@supabase/supabase-js';
import type { User, Chat, Message, Payment } from '../types';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Premium is expiry-based: a user is premium while premium_expires_at is in the future.
// The legacy profiles.is_subscribed boolean is ignored.
const isPremiumActive = (premiumExpiresAt: string | null | undefined): boolean =>
  Boolean(premiumExpiresAt && new Date(premiumExpiresAt).getTime() > Date.now());

const mapProfile = (id: string, email: string, profile: any): User => ({
  id,
  email,
  free_messages_left: profile.free_messages_left,
  is_subscribed: isPremiumActive(profile.premium_expires_at),
  premium_expires_at: profile.premium_expires_at || null,
  onboarded: profile.onboarded,
  name: profile.name,
  age: profile.age,
  concerns: profile.concerns,
  goals: profile.goals
});

export const dbServiceAsync = {
  // User operations are largely handled by Supabase Auth, but we use profiles
  syncProfile: async (userId: string, email: string): Promise<User> => {
    let { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
    if (!profile) {
      const { data: newProfile } = await supabaseAdmin.from('profiles').insert({
        id: userId,
        free_messages_left: 10,
        is_subscribed: false,
        onboarded: false
      }).select().single();
      profile = newProfile;
    }
    return mapProfile(userId, email, profile);
  },

  getUserById: async (id: string, email: string): Promise<User | null> => {
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
    if (!profile) return null;
    return mapProfile(id, email, profile);
  },

  // Extends premium by `days`, stacking on top of remaining time if still active.
  activatePremium: async (id: string, days: number): Promise<void> => {
    const { data: profile } = await supabaseAdmin.from('profiles').select('premium_expires_at').eq('id', id).single();
    const base = isPremiumActive(profile?.premium_expires_at)
      ? new Date(profile!.premium_expires_at).getTime()
      : Date.now();
    const expiresAt = new Date(base + days * 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from('profiles').update({ premium_expires_at: expiresAt }).eq('id', id);
  },

  createPayment: async (userId: string, yookassaPaymentId: string, amount: number): Promise<Payment> => {
    const { data, error } = await supabaseAdmin.from('payments').insert({
      user_id: userId,
      yookassa_payment_id: yookassaPaymentId,
      amount,
      currency: 'RUB',
      status: 'pending'
    }).select().single();
    if (error) throw new Error(`Failed to record payment: ${error.message}`);
    return data as Payment;
  },

  getPaymentByYookassaId: async (yookassaPaymentId: string): Promise<Payment | null> => {
    const { data } = await supabaseAdmin.from('payments').select('*').eq('yookassa_payment_id', yookassaPaymentId).single();
    return data as Payment | null;
  },

  getLatestPaymentForUser: async (userId: string): Promise<Payment | null> => {
    const { data } = await supabaseAdmin.from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data as Payment | null;
  },

  updatePaymentStatus: async (yookassaPaymentId: string, status: 'succeeded' | 'canceled'): Promise<void> => {
    await supabaseAdmin.from('payments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('yookassa_payment_id', yookassaPaymentId);
  },

  updateUserOnboarding: async (id: string, data: { name: string, age: string, concerns: string, goals: string }): Promise<any> => {
    const { data: updated } = await supabaseAdmin.from('profiles').update({
      onboarded: true,
      name: data.name,
      age: data.age,
      concerns: data.concerns,
      goals: data.goals
    }).eq('id', id).select().single();
    return updated;
  },

  // Backwards-compatible subscription toggle (some callers expect this helper)
  updateUserSubscription: async (id: string, isSubscribed: boolean): Promise<any> => {
    const { data: updated } = await supabaseAdmin.from('profiles').update({ is_subscribed: isSubscribed }).eq('id', id).select().single();
    return updated;
  },

  decrementFreeMessages: async (id: string) => {
    // In supabase we can't do atomic decrement easily without RPC, but we fetch and update here for MVP
    const { data: profile } = await supabaseAdmin.from('profiles').select('free_messages_left').eq('id', id).single();
    if (profile && profile.free_messages_left > 0) {
      await supabaseAdmin.from('profiles').update({ free_messages_left: profile.free_messages_left - 1 }).eq('id', id);
    }
  },

  decrementFreeMessagesAtomic: async (userId: string): Promise<number | null> => {
    const { data, error } = await supabaseAdmin
      .rpc('decrement_free_message', { user_id: userId });

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) return null;

    return data[0].free_messages_left;
  },


  createChat: async (userId: string, title: string): Promise<Chat> => {
    const { data } = await supabaseAdmin.from('chats').insert({
      user_id: userId,
      title
    }).select().single();
    return data as Chat;
  },

  getChatsByUser: async (userId: string): Promise<Chat[]> => {
    const { data } = await supabaseAdmin.from('chats').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return (data || []) as Chat[];
  },

  getChatById: async (id: string): Promise<Chat | null> => {
    const { data } = await supabaseAdmin.from('chats').select('*').eq('id', id).single();
    return data as Chat | null;
  },

  createMessage: async (chatId: string, role: 'user' | 'model', content: string): Promise<Message> => {
    const { data } = await supabaseAdmin.from('messages').insert({
      chat_id: chatId,
      sender: role, // schema uses 'sender'
      content: content 
    }).select().single();
    
    // Convert to internal format (schema has sender, we use role)
    const msg = { ...data, role: data.sender };
    
    // Update title if first message
    const msgs = await dbServiceAsync.getMessagesByChat(chatId);
    if (msgs.length === 1 && role === 'user') {
      const shortTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      await supabaseAdmin.from('chats').update({ title: shortTitle }).eq('id', chatId);
    }
    
    return msg as Message;
  },

  getMessagesByChat: async (chatId: string, limit: number = 15): Promise<Message[]> => {
    const { data } = await supabaseAdmin.from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.reverse().map((d: any) => ({
      ...d,
      role: d.sender // map schema's 'sender' to 'role'
    })) as Message[];
  }
};
