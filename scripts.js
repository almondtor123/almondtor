document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('publish-form');
    const scriptList = document.getElementById('script-list');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    // Load scripts from localStorage on page load
    loadScripts();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('script-title').value;
        const content = document.getElementById('script-content').value;

        addScriptToList(title, content);
        saveScript(title, content);

        form.reset();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        searchScript(searchTerm);
    });

    function addScriptToList(title, content) {
        const scriptItem = document.createElement('li');

        const scriptTitle = document.createElement('h3');
        scriptTitle.textContent = title;

        const scriptContent = document.createElement('pre');
        scriptContent.textContent = content;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.className = 'copy-button';
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            copyToClipboard(content);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            removeScript(title, content);
            scriptList.removeChild(scriptItem);
        });

        scriptItem.appendChild(scriptTitle);
        scriptItem.appendChild(scriptContent);
        scriptItem.appendChild(copyButton);
        scriptItem.appendChild(deleteButton);

        scriptItem.addEventListener('click', () => {
            window.location.href = `/${encodeURIComponent(title)}`; // Redirect to new page
        });

        scriptList.appendChild(scriptItem);
    }

    function saveScript(title, content) {
        const scripts = JSON.parse(localStorage.getItem('scripts')) || [];
        scripts.push({ title, content });
        localStorage.setItem('scripts', JSON.stringify(scripts));
    }

    function loadScripts() {
        const scripts = JSON.parse(localStorage.getItem('scripts')) || [];
        scripts.forEach(script => {
            addScriptToList(script.title, script.content);
        });
    }

    function removeScript(title, content) {
        let scripts = JSON.parse(localStorage.getItem('scripts')) || [];
        scripts = scripts.filter(script => script.title !== title || script.content !== content);
        localStorage.setItem('scripts', JSON.stringify(scripts));
    }

    function searchScript(searchTerm) {
        const scripts = JSON.parse(localStorage.getItem('scripts')) || [];
        scriptList.innerHTML = ''; // Clear the current list
        scripts.forEach(script => {
            if (script.title.toLowerCase().includes(searchTerm)) {
                addScriptToList(script.title, script.content);
            }
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Script copied to clipboard');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
});
