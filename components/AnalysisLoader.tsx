import React, { useEffect, useState } from 'react';
import { Loader2, Search, MapPin, BrainCircuit, Server, CheckCircle2 } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete: () => void;
}

const steps = [
  { text: "Analisando concorrentes odontológicos na sua cidade...", icon: MapPin, duration: 2000 },
  { text: "Verificando volume de busca por tratamentos...", icon: Search, duration: 2500 },
  { text: "Verificando como o ChatGPT responde para sua especialidade...", icon: BrainCircuit, duration: 4000 }, 
  { text: "Calculando pacientes que podem estar indo para outras clínicas...", icon: Server, duration: 3000 },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      // Usa a duração específica do passo ou um padrão de 2s
      const stepDuration = steps[currentStep].duration;
      
      const timeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, stepDuration);
      
      return () => clearTimeout(timeout);
    } else {
      // Aguarda um pouco mais após completar todos os passos antes de liberar
      // Isso evita o "pulo" abrupto para o dashboard
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(finishTimeout);
    }
  }, [currentStep, onComplete]);

  // Calcula a porcentagem de progresso baseada no passo atual
  const progress = Math.min(((currentStep) / steps.length) * 100, 100);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center relative overflow-hidden">
        
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-8 relative flex justify-center mt-4">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
          Analisando seu posicionamento digital
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Estamos varrendo bases de dados públicas e simulações de IA. Por favor, aguarde.
        </p>

        <div className="space-y-5 text-left bg-slate-50 p-6 rounded-xl border border-slate-100">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors duration-300 ${
                  isCompleted ? 'bg-green-100 text-green-600' : 
                  isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={18} />
                  ) : isActive ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                
                <span className={`font-medium text-sm md:text-base flex-1 ${
                  isActive ? 'text-indigo-900 font-semibold' : 
                  isCompleted ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {step.text}
                </span>

                {isActive && (
                  <span className="text-xs font-bold text-indigo-600 animate-pulse whitespace-nowrap">
                    Processando...
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-xs text-slate-400">
          Isso pode levar alguns segundos. Não feche a página.
        </div>
      </div>
    </div>
  );
};