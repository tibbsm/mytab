<script>
  import { debounce } from "lodash-es";

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

  initializeTodos();

  // FIXME
  function calculateTrackerInfo(todos) {
    let daysInYear = isLeapYear ? new Array(366) : new Array(365);
    todos.map((todo) => {
      daysInYear[daysIntoYear(todo.complete_at) - 1] = (
        new Date(todo.complete_at) instanceof Date &&
        daysIntoYear(todo.complete_at)
      ).toString();
    });
    return daysInYear;
  }

  // FIXME
  function daysIntoYear(completedAt) {
    if (completedAt) {
      let date = new Date(completedAt);
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

  function removeFromList(id) {
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
    chrome.storage.sync.set({ todos: JSON.stringify(todos) });
  }

  function initializeTodos() {
    chrome.storage.sync.get(["todos"], function (items) {
      if (items["todos"] && Array.isArray(JSON.parse(items["todos"]))) {
        todos = JSON.parse(items["todos"]);
      } else {
        todos = [];
      }
    });
    console.log(todos);
  }

  function changeStatus(todo) {
    lastTodos.push(["status", todo]);
    todo.completed = !todo.completed;
    todo.complete_at = todo.completed ? new Date().getTime() : null;
    saveTodos();
  }

  function clear() {
    chrome.storage.sync.clear(() => {
      console.log("cleared");
      initializeTodos();
    });
  }

  function clearDone() {
    let done = todos.filter((todo) => todo.completed);
    todos = todos.filter((todo) => !todo.completed);
    lastTodos.push(["delete", done]);
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      const currentId = document.activeElement.id;
      if (currentId == "new-todo-input" && newItem != "") {
        addToList();
      } else if (currentId.startsWith("todo-delete-")) {
        document.activeElement.click();
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
    <div class="square" data={i} data-day={day} />
  {/each}
</div>

<input
  id="new-todo-input"
  bind:value={newItem}
  type="text"
  placeholder="new todo item.."
/>
<button on:click={addToList}>Add</button>

<div class="flex">
  <div class="todos">
    <h2>To Do ({todoList.length})</h2>
    {#each todoList as item}
      <div class="todoItem">
        <input
          on:change={() => changeStatus(item)}
          bind:checked={item.completed}
          type="checkbox"
        />
        <textarea
          class:checked={item.completed}
          bind:value={item.text}
          on:keyup={debounce(() => saveTodos(), 250)}
        />
        <span
          id="todo-delete-{item.id}"
          on:click={() => removeFromList(item.id)}
          tabindex="0">❌</span
        >
      </div>
    {/each}
  </div>

  <div class="dones">
    <h2>
      Done! ({doneCount})
      <button on:click={() => (showMore = !showMore)}>
        {showMore ? "Show Less" : "Show More"}
      </button>
    </h2>

    {#each doneList as item}
      <div class="doneItem">
        <input
          on:change={() => changeStatus(item)}
          bind:checked={item.completed}
          type="checkbox"
        />
        <span class:checked={item.completed}>{item.text}</span>
        <span
          id="todo-delete-{item.id}"
          on:click={() => removeFromList(item.id)}
          tabindex="0">❌</span
        >
        <br />
      </div>
    {/each}
  </div>
</div>

<br /><br />

<button on:click={() => clearDone()} disabled>Clear Done</button>

<br /><br />

<style>
  .checked {
    text-decoration: line-through;
  }
  span {
    color: var(--medium);
  }

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
</style>
