import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Apenas aceita GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paymentId = parseInt(req.query.id as string);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'ID de pagamento inválido' });
    }

    // Obter Access Token das variáveis de ambiente
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ 
        error: 'Access Token do Mercado Pago não configurado' 
      });
    }

    // Buscar status do pagamento via API direta
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!mpResponse.ok) {
      const error = await mpResponse.json();
      throw new Error(error.message || 'Erro ao verificar status');
    }

    const response = await mpResponse.json();
    
    res.status(200).json({
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
}

