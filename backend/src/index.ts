import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Configurar cliente do Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

console.log('🔍 Verificando configuração...');
console.log('Access Token configurado:', accessToken ? 'SIM' : 'NÃO');
if (accessToken) {
  console.log('Token (primeiros 20 chars):', accessToken.substring(0, 20) + '...');
}

if (!accessToken || accessToken === 'seu_access_token_aqui' || accessToken.includes('seu_access_token')) {
  console.error('❌ ERRO: MERCADOPAGO_ACCESS_TOKEN não configurado!');
  console.error('Configure a variável de ambiente MERCADOPAGO_ACCESS_TOKEN no arquivo .env');
  console.error('Arquivo .env deve estar em:', process.cwd());
  process.exit(1);
}

const client = new MercadoPagoConfig({
  accessToken: accessToken,
  options: {
    timeout: 5000,
  },
});

const payment = new Payment(client);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Avestra Backend API' });
});

// Endpoint para criar pagamento PIX
app.post('/api/create-pix-payment', async (req, res) => {
  try {
    const { transaction_amount, description, payer } = req.body;

    if (!transaction_amount || transaction_amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

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

    const requestOptions = {
      idempotencyKey: uuidv4(),
    };

    console.log('📝 Criando pagamento PIX:', {
      amount: paymentData.transaction_amount,
      description: paymentData.description,
      payer_email: paymentData.payer.email,
    });

    const response = await payment.create({ body: paymentData }, requestOptions);

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

    res.json(pixData);
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
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Endpoint para verificar status do pagamento
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'ID de pagamento inválido' });
    }

    const response = await payment.get({ id: paymentId });
    
    res.json({
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
    });
  } catch (error: any) {
    console.error('❌ Erro ao verificar status:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar status do pagamento',
      message: error.message || 'Erro desconhecido',
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Avestra Backend rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Endpoint PIX: http://localhost:${PORT}/api/create-pix-payment`);
});

