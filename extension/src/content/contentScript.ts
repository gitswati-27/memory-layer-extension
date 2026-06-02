console.log("CONTENT SCRIPT LOADED");

function extractPageContent() {
  return {
    title: document.title,
    url: window.location.href,
    content: document.body.innerText,
  };
}

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type === "EXTRACT_PAGE") {
      sendResponse(extractPageContent());
    }
  }
);