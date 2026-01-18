# 🎯 Sistema de Rastreamento Inteligente - Implementação Completa

## ✅ O que foi implementado

### 1. **Sistema de Tracking Completo**
- ✅ Captura automática de UTMs na entrada
- ✅ Rastreamento de cada etapa do funil
- ✅ Armazenamento local (localStorage) para persistência
- ✅ Histórico completo de eventos

### 2. **Facebook Conversions API**
- ✅ Integração completa com Facebook Conversions API
- ✅ Hash automático de dados sensíveis (SHA256)
- ✅ Desduplicação de eventos via `event_id`
- ✅ Captura automática de `fbp` e `fbc` dos cookies
- ✅ Envio de eventos em tempo real

### 3. **Dashboard Admin**
- ✅ Login com credenciais: `jonasav21@gmail.com` / `teste123adminteste123`
- ✅ Visualização em tempo real do funil
- ✅ Métricas detalhadas (conversões, taxas, etc.)
- ✅ Filtros e busca de eventos
- ✅ Exportação de dados

### 4. **Gerador de UTMs**
- ✅ Interface para criar URLs com parâmetros UTM
- ✅ Templates pré-configurados (Facebook, Google, Instagram, etc.)
- ✅ Copiar URL gerada
- ✅ Preview dos parâmetros

### 5. **Página de Agradecimento**
- ✅ Rastreamento de visualização
- ✅ Passagem de UTMs e dados do lead
- ✅ Integração com Meta Pixel

## 📍 Mapeamento de Eventos

### Eventos Rastreados:

1. **`landing_page_view`** → **PageView (Facebook)**
   - Quando: Usuário acessa a página inicial
   - Local: `App.tsx` - useEffect na montagem

2. **`view_content`** → **ViewContent (Facebook)**
   - Quando: Usuário clica no botão "Analisar minha clínica"
   - Local: `App.tsx` - onOpenForm callback

3. **`cta_click`** → **Contact (Facebook)**
   - Quando: Clique em qualquer CTA
   - Local: Integrado no tracking service

4. **`form_submit`** → **CompleteRegistration (Facebook)**
   - Quando: Formulário de análise é enviado
   - Local: `App.tsx` - handleStartAnalysis

5. **`report_generated`** → **ViewContent (Facebook)**
   - Quando: Relatório é gerado após análise
   - Local: `App.tsx` - após analyzeBusiness

6. **`dashboard_page_view`** → **PageView (Facebook)**
   - Quando: Usuário visualiza o dashboard de resultados
   - Local: `App.tsx` - handleAnalysisComplete
   - **Importante**: Este é o PageView para remarketing!

7. **`checkout_click`** → **InitiateCheckout (Facebook)**
   - Quando: Usuário clica em "DESBLOQUEAR POR R$ 29,90"
   - Local: `components/Dashboard.tsx`

8. **`payment_confirmed`** → **Purchase (Facebook)**
   - Quando: Pagamento é confirmado
   - Local: `components/PaymentModal.tsx` - handlePaymentConfirmed

9. **`thank_you_page_view`**
   - Quando: Usuário acessa página de agradecimento
   - Local: `components/ThankYouPage.tsx`

## 🔐 Acesso ao Dashboard Admin

### URL de Acesso:
```
https://seu-dominio.com/?admin=true
```

### Credenciais:
- **Email**: `jonasav21@gmail.com`
- **Senha**: `teste123adminteste123`

### Funcionalidades do Dashboard:
- Visualização em tempo real de todos os eventos
- Métricas de conversão
- Filtros por tipo de evento
- Busca por lead ID, UTM, cidade, etc.
- Exportação de dados em JSON
- Estatísticas de UTMs

## 🔗 Gerador de UTMs

### URL de Acesso:
```
https://seu-dominio.com/?utm_generator=true
```

Ou através do dashboard admin (botão "Gerador de UTMs")

### Como Usar:
1. Preencha os campos UTM (source, medium, campaign, etc.)
2. Use templates rápidos ou crie customizado
3. Copie a URL gerada
4. Use em suas campanhas

## ⚙️ Configuração

### Variáveis de Ambiente (.env.local):

