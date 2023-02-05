// FIXME: file name, not a popup
console.log("popup.js");

document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("save");
  const note = document.getElementById("note");
  console.log(note);
  chrome.storage.local.get("note", function (items) {
    note.value = items.note;
    console.log("note initialized");
  });

  saveBtn.addEventListener("click", function () {
    console.log("save button clicked");
    var note = document.getElementById("note").value;
    chrome.storage.local.set({ note });
    chrome.runtime.sendMessage({ saveNotes: true });
  });

  note.addEventListener("input", () => {
    processChange();
  });
});

// FIXME: add debounce => lib?
// XXX What does args do in this context?
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
