<script lang="ts">
  import { debounce } from "lodash-es";

  let notes: string;

  const saveNotes = () => {
    chrome.storage?.sync.set({ notes: notes });
  };

  const initializeNotes = () => {
    chrome.storage?.sync.get(["notes"], (items) => {
      notes = items["notes"] || "";
    });
  };

  initializeNotes();
</script>

<div
  bind:innerHTML={notes}
  on:keyup={debounce(() => saveNotes(), 250)}
  contenteditable
/>

<style>
  [contenteditable] {
    width: 50%;
    border-radius: 5px;
    padding: 0.5em;
    margin-bottom: 1em;

    color: #fff;
    border: none;
    border-bottom: 1px solid var(--light);
    background-color: var(--black);
    outline: none;
  }
</style>