```env
# Facebook Conversions API
VITE_FACEBOOK_PIXEL_ID=1593785288615011
VITE_FACEBOOK_ACCESS_TOKEN=seu_token_aqui

# Webhook (opcional)
VITE_WEBHOOK_URL=https://seu-backend.com/webhook

# Google Gemini (opcional)
API_KEY=sua_chave_gemini
```

### Token do Facebook:
O token já foi gerado e está documentado. Adicione no `.env.local`:
```
VITE_FACEBOOK_ACCESS_TOKEN=EAFvRSZCIaqroBQSlpmT8lJLpDLUvxt5JefYjDkiCIh1eGmJ7mLIeNFaoI6ZAmAFPTrGPk94yukpp4jDelFfbM161VKNNjd4P17EZASMKHWkdBeXPuF3jIoPstKmiucECJghbf2vImPX9tCM6gZAQU1uZBviyIRz27UZCOdZAbTlPaGv2w2pC1F1hG57Azs9rQZDZD
```

## 📊 Fluxo Completo do Funil

```
1. Landing Page (PageView)
   ↓
2. Clique "Ver Relatório" (ViewContent)
   ↓
3. Formulário Enviado (CompleteRegistration)
   ↓
4. Relatório Gerado (ViewContent)
   ↓
5. Dashboard Visualizado (PageView - Remarketing)
   ↓
6. Clique Checkout (InitiateCheckout)
   ↓
7. Pagamento Confirmado (Purchase)
   ↓
8. Página de Agradecimento (ThankYouPage)
```

## 🎨 Estrutura de Arquivos Criados

```
services/
├── tracking.ts                    # Serviço principal de tracking
└── facebookConversionsAPI.ts      # Integração Facebook Conversions API

components/
├── AdminLogin.tsx                 # Tela de login admin
├── AdminDashboard.tsx             # Dashboard de métricas
├── UTMGenerator.tsx              # Gerador de URLs com UTM
└── ThankYouPage.tsx              # Página de agradecimento

App.tsx                            # Atualizado com rotas e tracking
```

## 🚀 Como Testar

1. **Testar Tracking:**
   - Acesse a landing page
   - Preencha o formulário
   - Complete o fluxo até o checkout
   - Verifique no console do navegador os eventos sendo enviados

2. **Testar Dashboard Admin:**
   - Acesse `/?admin=true`
   - Faça login com as credenciais
   - Veja os eventos em tempo real

3. **Testar Facebook API:**
   - Abra o console do navegador
   - Veja os logs de eventos enviados
   - Verifique no Facebook Events Manager se os eventos chegaram

4. **Testar Gerador de UTMs:**
   - Acesse `/?utm_generator=true` ou pelo dashboard
   - Gere uma URL com UTMs
   - Acesse a URL e verifique se os UTMs foram capturados

## 📝 Notas Importantes

1. **Desenvolvimento vs Produção:**
   - No modo desenvolvimento, há um botão "Simular Pagamento" no PaymentModal
   - Em produção, isso deve ser removido ou substituído por integração real com Mercado Pago

2. **Armazenamento Local:**
   - Todos os eventos são salvos no `localStorage`
   - O dashboard lê do `localStorage` para exibir métricas
   - Em produção, considere enviar para um backend

3. **Facebook Conversions API:**
   - Funciona mesmo sem token (apenas loga warning)
   - Para funcionar completamente, adicione o token no `.env.local`
   - Dados sensíveis são automaticamente hasheados

4. **Página de Agradecimento:**
   - A rota `/obrigado` precisa ser configurada no servidor
   - Ou use um SPA router (React Router) para rotas client-side

## 🔄 Próximos Passos (Opcional)

1. **Backend:**
   - Criar API para receber webhooks
   - Armazenar eventos em banco de dados
   - Dashboard com dados do servidor

2. **Mercado Pago:**
   - Integração real de pagamento
   - Webhooks de confirmação
   - Rastreamento automático de Purchase

3. **Analytics:**
   - Google Analytics 4
   - Integração com outras plataformas
   - Relatórios automatizados

---

**Implementado em**: Janeiro 2025  
**Versão**: 1.0

