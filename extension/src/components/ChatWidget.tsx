import {
  useState,
  useRef,
  useEffect,
} from "react";

type ChatWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

function renderMessage(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = content.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <div
          key={index}
          style={{
            marginTop: "8px",
          }}
        >
          <a
            href={part}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#2dd4bf",
              textDecoration: "none",
              fontSize: "12px",
              letterSpacing: "0.05em",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderBottom: "1px solid rgba(45,212,191,0.35)",
              paddingBottom: "1px",
            }}
          >
            ↗ Open Source
          </a>
        </div>
      );
    }

    return (
      <span key={index}>
        {part}
      </span>
    );
  });
}

export default function ChatWidget({
  isOpen,
  onClose,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
  const savedMessages =
    localStorage.getItem(
      "ai-memory-chat"
    );

  if (savedMessages) {
    return JSON.parse(savedMessages);
  }

  return [
    {
      role: "assistant",
      content:
        "Hi! Ask me anything about your saved memories.",
    },
  ];
});

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  useEffect(() => {
  localStorage.setItem(
    "ai-memory-chat",
    JSON.stringify(messages)
  );
}, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/memory/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ??
            "No answer received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while contacting the AI assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap');

        .cw-root {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 400px;
          height: 550px;
          background: rgba(15, 20, 30, 0.94);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04) inset;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: cwSlideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes cwSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
        }

        .cw-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          color: #f1f5f9;
          letter-spacing: 0.01em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cw-dot {
          width: 7px;
          height: 7px;
          background: #2dd4bf;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #2dd4bf;
          animation: cwPulse 2.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes cwPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .cw-close-btn {
          background: rgba(255,255,255,0.07);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #94a3b8;
          font-size: 13px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          line-height: 1;
        }

        .cw-close-btn:hover {
          background: rgba(255,255,255,0.13);
          color: #f1f5f9;
        }

        .cw-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 16px;
        }

        .cw-messages::-webkit-scrollbar { width: 3px; }
        .cw-messages::-webkit-scrollbar-track { background: transparent; }
        .cw-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .cw-msg-row {
          display: flex;
          margin-bottom: 12px;
          animation: cwFadeIn 0.22s ease both;
        }

        @keyframes cwFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cw-msg-row.user { justify-content: flex-end; }
        .cw-msg-row.assistant { justify-content: flex-start; }

        .cw-bubble {
          max-width: 80%;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          border-radius: 16px;
        }

        .cw-bubble.user {
          background: linear-gradient(135deg, #0d9488, #2dd4bf);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .cw-bubble.assistant {
          background: rgba(255,255,255,0.07);
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom-left-radius: 4px;
        }

        .cw-thinking {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          color: #475569;
          padding: 0 4px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .cw-thinking-dots { display: flex; gap: 3px; }

        .cw-thinking-dots span {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #2dd4bf;
          border-radius: 50%;
          animation: cwDot 1.2s ease-in-out infinite;
        }
        .cw-thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
        .cw-thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes cwDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .cw-input-area {
          display: flex;
          gap: 10px;
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          align-items: center;
        }

        .cw-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .cw-input::placeholder { color: #475569; }

        .cw-input:focus {
          border-color: rgba(45,212,191,0.4);
          background: rgba(255,255,255,0.09);
        }

        .cw-send-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #0d9488, #2dd4bf);
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .cw-send-btn:hover:not(:disabled) {
          opacity: 0.85;
          transform: scale(1.03);
        }

        .cw-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>

      <div className="cw-root">
        <div className="cw-header">
          <h3 className="cw-title">
            <span className="cw-dot" />
            AI Assistant
          </h3>
          <button className="cw-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cw-messages">
          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={`cw-msg-row ${message.role}`}
              >
                <div className={`cw-bubble ${message.role}`}>
                  {renderMessage(message.content)}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="cw-thinking">
              <div className="cw-thinking-dots">
                <span /><span /><span />
              </div>
              Assistant is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="cw-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            placeholder="Ask about your memories..."
            className="cw-input"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !loading
              ) {
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="cw-send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}