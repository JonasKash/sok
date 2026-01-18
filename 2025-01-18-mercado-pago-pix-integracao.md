# Integração Mercado Pago PIX - Plano de Implementação

## Overview

Implementar checkout transparente do Mercado Pago com PIX, onde ao clicar no botão "Ver relatório por R$ 29" no Dashboard, um modal JavaScript é aberto e gera um novo pagamento PIX em tempo real usando a API do Mercado Pago. O modal exibe o QR Code e código PIX para o usuário pagar.

## Current State Analysis

### O que existe atualmente:

1. **Frontend React + TypeScript + Vite** (`components/PaymentModal.tsx:1-97`)
   - Modal já implementado e integrado no Dashboard
   - Botão "DESBLOQUEAR POR R$ 29,90" já abre o modal (`components/Dashboard.tsx:234`)
   - Função mock `generatePixCode` em `services/api.ts:244-247` que retorna código estático
   - Modal exibe QR Code usando serviço externo (qrserver.com) com código mock

2. **Estrutura do Projeto:**
   - Frontend-only (sem backend separado)
   - Variáveis de ambiente configuradas via Vite (`vite.config.ts:10`)
   - API calls feitas diretamente do frontend (ex: `App.tsx:22` para geolocalização)

3. **Dependências Atuais:**
   - React 18.3.1
   - TypeScript 5.5.3
   - Vite 5.4.1
   - Lucide React para ícones
   - Tailwind CSS via CDN

### O que está faltando:

1. **Backend para integração com Mercado Pago:**
   - Não há servidor backend para criar pagamentos PIX
   - Access Token do Mercado Pago não pode ser exposto no frontend
   - Necessário criar endpoint `/api/create-pix-payment`

2. **Integração Real:**
   - Função `generatePixCode` é mock
   - Não há chamada real à API do Mercado Pago
   - QR Code exibido é gerado a partir de código mock

3. **Configuração:**
   - Variáveis de ambiente para credenciais do Mercado Pago
   - SDK do Mercado Pago não instalado

### Key Discoveries:

- **Arquitetura Frontend-Only**: O projeto atual não tem backend, então precisamos criar um servidor backend simples ou usar uma solução serverless
- **PaymentModal já funcional**: O modal já está bem estruturado e só precisa ser atualizado para chamar o backend real
- **Função mock existente**: `generatePixCode` em `services/api.ts:244` pode ser substituída ou mantida como fallback
- **Vite config**: Já suporta variáveis de ambiente, precisamos adicionar as do Mercado Pago

## Desired End State

Após a implementação completa:

1. **Backend funcionando:**
   - Servidor Node.js/Express rodando (ou função serverless)
   - Endpoint `/api/create-pix-payment` criando pagamentos PIX reais via Mercado Pago
   - Access Token seguro no backend (nunca exposto no frontend)

2. **Frontend atualizado:**
   - `PaymentModal` chama o backend real ao invés da função mock
   - QR Code e código PIX reais exibidos no modal
   - Estados de loading e erro implementados
   - Tratamento adequado de erros da API

3. **Configuração completa:**
   - Variáveis de ambiente configuradas (sandbox e produção)
   - SDK do Mercado Pago instalado
   - Credenciais seguras (não commitadas)

4. **Verificação:**
   - Ao clicar em "DESBLOQUEAR POR R$ 29,90", modal abre
   - Backend cria pagamento PIX real no Mercado Pago
   - QR Code real é exibido no modal
   - Código PIX pode ser copiado
   - Status do pagamento pode ser verificado

## What We're NOT Doing

- **Não vamos implementar webhooks** nesta fase inicial (pode ser adicionado depois)
- **Não vamos criar banco de dados** para armazenar pagamentos (fase inicial)
- **Não vamos implementar Status Screen Brick** do Mercado Pago (pode ser adicionado depois)
- **Não vamos adicionar outros métodos de pagamento** além de PIX
- **Não vamos implementar sistema de autenticação** para usuários
- **Não vamos criar dashboard de pagamentos** ou relatórios

## Implementation Approach

