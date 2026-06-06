export async function saveMemory(memory: {
  title: string;
  url: string;
  content: string;
  collectionId?: string;
}) {
  const response = await fetch(
    "http://localhost:5000/memory/save",
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
    "http://localhost:5000/memory"
  );

  return response.json();
}

export async function getRecentMemories() {
  const response = await fetch(
    "http://localhost:5000/memory/recent"
  );

  return response.json();
}

export async function deleteMemory(id: string) {
  const response = await fetch(
    `http://localhost:5000/memory/${id}`,
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
    `http://localhost:5000/memory/search?q=${encodeURIComponent(query)}`
  );

  return response.json();
}

export async function getCollections() {
  const response = await fetch(
    "http://localhost:5000/collections"
  );

  return response.json();
}

export async function createCollection(
  name: string
) {
  const response = await fetch(
    "http://localhost:5000/collections",
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
    `http://localhost:5000/memory/collection/${collectionId}`
  );

  return response.json();
}