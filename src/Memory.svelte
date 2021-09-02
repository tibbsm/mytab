<script>
  $: memoryUsed = "";
  $: notesMemoryUsed = "";
  $: todosMemoryUsed = "";

  let hideMemory = true;

  initializeMemory();

  function initializeMemory() {
    chrome.storage.sync.getBytesInUse(
      null,
      (bytesInUse) => (memoryUsed = Math.floor((bytesInUse / 102400) * 100))
    ); // get bytes
    chrome.storage.sync.getBytesInUse(
      "notes",
      (bytesInUse) => (notesMemoryUsed = Math.floor((bytesInUse / 8192) * 100))
    ); // get bytes
    chrome.storage.sync.getBytesInUse(
      "todos",
      (bytesInUse) => (todosMemoryUsed = Math.floor((bytesInUse / 8192) * 100))
    ); // get bytes

    // chrome.storage.sync.get(null, (items) => console.log(items)); // get all

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (const key in changes) {
        if (key == "notes") {
          chrome.storage.sync.getBytesInUse(
            "notes",
            (bytesInUse) =>
              (notesMemoryUsed = Math.floor((bytesInUse / 8192) * 100))
          );
        } else if (key == "todos") {
          chrome.storage.sync.getBytesInUse(
            "todos",
            (bytesInUse) =>
              (todosMemoryUsed = Math.floor((bytesInUse / 8192) * 100))
          );
        }
      }
      chrome.storage.sync.getBytesInUse(
        null,
        (bytesInUse) => (memoryUsed = Math.floor((bytesInUse / 102400) * 100))
      ); // get bytes
    });
  }

  const getColor = (percent) =>
    percent > 90 ? "red" : percent > 70 ? "yellow" : "green";
</script>

<button on:click={() => (hideMemory = !hideMemory)}>
  {hideMemory ? "Show Memory" : "Hide Memory"}
</button>

<div class="memory-wrapper {hideMemory && 'hide'}">
  <p>Total: ({memoryUsed}%)</p>
  <div class="meter">
    <span
      style={`width: ${memoryUsed}%; background-color: ${getColor(memoryUsed)}`}
    />
  </div>

  <p>Notes: ({notesMemoryUsed}%)</p>
  <div class="meter">
    <span
      style={`width: ${notesMemoryUsed}%; background-color: ${getColor(
        notesMemoryUsed
      )}`}
    />
  </div>

  <p>Todos: ({todosMemoryUsed}%)</p>
  <div class="meter">
    <span
      style={`width: ${todosMemoryUsed}%; background-color: ${getColor(
        todosMemoryUsed
      )}`}
    />
  </div>
</div>

<style>
  p {
    color: var(--light);
  }
  .hide {
    display: none;
  }

  .memory-wrapper {
    margin-top: 1em;
  }
  .meter {
    height: 1em;
    width: 25%;
    background: #555;
    border-radius: 25px;
    overflow: hidden;
  }
  .meter > span {
    position: relative;
    overflow: hidden;
    display: block;
    height: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
</style>
