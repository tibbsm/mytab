<script lang="ts">
  import { onMount } from "svelte";

  let time = new Date();

  const padLeft = (t: string) => ("00" + t).slice(-2);

  $: seconds = padLeft(`${time.getSeconds()}`);
  $: minutes = padLeft(`${time.getMinutes()}`);
  $: hours = padLeft(`${time.getHours()}`);
  $: date = time.toLocaleDateString();

  onMount(() => {
    const interval = setInterval(() => {
      time = new Date();
    }, 1000);
    return () => clearInterval(interval);
  });
</script>

<div class="date-time-wrapper">
  {date}<br />
  {hours}:{minutes}:{seconds}
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
