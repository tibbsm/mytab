<script lang="ts">
  import type { Todo } from "./Todo.svelte";
  export let todo: Todo;
</script>

<div class="m-todo-card" draggable="true">
  <!-- <p>{todo.id}</p> -->
  <p class="m-todo-card-text" contenteditable>{todo.text}</p>
  <!-- <p>{todo.completed}</p> -->
  <!-- <p>{todo.created_at}</p> -->
  <!-- <p>{todo.complete_at}</p> -->
</div>

<style>
  .m-todo-card {
    background: white;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.4s;
  }

  .m-todo-card:hover {
    transform: scale(0.9, 0.9);
  }

  .m-todo-card-text {
    text-align: center;
    border-radius: 0px 0px 40px 40px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 30px;
    height: 40px;
  }
</style>
