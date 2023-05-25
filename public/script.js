document.addEventListener("DOMContentLoaded", () => {
  const noteEl = document.getElementById("note");
  const counterEl = document.getElementById("counter");
  if (noteEl != null) {
    chrome.storage.local.get("note", (items) => {
      if (items.note != null) {
        noteEl.value = items.note;
        counterEl.textContent = `${items.note.length} / 5000`;
        console.log("Note initialized");
      } else {
        console.log("Note was not found in local storage");
      }
    });
    if (counterEl != null) {
      noteEl.addEventListener("input", () => {
        counterEl.textContent = `${noteEl.value.length} / 5000`;
        chrome.storage.local.set({ note: noteEl.value });
      });
    } else {
      console.log("Could not find counter element");
    }
  } else {
    console.log("Could not find note element");
  }
});
