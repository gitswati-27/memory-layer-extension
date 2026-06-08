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
    <div style={{ padding: "20px" }}>
        <select
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

      <ChatWidget isOpen={isChatOpen} onClose={() =>setIsChatOpen(false)}/>
        <button
  onClick={() =>
    setIsChatOpen(
      (prev) => !prev
    )
  }
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    fontSize: "24px",
    cursor: "pointer",
  }}
>
  {isChatOpen ? "✖" : "💬"}
</button>
    </div>
  );
}

