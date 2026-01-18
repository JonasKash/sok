# Integração Checkout Transparente Mercado Pago com PIX

**Data de Criação**: 2025-01-18  
**Objetivo**: Documentação completa para implementar checkout transparente do Mercado Pago com PIX, onde ao clicar em "Ver relatório por R$ 29" aparece um modal JavaScript que gera um novo PIX na hora usando a API do Mercado Pago.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Como Obter Credenciais](#como-obter-credenciais)
4. [Fluxo de Integração](#fluxo-de-integração)
5. [Implementação Frontend](#implementação-frontend)
6. [Implementação Backend](#implementação-backend)
7. [Documentação da API](#documentação-da-api)
8. [Exibição do QR Code](#exibição-do-qr-code)
9. [Status do Pagamento](#status-do-pagamento)
10. [Boas Práticas e Segurança](#boas-práticas-e-segurança)
11. [Testes](#testes)
12. [Referências](#referências)

---

## 🎯 Visão Geral

Este documento descreve como implementar um **checkout transparente** do Mercado Pago usando **PIX** como método de pagamento. A implementação permite que:

- Ao clicar no botão "Ver relatório por R$ 29", um modal JavaScript seja aberto
- O modal carrega a **Public Key** do Mercado Pago no frontend
- Um novo pagamento PIX é gerado instantaneamente via API do Mercado Pago
- O QR Code e código PIX são exibidos no modal para o usuário pagar
- O status do pagamento pode ser acompanhado em tempo real

**Tecnologias Utilizadas:**
- Frontend: React + TypeScript + Vite
- Backend: Node.js/Express (ou similar)
- SDK: MercadoPago.js (v2) ou @mercadopago/sdk-js
- API: Mercado Pago REST API v1

---

## ✅ Pré-requisitos

### 1. Conta no Mercado Pago

- Ter uma conta de vendedor ativa no Mercado Pago Brasil
- Acessar: [https://www.mercadopago.com.br](https://www.mercadopago.com.br)
- Completar o cadastro e verificação de conta

### 2. Credenciais Necessárias

Você precisará de duas credenciais:

- **Public Key (Chave Pública)**: Usada no frontend para inicializar o SDK do Mercado Pago
- **Access Token (Token de Acesso)**: Usado no backend para criar pagamentos via API

⚠️ **IMPORTANTE**: Nunca exponha o Access Token no frontend. Ele deve ser usado apenas no backend.

### 3. Ambiente de Desenvolvimento

- Node.js instalado (versão 16 ou superior)
- HTTPS configurado (obrigatório para produção)
- Ambiente de sandbox/teste configurado para testes

### 4. Dependências do Projeto

Para o frontend (React/TypeScript):
```bash
npm install @mercadopago/sdk-js
# ou usar via CDN: <script src="https://sdk.mercadopago.com/js/v2"></script>
```

Para o backend (Node.js):
```bash
npm install mercadopago
# ou
npm install @mercadopago/sdk-node
```

---

## 🔑 Como Obter Credenciais

### Passo 1: Acessar o Painel do Desenvolvedor

1. Acesse: [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Faça login com sua conta Mercado Pago
3. Vá em **"Suas integrações"** ou **"Credenciais"**

### Passo 2: Criar uma Aplicação

1. Clique em **"Criar aplicação"** ou **"Nova aplicação"**
2. Preencha os dados:
   - Nome da aplicação
   - Descrição
   - URL de retorno (callback URL)
3. Salve a aplicação

### Passo 3: Obter as Credenciais

Você verá duas credenciais:

**Public Key (Chave Pública):**
- Formato: `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx`
- Usada no frontend
- Pode ser exposta publicamente

**Access Token (Token de Acesso):**
- Formato: `APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx`
- Usada no backend
- **NUNCA** exponha no frontend

### Credenciais de Teste (Sandbox)

Para testes, use as credenciais de **teste**:
- Acesse: [https://www.mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app)
- Selecione **"Credenciais de teste"**
- Use essas credenciais durante o desenvolvimento

### Credenciais de Produção

Para produção:
- Selecione **"Credenciais de produção"**
- Use essas credenciais apenas em produção
- Mantenha-as seguras e nunca as commite no Git

---

## 🔄 Fluxo de Integração

### Fluxo Completo

```
1. Usuário clica em "Ver relatório por R$ 29"
   ↓
2. Modal JavaScript é aberto
   ↓
3. Frontend inicializa MercadoPago.js com Public Key
   ↓
4. Modal exibe formulário (opcional) ou diretamente cria pagamento
   ↓
5. Frontend envia requisição ao backend com:
   - Valor (29.00)
   - Email do comprador
   - Descrição
   ↓
6. Backend cria pagamento via API Mercado Pago:
   - POST /v1/payments
   - Headers: Authorization + X-Idempotency-Key
   - Body: transaction_amount, payment_method_id: "pix", payer
   ↓
7. Mercado Pago retorna:
   - ID do pagamento
   - Status (pending)
   - QR Code (base64 e string)
   - Ticket URL
   ↓
8. Backend retorna dados para o frontend
   ↓
9. Modal exibe:
   - QR Code (imagem)
   - Código PIX (texto para copiar)
   - Link para pagamento
   ↓
10. Usuário paga via PIX
    ↓
11. (Opcional) Webhook ou polling verifica status
    ↓
12. Status atualizado: approved/rejected
```

### Diagrama de Sequência Simplificado

```
Frontend          Backend           Mercado Pago
   |                 |                    |
   |-- Clique ------>|                    |
   |                 |                    |
   |<-- Abre Modal --|                    |
   |                 |                    |
   |-- POST /create_pix_payment -------->|
   |                 |                    |
   |                 |-- POST /v1/payments -->|
   |                 |                    |
   |                 |<-- Response -------|
   |                 |                    |
   |<-- Response ----|                    |
   |                 |                    |
   |-- Exibe QR Code |                    |
   |                 |                    |
```

---

## 💻 Implementação Frontend

### 1. Instalação do SDK

**Opção A: Via CDN (HTML)**
```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

**Opção B: Via NPM (React/TypeScript)**
```bash
npm install @mercadopago/sdk-js
```

### 2. Configuração do Componente PaymentModal

Atualize o arquivo `components/PaymentModal.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle, Smartphone, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

interface PixPaymentData {
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
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, price }) => {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Gerar novo PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && !pixData) {
      createPixPayment();
    }
  }, [isOpen]);

  const createPixPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Chamar endpoint do backend para criar pagamento PIX
      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: price,
          description: 'Relatório de Autoridade Digital',
          payer: {
            email: 'cliente@exemplo.com', // Pode ser obtido de um formulário
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento PIX');
      }

      const data: PixPaymentData = await response.json();
      setPixData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
              <p className="text-slate-600">Gerando código PIX...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={createPixPayment}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {pixData && !loading && (
            <>
              <div className="mb-6 bg-white p-4 border border-slate-200 rounded-xl inline-block shadow-sm">
                {pixData.point_of_interaction?.transaction_data?.qr_code_base64 && (
                  <img 
                    src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                    alt="Pix QR Code" 
                    className="w-48 h-48"
                  />
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
                  className="text-sm text-indigo-600 hover:text-indigo-700 underline"
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

### 3. Variáveis de Ambiente (Frontend)

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

⚠️ **Nota**: No Vite, variáveis de ambiente devem começar com `VITE_` para serem expostas ao frontend.

Acesse no código:
```typescript
const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
```

---

## 🖥️ Implementação Backend

### 1. Endpoint para Criar Pagamento PIX

Crie um endpoint no backend (exemplo com Express/Node.js):

```typescript
// backend/routes/payment.ts ou similar
import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: uuidv4(),
  },
});

const payment = new Payment(client);

router.post('/create-pix-payment', async (req, res) => {
  try {
    const { transaction_amount, description, payer } = req.body;

    // Validações básicas
    if (!transaction_amount || !payer?.email) {
      return res.status(400).json({
        error: 'Campos obrigatórios: transaction_amount, payer.email',
      });
    }

    // Criar pagamento PIX
    const paymentData = {
      transaction_amount: parseFloat(transaction_amount),
      description: description || 'Pagamento via PIX',
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
        first_name: payer.first_name || '',
        last_name: payer.last_name || '',
        identification: payer.identification || undefined,
      },
    };

    // Headers com X-Idempotency-Key (obrigatório)
    const requestOptions = {
      idempotencyKey: uuidv4(), // UUID único para evitar duplicações
    };

    const response = await payment.create({ body: paymentData }, requestOptions);

    // Retornar dados do pagamento
    res.json({
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
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    
    // Tratar erros específicos do Mercado Pago
    if (error.cause) {
      return res.status(error.cause[0]?.status || 500).json({
        error: error.message,
        details: error.cause,
      });
    }

    res.status(500).json({
      error: 'Erro ao processar pagamento',
      message: error.message,
    });
  }
});

export default router;
```

### 2. Usando SDK do Mercado Pago (Node.js)

**Instalação:**
```bash
npm install mercadopago
# ou
npm install @mercadopago/sdk-node
```

**Exemplo com SDK antigo (mercadopago):**
```typescript
import mercadopago from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

app.post('/api/create-pix-payment', async (req, res) => {
  try {
    const { transaction_amount, description, payer } = req.body;

    const paymentData = {
      transaction_amount: parseFloat(transaction_amount),
      description: description || 'Pagamento via PIX',
      payment_method_id: 'pix',
      payer: {
        email: payer.email,
      },
    };

    const payment = await mercadopago.payment.create(paymentData, {
      headers: {
        'X-Idempotency-Key': uuidv4(),
      },
    });

    res.json(payment.body);
  } catch (error: any) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Variáveis de Ambiente (Backend)

Crie um arquivo `.env` no backend:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
PORT=3000
```

⚠️ **IMPORTANTE**: Adicione `.env` ao `.gitignore` para não commitar credenciais.

### 4. Exemplo com Fetch (Sem SDK)

Se preferir não usar o SDK:

```typescript
import { v4 as uuidv4 } from 'uuid';

app.post('/api/create-pix-payment', async (req, res) => {
  try {
    const { transaction_amount, description, payer } = req.body;

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': uuidv4(),
      },
      body: JSON.stringify({
        transaction_amount: parseFloat(transaction_amount),
        description: description || 'Pagamento via PIX',
        payment_method_id: 'pix',
        payer: {
          email: payer.email,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar pagamento');
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📚 Documentação da API

### Endpoint: POST /v1/payments

**URL Base:**
```
https://api.mercadopago.com/v1/payments
```

**Headers Obrigatórios:**
```http
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
X-Idempotency-Key: {UUID_V4}
```

**Body da Requisição (PIX):**
```json
{
  "transaction_amount": 29.00,
  "description": "Relatório de Autoridade Digital",
  "payment_method_id": "pix",
  "payer": {
    "email": "comprador@exemplo.com",
    "first_name": "João",
    "last_name": "Silva",
    "identification": {
      "type": "CPF",
      "number": "12345678900"
    }
  }
}
```

**Campos Obrigatórios:**
- `transaction_amount`: Valor da transação (float)
- `payment_method_id`: Deve ser `"pix"` para pagamentos PIX
- `payer.email`: Email do comprador

**Campos Opcionais:**
- `description`: Descrição do pagamento
- `payer.first_name`: Nome do comprador
- `payer.last_name`: Sobrenome do comprador
- `payer.identification`: Tipo e número de documento (CPF, CNPJ, etc.)
- `date_of_expiration`: Data de expiração do PIX (formato ISO 8601)

**Resposta de Sucesso (200):**
```json
{
  "id": 1234567890,
  "status": "pending",
  "status_detail": "pending_waiting_transfer",
  "transaction_amount": 29.00,
  "description": "Relatório de Autoridade Digital",
  "point_of_interaction": {
    "type": "PIX",
    "transaction_data": {
      "qr_code": "00020126600014br.gov.bcb.pix0117john@yourdomain.com0217additional data520400005303986540510.005802BR5913Maria Silva6008Brasilia62070503***6304E2CA",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAABRQAAAUUCAYAAACu5p7oAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAIABJREFUeJzs2luO3LiWQNFmI+Y/Zd6vRt36KGNXi7ZOBtcagHD4kNLeiLX33v8DAAAAABD879sDAAAAAAA/h6AIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCAAAAAJmgCAAAAABkgiIAAAAAkAmKAAAAAEAmKAIAAAAAmaAIAAAAAGSCIgAAAACQCYoAAAAAQCYoAgAAAACZoAgAAAAAZIIiAAAAAJAJigAAAABAJigCA...",
      "ticket_url": "https://www.mercadopago.com.br/payments/123456789/ticket?caller_id=123456&hash=123e4567-e89b-12d3-a456-426655440000"
    }
  },
  "date_created": "2025-01-18T10:30:00.000-04:00",
  "date_of_expiration": "2025-01-19T10:30:00.000-04:00"
}
```

**Campos Importantes na Resposta:**
- `id`: ID único do pagamento
- `status`: Status do pagamento (`pending`, `approved`, `rejected`, etc.)
- `status_detail`: Detalhes do status
- `point_of_interaction.transaction_data.qr_code`: Código PIX em texto
- `point_of_interaction.transaction_data.qr_code_base64`: QR Code em Base64
- `point_of_interaction.transaction_data.ticket_url`: URL para visualizar instruções

### X-Idempotency-Key

⚠️ **CRÍTICO**: O header `X-Idempotency-Key` é **obrigatório** e deve ser um UUID v4 único para cada requisição. Isso evita criar pagamentos duplicados caso a requisição seja repetida.

**Como gerar:**
```typescript
import { v4 as uuidv4 } from 'uuid';
const idempotencyKey = uuidv4();
```

---

## 🖼️ Exibição do QR Code

### 1. Exibir QR Code como Imagem (Base64)

```typescript
const qrCodeBase64 = pixData.point_of_interaction.transaction_data.qr_code_base64;

<img 
  src={`data:image/png;base64,${qrCodeBase64}`}
  alt="QR Code PIX"
  className="w-48 h-48"
/>
```

### 2. Exibir Código PIX para Copiar

```typescript
const qrCode = pixData.point_of_interaction.transaction_data.qr_code;

<input 
  readOnly 
  value={qrCode}
  className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 text-xs font-mono"
/>
<button onClick={() => navigator.clipboard.writeText(qrCode)}>
  Copiar código
</button>
```

### 3. Link para Instruções

```typescript
const ticketUrl = pixData.point_of_interaction.transaction_data.ticket_url;

<a 
  href={ticketUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="text-indigo-600 hover:text-indigo-700 underline"
>
  Ver instruções de pagamento
</a>
```

---

## 📊 Status do Pagamento

### Status Possíveis

- `pending`: Pagamento pendente (aguardando pagamento)
- `approved`: Pagamento aprovado
- `rejected`: Pagamento rejeitado
- `cancelled`: Pagamento cancelado
- `refunded`: Pagamento reembolsado
- `charged_back`: Pagamento estornado

### Verificar Status do Pagamento

**Endpoint: GET /v1/payments/{id}**

```typescript
// Backend
const paymentId = 1234567890;

const response = await fetch(
  `https://api.mercadopago.com/v1/payments/${paymentId}`,
  {
    headers: {
      'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
  }
);

const payment = await response.json();
console.log('Status:', payment.status);
```

### Webhooks (Notificações)

Configure webhooks para receber notificações quando o status do pagamento mudar:

1. Acesse: [https://www.mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app)
2. Vá em **"Webhooks"** ou **"Notificações"**
3. Configure a URL do seu backend que receberá as notificações

**Endpoint para receber webhook:**
```typescript
app.post('/webhooks/mercadopago', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;
    
    // Buscar status atualizado do pagamento
    const payment = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    ).then(res => res.json());

    // Atualizar status no seu banco de dados
    if (payment.status === 'approved') {
      // Pagamento aprovado - liberar acesso ao relatório
    }

    res.status(200).send('OK');
  }
});
```

### Polling (Verificação Periódica)

Alternativa aos webhooks, você pode verificar o status periodicamente:

```typescript
// Frontend: verificar status a cada 5 segundos
useEffect(() => {
  if (!pixData?.id) return;

  const interval = setInterval(async () => {
    const response = await fetch(`/api/payment-status/${pixData.id}`);
    const { status } = await response.json();

    if (status === 'approved') {
      // Pagamento aprovado - liberar acesso
      clearInterval(interval);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [pixData?.id]);
```

---

## 🔒 Boas Práticas e Segurança

### 1. Nunca Exponha o Access Token

❌ **ERRADO:**
```typescript
// Frontend
const accessToken = 'APP_USR-xxxxx'; // NUNCA FAÇA ISSO
```

✅ **CORRETO:**
```typescript
// Backend apenas
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
```

### 2. Use X-Idempotency-Key Sempre

Sempre gere um UUID único para cada requisição:

```typescript
import { v4 as uuidv4 } from 'uuid';

const idempotencyKey = uuidv4();
```

### 3. Valide Dados no Backend

Nunca confie apenas na validação do frontend:

```typescript
if (!transaction_amount || transaction_amount <= 0) {
  return res.status(400).json({ error: 'Valor inválido' });
}

if (!payer?.email || !isValidEmail(payer.email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

### 4. Trate Erros Adequadamente

```typescript
try {
  const payment = await createPayment(data);
} catch (error: any) {
  if (error.status === 400) {
    // Erro de validação
  } else if (error.status === 401) {
    // Token inválido
  } else if (error.status === 429) {
    // Rate limit
  } else {
    // Erro genérico
  }
}
```

### 5. Use HTTPS em Produção

O Mercado Pago exige HTTPS em produção. Configure SSL/TLS no seu servidor.

### 6. Configure Expiração do PIX

Por padrão, o PIX expira em 24 horas. Você pode configurar:

```typescript
const expirationDate = new Date();
expirationDate.setHours(expirationDate.getHours() + 1); // 1 hora

const paymentData = {
  // ... outros campos
  date_of_expiration: expirationDate.toISOString(),
};
```

### 7. Logs e Monitoramento

Registre todas as transações:

```typescript
console.log('Pagamento criado:', {
  id: payment.id,
  amount: payment.transaction_amount,
  status: payment.status,
  timestamp: new Date().toISOString(),
});
```

### 8. Teste em Sandbox Primeiro

Sempre teste com credenciais de sandbox antes de ir para produção.

---

## 🧪 Testes

### 1. Credenciais de Teste

Use as credenciais de **teste** fornecidas pelo Mercado Pago durante o desenvolvimento.

### 2. Cartões de Teste

Para testar outros métodos de pagamento, use os cartões de teste do Mercado Pago.

### 3. Testar Fluxo Completo

1. ✅ Abrir modal ao clicar no botão
2. ✅ Criar pagamento PIX via backend
3. ✅ Exibir QR Code no modal
4. ✅ Copiar código PIX
5. ✅ Verificar status do pagamento
6. ✅ Receber webhook quando pagamento for aprovado

### 4. Testar Erros

- Token inválido
- Valor inválido
- Email inválido
- Falha na conexão com API
- Timeout

### 5. Testar em Diferentes Dispositivos

- Desktop
- Mobile
- Tablets

---

## 📖 Referências

### Documentação Oficial

1. **Checkout Bricks - PIX**
   - [https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/payment-submission/pix](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/payment-submission/pix)

2. **Pré-requisitos**
   - [https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/prerequisites](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/prerequisites)

3. **Referência da API**
   - [https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)

4. **SDK JavaScript**
   - [https://github.com/mercadopago/sdk-js](https://github.com/mercadopago/sdk-js)

5. **SDK Node.js**
   - [https://github.com/mercadopago/sdk-node](https://github.com/mercadopago/sdk-node)

6. **Status Screen Brick**
   - [https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/status-screen-brick/overview](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/status-screen-brick/overview)

7. **Webhooks**
   - [https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

### Exemplos de Código

1. **Payment Bricks Sample (Node.js)**
   - [https://github.com/mercadopago/payment-bricks-sample-node](https://github.com/mercadopago/payment-bricks-sample-node)

2. **Checkout API Examples**
   - [https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing)

### Suporte

- **Suporte Técnico**: [https://www.mercadopago.com.br/developers/pt/support](https://www.mercadopago.com.br/developers/pt/support)
- **Comunidade**: Discord do Mercado Pago
- **Status da API**: [https://status.mercadopago.com](https://status.mercadopago.com)

---

## ✅ Checklist de Implementação

- [ ] Conta no Mercado Pago criada e verificada
- [ ] Credenciais (Public Key e Access Token) obtidas
- [ ] Ambiente de sandbox configurado para testes
- [ ] SDK do Mercado Pago instalado (frontend e/ou backend)
- [ ] Endpoint backend criado para `/api/create-pix-payment`
- [ ] Modal frontend implementado com exibição de QR Code
- [ ] X-Idempotency-Key implementado no backend
- [ ] Tratamento de erros implementado
- [ ] Validação de dados no backend
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Webhooks configurados (opcional mas recomendado)
- [ ] Testes realizados em sandbox
- [ ] HTTPS configurado para produção
- [ ] Credenciais de produção configuradas
- [ ] Monitoramento e logs implementados

---

## 🚀 Próximos Passos

Após implementar a integração básica, considere:

1. **Status Screen Brick**: Use o Status Screen Brick do Mercado Pago para uma melhor UX
2. **Webhooks**: Configure webhooks para atualização automática de status
3. **Histórico de Pagamentos**: Armazene pagamentos no banco de dados
4. **Relatórios**: Crie relatórios de vendas e pagamentos
5. **Notificações**: Envie emails/SMS quando pagamento for aprovado
6. **Analytics**: Rastreie conversões e taxa de abandono

---

**Documento criado em**: 2025-01-18  
**Última atualização**: 2025-01-18  
**Versão**: 1.0


