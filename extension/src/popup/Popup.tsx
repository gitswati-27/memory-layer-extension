import { useEffect, useState } from "react";
import {saveMemory, deleteMemory, getRecentMemories } from "../services/api";

type Memory = {
  id: string;
  title: string;
  url: string;
  content: string;
};

export default function Popup() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    try {
      const data = await getRecentMemories();
      setMemories(data);
    } catch (error) {
      console.error("Failed to fetch memories", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMemory(id);

      await loadMemories();
    }   catch (error) {
        console.error(error);
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
          await saveMemory(response);

          await loadMemories();

          console.log("Memory saved");
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  return (
    <div style={{ padding: "16px", width: "300px" }}>
      <h1>AI Web Memory</h1>

      <button onClick={handleSave}>
        Save Current Page
      </button>

      <hr />

      <h3>Saved Memories</h3>

      <ul>
        {memories.map((memory) => (
        <li key={memory.id}>
          <span>{memory.title}</span>
          <button onClick={() => handleDelete(memory.id)}> Delete </button>
        </li>
        ))}
      </ul>

      <button onClick={() => { chrome.tabs.create({
          url: chrome.runtime.getURL(
            "memories.html"
          ),
        });
      }}> View All </button>
    </div>
  );
}