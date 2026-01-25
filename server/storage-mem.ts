
import { 
  type InsertUser, type User,
  type InsertContact, type Contact,
  type InsertConversation, type Conversation,
  type InsertMessage, type Message,
  type ConversationWithContact
} from "@shared/schema";
import { IStorage } from "./storage";

let nextId = 1;
const users: User[] = [];
const contacts: Contact[] = [];
const conversations: Conversation[] = [];
const messages: Message[] = [];

export class InMemoryStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    return users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: nextId++,
      createdAt: new Date(),
      ...insertUser 
    };
    users.push(user);
    return user;
  }

  async getContactByPlatformId(platform: string, platformId: string): Promise<Contact | undefined> {
    return contacts.find(c => c.platform === platform && c.platformId === platformId);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const contact: Contact = { 
      id: nextId++,
      createdAt: new Date(),
      ...insertContact 
    };
    contacts.push(contact);
    return contact;
  }

  async getConversations(): Promise<ConversationWithContact[]> {
    return conversations.map(c => ({
      ...c,
      contact: contacts.find(ct => ct.id === c.contactId)!
    })).sort((a, b) => (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0));
  }

  async getConversation(id: number): Promise<ConversationWithContact | undefined> {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return undefined;
    return {
      ...conversation,
      contact: contacts.find(ct => ct.id === conversation.contactId)!
    };
  }

  async getConversationByContactId(contactId: number): Promise<Conversation | undefined> {
    return conversations.find(c => c.contactId === contactId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const conversation: Conversation = {
      id: nextId++,
      lastMessageAt: new Date(),
      unreadCount: 0,
      ...insertConversation
    };
    conversations.push(conversation);
    return conversation;
  }

  async updateConversationStatus(id: number, status: string): Promise<Conversation> {
    const conversation = conversations.find(c => c.id === id)!;
    conversation.status = status;
    return conversation;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return messages.filter(m => m.conversationId === conversationId).sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = { 
      id: nextId++,
      timestamp: new Date(),
      ...insertMessage 
    };
    messages.push(message);
    const conversation = conversations.find(c => c.id === insertMessage.conversationId)!;
    conversation.lastMessageAt = new Date();
    return message;
  }

  async getLastMessage(conversationId: number): Promise<Message | undefined> {
    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    return conversationMessages[conversationMessages.length - 1];
  }
}
