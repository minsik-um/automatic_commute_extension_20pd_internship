chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.url.startsWith('https://dt20chk.hyosungitx.com/')
            && changeInfo.status == 'complete') {

        chrome.storage.sync.get(
            {
                userId: false
                ,userPasswd: false
                ,categoryIdx1: false
                ,categoryIdx2: false
                ,categoryIdx3: false
            },
            items => {
                if (items.userId
                    && items.userPasswd
                    && items.categoryIdx1
                    && items.categoryIdx2
                    && items.categoryIdx3
                ) {
                    chrome.tabs.executeScript(tabId, {file: '/js/worker.js'});
                } else {
                    chrome.tabs.create({'url': "/html/options.html" });
                }
            }
        );
    }
});