**Estratégia:** Criar um backend simples com Express.js que será executado separadamente do frontend. O frontend fará chamadas HTTP para o backend. Esta abordagem mantém a segurança (Access Token no backend) e permite fácil deploy.

**Alternativas consideradas:**
1. **Serverless Functions (Vercel/Netlify)**: Mais simples para deploy, mas requer configuração específica
2. **Backend Express separado**: Mais controle, fácil de testar localmente
3. **Proxy no Vite**: Possível mas não recomendado para produção

**Decisão:** Backend Express separado por simplicidade e controle total.

## Phase 1: Setup e Configuração Inicial

### Overview

Configurar ambiente de desenvolvimento, instalar dependências necessárias e criar estrutura básica do backend.

### Changes Required:

#### 1. Instalar Dependências do Backend

**File**: `package.json`

**Changes**: Adicionar dependências do backend e scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "dev:backend": "cd backend && npm run dev",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\""
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "concurrently": "^8.2.2"
  }
}
```

**Ações:**
1. Criar diretório `backend/` na raiz do projeto
2. Inicializar `package.json` no backend com:
   - `express`
   - `@mercadopago/sdk-node` ou `mercadopago`
   - `uuid` (para X-Idempotency-Key)
   - `cors` (para permitir chamadas do frontend)
   - `dotenv` (para variáveis de ambiente)
   - `@types/express`, `@types/uuid`, `@types/cors` (devDependencies)
   - `typescript`, `ts-node`, `nodemon` (devDependencies)

#### 2. Criar Estrutura do Backend

**File**: `backend/package.json` (novo arquivo)

**Changes**: Criar package.json do backend

```json
{
  "name": "avestra-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node --esm src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@mercadopago/sdk-node": "^2.0.0",
    "uuid": "^9.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/uuid": "^9.0.6",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.6",
    "typescript": "^5.5.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

**File**: `backend/tsconfig.json` (novo arquivo)

**Changes**: Configuração TypeScript para o backend

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**File**: `backend/.env.example` (novo arquivo)

**Changes**: Template de variáveis de ambiente

```env
# Mercado Pago Credentials
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

**File**: `backend/.gitignore` (novo arquivo)

**Changes**: Ignorar arquivos sensíveis

```
node_modules/
dist/
.env
*.log
.DS_Store
```

#### 3. Configurar Variáveis de Ambiente do Frontend

**File**: `.env.local` (novo arquivo - não commitar)

**Changes**: Variáveis de ambiente do frontend

```env
# Backend API URL
VITE_API_URL=http://localhost:3001

# Mercado Pago Public Key (opcional, se necessário no frontend)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

**File**: `vite.config.ts`

**Changes**: Adicionar proxy para desenvolvimento (opcional) e configurar variáveis de ambiente

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
```

### Success Criteria:

#### Automated Verification:

- [ ] Backend `package.json` criado com todas as dependências listadas
- [ ] Comando `npm install` no backend executa sem erros
- [ ] TypeScript compila sem erros: `cd backend && npm run build`
- [ ] Arquivo `.env.example` existe no backend
- [ ] `.gitignore` do backend inclui `.env`
- [ ] Frontend `.env.local` existe (não commitado)

#### Manual Verification:

- [ ] Estrutura de diretórios `backend/` criada corretamente
- [ ] Variáveis de ambiente documentadas no `.env.example`
- [ ] README atualizado com instruções de setup

**Implementation Note**: Após completar esta fase, pausar para confirmação manual antes de prosseguir.

---

## Phase 2: Implementar Backend - Endpoint de Criação de Pagamento PIX

### Overview

Criar servidor Express com endpoint que recebe requisições do frontend e cria pagamentos PIX reais via API do Mercado Pago.

### Changes Required:

#### 1. Criar Servidor Express Básico

**File**: `backend/src/server.ts` (novo arquivo)

**Changes**: Servidor Express com CORS e endpoint básico

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', paymentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
});
```

#### 2. Criar Rota de Pagamento PIX

**File**: `backend/src/routes/payment.ts` (novo arquivo)

**Changes**: Endpoint para criar pagamento PIX

```typescript
import express from 'express';
import { MercadoPagoConfig, Payment } from '@mercadopago/sdk-node';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configurar cliente do Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.error('⚠️  MERCADOPAGO_ACCESS_TOKEN não configurado!');
}

const client = new MercadoPagoConfig({
  accessToken: accessToken!,
  options: {
    timeout: 5000,
  },
});

const payment = new Payment(client);

interface CreatePixPaymentRequest {
  transaction_amount: number;
  description?: string;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

router.post('/create-pix-payment', async (req, res) => {
  try {
    const { transaction_amount, description, payer }: CreatePixPaymentRequest = req.body;

    // Validações
    if (!transaction_amount || transaction_amount <= 0) {
      return res.status(400).json({
        error: 'transaction_amount é obrigatório e deve ser maior que zero',
      });
    }

    if (!payer?.email) {
      return res.status(400).json({
        error: 'payer.email é obrigatório',
      });
    }

    if (!accessToken) {
      return res.status(500).json({
        error: 'Configuração do servidor incompleta. Access Token não configurado.',
      });
    }

    // Preparar dados do pagamento
    const paymentData = {
      transaction_amount: parseFloat(transaction_amount.toString()),
      description: description || 'Relatório de Autoridade Digital',
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
        first_name: payer.first_name || '',
        last_name: payer.last_name || '',
        identification: payer.identification || undefined,
      },
    };

    // Criar pagamento com X-Idempotency-Key
    const idempotencyKey = uuidv4();
    
    console.log('📝 Criando pagamento PIX:', {
      amount: paymentData.transaction_amount,
      email: payer.email,
      idempotencyKey,
    });

    const response = await payment.create(
      { body: paymentData },
      { idempotencyKey }
    );

    // Extrair dados relevantes da resposta
    const pixData = {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      point_of_interaction: {
        transaction_data: {
          qr_code: response.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
          ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
        },
      },
      date_created: response.date_created,
      date_of_expiration: response.date_of_expiration,
    };

    console.log('✅ Pagamento PIX criado com sucesso:', {
      id: pixData.id,
      status: pixData.status,
    });

    res.json(pixData);
  } catch (error: any) {
    console.error('❌ Erro ao criar pagamento PIX:', error);

    // Tratar erros específicos do Mercado Pago
    if (error.cause && Array.isArray(error.cause)) {
      const firstError = error.cause[0];
      return res.status(firstError?.status || 500).json({
        error: error.message || 'Erro ao criar pagamento',
        details: firstError,
      });
    }

    // Erro genérico
    res.status(500).json({
      error: 'Erro ao processar pagamento',
      message: error.message || 'Erro desconhecido',
    });
  }
});

// Endpoint para verificar status do pagamento (opcional, para polling)
router.get('/payment-status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!accessToken) {
      return res.status(500).json({
        error: 'Configuração do servidor incompleta',
      });
    }

    const response = await payment.get({ id: paymentId });

    res.json({
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
    });
  } catch (error: any) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      error: 'Erro ao verificar status do pagamento',
      message: error.message,
    });
  }
});

export default router;
```

#### 3. Criar Função Helper para API (Frontend)

**File**: `services/api.ts`

**Changes**: Adicionar função para criar pagamento PIX via backend

```typescript
// ... código existente ...

export interface PixPaymentData {
  id: number;
  status: string;
  status_detail: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  date_created?: string;
  date_of_expiration?: string;
}

export interface CreatePixPaymentRequest {
  transaction_amount: number;
  description?: string;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

/**
 * Cria um pagamento PIX via backend Mercado Pago
 */
export const createPixPayment = async (
  data: CreatePixPaymentRequest
): Promise<PixPaymentData> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  const response = await fetch(`${apiUrl}/api/create-pix-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar pagamento PIX');
  }

  return response.json();
};

