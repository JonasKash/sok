import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase URL e Anon Key - são públicas e seguras para usar no frontend
// A segurança real está nas Row Level Security (RLS) policies no Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Cria cliente apenas se as credenciais estiverem configuradas
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
  }
} else {
  console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Exporta uma função helper para verificar se o Supabase está disponível
export const isSupabaseConfigured = () => supabase !== null;

// Exporta o cliente (pode ser null se não configurado)
export { supabase };

// Tipos para autenticação
export interface AuthResponse {
  user: any;
  session: any;
  error: any;
}

