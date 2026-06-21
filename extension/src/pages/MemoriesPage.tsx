import { useEffect, useState } from "react";
import { getMemories, searchMemories, getCollections, getMemoriesByCollection} from "../services/api";
import ChatWidget from "../components/ChatWidget";

type Memory = {
  id: string;
  title: string;
  url: string;
  content: string;
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    getMemories().then(setMemories);
    getCollections().then(setCollections);

  }, []);

  useEffect(() => {
  const params =
    new URLSearchParams(
      window.location.search
    );

  if (
    params.get("assistant") ===
    "open"
  ) {
    setIsChatOpen(true);
  }
}, []);

  async function handleSearch() {
  try {
    if (!searchQuery.trim()) {
      const data = await getMemories();
      setMemories(data);
      return;
    }

    const results = await searchMemories(
      searchQuery
    );

    setMemories(results);
  } catch (error) {
    console.error(error);
  }
}

async function handleCollectionChange(
  collectionId: string
) {
  setSelectedCollection(
    collectionId
  );

  if (!collectionId) {
    const memories =
      await getMemories();

    setMemories(memories);

    return;
  }

  const memories =
    await getMemoriesByCollection(
      collectionId
    );

  setMemories(memories);
}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          min-height: 100vh;
          background: #0b1120;
        }

        .mp-root {
          min-height: 100vh;
          background: #0b1120;
          padding: 48px 40px 140px;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          max-width: 900px;
          margin: 0 auto;
        }

        .mp-header {
          margin-bottom: 44px;
        }

        .mp-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2dd4bf;
          display: block;
          margin-bottom: 10px;
        }

        h1.mp-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 400;
          color: #f8fafc;
          margin: 0 0 32px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .mp-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .mp-select {
          padding: 10px 36px 10px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          background: rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E") no-repeat right 12px center;
          appearance: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #cbd5e1;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          min-width: 165px;
          backdrop-filter: blur(8px);
        }

        .mp-select:focus {
          border-color: rgba(45,212,191,0.4);
          background-color: rgba(255,255,255,0.08);
        }

        .mp-search-wrap {
          flex: 1;
          min-width: 220px;
          display: flex;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          transition: border-color 0.2s;
        }

        .mp-search-wrap:focus-within {
          border-color: rgba(45,212,191,0.4);
        }

        .mp-search-input {
          flex: 1;
          padding: 10px 14px;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #e2e8f0;
          outline: none;
        }

        .mp-search-input::placeholder { color: #475569; }

        .mp-search-btn {
          padding: 10px 16px;
          background: none;
          border: none;
          border-left: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }

        .mp-search-btn:hover {
          color: #2dd4bf;
          background: rgba(45,212,191,0.06);
        }

        .mp-memories-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mp-memory-card {
          padding: 22px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          animation: mpFadeUp 0.3s ease both;
        }

        @keyframes mpFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mp-memory-card h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 19px;
          font-weight: 400;
          color: #f1f5f9;
          margin: 0 0 8px;
          letter-spacing: 0.01em;
          line-height: 1.35;
        }

        .mp-memory-card a {
          font-size: 12.5px;
          color: #475569;
          text-decoration: none;
          word-break: break-all;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .mp-memory-card a:hover {
          color: #2dd4bf;
        }

        .mp-empty {
          padding: 60px 0;
          text-align: center;
          color: #334155;
          font-style: italic;
          font-size: 15px;
          font-family: 'Playfair Display', serif;
        }

        .mp-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #0d9488, #2dd4bf);
          color: #fff;
          box-shadow: 0 6px 24px rgba(13,148,136,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 999;
          line-height: 1;
        }

        .mp-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 32px rgba(13,148,136,0.55);
        }
      `}</style>

      <div className="mp-root">
        <header className="mp-header">
          <span className="mp-label">Memory Archive</span>
          <h1 className="mp-title">All pages</h1>

          <div className="mp-controls">
            <select
              className="mp-select"
              value={selectedCollection}
              onChange={(e) =>
                handleCollectionChange(
                  e.target.value
                )
              }
            >
              <option value="">
                All Collections
              </option>

              {collections.map(
                (collection: any) => (
                  <option
                    key={collection.id}
                    value={collection.id}
                  >
                    {collection.name}
                  </option>
                )
              )}
            </select>

            <div className="mp-search-wrap">
              <input
                className="mp-search-input"
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button className="mp-search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </header>

        <div className="mp-memories-list">
          {memories.length === 0 ? (
            <p className="mp-empty">No pages found.</p>
          ) : (
            memories.map((memory, i) => (
              <div
                key={memory.id}
                className="mp-memory-card"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <h3>{memory.title}</h3>
                <a
                  href={memory.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {memory.url}
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <button
        className="mp-fab"
        onClick={() =>
          setIsChatOpen(
            (prev) => !prev
          )
        }
      >
        {isChatOpen ? "✕" : "💬"}
      </button>
    </>
  );
}