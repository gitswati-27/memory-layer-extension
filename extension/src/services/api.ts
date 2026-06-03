export async function saveMemory(memory: {
  title: string;
  url: string;
  content: string;
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