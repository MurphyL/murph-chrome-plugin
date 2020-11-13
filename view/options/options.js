$(() => {
    chrome.storage.local.get([ 'savedConfig' ], ({ savedConfig }) => {
        $('#config').val((savedConfig || '').trim());

        const editor = CodeMirror.fromTextArea(document.getElementById('config'), {
            value: (savedConfig || '').trim(),
            lineNumbers: true,
            name: "javascript", 
            json: true
        });
    });
})