chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, sender);

  // FIXME: Add null check here on items.note?
  // Save the notes to a file
  chrome.storage.local.get("note", function (items) {
    chrome.downloads.download({
      url: "data:text/plain," + encodeURIComponent(items.note),
      filename: "notes.txt",
    });
  });

  sendResponse({ saveNotes: "saved" });
});
