<script lang="ts">
  import links from "./links";
  import { debounce } from "lodash-es";
  import { onMount } from "svelte";

  $: notesMemoryUsed = 0;
  $: time = new Date();
  $: date = time.toLocaleDateString();

  const {
    storage: { sync, onChanged },
  } = chrome;
  const { QUOTA_BYTES_PER_ITEM } = sync;

  let notes: string;

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    // NOTE: called when the component is unmounted
    return () => clearInterval(interval);
  });

  const padLeft = (str: string, padding: number) => {
    return ("0".repeat(padding) + str).slice(-1 * padding);
  };

  const getFormattedTime = (time: Date) => {
    return `${padLeft(`${time.getHours()}`, 2)}:${padLeft(
      `${time.getMinutes()}`,
      2
    )}:${padLeft(`${time.getSeconds()}`, 2)}`;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.altKey) {
      const code = e.code.includes("Digit")
        ? e.code.replace("Digit", "")
        : false;
      const key = isNaN(Number(code)) ? null : Number(code) - 1;
      if (key != null && key >= 0 && key <= 8 && links[key]) {
        window.location.href = links[key][1];
      }
    }
  };

  const saveNotes = () => {
    sync.set({ notes });
  };

  const initializeNotes = () => {
    sync.get(["notes"], ({ notes: n }) => {
      notes = n ?? "";
    });
  };

  const initializeMemory = async () => {
    const bytesInUse = await sync.getBytesInUse("notes");

    notesMemoryUsed = Math.floor((bytesInUse / QUOTA_BYTES_PER_ITEM) * 100);

    onChanged.addListener(async ({ changes }) => {
      for (const key in changes) {
        if (key === "notes") {
          sync.getBytesInUse("notes");
          const bytesInUse = await sync.getBytesInUse("notes");
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
  <div class="link-wrapper">
    {#each links as [title, href], i}
      <a {href}>
        <div class="link">
          {i + 1}) {title}
        </div>
      </a>
    {/each}
  </div>
  <div
    bind:innerHTML={notes}
    on:keyup={debounce(() => saveNotes(), 300)}
    contenteditable
  />
  <div class="memory-wrapper">
    <div class="meter">
      <span
        style={`width: ${notesMemoryUsed}%;`}
        class={getStatus(notesMemoryUsed)}
      />
      <!-- FIXME not showing -->
      <p>({notesMemoryUsed}%)</p>
    </div>
  </div>
  <div class="date-time-wrapper">
    <div>
      {date}
    </div>
    <div>
      {getFormattedTime(time)}
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
