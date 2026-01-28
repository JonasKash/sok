# 🔍 Verificação de Deploy - Troubleshooting

## ❌ Erro: "Servidor não está disponível"

Se você está recebendo este erro após o deploy, siga estes passos:

### 1. Verificar se as Serverless Functions foram Deployadas

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Deployments**
4. Clique no último deploy
5. Verifique se há erros no build

**O que procurar:**
- ✅ Build deve ter sucesso
- ✅ Deve aparecer "Functions" na lista
- ✅ Deve listar: `api/create-pix-payment`, `api/health`, etc.

### 2. Testar Endpoint Diretamente

Abra no navegador ou use curl:

```
https://seu-dominio.vercel.app/api/health
```

**Deve retornar:**
```json
{"status":"ok","message":"Avestra Backend API"}
```

**Se retornar 404:**
- As serverless functions não foram deployadas
- Verifique se a pasta `/api` está no repositório
- Verifique se o `vercel.json` está correto

### 3. Verificar Variável de Ambiente

1. Na Vercel, vá em **Settings** > **Environment Variables**
2. Verifique se `MERCADOPAGO_ACCESS_TOKEN` está configurada
3. Verifique se está selecionada para **Production**, **Preview** e **Development**

### 4. Verificar Logs

1. Na Vercel, vá em **Deployments**
2. Clique no último deploy
3. Vá em **Functions** > **api/create-pix-payment**
4. Veja os logs de erro

### 5. Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá em **Console**
3. Procure por mensagens como:
   - `🔗 Tentando criar pagamento PIX:`
   - `❌ Backend não está acessível:`

Isso mostra qual URL está sendo tentada.

## 🔧 Soluções Comuns

### Problema: 404 Not Found

**Causa:** Serverless functions não foram detectadas

**Solução:**
1. Verifique se a pasta `api/` está na raiz do projeto
2. Verifique se os arquivos têm extensão `.ts`
3. Faça um novo deploy

### Problema: 500 Internal Server Error

**Causa:** Variável de ambiente não configurada

**Solução:**
1. Configure `MERCADOPAGO_ACCESS_TOKEN` na Vercel
2. Faça um novo deploy (ou aguarde alguns minutos)

### Problema: CORS Error

**Causa:** Problema de CORS (improvável com serverless functions)

**Solução:**
- Serverless functions na Vercel não têm problemas de CORS
- Se persistir, verifique se está acessando a URL correta

### Problema: Timeout

**Causa:** Cold start ou função muito lenta

**Solução:**
- Primeira requisição pode demorar 2-3 segundos (cold start)
- Aguarde e tente novamente

## ✅ Checklist de Verificação

- [ ] Pasta `/api` existe na raiz do projeto
- [ ] Arquivos `.ts` estão em `/api`
- [ ] `vercel.json` existe e está correto
- [ ] Deploy foi feito com sucesso
- [ ] `MERCADOPAGO_ACCESS_TOKEN` está configurada
- [ ] Endpoint `/api/health` retorna 200
- [ ] Console do navegador mostra a URL tentada

## 🧪 Teste Rápido

Execute no console do navegador (F12):

```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Se funcionar:** O endpoint está acessível
**Se falhar:** Verifique os logs de erro










