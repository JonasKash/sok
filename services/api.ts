import { GoogleGenAI } from "@google/genai";
import { BusinessData, AnalysisResult, Competitor } from '../types';

/**
 * Uses Google Gemini with Search Grounding and Maps to analyze the business.
 */
export const analyzeBusiness = async (data: BusinessData): Promise<AnalysisResult> => {
  // Check for API key first before initializing the client
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing in environment. Using realistic mock data.");
    return mockAnalyze(data);
  }

  // Initialize the API client only when we have an API key
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Atue como um Auditor de SEO para Clínicas Odontológicas e Performance Web.
      Analise a clínica: "${data.name}" (Especialidade: "${data.category}") em "${data.city}".

      TAREFAS:
      1. Use o Google Search para encontrar o WEBSITE OFICIAL desta clínica.
      2. Encontre os 3 principais concorrentes REAIS (Dentistas/Clínicas) no Local Pack.
      3. Estime a saúde técnica do site.
      4. Estime perda de receita baseada na população local e ticket médio odontológico.

      DADOS DE MERCADO (Estimativa Odontológica):
      - Volume de Busca = População da cidade * 0.008 (nicho específico).
      - Perda = (Volume * 0.07) * Ticket Médio (~R$ 450,00).

      RETORNO JSON OBRIGATÓRIO (Apenas JSON puro):
      {
        "score": number (0-100, Score GEO geral),
        "monthlySearchVolume": number,
        "estimatedLostRevenue": number,
        "visibilityRank": "Invisível" | "Baixa" | "Média",
        "competitorsCount": number,
        "businessImage": "URL_IMAGEM_OU_NULL",
        "websiteUrl": "URL_DO_SITE_OU_NULL",
        "techScore": number (0-100, nota técnica),
        "techIssues": ["Ex: Site lento", "Ex: Sem fotos de casos clínicos", "Ex: Perfil incompleto"],
        "competitorsList": [
           { 
             "name": "Nome Concorrente", 
             "rating": "4.9", 
             "reviews": 150, 
             "address": "Endereço curto",
             "status": "Aberto agora" 
           }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Enable both Search and Maps for accurate local results
        tools: [{ googleSearch: {} }, { googleMaps: {} }], 
      },
    });

    let resultText = response.text;
    if (!resultText) throw new Error("No data returned from AI");

    // Clean up markdown code blocks if present
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const start = resultText.indexOf('{');
    const end = resultText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
        throw new Error("Could not parse JSON from response");
    }
    
    const jsonString = resultText.substring(start, end + 1);
    const result = JSON.parse(jsonString) as Omit<AnalysisResult, 'sources'>;

    // Sanity Checks for Dental Niche
    if (result.estimatedLostRevenue > 80000) {
       result.estimatedLostRevenue = result.estimatedLostRevenue * 0.40; 
    }
    
    // Fallbacks
    if (!result.competitorsList) result.competitorsList = [];
    if (!result.techIssues) result.techIssues = ["Ausência de dados estruturados para IA", "Carregamento lento de imagens"];
    if (result.techScore === undefined) result.techScore = 45;

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Google Search',
        uri: chunk.web?.uri
      }))
      .filter((s: any) => s.uri) || [];

    return {
      ...result,
      sources
    };

  } catch (error) {
    console.error("Analysis failed, falling back to mock:", error);
    return mockAnalyze(data);
  }
};

const mockAnalyze = async (data: BusinessData): Promise<AnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  
  const cityHash = data.city.split('').reduce((a,b) => a + b.charCodeAt(0), 0);
  const basePopulation = 40000 + (cityHash * 150); 
  const volume = Math.floor(basePopulation * 0.008); 
  const ticket = 450.00; // Ticket médio mais alto para dentistas
  const lostRevenue = volume * 0.07 * ticket;

  const mockCompetitors: Competitor[] = [
      { name: `Dr. Silva - Especialista em ${data.category}`, rating: "5.0", reviews: 331, address: "Centro Médico", status: "Aberto agora" },
      { name: `OdontoPremium ${data.city}`, rating: "4.9", reviews: 215, address: "Jd. Europa", status: "Fechado" },
      { name: `Clínica Sorriso Perfeito`, rating: "4.8", reviews: 120, address: "Shopping", status: "Aberto agora" }
  ];

  // Dental Images
  let mockImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=150&q=80"; // Dental Clinic
  
  return {
    score: 30 + (cityHash % 20),
    monthlySearchVolume: volume,
    estimatedLostRevenue: Math.round(lostRevenue),
    visibilityRank: 'Baixa',
    competitorsCount: 5 + (cityHash % 6),
    competitorsList: mockCompetitors,
    businessImage: mockImage,
    sources: [],
    websiteUrl: null, 
    techScore: 32,
    techIssues: [
        "Site oficial não identificado pelas IAs",
        "Falta de fotos de casos clínicos marcadas",
        "Ausência de cadastro no Google Maps Otimizado",
        "Domínio de baixa autoridade médica"
    ]
  };
};

export const generatePixCode = async (amount: number): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913GeoRank Dental6008Sao Paulo62070503***6304E2CA";
};