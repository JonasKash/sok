import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle, Smartphone } from 'lucide-react';
import { generatePixCode } from '../services/api';
import { trackingService } from '../services/tracking';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, price }) => {
  const [pixCode, setPixCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && !pixCode) {
      generatePixCode(price).then(setPixCode);
    }
  }, [isOpen, pixCode, price]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirmed = async () => {
    const leadId = trackingService.getLeadId();
    const utms = trackingService.getUTMs();
    
    // Rastreia confirmação de pagamento
    await trackingService.trackPaymentConfirmed(price, `payment_${Date.now()}`);

    // Prepara query params para página de agradecimento
    const queryParams = new URLSearchParams();
    
    Object.entries(utms).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    if (leadId) {
      queryParams.append('lead_id', leadId);
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
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
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

          <div className="mb-6 bg-white p-4 border border-slate-200 rounded-xl inline-block shadow-sm">
             {/* Placeholder for QR Code - In real app, use a QR library */}
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode || 'loading')}`} 
               alt="Pix QR Code" 
               className="w-48 h-48 opacity-90"
             />
          </div>

          <div className="text-3xl font-bold text-indigo-600 mb-6">
            R$ {price.toFixed(2).replace('.', ',')}
          </div>

          <div className="relative">
            <input 
              readOnly 
              value={pixCode} 
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-500 pr-12 font-mono truncate"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white rounded-md transition-colors text-indigo-600"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          </div>
          
          <p className="mt-4 text-xs text-slate-400">
            Liberação imediata do PDF após confirmação.
          </p>

          {/* Botão de simulação de pagamento (para desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handlePaymentConfirmed}
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