<script lang="ts">
  import type { Todo } from "./Todo.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let todo: Todo;

  function changeStatus() {
    dispatch("changeStatus");
  }
</script>

<!-- TODO's -->
<!-- 
  [] Draggable
  [] TODO, DOING, DONE
 -->

<div class="m-todo-card" draggable="true">
  <input
    type="checkbox"
    bind:checked={todo.completed}
    on:change={changeStatus}
  />
  <p class="m-todo-card-text">{todo.text}</p>

  {#if !todo.completed}
    <div>
      <button class="m-todo-card-button">✏️</button>
    </div>
  {/if}
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
  .m-todo-card-button {
    border: none;
    background: none;
    transform: scaleX(-1);
    transition: 0.4s;
  }

  .m-todo-card-button:hover {
    cursor: pointer;
    transform: scale(-1.5, 1.5);
  }

  .m-todo-card-button:active {
    transform: scale(-1, 1) translateY(0.25em);
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
