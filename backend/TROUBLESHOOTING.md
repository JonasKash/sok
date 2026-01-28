# 🔧 Troubleshooting - Erros Mercado Pago

## ❌ Erro: PA_UNAUTHORIZED_RESULT_FROM_POLICIES (403)

Este erro geralmente indica problemas com autenticação ou permissões.

### Possíveis Causas e Soluções:

#### 1. Access Token Inválido ou Expirado
**Sintoma:** Erro 403 ou 401

**Solução:**
- Acesse: https://www.mercadopago.com.br/developers/panel
- Vá em "Suas integrações" > "Credenciais"
- Gere um novo Access Token
- Atualize o arquivo `backend/.env`

#### 2. Access Token de TEST vs PRODUCTION
**Sintoma:** Erro 403

**Solução:**
- Para desenvolvimento: Use credenciais de **TEST**
- Para produção: Use credenciais de **PRODUCTION**
- Não misture credenciais de teste com produção

#### 3. Conta Não Verificada
**Sintoma:** Erro 403

**Solução:**
- Complete a verificação da conta no Mercado Pago
- Acesse: https://www.mercadopago.com.br/developers/panel
- Verifique se todos os dados estão completos

#### 4. Conta Sem Permissão para PIX
**Sintoma:** Erro 403

**Solução:**
- Verifique se sua conta tem permissão para receber pagamentos PIX
- Entre em contato com o suporte do Mercado Pago se necessário

#### 5. Email do Pagador Inválido
**Sintoma:** Erro 400 ou 403

**Solução:**
- Garanta que o email do pagador seja válido
- O email é obrigatório no payload

### Como Verificar:

1. **Testar Access Token:**
```bash
curl -X GET "https://api.mercadopago.com/v1/payment_methods" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Se retornar 401, o token está inválido.

2. **Verificar Credenciais:**
- Acesse o painel do desenvolvedor
- Confirme se está usando as credenciais corretas (TEST ou PRODUCTION)

3. **Verificar Logs:**
- Veja os logs do backend para mais detalhes
- O erro específico será mostrado no console

### Exemplo de Payload Correto:

```json
{
  "transaction_amount": 29.90,
  "description": "Relatório de Autoridade Digital - Avestra",
  "payment_method_id": "pix",
  "payer": {
    "email": "cliente@exemplo.com",
    "first_name": "João",
    "last_name": "Silva"
  }
}
```

### Próximos Passos:

1. Verifique o Access Token no arquivo `.env`
2. Confirme se está usando credenciais de TEST (desenvolvimento)
3. Teste novamente
4. Se persistir, gere um novo Access Token










