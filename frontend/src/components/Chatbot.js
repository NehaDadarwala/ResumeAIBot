import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chatbot({ resumeText, greeting }) {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: greeting
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); // run when messages update


  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(msgs => [...msgs, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ask-cohere`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, resumeText })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'bot', text: data.response || data.error || 'No response from AI.' }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Error contacting AI backend.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 border rounded-2xl shadow-2xl bg-white dark:bg-gray-900 flex flex-col min-h-[60vh] h-[80vh] md:h-[70vh] lg:h-[80vh] p-4 md:p-8">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.from === 'user' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}
              style={{ display: 'inline-block', borderRadius: '1rem', padding: '0.75rem 1.25rem', margin: '0.25rem 0', maxWidth: '80%', wordWrap: 'break-word', fontSize: '1.1rem' }}>
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>              </div>
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <span className="bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-400" style={{ display: 'inline-block', borderRadius: '1rem', padding: '0.75rem 1.25rem', margin: '0.25rem 0', maxWidth: '80%', wordWrap: 'break-word', fontSize: '1.1rem' }}>
              Thinking...
            </span>
          </div>
        )}
      </div>
      <div className="p-2 md:p-4 border-t flex gap-2 bg-white dark:bg-gray-900 sticky bottom-0">
        <input
          className="flex-1 border rounded-l-lg px-4 py-3 focus:outline-none text-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your resume..."
        />
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-lg font-semibold transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
} 