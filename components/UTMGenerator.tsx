import React, { useState } from 'react';
import { Link2, Copy, CheckCircle, ExternalLink } from 'lucide-react';

export const UTMGenerator: React.FC = () => {
  const [utmParams, setUtmParams] = useState({
    baseUrl: 'https://avestra.app',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });
  const [copied, setCopied] = useState(false);

  const generateURL = () => {
    const params = new URLSearchParams();
    
    if (utmParams.utm_source) params.append('utm_source', utmParams.utm_source);
    if (utmParams.utm_medium) params.append('utm_medium', utmParams.utm_medium);
    if (utmParams.utm_campaign) params.append('utm_campaign', utmParams.utm_campaign);
    if (utmParams.utm_term) params.append('utm_term', utmParams.utm_term);
    if (utmParams.utm_content) params.append('utm_content', utmParams.utm_content);

    const queryString = params.toString();
    return queryString ? `${utmParams.baseUrl}?${queryString}` : utmParams.baseUrl;
  };

  const copyToClipboard = () => {
    const url = generateURL();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (field: string, value: string) => {
    setUtmParams(prev => ({ ...prev, [field]: value }));
  };

  const presetCampaigns = [
    { name: 'Facebook Ads', source: 'facebook', medium: 'cpc', campaign: 'facebook_ads' },
    { name: 'Google Ads', source: 'google', medium: 'cpc', campaign: 'google_ads' },
    { name: 'Instagram', source: 'instagram', medium: 'social', campaign: 'instagram_organic' },
    { name: 'Email Marketing', source: 'email', medium: 'email', campaign: 'newsletter' },
    { name: 'WhatsApp', source: 'whatsapp', medium: 'social', campaign: 'whatsapp_campaign' },
  ];

  const applyPreset = (preset: typeof presetCampaigns[0]) => {
    setUtmParams(prev => ({
      ...prev,
      utm_source: preset.source,
      utm_medium: preset.medium,
      utm_campaign: preset.campaign,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link2 className="text-indigo-600" size={24} />
        <h2 className="text-xl font-bold text-slate-900">Gerador de URLs com UTM</h2>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Templates Rápidos
        </label>
        <div className="flex flex-wrap gap-2">
          {presetCampaigns.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Campos UTM */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            URL Base
          </label>
          <input
            type="text"
            value={utmParams.baseUrl}
            onChange={(e) => handleChange('baseUrl', e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="https://avestra.app"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              utm_source *
            </label>
            <input
              type="text"
              value={utmParams.utm_source}
              onChange={(e) => handleChange('utm_source', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="facebook, google, instagram"
            />
            <p className="text-xs text-slate-500 mt-1">Origem do tráfego</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              utm_medium *
            </label>
            <input
              type="text"
              value={utmParams.utm_medium}
              onChange={(e) => handleChange('utm_medium', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="cpc, social, email"
            />
            <p className="text-xs text-slate-500 mt-1">Canal de marketing</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              utm_campaign
            </label>
            <input
              type="text"
              value={utmParams.utm_campaign}
              onChange={(e) => handleChange('utm_campaign', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="campanha_verao_2025"
            />
            <p className="text-xs text-slate-500 mt-1">Nome da campanha</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              utm_term
            </label>
            <input
              type="text"
              value={utmParams.utm_term}
              onChange={(e) => handleChange('utm_term', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="palavra_chave"
            />
            <p className="text-xs text-slate-500 mt-1">Palavra-chave (opcional)</p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              utm_content
            </label>
            <input
              type="text"
              value={utmParams.utm_content}
              onChange={(e) => handleChange('utm_content', e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="banner_principal, link_texto"
            />
            <p className="text-xs text-slate-500 mt-1">Conteúdo específico (opcional)</p>
          </div>
        </div>
      </div>

      {/* URL Gerada */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">URL Gerada</label>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            {copied ? (
              <>
                <CheckCircle size={16} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copiar
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={generateURL()}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700"
          />
          <a
            href={generateURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            <ExternalLink size={16} className="text-slate-700" />
          </a>
        </div>
      </div>

      {/* Preview dos Parâmetros */}
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
        <p className="text-xs font-semibold text-indigo-900 mb-2">Parâmetros UTM:</p>
        <div className="space-y-1 text-xs text-indigo-700">
          {utmParams.utm_source && <p>• utm_source: {utmParams.utm_source}</p>}
          {utmParams.utm_medium && <p>• utm_medium: {utmParams.utm_medium}</p>}
          {utmParams.utm_campaign && <p>• utm_campaign: {utmParams.utm_campaign}</p>}
          {utmParams.utm_term && <p>• utm_term: {utmParams.utm_term}</p>}
          {utmParams.utm_content && <p>• utm_content: {utmParams.utm_content}</p>}
          {!utmParams.utm_source && !utmParams.utm_medium && (
            <p className="text-slate-500">Preencha pelo menos source e medium</p>
          )}
        </div>
      </div>
    </div>
  );
};


