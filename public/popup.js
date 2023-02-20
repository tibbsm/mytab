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
        console.log("note initialized");
      }
      console.log("note was not found in local storage");
    });
  } else {
    console.log("Could note fund note element");
  }

  saveButton.addEventListener("click", function () {
    var note = noteEl.value;
    chrome.storage.local.set({ note });
    chrome.runtime.sendMessage({ saveNotes: true });
  });

  noteEl.addEventListener("input", () => {
    processChange();
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
  var note = document.getElementById("note").value;
  chrome.storage.local.set({ note });
  console.log("note saved");
}

const processChange = debounce(() => saveNote());
