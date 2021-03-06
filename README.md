# 자동 출퇴근 웹 확장 프로그램
2020 공공데이터 청년인턴십 - 출퇴근 사이트에서 자동으로 정보를 입력하고 버튼을 누르는 매크로입니다. 목표 기능은 구현했으며, 불편 요청이나 출퇴근 시스템 변화가 있을 때만 업데이트할 예정입니다.

### 대상
2020 공공데이터 청년인턴

### 플랫폼
PC만 지원, 모바일 미지원 사유는 아래 따로 기술함.

- Firefox Add-on
- Chrome Extension(현재 미지원)

### 설치 방법(Firefox add-on)
1. [install.xpi](https://github.com/minsik-um/automatic_commute_extension_20pd_internship/raw/master/install.xpi) 다운로드
2. xpi 파일을 firefox 브라우저에 드래그한다.
3. 확장 프로그램 설치 팝업이 뜨면 설치!

### 사용방법
1. 자동으로 입력할 정보를 설정 페이지에서 입력합니다. 입력만 하면 자동 저장됩니다.
    - Firefox: 브라우저 우측 상단 확장 프로그램 버튼 눌러 페이지 열기
    - Chrome: [출퇴근 웹사이트](https://dt20chk.hyosungitx.com/) 접속 시 옵션 페이지 열림
2. [출퇴근 웹사이트](https://dt20chk.hyosungitx.com/)에 접속합니다.
3. 출퇴근 웹사이트를 새로고침하여 다시 접속하면 매크로가 실행됩니다.
    - 12시 이전: 출근 매크로
    - 12시 이후: 퇴근 매크로

### 주의사항
- 해당 플러그인은 반복된 입력의 자동화를 해줄 뿐입니다. **코로나로 인한 증상 있을 시 플러그인 삭제 후 코로나 증상 입력을 권장**드립니다.

## 개발 과정
### 개발 동기
인턴 출퇴근은 특정 웹사이트에서 폼에 정보를 입력하고 제출하는 구조다. 제출도 여러번 해야하고, 매번 서약서 폼에 이름을 입력하는 것이 번거로웠다. 또한 인턴 근무가 별로 없어 자기 개발 시간이 많았다. 인턴십 시간을 의미있게 만들고 싶었으며, 번거로운 반복 입력을 간소화하고 싶었다.

### 개발 목표
1. 출퇴근 웹페이지 input에 정보 자동 입력(매크로)
2. 여러개로 구성된 출퇴근 절차의 개별 url 모두에 스크립트 삽입
3. 유저의 정보를 저장하고 매번 불러와 사용

### 1. iframe 태그를 이용?
1번은 Javascript를 이용하면 간편하다. 2번이 아래 문제 때문에 까다로웠다. **매크로가 수정할 웹페이지는 외부 서버 도메인, 매크로 스크립트는 `localhost` 또는 다른 도메인**이기 때문이다.

다른 도메인의 웹페이지에 스크립트를 자동으로 삽입하는 건 쉽지 않다. 매번 개발자 콘솔 열고 스크립트를 삽입할 순 없는 노릇이다. 가장 먼저 떠오른 방법은 `<iframe>` 태그였다. `<iframe>`에서 출퇴근 사이트를 접속하고, 상위 `html`에서 매크로 스크립트를 가지고 있게 해봤다.

```html
<html>
<body>
    <iframe src="https://dt20chk.hyosungitx.com/"></iframe>
    <script>
        // 대충 이런 구조로.
        const innerPage = document.querySelector('iframe').contentWindow.document
              ,input1 = innerPage.querySelector('.iptInput1');

        input1.value = 'dt2003979';
    </script>
</body>
</html>
```

이런! [크로스 도메인 방지 정책](https://en.wikipedia.org/wiki/Same-origin_policy)에 의해 `<iframe>` 내부 콘텐츠를 수정할 수 없었다. 보안상 이유로 금지한 것이므로 다른 대안이 필요했다. 게다가 3번 목표인 데이터 저장/불러오기 구현도 막막했다.

### 2. 크롬 확장 프로그램
매크로 앱의 플랫폼을 Chrome 브라우저의 확장 프로그램으로 변경했다. 확장 프로그램으로서 스크립트를 실행하니 구현이 간단했다.

- (2번 목표) 웹페이지에 스크립트 자동 삽입은 **Chrome Tabs API** 사용
- (3번 목표) 데이터 저장/불러오기는 **Chrome Storage API** 사용

`Worker.js` 파일에 매크로를 모두 넣고, 출퇴근 사이트 url을 감지하면 스크립트를 삽입한다. 그리고 url에 따라 적절한 매크로를 호출한다. 다행히 잘 작동한다.

그런데 인턴하는 다른 사람들에게 소개하자 새로운 요구사항이 생겼다.

4. 모바일에서 작동할 순 없을까?

만약 PC를 이용해서 출퇴근을 처리하면, 퇴근할 때 6시 이후까지 컴퓨터 켜놓고 자리에 남아있어야 한다. 그런데 일부 인원들은 5시 55분에 퇴근해야 집 가는 버스를 탔기에 퇴근은 모바일로 처리해야 했다.

크롬 확장 프로그램은 PC 플랫폼만 공식 지원한다. 비공식적으로 Android `Kiwi Browser` 앱이 크롬 확장 프로그램을 지원하지만, 내가 개발한 확장 프로그램은 해당 브라우저에서 작동하지 않았다. 디버깅도 전혀 지원되지 않아서 무엇을 해결할지 감도 못잡았다.

하는 수 없이 포ㄱ.... 할..할 줄 알았냐!

### 3. Firefox add-on
Firefox 브라우저의 확장 프로그램인 add-on은 Android 브라우저 호환을 공식 지원했다! 크롬 확장 프로그램의 코드를 조금만 수정하면 되었기에 즉시 만들어 테스트해보았다.

[Web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) npm 패키지를 설치하면 Android Firefox 브라우저에 개발 중인 앱을 설치할 수 있다. 영구 설치는 아니고 USB 유선 연결된 동안 임시 설치를 해준다. 디버깅 용도로 사용했다.

- (4번 목표) 모바일 지원은 firefox add-on 플랫폼으로 해결

와! PC는 물론이고 모바일에서도 정상 작동했다... **기능은 정상 작동했지만 배포가 불가능**했다.

- firefox 부가 기능 스토어: 일반 유저를 위한 기능이 아니므로 등록 거부당함.
- 최근 안드로이드용 브라우저 관련해서 새로 개발 중이라고 함. 그래서 **미리 정해진 추천 부가 기능 외엔 안드로이용 브라우저에 설치할 수 없음**. (와...)

[최근 안드로이드용 firefox 브라우저 업데이트](https://blog.mozilla.org/addons/2020/09/02/update-on-extension-support-in-the-new-firefox-for-android/) 포스트를 보면, 그리 길지 않은 시간 내에 모바일 확장 프로그램 설치가 다시 가능할 것으로 보인다. 몇주 내에 추천 모바일 확장 프로그램 목록을 더 업데이트 한다고 했다. 하지만 내가 만든 앱은 여전히 안된다.

배포가 일시적으로 안되기에 타인 공유는 PC판만 가능하다. 하지만 디버깅으로 모바일 작동은 확인했기에 모바일 구현 목표는 달성했다.
