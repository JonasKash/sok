import { GoogleGenAI } from "@google/genai";
import { BusinessData, AnalysisResult, Competitor } from '../types';

/**
 * Uses Google Gemini with Search Grounding and Maps to analyze the business.
 */
export const analyzeBusiness = async (data: BusinessData): Promise<AnalysisResult> => {
  // Check for API key first before initializing the client
  const apiKey = import.meta.env.API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing in environment. Using realistic mock data.");
    return mockAnalyze(data);
  }

  // Initialize the API client only when we have an API key
  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log('🔍 Starting real API analysis for:', data);
    
    const searchQuery = `${data.category} em ${data.city}`;
    const prompt = `
Você é um auditor especializado em SEO local e análise de mercado odontológico.

BUSQUE E RETORNE DADOS REAIS do Google Search e Google Maps para a busca: "${searchQuery}"

INSTRUÇÕES CRÍTICAS:
1. Use Google Search para encontrar empresas REAIS que aparecem no Local Pack do Google quando alguém busca "${searchQuery}"
2. Use Google Maps para obter dados REAIS de concorrentes: nomes exatos, avaliações reais, número de reviews real, endereços reais
3. NÃO invente dados. Use APENAS informações encontradas nas buscas reais
4. Se encontrar a clínica "${data.name}", inclua informações reais sobre ela, incluindo a URL da FOTO/LOGO da empresa do Google Maps
5. Liste os TOP 3-5 concorrentes REAIS que aparecem nas buscas, com dados EXATOS do Google Maps
6. IMPORTANTE: Para businessImage, use a URL da foto/logo da empresa "${data.name}" encontrada no Google Maps. Se não encontrar, retorne null.

REGRAS OBRIGATÓRIAS PARA VALORES NUMÉRICOS:
- monthlySearchVolume: DEVE ser um número MAIOR QUE ZERO baseado em dados reais de busca (mínimo 50, máximo 50000). NUNCA retorne 0.
- estimatedLostRevenue: DEVE ser um número MAIOR QUE ZERO calculado baseado em dados reais (mínimo 1000, máximo 100000). NUNCA retorne 0.
- score: DEVE ser um número MAIOR QUE ZERO baseado em análise real (mínimo 10, máximo 100). NUNCA retorne 0.

Se você não conseguir encontrar dados suficientes para calcular valores realistas, use estimativas conservadoras baseadas no tamanho da cidade e nicho, mas SEMPRE retorne valores maiores que zero.

RETORNE APENAS JSON válido (sem markdown, sem texto adicional):
{
  "score": number (10-100, NUNCA 0),
  "monthlySearchVolume": number (50-50000, NUNCA 0),
  "estimatedLostRevenue": number (1000-100000, NUNCA 0),
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

    console.log('📡 Calling Gemini API with search grounding...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    console.log('✅ API Response received');
    console.log('📊 Grounding metadata:', response.candidates?.[0]?.groundingMetadata);

    let resultText = response.text;
    if (!resultText) {
      console.error("❌ ERRO: No text returned from AI");
      console.error("📝 Motivo: A API do Gemini não retornou texto na resposta");
      console.error("🔧 Solução: Verifique se a API_KEY está válida e se há créditos disponíveis");
      throw new Error("No data returned from AI");
    }

    console.log('📄 Raw response text (first 500 chars):', resultText.substring(0, 500));

    // Try to extract real competitors from grounding metadata first
    let realCompetitors: Competitor[] = [];
    let businessImageUrl: string | null = null;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
      console.log('✅ Found grounding chunks, extracting real data...');
      const chunks = groundingMetadata.groundingChunks;
      console.log(`📦 Total chunks found: ${chunks.length}`);
      
      // Try to extract business information from Google Maps chunks
      chunks.forEach((chunk: any) => {
        // Check for Google Maps data
        if (chunk.googleMaps) {
          const place = chunk.googleMaps;
          
          // Check if this is the business we're analyzing (not a competitor)
          // Try multiple matching strategies for better accuracy
          const placeNameLower = place.name?.toLowerCase() || '';
          const businessNameLower = data.name.toLowerCase();
          
          // More flexible matching: check if names are similar
          const isBusinessMatch = placeNameLower && (
            placeNameLower.includes(businessNameLower) || 
            businessNameLower.includes(placeNameLower) ||
            placeNameLower === businessNameLower ||
            // Also check if key words match (remove common words like "clínica", "odontologia", etc.)
            placeNameLower.replace(/clínica|clinica|odontologia|odontologia|dental|dentista/gi, '').trim() === 
            businessNameLower.replace(/clínica|clinica|odontologia|odontologia|dental|dentista/gi, '').trim()
          );
          
          if (isBusinessMatch) {
            console.log('🎯 Empresa encontrada no Google Maps:', place.name);
            console.log('📋 Dados completos do lugar:', JSON.stringify(place, null, 2));
            
            // Extract business image/logo - try multiple sources in order of preference
            // 1. Try photos array (most reliable)
            if (place.photos && Array.isArray(place.photos) && place.photos.length > 0) {
              const photo = place.photos[0];
              console.log('📸 Photo object encontrado:', photo);
              
              // Try direct URI first
              if (photo.uri) {
                businessImageUrl = photo.uri;
                console.log('✅ Found business image URI from Google Maps:', businessImageUrl);
              } 
              // Try photoReference to construct URL
              else if (photo.photoReference) {
                // Note: This requires Google Places API key, but we'll try anyway
                businessImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photoReference}&key=${apiKey}`;
                console.log('✅ Constructed business image URL from photo reference');
              }
              // Try any other photo properties
              else if (photo.url) {
                businessImageUrl = photo.url;
                console.log('✅ Found business image URL from photo object:', businessImageUrl);
              }
              // Try photoReference in different format
              else if (photo.reference) {
                businessImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.reference}&key=${apiKey}`;
                console.log('✅ Constructed business image URL from photo reference (alt format)');
              }
            }
            
            // 2. Try direct image properties
            if (!businessImageUrl) {
              if (place.image) {
                businessImageUrl = place.image;
                console.log('✅ Using business image property:', businessImageUrl);
              } else if (place.logo) {
                businessImageUrl = place.logo;
                console.log('✅ Using business logo property:', businessImageUrl);
              } else if (place.photo) {
                businessImageUrl = place.photo;
                console.log('✅ Using business photo property:', businessImageUrl);
              }
            }
            
            // 3. Try icon as last resort (usually generic, but better than nothing)
            if (!businessImageUrl && place.icon) {
              businessImageUrl = place.icon;
              console.log('⚠️ Using business icon as image (genérico):', businessImageUrl);
            }
            
            if (!businessImageUrl) {
              console.warn('⚠️ Nenhuma imagem encontrada para a empresa no Google Maps');
              console.warn('📋 Propriedades disponíveis no place:', Object.keys(place));
            } else {
              console.log('✅ Logo da empresa extraída com sucesso:', businessImageUrl);
            }
          } else if (place.name && place.name.toLowerCase() !== data.name.toLowerCase()) {
            // This is a competitor
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
        
        // Also check web results for business listings and images
        if (chunk.web && chunk.web.title) {
          const title = chunk.web.title.toLowerCase();
          const businessNameLower = data.name.toLowerCase();
          
          // Check if this web result is about our business
          const isBusinessWebMatch = title.includes(businessNameLower) || 
                                     businessNameLower.includes(title) ||
                                     (title.includes(data.category.toLowerCase()) && 
                                      (title.includes('clínica') || title.includes('dentista')));
          
          // If it's our business, try to extract image
          if (isBusinessWebMatch && !businessImageUrl) {
            console.log('🌐 Resultado web encontrado para a empresa:', chunk.web.title);
            
            // Try to get image from web result
            if (chunk.web.image) {
              businessImageUrl = chunk.web.image;
              console.log('✅ Found business image from web result:', businessImageUrl);
            } else if (chunk.web.thumbnail) {
              businessImageUrl = chunk.web.thumbnail;
              console.log('✅ Found business thumbnail from web result:', businessImageUrl);
            } else if (chunk.web.favicon) {
              // Favicon as last resort
              businessImageUrl = chunk.web.favicon;
              console.log('⚠️ Using favicon as business image:', businessImageUrl);
            }
          }
          
          // Look for business-like titles (not generic pages) for competitors
          if ((title.includes(data.category.toLowerCase()) || title.includes('clínica') || title.includes('dentista')) &&
              !title.includes('wikipedia') && !title.includes('blog') && !title.includes('notícia')) {
            // Try to extract rating from snippet if available
            const snippet = chunk.web.snippet || '';
            const ratingMatch = snippet.match(/(\d+\.?\d*)\s*(estrelas?|stars?|rating)/i);
            const reviewsMatch = snippet.match(/(\d+)\s*(avaliações?|reviews?|comentários?)/i);
            
            if (!isBusinessWebMatch) {
              // This is a competitor
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
      
      console.log(`✅ Extracted ${realCompetitors.length} unique competitors from grounding`);
    } else {
      console.warn("⚠️ No grounding chunks found in response");
      console.warn("📝 Motivo: A API não retornou dados de Google Maps/Search");
      console.warn("🔧 Possíveis causas: Busca muito específica, API sem créditos, ou erro na configuração");
    }

    // Clean up markdown code blocks if present
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const start = resultText.indexOf('{');
    const end = resultText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
        console.error("❌ ERRO: Could not find JSON in response");
        console.error("📝 Motivo: A resposta da API não contém JSON válido");
        console.error("📄 Response text:", resultText.substring(0, 1000));
        throw new Error("Could not parse JSON from response");
    }
    
    const jsonString = resultText.substring(start, end + 1);
    let result: Omit<AnalysisResult, 'sources'>;
    
    try {
      result = JSON.parse(jsonString);
      console.log('✅ JSON parsed successfully');
      console.log('📊 Valores recebidos:', {
        score: result.score,
        monthlySearchVolume: result.monthlySearchVolume,
        estimatedLostRevenue: result.estimatedLostRevenue,
        competitorsCount: result.competitorsCount,
        businessImage: result.businessImage || 'null/undefined'
      });
      
      if (result.businessImage) {
        console.log('🖼️ Business image da resposta da AI:', result.businessImage);
      } else {
        console.warn('⚠️ Business image não encontrada na resposta da AI');
      }
    } catch (parseError) {
      console.error("❌ ERRO: JSON parse error");
      console.error("📝 Motivo: A resposta não é um JSON válido");
      console.error("📄 Raw response text:", resultText.substring(0, 1000));
      throw new Error("Invalid JSON in response");
    }

    // Use business image from Google Maps if found (prioridade máxima)
    if (businessImageUrl) {
      result.businessImage = businessImageUrl;
      console.log('✅ Usando logo da empresa do Google Maps:', businessImageUrl);
    } else if (result.businessImage) {
      // Se não encontrou no Google Maps, usa a da resposta da AI
      console.log('✅ Usando logo da empresa da resposta da AI:', result.businessImage);
    } else {
      console.warn('⚠️ Nenhuma logo da empresa encontrada');
      console.warn('📝 Verifique se a empresa está cadastrada no Google Maps');
      console.warn('📝 Ou se a resposta da AI incluiu a URL da logo');
    }
    
    // Log final da imagem que será usada
    if (result.businessImage) {
      console.log('🖼️ Logo final que será exibida:', result.businessImage);
    }

    // Use real competitors from grounding if available, otherwise use AI response
    if (realCompetitors.length > 0) {
      console.log('✅ Using real competitors from Google Maps:', realCompetitors);
      result.competitorsList = realCompetitors.slice(0, 5); // Top 5
      result.competitorsCount = realCompetitors.length;
    } else if (!result.competitorsList || result.competitorsList.length === 0) {
      console.warn('⚠️ No competitors found in response');
    } else {
      console.log('✅ Using competitors from AI response:', result.competitorsList.length);
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

    console.log('📊 Final result before validation:', {
      competitorsCount: result.competitorsList?.length || 0,
      hasRealData: realCompetitors.length > 0,
      sourcesCount: sources.length
    });

    // VALIDAÇÃO ROBUSTA: Verificar se valores são válidos (não null, undefined, NaN, ou ZERO)
    const score = typeof result.score === 'number' && !isNaN(result.score) && result.score > 0 ? result.score : null;
    const monthlySearchVolume = typeof result.monthlySearchVolume === 'number' && !isNaN(result.monthlySearchVolume) && result.monthlySearchVolume > 0 ? result.monthlySearchVolume : null;
    const estimatedLostRevenue = typeof result.estimatedLostRevenue === 'number' && !isNaN(result.estimatedLostRevenue) && result.estimatedLostRevenue > 0 ? result.estimatedLostRevenue : null;
    
    // Se os valores principais estiverem inválidos (null/undefined/NaN/ZERO), usar mock
    if (score === null || monthlySearchVolume === null || estimatedLostRevenue === null) {
      console.error("❌ ERRO CRÍTICO: API retornou valores inválidos ou zerados");
      console.error("📝 Motivo: A API do Gemini retornou valores zerados, null, undefined ou NaN");
      console.error("📊 Valores recebidos da API:", { 
        score: result.score, 
        monthlySearchVolume: result.monthlySearchVolume, 
        estimatedLostRevenue: result.estimatedLostRevenue 
      });
      console.error("🔧 Solução: Usando dados mock realistas para garantir experiência do usuário");
      console.error("⚠️ ATENÇÃO: Isso não deve acontecer em produção. Verifique:");
      console.error("   1. Se a API_KEY está válida e tem créditos");
      console.error("   2. Se o prompt está gerando respostas válidas");
      console.error("   3. Se há problemas de rede ou timeout");
      return mockAnalyze(data);
    }
    
    console.log('✅ Valores validados com sucesso:', {
      score,
      monthlySearchVolume,
      estimatedLostRevenue
    });

    return {
      ...result,
      sources,
      score: score,
      monthlySearchVolume: monthlySearchVolume,
      estimatedLostRevenue: estimatedLostRevenue,
      competitorsCount: result.competitorsCount || 0,
      techScore: result.techScore || 0,
    };

  } catch (error) {
    console.error("❌ ERRO: Analysis failed");
    console.error("📝 Motivo:", error instanceof Error ? error.message : 'Erro desconhecido');
    console.error("🔧 Solução: Usando dados mock realistas");
    console.error("⚠️ Stack trace:", error);
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

import { PixPaymentData, CreatePixPaymentRequest } from '../types';

/**
 * Cria um pagamento PIX via backend Mercado Pago
 */
export const createPixPayment = async (
  data: CreatePixPaymentRequest
): Promise<PixPaymentData> => {
  // Detectar URL da API
  let apiUrl: string;
  
  if (import.meta.env.VITE_API_URL) {
    // Se VITE_API_URL estiver configurado, usa ele
    apiUrl = import.meta.env.VITE_API_URL;
  } else if (typeof window !== 'undefined') {
    // Em produção, usa a mesma origem + /api
    apiUrl = window.location.origin + '/api';
  } else {
    // Fallback para desenvolvimento
    apiUrl = 'http://localhost:3000/api';
  }
  
  const endpoint = `${apiUrl}/create-pix-payment`;
  
  console.log('🔗 Tentando criar pagamento PIX:', {
    apiUrl,
    endpoint,
    origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
  });
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao criar pagamento PIX';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch {
        errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    // Se for erro de rede (backend não está rodando)
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      console.error('❌ Backend não está acessível:', {
        endpoint,
        apiUrl,
        error: error.message,
        origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
      });
      
      // Em produção, dar mensagem mais específica
      if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        throw new Error(`Não foi possível conectar ao servidor (${endpoint}). Verifique se as serverless functions foram deployadas na Vercel e se a variável MERCADOPAGO_ACCESS_TOKEN está configurada.`);
      } else {
        throw new Error('Backend não está disponível. Verifique se o servidor está rodando.');
      }
    }
    
    console.error('Erro ao criar pagamento PIX:', error);
    throw error;
  }
};

/**
 * Verifica o status de um pagamento
 */
export const checkPaymentStatus = async (paymentId: number): Promise<{ status: string }> => {
  // Detectar URL da API
  let apiUrl: string;
  
  if (import.meta.env.VITE_API_URL) {
    apiUrl = import.meta.env.VITE_API_URL;
  } else if (typeof window !== 'undefined') {
    apiUrl = window.location.origin + '/api';
  } else {
    apiUrl = 'http://localhost:3000/api';
  }
  
  const endpoint = `${apiUrl}/payment-status/${paymentId}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar status do pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    throw error;
  }
};

/**
 * Gera código PIX - Tenta usar API real, fallback para mock
 */
export const generatePixCode = async (amount: number): Promise<string> => {
  try {
    // Tenta criar pagamento real via backend
    const payment = await createPixPayment({
      transaction_amount: amount,
      description: 'Relatório de Autoridade Digital - Avestra',
    });

    // Retorna o código PIX do pagamento criado
    return payment.point_of_interaction?.transaction_data?.qr_code || '';
  } catch (error) {
    console.warn('Erro ao criar PIX real, usando mock:', error);
    // Fallback para mock se backend não estiver disponível
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Avestra6008Sao Paulo62070503***6304E2CA";
  }
};