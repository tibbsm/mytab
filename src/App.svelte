<script lang="ts">
  // FIXME: make object instead of array
  import { links } from "./links";
  import { debounce } from "lodash-es";
  import { onMount } from "svelte";

  $: notesMemoryUsed = 0;
  $: now = new Date();

  const {
    storage: { sync: chromeSync, onChanged: chromeOnChanged },
  } = chrome;

  const { QUOTA_BYTES_PER_ITEM } = chromeSync;

  let notes = "";

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);
    // NOTE: called when the component is unmounted
    return () => clearInterval(interval);
  });

  const padLeft = (s: string, padding: number) => {
    return ("0".repeat(padding) + s).slice(-1 * padding);
  };

  const getFormattedTime = (time: Date) => {
    return [time.getHours(), time.getMinutes(), time.getSeconds()]
      .map((unit) => `${padLeft(`${unit}`, 2)}`)
      .join(":");
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.altKey && e.code.includes("Digit")) {
      const key = Number(e.code.at(-1)) - 1;
      if (key != null && key >= 0 && key <= 8 && links[key]) {
        window.location.href = links[key][1];
      }
    }
  };

  const initializeNotes = () => {
    chromeSync.get(["notes"], ({ notes: n }) => {
      notes = n ?? "";
    });
  };

  const initializeMemory = async () => {
    const bytesInUse = await chromeSync.getBytesInUse("notes");

    notesMemoryUsed = Math.floor((bytesInUse / QUOTA_BYTES_PER_ITEM) * 100);

    chromeOnChanged.addListener(async ({ changes }) => {
      for (const key in changes) {
        if (key === "notes") {
          chromeSync.getBytesInUse("notes");
          const bytesInUse = await chromeSync.getBytesInUse("notes");
          notesMemoryUsed = Math.floor(
            (bytesInUse / QUOTA_BYTES_PER_ITEM) * 100
          );
        }
      }
    });
  };

  const getStatus = (percent: number): string => {
    return percent > 90 ? "success" : percent > 70 ? "warn" : "danger";
  };

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
  <!-- LINKS -->
  <div class="link-wrapper">
    {#each links as [title, href], i}
      <a {href}>
        <div class="link">
          {`${i + 1}) ${title}`}
        </div>
      </a>
    {/each}
  </div>

  <!-- NOTES -->
  <div
    class="notes"
    bind:innerHTML={notes}
    on:keyup={debounce(() => chromeSync.set({ notes }), 300)}
    contenteditable
  />

  <!-- MEMORY -->
  <div class="memory-wrapper">
    <div class="meter">
      <span
        style={`width: ${notesMemoryUsed}%;`}
        class={`meter-progress ${getStatus(notesMemoryUsed)}`}
      />
      {() => /* 
      FIXME: memory not showing 
      TODO: only show when low
      TODO: save to disk option when low
      */ {}}
      <p class="meter-text">({notesMemoryUsed}%)</p>
    </div>
  </div>

  <!-- DATE TIME -->
  <div class="date-time-wrapper">
    <div>
      {now.toLocaleDateString()}
    </div>
    <div>
      {getFormattedTime(now)}
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
  .link {
    color: var(--white);
    padding-bottom: 1em;
    text-decoration: underline;
    font-size: 1.25em;
  }

  .link-wrapper {
    border: 1px solid var(--white);
    border-radius: 5px;
    padding: 1em;
    width: fit-content;
  }

  /* Notes */
  .notes[contenteditable] {
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
  .memory-wrapper .meter-text {
    color: var(--light);
  }

  .meter {
    height: 1em;
    width: 25%;
    background: #555;
    border-radius: 25px;
    overflow: hidden;
  }

  .memory-wrapper .meter > .meter-progress {
    position: relative;
    overflow: hidden;
    display: block;
    height: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .success {
    color: #d9534f;
  }

  .warn {
    color: #f0ad4e;
  }

  .danger {
    color: #5cb85c;
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
