<!-- 
	TODOs
	[] Done list
		[] Done list per day or something

20210101: [{},{},...],
20210102: [{},{},...]

	[] Add storage listener
		* chrome.storage.onChanged.addListener(function(changes, namespace) 
		* Multiple tab updates

	* TOTAL Storage Size 
		QUOTA_BYTES number 102400
	* Storage Size 
		QUOTA_BYTES_PER_ITEM number 8192
		* Make these visable (green/yellow/red) and warn to backup

	[] Save to Google Drive 
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
	[] ID number for tasks (object???)
 -->
<script>
	import Todo from './Todo.svelte';
</script>

<Todo />