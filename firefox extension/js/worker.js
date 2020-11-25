
Timer = {

    /**
     * @param {Number} standardHour 현재 시간과 비교할 기준 시간, 15는 오후 3시
     * @return {Boolean} 입력된 시간을 기준으로 현재 시간이 이후인가?
     */
    isTimeAfter({standardHour}) {
        const currentHour = (new Date()).getHours();

        return (currentHour >= standardHour);
    }
}

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

Worker = {

    /**
     * 출/퇴근의 구분 시간.
     * 12: 12시(정오)
     */
    MIN_GETTING_OFF_HOUR: 12,

    clickBtnSubmit() {
        const btnSubmit = document.getElementById('btnSubmit');

        // 가끔씩 버튼 안눌리는 현상이 있어 의도적으로 약간 지연
        setTimeout(() => {
            btnSubmit.click();
        }, 500);
    },

    login() {
        AddonStorage.get({
            keyArray: ['userId', 'userPasswd']
            ,callback: items => {
                const inputId = document.getElementById('iptUser_id')
                ,inputPasswd = document.getElementById('iptUser_pass');

                inputId.value = items.userId;
                inputPasswd.value = items.userPasswd;
                this.clickBtnSubmit();
            }
        });
    },

    signPledge() {
        const name = document.getElementById('pUserName1').innerHTML
              ,input1 = document.getElementById('iptUserName1')
              ,input2 = document.getElementById('iptUserName2');

        input1.value = name;
        input2.value = name;

        this.clickBtnSubmit();
    },

    agreePersonalInfo() {
        const chkAgree1 = document.getElementById('chkAgree1')
            ,chkAgree2 = document.getElementById('chkAgree2');

        chkAgree1.checked = true;
        chkAgree1.dispatchEvent(new Event('click'));
        chkAgree2.checked = true;
        chkAgree2.dispatchEvent(new Event('click'));

        this.clickBtnSubmit();
    },

    checkPerfectHealthy() {
        const radioArr = [
            document.getElementById('rdSurvey13')
            ,document.getElementById('chkSurvey10')
            ,document.getElementById('rdSurvey33')
            ,document.getElementById('rdSurvey42')
        ];

        radioArr.forEach(radio => {
            radio.checked = true;
        });

        this.clickBtnSubmit();
    },

    /**
     * @param {Number} selectTagId 선택한 태그의 id 속성값
     * @param {Number} idx 선택할 option tag의 index(0부터 시작, 0은 미선택)
     */
    _pickFromSelectTag({selectTagId, idx}) {
        /*
         * selected = true는 이벤트를 발생시키지 않으므로 강제로 이벤트 발생하여
         * 이벤트 활성화
         */
        const selectTag = document.querySelector(`#${selectTagId}`);

        selectTag.selectedIndex = idx;
        selectTag.dispatchEvent(new Event('change'));
    },

    _pickFromRadioBtn({radioBtnId}) {
        const radioBtn = document.querySelector(`#${radioBtnId}`);

        radioBtn.checked = true;
        radioBtn.dispatchEvent(new Event('click'));    
    },

    chooseTodayWork() {
        AddonStorage.get({
            keyArray: ['categoryBigIdx', 'categoryIdx1', 'categoryIdx2', 'categoryIdx3']
            ,callback: items => {
                this._pickFromRadioBtn({radioBtnId: `rdJobType${items.categoryBigIdx}`});

                this._pickFromSelectTag({
                    selectTagId: 'selCategory1'
                    , idx: items.categoryIdx1
                });
                this._pickFromSelectTag({
                    selectTagId: 'selCategory2'
                    , idx: items.categoryIdx2
                });
                this._pickFromSelectTag({
                    selectTagId: 'selCategory3'
                    , idx: items.categoryIdx3
                });
               
                this.clickBtnSubmit();
            }
        });
    }
}

/*
 * https://dt20chk.hyosungitx.com/  로그인
 * https://dt20chk.hyosungitx.com/onPledge  출근 서명
 * https://dt20chk.hyosungitx.com/agreement  동의
 * https://dt20chk.hyosungitx.com/covidCheck  코로나 체크
 *
 * https://dt20chk.hyosungitx.com/main  퇴근하기 버튼
 * https://dt20chk.hyosungitx.com/dailyReport  오늘 한 일 체크
 * https://dt20chk.hyosungitx.com/offPledge  퇴근 서명
 */
function main() {
    const url = window.location.href;

    switch(url) {
        case 'https://dt20chk.hyosungitx.com/':
            Worker.login();
            break;
        case 'https://dt20chk.hyosungitx.com/onPledge':
        case 'https://dt20chk.hyosungitx.com/offPledge':
            Worker.signPledge();
            break;
        case 'https://dt20chk.hyosungitx.com/agreement':
            Worker.agreePersonalInfo();
            break;
        case 'https://dt20chk.hyosungitx.com/covidCheck':
            Worker.checkPerfectHealthy();
            break;
        case 'https://dt20chk.hyosungitx.com/main':
            /*
             * 1.
             * 출근 url 처리 후 `/main` url이 나오므로,
             * 출근 직후 퇴근 처리를 바로 하지 않도록
             * `/main`은 정오(12시) 이전엔 작동하지 않게 설정
             *
             * 2.
             * 퇴근 처리 후 무한 반복을 막기 위해
             * 로그아웃 메시지가 떴으면 처리 안하도록 설정
             */
            const divLogout = document.getElementById('divLogoutBefore');

            if (Timer.isTimeAfter({standardHour: Worker.MIN_GETTING_OFF_HOUR})
                && divLogout.style.display != 'none') {
                Worker.clickBtnSubmit();
            }
            break;
        case 'https://dt20chk.hyosungitx.com/dailyReport':
            // load 될 때까지 기다렸다가 처리
            Worker.chooseTodayWork();
            break;
    }

}

main();