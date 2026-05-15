import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Sidebar({ user, logout, history, historyLoading, onSelectHistory, onNewChat, onClearHistory }) {
  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div style={{
      width: "260px", flexShrink: 0, background: "#1e293b",
      borderRight: "0.5px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", height: "100%"
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: "36px", height: "36px", background: "#3b82f6",
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>MediCare AI</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Medical Assistant</div>
          </div>
        </div>
        <button onClick={onNewChat} style={{
          width: "100%", background: "rgba(59,130,246,0.1)",
          border: "0.5px solid rgba(59,130,246,0.25)", color: "#93c5fd",
          borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New conversation
        </button>
      </div>

      {/* History */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>

        {/* History header + delete button */}
        <div style={{
          padding: "12px 16px 6px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{
            fontSize: "10px", color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em", textTransform: "uppercase"
          }}>
            Recent
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear all history"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.25)", padding: "2px",
                display: "flex", alignItems: "center", transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          )}
        </div>

        {historyLoading ? (
          <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Loading...
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
            No history yet
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              style={{
                padding: "8px 16px", cursor: "pointer",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", marginTop: "5px", flexShrink: 0
              }} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.4,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 1, WebkitBoxOrient: "vertical"
                }}>
                  {item.query}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "2px" }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer — user info + logout */}
      <div style={{
        padding: "12px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: "500", color: "white", flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>{user?.name}</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Medical Professional</div>
        </div>
        <button
          onClick={logout}
          title="Logout"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", padding: "4px", display: "flex"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div style={{
      display: "flex", gap: "12px", alignItems: "flex-start",
      flexDirection: isUser ? "row-reverse" : "row"
    }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isUser ? "linear-gradient(135deg,#3b82f6,#06b6d4)" : "rgba(59,130,246,0.15)",
        border: isUser ? "none" : "0.5px solid rgba(59,130,246,0.25)"
      }}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        )}
      </div>
      <div style={{ maxWidth: "72%" }}>
        <div style={{
          padding: "12px 16px",
          borderRadius: "16px",
          borderTopLeftRadius: isUser ? "16px" : "4px",
          borderTopRightRadius: isUser ? "4px" : "16px",
          fontSize: "13px", lineHeight: 1.65,
          background: isUser ? "#3b82f6" : "#1e293b",
          color: isUser ? "white" : "rgba(255,255,255,0.85)",
          border: isUser ? "none" : "0.5px solid rgba(255,255,255,0.07)",
          whiteSpace: "pre-wrap"
        }}>
          {content}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(59,130,246,0.15)", border: "0.5px solid rgba(59,130,246,0.25)"
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <div style={{
        background: "#1e293b", border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", borderTopLeftRadius: "4px",
        padding: "14px 18px", display: "flex", gap: "5px", alignItems: "center"
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello${user?.name ? ` Dr. ${user.name.split(" ")[0]}` : ""}! I'm MediCare AI, your intelligent medical assistant.\n\nI have access to comprehensive clinical references covering diseases, pharmacology, diagnostics, emergency medicine, and more.\n\nHow can I help you today?`
    }
  ]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [history, setHistory]       = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    api.get("/chat/history")
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setLoading(true);
    try {
      const res = await api.post("/chat", { query, top_k: 3 });
      const answer = res.data.answer;
      setMessages(prev => [...prev, { role: "assistant", content: answer }]);
      setHistory(prev => [{
        id: Date.now(), query, answer,
        created_at: new Date().toISOString()
      }, ...prev]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onNewChat = () => {
    setMessages([{ role: "assistant", content: "New conversation started. How can I help you?" }]);
  };

  const onSelectHistory = (item) => {
    setMessages([
      { role: "user", content: item.query },
      { role: "assistant", content: item.answer },
    ]);
  };

  const onClearHistory = async () => {
    try {
      await api.delete("/chat/history");
      setHistory([]);
    } catch {
      console.error("Failed to clear history");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", background: "#0f172a" }}>
      <Sidebar
        user={user}
        logout={logout}
        history={history}
        historyLoading={historyLoading}
        onSelectHistory={onSelectHistory}
        onNewChat={onNewChat}
        onClearHistory={onClearHistory}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: "500" }}>
              Medical Knowledge Assistant
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "2px" }}>
              Powered by RAG + Groq LLaMA 3.3 70B
            </div>
          </div>
          <div style={{
            background: "rgba(34,197,94,0.08)", border: "0.5px solid rgba(34,197,94,0.2)",
            color: "#4ade80", fontSize: "11px", padding: "5px 12px",
            borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            Online
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px"
        }}>
          {messages.map((msg, i) => <Message key={i} role={msg.role} content={msg.content} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px 20px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            background: "#1e293b", border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", display: "flex", alignItems: "flex-end",
            gap: "8px", padding: "10px 12px"
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask a medical question... (Enter to send)"
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "rgba(255,255,255,0.85)", fontSize: "13px", resize: "none",
                fontFamily: "inherit", lineHeight: 1.5, maxHeight: "80px"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "32px", height: "32px",
                background: loading || !input.trim() ? "rgba(59,130,246,0.3)" : "#3b82f6",
                border: "none", borderRadius: "8px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{
            textAlign: "center", color: "rgba(255,255,255,0.18)",
            fontSize: "10px", marginTop: "8px"
          }}>
            For informational purposes only. Always consult a qualified clinician.
          </div>
        </div>
      </div>
    </div>
  );
}
