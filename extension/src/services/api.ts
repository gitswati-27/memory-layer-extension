export async function saveMemory(memory: {
  title: string;
  url: string;
  content: string;
  collectionId?: string;
}) {
  const response = await fetch(
    "https://memory-layer-extension.onrender.com/memory/save",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memory),
    }
  );

  return response.json();
}

export async function getMemories() {
  const response = await fetch(
    "https://memory-layer-extension.onrender.com/memory"
  );

  return response.json();
}

export async function getRecentMemories() {
  const response = await fetch(
    "https://memory-layer-extension.onrender.com/memory/recent"
  );

  return response.json();
}

export async function deleteMemory(id: string) {
  const response = await fetch(
    `https://memory-layer-extension.onrender.com/memory/${id}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

export async function searchMemories(
  query: string
) {
  const response = await fetch(
    `https://memory-layer-extension.onrender.com/memory/search?q=${encodeURIComponent(query)}`
  );

  return response.json();
}

export async function getCollections() {
  const response = await fetch(
    "https://memory-layer-extension.onrender.com/collections"
  );

  return response.json();
}

export async function createCollection(
  name: string
) {
  const response = await fetch(
    "https://memory-layer-extension.onrender.com/collections",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    }
  );

  return response.json();
}

export async function getMemoriesByCollection(
  collectionId: string
) {
  const response = await fetch(
    `https://memory-layer-extension.onrender.com/memory/collection/${collectionId}`
  );

  return response.json();
}