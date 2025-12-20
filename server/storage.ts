
import { db } from "./db";
import {
  users, contacts, conversations, messages,
  type InsertUser, type User,
  type InsertContact, type Contact,
  type InsertConversation, type Conversation,
  type InsertMessage, type Message,
  type ConversationWithContact
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contacts
  getContactByPlatformId(platform: string, platformId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Conversations
  getConversations(): Promise<ConversationWithContact[]>;
  getConversation(id: number): Promise<ConversationWithContact | undefined>;
  getConversationByContactId(contactId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversationStatus(id: number, status: string): Promise<Conversation>;

  // Messages
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getLastMessage(conversationId: number): Promise<Message | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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

  async getContactByPlatformId(platform: string, platformId: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(
      eq(contacts.platform, platform) && eq(contacts.platformId, platformId)
    );
    return contact;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getConversations(): Promise<ConversationWithContact[]> {
    const result = await db.query.conversations.findMany({
      with: { contact: true },
      orderBy: [desc(conversations.lastMessageAt)]
    });
    return result as ConversationWithContact[];
  }

  async getConversation(id: number): Promise<ConversationWithContact | undefined> {
    const result = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: { contact: true }
    });
    return result as ConversationWithContact | undefined;
  }

  async getConversationByContactId(contactId: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.contactId, contactId));
    return conversation;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(insertConversation).returning();
    return conversation;
  }

  async updateConversationStatus(id: number, status: string): Promise<Conversation> {
    const [conversation] = await db.update(conversations)
      .set({ status })
      .where(eq(conversations.id, id))
      .returning();
    return conversation;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    // Update conversation last message timestamp
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, insertMessage.conversationId));
    return message;
  }

  async getLastMessage(conversationId: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.timestamp))
      .limit(1);
    return message;
  }
}

export const storage = new DatabaseStorage();
