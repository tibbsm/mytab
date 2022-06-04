<script lang="ts">
  const links: string[][] = [
    ["Wordle", "https://www.nytimes.com/games/wordle/index.html"],
    ["Hacker News", "https://news.ycombinator.com/"],
    ["Teddit NBA", "https://teddit.net/r/nba/"],
  ];
</script>

<div class="link-wrapper">
  <h3 class="link-header">Links</h3>
  <ul>
    {#each links as link}
      <li>
        <a class="link" href={link[1]}>{link[0]}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .link-header {
    color: var(--white);
  }
  .link {
    color: var(--white);
  }
</style>
