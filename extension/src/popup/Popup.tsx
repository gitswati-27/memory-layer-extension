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
    <div
      style={{
        padding: "16px",
        width: "320px",
      }}
    >
      <h1>AI Web Memory</h1>

      <select
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
        onClick={
          handleCreateCollection
        }
      >
        + New Collection
      </button>

      <br />
      <br />

      <button onClick={handleSave}>
        Save Current Page
      </button>

      <hr />

      <h3>Recent Memories</h3>

      <ul>
        {memories.map((memory) => (
          <li
            key={memory.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "8px",
            }}
          >
            <span>{memory.title}</span>

            <button
              onClick={() =>
                handleDelete(memory.id)
              }
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          chrome.tabs.create({
            url: chrome.runtime.getURL(
              "memories.html"
            ),
          });
        }}
      >
        View All
      </button>
      <button onClick={openAssistant}>Open AI Assistant</button>
    </div>
  );
}