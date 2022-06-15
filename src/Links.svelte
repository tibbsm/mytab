<script lang="ts">
  import links from "./links";
</script>

<div class="link-wrapper">
  <div>
    {#each links as link}
      <a class="link" href={link[1]}>
        <div>
          {link[0]}
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .link-wrapper {
    border: 1px solid var(--white);
    border-radius: 5px;
    padding: 1em;
    margin: 1em;
    width: fit-content;
  }
  .link {
    color: var(--white);
  }
</style>
