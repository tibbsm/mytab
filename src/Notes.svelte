<script>    
    import { debounce } from 'lodash-es';
    
    let notes = '';
    let memoryUsed = '';
    let notesMemoryUsed = '';
    let todosMemoryUsed = '';
	
    initializeNotes();

    chrome.storage.sync.getBytesInUse(null, bytesInUse => memoryUsed = bytesInUse ); // get bytes
    chrome.storage.sync.getBytesInUse('notes', bytesInUse => notesMemoryUsed = bytesInUse ); // get bytes
    chrome.storage.sync.getBytesInUse('todos', bytesInUse => todosMemoryUsed = bytesInUse ); // get bytes
    // chrome.storage.sync.get(null, (items) => console.log(items)); // get all

    function saveNotes() {
        chrome.storage.sync.set({"notes": notes});
    }

    function initializeNotes() {
        chrome.storage.sync.get(["notes"], function(items){
            notes = items['notes'] || '';
        });
    }

    function download(content, fileName, contentType) {
        let a = document.createElement("a");
        let text = content.replace(/<\/?[^>]+(>|$)/g, "\n");
        a.href = URL.createObjectURL(new Blob([text], {type: contentType}));
        a.download = fileName;
        a.click();
    }
</script>


<h1>Notes</h1>
<div 
    class='notes'
    bind:innerHTML={notes} 
    on:keyup={debounce(() => saveNotes(), 250)}
    contenteditable
></div>

<br>

<button
    on:click={() => download(notes, 'MyTabNotes.txt', 'text/plain')}
>Save notes</button>

<br/>
<br/>

<label for="total">Total Memory:</label>
<meter id="total" min="0" max="102400" value={memoryUsed}></meter>
<br/>

<label for="notes">Notes Memory:</label>
<meter id="notes" min="0" max="8192" value={notesMemoryUsed}></meter>
<br/>

<label for="todos">Todos Memory:</label>
<meter id="todos" min="0" max="8192" value={todosMemoryUsed}></meter>
<br/>

<style> 
    [contenteditable] {
        border: 1px solid #707070;
        min-height: 50px;
        width: 50%;
        border-radius: 3px;
        padding: 5px;
    }
</style> 