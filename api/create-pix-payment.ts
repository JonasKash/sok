import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transaction_amount, description, payer } = req.body;

    // Validações
    if (!transaction_amount || transaction_amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Obter Access Token das variáveis de ambiente
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('❌ ERRO: MERCADOPAGO_ACCESS_TOKEN não configurado!');
      return res.status(500).json({
        error: 'Access Token do Mercado Pago não configurado',
        message: 'Configure a variável de ambiente MERCADOPAGO_ACCESS_TOKEN na Vercel'
      });
    }

    // Não precisamos do SDK aqui, vamos usar fetch direto

    // Validação e preparação dos dados do pagamento
    const payerEmail = payer?.email || 'cliente@avestra.app';
    
    // Validar email
    if (!payerEmail || !payerEmail.includes('@')) {
      return res.status(400).json({ 
        error: 'Email do pagador é obrigatório e deve ser válido' 
      });
    }

    const paymentData = {
      transaction_amount: parseFloat(transaction_amount),
      description: description || 'Relatório de Autoridade Digital - Avestra',
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
        first_name: payer?.first_name || 'Cliente',
        last_name: payer?.last_name || 'Avestra',
      },
    };

    console.log('📝 Criando pagamento PIX:', {
      amount: paymentData.transaction_amount,
      description: paymentData.description,
      payer_email: paymentData.payer.email,
    });

    // Criar pagamento
    // Para idempotency, vamos usar fetch direto com header X-Idempotency-Key
    const idempotencyKey = uuidv4();
    
    // Usar fetch direto para ter controle do header X-Idempotency-Key
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!mpResponse.ok) {
      const error = await mpResponse.json();
      throw new Error(error.message || 'Erro ao criar pagamento');
    }

    const response = await mpResponse.json();

    // A resposta já vem no formato correto do Mercado Pago
    const pixData = {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      point_of_interaction: {
        transaction_data: {
          qr_code: response.point_of_interaction?.transaction_data?.qr_code || '',
          qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64 || '',
          ticket_url: response.point_of_interaction?.transaction_data?.ticket_url || '',
        },
      },
      date_created: response.date_created,
      date_of_expiration: response.date_of_expiration,
    };

    console.log('✅ Pagamento PIX criado com sucesso:', {
      id: pixData.id,
      status: pixData.status,
    });

    res.status(200).json(pixData);
  } catch (error: any) {
    console.error('❌ Erro ao criar pagamento PIX:', error);
    
    // Tratamento específico para erros do Mercado Pago
    let errorMessage = 'Erro ao processar pagamento';
    let statusCode = 500;
    
    if (error.status === 403 || error.code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES') {
      errorMessage = 'Acesso negado pelo Mercado Pago. Verifique:';
      statusCode = 403;
      console.error('🔒 Possíveis causas:');
      console.error('  1. Access Token inválido ou expirado');
      console.error('  2. Conta do Mercado Pago não verificada');
      console.error('  3. Access Token de TEST usado em produção (ou vice-versa)');
      console.error('  4. Conta sem permissão para criar pagamentos PIX');
    } else if (error.status === 401) {
      errorMessage = 'Access Token inválido ou expirado';
      statusCode = 401;
    } else if (error.cause) {
      // Erro detalhado do Mercado Pago
      const cause = Array.isArray(error.cause) ? error.cause[0] : error.cause;
      errorMessage = cause?.message || error.message || errorMessage;
      statusCode = cause?.status || error.status || statusCode;
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      message: error.message || 'Erro desconhecido',
      code: error.code,
    });
  }
}

