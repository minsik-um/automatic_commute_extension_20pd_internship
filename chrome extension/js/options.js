function save_options() {
    const userId = document.getElementById('login_id').value
          ,userPasswd = document.getElementById('login_passwd').value
          ,categoryIdx1 = document.getElementById('category1').value
          ,categoryIdx2 = document.getElementById('category2').value
          ,categoryIdx3 = document.getElementById('category3').value;

    chrome.storage.sync.set({
        userId
        ,userPasswd
        ,categoryIdx1
        ,categoryIdx2
        ,categoryIdx3
    }, () => { });
}

function restore_options() {
    chrome.storage.sync.get({
        userId: 'dt2009999'
        ,userPasswd: 'dt2009999'
        ,categoryIdx1: '1'
        ,categoryIdx2: '1'
        ,categoryIdx3: '1'
    }, items => {
        document.getElementById('login_id').value = items.userId;
        document.getElementById('login_passwd').value = items.userPasswd;
        document.getElementById('category1').value = items.categoryIdx1;
        document.getElementById('category2').value = items.categoryIdx2;
        document.getElementById('category3').value = items.categoryIdx3;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('.main_contents').addEventListener('keyup', save_options);