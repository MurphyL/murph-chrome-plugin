$(function () {
    chrome.storage.local.get([ 'ip' ], res => {
        const { ip } = res;
        $('#ip').val(ip);
    });

    $('#save-config').click(() => {
        const ip = $('#ip').val();
        chrome.storage.local.set({ ip });
        let count = 2;
        $('footer .status').text('配置保存完成（3）');
        const no = setInterval(() => {
            if (count <= 0) {
                $('footer .status').text('');
                return clearInterval(no);
            }
            $('footer .status').text(`配置保存完成（${count--}）`);
        }, 1000);
    });
    $('#source').change((e) => {
        new Blob(e.target.files).text().then(savedConfig => {
            chrome.storage.local.set({ savedConfig });
            console.log('数据已保存！');
        });
    });
})