// Manter função mock como fallback (opcional)
export const generatePixCode = async (amount: number): Promise<string> => {
  // Esta função pode ser removida ou mantida como fallback
  // Por enquanto, vamos tentar usar a API real primeiro
  try {
    const payment = await createPixPayment({
      transaction_amount: amount,
      description: 'Relatório de Autoridade Digital',
      payer: {
        email: 'cliente@exemplo.com', // Será substituído pelo email real do usuário
      },
    });
    return payment.point_of_interaction.transaction_data.qr_code;
  } catch (error) {
    console.error('Erro ao criar PIX real, usando mock:', error);
    // Fallback para mock
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Avestra6008Sao Paulo62070503***6304E2CA";
  }
};
```

### Success Criteria:

#### Automated Verification:

- [ ] Backend inicia sem erros: `cd backend && npm run dev`
- [ ] Endpoint `/health` retorna 200: `curl http://localhost:3001/health`
- [ ] TypeScript compila sem erros: `cd backend && npm run build`
- [ ] Linting passa (se configurado)
- [ ] Teste unitário básico do endpoint (se implementado)

#### Manual Verification:

- [ ] Servidor backend responde na porta 3001
- [ ] Endpoint `/api/create-pix-payment` existe
- [ ] CORS configurado corretamente (permite chamadas do frontend)
- [ ] Logs aparecem no console ao criar pagamento
- [ ] Erros são tratados adequadamente

