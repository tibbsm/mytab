<!-- use this stuff https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_variables_props -->
<script>
    let newItem = '';
	
    let todoList = [];
	let doneList = [];
	
    initializeTodos();

	function addToList() {
		todoList = [...todoList, {text: newItem, status: false}];
		newItem = '';
        saveLists({"todos": todoList})
	}
	
	function removeFromList(index) {
		todoList.splice(index, 1);
		todoList = todoList;
		saveLists({"todos": todoList})
    }

	function removeFromDone(index) {
		doneList.splice(index, 1);
		doneList = doneList;
		saveLists({"done": doneList})
    }

	function updateList(index) {
		todoList[index].status = !todoList[index].status;
		if (todoList[index].status) {
			doneList.push(...todoList.splice(index, 1))
			todoList = todoList;
			doneList = doneList;
		}
		saveLists({ "todos": todoList, "done": doneList });
	}

	function undoDone(index) {
		doneList[index].status = !doneList[index].status;
		if (!doneList[index].status) {
			todoList.push(...doneList.splice(index, 1))
			// doneList = doneList;
			// todoList = todoList;
		}
        saveLists({ "todos": todoList, "done": doneList });
	}

    function saveLists(lists) {
        chrome.storage.sync.set(
            Object.fromEntries(Object.entries(lists).map(([k, v]) => [k, JSON.stringify(v)])),
            () => console.log(`Saved: `, lists)
        );
    }

    function initializeTodos() {
        chrome.storage.sync.get(["todos","done"], function(items){
            if (items['todos'] && Array.isArray(JSON.parse(items['todos'])))
                todoList = JSON.parse(items['todos']);
            if (items['done'] && Array.isArray(JSON.parse(items['done'])))
                doneList = JSON.parse(items['done']);
        });
    }

    // chrome.storage.sync.getBytesInUse(null, (bytesInUse) => console.log(bytesInUse)); // get bytes
    // chrome.storage.sync.get(null, (items) => console.log(items)); // get all
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