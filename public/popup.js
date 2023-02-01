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

  // FIXME: add debounce
  // noteEl.addEventListener("input", function () {
  //   console.log("notes updated");
  //   var note = document.getElementById("note").value;
  //   chrome.storage.local.set({ note });
  // });
});
