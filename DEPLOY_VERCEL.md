# 🚀 Deploy Backend no Vercel - Guia Completo

## ✅ O que foi criado

1. **Serverless Functions** adaptadas para Vercel
2. **Estrutura `/api`** com endpoints serverless
3. **Configuração `vercel.json`** para deploy automático
4. **Dependências** adicionadas ao `package.json`

## 📋 Estrutura Criada

```
api/
├── health.ts                    # Health check endpoint
├── create-pix-payment.ts        # Criar pagamento PIX
└── payment-status/
    └── [id].ts                  # Verificar status do pagamento
```

## 🔧 Configuração na Vercel

### 1. Instalar Dependências

O Vercel vai instalar automaticamente, mas você pode instalar localmente:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione:

```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-4671972423831418-053117-ba4c26a84dff228b2d41205b651b2f64-315320666
```

### 3. Configurar URL do Backend no Frontend

**IMPORTANTE:** Como o backend está no mesmo projeto (serverless functions), você pode:

**Opção A: Não configurar VITE_API_URL** (recomendado)
- O código já detecta automaticamente a URL do frontend
- Usa `window.location.origin + '/api'` em produção

**Opção B: Configurar manualmente**
Na Vercel, adicione a variável para o frontend:

```
VITE_API_URL = https://seu-dominio.vercel.app/api
```

**Nota:** O código já está preparado para funcionar automaticamente sem configuração!

### 4. Deploy

O Vercel detecta automaticamente e faz o deploy:
- As functions em `/api` viram endpoints serverless
- `/api/create-pix-payment` → `https://seu-dominio.vercel.app/api/create-pix-payment`
- `/api/payment-status/[id]` → `https://seu-dominio.vercel.app/api/payment-status/123`

## 🔗 Endpoints Disponíveis

### Health Check
```
GET https://seu-dominio.vercel.app/api/health
```

### Criar Pagamento PIX
```
POST https://seu-dominio.vercel.app/api/create-pix-payment
Body: {
  "transaction_amount": 29.90,
  "description": "Relatório de Autoridade Digital",
  "payer": {
    "email": "cliente@exemplo.com"
  }
}
```

### Verificar Status
```
GET https://seu-dominio.vercel.app/api/payment-status/1234567890
```

## ⚙️ Atualizar Frontend

No arquivo `services/api.ts`, a URL já está configurada para usar `VITE_API_URL`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Após configurar `VITE_API_URL` na Vercel, faça um novo deploy do frontend.

## 🧪 Testar

1. **Health Check:**
   ```
   https://seu-dominio.vercel.app/api/health
   ```

2. **Criar Pagamento:**
   - No frontend, clique em "DESBLOQUEAR POR R$ 29,90"
   - O modal deve gerar o PIX

## 📝 Notas Importantes

- ✅ Serverless functions são executadas sob demanda
- ✅ Não precisa manter servidor rodando
- ✅ Escala automaticamente
- ✅ Custo baseado em uso
- ⚠️ Cold start pode levar alguns segundos na primeira requisição

## 🔄 Próximos Passos

1. Faça commit e push das alterações
2. O Vercel vai fazer deploy automaticamente
3. Configure as variáveis de ambiente na Vercel
4. Teste os endpoints
5. Configure `VITE_API_URL` no frontend
6. Faça novo deploy do frontend

