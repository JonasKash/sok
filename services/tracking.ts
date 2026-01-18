import CryptoJS from 'crypto-js';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadEvent {
  event: string;
  timestamp: string;
  utm: UTMParams;
  sessionId: string;
  leadId?: string;
  metadata?: Record<string, any>;
}

export interface FunnelStage {
  stage: 'landing' | 'video_view' | 'cta_click' | 'form_submit' | 'report_generated' | 'checkout_click' | 'payment_confirmed';
  timestamp: string;
  data?: any;
}

class TrackingService {
  private sessionId: string;
  private leadId: string | null = null;
  private utmParams: UTMParams = {};
  private funnelStages: FunnelStage[] = [];
  private webhookUrl: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.utmParams = this.extractUTMParams();
    this.webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://seu-backend.com/webhook';
    
    this.saveUTMs();
  }

  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

  private extractUTMParams(): UTMParams {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
    };
  }

  private saveUTMs(): void {
    localStorage.setItem('utm_params', JSON.stringify(this.utmParams));
  }

  public getUTMs(): UTMParams {
    const saved = localStorage.getItem('utm_params');
    return saved ? JSON.parse(saved) : this.utmParams;
  }

  public setLeadId(leadId: string): void {
    this.leadId = leadId;
    localStorage.setItem('lead_id', leadId);
  }

  public getLeadId(): string | null {
    return this.leadId || localStorage.getItem('lead_id');
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public async trackEvent(
    eventName: string, 
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: LeadEvent = {
      event: eventName,
      timestamp: new Date().toISOString(),
      utm: this.getUTMs(),
      sessionId: this.sessionId,
      leadId: this.getLeadId() || undefined,
      metadata: {
        ...metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      }
    };

    this.addFunnelStage(eventName as FunnelStage['stage'], metadata);

    // Envia para Facebook Conversions API
    try {
      const { facebookConversionsAPI } = await import('./facebookConversionsAPI');
      await this.sendToFacebookAPI(eventName, metadata, facebookConversionsAPI);
    } catch (error) {
      console.error('Erro ao enviar para Facebook API:', error);
    }

    // Envia webhook
    try {
      await this.sendWebhook(event);
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      this.queueEvent(event);
    }

    console.log('Event tracked:', event);
  }

  private async sendToFacebookAPI(
    eventName: string, 
    metadata: Record<string, any> | undefined,
    facebookAPI: any
  ): Promise<void> {
    try {
      const leadId = this.getLeadId();
      
      switch (eventName) {
        case 'landing_page_view':
          await facebookAPI.trackPageView();
          break;

        case 'view_content':
          await facebookAPI.trackViewContent({
            contentName: 'Ver Relatório',
            contentCategory: 'CTA Click',
            value: 0,
          });
          break;

        case 'cta_click':
          await facebookAPI.trackContact({
            contactType: 'CTA Click',
            leadId: leadId || undefined,
          });
          break;

        case 'form_submit':
          await facebookAPI.trackCompleteRegistration({
            email: metadata?.formData?.email,
            firstName: metadata?.formData?.name?.split(' ')[0],
            lastName: metadata?.formData?.name?.split(' ').slice(1).join(' '),
            city: metadata?.formData?.city,
            clinicName: metadata?.formData?.name,
          });
          break;

        case 'report_generated':
          await facebookAPI.trackViewContent({
            contentName: 'Relatório de Autoridade Digital',
            contentCategory: 'Analysis Report',
            value: metadata?.reportMetadata?.estimatedLostRevenue || 0,
          });
          break;

        case 'dashboard_page_view':
          await facebookAPI.trackPageView();
          break;

        case 'checkout_click':
          await facebookAPI.trackInitiateCheckout({
            value: metadata?.price || 29.90,
            currency: 'BRL',
            leadId: leadId || undefined,
          });
          break;

        case 'payment_confirmed':
          await facebookAPI.trackPurchase({
            value: metadata?.price || 29.90,
            currency: 'BRL',
            orderId: metadata?.paymentId || leadId,
            leadId: leadId || undefined,
            email: metadata?.email,
          });
          break;

        default:
          await facebookAPI.sendEvent({
            event_name: eventName,
            custom_data: metadata,
          });
      }
    } catch (error) {
      console.error('Erro ao enviar para Facebook Conversions API:', error);
    }
  }

  private addFunnelStage(stage: FunnelStage['stage'], data?: any): void {
    const stageData: FunnelStage = {
      stage,
      timestamp: new Date().toISOString(),
      data
    };
    
    this.funnelStages.push(stageData);
    localStorage.setItem('funnel_stages', JSON.stringify(this.funnelStages));
    
    // Salva no histórico global para o dashboard
    const allStages = JSON.parse(localStorage.getItem('all_funnel_stages') || '[]');
    allStages.push(stageData);
    localStorage.setItem('all_funnel_stages', JSON.stringify(allStages));
  }

  public getFunnelStages(): FunnelStage[] {
    const saved = localStorage.getItem('funnel_stages');
    return saved ? JSON.parse(saved) : this.funnelStages;
  }

  public getAllFunnelStages(): FunnelStage[] {
    return JSON.parse(localStorage.getItem('all_funnel_stages') || '[]');
  }

  private async sendWebhook(event: LeadEvent): Promise<void> {
    if (!this.webhookUrl || this.webhookUrl === 'https://seu-backend.com/webhook') {
      // Se não configurado, apenas loga
      console.log('Webhook não configurado, evento:', event);
      return;
    }

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  private queueEvent(event: LeadEvent): void {
    const queue = JSON.parse(localStorage.getItem('webhook_queue') || '[]');
    queue.push(event);
    localStorage.setItem('webhook_queue', JSON.stringify(queue));
  }

  public async trackVideoView(videoId?: string, duration?: number): Promise<void> {
    await this.trackEvent('video_view', {
      videoId,
      duration,
      videoUrl: window.location.href
    });
  }

  public async trackCTAClick(buttonText: string, buttonId?: string): Promise<void> {
    await this.trackEvent('cta_click', {
      buttonText,
      buttonId,
      page: window.location.pathname
    });
  }

  public async trackFormSubmit(formData: any): Promise<void> {
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.setLeadId(leadId);
    
    await this.trackEvent('form_submit', {
      leadId,
      formData: {
        hasName: !!formData.name,
        hasCategory: !!formData.category,
        hasCity: !!formData.city,
        city: formData.city,
        clinicName: formData.name,
      }
    });
  }

  public async trackReportGenerated(reportData: any): Promise<void> {
    await this.trackEvent('report_generated', {
      leadId: this.getLeadId(),
      reportMetadata: {
        score: reportData.score,
        competitorsCount: reportData.competitorsCount,
        estimatedLostRevenue: reportData.estimatedLostRevenue,
        visibilityRank: reportData.visibilityRank,
      }
    });
  }

  public async trackCheckoutClick(price: number): Promise<void> {
    await this.trackEvent('checkout_click', {
      leadId: this.getLeadId(),
      price,
      currency: 'BRL'
    });
  }

  public async trackPaymentConfirmed(price: number, paymentId?: string): Promise<void> {
    await this.trackEvent('payment_confirmed', {
      leadId: this.getLeadId(),
      price,
      paymentId,
      currency: 'BRL'
    });
  }
}

export const trackingService = new TrackingService();


