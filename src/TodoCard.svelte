<script lang="ts">
  import type { Todo } from "./Todo.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let todo: Todo;

  function dragstart(event) {
    event.dataTransfer.setData("item", todo.id);
  }

  function dragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
</script>

<div
  class="m-todo-card"
  draggable={true}
  on:dragstart={dragstart}
  on:dragover={dragover}
  on:click={() => dispatch("active-todo", todo)}
>
  <p class="m-todo-card-text">{todo.text}</p>
</div>

<style>
  .m-todo-card {
    background: white;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.4s;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .m-todo-card:hover {
    transform: scale(0.9, 0.9);
  }

  .m-todo-card-text {
    text-align: center;
    border-radius: 0px 0px 40px 40px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 0.75em;
    /* height: 40px; */
  }
</style>
