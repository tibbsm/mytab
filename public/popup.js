console.log("popup");

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("save").addEventListener("click", function () {
    console.log("save button clicked");
    var note = document.getElementById("note").value;
    chrome.storage.local.set({ note });
    chrome.runtime.sendMessage({ saveNotes: true });
  });
});
