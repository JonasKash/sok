import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AnalysisLoader } from './components/AnalysisLoader';
import { Dashboard } from './components/Dashboard';
import { AnalysisFormModal } from './components/AnalysisFormModal';
import { analyzeBusiness } from './services/api';
import { BusinessData, ViewState, AnalysisResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [userCity, setUserCity] = useState<string>('');

  // Fetch geolocation on mount
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city) {
          setUserCity(data.city);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar localização:", err);
      });
  }, []);

  const handleStartAnalysis = async (data: BusinessData) => {
    setIsFormOpen(false); // Close modal
    setBusinessData(data);
    setView('analyzing');
    
    // In a real app, errors would be handled here
    const analysisResults = await analyzeBusiness(data);
    setResults(analysisResults);
  };

  const handleAnalysisComplete = () => {
    if (results) {
      setView('dashboard');
    }
  };

  return (
    <div className="antialiased text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900" style={{ minHeight: '100vh', width: '100%' }}>
      
      {view === 'hero' && (
        <>
          <LandingPage 
            onOpenForm={() => setIsFormOpen(true)} 
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