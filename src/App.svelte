<script lang="ts">
  import Time from "./Time.svelte";
  import Memory from "./Memory.svelte";
  import links from "./links";
  import { debounce } from "lodash-es";

  let notes: string;

  // XXX fix key logic
  const onKeyDown = (e: KeyboardEvent) => {
    const key = isNaN(Number(e.key)) ? null : Number(e.key);
    if (key >= 0 && key <= 9 && links[key - 1]) {
      window.location.href = links[key - 1][1];
    }
  };

  const saveNotes = () => {
    chrome.storage?.sync.set({ notes });
  };

  const initializeNotes = () => {
    chrome.storage?.sync.get(["notes"], ({ notes: n }) => {
      notes = n ?? "";
    });
  };

  initializeNotes();
</script>

<svelte:head>
  <title>My Tab</title>
  <html lang="en" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<svelte:window on:keydown={onKeyDown} />

<div class="page-wrapper">
  <div class="link-wrapper">
    {#each links as link, i}
      <a href={link[1]}>
        <div class="link">
          {i + 1}) {link[0]}
        </div>
      </a>
    {/each}
  </div>
  <div
    bind:innerHTML={notes}
    on:keyup={debounce(() => saveNotes(), 250)}
    contenteditable
  />
  <Memory />
  <Time />
</div>

<style>
  /* Global Styles */
  :global(:root) {
    --black: #121212;
    --dark: #52057b;
    --medium: #892cdc;
    --light: #bc6ff1;
    --white: #ffffff;
  }
  :global(*) {
    font-family: "Roboto", sans-serif;
  }
  :global(body) {
    background-color: var(--black);
  }
  :global(h1, h2) {
    color: var(--light);
  }
  :global(input, textarea) {
    background-color: #1b1e23;
    color: var(--light);
  }

  .page-wrapper {
    padding: 2em;
  }

  /* Links */
  .link-wrapper {
    border: 1px solid var(--white);
    border-radius: 5px;
    padding: 1em;
    width: fit-content;
  }
  .link {
    color: var(--white);
    padding-bottom: 1em;
    text-decoration: underline;
    font-size: 1.25em;
  }

  /* Notes */
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
