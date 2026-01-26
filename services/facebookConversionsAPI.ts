import CryptoJS from 'crypto-js';

export interface FacebookEvent {
  event_name: string;
  event_time: number;
  event_source_url?: string;
  action_source: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  user_data?: {
    em?: string[];
    ph?: string[];
    fn?: string[];
    ln?: string[];
    ct?: string[];
    st?: string[];
    zp?: string[];
    country?: string[];
    external_id?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{
      id: string;
      quantity: number;
      item_price?: number;
    }>;
    num_items?: number;
    order_id?: string;
    [key: string]: any;
  };
  event_id?: string;
  opt_out?: boolean;
}

interface FacebookAPIResponse {
  events_received: number;
  messages: Array<{
    code: number;
    message: string;
  }>;
  fbtrace_id?: string;
}

class FacebookConversionsAPI {
  private pixelId: string;
  private accessToken: string;
  private apiVersion: string = 'v24.0';
  private baseUrl: string = 'https://graph.facebook.com';

  constructor() {
    this.pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID || '1593785288615011';
    this.accessToken = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '';
  }

  private hashData(data: string): string {
    if (!data) return '';
    return CryptoJS.SHA256(data.toLowerCase().trim()).toString();
  }

  private prepareUserData(userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    externalId?: string;
    ipAddress?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
  }): FacebookEvent['user_data'] {
    const prepared: FacebookEvent['user_data'] = {};

    if (userData.email) {
      prepared.em = [this.hashData(userData.email)];
    }

    if (userData.phone) {
      const phone = userData.phone.replace(/\D/g, '');
      prepared.ph = [this.hashData(phone)];
    }

    if (userData.firstName) {
      prepared.fn = [this.hashData(userData.firstName)];
    }

    if (userData.lastName) {
      prepared.ln = [this.hashData(userData.lastName)];
    }

    if (userData.city) {
      prepared.ct = [this.hashData(userData.city)];
    }

    if (userData.state) {
      prepared.st = [this.hashData(userData.state)];
    }

    if (userData.zipCode) {
      prepared.zp = [this.hashData(userData.zipCode)];
    }

    if (userData.country) {
      prepared.country = [this.hashData(userData.country)];
    }

    if (userData.externalId) {
      prepared.external_id = [this.hashData(userData.externalId)];
    }

    if (userData.ipAddress) {
      prepared.client_ip_address = userData.ipAddress;
    }

    if (userData.userAgent) {
      prepared.client_user_agent = userData.userAgent;
    }

    if (userData.fbp) {
      prepared.fbp = userData.fbp;
    }

    if (userData.fbc) {
      prepared.fbc = userData.fbc;
    }

    return prepared;
  }

  private generateEventId(eventName: string, leadId?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${eventName}_${leadId || 'anonymous'}_${timestamp}_${random}`;
  }

  private getFbp(): string | undefined {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_fbp') {
        return value;
      }
    }
    return undefined;
  }

  private getFbc(): string | undefined {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_fbc') {
        return value;
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fbclid') ? `fb.1.${Date.now()}.${urlParams.get('fbclid')}` : undefined;
  }

  public async sendEvent(event: Omit<FacebookEvent, 'event_time' | 'action_source'> & {
    event_time?: number;
    action_source?: FacebookEvent['action_source'];
  }): Promise<FacebookAPIResponse> {
    if (!this.accessToken) {
      console.warn('Facebook Access Token não configurado');
      return { events_received: 0, messages: [] };
    }

    const payload: FacebookEvent = {
      ...event,
      event_time: event.event_time || Math.floor(Date.now() / 1000),
      action_source: event.action_source || 'website',
      event_source_url: event.event_source_url || window.location.href,
    };

    if (!payload.user_data) {
      payload.user_data = {};
    }

    const fbp = this.getFbp();
    const fbc = this.getFbc();

    if (fbp && !payload.user_data.fbp) {
      payload.user_data.fbp = fbp;
    }

    if (fbc && !payload.user_data.fbc) {
      payload.user_data.fbc = fbc;
    }

    if (!payload.user_data.client_user_agent) {
      payload.user_data.client_user_agent = navigator.userAgent;
    }

    if (!payload.event_id) {
      payload.event_id = this.generateEventId(payload.event_name);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/${this.pixelId}/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [payload],
            access_token: this.accessToken,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Facebook API Error:', error);
        return { events_received: 0, messages: [{ code: 0, message: JSON.stringify(error) }] };
      }

      const result: FacebookAPIResponse = await response.json();
      console.log('Facebook Conversions API - Event sent:', result);
      return result;
    } catch (error) {
      console.error('Erro ao enviar evento para Facebook:', error);
      return { events_received: 0, messages: [{ code: 0, message: String(error) }] };
    }
  }

  public async trackPageView(userData?: FacebookEvent['user_data']): Promise<void> {
    await this.sendEvent({
      event_name: 'PageView',
      user_data: userData || {
        client_user_agent: navigator.userAgent,
      },
    });
  }

  public async trackLead(leadData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    externalId?: string;
  }): Promise<void> {
    const userData = this.prepareUserData({
      email: leadData.email,
      phone: leadData.phone,
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      city: leadData.city,
      externalId: leadData.externalId,
      userAgent: navigator.userAgent,
    });

    await this.sendEvent({
      event_name: 'Lead',
      user_data: userData,
      custom_data: {
        content_name: 'Formulário de Análise',
        content_category: 'Dental Clinic Analysis',
      },
    });
  }

  public async trackCompleteRegistration(formData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    clinicName?: string;
  }): Promise<void> {
    const userData = this.prepareUserData({
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      city: formData.city,
      userAgent: navigator.userAgent,
    });

    await this.sendEvent({
      event_name: 'CompleteRegistration',
      user_data: userData,
      custom_data: {
        content_name: formData.clinicName || 'Clínica Odontológica',
        status: true,
      },
    });
  }

  public async trackViewContent(contentData: {
    contentName?: string;
    contentCategory?: string;
    contentIds?: string[];
    value?: number;
  }): Promise<void> {
    await this.sendEvent({
      event_name: 'ViewContent',
      user_data: {
        client_user_agent: navigator.userAgent,
      },
      custom_data: {
        content_name: contentData.contentName,
        content_category: contentData.contentCategory,
        content_ids: contentData.contentIds,
        value: contentData.value,
      },
    });
  }

  public async trackInitiateCheckout(checkoutData: {
    value: number;
    currency?: string;
    leadId?: string;
  }): Promise<void> {
    const userData = checkoutData.leadId
      ? this.prepareUserData({
          externalId: checkoutData.leadId,
          userAgent: navigator.userAgent,
        })
      : {
          client_user_agent: navigator.userAgent,
        };

    await this.sendEvent({
      event_name: 'InitiateCheckout',
      user_data: userData,
      custom_data: {
        currency: checkoutData.currency || 'BRL',
        value: checkoutData.value,
        content_name: 'Relatório de Autoridade Digital',
      },
    });
  }

  public async trackPurchase(purchaseData: {
    value: number;
    currency?: string;
    orderId?: string;
    leadId?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    const userData = this.prepareUserData({
      email: purchaseData.email,
      phone: purchaseData.phone,
      externalId: purchaseData.leadId,
      userAgent: navigator.userAgent,
    });

    await this.sendEvent({
      event_name: 'Purchase',
      user_data: userData,
      custom_data: {
        currency: purchaseData.currency || 'BRL',
        value: purchaseData.value,
        order_id: purchaseData.orderId,
        content_name: 'Relatório de Autoridade Digital',
        num_items: 1,
      },
    });
  }

  public async trackContact(contactData: {
    contactType?: string;
    leadId?: string;
  }): Promise<void> {
    const userData = contactData.leadId
      ? this.prepareUserData({
          externalId: contactData.leadId,
          userAgent: navigator.userAgent,
        })
      : {
          client_user_agent: navigator.userAgent,
        };

    await this.sendEvent({
      event_name: 'Contact',
      user_data: userData,
      custom_data: {
        content_name: contactData.contactType || 'CTA Click',
      },
    });
  }
}

export const facebookConversionsAPI = new FacebookConversionsAPI();








