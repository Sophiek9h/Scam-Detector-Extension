document.getElementById('scanBtn').onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      alert("⚠️ No active tab found.");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { action: "showResult" }, (response) => {
      const err = chrome.runtime.lastError; // suppress the error silently
    });
  });
};