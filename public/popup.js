console.log("popup");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  document.getElementById("save").addEventListener("click", function () {
    console.log("save clicked");
    var note = document.getElementById("note").value;
    // Save the note to storage
    chrome.storage.local.set({ note });
    // FIXME: send msg to background to save note
  });
});
