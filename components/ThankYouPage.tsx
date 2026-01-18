import React, { useEffect } from 'react';
import { CheckCircle, Download, Mail, Share2 } from 'lucide-react';
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

        {/* Ações */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button className="flex flex-col items-center gap-2 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
            <Download className="text-indigo-600" size={24} />
            <span className="text-sm font-semibold text-indigo-900">Baixar Relatório</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <Mail className="text-slate-600" size={24} />
            <span className="text-sm font-semibold text-slate-900">Enviar por Email</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <Share2 className="text-slate-600" size={24} />
            <span className="text-sm font-semibold text-slate-900">Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

