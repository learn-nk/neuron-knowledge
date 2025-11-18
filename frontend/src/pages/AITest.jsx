import React, { useState } from "react";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";

// API Configuration
const BASE_URL = "http://localhost:3000";

const askAI = async (question) => {
  const res = await fetch(`${BASE_URL}/api/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
};

export default function AITest() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await askAI(question);
      setAnswer(res.answer);
      
      // Add to history
      setHistory(prev => [...prev, { 
        question, 
        answer: res.answer,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setQuestion("");
    } catch (err) {
      setError(err.message || "Failed to get response. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-4xl font-bold text-white">AI Assistant</h1>
          </div>
          <p className="text-purple-300">Ask me anything!</p>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
          {/* Current Answer */}
          {answer && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                  <div className="text-white leading-relaxed">{answer}</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="relative">
            <textarea
              className="w-full bg-white/5 border border-white/20 rounded-xl p-4 pr-14 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question... (Press Enter to send)"
              rows={3}
              disabled={loading}
            />
            
            <button
              className={`absolute bottom-4 right-4 p-3 rounded-lg transition-all ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50"
              }`}
              onClick={handleAsk}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="text-white animate-spin" size={20} />
              ) : (
                <Send className="text-white" size={20} />
              )}
            </button>
          </div>

          <p className="text-purple-300/60 text-sm mt-2 text-center">
            {loading ? "Thinking..." : "Press Enter to send, Shift+Enter for new line"}
          </p>
        </div>

        {/* Conversation History */}
        {history.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>💬</span> Conversation History
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {history.map((item, idx) => (
                <div key={idx} className="border-l-2 border-purple-500/30 pl-4">
                  <p className="text-purple-300 text-sm mb-1">{item.timestamp}</p>
                  <p className="text-white/80 mb-2">
                    <span className="font-semibold">Q:</span> {item.question}
                  </p>
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">A:</span> {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}