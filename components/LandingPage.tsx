import React from 'react';
import { 
  MessageSquare, 
  Zap, 
  Target, 
  ShieldCheck, 
  ArrowRight,
  Bot,
  Star,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Users,
  Layers,
  Search
} from 'lucide-react';
import { AnimatedText } from './ui/AnimatedText';

interface LandingPageProps {
  onOpenForm: () => void;
  userCity?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenForm, userCity }) => {
  const cityDisplay = userCity || "sua cidade";

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lib/logo.png" alt="Avestra" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
            <span className="font-display font-bold text-lg md:text-xl text-slate-900">Avestra</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#futuro" className="hover:text-indigo-600 transition-colors">Pacientes & IA</a>
            <a href="#geo" className="hover:text-indigo-600 transition-colors">GEO Odontológico</a>
            <a href="#implementacao" className="hover:text-indigo-600 transition-colors">Implementação</a>
          </div>

          <button 
            onClick={onOpenForm}
            className="bg-indigo-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-xs md:text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            Analisar minha clínica
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] md:text-xs font-bold tracking-wide uppercase mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={12} className="fill-indigo-700 md:w-3.5 md:h-3.5" />
            Estratégia de Posicionamento para Dentistas
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Quando alguém pergunta ao ChatGPT "qual o melhor dentista em {cityDisplay}", <br className="hidden md:block"/>
            <span className="text-indigo-600">sua clínica precisa estar na resposta.</span>
          </h1>
          
          <div className="text-base md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
            Ajudamos clínicas odontológicas a serem 
            <AnimatedText 
              text="citadas, recomendadas e escolhidas" 
              textClassName="text-slate-900 font-extrabold"
              underlineClassName="text-indigo-400"
            />
             por inteligências artificiais como referência local. Não basta mais ter apenas um site.
          </div>
          
          <button 
            onClick={onOpenForm}
            className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 w-full md:w-auto"
          >
            Analisar minha clínica
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* 2. SEÇÃO — “O FUTURO DO SEO É GENERATIVO” */}
      <section id="futuro" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-6">
              Seus pacientes mudaram a forma de buscar
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Pacientes particulares não pesquisam apenas no Google. Eles perguntam diretamente: <strong>"Onde fazer implante dentário com segurança?"</strong> ou <strong>"Qual o melhor ortodontista da região?"</strong> para o ChatGPT, Gemini e Perplexity.
            </p>
            
            <div className="mt-8">
              <button onClick={onOpenForm} className="text-sm font-bold text-slate-500 hover:text-indigo-600 underline underline-offset-4 transition-colors">
                Ver se minha clínica é recomendada hoje
              </button>
            </div>
        </div>
      </section>

      {/* 3. SEÇÃO — LOGOS DAS IAs */}
      <section className="py-10 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Compatível com os principais motores usados por pacientes
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
                  <Cpu size={24}/> OpenAI
                </span>
                <span className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
                  <Bot size={24}/> Gemini
                </span>
                <span className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
                  <Layers size={24}/> Perplexity
                </span>
                <span className="font-display font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
                  <MessageSquare size={24}/> Claude
                </span>
            </div>
         </div>
      </section>

      {/* 4. SEÇÃO — COMO AS IAs DECIDEM (Chat Simulado) */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase mb-4">
                <CheckCircle2 size={14} /> Como funciona na prática
             </div>
             <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
               Você não quer tráfego de curiosos.<br/>Você quer ser a <span className="text-indigo-600">decisão clínica.</span>
             </h2>
             <p className="text-slate-600 text-lg leading-relaxed mb-6">
               Quando um paciente pergunta "Qual especialista em harmonização facial é mais confiável?", a IA processa avaliações, artigos e dados técnicos para entregar <strong>uma única recomendação</strong>.
             </p>
             <p className="text-slate-900 font-medium text-lg border-l-4 border-indigo-600 pl-4">
               Isso é autoridade digital real. É GEO implementado.
             </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl rotate-3 opacity-10 blur-xl"></div>
            <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl relative border border-slate-800">
               <div className="bg-slate-800 rounded-xl p-4 md:p-6 space-y-6">
                  {/* Pergunta */}
                  <div className="flex justify-end">
                     <div className="bg-slate-700 text-white px-4 py-3 rounded-2xl rounded-br-none max-w-[90%] text-sm md:text-base">
                        Qual a melhor clínica para implantes dentários na cidade?
                     </div>
                  </div>

                  {/* Resposta */}
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} className="text-white" />
                     </div>
                     <div className="space-y-3 w-full">
                        <div className="bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm md:text-base shadow-lg">
                           <p className="mb-3">
                              Analisando a taxa de sucesso e avaliações de pacientes, a recomendação principal é a <strong>[Sua Clínica]</strong>.
                           </p>
                           {/* Rich Card */}
                           <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-3 items-center">
                              <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center p-1">
                                 <img src="/lib/logo.png" alt="Avestra" className="w-full h-full object-contain" />
                              </div>
                              <div>
                                 <div className="font-bold text-slate-900 text-sm">Sua Clínica Aqui</div>
                                 <div className="flex text-amber-400 text-xs">★★★★★ (4.9)</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* CTA Adicionado Abaixo da Imagem */}
            <div className="mt-8 flex justify-center">
                <button 
                  onClick={onOpenForm}
                  className="group relative inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1"
                >
                  Quero ser a recomendação
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SEÇÃO — O QUE É GEO */}
      <section id="geo" className="py-16 md:py-24 bg-slate-50">
         <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                  O que é GEO para Dentistas?
               </h2>
               <p className="text-slate-600 text-lg">
                  Generative Engine Optimization (GEO) é a estratégia de adaptar sua presença digital para que os Modelos de Linguagem (LLMs) entendam que você é a autoridade técnica máxima na sua especialidade e região.
               </p>
            </div>

            <div className="max-w-2xl mx-auto">
               <div className="bg-indigo-600 p-8 rounded-2xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full -mr-4 -mb-4"></div>
                  <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                     <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span> O que nós fazemos
                  </h3>
                  <ul className="space-y-3 text-indigo-100 font-medium">
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Autoridade técnica reconhecida</li>
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Recomendação por especialidade</li>
                     <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Posicionamento premium</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 6. SEÇÃO — GEO VS SEO TRADICIONAL */}
      <section className="py-16 md:py-24">
         <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-slate-900 text-center mb-12">
               Por que SEO tradicional não funciona mais para clínicas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-12">
               <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">SEO Tradicional</div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4">Disputa por Cliques</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Foco</span>
                        <span className="font-bold text-slate-700">Palavras-chave</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Resultado</span>
                        <span className="font-bold text-slate-700">Lista com 10 clínicas</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Paciente</span>
                        <span className="font-bold text-slate-700 text-red-500">Confuso com opções</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-indigo-600 shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                     Vantagem Competitiva
                  </div>
                  <div className="text-xs font-bold text-indigo-600 uppercase mb-2">GEO para Dentistas</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Autoridade e Recomendação</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Foco</span>
                        <span className="font-bold text-indigo-600">Contexto e Especialidade</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Resultado</span>
                        <span className="font-bold text-indigo-600">Recomendação direta</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Paciente</span>
                        <span className="font-bold text-green-600">Confia na indicação</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. IMPACTO NO NEGÓCIO & 8. POR QUE AGORA */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 relative z-10">
            <div>
               <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Pacientes qualificados,<br/>não curiosos de preço.
               </h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="bg-indigo-500/20 p-3 rounded-xl h-fit">
                        <Target size={24} className="text-indigo-400"/>
                     </div>
                     <div>
                        <h3 className="font-bold text-lg">Intenção de Tratamento</h3>
                        <p className="text-slate-400 text-sm">Quem pergunta para uma IA sobre saúde já quer resolver o problema. A conversão em consultas particulares é muito superior.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="bg-indigo-500/20 p-3 rounded-xl h-fit">
                        <ShieldCheck size={24} className="text-indigo-400"/>
                     </div>
                     <div>
                        <h3 className="font-bold text-lg">Confiança no Doutor(a)</h3>
                        <p className="text-slate-400 text-sm">Ser recomendado por uma IA gera autoridade imediata. O paciente pensa: "Se a tecnologia indicou, é o melhor especialista".</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
               <h3 className="text-2xl font-bold mb-4">Por que agora?</h3>
               <p className="text-slate-300 mb-6 leading-relaxed">
                  A maioria dos dentistas nem sabe que isso existe. Eles continuam gastando rios de dinheiro em Google Ads e Instagram.
                  <br/><br/>
                  Quem entrar no mundo GEO agora vai dominar as recomendações de IA na sua cidade por anos.
               </p>
               <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold bg-yellow-400/10 px-4 py-2 rounded-lg w-fit">
                  <TrendingUp size={16}/> Janela de oportunidade aberta
               </div>
            </div>
         </div>
      </section>

      {/* 9. IMPLEMENTAÇÃO */}
      <section id="implementacao" className="py-16 md:py-24 bg-white">
         <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                  Como funciona a implementação
               </h2>
               <p className="text-slate-600">
                  Um processo focado em autoridade médica e odontológica.
               </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 relative">
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
               
               {[
                  { icon: Search, title: "Diagnóstico", desc: "Analisamos como o ChatGPT enxerga sua clínica hoje." },
                  { icon: Layers, title: "Estruturação", desc: "Organizamos seus dados clínicos para leitura por IA." },
                  { icon: Bot, title: "Contexto Clínico", desc: "Criamos a semântica que prova sua especialidade." },
                  { icon: Users, title: "Autoridade", desc: "Sua clínica se torna a resposta padrão." }
               ].map((step, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center hover:-translate-y-1 transition-transform duration-300">
                     <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <step.icon size={20} />
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                     <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 10. PARA QUEM É */}
      <section className="py-16 bg-slate-50">
         <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 text-center mb-10">
               Quais especialidades se beneficiam?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-600 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Implantodontia</h3>
                  <p className="text-sm text-slate-600">Pacientes buscam segurança e alta tecnologia para cirurgias complexas.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border-l-4 border-purple-600 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Ortodontia & Estética</h3>
                  <p className="text-sm text-slate-600">Invisalign, lentes e harmonização dependem de prova social e autoridade.</p>
               </div>
               <div className="bg-white p-6 rounded-xl border-l-4 border-blue-600 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Clínica Geral</h3>
                  <p className="text-sm text-slate-600">Ser a referência de confiança da família na região.</p>
               </div>
            </div>
            <p className="text-center mt-8 text-slate-500 font-medium">
               "Não fazemos marketing para dentistas. Fazemos o ChatGPT reconhecer quem é referência."
            </p>
         </div>
      </section>

      {/* 11. CTA FINAL */}
      <section className="py-20 md:py-28 bg-white">
         <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
               Descubra se sua clínica é recomendada por IAs
            </h2>
            <p className="text-lg text-slate-500 mb-10">
               Vamos fazer uma análise inicial do seu posicionamento digital. Se fizer sentido, apresentamos o plano de implementação. Se não, você sai com um diagnóstico gratuito.
            </p>
            <button 
                onClick={onOpenForm}
                className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-lg md:text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105"
            >
                Analisar minha clínica agora
            </button>
            <p className="mt-6 text-xs text-slate-400">
               Sem compromisso. Análise automatizada inicial gratuita.
            </p>
         </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <img src="/lib/logo.png" alt="Avestra" className="h-6 w-6 object-contain" />
                <div>
                   <span className="font-bold text-slate-900 block leading-none">Avestra</span>
                   <span className="text-[10px] text-slate-400">AI Optimization Intelligence</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-slate-500 text-sm">
                    © 2026 Avestra. Todos os direitos reservados.
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
};