<script lang="ts" context="module">
  export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    created_at: number;
    complete_at: number | null;
  }
</script>

<script lang="ts">
  import dummyTodos from "./dummydata";
  import TodoCard from "./TodoCard.svelte";

  let newItem = "";
  let todos = [];
  let lastTodos = [];
  let showMore = false;
  // FIXME: Leap calculation ain't this simple...
  let isLeapYear = new Date().getFullYear() % 4 == 0;

  $: todoList = todos.filter((todo) => !todo.completed);
  $: doneCount = todos.filter((todo) => todo.completed).length;
  $: doneList = showMore
    ? todos.filter((todo) => todo.completed)
    : todos.filter((todo) => todo.completed).slice(-3);
  $: trackerInfo = calculateTrackerInfo(todos);

  todos = dummyTodos;

  initializeTodos();

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
      return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(date.getFullYear(), 0, 0)) /
        24 /
        60 /
        60 /
        1000
      );
    } else {
      return false;
    }
  }

  function addToList() {
    if (todoList.length >= 8) {
      alert("Too many undone todos");
      return;
    }
    todos = [
      ...todos,
      {
        id: new Date().getTime(),
        text: newItem,
        completed: false,
        created_at: new Date().getTime(),
        complete_at: null,
      },
    ];
    newItem = "";
    saveTodos();
  }

  function removeFromList(id: number) {
    lastTodos.push(["delete", todos.filter((todo) => todo.id == id)]);
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
  }

  function undo() {
    if (lastTodos.length < 1) return;
    let [action, lastTodo] = lastTodos.pop();

    if (action == "status") {
      let index = todos.findIndex((todo) => todo.id == lastTodo.id);
      todos[index].completed = !todos[index].completed;
      todos[index].complete_at = todos[index].completed
        ? new Date().getTime()
        : null;
      todos = [...todos];
    } else if (action == "delete") {
      todos = [...todos, ...lastTodo];
    }
    saveTodos();
  }

  function saveTodos() {
    chrome.storage?.sync.set({ todos: JSON.stringify(todos) });
  }

  function initializeTodos() {
    chrome.storage?.sync.get(["todos"], function (items) {
      if (items["todos"] && Array.isArray(JSON.parse(items["todos"]))) {
        todos = JSON.parse(items["todos"]);
      } else {
        todos = [];
      }
    });
    console.log(todos);
  }

  function changeStatus(todo: Todo) {
    lastTodos.push(["status", todo]);
    todo.completed = !todo.completed;
    todo.complete_at = todo.completed ? new Date().getTime() : null;
    saveTodos();
  }

  // function clear() {
  //   chrome.storage?.sync.clear(() => {
  //     console.log("cleared");
  //     initializeTodos();
  //   });
  // }

  // function clearDone() {
  //   let done = todos.filter((todo) => todo.completed);
  //   todos = todos.filter((todo) => !todo.completed);
  //   lastTodos.push(["delete", done]);
  // }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const {
        activeElement,
        activeElement: { id },
      } = document as Document;

      if (id == "new-todo-input" && newItem != "") {
        addToList();
      } else if (id.startsWith("todo-delete-")) {
        (activeElement as HTMLSpanElement).click();
      }
    }

    if (e.metaKey && e.key == "z") {
      undo();
    }
  };
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="tracker-grid">
  {#each trackerInfo as day, i}
    <div class="square" data={i.toString()} data-day={day} />
  {/each}
</div>

<input
  id="new-todo-input"
  class="todo-input"
  bind:value={newItem}
  type="text"
  placeholder="Todo..."
/>
<button on:click={addToList}>Add</button>

<div class="flex">
  <div class="todos">
    <h2>To Do ({todoList.length})</h2>

    {#each todoList as todo}
      <TodoCard bind:todo on:changeStatus={() => changeStatus(todo)} />
    {/each}
  </div>

  <div class="dones">
    <h2>
      Done! ({doneCount})
      <button on:click={() => (showMore = !showMore)}>
        {showMore ? "Show Less" : "Show More"}
      </button>
    </h2>

    {#each doneList as todo}
      <TodoCard bind:todo on:changeStatus={() => changeStatus(todo)} />
    {/each}
  </div>
</div>

<!-- TODO Hide in settings/modal/etc. -->
<!-- <button on:click={() => clearDone()} disabled>Clear Done</button> -->

<br /><br />

<style>
  .flex {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .todos,
  .dones {
    margin: 0 2.5em;
  }

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

  .todo-input {
    margin-left: 1.5em;
    color: #fff;
    border: none;
    border-bottom: 1px solid var(--light);
    background-color: var(--black);
    outline: none;
  }
</style>
