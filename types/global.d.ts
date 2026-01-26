// Declarações de tipos globais

interface Window {
  fbq?: (action: string, event: string, params?: Record<string, any>) => void;
  gtag?: (...args: any[]) => void;
}

interface ImportMetaEnv {
  readonly VITE_FACEBOOK_PIXEL_ID?: string;
  readonly VITE_FACEBOOK_ACCESS_TOKEN?: string;
  readonly VITE_WEBHOOK_URL?: string;
  readonly VITE_API_URL?: string;
  readonly API_KEY?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

