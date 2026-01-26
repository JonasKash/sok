export interface BusinessData {
  name: string;
  category: string;
  city: string;
}

export interface Competitor {
  name: string;
  rating: string;
  reviews: number;
  address?: string;
  status?: string;
}

export interface AnalysisResult {
  score: number; // 0 to 100
  monthlySearchVolume: number;
  estimatedLostRevenue: number;
  visibilityRank: string; // "Invisible", "Low", "Medium", "High"
  competitorsCount: number; // Renamed from competitors to avoid confusion
  competitorsList: Competitor[]; // Real data from Google Maps
  businessImage?: string; // URL of the business logo or storefront
  sources: { title: string; uri: string }[];
  // New Technical Fields
  websiteUrl?: string | null;
  techScore: number; // 0-100 representing Page Quality/Speed health
  techIssues: string[]; // List of detected or common issues
}

export type ViewState = 'hero' | 'analyzing' | 'dashboard' | 'user-dashboard';

// Mercado Pago Interfaces
export interface PixPaymentData {
  id: number;
  status: string;
  status_detail: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  date_created?: string;
  date_of_expiration?: string;
}

export interface CreatePixPaymentRequest {
  transaction_amount: number;
  description?: string;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}