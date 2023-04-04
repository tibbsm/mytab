document.addEventListener("DOMContentLoaded", function () {
  const noteEl = document.getElementById("note");
  const counterEl = document.getElementById("counter");

  if (noteEl != null) {
    chrome.storage.local.get("note", (items) => {
      if (items.note != null) {
        noteEl.value = items.note;
        const count = noteEl.value.length;
        counterEl.textContent = `${count} / 5000`;
        console.log("Note initialized");
      } else {
        console.log("Note was not found in local storage");
      }
    });
  } else {
    console.log("Could not find note element");
  }

  if (counterEl != null && noteEl != null) {
    noteEl.addEventListener("input", () => {
      const count = noteEl.value.length;
      counterEl.textContent = `${count} / 5000`;
    });
  }
});
