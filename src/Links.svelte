<script lang="ts">
  import links from "./links";

  // XXX fix key logic
  const onKeyDown = (e: KeyboardEvent) => {
    const key = isNaN(Number(e.key)) ? null : Number(e.key);
    if (key >= 0 && key <= 9 && links[key - 1]) {
      window.location.href = links[key - 1][1];
    }
  };
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="link-wrapper">
  {#each links as link, i}
    <a href={link[1]}>
      <div class="link">
        {i + 1}) {link[0]}
      </div>
    </a>
  {/each}
</div>

<style>
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
</style>
