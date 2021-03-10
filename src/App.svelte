<script>
    let newItem = '';
	
    let todoList = [];
	
	chrome.storage.sync.get(["todos"], function(items){
		if (items['todos'] && Array.isArray(JSON.parse(items['todos'])))
			todoList = JSON.parse(items['todos']);
	});

	function addToList() {
		todoList = [...todoList, {text: newItem, status: false}];
		newItem = '';
		chrome.storage.sync.set({ "todos": JSON.stringify(todoList) });
	}
	
	function removeFromList(index) {
		todoList.splice(index, 1);
		todoList = todoList;
		chrome.storage.sync.set({ "todos": JSON.stringify(todoList) });
    }

	function updateList(index) {
		todoList[index].status = !todoList[index].status;
		chrome.storage.sync.set({ "todos": JSON.stringify(todoList) });
	}

	// chrome.storage.sync.clear(function(){ console.log('cleared') });
</script>

<input bind:value={newItem} type="text" placeholder="new todo item..">
<button on:click={addToList}>Add</button>

<br/>
{#each todoList as item, index}
	<input 
		on:change={() => updateList(index)}
		bind:checked={item.status} 
		type="checkbox"
	>
	<span class:checked={item.status}>{item.text}</span>
	<span on:click={() => removeFromList(index)}>❌</span>
	<br/>
{/each} 


<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 