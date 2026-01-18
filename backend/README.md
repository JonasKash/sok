# 🚀 Avestra Backend API - Mercado Pago Integration

Backend para processar pagamentos PIX via Mercado Pago.

## 📋 Pré-requisitos

- Node.js 18+ 
- Conta no Mercado Pago (teste ou produção)
- Access Token do Mercado Pago

## 🔧 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o `.env` e adicione seu Access Token do Mercado Pago:
```env
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
PORT=3000
```

## 🏃 Como Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### Criar Pagamento PIX
```
POST /api/create-pix-payment
Body: {
  "transaction_amount": 29.90,
  "description": "Relatório de Autoridade Digital",
  "payer": {
    "email": "cliente@exemplo.com"
  }
}
```

### Verificar Status do Pagamento
```
GET /api/payment-status/:id
```

## 🔐 Obter Access Token do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login na sua conta
3. Vá em "Suas integrações" > "Credenciais"
4. Copie o "Access Token" (Test ou Production)
5. Cole no arquivo `.env`

## 🧪 Testando

Use o Access Token de **TEST** para testar sem cobranças reais.

Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing


