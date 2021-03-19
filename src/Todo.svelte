<!-- use this stuff https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_variables_props -->
<script>
    let newItem = '';
	
    let todos = [];
    $: todoList = todos.filter(todo => !todo.status);
    $: doneList = todos.filter(todo => todo.status);
	
    initializeTodos();

	function addToList() {
		todos = [
            ...todos, 
            {
                id: Date.now().toString(),
                text: newItem, 
                status: false
            }
        ];
		newItem = '';
        saveLists({"todos": todos})
	}
	
	function removeFromList(id) {
		todos = todos.filter(todo => todo.id !== id);
		saveLists({"todos": todos})
    }

    function saveLists(lists) {
        chrome.storage.sync.set(
            Object.fromEntries(Object.entries(lists).map(([k, v]) => [k, JSON.stringify(v)])),
            () => console.log(`Saved: `, lists)
        );
    }

    function initializeTodos() {
        chrome.storage.sync.get(["todos"], function(items){
            console.log(items);
            if (items['todos'] && Array.isArray(JSON.parse(items['todos']))) {
                todos = JSON.parse(items['todos']);
                console.log('initialized todos to: ', todos);
            } else {
                todos = [];
            }
        });
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

<h1>To Do</h1>
{#each todoList as item}
	<input 
		on:change={() => item.status = !item.status }
		bind:checked={item.status} 
		type="checkbox"
	>
	<span class:checked={item.status}>{item.text}</span>
	<span on:click={() => removeFromList(item.id)}>❌</span>
	<br/>
{/each} 

<h1>Done!</h1>
{#each doneList as item}
	<input 
		on:change={() => item.status = !item.status }
		bind:checked={item.status} 
		type="checkbox"
	>
	<span class:checked={item.status}>{item.text}</span>
	<span on:click={() => removeFromList(item.id)}>❌</span>
	<br/>
{/each} 

<button on:click={() => clear()}>clear</button>

<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 