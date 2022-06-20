<script lang="ts">
  import links from "./links";
</script>

<div class="link-wrapper">
  {#each links as link}
    <a href={link[1]}>
      <div class="link">
        {link[0]}
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
