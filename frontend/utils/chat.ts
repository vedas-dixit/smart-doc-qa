// Chat utility types and helpers

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function createUserMessage(content: string): Message {
  return {
    id: Date.now().toString(),
    content,
    isUser: true,
    timestamp: new Date(),
  };
}

export function createBotMessage(content: string): Message {
  return {
    id: Date.now().toString(),
    content,
    isUser: false,
    timestamp: new Date(),
  };
} 