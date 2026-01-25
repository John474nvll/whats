
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
import { InMemoryStorage } from "./storage-mem";

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

export const storage = new InMemoryStorage();
