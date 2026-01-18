import React, { useEffect } from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { trackingService } from '../services/tracking';

export const ThankYouPage: React.FC = () => {
  useEffect(() => {
    // Captura parâmetros da URL
    const searchParams = new URLSearchParams(window.location.search);
    
    const utms = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
    };

    const leadId = searchParams.get('lead_id');
    const paymentAmount = searchParams.get('payment_amount');

    // Rastreia visualização da página de agradecimento
    trackingService.trackEvent('thank_you_page_view', {
      leadId,
      paymentAmount,
      utms,
      referrer: document.referrer
    });

    // Envia para Meta Pixel (se disponível)
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: parseFloat(paymentAmount || '0'),
        currency: 'BRL'
      });
    }
  }, []);

  const handleWhatsAppClick = () => {
    // Número do WhatsApp (formato: 5511999999999 - sem espaços, com código do país)
    const phoneNumber = '5511999999999'; // ALTERE AQUI com seu número real
    const message = encodeURIComponent('Olá! Acabei de comprar o relatório de autoridade digital. Como posso receber meu relatório?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Rastreia clique no WhatsApp
    trackingService.trackEvent('whatsapp_click', {
      source: 'thank_you_page'
    });
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Obrigado pela sua compra!
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Seu relatório completo está sendo preparado e será enviado em instantes.
        </p>

        {/* Botão WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full max-w-md mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-lg">Chamar no WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

