import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ChevronRight, PlayCircle } from 'lucide-react';
import { BusinessData } from '../types';

interface HeroProps {
  onSubmit: (data: BusinessData) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BusinessData>({
    name: '',
    category: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.city) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-100 rounded-full blur-[120px] opacity-60 pointer-events-none translate-x-1/4 -translate-y-1/4"></div>

      <nav className="w-full max-w-7xl mx-auto px-6 py-6 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <img src="/lib/logo.png" alt="Avestra" className="h-8 w-8 object-contain" />
           <span className="font-display font-bold text-slate-900 text-xl">Avestra</span>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 gap-12 lg:gap-20 py-10 relative z-10">
        
        {/* Left Content */}
        <div className="max-w-xl w-full space-y-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Nova Tecnologia 2024
             </div>
             <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 leading-tight">
               Sua empresa existe para a <span className="text-indigo-600">Inteligência Artificial?</span>
             </h1>
             <p className="text-lg text-slate-600 leading-relaxed font-sans max-w-lg">
               92% dos consumidores usam o Google para encontrar serviços locais. Descubra agora quanto dinheiro você está perdendo por não estar posicionado no GEO (Generative Engine Optimization).
             </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4 relative">
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Empresa</label>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text"
                   required
                   placeholder="Ex: Clínica Sorriso, Bar do Zé..."
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Categoria</label>
                 <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text"
                     required
                     placeholder="Ex: Dentista"
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 font-medium"
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                   />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cidade</label>
                 <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text"
                     required
                     placeholder="Ex: São Paulo"
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 font-medium"
                     value={formData.city}
                     onChange={e => setFormData({...formData, city: e.target.value})}
                   />
                 </div>
               </div>
             </div>

             <button 
               type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group mt-2"
             >
               GERAR DIAGNÓSTICO GRATUITO
               <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </form>
        </div>

        {/* Right Content - Video Placeholder */}
        <div className="max-w-md w-full relative group cursor-pointer">
           <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-300"></div>
           <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] border-4 border-white flex flex-col">
              {/* Fake Video UI */}
              <div className="flex-1 bg-slate-800 relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1662010021854-e67c538ea7a9?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="text-white fill-white/20" size={40} />
                 </div>
                 
                 {/* Chat Bubble Overlay */}
                 <div className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                          <span className="font-bold text-xs">AI</span>
                       </div>
                       <div className="text-xs text-slate-700 leading-relaxed">
                          "Não encontrei informações recentes sobre horários ou cardápio deste estabelecimento."
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           <p className="text-center mt-4 text-slate-400 text-sm font-medium">Veja o que o ChatGPT fala sobre empresas não otimizadas</p>
        </div>

      </div>
    </div>
  );
};