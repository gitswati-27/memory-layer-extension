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
              color: "#0066cc",
              textDecoration:
                "underline",
            }}
          >
            🔗 Open Source
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
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "400px",
        height: "550px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={onClose}
        style={{
          alignSelf: "flex-end",
          cursor: "pointer",
        }}
      >
        ✖
      </button>

      <h3>AI Assistant</h3>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "10px",
          paddingRight: "5px",
        }}
      >
        {messages.map(
          (message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "14px",
                  background:
                    message.role ===
                    "user"
                      ? "#007bff"
                      : "#f1f1f1",
                  color:
                    message.role ===
                    "user"
                      ? "white"
                      : "black",
                  whiteSpace:
                    "pre-wrap",
                  wordBreak:
                    "break-word",
                }}
              >
                {renderMessage(
                  message.content
                )}
              </div>
            </div>
          )
        )}

        {loading && (
          <div
            style={{
              marginBottom: "12px",
            }}
          >
            Assistant is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "10px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask about your memories..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius:
              "8px",
            border:
              "1px solid #ccc",
          }}
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
          style={{
            padding:
              "10px 14px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}