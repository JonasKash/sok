import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle, Smartphone, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { createPixPayment, checkPaymentStatus } from '../services/api';
import { PixPaymentData } from '../types';
import { trackingService } from '../services/tracking';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, price }) => {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  // Gerar novo PIX quando o modal abrir
  useEffect(() => {
    if (isOpen && !pixData && !loading) {
      createPixPaymentHandler();
    }
  }, [isOpen]);

  // Verificar status do pagamento periodicamente
  useEffect(() => {
    if (!pixData?.id || paymentStatus === 'approved' || paymentStatus === 'rejected') return;

    const interval = setInterval(async () => {
      try {
        const data = await checkPaymentStatus(pixData.id);
        setPaymentStatus(data.status);
        
        if (data.status === 'approved') {
          clearInterval(interval);
          handlePaymentConfirmed(pixData.id.toString());
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    }, 5000); // Verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, [pixData?.id, paymentStatus]);

  const createPixPaymentHandler = async () => {
    setLoading(true);
    setError(null);
    setPixData(null);

    try {
      const leadId = trackingService.getLeadId();
      
      const data = await createPixPayment({
        transaction_amount: price,
        description: 'Relatório de Autoridade Digital - Avestra',
        payer: {
          email: undefined, // Pode coletar do usuário se necessário
        },
      });

      setPixData(data);
      setPaymentStatus(data.status);
    } catch (err) {
      let errorMessage = 'Erro desconhecido ao criar pagamento PIX';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Mensagens mais amigáveis para erros comuns
        if (err.message.includes('Backend não está disponível')) {
          errorMessage = 'Servidor não está disponível. Verifique se o backend está rodando.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
        }
      }
      
      setError(errorMessage);
      console.error('Erro ao criar pagamento PIX:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.point_of_interaction?.transaction_data?.qr_code) {
      navigator.clipboard.writeText(
        pixData.point_of_interaction.transaction_data.qr_code
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaymentConfirmed = async (paymentId?: string) => {
    const leadId = trackingService.getLeadId();
    const utms = trackingService.getUTMs();
    
    // Rastreia confirmação de pagamento
    await trackingService.trackPaymentConfirmed(price, paymentId || `payment_${Date.now()}`);

    // Prepara query params para página de agradecimento
    const queryParams = new URLSearchParams();
    
    Object.entries(utms).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    if (leadId) {
      queryParams.append('lead_id', leadId);
    }
    
    if (paymentId) {
      queryParams.append('payment_id', paymentId);
    }
    
    queryParams.append('session_id', trackingService.getSessionId());
    queryParams.append('payment_amount', price.toString());
    queryParams.append('payment_method', 'pix');
    queryParams.append('timestamp', new Date().toISOString());
    
    // Redireciona para página de agradecimento
    window.location.href = `/obrigado?${queryParams.toString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-green-600" size={32} />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Relatório de Autoridade Digital
          </h3>
          <p className="text-slate-600 mb-6 text-sm">
            Escaneie o QR Code para receber o diagnóstico completo de porque sua clínica não está sendo recomendada pelas IAs.
          </p>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
              <p className="text-slate-600">Gerando código PIX...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-600 text-sm font-semibold">Erro ao gerar pagamento</p>
              </div>
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <button
                onClick={createPixPaymentHandler}
                className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={16} />
                Tentar novamente
              </button>
            </div>
          )}

          {pixData && !loading && !error && (
            <>
              <div className="mb-6 bg-white p-4 border border-slate-200 rounded-xl inline-block shadow-sm">
                {pixData.point_of_interaction?.transaction_data?.qr_code_base64 ? (
                  <img 
                    src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                    alt="Pix QR Code" 
                    className="w-48 h-48"
                  />
                ) : (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.point_of_interaction?.transaction_data?.qr_code || '')}`}
                    alt="Pix QR Code" 
                    className="w-48 h-48 opacity-90"
                  />
                )}
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-6">
                R$ {price.toFixed(2).replace('.', ',')}
              </div>

              <div className="relative mb-4">
                <input 
                  readOnly 
                  value={pixData.point_of_interaction?.transaction_data?.qr_code || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-500 pr-12 font-mono truncate"
                  title={pixData.point_of_interaction?.transaction_data?.qr_code || ''}
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white rounded-md transition-colors text-indigo-600"
                  title="Copiar código PIX"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {pixData.point_of_interaction?.transaction_data?.ticket_url && (
                <a
                  href={pixData.point_of_interaction.transaction_data.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 underline mb-4 block"
                >
                  Ver instruções de pagamento
                </a>
              )}

              <div className="mt-4 text-xs text-slate-500">
                Status: <span className={`font-semibold ${
                  paymentStatus === 'approved' ? 'text-green-600' : 
                  paymentStatus === 'pending' ? 'text-amber-600' : 
                  'text-red-600'
                }`}>
                  {paymentStatus === 'pending' ? 'Aguardando pagamento' : 
                   paymentStatus === 'approved' ? 'Pagamento aprovado!' : 
                   paymentStatus}
                </span>
                {paymentStatus === 'pending' && (
                  <span className="block mt-1 text-xs text-slate-400">
                    Verificando pagamento automaticamente...
                  </span>
                )}
              </div>

              {paymentStatus === 'approved' && (
                <button
                  onClick={() => handlePaymentConfirmed(pixData.id.toString())}
                  className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Continuar
                </button>
              )}
              
              <p className="mt-4 text-xs text-slate-400">
                Liberação imediata do PDF após confirmação.
              </p>
            </>
          )}

          {/* Botão de simulação de pagamento (para desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && !pixData && !loading && (
            <button
              onClick={() => handlePaymentConfirmed()}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Simular Pagamento Confirmado (Dev)
            </button>
          )}
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <span className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ambiente Seguro - Processamento Instantâneo
          </span>
        </div>
      </div>
    </div>
  );
};
