<script lang="ts">
  import { onMount } from "svelte";

  let time = new Date();

  const padLeft = (t: string, n: number) => ("0".repeat(n) + t).slice(-1 * n);

  $: seconds = padLeft(`${time.getSeconds()}`, 2);
  $: minutes = padLeft(`${time.getMinutes()}`, 2);
  $: hours = padLeft(`${time.getHours()}`, 2);
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
    {hours}:{minutes}:{seconds}
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
