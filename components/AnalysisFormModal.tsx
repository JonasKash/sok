import React, { useState, useEffect } from 'react';
import { X, Search, Briefcase, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { BusinessData } from '../types';

interface AnalysisFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessData) => void;
  initialCity?: string;
}

export const AnalysisFormModal: React.FC<AnalysisFormModalProps> = ({ isOpen, onClose, onSubmit, initialCity }) => {
  const [formData, setFormData] = useState<BusinessData>({
    name: '',
    category: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when initialCity changes or modal opens, 
  // but only if the user hasn't typed in the city field yet (or if it's empty)
  useEffect(() => {
    if (initialCity && !formData.city) {
      setFormData(prev => ({ ...prev, city: initialCity }));
    }
  }, [initialCity, formData.city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.city) {
      setIsLoading(true);
      // Small artificial delay for UX before transitioning to the loader screen
      setTimeout(() => {
        onSubmit(formData);
        setIsLoading(false);
      }, 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[#111111] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-[#1A1A1A]">
          <h3 className="font-display font-bold text-lg text-white">
            Análise de Visibilidade Odontológica
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
             <h4 className="text-2xl font-display font-bold text-white mb-2">
               Vamos encontrar sua clínica
             </h4>
             <p className="text-slate-400 text-sm">
               Preencha os dados abaixo para que nossa IA possa varrer o Google e os principais modelos de linguagem.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Clínica</label>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text"
                   required
                   autoFocus
                   placeholder="Ex: Clínica Sorriso, Dr. João Silva..."
                   className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white font-medium"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Especialidade Principal</label>
                 <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                     type="text"
                     required
                     placeholder="Ex: Implantes, Ortodontia"
                     className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white font-medium"
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
                     className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white font-medium"
                     value={formData.city}
                     onChange={e => setFormData({...formData, city: e.target.value})}
                   />
                 </div>
               </div>
             </div>

             <button 
               type="submit"
               disabled={isLoading}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isLoading ? (
                 <Loader2 className="animate-spin" />
               ) : (
                 <>
                   GERAR DIAGNÓSTICO GRATUITO
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
             
             <p className="text-center text-xs text-slate-400 mt-4">
               Ao continuar, você concorda com a análise pública de dados do seu estabelecimento.
             </p>
          </form>
        </div>
      </div>
    </div>
  );
};