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

    const content = await aiOrchestrator.generateChatResponse("demo-user", `Genera un post de redes sociales para ${platform} sobre un caso de éxito con el cliente ${customer.name}`);

    // Simplified publishing logic
    if (platform === 'facebook') return await publishToFacebook(customer.userId, content);
    if (platform === 'instagram') return await publishToInstagram(customer.userId, content);
    if (platform === 'whatsapp') return await sendWhatsAppMessage(customer.phone || "", content);
    
    return { success: true, content };
  }
}

export const integratedOrchestrator = new IntegratedOrchestrator();
