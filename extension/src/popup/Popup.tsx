export default function Popup() {
  return (
    <div style={{ padding: "16px", width: "300px" }}>
      <h1>AI Web Memory</h1>

      <button onClick={handleSave}>
        Save Current Page
      </button>
    </div>

  );
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
    (response) => {
      console.log(response);
    }
  );
}
}