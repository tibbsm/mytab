// FIXME: file name, not a popup
console.log("popup.js");

// TODO: Useful logs (needed?)
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("save");
  const note = document.getElementById("note");
  chrome.storage.local.get("note", function (items) {
    note.value = items.note;
    console.log("note initialized");
  });

  saveButton.addEventListener("click", function () {
    var note = document.getElementById("note").value;
    chrome.storage.local.set({ note });
    chrome.runtime.sendMessage({ saveNotes: true });
  });

  note.addEventListener("input", () => {
    processChange();
  });
});

// FIXME: add debounce => lib directory
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
