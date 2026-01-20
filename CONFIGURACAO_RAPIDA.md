# 🚀 Configuração Rápida - Mercado Pago

## ⚠️ Erro "Failed to fetch" - Solução

Este erro geralmente acontece porque o **backend não está rodando**. Siga os passos abaixo:

## 📋 Passo a Passo

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Configurar Access Token do Mercado Pago

Crie o arquivo `backend/.env`:

```env
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
PORT=3000
```

**Onde obter o Access Token:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações" > "Credenciais"
3. Copie o **Access Token** (Test ou Production)

### 3. Rodar o backend

```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Servidor Avestra Backend rodando na porta 3000
📡 Health check: http://localhost:3000/health
💳 Endpoint PIX: http://localhost:3000/api/create-pix-payment
```

### 4. Configurar frontend

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

### 5. Rodar o frontend

```bash
npm run dev
```

## ✅ Verificar se está funcionando

1. Acesse: http://localhost:3000/health
   - Deve retornar: `{"status":"ok","message":"Avestra Backend API"}`

2. No frontend, clique em "DESBLOQUEAR POR R$ 29,90"
   - O modal deve abrir e gerar o PIX

## 🔧 Problemas Comuns

### Backend não inicia
- Verifique se o Access Token está no `.env`
- Verifique se a porta 3000 está livre
- Execute `npm install` novamente

### Erro de CORS
- O backend já tem CORS configurado
- Se persistir, verifique se está acessando de `http://localhost:5173`

### Access Token inválido
- Use credenciais de **TEST** para desenvolvimento
- Verifique se copiou o token completo

## 📝 Notas

- **Desenvolvimento**: Use Access Token de TEST
- **Produção**: Use Access Token de PRODUCTION
- **Nunca** commite o arquivo `.env` com tokens reais



