<script lang="ts">
  import { links } from './links';
  import { debounce } from 'lodash-es';
  import { onMount } from 'svelte';

  $: notesMemoryUsed = 0;
  $: now = new Date();

  // XXX: What is better here?
  // 1) destructure
  // 2) access each time using chrome.storage...
  const {
    storage: { sync: chromeSync, onChanged: chromeOnChanged },
  } = chrome;
  const { QUOTA_BYTES_PER_ITEM } = chromeSync;

  let notes = '';

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);
    // NOTE: called when the component is unmounted
    return () => clearInterval(interval);
  });

  const padLeft = (s: string, padding: number, padWith = '0') => {
    return (padWith.repeat(padding) + s).slice(-1 * padding);
  };

  const getFormattedTime = (time: Date) => {
    return [
      padLeft(`${time.getHours()}`, 2),
      padLeft(`${time.getMinutes()}`, 2),
      padLeft(`${time.getSeconds()}`, 2),
    ].join(':');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.altKey && e.code.includes('Digit')) {
      const key = Number(e.code.at(-1)) - 1;
      if (key != null && key >= 0 && key <= 8 && links[key]) {
        const { url } = links[key];
        window.location.href = url;
      }
    }
  };

  const initializeNotes = () => {
    chromeSync.get(['notes'], ({ notes: n }) => {
      notes = n ?? '';
    });
  };

  const initializeMemory = async () => {
    const bytesInUse = await chromeSync.getBytesInUse('notes');
    notesMemoryUsed = Math.floor((bytesInUse / QUOTA_BYTES_PER_ITEM) * 100);

    chromeOnChanged.addListener(async (changes) => {
      for (const key in changes) {
        if (key === 'notes') {
          const bytesInUse = await chromeSync.getBytesInUse('notes');
          notesMemoryUsed = Math.floor(
            (bytesInUse / QUOTA_BYTES_PER_ITEM) * 100
          );
        }
      }
    });
  };

  const getStatus = (percent: number): string => {
    return percent > 90 ? 'danger' : percent > 70 ? 'warn' : 'success';
  };

  const saveToFile = (text: string) => {
    const plainText = notes.replace('</div>', '\n').replace(/<[^>]*>?/gm, '');
    window.open('data:text/csv;charset=utf-8,' + plainText);
    notes = '';
  };

  initializeNotes();
  initializeMemory();
</script>

<svelte:head>
  <title>My Tab</title>
  <html lang="en"></html>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<svelte:window on:keydown="{onKeyDown}" />

<div class="page-wrapper">
  <!-- LINKS -->
  <div class="link-wrapper">
    {#each Object.entries(links) as [i, { name, url }]}
      <a href="{url}">
        <div class="link">
          {`${i + 1}) ${name}`}
        </div>
      </a>
    {/each}
  </div>

  <!-- NOTES -->
  <div
    class="notes"
    bind:innerHTML="{notes}"
    on:keyup="{debounce(() => chromeSync.set({ notes }), 300)}"
    contenteditable
  ></div>
  <button on:click="{() => saveToFile(notes)}">Save to file</button>

  <!-- MEMORY -->
  <div
    class="memory-wrapper"
    style="{notesMemoryUsed > 70 ? '' : 'display: none'}"
  >
    <div class="memory-meter">
      <span
        style="{`width: ${notesMemoryUsed}%;`}"
        class="{`meter-progress ${getStatus(notesMemoryUsed)}`}"></span>
      <p class="memory-meter-text">({notesMemoryUsed}%)</p>
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

  /* Reset CSS */
  :global(html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video) {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  :global(article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section) {
    display: block;
  }
  :global(body) {
    line-height: 1;
  }
  :global(ol, ul) {
    list-style: none;
  }
  :global(blockquote, q) {
    quotes: none;
  }
  :global(blockquote:before, blockquote:after, q:before, q:after) {
    content: '';
    content: none;
  }
  :global(table) {
    border-collapse: collapse;
    border-spacing: 0;
  }
  /* Reset CSS */

  :global(:root) {
    --black: #121212;
    --dark: #52057b;
    --medium: #892cdc;
    --light: #bc6ff1;
    --white: #ffffff;
  }

  :global(*) {
    font-family: 'Roboto', sans-serif;
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
  .memory-meter-text {
    color: var(--light);
    margin: 0;
  }

  .memory-meter {
    height: 1em;
    width: 25%;
    background: #555;
    border-radius: 25px;
  }

  .meter-progress {
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
    background-color: #5cb85c;
  }

  .warn {
    background-color: #f0ad4e;
  }

  .danger {
    background-color: #d9534f;
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
