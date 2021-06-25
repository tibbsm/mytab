<script>
    import { debounce } from 'lodash-es';
    
    let newItem = '';
    let todos = [];
    let lastId = [];
    let showMore = false;
    let keyHistory = [];

    $: todoList = todos.filter(todo => !todo.completed);
    $: doneList = showMore ? 
        todos.filter(todo => todo.completed) :
        todos.filter(todo => todo.completed).slice(-3);
	
    initializeTodos();

	function addToList() {
		todos = [...todos, {
                id: new Date().getTime(),
                text: newItem, 
                completed: false,
                created_at: new Date().getTime(),
                complete_at: null
        }];
		newItem = '';
        saveTodos()
	}
	
	function removeFromList(id) {
        if (confirm('Are you sure?')) {
            lastId.push(['delete',todo]);
            todos = todos.filter(todo => todo.id !== id);
		    saveTodos();
        } 
    }

    function undo() {
        let [action, lastTodo] = todos.pop();
        if (action == 'status') {
            lastTodo.completed = !lastTodo.completed;
        } else if (action == 'delete') {
            todos.push(lastTodo);
        }
        
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
        lastId.push(['status',todo]);
        todo.completed = !todo.completed;
        todo.complete_at = todo.completed ? new Date().getTime() : null;
        saveTodos();
    }

    function clear() {
        chrome.storage.sync.clear(() => {
            console.log('cleared');
            initializeTodos();
        });
    }

    const onKeyPress = e => {
        if (keyHistory.length > 1) {
            keyHistory.shift();
        } 
        keyHistory.push(e.charCode);
        if (e.charCode === 13) {
            const currentId = document.activeElement.id;
            if (currentId == 'new-todo-input' && newItem != '') {
                addToList();
            } else if (currentId.startsWith('todo-delete-')) {
                document.activeElement.click();
            }
        } 
        // fixme command key not triggering keypress
        if (keyHistory.sort() == [90,91].sort()) {
            undo();
        }
    };
</script>

<svelte:window on:keypress={onKeyPress}/>

<input 
    id="new-todo-input"
    bind:value={newItem} 
    on:keypress={onKeyPress}
    type="text" 
    placeholder="new todo item.."
>
<button on:click={addToList}>Add</button>

<h1>To Do ({todoList.length})</h1>
{#each todoList as item}
	<input 
		on:change={() => changeStatus(item)}
		bind:checked={item.completed} 
		type="checkbox"
	>
	<textarea 
        class:checked={item.completed} 
        bind:value={item.text} 
        on:keyup={debounce(() => saveTodos(), 250)}
    ></textarea>
	<span 
        id='todo-delete-{item.id}'
        on:click={() => removeFromList(item.id)} 
        on:keypress={onKeyPress}
        tabindex=0
    >❌</span>
	<br/>
{/each} 

<h1>Done! ({doneList.length})
    <button on:click={() => showMore = !showMore}>
    { showMore ? 'Show Less' : 'Show More' }
    </button>
</h1>

{#each doneList as item}
	<input 
        on:change={() => changeStatus(item)}
		bind:checked={item.completed} 
		type="checkbox"
	>
	<span class:checked={item.completed}>{item.text}</span>
	<span 
        id='todo-delete-{item.id}'
        on:click={() => removeFromList(item.id)} 
        on:keypress={onKeyPress}
        tabindex=0
    >❌</span>
	<br/>
{/each} 

<br/><br/>

<button on:click={() => clear()} disabled>Clear</button>

<br/><br/>


<style> 
	.checked {
        text-decoration: line-through;
    }
    span {
		color: var(--medium);
	}
</style> 