# 🔐 Configuração do Supabase

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## Como Obter as Credenciais

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Segurança

⚠️ **IMPORTANTE**: As chaves `anon` são públicas e seguras para usar no frontend. A segurança real está nas **Row Level Security (RLS) policies** configuradas no Supabase.

- ✅ A `anon key` pode ficar no frontend
- ✅ Configure RLS policies no Supabase para proteger seus dados
- ❌ NUNCA exponha a `service_role key` no frontend

## Configuração no Supabase

### 1. Habilitar Email Auth

No painel do Supabase:
- Vá em **Authentication** → **Providers**
- Habilite **Email** provider
- Configure as opções de email (opcional)

### 2. Configurar RLS (Row Level Security)

Configure políticas de segurança nas tabelas conforme necessário para proteger os dados dos usuários.

## Funcionalidades Implementadas

- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Verificação de sessão automática
- ✅ Logout automático quando a sessão expira
- ✅ Modal de login integrado ao botão "Entrar"




