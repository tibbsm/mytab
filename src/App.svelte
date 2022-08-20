<script lang="ts">
  import links from "./links";
  import { debounce } from "lodash-es";
  import { onMount } from "svelte";

  // FIXME: notes memory is not tracked anymore
  $: memoryUsed = 0;
  $: time = new Date();
  $: date = time.toLocaleDateString();
  let hideMemory = true;
  let notes: string;

  const padLeft = (t: string, n: number) => ("0".repeat(n) + t).slice(-1 * n);
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

  const getMemoryUsed = () =>
    chrome.storage?.sync.getBytesInUse(
      null,
      (bytesInUse) => (memoryUsed = Math.floor((bytesInUse / 102400) * 100))
    );

  const initializeMemory = () => {
    getMemoryUsed();
    chrome.storage?.onChanged.addListener(() => getMemoryUsed());
  };

  const getColor = (percent: number): string => {
    return percent > 90 ? "red" : percent > 70 ? "yellow" : "green";
  };

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    // NOTE: called when the component is destroy
    return () => clearInterval(interval);
  });

  initializeNotes();
  initializeMemory();
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
  <div>
    <button on:click={() => (hideMemory = !hideMemory)}>
      {hideMemory ? "Show Memory" : "Hide Memory"}
    </button>

    <div class="memory-wrapper {hideMemory && 'hide'}">
      <p>Total: ({memoryUsed}%)</p>
      <div class="meter">
        <span
          style={`width: ${memoryUsed}%; background-color: ${getColor(
            memoryUsed
          )}`}
        />
      </div>
    </div>
  </div>

  <div class="date-time-wrapper">
    <div>
      {date}
    </div>
    <div>
      {padLeft(`${time.getHours()}`, 2)}:{padLeft(
        `${time.getMinutes()}`,
        2
      )}:{padLeft(`${time.getSeconds()}`, 2)}
    </div>
  </div>
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

  /* Memory */
  .memory-wrapper p {
    color: var(--light);
  }
  .hide {
    display: none;
  }
  .meter {
    height: 1em;
    width: 25%;
    background: #555;
    border-radius: 25px;
    overflow: hidden;
  }
  .memory-wrapper .meter > span {
    position: relative;
    overflow: hidden;
    display: block;
    height: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  /* Time */
  .date-time-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
    color: var(--white);
    font-size: 1rem;
    font-weight: bold;
  }
</style>
