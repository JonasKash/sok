import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AnalysisLoader } from './components/AnalysisLoader';
import { Dashboard } from './components/Dashboard';
import { AnalysisFormModal } from './components/AnalysisFormModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { UTMGenerator } from './components/UTMGenerator';
import { ThankYouPage } from './components/ThankYouPage';
import { analyzeBusiness } from './services/api';
import { trackingService } from './services/tracking';
import { BusinessData, ViewState, AnalysisResult } from './types';

const ADMIN_EMAIL = 'jonasav21@gmail.com';
const ADMIN_PASSWORD = 'teste123adminteste123';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUTMGenerator, setShowUTMGenerator] = useState(false);

  // Verifica rotas especiais
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path === '/obrigado') {
      // Página de agradecimento - será renderizada abaixo
      return;
    }
    
    if (params.get('admin') === 'true') {
      setShowAdmin(true);
    }
    if (params.get('utm_generator') === 'true') {
      setShowUTMGenerator(true);
    }
  }, []);

  // Rastreia PageView da landing page
  useEffect(() => {
    if (view === 'hero' && !showAdmin) {
      trackingService.trackEvent('landing_page_view');
    }
  }, [view, showAdmin]);

  // Fetch geolocation on mount with multiple fallbacks
  useEffect(() => {
    // Try multiple geolocation APIs for better reliability
    const fetchGeolocation = async () => {
      // Try ipapi.co first (most reliable for city names)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            // Normalize city name (trim and ensure proper format)
            const normalizedCity = data.city.trim();
            console.log('City detected via ipapi.co:', normalizedCity, 'Raw data:', data);
            setUserCity(normalizedCity);
            return;
          } else {
            console.warn('ipapi.co returned data but no city field:', data);
          }
        }
      } catch (err) {
        console.warn("ipapi.co failed, trying alternative...", err);
      }

      // Fallback to ip-api.com (free tier)
      try {
        const res = await fetch('https://ip-api.com/json/?fields=city');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            const normalizedCity = data.city.trim();
            console.log('City detected via ip-api.com:', normalizedCity);
            setUserCity(normalizedCity);
            return;
          } else {
            console.warn('ip-api.com returned data but no city field:', data);
          }
        }
      } catch (err) {
        console.warn("ip-api.com failed, trying geojs...", err);
      }

      // Fallback to geojs.io
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            const normalizedCity = data.city.trim();
            console.log('City detected via geojs.io:', normalizedCity);
            setUserCity(normalizedCity);
            return;
          } else {
            console.warn('geojs.io returned data but no city field:', data);
          }
        }
      } catch (err) {
        console.warn("geojs.io failed:", err);
      }

      console.warn("Could not detect city automatically. User will need to enter manually.");
    };

    fetchGeolocation();
  }, []);

  const handleStartAnalysis = async (data: BusinessData) => {
    setIsFormOpen(false);
    
    // Rastreia submissão do formulário
    await trackingService.trackFormSubmit(data);
    
    setBusinessData(data);
    setView('analyzing');
    
    const analysisResults = await analyzeBusiness(data);
    setResults(analysisResults);
    
    // Rastreia geração do relatório
    await trackingService.trackReportGenerated(analysisResults);
  };

  const handleAnalysisComplete = () => {
    if (results) {
      setView('dashboard');
      // Rastreia PageView do dashboard (remarketing)
      trackingService.trackEvent('dashboard_page_view', {
        leadId: trackingService.getLeadId(),
      });
    }
  };

  const handleAdminLogin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdmin(false);
  };

  // Admin Routes
  if (showAdmin || showUTMGenerator) {
    if (!isAdmin && showAdmin) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    if (isAdmin && showUTMGenerator) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Gerador de UTMs</h1>
              <button
                onClick={() => {
                  setShowUTMGenerator(false);
                  window.history.pushState({}, '', window.location.pathname);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Voltar
              </button>
            </div>
            <UTMGenerator />
          </div>
        </div>
      );
    }

    if (isAdmin && showAdmin) {
      return (
        <div>
          <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowUTMGenerator(!showUTMGenerator);
                    setShowAdmin(!showUTMGenerator);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  {showUTMGenerator ? 'Ver Dashboard' : 'Gerador de UTMs'}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
          {showUTMGenerator ? (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <UTMGenerator />
              </div>
            </div>
          ) : (
            <AdminDashboard />
          )}
        </div>
      );
    }
  }

  // Página de agradecimento
  if (window.location.pathname === '/obrigado') {
    return <ThankYouPage />;
  }

  // Página de agradecimento
  if (window.location.pathname === '/obrigado' || window.location.pathname.includes('obrigado')) {
    return <ThankYouPage />;
  }

  // Main App Routes
  return (
    <div className="antialiased text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900" style={{ minHeight: '100vh', width: '100%' }}>
      
      {view === 'hero' && (
        <>
          <LandingPage 
            onOpenForm={() => {
              // Rastreia clique no CTA para ver relatório (ViewContent)
              trackingService.trackEvent('view_content', {
                contentName: 'Ver Relatório',
                contentCategory: 'CTA Click',
              });
              setIsFormOpen(true);
            }} 
            userCity={userCity}
          />
          <AnalysisFormModal 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleStartAnalysis}
            initialCity={userCity}
          />
        </>
      )}

      {view === 'analyzing' && (
        <AnalysisLoader onComplete={handleAnalysisComplete} />
      )}

      {view === 'dashboard' && businessData && results && (
        <Dashboard 
          businessData={businessData} 
          results={results} 
        />
      )}
      
    </div>
  );
};

export default App;