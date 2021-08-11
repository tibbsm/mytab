<script>
  import { debounce } from "lodash-es";

  let notes = "";

  initializeNotes();

  function saveNotes() {
    chrome.storage.sync.set({ notes: notes });
  }

  function initializeNotes() {
    chrome.storage.sync.get(["notes"], function (items) {
      notes = items["notes"] || "";
    });
  }

  function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let text = content.replace(/<\/?[^>]+(>|$)/g, "\n");
    a.href = URL.createObjectURL(new Blob([text], { type: contentType }));
    a.download = fileName;
    a.click();
  }
</script>

<h1>Notes</h1>
<div
  class="notes"
  bind:innerHTML={notes}
  on:keyup={debounce(() => saveNotes(), 250)}
  contenteditable
/>

<br />

<button on:click={() => download(notes, "MyTabNotes.txt", "text/plain")}
  >Save notes</button
>

<style>
  [contenteditable] {
    min-height: 50px;
    width: 50%;
    border-radius: 3px;
    padding: 5px;
  }
</style>
