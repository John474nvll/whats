import { db } from "./db";
import {
  users, contacts, conversations, messages, channelConfigs, socialAccounts, widgets,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type ChannelConfig, type InsertChannelConfig,
  type SocialAccount, type InsertSocialAccount,
  type Widget, type InsertWidget
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  getContactByPhone(phone: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Conversations
  getConversations(): Promise<(Conversation & { contact: Contact })[]>;
  getConversation(id: number): Promise<(Conversation & { messages: Message[] }) | undefined>;
  getConversationByContactId(contactId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversationStatus(id: number, status: string): Promise<Conversation>;
  updateBotStatus(id: number, isActive: boolean): Promise<Conversation>;

  // Messages
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Channels
  getChannels(): Promise<ChannelConfig[]>;
  getChannel(platform: string): Promise<ChannelConfig | undefined>;
  updateChannel(platform: string, config: Partial<InsertChannelConfig>): Promise<ChannelConfig>;
  createChannel(config: InsertChannelConfig): Promise<ChannelConfig>;

  // Social Accounts
  getSocialAccounts(userId: string): Promise<SocialAccount[]>;
  getSocialAccount(userId: string, platform: string): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  // Widgets
  getWidgets(userId: string): Promise<Widget[]>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: number, updates: Partial<InsertWidget>): Promise<Widget>;
  deleteWidget(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async getContactByPhone(phone: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.phone, phone));
    return contact;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  // Conversations
  async getConversations(): Promise<(Conversation & { contact: Contact })[]> {
    const result = await db.query.conversations.findMany({
      with: {
        contact: true,
      },
      orderBy: [desc(conversations.lastMessageAt)],
    });
    return result as (Conversation & { contact: Contact })[];
  }

  async getConversation(id: number): Promise<(Conversation & { messages: Message[] }) | undefined> {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: {
        messages: {
          orderBy: [desc(messages.createdAt)],
          limit: 50, // Load last 50 messages
        },
      },
    });
    if (!conversation) return undefined;
    
    // Reverse messages to be chronological for chat UI if needed, but usually UI handles it.
    // Let's keep desc for now as it's efficient for "latest".
    return conversation as (Conversation & { messages: Message[] });
  }

  async getConversationByContactId(contactId: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.contactId, contactId));
    return conversation;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    return newConversation;
  }

  async updateConversationStatus(id: number, status: string): Promise<Conversation> {
    const [updated] = await db.update(conversations)
      .set({ status })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  async updateBotStatus(id: number, isActive: boolean): Promise<Conversation> {
    const [updated] = await db.update(conversations)
      .set({ botStatus: isActive })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  // Messages
  async getMessages(conversationId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update conversation lastMessageAt
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));

    return newMessage;
  }

  // Channels
  async getChannels(): Promise<ChannelConfig[]> {
    return await db.select().from(channelConfigs);
  }

  async getChannel(platform: string): Promise<ChannelConfig | undefined> {
    const [config] = await db.select().from(channelConfigs).where(eq(channelConfigs.platform, platform));
    return config;
  }

  async updateChannel(platform: string, config: Partial<InsertChannelConfig>): Promise<ChannelConfig> {
    const [updated] = await db.update(channelConfigs)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(channelConfigs.platform, platform))
      .returning();
    return updated;
  }

  async createChannel(config: InsertChannelConfig): Promise<ChannelConfig> {
    const [newConfig] = await db.insert(channelConfigs).values(config).returning();
    return newConfig;
  }

  // Social Accounts
  async getSocialAccounts(userId: string): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
  }

  async getSocialAccount(userId: string, platform: string): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts)
      .where((acc) => eq(acc.userId, userId) && eq(acc.platform, platform));
    return account;
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount> {
    const [updated] = await db.update(socialAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return updated;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  // Widgets
  async getWidgets(userId: string): Promise<Widget[]> {
    return await db.select().from(widgets).where(eq(widgets.userId, userId)).orderBy(widgets.position);
  }

  async createWidget(widget: InsertWidget): Promise<Widget> {
    const [newWidget] = await db.insert(widgets).values(widget).returning();
    return newWidget;
  }

  async updateWidget(id: number, updates: Partial<InsertWidget>): Promise<Widget> {
    const [updated] = await db.update(widgets)
      .set(updates)
      .where(eq(widgets.id, id))
      .returning();
    return updated;
  }

  async deleteWidget(id: number): Promise<void> {
    await db.delete(widgets).where(eq(widgets.id, id));
  }
}

export const storage = new DatabaseStorage();