**Implementation Note**: Após completar esta fase, testar manualmente criando um pagamento PIX de teste antes de prosseguir.

---

## Phase 3: Atualizar PaymentModal para Usar Backend Real

### Overview

Atualizar o componente `PaymentModal` para chamar o backend real ao invés da função mock, exibir estados de loading/erro e mostrar QR Code real.

### Changes Required:

#### 1. Atualizar PaymentModal

**File**: `components/PaymentModal.tsx`

**Changes**: Substituir implementação mock por chamada real ao backend

```typescript
import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import { createPixPayment, PixPaymentData } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, price }) => {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPixData(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Gerar novo PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && !pixData && !loading) {
      createPixPaymentHandler();
    }
  }, [isOpen]);

  const createPixPaymentHandler = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Obter email do usuário (pode ser de um formulário ou contexto)
      // Por enquanto, usando email placeholder
      const userEmail = 'cliente@exemplo.com'; // Substituir por email real

      const data = await createPixPayment({
        transaction_amount: price,
        description: 'Relatório de Autoridade Digital',
        payer: {
          email: userEmail,
        },
      });

      setPixData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar pagamento PIX';
      setError(errorMessage);
      console.error('Erro ao criar pagamento PIX:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.point_of_interaction?.transaction_data?.qr_code) {
      navigator.clipboard.writeText(
        pixData.point_of_interaction.transaction_data.qr_code
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-green-600" size={32} />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Relatório de Autoridade Digital
          </h3>
          <p className="text-slate-600 mb-6 text-sm">
            Escaneie o QR Code para receber o diagnóstico completo de porque sua clínica não está sendo recomendada pelas IAs.
          </p>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
              <p className="text-slate-600">Gerando código PIX...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm mb-2">{error}</p>
              <button
                onClick={createPixPaymentHandler}
                className="text-red-600 hover:text-red-700 text-sm font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Success State - QR Code */}
          {pixData && !loading && !error && (
            <>
              <div className="mb-6 bg-white p-4 border border-slate-200 rounded-xl inline-block shadow-sm">
                {pixData.point_of_interaction?.transaction_data?.qr_code_base64 ? (
                  <img 
                    src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                    alt="Pix QR Code" 
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded">
                    <p className="text-slate-400 text-xs">QR Code não disponível</p>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-6">
                R$ {price.toFixed(2).replace('.', ',')}
              </div>

              <div className="relative mb-4">
                <input 
                  readOnly 
                  value={pixData.point_of_interaction?.transaction_data?.qr_code || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-500 pr-12 font-mono truncate"
                  title={pixData.point_of_interaction?.transaction_data?.qr_code || ''}
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white rounded-md transition-colors text-indigo-600"
                  title="Copiar código PIX"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {pixData.point_of_interaction?.transaction_data?.ticket_url && (
                <a
                  href={pixData.point_of_interaction.transaction_data.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 underline mb-4 block"
                >
                  Ver instruções de pagamento
                </a>
              )}
              
              <p className="mt-4 text-xs text-slate-400">
                Liberação imediata do PDF após confirmação.
              </p>

              <div className="mt-4 text-xs text-slate-500">
                Status: <span className="font-semibold text-amber-600">
                  {pixData.status === 'pending' ? 'Aguardando pagamento' : pixData.status}
                </span>
              </div>
            </>
          )}
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <span className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ambiente Seguro - Processamento Instantâneo
          </span>
        </div>
      </div>
    </div>
  );
};
```

