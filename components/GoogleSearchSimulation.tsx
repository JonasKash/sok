import React from 'react';
import { Star, MapPin, Globe, Navigation, Search, Map } from 'lucide-react';
import { BusinessData, Competitor } from '../types';

interface GoogleSearchSimulationProps {
  data: BusinessData;
  competitors: Competitor[];
}

export const GoogleSearchSimulation: React.FC<GoogleSearchSimulationProps> = ({ data, competitors }) => {
  // If no competitors returned (rare), use a fallback or show empty state
  const displayCompetitors = competitors.length > 0 ? competitors : [];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-6 md:my-8 font-sans">
      <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-full">
               <Search size={12} className="text-white" />
            </div>
            <span className="font-bold text-slate-700 text-xs md:text-sm">Realidade Atual: Busca Google</span>
         </div>
         <span className="text-[10px] md:text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium border border-red-200">
            Você não aparece aqui
         </span>
      </div>

      <div className="p-4 md:p-6 bg-white relative">
        {/* Fake Search Bar Context */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 bg-slate-100 p-3 rounded-full border border-slate-200 max-w-md">
           <Search size={16} className="text-slate-400 ml-1" />
           <span className="text-slate-900">{data.category} em {data.city}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
           {/* List */}
           <div className="flex-1 space-y-5">
              <h3 className="font-medium text-lg text-slate-900">Empresas</h3>
              
              {displayCompetitors.map((comp, index) => (
                  <div key={index} className="group opacity-70 hover:opacity-100 transition-opacity">
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="font-medium text-[#1a0dab] text-base">{comp.name}</div>
                           <div className="flex items-center gap-1 text-sm mt-1">
                              <span className="font-bold text-slate-700">{comp.rating}</span>
                              <div className="flex text-amber-400 text-xs gap-0.5">
                                 {[...Array(5)].map((_, i) => (
                                     <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                                 ))}
                              </div>
                              <span className="text-slate-500 text-xs">({comp.reviews})</span>
                              <span className="text-slate-500 text-xs">• {data.category}</span>
                           </div>
                           <div className="text-xs text-slate-500 mt-1">{data.city} {comp.address ? `• ${comp.address}` : ''}</div>
                           <div className={`text-xs mt-1 ${comp.status?.includes('Fechado') ? 'text-red-700' : 'text-green-700'}`}>
                               {comp.status || 'Aberto agora'}
                           </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                             <div className="flex flex-col items-center gap-1">
                                 <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-blue-600">
                                    <Globe size={16} />
                                 </div>
                                 <span className="text-[9px] text-blue-600">Site</span>
                             </div>
                             <div className="flex flex-col items-center gap-1">
                                 <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-blue-600">
                                    <Navigation size={16} />
                                 </div>
                                 <span className="text-[9px] text-blue-600">Rotas</span>
                             </div>
                        </div>
                     </div>
                     {index < displayCompetitors.length - 1 && (
                         <div className="h-px bg-slate-100 w-full mt-3"></div>
                     )}
                  </div>
              ))}
           </div>

           {/* Fake Map */}
           <div className="hidden md:block w-5/12 min-h-[300px] bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200">
               {/* Map Pattern Background */}
               <div className="absolute inset-0 opacity-40" style={{ 
                   backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', 
                   backgroundSize: '20px 20px' 
               }}></div>
               
               {/* Roads */}
               <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-white skew-x-12"></div>
               <div className="absolute top-1/2 left-0 right-0 h-2 bg-white -rotate-6"></div>
               <div className="absolute top-0 right-1/4 w-3 bg-white skew-x-[-20deg] h-full"></div>

               {/* Pins */}
               <div className="absolute top-1/4 left-1/4 text-red-600 drop-shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer">
                  <MapPin size={32} fill="currentColor" />
               </div>
               <div className="absolute top-[60%] left-[60%] text-red-600 drop-shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer">
                  <MapPin size={32} fill="currentColor" />
               </div>
               <div className="absolute top-1/3 right-[15%] text-red-600 drop-shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer">
                  <MapPin size={32} fill="currentColor" />
               </div>
               
               {/* Map overlay UI */}
               <div className="absolute top-3 right-3 bg-white shadow-md p-2 rounded-lg cursor-pointer hover:bg-slate-50">
                   <Map size={16} className="text-slate-600"/>
               </div>
           </div>
        </div>
      </div>
       
      {/* Warning footer */}
      <div className="bg-red-50 p-4 flex items-start gap-3 text-xs md:text-sm text-red-800 border-t border-red-100">
         <div className="bg-red-100 p-1 rounded-full shrink-0">
            <Search size={14} className="text-red-600" />
         </div>
         <div>
             <span className="font-bold block mb-0.5">Diagnóstico de Visibilidade:</span> 
             Sua empresa não aparece no Top 3 (Local Pack). Estudos mostram que 60% dos cliques ocorrem nessas três primeiras posições. Você está invisível para a maioria dos clientes.
         </div>
      </div>
    </div>
  );
};