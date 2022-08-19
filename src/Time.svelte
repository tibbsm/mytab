<script lang="ts">
  import { onMount } from "svelte";

  const padLeft = (t: string, n: number) => ("0".repeat(n) + t).slice(-1 * n);

  $: time = new Date();
  $: date = time.toLocaleDateString();

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    // NOTE: called when the component is destroy
    return () => clearInterval(interval);
  });
</script>

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

<style>
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
