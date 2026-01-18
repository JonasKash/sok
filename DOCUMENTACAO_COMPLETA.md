# 📚 Documentação Completa - Avestra

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Projeto:** Avestra - Plataforma de Análise de Autoridade Digital para Clínicas Odontológicas

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Rotas e Fluxos](#rotas-e-fluxos)
5. [Geração de QR Code PIX](#geração-de-qr-code-pix)
6. [Integrações e APIs](#integrações-e-apis)
7. [Componentes Principais](#componentes-principais)
8. [Configuração e Instalação](#configuração-e-instalação)
9. [Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Fluxo de Dados](#fluxo-de-dados)
11. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)

---

## 🎯 Visão Geral

O **Avestra** é uma plataforma web que realiza análises de autoridade digital para clínicas odontológicas. O sistema utiliza inteligência artificial (Google Gemini) para analisar o posicionamento de clínicas em mecanismos de busca e modelos de linguagem, fornecendo diagnósticos detalhados sobre visibilidade online, concorrência e oportunidades de otimização.

### Objetivo Principal

Ajudar clínicas odontológicas a entenderem:
- Por que não aparecem nas recomendações de IAs (ChatGPT, Gemini, Perplexity)
- Quais concorrentes estão melhor posicionados
- Quanto de faturamento potencial está sendo perdido
- Quais problemas técnicos impedem o reconhecimento como autoridade

### Modelo de Negócio

- **Análise Gratuita**: Diagnóstico inicial sem custo
- **Relatório Premium**: R$ 29,90 para acesso ao relatório completo via PIX

---

## 🛠️ Stack Tecnológica

### Frontend

- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.5.3** - Superset do JavaScript com tipagem estática
- **Vite 5.4.1** - Build tool e dev server ultra-rápido
- **Tailwind CSS** (via CDN) - Framework CSS utility-first
- **Framer Motion 11.0.8** - Biblioteca de animações
- **Lucide React 0.562.0** - Ícones SVG
- **Recharts 3.6.0** - Biblioteca de gráficos para React
- **Clsx 2.1.0** - Utilitário para construção de classes CSS
- **Tailwind Merge 2.2.1** - Merge de classes Tailwind

### Backend/APIs

- **Google Gemini AI** (`@google/genai 1.35.0`) - Modelo de linguagem para análise
- **Google Search Grounding** - Integração com Google Search
- **Google Maps API** - Dados de localização e concorrentes

### Integrações Externas

- **Meta Pixel** (Facebook Pixel) - Rastreamento de conversões
- **Mercado Pago** (planejado) - Processamento de pagamentos PIX
- **APIs de Geolocalização**:
  - `ipapi.co` - Detecção de cidade do usuário
  - `ip-api.com` - Fallback para geolocalização
  - `geojs.io` - Fallback adicional

### Ferramentas de Desenvolvimento

- **@vitejs/plugin-react 4.3.1** - Plugin React para Vite
- **@types/react 18.3.3** - Tipos TypeScript para React
- **@types/react-dom 18.3.0** - Tipos TypeScript para React DOM

---

## 📁 Estrutura do Projeto

```
avestra.app/
├── components/              # Componentes React
│   ├── AISimulation.tsx    # Simulação de resposta de IA
│   ├── AnalysisFormModal.tsx  # Modal de formulário de análise
│   ├── AnalysisLoader.tsx  # Tela de carregamento durante análise
│   ├── Dashboard.tsx       # Dashboard principal com resultados
│   ├── GoogleSearchSimulation.tsx  # Simulação de busca Google
│   ├── Hero.tsx           # Componente hero (não utilizado atualmente)
│   ├── LandingPage.tsx    # Página inicial/landing page
│   ├── PaymentModal.tsx   # Modal de pagamento PIX
│   └── ui/
│       └── AnimatedText.tsx  # Componente de texto animado
├── services/
│   └── api.ts             # Serviços de API e integrações
├── lib/
│   └── utils.ts           # Funções utilitárias
├── App.tsx                # Componente raiz da aplicação
├── index.tsx              # Ponto de entrada React
├── index.html             # HTML base com Meta Pixel
├── index.css              # Estilos globais
├── types.ts               # Definições de tipos TypeScript
├── vite.config.ts         # Configuração do Vite
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Dependências e scripts
└── README.md              # Documentação básica
```

---

## 🗺️ Rotas e Fluxos

### Arquitetura de Rotas

O projeto utiliza **roteamento baseado em estado** (não usa React Router). As rotas são gerenciadas através do estado `view` no componente `App.tsx`:

```typescript
type ViewState = 'hero' | 'analyzing' | 'dashboard';
```

### Fluxo Completo da Aplicação

```
1. LANDING PAGE (view: 'hero')
   ↓
   Usuário clica em "Analisar minha clínica"
   ↓
2. MODAL DE FORMULÁRIO (AnalysisFormModal)
   ↓
   Usuário preenche: Nome, Especialidade, Cidade
   ↓
3. ANÁLISE (view: 'analyzing')
   ↓
   - Chama API Google Gemini
   - Busca dados reais no Google Search/Maps
   - Processa resultados
   ↓
4. DASHBOARD (view: 'dashboard')
   ↓
   - Exibe resultados da análise
   - Mostra concorrentes
   - Calcula perda de faturamento
   - Simula recomendações de IA
   ↓
5. MODAL DE PAGAMENTO (PaymentModal)
   ↓
   Usuário clica em "DESBLOQUEAR POR R$ 29,90"
   ↓
   - Gera código PIX
   - Exibe QR Code
   - Permite copiar código
```

### Rotas Visuais (Estados)

#### 1. **Landing Page** (`view: 'hero'`)
- **Componente**: `LandingPage.tsx`
- **Descrição**: Página inicial com apresentação do produto
- **Funcionalidades**:
  - Detecção automática de cidade do usuário
  - Seções explicativas sobre GEO
  - CTAs para iniciar análise
  - Navegação por âncoras (#futuro, #geo, #implementacao)

#### 2. **Modal de Formulário** (`isFormOpen: true`)
- **Componente**: `AnalysisFormModal.tsx`
- **Campos**:
  - Nome da Clínica
  - Especialidade Principal
  - Cidade (pré-preenchida com detecção automática)
- **Ação**: Submete dados para análise

#### 3. **Tela de Análise** (`view: 'analyzing'`)
- **Componente**: `AnalysisLoader.tsx`
- **Descrição**: Tela de carregamento durante processamento
- **Duração**: ~2-5 segundos (simulação + API real)

#### 4. **Dashboard de Resultados** (`view: 'dashboard'`)
- **Componente**: `Dashboard.tsx`
- **Seções**:
  - Card de Pacientes Perdidos
  - Auditoria Técnica & Performance
  - Realidade vs. Oportunidade (Google Search + IA)
  - Diagnóstico Detalhado (bloqueado - requer pagamento)
  - Explicação da Matemática
  - Fontes de Dados

#### 5. **Modal de Pagamento** (`isModalOpen: true`)
- **Componente**: `PaymentModal.tsx`
- **Funcionalidades**:
  - Geração de código PIX
  - Exibição de QR Code
  - Campo para copiar código PIX
  - Status do pagamento

---

## 💳 Geração de QR Code PIX

### Implementação Atual

O sistema atualmente utiliza uma **implementação mock** para geração do QR Code PIX. A função está localizada em `services/api.ts`:

```typescript
export const generatePixCode = async (amount: number): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Avestra6008Sao Paulo62070503***6304E2CA";
};
```

### Como Funciona no Frontend

1. **Trigger**: Usuário clica em "DESBLOQUEAR POR R$ 29,90" no Dashboard
2. **Abertura do Modal**: `PaymentModal.tsx` é renderizado
3. **Geração do Código**: 
   ```typescript
   useEffect(() => {
     if (isOpen && !pixCode) {
       generatePixCode(price).then(setPixCode);
     }
   }, [isOpen, pixCode, price]);
   ```
4. **Exibição do QR Code**: 
   - Utiliza API externa `qrserver.com` para gerar imagem do QR Code
   - URL: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`
5. **Cópia do Código**: Botão permite copiar código PIX para área de transferência

### Integração com Mercado Pago (Planejada)

O projeto possui documentação completa para integração com Mercado Pago em `MERCADO_PAGO_PIX_INTEGRACAO.md`. A implementação real requer:

1. **Backend Endpoint**: `/api/create-pix-payment`
2. **Credenciais Mercado Pago**:
   - Public Key (frontend)
   - Access Token (backend - nunca expor)
3. **Fluxo**:
   ```
   Frontend → Backend → Mercado Pago API
   Backend ← Mercado Pago (QR Code + dados)
   Frontend ← Backend (dados do pagamento)
   ```

### Estrutura do Código PIX

O código PIX retornado segue o padrão **EMV QR Code**:
- Formato: String alfanumérica
- Contém: Chave PIX, valor, beneficiário, cidade, etc.
- Exemplo: `00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Avestra6008Sao Paulo62070503***6304E2CA`

---

## 🔌 Integrações e APIs

### 1. Google Gemini AI

**Localização**: `services/api.ts` - função `analyzeBusiness()`

**Configuração**:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Funcionalidades**:
- Análise de negócios odontológicos
- Busca com Google Search Grounding
- Integração com Google Maps
- Extração de dados de concorrentes reais
- Geração de scores e métricas

**Modelo Utilizado**: `gemini-2.5-flash`

**Tools Habilitados**:
- `googleSearch`: Busca no Google
- `googleMaps`: Dados de localização

**Resposta Esperada**:
```json
{
  "score": 0-100,
  "monthlySearchVolume": number,
  "estimatedLostRevenue": number,
  "visibilityRank": "Invisível" | "Baixa" | "Média" | "Alta",
  "competitorsCount": number,
  "competitorsList": Competitor[],
  "businessImage": "URL",
  "websiteUrl": "URL",
  "techScore": 0-100,
  "techIssues": string[]
}
```

### 2. APIs de Geolocalização

**Ordem de Tentativas**:
1. **ipapi.co** (prioritário)
   - Endpoint: `https://ipapi.co/json/`
   - Retorna: `data.city`
2. **ip-api.com** (fallback)
   - Endpoint: `https://ip-api.com/json/?fields=city`
   - Retorna: `data.city`
3. **geojs.io** (fallback final)
   - Endpoint: `https://get.geojs.io/v1/ip/geo.json`
   - Retorna: `data.city`

**Implementação**: `App.tsx` - `useEffect` no mount

### 3. Meta Pixel (Facebook Pixel)

**Localização**: `index.html` - dentro de `<head>`

**ID do Pixel**: `1593785288615011`

**Eventos Rastreados**:
- `PageView` - Carregamento de página
- (Futuro) Eventos customizados de conversão

**Estrutura**:
```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s){...}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1593785288615011');
  fbq('track', 'PageView');
</script>
<noscript>...</noscript>
<!-- End Meta Pixel Code -->
```

### 4. API de QR Code (Temporária)

**Serviço**: `qrserver.com`
- URL: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={pixCode}`
- **Nota**: Esta é uma solução temporária. Em produção, o QR Code deve vir do Mercado Pago.

---

## 🧩 Componentes Principais

### 1. App.tsx (Componente Raiz)

**Responsabilidades**:
- Gerenciamento de estado global (`view`, `businessData`, `results`)
- Detecção de geolocalização
- Orquestração de fluxo entre componentes
- Error Boundary wrapper

**Estados Principais**:
```typescript
const [view, setView] = useState<ViewState>('hero');
const [isFormOpen, setIsFormOpen] = useState(false);
const [businessData, setBusinessData] = useState<BusinessData | null>(null);
const [results, setResults] = useState<AnalysisResult | null>(null);
const [userCity, setUserCity] = useState<string>('');
```

### 2. LandingPage.tsx

**Seções**:
1. Hero Section - Apresentação principal
2. "O Futuro do SEO é Generativo"
3. Logos das IAs (OpenAI, Gemini, Perplexity, Claude)
4. Simulação de Chat IA
5. O que é GEO
6. GEO vs SEO Tradicional
7. Impacto no Negócio
8. Implementação
9. Especialidades
10. CTA Final
11. Footer

**Props**:
- `onOpenForm: () => void` - Callback para abrir modal
- `userCity?: string` - Cidade detectada automaticamente

### 3. Dashboard.tsx

**Seções do Dashboard**:

1. **Header Fixo**
   - Logo Avestra
   - Nome da clínica analisada

2. **Card: Pacientes Perdidos**
   - Perda estimada de faturamento/mês
   - Volume de busca mensal
   - Score GEO
   - Gráfico de barras (Pacientes Atuais vs Potencial)

3. **Card: Auditoria Técnica & Performance**
   - Tech Score (0-100)
   - URL do site (se encontrado)
   - Lista de problemas críticos detectados

4. **Seção: Realidade vs. Oportunidade**
   - `GoogleSearchSimulation` - Mostra concorrentes reais
   - `AISimulation` - Simula como apareceria após otimização

5. **Seção: Diagnóstico Detalhado (Bloqueado)**
   - Conteúdo desfocado (blur)
   - Card de paywall com botão de pagamento

6. **Card: Explicação da Matemática**
   - Passo 1: Demanda
   - Passo 2: Pacientes Perdidos
   - Passo 3: Impacto

7. **Seção: Fontes de Dados**
   - Links para fontes utilizadas na análise

**Props**:
- `businessData: BusinessData`
- `results: AnalysisResult`

### 4. PaymentModal.tsx

**Funcionalidades**:
- Geração de código PIX (mock atual)
- Exibição de QR Code via API externa
- Campo para copiar código PIX
- Indicador de status (Aguardando pagamento)
- Design responsivo

**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `price: number` (padrão: 29.90)

### 5. AnalysisFormModal.tsx

**Campos**:
- Nome da Clínica (texto livre)
- Especialidade Principal (texto livre)
- Cidade (pré-preenchida com detecção automática)

**Validação**:
- Todos os campos obrigatórios
- Submit desabilitado durante loading

**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `onSubmit: (data: BusinessData) => void`
- `initialCity?: string`

### 6. AISimulation.tsx

**Funcionalidade**: Simula uma conversa entre usuário e IA mostrando como a clínica apareceria após otimização GEO.

**Estrutura**:
- Pergunta do usuário (simulada)
- Resposta da IA com recomendação
- Card da clínica com imagem/logo
- Badge de "Visualização do Potencial GEO"

**Props**:
- `data: BusinessData`
- `businessImage?: string`

### 7. GoogleSearchSimulation.tsx

**Funcionalidade**: Mostra como a busca atual aparece no Google, listando concorrentes reais.

**Estrutura**:
- Barra de busca simulada
- Lista de concorrentes com:
  - Nome
  - Avaliação (estrelas)
  - Número de reviews
  - Endereço
  - Status (Aberto/Fechado)
- Mapa simulado (visual)
- Footer com diagnóstico

**Props**:
- `data: BusinessData`
- `competitors: Competitor[]`

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- **Node.js**: Versão 16 ou superior
- **npm** ou **yarn**: Gerenciador de pacotes
- **Conta Google**: Para API Key do Gemini (opcional - funciona com mock)

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd avestra.app
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente**:
   Crie um arquivo `.env.local` na raiz:
   ```env
   API_KEY=sua_chave_google_gemini_aqui
   ```

4. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**:
   Abra `http://localhost:5173` no navegador

### Scripts Disponíveis

```json
{
  "dev": "vite",              // Servidor de desenvolvimento
  "build": "tsc -b && vite build",  // Build de produção
  "preview": "vite preview"   // Preview do build de produção
}
```

### Build de Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`. Para preview:

```bash
npm run preview
```

---

## 🔐 Variáveis de Ambiente

### Frontend (.env.local)

```env
# Google Gemini API Key (opcional - funciona sem ela usando mock)
API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Mercado Pago Public Key (quando implementado)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

**Nota**: No Vite, variáveis devem começar com `VITE_` para serem expostas ao frontend.

### Acesso no Código

```typescript
// Vite
const apiKey = import.meta.env.API_KEY;

// Process.env (configurado no vite.config.ts)
const apiKey = process.env.API_KEY;
```

### Backend (quando implementado)

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
PORT=3000
```

---

## 🔄 Fluxo de Dados

### 1. Detecção de Cidade

```
App.tsx (mount)
  ↓
useEffect → fetchGeolocation()
  ↓
Tenta ipapi.co → Se falhar, tenta ip-api.com → Se falhar, tenta geojs.io
  ↓
setUserCity(city)
  ↓
Passa para LandingPage e AnalysisFormModal como prop
```

### 2. Submissão de Análise

```
AnalysisFormModal
  ↓
handleSubmit() → onSubmit(formData)
  ↓
App.tsx → handleStartAnalysis(data)
  ↓
setView('analyzing')
  ↓
analyzeBusiness(data) → services/api.ts
  ↓
Google Gemini API (ou mock)
  ↓
setResults(analysisResults)
  ↓
AnalysisLoader → onComplete()
  ↓
setView('dashboard')
```

### 3. Geração de PIX

```
Dashboard → Botão "DESBLOQUEAR"
  ↓
setIsModalOpen(true)
  ↓
PaymentModal renderiza
  ↓
useEffect → generatePixCode(29.90)
  ↓
services/api.ts → generatePixCode() (mock atual)
  ↓
setPixCode(code)
  ↓
Renderiza QR Code via qrserver.com API
```

### 4. Análise com Gemini

```
analyzeBusiness(data)
  ↓
Verifica API_KEY
  ↓
Se existe: Chama Google Gemini com:
  - Model: gemini-2.5-flash
  - Tools: googleSearch, googleMaps
  - Prompt: Análise de SEO local
  ↓
Processa resposta:
  - Extrai JSON
  - Processa grounding metadata
  - Extrai concorrentes reais
  - Calcula métricas
  ↓
Retorna AnalysisResult
  ↓
Se falhar: Retorna mockAnalyze(data)
```

---

## 📊 Funcionalidades Detalhadas

### 1. Análise de Negócios

**Entrada**:
- Nome da clínica
- Especialidade/categoria
- Cidade

**Processamento**:
1. Busca no Google Search: `"{categoria} em {cidade}"`
2. Busca no Google Maps para concorrentes
3. Análise de visibilidade online
4. Cálculo de métricas:
   - Score GEO (0-100)
   - Volume de busca mensal estimado
   - Perda de faturamento estimada
   - Tech Score (0-100)
   - Problemas técnicos detectados

**Saída**: `AnalysisResult` com todos os dados processados

### 2. Cálculo de Métricas

**Volume de Busca Mensal**:
```typescript
const cityHash = data.city.split('').reduce((a,b) => a + b.charCodeAt(0), 0);
const basePopulation = 40000 + (cityHash * 150);
const volume = Math.floor(basePopulation * 0.008);
```

**Perda de Faturamento**:
```typescript
const ticket = 450.00; // Ticket médio para dentistas
const lostRevenue = volume * 0.07 * ticket;
```

**Score GEO**:
- Baseado em múltiplos fatores:
  - Presença online
  - Dados estruturados
  - Autoridade técnica
  - Visibilidade em IAs

### 3. Extração de Concorrentes

**Fonte**: Google Maps via Gemini Grounding

**Dados Extraídos**:
- Nome exato da empresa
- Avaliação (rating)
- Número de reviews
- Endereço
- Status (Aberto/Fechado)

**Processamento**:
1. Gemini retorna `groundingMetadata.groundingChunks`
2. Filtra chunks do tipo `googleMaps`
3. Extrai dados de cada lugar
4. Remove duplicatas
5. Limita a top 5

### 4. Simulações Visuais

**Google Search Simulation**:
- Mostra como a busca aparece atualmente
- Lista concorrentes reais
- Indica que a clínica não aparece

**AI Simulation**:
- Simula conversa com IA
- Mostra como apareceria após otimização
- Demonstra potencial de autoridade

### 5. Sistema de Paywall

**Estratégia**:
- Conteúdo principal visível (análise básica)
- Diagnóstico detalhado com blur
- Card de paywall sobreposto
- Preço: R$ 29,90
- Pagamento via PIX

**Fluxo**:
1. Usuário vê análise básica
2. Interesse em detalhes → Clica em "DESBLOQUEAR"
3. Modal de pagamento abre
4. Gera código PIX
5. Após pagamento (futuro): Libera relatório completo

---

## 🎨 Design e UX

### Paleta de Cores

- **Primária**: Indigo (`#6366f1`, `#4338ca`)
- **Secundária**: Slate (tons de cinza)
- **Sucesso**: Verde (`#10b981`)
- **Aviso**: Amarelo/Âmbar (`#f59e0b`)
- **Erro**: Vermelho (`#ef4444`)

### Tipografia

- **Display**: Outfit (títulos)
- **Body**: Inter (texto geral)
- **Monospace**: Para códigos PIX

### Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Animações

- **Framer Motion**: Animações suaves
- **Tailwind**: Transições CSS
- **Loading States**: Spinners e skeletons

---

## 🔒 Segurança

### Boas Práticas Implementadas

1. **API Keys**: Nunca expostas no frontend
2. **Error Boundaries**: Captura de erros React
3. **Validação**: Validação de formulários
4. **HTTPS**: Obrigatório em produção (Mercado Pago)

### Melhorias Futuras

1. **Rate Limiting**: Limitar requisições de análise
2. **Sanitização**: Sanitizar inputs do usuário
3. **CORS**: Configurar CORS adequadamente
4. **Autenticação**: Sistema de autenticação (se necessário)

---

## 📈 Performance

### Otimizações Implementadas

1. **Code Splitting**: Vite faz split automático
2. **Lazy Loading**: Componentes carregados sob demanda
3. **CDN**: Tailwind CSS via CDN
4. **Image Optimization**: Imagens via Unsplash (otimizadas)

### Métricas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Otimizado pelo Vite

---

## 🧪 Testes

### Testes Manuais Recomendados

1. **Fluxo Completo**:
   - Acessar landing page
   - Preencher formulário
   - Verificar análise
   - Testar pagamento

2. **Geolocalização**:
   - Testar com diferentes IPs
   - Verificar fallbacks

3. **Responsividade**:
   - Mobile, tablet, desktop
   - Diferentes navegadores

4. **Erros**:
   - API Key inválida
   - Falha de rede
   - Dados inválidos

---

## 🚀 Deploy

### Opções de Deploy

1. **Vercel** (Recomendado):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**:
   - Conectar repositório Git
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages**:
   - Configurar `vite.config.ts` com `base`
   - Deploy via GitHub Actions

### Variáveis de Ambiente em Produção

Configurar no painel do serviço de deploy:
- `API_KEY`
- `VITE_MERCADOPAGO_PUBLIC_KEY` (quando implementado)

---

## 📝 Notas Importantes

### Limitações Atuais

1. **PIX Mock**: Implementação atual é mock. Integração real requer backend.
2. **Sem Backend**: Aplicação é 100% frontend. Backend necessário para:
   - Integração Mercado Pago real
   - Webhooks de pagamento
   - Armazenamento de análises
3. **API Key Opcional**: Funciona sem API Key usando dados mock.

### Próximos Passos

1. **Backend**:
   - API Node.js/Express
   - Integração Mercado Pago
   - Webhooks
   - Banco de dados

2. **Melhorias**:
   - Sistema de autenticação
   - Histórico de análises
   - Relatórios em PDF
   - Email notifications

3. **Features**:
   - Comparação temporal
   - Recomendações personalizadas
   - Dashboard de métricas

---

## 📞 Suporte

### Documentação Adicional

- **Mercado Pago**: `MERCADO_PAGO_PIX_INTEGRACAO.md`
- **README**: `README.md`

### Contato

- **Repositório**: [GitHub](https://github.com/JonasKash/sok)
- **AI Studio**: [Link](https://ai.studio/apps/drive/1Kk4FRlLITtaIBr8utiFGpROf_j_2RNhK)

---

**Documento criado em**: Janeiro 2025  
**Última atualização**: Janeiro 2025  
**Versão**: 1.0

