<script lang="ts">
  import type { Todo } from "./Todo.svelte";
  export let todos: Todo[];
  $: trackerInfo = calculateTrackerInfo(todos);

  const thisYear = new Date().getFullYear();
  const isLeapYear =
    (thisYear % 4 == 0 && thisYear % 100 != 0) || thisYear % 400 == 0;

  function calculateTrackerInfo(todos: Todo[]) {
    const daysInYear = isLeapYear ? new Array(366) : new Array(365);
    todos.map(({ complete_at }) => {
      if (complete_at) {
        daysInYear[Number(daysIntoYear(complete_at))] = (
          (complete_at && daysIntoYear(complete_at)) ??
          "false"
        ).toString();
      }
    });
    return daysInYear;
  }

  function toUtc(date: Date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // FIXME return boolean && number?
  function daysIntoYear(complete_at: number) {
    const date = new Date(complete_at);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    return (toUtc(today) - toUtc(date)) / 24 / 60 / 60 / 1000;
  }
</script>

<div class="tracker-grid">
  {#each trackerInfo.reverse() as day, i}
    <div class="square" data={i.toString()} data-day={day} />
  {/each}
</div>

<style>
  .tracker-grid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 60rem;
    height: 10rem;
    padding: 2rem 1rem;
  }

  .square {
    width: 1rem;
    height: 1rem;
    margin: 0.1rem;
    border-radius: 2px;
    background-color: midnightblue;
  }

  .square[data-day] {
    background-color: green;
  }
  .square:hover {
    opacity: 0.8;
  }

  .square:before {
    content: attr(data-day);
    display: none;
  }
</style>
