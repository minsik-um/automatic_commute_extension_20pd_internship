Timer = {

    /**
     * @param {Number} standardHour 기준 시간, 15는 오후 3시
     */
    isTimeAfter({standardHour}) {
        const currentHour = (new Date()).getHours();

        return (currentHour >= standardHour);
    }
}

Worker = {

    /**
     * 출/퇴근의 구분 시간.
     */
    MIN_GETTING_OFF_HOUR: 12,  // 12시 (정오)

    clickBtnSubmit() {
        const btnSubmit = document.getElementById('btnSubmit');
        btnSubmit.click();
    },

    login() {

        chrome.storage.sync.get(
            {
                userId: false
                ,userPasswd: false
            },
            items => {
                const inputId = document.getElementById('iptUser_id')
                      ,inputPasswd = document.getElementById('iptUser_pass');

                inputId.value = items.userId;
                inputPasswd.value = items.userPasswd;
                this.clickBtnSubmit();
            }
        );
    },

    signOnPledge() {
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
         * 하위 이벤트 활성화
         */
        const selectTag = document.querySelector(`#${selectTagId}`);

        selectTag.selectedIndex = idx;
        selectTag.dispatchEvent(new Event('change'));
    },

    /**
     * 모두 첫 번째 분류로 일괄 선택
     */
    chooseTodayWork() {

        chrome.storage.sync.get(
            {
                categoryIdx1: false
                ,categoryIdx2: false
                ,categoryIdx3: false
            },
            items => {
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
        );
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
            Worker.signOnPledge();
            break;
        case 'https://dt20chk.hyosungitx.com/agreement':
            Worker.agreePersonalInfo();
            break;
        case 'https://dt20chk.hyosungitx.com/covidCheck':
            Worker.checkPerfectHealthy();
            break;
        case 'https://dt20chk.hyosungitx.com/main':
            /*
             * 출근 url 처리 후 `/main` url이 나오므로,
             * 출근 직후 퇴근 처리를 바로 하지 않도록
             * `/main`은 정오(12시) 이전엔 작동하지 않게 설정
             */
            if (Timer.isTimeAfter({standardHour: Worker.MIN_GETTING_OFF_HOUR})) {
                Worker.clickBtnSubmit();
            }
            break;
        case 'https://dt20chk.hyosungitx.com/dailyReport':
            // load 될 때까지 기다렸다가 처리
            setTimeout(() => { Worker.chooseTodayWork(); }, 200);
            break;
        case 'https://dt20chk.hyosungitx.com/offPledge':
            Worker.signOnPledge();
            break;
    }
}

main();