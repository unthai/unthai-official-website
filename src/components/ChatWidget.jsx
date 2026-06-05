import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Calendar, Zap, ChevronRight } from 'lucide-react';
import './ChatWidget.css';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || '';
const CHAT_WEBHOOK_URL = import.meta.env.VITE_CHAT_WEBHOOK_URL || '';
const STORAGE_KEY = 'unthai_chat_history';
const SESSION_KEY = 'unthai_session_id';

// Generate or retrieve a persistent session ID for conversation continuity
const getSessionId = () => {
  try {
    let sid = window.sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      window.sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `chat_${Date.now()}`;
  }
};

const WELCOME_MESSAGE = {
  role: 'bot',
  text: "👋 Hey, I'm UNTH.AI's AI assistant. I can help you with:\n\n• Understanding our AI services & pricing\n• Answering technical questions\n• Booking a strategy call\n• Anything else you're curious about",
};

const QUICK_REPLIES = [
  { id: 'services', label: 'What services do you offer?', icon: Zap },
  { id: 'pricing', label: 'How much does it cost?', icon: ChevronRight },
  { id: 'booking', label: 'Book a strategy call', icon: Calendar, action: 'calendly' },
];

// Simulated AI response for when webhook is not configured (development/demo mode)
const DEMO_RESPONSES = {
  services:
    "We offer six core services:\n\n**1. AI Content Engine** — Cinema-quality video & visuals for your brand\n**2. Autonomous Agents** — 24/7 AI assistants for support & sales\n**3. Workflow Automation** — n8n-powered process automation\n**4. Creative Automation** — Bulk brand design generation\n**5. AI Growth Strategy** — Automated lead finding & outreach\n**6. AI Voice Intelligence** — Human-like voice agents for calls\n\nWhich one interests you most? I can dive deeper.",
  pricing:
    "Our services start from **$900/month** depending on the scope. Here's a quick breakdown:\n\n• **Tier 1 (Starter)**: $900–$1,250/mo — Core AI assets & automation\n• **Tier 2 (Growth)**: $2,000–$2,750/mo — Full pipeline with agents\n• **Tier 3 (Enterprise)**: $4,250–$7,500/mo — Complete autonomous system\n\nWant a custom quote? Tell me a bit about your project!",
  booking:
    "I'd love to get you on a call with our team! Click below to book a time that works for you.",
  default:
    "Great question! I'd recommend booking a quick strategy call with our team — we'll map out exactly what you need. In the meantime, feel free to browse our services page or ask me anything specific!",
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(getSessionId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Load conversation history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    // Start with welcome message
    setMessages([WELCOME_MESSAGE]);
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Track chat open event
  useEffect(() => {
    if (isOpen && window.gtag) {
      window.gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'ai_chat_widget',
      });
    }
  }, [isOpen]);

  // Send message to n8n webhook
  const sendToWebhook = useCallback(
    async (userMessage) => {
      if (!CHAT_WEBHOOK_URL) {
        // Demo mode: return simulated response based on keywords
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
        const lower = userMessage.toLowerCase();
        if (lower.includes('service') || lower.includes('offer') || lower.includes('do you do'))
          return DEMO_RESPONSES.services;
        if (lower.includes('price') || lower.includes('cost') || lower.includes('much') || lower.includes('pricing') || lower.includes('tier'))
          return DEMO_RESPONSES.pricing;
        if (lower.includes('book') || lower.includes('call') || lower.includes('calendly') || lower.includes('strategy'))
          return DEMO_RESPONSES.booking;
        return DEMO_RESPONSES.default;
      }

      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
          timestamp: new Date().toISOString(),
          source: 'unthai_chat_widget',
        }),
      });

      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);

      const data = await response.json();
      return data.response || data.message || "Thanks for your message! Our team will get back to you soon.";
    },
    [messages, sessionId],
  );

  const handleSend = useCallback(
    async (text) => {
      const message = (text || input).trim();
      if (!message || isLoading) return;

      setInput('');
      const userMsg = { role: 'user', text: message, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Track message sent
      if (window.gtag) {
        window.gtag('event', 'chat_message_sent', {
          event_category: 'engagement',
          event_label: 'ai_chat_widget',
        });
      }

      try {
        const response = await sendToWebhook(message);
        const botMsg = { role: 'bot', text: response, id: Date.now() + 1 };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: "Sorry, I'm having trouble connecting right now. Please try again or email us directly at hello@unth.ai",
            id: Date.now() + 1,
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, sendToWebhook],
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply) => {
    if (reply.action === 'calendly') {
      if (CALENDLY_URL) {
        window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
      } else {
        handleSend('I want to book a call');
      }
      return;
    }
    handleSend(reply.label);
  };

  const handleBookCall = () => {
    if (CALENDLY_URL) {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
    if (window.gtag) {
      window.gtag('event', 'chat_book_call', {
        event_category: 'conversion',
        event_label: 'ai_chat_widget',
      });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          background: isOpen ? 'var(--color-text-muted)' : 'var(--color-accent)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <X size={24} color="var(--color-primary)" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <MessageCircle size={24} color="var(--color-primary)" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="chat-header-title">UNTH.AI Assistant</div>
                  <div className="chat-header-status">
                    <span className="chat-status-dot" />
                    Online — AI-powered
                  </div>
                </div>
              </div>
              <button className="chat-header-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0 : 0 }}
                  className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
                >
                  <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} ${msg.isError ? 'chat-bubble-error' : ''}`}>
                    <div className="chat-bubble-text">{msg.text}</div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chat-message chat-message-bot"
                >
                  <div className="chat-bubble chat-bubble-bot">
                    <div className="chat-typing">
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies (only on welcome message and no loading) */}
            {messages.length <= 1 && !isLoading && (
              <div className="chat-quick-replies">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.id}
                    className="chat-quick-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    <reply.icon size={14} />
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

      {/* Persistently show booking prompt when CALENDLY_URL is configured */}
      {CALENDLY_URL && (
        <div className="chat-booking-prompt">
          <button className="chat-booking-btn" onClick={handleBookCall}>
            <Calendar size={16} />
            Book Your Free Strategy Call
          </button>
        </div>
      )}

            {/* Input */}
            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  aria-label="Chat message"
                />
                <motion.button
                  className="chat-send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </motion.button>
              </div>
              {CALENDLY_URL && (
                <button className="chat-call-btn" onClick={handleBookCall}>
                  <Calendar size={14} />
                  Book a call instead
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
