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
    console.log('Starting real API analysis for:', data);
    
    const searchQuery = `${data.category} em ${data.city}`;
    const prompt = `
Você é um auditor especializado em SEO local e análise de mercado odontológico.

BUSQUE E RETORNE DADOS REAIS do Google Search e Google Maps para a busca: "${searchQuery}"

INSTRUÇÕES CRÍTICAS:
1. Use Google Search para encontrar empresas REAIS que aparecem no Local Pack do Google quando alguém busca "${searchQuery}"
2. Use Google Maps para obter dados REAIS de concorrentes: nomes exatos, avaliações reais, número de reviews real, endereços reais
3. NÃO invente dados. Use APENAS informações encontradas nas buscas reais
4. Se encontrar a clínica "${data.name}", inclua informações reais sobre ela
5. Liste os TOP 3-5 concorrentes REAIS que aparecem nas buscas, com dados EXATOS do Google Maps

RETORNE APENAS JSON válido (sem markdown, sem texto adicional):
{
  "score": number (0-100),
  "monthlySearchVolume": number,
  "estimatedLostRevenue": number,
  "visibilityRank": "Invisível" | "Baixa" | "Média" | "Alta",
  "competitorsCount": number,
  "businessImage": "URL_OU_NULL",
  "websiteUrl": "URL_OU_NULL",
  "techScore": number (0-100),
  "techIssues": ["problema1", "problema2"],
  "competitorsList": [
    {
      "name": "NOME REAL DA EMPRESA",
      "rating": "4.8",
      "reviews": 150,
      "address": "Endereço real",
      "status": "Aberto agora" ou "Fechado"
    }
  ]
}
`;

    console.log('Calling Gemini API with search grounding...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    console.log('API Response received');
    console.log('Grounding metadata:', response.candidates?.[0]?.groundingMetadata);

    let resultText = response.text;
    if (!resultText) {
      console.error("No text returned from AI");
      throw new Error("No data returned from AI");
    }

    console.log('Raw response text:', resultText.substring(0, 500));

    // Try to extract real competitors from grounding metadata first
    let realCompetitors: Competitor[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
      console.log('Found grounding chunks, extracting real data...');
      const chunks = groundingMetadata.groundingChunks;
      
      // Try to extract business information from Google Maps chunks
      chunks.forEach((chunk: any) => {
        // Check for Google Maps data
        if (chunk.googleMaps) {
          const place = chunk.googleMaps;
          if (place.name && place.name.toLowerCase() !== data.name.toLowerCase()) {
            realCompetitors.push({
              name: place.name,
              rating: place.rating?.toString() || place.averageRating?.toString() || "4.5",
              reviews: place.userRatingCount || place.reviewCount || 0,
              address: place.formattedAddress || place.address || place.vicinity || "",
              status: place.currentOpeningHours?.openNow ? "Aberto agora" : 
                      place.openingHours?.openNow ? "Aberto agora" : "Fechado"
            });
          }
        }
        
        // Also check web results for business listings
        if (chunk.web && chunk.web.title) {
          const title = chunk.web.title.toLowerCase();
          // Look for business-like titles (not generic pages)
          if ((title.includes(data.category.toLowerCase()) || title.includes('clínica') || title.includes('dentista')) &&
              !title.includes('wikipedia') && !title.includes('blog') && !title.includes('notícia')) {
            // Try to extract rating from snippet if available
            const snippet = chunk.web.snippet || '';
            const ratingMatch = snippet.match(/(\d+\.?\d*)\s*(estrelas?|stars?|rating)/i);
            const reviewsMatch = snippet.match(/(\d+)\s*(avaliações?|reviews?|comentários?)/i);
            
            if (chunk.web.title.toLowerCase() !== data.name.toLowerCase()) {
              realCompetitors.push({
                name: chunk.web.title,
                rating: ratingMatch ? ratingMatch[1] : "4.5",
                reviews: reviewsMatch ? parseInt(reviewsMatch[1]) : 0,
                address: data.city,
                status: "Aberto agora"
              });
            }
          }
        }
      });
      
      // Remove duplicates
      const uniqueCompetitors = realCompetitors.filter((comp, index, self) =>
        index === self.findIndex((c) => c.name.toLowerCase() === comp.name.toLowerCase())
      );
      
      realCompetitors = uniqueCompetitors;
      
      console.log('Extracted real competitors from grounding:', realCompetitors.length);
    }

    // Clean up markdown code blocks if present
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const start = resultText.indexOf('{');
    const end = resultText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
        console.error("Could not find JSON in response");
        throw new Error("Could not parse JSON from response");
    }
    
    const jsonString = resultText.substring(start, end + 1);
    let result: Omit<AnalysisResult, 'sources'>;
    
    try {
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON in response");
    }

    // Use real competitors from grounding if available, otherwise use AI response
    if (realCompetitors.length > 0) {
      console.log('Using real competitors from Google Maps:', realCompetitors);
      result.competitorsList = realCompetitors.slice(0, 5); // Top 5
      result.competitorsCount = realCompetitors.length;
    } else if (!result.competitorsList || result.competitorsList.length === 0) {
      console.warn('No competitors found, using fallback');
      result.competitorsList = [];
    } else {
      console.log('Using competitors from AI response:', result.competitorsList.length);
    }

    // Sanity Checks for Dental Niche
    if (result.estimatedLostRevenue > 80000) {
       result.estimatedLostRevenue = result.estimatedLostRevenue * 0.40; 
    }
    
    // Fallbacks
    if (!result.competitorsList || result.competitorsList.length === 0) {
      console.warn('No competitors found, this might indicate API issue');
    }
    if (!result.techIssues) result.techIssues = ["Ausência de dados estruturados para IA", "Carregamento lento de imagens"];
    if (result.techScore === undefined) result.techScore = 45;

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || chunk.googleMaps?.name || 'Google Search',
        uri: chunk.web?.uri || chunk.googleMaps?.uri
      }))
      .filter((s: any) => s.uri) || [];

    console.log('Final result:', {
      competitorsCount: result.competitorsList?.length || 0,
      hasRealData: realCompetitors.length > 0,
      sourcesCount: sources.length
    });

    return {
      ...result,
      sources
    };

  } catch (error) {
    console.error("Analysis failed, error details:", error);
    console.error("Falling back to mock data");
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
  return "00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Avestra6008Sao Paulo62070503***6304E2CA";
};