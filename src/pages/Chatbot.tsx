import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { PageHeader, Card, ErrorBanner, Button, Input } from '@/components/ui';
import { useAI } from '@/hooks/useAI';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  'How can I improve my time management at work?',
  'Help me write a professional out-of-office message.',
  'What are the best strategies for running effective meetings?',
  'How do I handle a difficult conversation with a colleague?',
];

export default function Chatbot() {
  const { generate, loading, error } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm your AI workplace assistant. I can help you with productivity tips, professional communication, workplace challenges, and much more. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildConversationContext = (msgs: Message[]) => {
    return msgs
      .slice(-10)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');

    const conversationHistory = buildConversationContext(messages);
    const prompt = `You are a helpful AI workplace productivity assistant. You assist professionals with work-related tasks, productivity, communication, and career questions. Be concise, practical, and professional.

Conversation history:
${conversationHistory}

User: ${text}

Provide a helpful, practical response:`;

    const result = await generate({ feature: 'chat', input: prompt });
    if (result) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result,
        timestamp: new Date(),
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Chat cleared. How can I help you?",
      timestamp: new Date(),
    }]);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader
        title="AI Chatbot"
        description="Your always-on workplace assistant for questions, advice, and quick help."
        icon={<MessageSquare className="w-6 h-6 text-rose-600" />}
        iconBg="bg-rose-100"
      />

      <div className="grid grid-cols-4 gap-6">
        {/* Chat window */}
        <div className="col-span-3 flex flex-col">
          <Card className="flex flex-col" style={{ height: '580px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs text-slate-500">Online</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={clearChat}>
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'user' ? 'bg-lavender-500' : 'bg-rose-100'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    }
                  </div>
                  <div className={`max-w-[75%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-lavender-500 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {copiedId === msg.id
                            ? <Check className="w-3 h-3 text-emerald-500" />
                            : <Copy className="w-3 h-3" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3.5 border-t border-slate-100">
              {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-3.5 py-2.5 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                AI-generated responses — use judgment before acting on advice.
              </p>
            </div>
          </Card>
        </div>

        {/* Suggestions */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Try Asking</h3>
            <div className="space-y-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="w-full text-left text-xs text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 px-3 py-2.5 rounded-lg transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Capabilities</h3>
            <ul className="space-y-1.5">
              {[
                'Professional advice',
                'Communication help',
                'Productivity tips',
                'Meeting preparation',
                'Career guidance',
                'Work-life balance',
              ].map(c => (
                <li key={c} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
