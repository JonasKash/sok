import React from 'react';
import { Bot, User, Sparkles, AlertTriangle } from 'lucide-react';
import { BusinessData } from '../types';

interface AISimulationProps {
  data: BusinessData;
  businessImage?: string;
}

export const AISimulation: React.FC<AISimulationProps> = ({ data, businessImage }) => {
  // Log para debug
  React.useEffect(() => {
    console.log('🔍 AISimulation renderizado com:', {
      empresa: data.name,
      businessImage: businessImage || 'NÃO FORNECIDA',
      categoria: data.category,
      cidade: data.city
    });
    
    if (businessImage) {
      console.log('🖼️ Logo da empresa recebida no componente:', businessImage);
      console.log('📝 Esta logo será exibida na simulação de IA');
    } else {
      console.warn('⚠️ Nenhuma logo da empresa recebida');
      console.warn('📝 Será usado fallback (logo Avestra)');
      console.warn('🔧 Verifique se a API está retornando businessImage corretamente');
    }
  }, [businessImage, data.name]);

  return (
    <div className="w-full bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden my-6 md:my-8">
      <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 md:p-1.5 rounded-lg">
            <Sparkles size={14} className="text-white md:w-4 md:h-4" />
          </div>
          <span className="font-display font-bold text-slate-700 text-xs md:text-sm">Simulação: ChatGPT / Gemini</span>
        </div>
        <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">
          Potencial Oculto
        </span>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-white">
        {/* User Query */}
        <div className="flex gap-2 md:gap-4 flex-row-reverse">
          <div className="bg-slate-200 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-slate-600 md:w-5 md:h-5" />
          </div>
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-3 md:p-4 rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[80%]">
            <p className="font-medium text-sm md:text-base">
              "Qual o melhor dentista especialista em <span className="font-bold">{data.category}</span> em {data.city}?"
            </p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex gap-2 md:gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
            <Bot size={16} className="text-white md:w-5 md:h-5" />
          </div>
          <div className="space-y-2 max-w-[95%] md:max-w-[90%]">
            <div className="bg-white border border-slate-200 text-slate-700 p-4 md:p-5 rounded-2xl rounded-tl-none shadow-sm relative">
              <p className="text-sm md:text-base leading-relaxed">
                Com base na especialização técnica e avaliações de pacientes na região, a recomendação principal é:
              </p>
              
              <div className="my-3 md:my-4 p-3 md:p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3">
                 {/* Business Image/Logo */}
                 <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg flex-shrink-0 overflow-hidden bg-white border border-slate-200 flex items-center justify-center group relative">
                    {businessImage ? (
                        <>
                          <img 
                            src={businessImage} 
                            alt={`Logo ${data.name}`}
                            className="w-full h-full object-cover"
                            style={{ display: 'block' }}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.error('❌ Erro ao carregar logo da empresa:', businessImage);
                              console.error('📝 URL da imagem que falhou:', businessImage);
                              (e.target as HTMLImageElement).style.display = 'none';
                              const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo') as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                                console.log('🔄 Mostrando fallback Avestra');
                              }
                            }}
                            onLoad={(e) => {
                              console.log('✅ Logo da empresa carregada com sucesso!');
                              console.log('🖼️ URL da logo:', businessImage);
                              const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo') as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'none';
                              }
                            }}
                          />
                          {/* Fallback Logo Avestra (escondido quando imagem carrega) */}
                          <div 
                            className="fallback-logo w-full h-full flex items-center justify-center bg-slate-100 p-1" 
                            style={{ display: 'none', position: 'absolute', top: 0, left: 0 }}
                          >
                            <img src="/logo.png" alt="Avestra" className="w-full h-full object-contain" />
                          </div>
                        </>
                    ) : (
                      // Se não tiver businessImage, mostra fallback
                      <div 
                        className="fallback-logo w-full h-full flex items-center justify-center bg-slate-100 p-1"
                      >
                        <img src="/logo.png" alt="Avestra" className="w-full h-full object-contain" />
                      </div>
                    )}
                 </div>

                 <div>
                    <h4 className="font-bold text-indigo-700 text-base md:text-lg">{data.name}</h4>
                    <div className="flex text-amber-400 text-xs md:text-sm">★★★★★ <span className="text-slate-400 ml-1">(5.0)</span></div>
                    <p className="text-xs text-slate-500 mt-1">Referência em {data.category} e atendimento humanizado.</p>
                 </div>
              </div>

              <p className="text-xs md:text-sm text-slate-600">
                Esta clínica é frequentemente citada por excelência técnica.
              </p>

              {/* Warning Badge */}
              <div className="absolute -bottom-3 right-4 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                <AlertTriangle size={10} />
                Visualização do Potencial GEO
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 px-2">
              *Esta simulação ilustra como você aparecerá após a otimização de Digital Footprint.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Diagnosis */}
      <div className="bg-slate-50 p-4 flex items-start gap-3 text-xs md:text-sm text-slate-600 border-t border-slate-200">
         <div className="bg-indigo-100 p-1 rounded-full shrink-0">
            <Bot size={14} className="text-indigo-600" />
         </div>
         <div>
             <span className="font-bold block mb-0.5 text-indigo-900">Diagnóstico de Autoridade Artificial:</span> 
             Ao contrário do Google, IAs funcionam com "Resposta Única". O objetivo é ser a <strong className="text-indigo-700">única recomendação clínica</strong> para o paciente.
         </div>
      </div>
    </div>
  );
};