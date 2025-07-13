'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { noDuesAssistant, type NoDuesAssistantInput } from '@/ai/flows/no-dues-assistant-flow';
import { Skeleton } from './ui/skeleton';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const STORAGE_KEY = 'departmentStatusState';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Welcome! I'm your No Dues Assistant. How can I help you with your clearance process today?" }
      ]);
    }
  }, [isOpen, messages.length]);
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const studentId = localStorage.getItem('studentId');
        const storageKey = studentId ? `departmentStatusState_${studentId}` : 'departmentStatusState';
        const storedState = localStorage.getItem(storageKey) || '{}';
        const departmentStates = JSON.parse(storedState);

        const payload: NoDuesAssistantInput = {
            query: input,
            departmentStates,
        };

        const result = await noDuesAssistant(payload);
        
        const assistantMessage: Message = { role: 'assistant', content: result.response };
        setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
        console.error('AI assistant error:', error);
        const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          size="icon"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-foreground" />
            No Dues Assistant
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="p-2 rounded-full bg-accent/10 text-accent-foreground">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-sm text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <div className="p-2 rounded-full bg-muted">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="p-2 rounded-full bg-accent/10 text-accent-foreground">
                    <Bot className="w-5 h-5" />
                  </div>
                <div className="rounded-lg p-3 space-y-2 bg-muted">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask about your dues..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