#### 2. Atualizar Tipos (se necessário)

**File**: `types.ts`

**Changes**: Adicionar tipos relacionados a pagamento (se não estiverem em `services/api.ts`)

```typescript
// ... tipos existentes ...

// Tipos de pagamento podem ser adicionados aqui ou mantidos em services/api.ts
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compila sem erros: `npm run build`
- [ ] Linting passa (se configurado)
- [ ] Componente `PaymentModal` importa corretamente de `services/api`
- [ ] Não há erros de tipo TypeScript

#### Manual Verification:

- [ ] Modal abre ao clicar em "DESBLOQUEAR POR R$ 29,90"
- [ ] Estado de loading aparece ao gerar PIX
- [ ] QR Code real é exibido (não mais mock)
- [ ] Código PIX pode ser copiado
- [ ] Erros são exibidos adequadamente se houver falha
- [ ] Botão "Tentar novamente" funciona
- [ ] QR Code é válido (pode ser escaneado)

**Implementation Note**: Após completar esta fase, testar o fluxo completo manualmente: abrir modal, gerar PIX, copiar código, verificar QR Code.

---

## Phase 4: Configuração de Credenciais e Testes

### Overview

Configurar credenciais do Mercado Pago (sandbox e produção), testar integração completa e documentar processo.

### Changes Required:

#### 1. Criar Documentação de Setup

**File**: `backend/README.md` (novo arquivo)

**Changes**: Documentar como configurar e rodar o backend

```markdown
# Backend - Integração Mercado Pago PIX

## Setup

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env e adicionar suas credenciais do Mercado Pago
```

3. Rodar em desenvolvimento:
```bash
npm run dev
```

4. Rodar em produção:
```bash
npm run build
npm start
```

## Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Obtenha o Access Token (credenciais de produção ou teste)
4. Adicione no arquivo `.env`:

```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

## Testes

Use as credenciais de **teste** durante o desenvolvimento.

Para testar pagamentos PIX:
1. Use valores pequenos (ex: R$ 0,01)
2. Verifique no painel do Mercado Pago se o pagamento foi criado
3. Use o QR Code gerado para testar (em ambiente de teste)
```

#### 2. Atualizar README Principal

**File**: `README.md`

**Changes**: Adicionar instruções sobre backend e integração Mercado Pago

```markdown
# ... conteúdo existente ...

## Integração Mercado Pago PIX

Este projeto inclui integração com Mercado Pago para pagamentos via PIX.

### Setup Completo

1. **Frontend:**
```bash
npm install
cp .env.local.example .env.local
# Editar .env.local com VITE_API_URL
npm run dev
```

2. **Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com MERCADOPAGO_ACCESS_TOKEN
npm run dev
```

3. **Rodar ambos simultaneamente:**
```bash
npm run dev:all
```

### Credenciais

- Obtenha credenciais em: https://www.mercadopago.com.br/developers
- Use credenciais de **teste** durante desenvolvimento
- Configure `MERCADOPAGO_ACCESS_TOKEN` no backend `.env`
- Configure `VITE_API_URL` no frontend `.env.local`
```

#### 3. Adicionar Scripts Úteis

**File**: `package.json` (raiz)

