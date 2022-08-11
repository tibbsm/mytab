<script lang="ts">
  $: memoryUsed = 0;

  let hideMemory = true;

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

  initializeMemory();
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
</div>

<style>
  p {
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
