<script>
	import Notes from './Notes.svelte';
	import Todo from './Todo.svelte';
</script>

<Todo />
<Notes />

<style> 
	:global(:root) {
		--black: #000000;
		--dark: #52057b;
		--medium: #892cdc;
		--light: #bc6ff1;
		--white: #FFFFFF;
	}
	:global(body) {
		background-color: var(--black);
	}
	:global(h1) {
		color: var(--light);
	}
</style> 