<!-- 
	TODOs
	[] Done list
		[] Done list per day or something

20210101: [{},{},...],
20210102: [{},{},...]

	[] Add storage listener
		* chrome.storage.onChanged.addListener(function(changes, namespace) 
	
	* TOTAL Storage Size 
	QUOTA_BYTES number 102400
	* Storage Size QUOTA_BYTES_PER_ITEM number 8192

	[] Move todos to README or something
	[] Store completed task
	[] Reurring tasks
	[] Notes
		[] 	Storable
	[] Deal with memory limits on google
		[] Download | Backup to Drive | ...App
	[] Add way to dev on this easier?
		* At least on the functionality part anyways. The storage is a bit more straight forward.


	[] WYSIWYT Editor that saves
		[] Debounced saves & save button
	[] Create seperate file for todos, wysiwyt editor, etc..
	[] Calendar of todos past (recent)
 -->
<script>
    let newItem = '';
	
    let todoList = [];
	let doneList = [];
	
	chrome.storage.sync.get(["todos"], function(items){
		if (items['todos'] && Array.isArray(JSON.parse(items['todos'])))
			todoList = JSON.parse(items['todos']);
	});
	chrome.storage.sync.get(["done"], function(items){
		if (items['done'] && Array.isArray(JSON.parse(items['done'])))
			doneList = JSON.parse(items['done']);
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

	function removeFromDone(index) {
		doneList.splice(index, 1);
		doneList = doneList;
		chrome.storage.sync.set({ "done": JSON.stringify(doneList) });
    }

	function updateList(index) {
		todoList[index].status = !todoList[index].status;
		if (todoList[index].status) {
			doneList.push(todoList[index])
			todoList.splice(index, 1);
			todoList = todoList;
			doneList = doneList;
		}
		chrome.storage.sync.set({ "todos": JSON.stringify(todoList) });
		chrome.storage.sync.set({ "done": JSON.stringify(doneList) });
	}

	function undoDone(index) {
		doneList[index].status = !doneList[index].status;
		if (!doneList[index].status) {
			todoList.push(doneList[index])
			doneList.splice(index, 1);
			doneList = doneList;
			todoList = todoList;
		}
		chrome.storage.sync.set({ "todos": JSON.stringify(doneList) });
		chrome.storage.sync.set({ "done": JSON.stringify(todoList) });
	}

	// chrome.storage.sync.clear(function(){ console.log('cleared') });
</script>

<input bind:value={newItem} type="text" placeholder="new todo item..">
<button on:click={addToList}>Add</button>

<h1>To Do</h1>
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

<br/>
<h1>Done!</h1>
<br/>
{#each doneList as item, index}
	<span class:checked={item.status}>✅ {item.text}</span>
	<span on:click={() => removeFromDone(index)}>❌</span>
	<span on:click={() => undoDone(index)}>◀︎</span>
	<br/>
{/each} 


<style> 
	.checked {
        text-decoration: line-through;
    }
</style> 