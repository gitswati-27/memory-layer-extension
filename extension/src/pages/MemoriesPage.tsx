import { useEffect, useState } from "react";
import { getMemories, searchMemories } from "../services/api";

type Memory = {
  id: string;
  title: string;
  url: string;
  content: string;
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getMemories().then(setMemories);
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

  return (
    <div style={{ padding: "20px" }}>
        <input type="text" placeholder="Search memories..." value={searchQuery} onChange={(e) =>
            setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        }}/> <button onClick={handleSearch}>Search </button>
      <h1>All Memories</h1>

      {memories.map((memory) => (
        <div key={memory.id}>
          <h3>{memory.title}</h3>
          <a
            href={memory.url}
            target="_blank"
            rel="noreferrer"
          >
            {memory.url}
          </a>

          <hr />
        </div>
      ))}
    </div>
  );
}

