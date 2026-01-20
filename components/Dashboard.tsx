import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Lock, TrendingDown, AlertTriangle, ArrowRight, EyeOff, 
  ExternalLink, Calculator, TrendingUp, Gauge, Zap, Globe, AlertOctagon, UserX 
} from 'lucide-react';
import { BusinessData, AnalysisResult } from '../types';
import { AISimulation } from './AISimulation';
import { GoogleSearchSimulation } from './GoogleSearchSimulation';
import { PaymentModal } from './PaymentModal';
import { CheckoutFormModal } from './CheckoutFormModal';
import { trackingService } from '../services/tracking';

interface DashboardProps {
  businessData: BusinessData;
  results: AnalysisResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ businessData, results }) => {
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Valores seguros com fallback
  const monthlySearchVolume = results.monthlySearchVolume || 0;
  const estimatedLostRevenue = results.estimatedLostRevenue || 0;
  const score = results.score || 0;

  const chartData = [
    { name: 'Pacientes Atuais', value: Math.round(monthlySearchVolume * 0.02), color: '#94a3b8' },
    { name: 'Potencial', value: monthlySearchVolume, color: '#4f46e5' },
  ];

  // Cálculo reverso para explicação
  const ticketMedioEstimado = monthlySearchVolume > 0 
    ? Math.round(estimatedLostRevenue / (monthlySearchVolume * 0.07)) 
    : 0;
  const pacientesPerdidos = ticketMedioEstimado > 0 
    ? Math.round(estimatedLostRevenue / ticketMedioEstimado) 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Avestra" className="h-8 w-8 object-contain" />
            <span className="font-bold text-slate-800 hidden sm:block">Avestra</span>
          </div>
          <div className="text-xs md:text-sm text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
            Auditoria para: <span className="text-indigo-600 font-bold">{businessData.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 md:space-y-12">
        
        {/* Hero Card: Lost Patients/Revenue */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-red-50 p-4 md:p-6 border-b border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-red-800 font-bold flex items-center gap-2 text-base md:text-lg">
                        <UserX size={20} className="md:w-6 md:h-6" />
                        Pacientes em potencial perdidos
                    </h2>
                    <p className="text-red-600/80 text-xs md:text-sm mt-1">
                        Pessoas buscando "{businessData.category}" em {businessData.city} que não te encontram.
                    </p>
                </div>
                <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-sm border border-red-100 w-full md:w-auto text-right md:text-left">
                    <span className="block text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Perda estimada de faturamento</span>
                    <span className="text-xl md:text-3xl font-display font-black text-slate-900 block md:inline">
                        {estimatedLostRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[10px] md:text-xs text-red-500 font-bold block md:inline md:ml-1">/mês</span>
                </div>
            </div>

            <div className="p-5 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Esses pacientes normalmente escolhem clínicas que as IAs reconhecem como referência. Identificamos que <strong className="text-slate-900">{results.competitorsCount} concorrentes</strong> estão melhor posicionados que você.
                        </p>
                    </div>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <span className="text-slate-400 text-xs font-bold uppercase">Volume de Busca</span>
                            <div className="text-lg md:text-xl font-bold text-slate-800">{monthlySearchVolume}</div>
                         </div>
                         <div>
                            <span className="text-slate-400 text-xs font-bold uppercase">Score GEO</span>
                            <div className="text-lg md:text-xl font-bold text-red-600">{score}/100</div>
                         </div>
                    </div>
                </div>
                
                <div className="h-40 md:h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                             <XAxis type="number" hide />
                             <YAxis type="category" dataKey="name" width={90} tick={{fontSize: 11}} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                             <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>

        {/* Technical Performance Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 p-4 md:p-6 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Gauge size={20} className="text-indigo-600" />
                    Auditoria Técnica & Performance
                </h3>
                <span className="text-[10px] md:text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">
                   Análise IA
                </span>
             </div>

             <div className="p-5 md:p-8 grid md:grid-cols-3 gap-8">
                 {/* Left: Score Circle */}
                 <div className="flex flex-col items-center justify-center text-center">
                     <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-8 flex items-center justify-center mb-3 ${getScoreColor(results.techScore)}`}>
                        <div className="flex flex-col">
                            <span className="text-2xl md:text-4xl font-black">{results.techScore}</span>
                            <span className="text-[10px] font-bold uppercase">Tech Score</span>
                        </div>
                     </div>
                     <div className="text-sm font-medium text-slate-500 flex items-center gap-1">
                        {results.websiteUrl ? (
                           <a href={results.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 truncate max-w-[150px]">
                              <Globe size={12} /> {results.websiteUrl.replace(/^https?:\/\//, '')}
                           </a>
                        ) : (
                           <span className="text-red-500 flex items-center gap-1"><AlertOctagon size={12} /> Site não encontrado</span>
                        )}
                     </div>
                 </div>

                 {/* Right: Issues List */}
                 <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
                       <Zap size={16} className="text-amber-500" />
                       Problemas Críticos Detectados
                    </h4>
                    <div className="space-y-3">
                       {results.techIssues && results.techIssues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-red-50/50 p-3 rounded-lg border border-red-100">
                             <div className="mt-0.5 bg-red-100 text-red-600 p-1 rounded-full shrink-0">
                                <AlertTriangle size={14} />
                             </div>
                             <div>
                                <p className="text-sm font-medium text-slate-800">{issue}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Impacta diretamente a recomendação por IAs.</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
             </div>
        </section>

        {/* Comparison Section */}
        <section>
            <div className="mb-6 px-2">
                <h3 className="text-lg md:text-xl font-display font-bold text-slate-900">
                    Realidade vs. Oportunidade
                </h3>
                <p className="text-slate-500 text-xs md:text-sm">
                    Veja onde você está hoje e onde poderia estar com a otimização correta.
                </p>
            </div>

            {/* 1. Google Search Reality (Real Data) */}
            <GoogleSearchSimulation data={businessData} competitors={results.competitorsList} />

            {/* 2. AI Simulation (Existing) */}
            <div className="relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
                     <div className="bg-indigo-100 p-2 rounded-full border border-indigo-200">
                        <ArrowRight className="text-indigo-600 rotate-90" />
                     </div>
                </div>
                <AISimulation data={businessData} businessImage={results.businessImage} />
            </div>
        </section>

        {/* Locked Report Section (The Hook) */}
        <section className="relative pt-8 md:pt-10">
            <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 mb-4 md:mb-6 px-2 flex items-center gap-2">
                <EyeOff size={20} className="text-slate-400 md:w-6 md:h-6" />
                Diagnóstico Detalhado de Erros
            </h3>

            {/* Background (Blurred Content) */}
            <div className="grid gap-3 md:gap-4 opacity-50 blur-[6px] select-none pointer-events-none">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 flex gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-red-500" size={20} />
                        </div>
                        <div className="space-y-2 w-full">
                            <div className="h-3 md:h-4 bg-slate-200 rounded w-1/3"></div>
                            <div className="h-2.5 md:h-3 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-2.5 md:h-3 bg-slate-100 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* The Paywall Card */}
            <div className="absolute top-24 md:top-20 left-0 right-0 z-10 flex flex-col items-center px-4">
                <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-200/50 text-center max-w-md w-full hover:scale-[1.02] transition-transform duration-300">
                    <div className="bg-amber-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                        <Lock className="text-amber-600 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    
                    <h4 className="text-xl md:text-2xl font-display font-bold text-slate-900 mb-3">
                        Relatório de Autoridade Digital para Clínicas Odontológicas
                    </h4>
                    
                    <p className="text-slate-600 font-inter mb-6 md:mb-8 text-sm leading-relaxed">
                        Descubra por que sua clínica ainda não é reconhecida pelas IAs como referência e quais ajustes são necessários.
                    </p>

                    <button 
                        onClick={async () => {
                          // Rastreia clique no checkout
                          await trackingService.trackCheckoutClick(29.90);
                          setIsCheckoutFormOpen(true);
                        }}
                        className="w-full bg-indigo-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        DESBLOQUEAR POR R$ 29,90
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-400">
                        <Lock size={12} /> Pagamento Único • Acesso Imediato
                    </div>
                </div>
            </div>
        </section>

        {/* Nova Seção: Explicação da Matemática */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 p-4 md:p-6">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calculator size={16} className="text-indigo-600" />
                    Entenda a Matemática deste Cálculo
                </h3>
             </div>
             
             <div className="p-5 md:p-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative pl-4 border-l-2 border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Passo 1: Demanda</span>
                        <div className="text-slate-800 font-semibold text-sm mb-1">
                            {monthlySearchVolume} pessoas/mês
                        </div>
                        <p className="text-xs text-slate-500 leading-snug">
                            Buscam ativamente por "{businessData.category}" na região de {businessData.city}.
                        </p>
                    </div>

                    <div className="relative pl-4 border-l-2 border-red-200">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide block mb-1">Passo 2: Pacientes Perdidos</span>
                        <div className="text-red-700 font-semibold text-sm mb-1">
                            ~{pacientesPerdidos} pacientes não agendados
                        </div>
                        <p className="text-xs text-slate-500 leading-snug">
                            Estimativa conservadora de 7% da demanda que não encontra sua clínica no topo.
                        </p>
                    </div>

                    <div className="relative pl-4 border-l-2 border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Passo 3: Impacto</span>
                        <div className="text-slate-800 font-semibold text-sm mb-1">
                            Ticket Médio Est. ~R$ {ticketMedioEstimado},00
                        </div>
                        <p className="text-xs text-slate-500 leading-snug">
                            Tratamentos de alto valor que estão indo para concorrentes visíveis.
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-white border border-indigo-100 rounded-xl p-4 flex gap-4 items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900 mb-1">Otimização Odontológica</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            A otimização GEO não é gasto, é investimento para capturar pacientes qualificados que já procuram seus serviços.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Sources Section */}
        {results.sources.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
             <h4 className="text-xs md:text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Fontes de Dados</h4>
             <div className="flex flex-wrap gap-2">
                {results.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] md:text-xs transition-colors max-w-full truncate"
                  >
                    {source.title} <ExternalLink size={10} className="shrink-0" />
                  </a>
                ))}
             </div>
          </section>
        )}

      </main>

      <CheckoutFormModal
        isOpen={isCheckoutFormOpen}
        onClose={() => setIsCheckoutFormOpen(false)}
        onContinue={(whatsapp) => {
          setIsCheckoutFormOpen(false);
          setIsModalOpen(true);
        }}
        businessData={businessData}
      />

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        price={29.90} 
      />
    </div>
  );
};