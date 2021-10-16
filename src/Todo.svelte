<script lang="ts" context="module">
  export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    created_at: number;
    complete_at: number | null;
    status: "todo" | "doing" | "done" | null;
  }
</script>

<script lang="ts">
  import dummyTodos from "./dummydata";
  import TodoCard from "./TodoCard.svelte";
  import Tracker from "./Tracker.svelte";

  let newItem = "";
  let todos = [];
  let lastTodos = [];
  let showMore = false;
  let showDone = false;

  $: todoList = todos.filter(({ status }) => status === "todo");
  $: doingList = todos.filter(({ status }) => status === "doing");
  $: doneCount = todos.filter(({ status }) => status === "done").length;
  $: doneList = showMore
    ? todos.filter(({ status }) => status === "done")
    : todos.filter(({ status }) => status === "done").slice(-3);

  todos = dummyTodos;

  initializeTodos();

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
        status: "todo",
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
    const [action, lastTodo] = lastTodos.pop();

    if (action == "status") {
      const index = todos.findIndex((todo) => todo.id == lastTodo.id);
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

  const handleDrop = (event, group) => {
    const currId = event.dataTransfer.getData("item");
    if (currId) {
      if (group === "delete") {
        removeFromList(Number(currId));
      } else {
        todos.find(({ id }) => id === Number(currId)).status = group;
      }
    }
    todos = todos;
    saveTodos();
  };

  function dragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<Tracker {todos} />

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
    <div
      class="card-wrapper"
      on:drop={(event) => handleDrop(event, "todo")}
      on:dragover={dragover}
    >
      {#each todoList as todo}
        <TodoCard bind:todo />
      {/each}
    </div>
  </div>

  <div class="doing">
    <h2>Doing ({doingList.length})</h2>
    <div
      class="card-wrapper"
      on:drop={(event) => handleDrop(event, "doing")}
      on:dragover={dragover}
    >
      {#each doingList as todo}
        <TodoCard bind:todo />
      {/each}
    </div>
  </div>

  {#if showDone}
    <div class="dones">
      <h2>
        Done! ({doneCount})
        <button on:click={() => (showMore = !showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </button>
        <button on:click={() => (showDone = !showDone)}>Hide Done</button>
      </h2>
      <div
        class="card-wrapper"
        on:drop={(event) => handleDrop(event, "done")}
        on:dragover={dragover}
      >
        {#each doneList as todo}
          <TodoCard bind:todo />
        {/each}
      </div>
    </div>
  {:else}
    <button on:click={() => (showDone = !showDone)}>Show done</button>
  {/if}
</div>
<br />
<div
  class="delete"
  on:drop={(event) => handleDrop(event, "delete")}
  on:dragover={dragover}
  style="width: 3em; height: 3em; background-color: beige"
>
  DELETE
</div>

<!-- TODO Hide in settings/modal/etc. -->
<!-- <button on:click={() => clearDone()} disabled>Clear Done</button> -->
<!-- <button on:click={() => clear()}>Clear All</button> -->

<br /><br />

<style>
  .flex {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .todos,
  .doing,
  .dones {
    margin: 0 2.5em;
    width: 20vw;
  }

  .card-wrapper {
    border: 1px solid grey;
    border-radius: 5px;
    padding: 0.25em;
    min-height: 3em;
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
