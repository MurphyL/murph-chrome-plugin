$(() => {
    const editor = CodeMirror.fromTextArea(document.getElementById('config'), {
        value: '',
        lineNumbers: true,
        name: "javascript", 
        indentUnit: 4,
        json: true,
    });
    chrome.storage.local.get([ 'savedConfig' ], ({ savedConfig }) => {
        editor.setValue((savedConfig || '').trim());
    });
});

