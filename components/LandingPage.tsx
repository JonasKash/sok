import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Target,
  ShieldCheck,
  Search,
  Users,
  Sparkles,
  BarChart3,
  FileText,
  Star,
  Settings2,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { TextLoop } from './ui/TextLoop';
import { CategoryList } from './ui/CategoryList';
import { Card, CardContent, CardHeader } from './ui/card';

interface LandingPageProps {
  onOpenForm: () => void;
  userCity?: string;
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div aria-hidden className="relative mx-auto w-36 h-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
    <div className="absolute inset-0 [--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
    <div className="bg-[#1A1A1A] absolute inset-0 m-auto flex w-12 h-12 items-center justify-center border-t border-l border-slate-700 rounded-tl-lg">
      {children}
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenForm, userCity }) => {
  const cityDisplay = userCity || "sua cidade";
  const fadeInRefs = useRef<(HTMLElement | null)[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Intersection Observer para animações fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeInRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      fadeInRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !fadeInRefs.current.includes(el)) {
      fadeInRefs.current.push(el);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans text-white antialiased">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full z-50 bg-[#111111]/80 backdrop-blur-xl border-b border-slate-700/50 transition-all shadow-2xl shadow-black/20"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <img src="/logo.png" alt="Avestra" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
            <span className="font-display font-bold text-lg md:text-xl text-white">Avestra</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <motion.a 
              href="#features" 
              className="hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Análise Gratuita
            </motion.a>
            <motion.a 
              href="#como-funciona" 
              className="hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Como Funciona
            </motion.a>
            <motion.a 
              href="#casos" 
              className="hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Resultados
            </motion.a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <motion.button 
              onClick={onOpenForm}
              className="hidden md:block text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Entrar
            </motion.button>
            <motion.button 
              onClick={onOpenForm}
              className="bg-blue-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-2xl font-semibold text-xs md:text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50 whitespace-nowrap"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="hidden sm:inline">Quero Aparecer no ChatGPT</span>
              <span className="sm:hidden">Começar</span>
            </motion.button>
            
            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-slate-700/50 bg-[#111111]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <motion.a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-base font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Análise Gratuita
              </motion.a>
              <motion.a
                href="#como-funciona"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-base font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Como Funciona
              </motion.a>
              <motion.a
                href="#casos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-blue-400 transition-colors text-base font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Resultados
              </motion.a>
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenForm();
                }}
                className="block w-full py-2 text-slate-300 hover:text-blue-400 transition-colors text-base font-medium text-left"
                whileTap={{ scale: 0.98 }}
              >
                Entrar
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-12 md:pt-40 md:pb-32 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-green-500/10"
            >
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-md text-[10px]">✓</span>
              <span>Análise Gratuita</span>
            </motion.div>
            
            {/* Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.1] mb-4 md:mb-6 tracking-tight px-2"
            >
              Faça sua clínica ser recomendada por:
              <br className="hidden sm:block" />
              <span className="sm:inline-block sm:mt-2">
                <TextLoop interval={2} className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">ChatGPT</span>
                  <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Gemini</span>
                  <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Perplexity</span>
                </TextLoop>
              </span>
            </motion.h1>
            
            {/* Hero Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-6 md:mb-10 px-4"
            >
              70% dos pacientes agora consultam o ChatGPT, Claude e Perplexity antes de escolher uma clínica. Se você não aparece lá, está perdendo pacientes para seus concorrentes todos os dias.
            </motion.p>
            
            {/* CTA Group */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-12 md:mb-16 px-4"
            >
              <motion.button 
                onClick={onOpenForm}
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-base lg:text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/50 w-full sm:w-auto min-h-[48px]"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Quero Aparecer no ChatGPT
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
              <motion.button 
                onClick={onOpenForm}
                className="group relative inline-flex items-center justify-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-sm text-blue-400 border-2 border-blue-600/50 px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-base lg:text-lg hover:bg-[#1F1F1F] hover:border-blue-600 transition-all shadow-lg shadow-black/20 w-full sm:w-auto min-h-[48px]"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Ver Demonstração
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
            </motion.div>

            {/* Hero Image - Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="relative mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-700/50 bg-[#0A0A0A]"
            >
              <div className="relative w-full">
                {/* Dashboard Image */}
                <img 
                  src="/Dashboard Screen.png" 
                  alt="Dashboard Avestra - Análise de Autoridade Digital"
                  className="w-full h-auto object-contain rounded-3xl"
                />
              </div>
              
              {/* Overlay com título do Dashboard */}
              <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                <div className="w-10 h-10 bg-blue-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 border border-blue-700/30">
                  <Bot className="text-blue-400" size={20} />
                </div>
                <div className="bg-[#111111]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 shadow-lg">
                  <div className="font-bold text-white text-sm">Análise de Autoridade Digital</div>
                  <div className="text-xs text-slate-400">Dashboard Avestra</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. LOGO GRID - Social Proof */}
      <section className="py-12 md:py-24 border-y border-slate-700/50 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8 px-4"
          >
            Clínicas que já dominam a busca por IA
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-20 mb-6 md:mb-8">
            {[
              { icon: Cpu, name: "OpenAI" },
              { icon: Bot, name: "Gemini" },
              { icon: Layers, name: "Perplexity" },
              { icon: MessageSquare, name: "Claude" }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-2 text-slate-300 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                whileHover={{ scale: 1.1 }}
              >
                <item.icon size={28} strokeWidth={2} />
                <span className="font-display font-bold text-xl">{item.name}</span>
              </motion.div>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-xs sm:text-sm md:text-base text-slate-400 px-4"
          >
            +150 clínicas médicas já aparecem como primeira opção quando pacientes perguntam à IA
          </motion.p>
        </div>
      </section>

      {/* 3. FEATURE SECTION 1 - Análise Gratuita */}
      <section 
        id="features"
        ref={addToRefs}
        className="fade-in-section py-16 md:py-24 lg:py-36 bg-[#0A0A0A]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-xs font-bold uppercase mb-6 shadow-lg shadow-green-500/10"
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                <span>Análise Gratuita</span>
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
                Descubra se sua clínica aparece quando pacientes perguntam à IA
              </h2>
              <p className="text-base sm:text-lg text-slate-400 mb-6 md:mb-8 leading-relaxed">
                Testamos sua clínica em ChatGPT, Claude e Perplexity e mostramos exatamente onde você está perdendo pacientes.
              </p>
              <motion.button 
                onClick={onOpenForm}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 md:px-6 md:py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all mb-6 md:mb-8 shadow-xl shadow-blue-900/50 text-sm md:text-base min-h-[48px]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Testar Minha Clínica Grátis
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </motion.button>

              {/* Feature Points */}
              <div className="space-y-4 mt-12">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      <strong>Teste em 5+ plataformas de IA</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      <strong>Comparação com concorrentes</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      <strong>Pontos de melhoria específicos</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      <strong>Estimativa de pacientes perdidos</strong>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-700/50">
                <div className="bg-gradient-to-br from-[#151515] to-[#1A1A1A] p-8 backdrop-blur-sm">
                  <div className="bg-[#111111]/80 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-slate-700/50 shadow-xl shadow-black/30">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white">Score de Visibilidade em IA</div>
                      <div className="text-2xl font-bold text-blue-400">87/100</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "87%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-blue-600 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Menções no ChatGPT</span>
                        <span className="font-bold text-white">24</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Recomendações no Gemini</span>
                        <span className="font-bold text-white">18</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Citações no Perplexity</span>
                        <span className="font-bold text-white">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SECTION 2 - O Problema */}
      <section 
        id="problema"
        ref={addToRefs}
        className="fade-in-section py-16 md:py-24 lg:py-36 bg-[#111111]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-tight px-4">
              O jeito que pacientes encontram clínicas mudou para sempre
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Antes (Google) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="text-blue-400 font-bold text-sm uppercase mb-4">Antes (Google)</div>
              <div className="space-y-3 text-slate-300 text-sm">
                <p>Paciente pesquisava no Google</p>
                <ArrowRight className="text-slate-500" size={16} strokeWidth={2} />
                <p>Via 10 resultados</p>
                <ArrowRight className="text-slate-500" size={16} strokeWidth={2} />
                <p>Clicava em 3-4 sites</p>
                <ArrowRight className="text-slate-500" size={16} strokeWidth={2} />
                <p>Comparava sozinho</p>
              </div>
            </motion.div>

            {/* Agora (IA) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-blue-600/50 rounded-2xl p-6 shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="text-green-400 font-bold text-sm uppercase mb-4">Agora (IA)</div>
              <div className="space-y-3 text-slate-300 text-sm">
                <p>Paciente pergunta ao ChatGPT</p>
                <ArrowRight className="text-blue-400" size={16} strokeWidth={2} />
                <p>Recebe 1-3 recomendações</p>
                <ArrowRight className="text-blue-400" size={16} strokeWidth={2} />
                <p>Decide na hora</p>
                <ArrowRight className="text-blue-400" size={16} strokeWidth={2} />
                <p>Agenda diretamente</p>
              </div>
            </motion.div>

            {/* Resultado */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm border border-red-700/50 rounded-2xl p-6 shadow-xl shadow-red-900/20 hover:shadow-2xl hover:shadow-red-900/30 transition-all"
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="text-red-400 font-bold text-sm uppercase mb-4">Resultado</div>
              <p className="text-white font-semibold leading-relaxed">
                Se sua clínica não está nessas 1-3 recomendações, você não existe para esse paciente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FEATURE SECTION 3 - A Solução */}
      <section 
        id="como-funciona"
        ref={addToRefs}
        className="fade-in-section py-16 md:py-24 lg:py-36 bg-[#0A0A0A]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-400 text-xs font-bold uppercase mb-4 md:mb-6 shadow-lg shadow-blue-500/10">
              Como Funciona
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-tight px-4">
              Colocamos sua clínica como primeira recomendação em respostas de IA
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <CategoryList
              title=""
              subtitle=""
              categories={[
                {
                  id: 1,
                  title: "Passo 1 - Análise",
                  subtitle: "Analisamos sua presença atual. Testamos sua clínica em 5+ plataformas de IA e identificamos onde você está perdendo pacientes.",
                  icon: <span>📊</span>,
                },
                {
                  id: 2,
                  title: "Passo 2 - Otimização",
                  subtitle: "Otimizamos seu conteúdo. Criamos e otimizamos conteúdo específico para fazer a IA recomendar sua clínica.",
                  icon: <span>🚀</span>,
                },
                {
                  id: 3,
                  title: "Passo 3 - Monitoramento",
                  subtitle: "Acompanhamos resultados. Você vê em tempo real quantas vezes sua clínica é recomendada e quantos pacientes chegam.",
                  icon: <span>📈</span>,
                },
              ]}
              className="p-0"
            />
          </motion.div>
        </div>
      </section>

      {/* 6. RESULTADOS */}
      <section 
        id="casos"
        ref={addToRefs}
        className="fade-in-section py-16 md:py-24 lg:py-36 bg-[#111111]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-10 md:mb-16 text-center px-4"
          >
            Resultados reais de clínicas reais
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="text-sm text-blue-400 font-semibold mb-2">Clínica Odontológica - SP</div>
              <p className="text-white font-bold text-lg mb-4">"Aumentamos em 340% as recomendações do ChatGPT em 45 dias"</p>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <p><strong className="text-white">Antes:</strong> 2 menções/mês</p>
                <p><strong className="text-white">Depois:</strong> 78 menções/mês</p>
              </div>
              <div className="text-green-400 font-bold">+23 pacientes novos via IA</div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="text-sm text-blue-400 font-semibold mb-2">Clínica Dermatológica - RJ</div>
              <p className="text-white font-bold text-lg mb-4">"De invisível a primeira opção em 30 dias"</p>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <p><strong className="text-white">Antes:</strong> 0 menções</p>
                <p><strong className="text-white">Depois:</strong> 1ª recomendação em 85% das buscas</p>
              </div>
              <div className="text-green-400 font-bold">+31 pacientes novos/mês</div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="text-sm text-blue-400 font-semibold mb-2">Clínica de Estética - MG</div>
              <p className="text-white font-bold text-lg mb-4">"ROI de 8x no primeiro mês"</p>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <p><strong className="text-white">Investimento:</strong> R$ 3.500</p>
                <p><strong className="text-white">Retorno:</strong> R$ 28.400 em novos pacientes</p>
              </div>
              <div className="text-green-400 font-bold">ROI: 8x</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES PRINCIPAIS */}
      <section 
        ref={addToRefs}
        className="fade-in-section py-24 md:py-36 bg-[#0A0A0A] text-white relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl text-white mb-4">
              Soluções completas para sua clínica
            </h2>
            <p className="text-slate-400 text-lg">
              Tudo que você precisa para ser recomendado pelas principais IAs do mercado
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="group shadow-black/5 h-full">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <BarChart3 className="size-6 text-blue-400" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-white text-lg">Monitoramento em Tempo Real</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Veja exatamente quando e como sua clínica é mencionada em respostas de IA. Dashboard atualizado diariamente, alertas de novas menções, comparação com concorrentes e relatórios semanais.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="group shadow-black/5 h-full">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <FileText className="size-6 text-blue-400" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-white text-lg">Criação de Conteúdo Otimizado</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Criamos conteúdo específico para fazer a IA recomendar sua clínica. Artigos otimizados para IA, FAQs estratégicas, casos de sucesso e conteúdo técnico especializado.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="group shadow-black/5 h-full">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Star className="size-6 text-blue-400" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-white text-lg">Gestão de Presença em IA</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Garantimos que a IA fala positivamente sobre sua clínica. Monitoramento de sentimento, correção de informações erradas, destaque de diferenciais e gestão de reviews e citações.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-16 md:py-24 lg:py-36 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 px-4"
          >
            Pare de perder pacientes para clínicas que aparecem na IA
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-400 mb-6 leading-relaxed max-w-2xl mx-auto px-4"
          >
            A cada dia que passa, mais pacientes usam ChatGPT para escolher clínicas. Seus concorrentes já estão se posicionando. Não fique para trás.
          </motion.p>
          
          {/* Urgência */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-yellow-400 text-xs sm:text-sm font-bold bg-yellow-400/10 backdrop-blur-sm border border-yellow-400/30 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl w-fit mx-auto mb-6 md:mb-8 shadow-lg shadow-yellow-400/10"
          >
            <span>⏰</span>
            <span className="whitespace-nowrap">Apenas 3 vagas disponíveis este mês</span>
          </motion.div>
          <p className="text-xs text-slate-500 mb-6 md:mb-8 px-4">(Limitamos para garantir qualidade de atendimento)</p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8 px-4"
          >
            <motion.button 
              onClick={onOpenForm}
              className="bg-blue-600 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/50 min-h-[48px] w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Quero Testar Minha Clínica Grátis
            </motion.button>
            <motion.button 
              onClick={onOpenForm}
              className="bg-[#1A1A1A]/80 backdrop-blur-sm text-blue-400 border-2 border-blue-600/50 px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-[#1F1F1F] hover:border-blue-600 transition-all shadow-lg shadow-black/20 min-h-[48px] w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Agendar Conversa com Especialista
            </motion.button>
          </motion.div>

          {/* Garantia */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 max-w-xl mx-auto shadow-xl shadow-green-900/10"
          >
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold mb-2">
              <CheckCircle2 size={18} strokeWidth={2} />
              <span>Garantia de 60 dias</span>
            </div>
            <p className="text-sm text-slate-400">
              Se você não ver aumento mensurável em menções, devolvemos 100% do investimento.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-slate-700 py-10 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Footer CTA */}
          <div className="text-center pb-8 md:pb-12 border-b border-slate-700 mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8 px-4">
              Pronto para dominar a busca por IA?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <motion.button 
                onClick={onOpenForm}
                className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-700 transition-all shadow-md shadow-blue-900/50 min-h-[48px] w-full sm:w-auto"
                whileTap={{ scale: 0.98 }}
              >
                Começar Agora
              </motion.button>
              <motion.button 
                onClick={onOpenForm}
                className="bg-[#1A1A1A] text-blue-400 border-2 border-blue-600 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-[#1F1F1F] transition-all min-h-[48px] w-full sm:w-auto"
                whileTap={{ scale: 0.98 }}
              >
                Falar com Especialista
              </motion.button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Recursos</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Blog</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Clientes</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Documentação</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Empresa</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Sobre</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Carreiras</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Contato</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Plataforma</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Funcionalidades</a>
                <a href="#como-funciona" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Como Funciona</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Preços</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacidade</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Termos</a>
                <a href="#" className="block text-sm text-slate-400 hover:text-blue-400 transition-colors">Segurança</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Avestra" className="h-6 w-6 object-contain" />
              <span className="font-bold text-white">Avestra</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Avestra. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
