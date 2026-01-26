# 💳 Integração Mercado Pago - Guia de Configuração

## ✅ O que foi implementado

1. **Frontend completo** com integração Mercado Pago
2. **Backend API** (Express + Mercado Pago SDK)
3. **Verificação automática** de status de pagamento
4. **Fallback para mock** se backend não estiver disponível

## 📋 Informações Necessárias

Para completar a integração, você precisa fornecer:

### 1. Access Token do Mercado Pago

**Onde obter:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login na sua conta Mercado Pago
3. Vá em "Suas integrações" > "Credenciais"
4. Copie o **Access Token** (Test ou Production)

**Qual usar:**
- **Test Token**: Para desenvolvimento e testes (não cobra de verdade)
- **Production Token**: Para produção (cobranças reais)

### 2. URL do Backend (Opcional)

Se você já tem um backend hospedado, informe a URL. Caso contrário, vamos configurar para rodar localmente.

## 🚀 Próximos Passos

### Passo 1: Instalar dependências do backend

```bash
cd backend
npm install
```

### Passo 2: Configurar variáveis de ambiente

Crie o arquivo `backend/.env`:

```env
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
PORT=3000
```

### Passo 3: Rodar o backend

```bash
cd backend
npm run dev
```

O backend estará rodando em: `http://localhost:3000`

### Passo 4: Configurar frontend

Crie/atualize o arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Para produção, use a URL do seu backend:
```env
VITE_API_URL=https://seu-backend.com
```

## 🧪 Testando

1. Inicie o backend: `cd backend && npm run dev`
2. Inicie o frontend: `npm run dev`
3. Acesse o site e clique em "DESBLOQUEAR POR R$ 29,90"
4. O modal deve gerar um PIX real do Mercado Pago

## 📝 Notas Importantes

- **Em desenvolvimento**: O sistema usa fallback mock se o backend não estiver disponível
- **Em produção**: Certifique-se de que o backend está rodando e acessível
- **Webhooks**: Para notificações automáticas, configure webhooks no painel do Mercado Pago

## 🔐 Segurança

- **NUNCA** commite o arquivo `.env` com tokens reais
- Use variáveis de ambiente no servidor de produção
- O Access Token deve ser mantido em segredo








