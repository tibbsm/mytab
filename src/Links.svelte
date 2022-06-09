<script lang="ts">
  const links: string[][] = [
    ["Wordle", "https://www.nytimes.com/games/wordle/index.html"],
    ["Hacker News", "https://news.ycombinator.com/"],
    ["Teddit NBA", "https://teddit.net/r/nba/"],
  ];
</script>

<div class="link-wrapper">
  <h3 class="link-header">Links</h3>
  <div>
    {#each links as link}
      <div>
        <a class="link" href={link[1]}>{link[0]}</a>
      </div>
    {/each}
  </div>
</div>

<style>
  .link-header {
    color: var(--white);
  }
  .link {
    color: var(--white);
  }
</style>
