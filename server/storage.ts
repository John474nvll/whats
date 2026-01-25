
import { db } from "./db";
import {
  users, contacts, conversations, messages, customers,
  type InsertUser, type User,
  type InsertContact, type Contact,
  type InsertConversation, type Conversation,
  type InsertMessage, type Message,
  type ConversationWithContact,
  type Customer, type InsertCustomer
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { InMemoryStorage } from "./storage-mem";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  getContactByPlatformId(platform: string, platformId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<void>;

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
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<void>;
}

export const storage = new InMemoryStorage();