**Changes**: Adicionar scripts para rodar frontend e backend juntos

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "dev:backend": "cd backend && npm run dev",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\" --names \"frontend,backend\" --prefix-colors \"blue,green\""
  },
  "devDependencies": {
    // ... existentes ...
    "concurrently": "^8.2.2"
  }
}
```

### Success Criteria:

#### Automated Verification:

- [ ] Backend inicia com credenciais de teste
- [ ] Frontend conecta ao backend corretamente
- [ ] Endpoint `/api/create-pix-payment` retorna dados válidos
- [ ] QR Code gerado é válido (formato correto)

#### Manual Verification:

- [ ] Credenciais de teste configuradas no `.env`
- [ ] Pagamento PIX de teste criado com sucesso
- [ ] QR Code pode ser escaneado (em ambiente de teste)
- [ ] Documentação está completa e clara
- [ ] Fluxo completo funciona: clicar botão → abrir modal → gerar PIX → exibir QR Code

**Implementation Note**: Após completar esta fase, fazer um teste completo end-to-end antes de considerar a implementação concluída.

---

## Testing Strategy

### Unit Tests:

- **Backend:**
  - Testar validação de dados no endpoint `/api/create-pix-payment`
  - Testar tratamento de erros
  - Testar geração de X-Idempotency-Key

- **Frontend:**
  - Testar estados do `PaymentModal` (loading, error, success)
  - Testar função `copyToClipboard`
  - Testar reset de estado ao fechar modal

### Integration Tests:

- **End-to-end:**
  - Testar fluxo completo: Dashboard → Botão → Modal → Backend → Mercado Pago → QR Code
  - Testar com credenciais de teste do Mercado Pago
  - Testar tratamento de erros (token inválido, valor inválido, etc.)

### Manual Testing Steps:

1. **Setup:**
   - [ ] Configurar credenciais de teste no backend
   - [ ] Iniciar backend: `cd backend && npm run dev`
   - [ ] Iniciar frontend: `npm run dev`
   - [ ] Verificar que ambos estão rodando

2. **Teste Básico:**
   - [ ] Acessar aplicação no navegador
   - [ ] Preencher formulário de análise
   - [ ] Aguardar análise completar
   - [ ] Clicar em "DESBLOQUEAR POR R$ 29,90"
   - [ ] Verificar que modal abre
   - [ ] Verificar que loading aparece
   - [ ] Verificar que QR Code é exibido
   - [ ] Verificar que código PIX pode ser copiado

3. **Teste de Erros:**
   - [ ] Testar com Access Token inválido (deve mostrar erro)
   - [ ] Testar com valor inválido (deve validar)
   - [ ] Testar com email inválido (deve validar)
   - [ ] Verificar que erros são exibidos adequadamente

4. **Teste de QR Code:**
   - [ ] Escanear QR Code com app de banco (em ambiente de teste)
   - [ ] Verificar que dados do pagamento estão corretos
   - [ ] Verificar que valor está correto (R$ 29,90)

## Performance Considerations

- **Backend:**
  - Timeout de 5 segundos configurado para chamadas ao Mercado Pago
  - X-Idempotency-Key evita pagamentos duplicados
  - Logs para debugging

- **Frontend:**
  - Loading state para melhor UX
  - Tratamento de erros com retry
  - QR Code em Base64 (não requer chamada adicional)

## Migration Notes

- **Função `generatePixCode` mock:**
  - Pode ser mantida como fallback
  - Ou removida após confirmação de que integração real funciona
  - Decisão: Manter como fallback inicialmente, remover depois

- **Variáveis de ambiente:**
  - Criar `.env.example` para documentar variáveis necessárias
  - Adicionar `.env` e `.env.local` ao `.gitignore`

## References

- Documentação de pesquisa: `MERCADO_PAGO_PIX_INTEGRACAO.md`
- Mercado Pago API: https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/payment-submission/pix
- SDK Node.js: https://github.com/mercadopago/sdk-node

---

## Checklist Final de Implementação

- [ ] Phase 1: Setup e configuração inicial completa
- [ ] Phase 2: Backend implementado e funcionando
- [ ] Phase 3: PaymentModal atualizado e funcionando
- [ ] Phase 4: Credenciais configuradas e testes realizados
- [ ] Documentação completa
- [ ] Testes manuais passando
- [ ] Pronto para deploy (ou próximo passo: deploy)

---

**Plano criado em**: 2025-01-18  
**Última atualização**: 2025-01-18  
**Status**: Pronto para implementação

