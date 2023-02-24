// FIXME: file name, not a popup
console.log("popup.js");

// TODO: Useful logs (needed?)
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("save");
  const noteEl = document.getElementById("note");

  if (noteEl != null) {
    chrome.storage.local.get("note", function (items) {
      if (items.note != null) {
        noteEl.value = items.note;
        console.log("Note initialized");
      } else {
        console.log("Note was not found in local storage");
      }
    });
  } else {
    console.log("Could note fund note element");
  }

  saveButton.addEventListener("click", function () {
    const noteValue = noteEl.value;
    chrome.storage.local.set({ note: noteValue });
    chrome.runtime.sendMessage({ saveNotes: true });
  });

  noteEl.addEventListener("input", () => {
    // NOTE: not the prettiest thing in the world?
    debounce(() => saveNote(), 300)();
  });
});

// FIXME: add debounce => lib directory
// TODO: How would I do this?
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function saveNote() {
  const noteEl = document.getElementById("note");
  var noteElValue = noteEl.value;
  if (noteElValue != null && noteElValue !== "") {
    chrome.storage.local.set({ note: noteElValue }).then(() => {
      console.log("note saved");
    });
  }
}
