// FIXME: file name, not a popup
console.log("popup.js");

document.addEventListener("DOMContentLoaded", function () {
  const noteEl = document.getElementById("save");
  noteEl.addEventListener("click", function () {
    console.log("save button clicked");
    var note = document.getElementById("note").value;
    chrome.storage.local.set({ note });
    chrome.runtime.sendMessage({ saveNotes: true });
  });

  // FIXME: what is the event listener for changes to text/value input
  // noteEl.addEventListener("click", function () {
  //   console.log("save button clicked");
  //   var note = document.getElementById("note").value;
  //   chrome.storage.local.set({ note });
  //   chrome.runtime.sendMessage({ saveNotes: true });
  // });
});
