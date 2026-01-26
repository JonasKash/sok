import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Bypass para usuário de teste
    if (email === 'test@avestra.app' && password === '123123') {
      setTimeout(() => {
        onLoginSuccess?.();
        onClose();
        setEmail('');
        setPassword('');
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Verifica se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      setError('Sistema de autenticação não configurado. Por favor, configure o Supabase.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Cadastro
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          setError('');
          alert('Cadastro realizado! Verifique seu email para confirmar a conta.');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        // Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          setError('');
          onLoginSuccess?.();
          onClose();
          setEmail('');
          setPassword('');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#111111] border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Crie sua conta para acessar o painel' : 'Acesse sua conta'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 flex items-center gap-3"
              >
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </button>

            {/* Toggle Sign Up / Sign In */}
            <div className="text-center pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                {isSignUp ? (
                  <>Já tem uma conta? <span className="text-blue-400 font-semibold">Entrar</span></>
                ) : (
                  <>Não tem uma conta? <span className="text-blue-400 font-semibold">Criar conta</span></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

