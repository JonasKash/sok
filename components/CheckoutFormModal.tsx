import React, { useState } from 'react';
import { X, Smartphone, Loader2, AlertCircle, CheckCircle, TrendingUp, Target, MessageCircle, BarChart3, Users, FileText } from 'lucide-react';
import { BusinessData } from '../types';
import { trackingService } from '../services/tracking';

interface CheckoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (whatsapp: string) => void;
  businessData: BusinessData;
}

export const CheckoutFormModal: React.FC<CheckoutFormModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  businessData,
}) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Formata WhatsApp enquanto digita (apenas formatação visual, sem validação)
  const formatWhatsApp = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata baseado no número de dígitos (sem limite)
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!whatsapp.trim()) {
      setError('Por favor, informe seu WhatsApp');
      return;
    }

    setLoading(true);

    try {
      // Prepara dados para webhook
      const webhookData = {
        cidade: businessData.city,
        nome_empresa: businessData.name,
        nicho_empresa: businessData.category,
        whatsapp: whatsapp.replace(/\D/g, ''), // Apenas números
        timestamp: new Date().toISOString(),
        session_id: trackingService.getSessionId(),
        lead_id: trackingService.getLeadId() || undefined,
        utm: trackingService.getUTMs(),
      };

      // Envia webhook
      const webhookUrl = 'https://wbn.araxa.app/webhook/receive-form-dash';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar dados: ${response.statusText}`);
      }

      // Rastreia submissão do formulário de checkout
      await trackingService.trackEvent('checkout_form_submit', {
        whatsapp: webhookData.whatsapp,
        businessName: businessData.name,
        city: businessData.city,
        category: businessData.category,
      });

      // Constrói URL do checkout com todas as UTMs
      const checkoutUrl = new URL('https://www.ggcheckout.com/checkout/v2/otQ1Nxc2FmNswavYjubL');
      const utms = trackingService.getUTMs();
      
      // Adiciona todas as UTMs como query parameters
      if (utms.utm_source) {
        checkoutUrl.searchParams.set('utm_source', utms.utm_source);
      }
      if (utms.utm_medium) {
        checkoutUrl.searchParams.set('utm_medium', utms.utm_medium);
      }
      if (utms.utm_campaign) {
        checkoutUrl.searchParams.set('utm_campaign', utms.utm_campaign);
      }
      if (utms.utm_term) {
        checkoutUrl.searchParams.set('utm_term', utms.utm_term);
      }
      if (utms.utm_content) {
        checkoutUrl.searchParams.set('utm_content', utms.utm_content);
      }

      // Adiciona informações adicionais para rastreamento
      if (webhookData.lead_id) {
        checkoutUrl.searchParams.set('lead_id', webhookData.lead_id);
      }
      if (webhookData.session_id) {
        checkoutUrl.searchParams.set('session_id', webhookData.session_id);
      }

      setSuccess(true);

      // Redireciona para o checkout após 1 segundo (para mostrar mensagem de sucesso)
      setTimeout(() => {
        window.location.href = checkoutUrl.toString();
      }, 1000);
    } catch (err) {
      console.error('Erro ao enviar webhook:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao enviar informações. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {!success ? (
            <>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-indigo-600" size={32} />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 text-center">
                Receba seu Relatório Completo
              </h3>
              
              <p className="text-slate-600 mb-6 text-sm text-center">
                Preencha seu WhatsApp e receba tudo isso por mensagem:
              </p>

              {/* Lista de Benefícios */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Pontuação de Relevância no Seu Nicho</p>
                      <p className="text-xs text-slate-600 mt-0.5">Veja sua posição atual e como melhorar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Plano de Ação</p>
                      <p className="text-xs text-slate-600 mt-0.5">Passos práticos para melhorar sua posição nas IAs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Suporte para Tirar Dúvidas</p>
                      <p className="text-xs text-slate-600 mt-0.5">Ajuda personalizada para executar o plano</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <BarChart3 className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Acesso ao Dashboard com Métricas</p>
                      <p className="text-xs text-slate-600 mt-0.5">Acompanhe métricas relevantes da sua empresa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Análise de Concorrentes</p>
                      <p className="text-xs text-slate-600 mt-0.5">O que eles fazem de diferente que você não faz</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="text-white" size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Tipos de Conteúdos Necessários</p>
                      <p className="text-xs text-slate-600 mt-0.5">Conteúdos específicos para aumentar sua pontuação</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-red-600 text-sm font-semibold">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label 
                    htmlFor="whatsapp" 
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="whatsapp"
                      type="text"
                      value={whatsapp}
                      onChange={handleWhatsAppChange}
                      placeholder="(00) 9 0000-0000"
                      disabled={loading}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-4 px-4 text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                    <Smartphone 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" 
                      size={20} 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !whatsapp.trim()}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Enviando...
                    </>
                  ) : (
                    <>
                      CONTINUAR PARA PAGAMENTO
                      <svg 
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  Seus dados estão seguros e serão usados apenas para enviar o relatório.
                </p>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              
              <p className="text-xl font-semibold text-slate-900 text-center">
                Entraremos em contato para envio do relatório completo
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <span className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Dados Protegidos
          </span>
        </div>
      </div>
    </div>
  );
};

