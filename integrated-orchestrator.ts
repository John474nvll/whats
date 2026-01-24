import { storage } from "../storage";
import { publishToInstagram, publishToFacebook, sendWhatsAppMessage } from "./social-publisher";
import { aiOrchestrator } from "./ai_orchestrator";

export class IntegratedOrchestrator {
  async syncLeadToMarketing(customerId: number, campaignId: number) {
    const customer = await storage.getCustomer(customerId);
    const campaign = await storage.getCampaigns(customer?.userId || "");
    
    // Logic to sync lead data to marketing targets
    console.log(`Syncing lead ${customerId} to campaign ${campaignId}`);
    return { success: true };
  }

  async createAutomatedPostFromLead(customerId: number, platform: string) {
    const customer = await storage.getCustomer(customerId);
    if (!customer) throw new Error("Customer not found");

    const content = await aiOrchestrator.generateResponse(
      `Genera un post de redes sociales para ${platform} sobre un caso de éxito con el cliente ${customer.name}`,
      `Platform: ${platform}, Customer: ${customer.name}`
    );

    // Get first available social account for the platform
    const accounts = await storage.getSocialAccounts(customer.userId);
    const account = accounts.find(a => a.platform === platform);
    
    if (!account && platform !== 'whatsapp') {
        throw new Error(`No social account found for platform ${platform}`);
    }

    const payload = { content };

    if (platform === 'facebook' && account) {
        return await publishToFacebook(account.accessToken || "", "page_id_placeholder", payload);
    }
    if (platform === 'instagram' && account) {
        return await publishToInstagram(account.accessToken || "", "account_id_placeholder", payload);
    }
    if (platform === 'whatsapp') {
        return await sendWhatsAppMessage("token_placeholder", "phone_id_placeholder", customer.phone || "", content);
    }
    
    return { success: true, content };
  }
}

export const integratedOrchestrator = new IntegratedOrchestrator();
