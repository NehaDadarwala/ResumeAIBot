import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  'Summarize this candidate',
  'List core skills',
  'Outline work experience',
];

export default function Chatbot({ resumeText, greeting }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(greeting ? [{ from: 'bot', text: greeting }] : []);
  }, [greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isSending) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: userMessage }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ask-cohere`, {
      // const res = await fetch(`http://localhost:5000/api/ask-cohere`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, resumeText }),
      });
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      let aiMessage = '';
      setMessages((msgs) => [...msgs, { from: 'bot', text: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder('utf-8').decode(value);
        aiMessage += chunk;
        const nextText = aiMessage;
        setMessages((msgs) => [...msgs.slice(0, -1), { from: 'bot', text: nextText }]);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Unable to reach the AI service. Please try again.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'bot' && (
              <div className="mr-3 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
                AI
              </div>
            )}
            <div
              className={
                msg.from === 'user'
                  ? 'max-w-[80%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-sm leading-6 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'max-w-[80%] rounded-2xl rounded-bl-md bg-zinc-50 px-4 py-2.5 text-sm leading-6 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-100'
              }
            >
              {msg.from === 'bot' && !msg.text ? (
                <span className="inline-flex gap-1 py-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
                </span>
              ) : (
                <div className="markdown">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
        {messages.length <= 1 && !isSending && (
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/50 dark:focus-within:border-zinc-500">
          <textarea
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about experience, skills, or education..."
            disabled={isSending}
          />
          <button
            className="mb-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
