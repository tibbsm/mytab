<script>
    let newItem = '';
	
    let todoList = [];
	
	function addToList() {
		todoList = [...todoList, {text: newItem, status: false}];
		newItem = '';
	}
	
	function removeFromList(index) {
		todoList.splice(index, 1)
		todoList = todoList;
    }

	chrome.storage.sync.set({ "yourBody": "myBody" }, function(){
		console.log('stored...')
	});

	chrome.storage.sync.get(["yourBody"], function(items){
		console.log('got', items);
	});

	chrome.storage.sync.clear(function(){
		console.log('cleared');
	});
	
	chrome.storage.sync.get(["yourBody"], function(items){
		console.log('got?', items);
	});
</script>

<input bind:value={newItem} type="text" placeholder="new todo item..">
<button on:click={addToList}>Add</button>

<br/>
{#each todoList as item, index}
	<input bind:checked={item.status} type="checkbox">
	<span class:checked={item.status}>{item.text}</span>
	<span on:click={() => removeFromList(index)}>❌</span>
	<br/>
{/each} 


<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 