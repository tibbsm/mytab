<script lang="ts">
  import { onMount } from "svelte";

  // fmt(time)
  let time = new Date();
  $: seconds = time.getSeconds();
  $: minutes = time.getMinutes();
  $: hours = time.getHours();
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
  {("00" + hours).slice(-2)}:{("00" + minutes).slice(-2)}:{(
    "00" + seconds
  ).slice(-2)}
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
