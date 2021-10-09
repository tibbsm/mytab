<script lang="ts">
  import type { Todo } from "./Todo.svelte";
  export let todos;
  $: trackerInfo = calculateTrackerInfo(todos);

  let thisYear = new Date().getFullYear();
  let isLeapYear =
    (thisYear % 4 == 0 && thisYear % 100 != 0) || thisYear % 400 == 0;

  // FIXME
  function calculateTrackerInfo(todos: Todo[]) {
    let daysInYear = isLeapYear ? new Array(366) : new Array(365);
    todos.map(({ complete_at }) => {
      daysInYear[Number(daysIntoYear(complete_at)) - 1] = (
        (complete_at && daysIntoYear(complete_at)) ??
        "false"
      ).toString();
    });
    return daysInYear;
  }

  // FIXME
  function daysIntoYear(complete_at: number) {
    if (complete_at) {
      let date = new Date(complete_at);
      let today = new Date(new Date().setHours(0, 0, 0, 0));
      return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
          24 /
          60 /
          60 /
          1000 +
        1
      );
    } else {
      return false;
    }
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
