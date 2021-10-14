<script lang="ts">
  import { onMount } from "svelte";

  // fmt(time)
  let time = new Date();
  $: seconds = ("00" + time.getSeconds()).slice(-2);
  $: minutes = ("00" + time.getMinutes()).slice(-2);
  $: hours = ("00" + time.getHours()).slice(-2);
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
