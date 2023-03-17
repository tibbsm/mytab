console.log("script.js");

// NOTE: preferred notes for functions and such
const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const debouncedSaveNote = debounce(() => saveNote());

const saveNote = () => {
  const noteEl = document.getElementById("note");
  const noteElValue = noteEl.value;
  if (noteElValue !== "") {
    chrome.storage.local.set({ note: noteElValue }, () => {
      console.log("note saved");
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("save");
  const noteEl = document.getElementById("note");

  if (noteEl != null) {
    chrome.storage.local.get("note", (items) => {
      if (items.note != null) {
        noteEl.value = items.note;
        console.log("Note initialized");
      } else {
        console.log("Note was not found in local storage");
      }
    });
  } else {
    console.log("Could note find note element");
  }

  if (saveButton != null) {
    saveButton.addEventListener("click", () => {
      const noteValue = noteEl.value;
      chrome.storage.local.set({ note: noteValue }, () => {
        console.log("note set to: ", noteValue);
      });
      chrome.runtime.sendMessage({ saveNotes: true });
    });
  } else {
    console.log("Could note find save button element");
  }

  noteEl.addEventListener("input", () => {
    debouncedSaveNote();
  });
});
