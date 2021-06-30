<script>    
    $: memoryUsed = '';
    $: notesMemoryUsed = '';
    $: todosMemoryUsed = '';
	
    chrome.storage.sync.getBytesInUse(null, bytesInUse => memoryUsed = bytesInUse ); // get bytes
    chrome.storage.sync.getBytesInUse('notes', bytesInUse => notesMemoryUsed = bytesInUse ); // get bytes
    chrome.storage.sync.getBytesInUse('todos', bytesInUse => todosMemoryUsed = bytesInUse ); // get bytes
    // chrome.storage.sync.get(null, (items) => console.log(items)); // get all

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (const key in changes) {
            if (key == 'notes') {
                chrome.storage.sync.getBytesInUse(
                    'notes', 
                    bytesInUse => notesMemoryUsed = bytesInUse 
                );
            } else if (key == 'todos') {
                chrome.storage.sync.getBytesInUse(
                    'todos', 
                    bytesInUse => todosMemoryUsed = bytesInUse 
                ); 
            } 
        }
        chrome.storage.sync.getBytesInUse(null, bytesInUse => memoryUsed = bytesInUse ); // get bytes
    });

</script>

<br>
<br>

<label for="total">Total Memory:</label>
<meter id="total" min="0" max="102400" value={memoryUsed}></meter>
<br>

<label for="notes">Notes Memory:</label>
<meter id="notes" min="0" max="8192" value={notesMemoryUsed}></meter>
<br>

<label for="todos">Todos Memory:</label>
<meter id="todos" min="0" max="8192" value={todosMemoryUsed}></meter>
<br>

<style> 
    label {
        color: var(--light);
    }
</style> 