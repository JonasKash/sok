# 🚀 Deploy Completo - Avestra no Vercel

## ✅ Estrutura Criada para Serverless Functions

```
api/
├── health.ts                    # GET /api/health
├── create-pix-payment.ts        # POST /api/create-pix-payment
└── payment-status/
    └── [id].ts                  # GET /api/payment-status/:id
```

## 📋 Passo a Passo para Deploy

### 1. Fazer Push para o Git

```bash
git add .
git commit -m "Adiciona serverless functions para Vercel"
git push
```

### 2. Configurar Variáveis de Ambiente na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione:

```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-4671972423831418-053117-ba4c26a84dff228b2d41205b651b2f64-315320666
```

**Importante:** Selecione todos os ambientes (Production, Preview, Development)

### 3. Deploy Automático

O Vercel detecta automaticamente:
- ✅ Arquivos em `/api` → Serverless Functions
- ✅ `vercel.json` → Configuração
- ✅ `package.json` → Dependências

### 4. Testar os Endpoints

Após o deploy, teste:

1. **Health Check:**
   ```
   https://seu-dominio.vercel.app/api/health
   ```

2. **Criar Pagamento (via frontend):**
   - Acesse o site
   - Clique em "DESBLOQUEAR POR R$ 29,90"
   - O PIX deve ser gerado

## 🔗 URLs dos Endpoints

Após o deploy, os endpoints estarão em:

- `https://seu-dominio.vercel.app/api/health`
- `https://seu-dominio.vercel.app/api/create-pix-payment`
- `https://seu-dominio.vercel.app/api/payment-status/:id`

## ⚙️ Configuração Automática

O frontend já está configurado para:
- **Desenvolvimento:** Usa `http://localhost:3000` (se backend local estiver rodando)
- **Produção:** Detecta automaticamente `window.location.origin + '/api'`

**Não precisa configurar `VITE_API_URL` em produção!** O código detecta automaticamente.

## 🧪 Testar Localmente (Opcional)

Para testar as serverless functions localmente:

```bash
npm install -g vercel
vercel dev
```

Isso simula o ambiente Vercel localmente.

## ✅ Checklist de Deploy

- [ ] Push feito para o Git
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` configurada na Vercel
- [ ] Deploy automático concluído
- [ ] Testado endpoint `/api/health`
- [ ] Testado criação de pagamento PIX no frontend

## 📝 Notas

- ✅ Serverless functions são executadas sob demanda
- ✅ Não precisa manter servidor rodando
- ✅ Escala automaticamente
- ✅ Custo baseado em uso
- ⚠️ Primeira requisição pode ter cold start (2-3 segundos)



