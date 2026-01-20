# 🔧 Configurar Node.js 18.x na Vercel

## ⚠️ Erro: "Found invalid Node.js Version: 24.x"

Para corrigir este erro, você precisa configurar o Node.js 18.x **manualmente na Vercel**:

## 📋 Passo a Passo

### 1. Acessar Configurações do Projeto

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **General**

### 2. Configurar Node.js Version

1. Role até a seção **Node.js Version**
2. Selecione **18.x** (ou **18.20.4** se disponível)
3. Clique em **Save**

### 3. Fazer Novo Deploy

Após salvar:
1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**
4. Ou faça um novo push para o Git

## ✅ Verificação

Após o redeploy, verifique:
- ✅ Build deve completar sem erros
- ✅ Não deve mais aparecer o erro de Node.js version
- ✅ Serverless functions devem funcionar

## 📝 Notas

- O arquivo `.nvmrc` e `package.json` com `engines.node` ajudam, mas a configuração manual na Vercel é necessária
- A Vercel pode estar usando uma versão padrão mais nova
- Após configurar, todos os novos deploys usarão Node.js 18.x



