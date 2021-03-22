<script>
    chrome.storage.sync.get(null, (items) => console.log(items)); // get all
    let newItem = '';
	
    let todos = [];
    $: todoList = todos.filter(todo => !todo.completed);
    $: doneList = todos.filter(todo => todo.completed);
	
    initializeTodos();

	function addToList() {
		todos = [...todos, {
                id: Date.now().toString(),
                text: newItem, 
                completed: false,
                created_at: new Date().toDateString(),
                complete_at: null
        }];
		newItem = '';
        saveTodos()
	}
	
	function removeFromList(id) {
		todos = todos.filter(todo => todo.id !== id);
		saveTodos();
    }

    function saveTodos() {
        chrome.storage.sync.set({"todos": JSON.stringify(todos)});
    }

    function initializeTodos() {
        chrome.storage.sync.get(["todos"], function(items){
            if (items['todos'] && Array.isArray(JSON.parse(items['todos']))) {
                todos = JSON.parse(items['todos']);
            } else {
                todos = [];
            }
        });
    }

    function changeStatus(todo) {
        todo.completed = !todo.completed;
        if (!todo.completed) todo.complete_at = null;
        else todo.complete_at = new Date().toDateString();
        saveTodos();
    }

    // chrome.storage.sync.getBytesInUse(null, (bytesInUse) => console.log(bytesInUse)); // get bytes
    // chrome.storage.sync.get(null, (items) => console.log(items)); // get all

    function clear() {
        chrome.storage.sync.clear(() => {
            console.log('cleared');
            initializeTodos();
        });
    }
</script>

<input bind:value={newItem} type="text" placeholder="new todo item..">
<button on:click={addToList}>Add</button>

<h1>To Do ({todoList.length})</h1>
{#each todoList as item}
	<input 
		on:change={() => changeStatus(item)}
		bind:checked={item.completed} 
		type="checkbox"
	>
	<span class:checked={item.completed}>{item.text}</span>
	<span on:click={() => removeFromList(item.id)}>❌</span>
	<br/>
{/each} 

<h1>Done! ({doneList.length})</h1>
{#each doneList as item}
	<input 
        on:change={() => changeStatus(item)}
		bind:checked={item.completed} 
		type="checkbox"
	>
	<span class:checked={item.completed}>{item.text}</span>
	<span on:click={() => removeFromList(item.id)}>❌</span>
	<br/>
{/each} 

<button on:click={() => clear()}>clear</button>

<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 