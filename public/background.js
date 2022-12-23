// NOTE: wait for msg from front to save
chrome.storage.local.get("note", function (items) {
  var note = items.note;
  // Save the note to a file
  console.log(chrome);
  console.log(chrome.downloads);
  chrome.downloads.download({
    url: "data:text/plain," + encodeURIComponent(note),
    filename: "notes.txt",
  });
});
