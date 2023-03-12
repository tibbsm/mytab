chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("background: ,", request, sender);
  console.log(request, sender);

  // Save the notes to a file
  chrome.storage.local.get("note", (items) => {
    if (items.note != null) {
      chrome.downloads.download({
        url: "data:text/plain," + encodeURIComponent(items.note),
        filename: "notes.txt",
      });
    }
  });

  sendResponse({ saveNotes: "saved" });
});
