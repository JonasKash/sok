import React, { useState, useEffect } from 'react';
import { trackingService, FunnelStage } from '../services/tracking';
import { 
  Eye, MousePointerClick, FileText, ShoppingCart, 
  TrendingUp, Users, DollarSign, BarChart3, 
  Link2, Copy, CheckCircle, RefreshCw, Download,
  Filter, Calendar, Search
} from 'lucide-react';
import { UTMParams } from '../services/tracking';

interface FunnelMetrics {
  landingViews: number;
  videoViews: number;
  ctaClicks: number;
  formSubmits: number;
  reportsGenerated: number;
  checkoutClicks: number;
  paymentsConfirmed: number;
  conversionRate: number;
  utmStats: Record<string, number>;
}

export const AdminDashboard: React.FC = () => {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [metrics, setMetrics] = useState<FunnelMetrics>({
    landingViews: 0,
    videoViews: 0,
    ctaClicks: 0,
    formSubmits: 0,
    reportsGenerated: 0,
    checkoutClicks: 0,
    paymentsConfirmed: 0,
    conversionRate: 0,
    utmStats: {},
  });
  const [filteredStages, setFilteredStages] = useState<FunnelStage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterStages();
  }, [stages, searchTerm, selectedStage]);

  const loadData = () => {
    const allStages = trackingService.getAllFunnelStages();
    setStages(allStages);
    calculateMetrics(allStages);
  };

  const calculateMetrics = (allStages: FunnelStage[]) => {
    const m: FunnelMetrics = {
      landingViews: allStages.filter(s => s.stage === 'landing').length,
      videoViews: allStages.filter(s => s.stage === 'video_view').length,
      ctaClicks: allStages.filter(s => s.stage === 'cta_click').length,
      formSubmits: allStages.filter(s => s.stage === 'form_submit').length,
      reportsGenerated: allStages.filter(s => s.stage === 'report_generated').length,
      checkoutClicks: allStages.filter(s => s.stage === 'checkout_click').length,
      paymentsConfirmed: allStages.filter(s => s.stage === 'payment_confirmed').length,
      conversionRate: 0,
      utmStats: {},
    };

    if (m.landingViews > 0) {
      m.conversionRate = (m.paymentsConfirmed / m.landingViews) * 100;
    }

    // Calcula estatísticas de UTM
    allStages.forEach(stage => {
      if (stage.data?.utm) {
        const utm = stage.data.utm as UTMParams;
        const key = `${utm.utm_source || 'direct'}_${utm.utm_medium || 'none'}_${utm.utm_campaign || 'none'}`;
        m.utmStats[key] = (m.utmStats[key] || 0) + 1;
      }
    });

    setMetrics(m);
  };

  const filterStages = () => {
    let filtered = [...stages];

    if (selectedStage !== 'all') {
      filtered = filtered.filter(s => s.stage === selectedStage);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => {
        const dataStr = JSON.stringify(s.data || {}).toLowerCase();
        const stageStr = s.stage.toLowerCase();
        return dataStr.includes(term) || stageStr.includes(term);
      });
    }

    setFilteredStages(filtered.reverse()); // Mais recentes primeiro
  };

  const getStageIcon = (stage: FunnelStage['stage']) => {
    switch (stage) {
      case 'landing': return <Eye size={20} />;
      case 'video_view': return <Eye size={20} />;
      case 'cta_click': return <MousePointerClick size={20} />;
      case 'form_submit': return <FileText size={20} />;
      case 'report_generated': return <BarChart3 size={20} />;
      case 'checkout_click': return <ShoppingCart size={20} />;
      case 'payment_confirmed': return <CheckCircle size={20} />;
      default: return <TrendingUp size={20} />;
    }
  };

  const getStageLabel = (stage: FunnelStage['stage']) => {
    switch (stage) {
      case 'landing': return 'Visualização da Landing';
      case 'video_view': return 'Visualização de Vídeo';
      case 'cta_click': return 'Clique no CTA';
      case 'form_submit': return 'Formulário Enviado';
      case 'report_generated': return 'Relatório Gerado';
      case 'checkout_click': return 'Clique no Checkout';
      case 'payment_confirmed': return 'Pagamento Confirmado';
      default: return stage;
    }
  };

  const getStageColor = (stage: FunnelStage['stage']) => {
    switch (stage) {
      case 'landing': return 'bg-blue-100 text-blue-600';
      case 'video_view': return 'bg-purple-100 text-purple-600';
      case 'cta_click': return 'bg-yellow-100 text-yellow-600';
      case 'form_submit': return 'bg-green-100 text-green-600';
      case 'report_generated': return 'bg-indigo-100 text-indigo-600';
      case 'checkout_click': return 'bg-orange-100 text-orange-600';
      case 'payment_confirmed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(stages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `funnel-data-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard de Funil</h1>
            <p className="text-sm text-slate-500">Rastreamento em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="text-blue-600" size={20} />
              <span className="text-sm text-slate-600">Landing Views</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics.landingViews}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="text-yellow-600" size={20} />
              <span className="text-sm text-slate-600">CTA Clicks</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics.ctaClicks}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-green-600" size={20} />
              <span className="text-sm text-slate-600">Form Submits</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics.formSubmits}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="text-red-600" size={20} />
              <span className="text-sm text-slate-600">Checkout Clicks</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metrics.checkoutClicks}</p>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Taxa de Conversão</h3>
              <p className="text-sm text-slate-500">Landing → Pagamento Confirmado</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-indigo-600">
                {metrics.conversionRate.toFixed(2)}%
              </p>
              <p className="text-sm text-slate-500">
                {metrics.paymentsConfirmed} de {metrics.landingViews} conversões
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por lead ID, UTM, cidade..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="all">Todos os eventos</option>
                <option value="landing">Landing Views</option>
                <option value="video_view">Video Views</option>
                <option value="cta_click">CTA Clicks</option>
                <option value="form_submit">Form Submits</option>
                <option value="report_generated">Reports Generated</option>
                <option value="checkout_click">Checkout Clicks</option>
                <option value="payment_confirmed">Payments Confirmed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline do Funil */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Timeline do Funil ({filteredStages.length} eventos)</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredStages.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum evento encontrado</p>
            ) : (
              filteredStages.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getStageColor(stage.stage)}`}>
                    {getStageIcon(stage.stage)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">
                      {getStageLabel(stage.stage)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(stage.timestamp).toLocaleString('pt-BR')}
                    </p>
                    {stage.data && (
                      <div className="mt-2 space-y-1">
                        {stage.data.leadId && (
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Lead ID:</span> {stage.data.leadId}
                          </p>
                        )}
                        {stage.data.utm && (
                          <div className="text-xs text-slate-600">
                            <span className="font-semibold">UTM:</span>{' '}
                            {Object.entries(stage.data.utm as UTMParams)
                              .filter(([_, v]) => v)
                              .map(([k, v]) => `${k}=${v}`)
                              .join(', ')}
                          </div>
                        )}
                        {stage.data.city && (
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Cidade:</span> {stage.data.city}
                          </p>
                        )}
                        {stage.data.price && (
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Valor:</span> R$ {stage.data.price}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



