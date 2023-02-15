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

// FIXME: add debounce => lib directory
// XXX What does args do in this context?
// XXX how is timer shared between the different functions calls?
// NOTE: The rest parameter syntax allows a function to accept an indefinite number of arguments as an array,
function debounce(func, timeout = 300) {
  let timer;
  // return a function and spread the args (pass an array to it)
  return (...args) => {
    // which first clears the existing times. how? (this)
    clearTimeout(timer);

    // create a new timers, which calls the passed in functions with the passed in args
    timer = setTimeout(() => {
      // apply takes this context and calls func with args
      // NOTE: whats the difference between .call(), .apply(), bind(),
      // NOTE: bind does not call the function, just creates it.
      // NOTE: call just calls it while apply allows you to pass args
      // NOTE: So if Im correct you are passing the context of this function to the next one
      // NOTE: Therefore you are able to have access to timer (to clear it and redefine it)
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
