AddonStorage = {

    set({newData}) {
        browser.storage.sync.set(newData);
    },

    get({keyArray, callback}) {
        const gettingItem = browser.storage.sync.get(keyArray);
        gettingItem.then(res => {
            callback(res);
        });
    }
}

function save_options(e) {

    AddonStorage.set({
        newData: {
            userId: document.getElementById('login_id').value
            ,userPasswd: document.getElementById('login_passwd').value
            ,categoryBigIdx: document.getElementById('categoryBig').value
            ,categoryIdx1: document.getElementById('category1').value
            ,categoryIdx2: document.getElementById('category2').value
            ,categoryIdx3: document.getElementById('category3').value
        }
    });

    e.preventDefault();
  }

function restore_options() {
    AddonStorage.get({
        keyArray: ['userId', 'userPasswd', 'categoryBigIdx', 'categoryIdx1', 'categoryIdx2', 'categoryIdx3']
        ,callback: items => {
            if (items.userId) {
                document.getElementById('login_id').value = items.userId;
            }
            if (items.userPasswd) {
                document.getElementById('login_passwd').value = items.userPasswd;
            }
            if (items.categoryBigIdx) {
                document.getElementById('categoryBig').value = items.categoryBigIdx;
            }
            if (items.categoryIdx1) {
                document.getElementById('category1').value = items.categoryIdx1;
            }
            if (items.categoryIdx2) {
                document.getElementById('category2').value = items.categoryIdx2;
            }
            if (items.categoryIdx3) {
                document.getElementById('category3').value = items.categoryIdx3;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('.main_contents').addEventListener('keyup', save_options);