<script>
  import Notes from "./Notes.svelte";
  import Todo from "./Todo.svelte";
  import Time from "./Time.svelte";
  import Memory from "./Memory.svelte";
</script>

<svelte:head>
  <title>My Tab</title>
  <html lang="en" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Todo />
<Notes />
<Memory />
<Time />

<style>
  :global(:root) {
    --black: #000000;
    --dark: #52057b;
    --medium: #892cdc;
    --light: #bc6ff1;
    --white: #ffffff;
  }
  :global(*) {
    font-family: "Roboto", sans-serif;
  }
  :global(body) {
    background-color: var(--black);
  }
  :global(h1, h2) {
    color: var(--light);
  }

  :global(input, textarea, [contenteditable]) {
    background-color: #1b1e23;
    color: var(--light);
  }
</style>
