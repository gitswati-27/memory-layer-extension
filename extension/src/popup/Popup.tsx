import { useEffect, useState } from "react";

import {
  getRecentMemories,
  saveMemory,
  deleteMemory,
  getCollections,
  createCollection,
} from "../services/api";

type Memory = {
  id: string;
  title: string;
  url: string;
  content: string;
};

type Collection = {
  id: string;
  name: string;
};

export default function Popup() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState("");

  useEffect(() => {
    loadMemories();
    loadCollections();
  }, []);

  async function loadMemories() {
    try {
      const data = await getRecentMemories();
      setMemories(data);
    } catch (error) {
      console.error("Failed to fetch memories", error);
    }
  }

  async function loadCollections() {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error(
        "Failed to fetch collections",
        error
      );
    }
  }

  async function handleSave() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      {
        type: "EXTRACT_PAGE",
      },
      async (response) => {
        try {
          await saveMemory({
            ...response,
            collectionId: selectedCollection,
          });

          await loadMemories();

          console.log("Memory saved");
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  async function handleDelete(id: string) {
    try {
      await deleteMemory(id);

      await loadMemories();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateCollection() {
  const name = window.prompt(
    "Enter collection name"
  );

  if (!name?.trim()) return;

  try {
    const collection =
      await createCollection(name);

    await loadCollections();

    setSelectedCollection(
      collection.id
    );
  } catch (error) {
    console.error(error);
  }
}

function openAssistant() {
  chrome.tabs.create({
    url:
      chrome.runtime.getURL(
        "memories.html?assistant=open"
      ),
  });
}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0b1120;
          margin: 0;
        }

        .pp-root {
          width: 320px;
          min-height: 500px;
          background: #0f1829;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .pp-header {
          padding: 20px 18px 16px;
          background: linear-gradient(135deg, #0d1a2e, #0f2335);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }

        .pp-header::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        .pp-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2dd4bf;
          display: block;
          margin-bottom: 5px;
        }

        .pp-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          color: #f8fafc;
          letter-spacing: 0.01em;
        }

        .pp-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pp-section-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
          display: block;
          margin-bottom: 8px;
        }

        .pp-collection-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        }

        .pp-select {
          flex: 1;
          padding: 9px 28px 9px 12px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%2364748b'/%3E%3C/svg%3E") no-repeat right 10px center;
          appearance: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #cbd5e1;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .pp-select:focus {
          border-color: rgba(45,212,191,0.4);
        }

        .pp-btn-ghost {
          padding: 9px 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .pp-btn-ghost:hover {
          border-color: rgba(45,212,191,0.4);
          color: #2dd4bf;
          background: rgba(45,212,191,0.06);
        }

        .pp-btn-save {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #0d9488, #2dd4bf);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          margin-bottom: 20px;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .pp-btn-save:hover {
          opacity: 0.88;
          transform: scale(1.01);
        }

        .pp-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 -18px 18px;
        }

        .pp-recent-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 12px;
          display: block;
        }

        .pp-memories-list {
          list-style: none;
          flex: 1;
          margin-bottom: 16px;
        }

        .pp-memory-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 10px;
          animation: ppFadeIn 0.2s ease both;
        }

        @keyframes ppFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .pp-memory-item:last-child { border-bottom: none; }

        .pp-memory-item span {
          font-size: 13.5px;
          color: #cbd5e1;
          line-height: 1.35;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }

        .pp-delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #334155;
          font-size: 11px;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .pp-delete-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .pp-empty {
          font-size: 13px;
          color: #334155;
          font-style: italic;
          padding: 12px 0;
        }

        .pp-footer {
          padding: 14px 18px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          gap: 8px;
        }

        .pp-footer-btn {
          flex: 1;
          padding: 10px 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #64748b;
          transition: all 0.2s;
          text-align: center;
        }

        .pp-footer-btn:hover {
          color: #e2e8f0;
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
        }

        .pp-footer-btn.teal {
          border-color: rgba(45,212,191,0.25);
          color: #2dd4bf;
          background: rgba(45,212,191,0.06);
        }

        .pp-footer-btn.teal:hover {
          background: rgba(45,212,191,0.14);
          border-color: rgba(45,212,191,0.5);
        }
      `}</style>

      <div className="pp-root">
        <header className="pp-header">
          <span className="pp-label">Save your pages on-the-go</span>
          <h1 className="pp-title">AI Web Memory</h1>
        </header>

        <div className="pp-body">
          <span className="pp-section-label">Collection</span>
          <div className="pp-collection-row">
            <select
              className="pp-select"
              value={selectedCollection}
              onChange={(e) =>
                setSelectedCollection(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Collection
              </option>

              {collections.map((collection) => (
                <option
                  key={collection.id}
                  value={collection.id}
                >
                  {collection.name}
                </option>
              ))}
            </select>

            <button
              className="pp-btn-ghost"
              onClick={handleCreateCollection}
            >
              + New
            </button>
          </div>

          <button className="pp-btn-save" onClick={handleSave}>
            ＋ Save Current Page
          </button>

          <div className="pp-divider" />

          <span className="pp-recent-label">Recently saved</span>

          <ul className="pp-memories-list">
            {memories.length === 0 ? (
              <p className="pp-empty">Nothing saved yet.</p>
            ) : (
              memories.map((memory) => (
                <li
                  key={memory.id}
                  className="pp-memory-item"
                >
                  <span>{memory.title}</span>

                  <button
                    className="pp-delete-btn"
                    onClick={() =>
                      handleDelete(memory.id)
                    }
                  >
                    ❌
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <footer className="pp-footer">
          <button
            className="pp-footer-btn"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL(
                  "memories.html"
                ),
              });
            }}
          >
            View All Saved Pages
          </button>
          <button className="pp-footer-btn teal" onClick={openAssistant}>Open AI Help</button>
        </footer>
      </div>
    </>
  );
}