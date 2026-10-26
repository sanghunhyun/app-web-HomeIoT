# 🏠 Home Assistant 설치 및 플랫폼 연동 가이드

이 문서는 Mac Mini에서 Home Assistant를 설치하고, SmartThings 및 알리발 센서들(Tuya, eWeLink, Xiaomi)을 연동하는 절차를 안내합니다.

---

## 1. Mac Mini에 Home Assistant 설치하기

가장 편리하고 깔끔한 방법은 **Docker**를 사용하는 것입니다.

### 1단계: 설정 디렉토리 생성
```bash
mkdir -p ~/homeassistant/config
```

### 2단계: Home Assistant 컨테이너 실행
```bash
docker run -d \
  --name homeassistant \
  --restart=unless-stopped \
  --privileged \
  -v ~/homeassistant/config:/config \
  -v /etc/localtime:/etc/localtime:ro \
  --net=host \
  ghcr.io/home-assistant/home-assistant:stable
```
*(Mac에서 `--net=host` 대신 포트 매핑을 사용할 경우 `-p 8123:8123` 추가)*

### 3단계: 초기 설정 접속
웹 브라우저에서 `http://localhost:8123` 접속:
1. 소유자 계정 생성 (사용자 이름, 비밀번호 입력)
2. 집 위치 및 통화/단위 설정
3. 완료!

---

## 2. IoT 플랫폼 통합 추가

Home Assistant 좌측 메뉴 **[설정 (Settings)]** → **[기기 및 서비스 (Devices & Services)]** → **[통합 추가 (Add Integration)]**:

### 1) Samsung SmartThings
1. 통합 검색에서 `SmartThings` 선택
2. 삼성 계정 로그인 및 권한 승인 (OAuth 방식)
3. 연결된 에어컨, 스마트 TV, 로봇청소기, 세탁기 등이 자동으로 HA 엔티티로 등록됩니다.

### 2) Tuya / Smart Life (알리발 온습도계, 조명, 플러그)
1. 통합 검색에서 `Tuya` 선택
2. Tuya/Smart Life 앱의 계정(이메일)과 비밀번호, 국가 코드 입력
3. Smart Life 앱에 등록된 모든 알리 기기가 즉시 HA로 동기화됩니다.

### 3) eWeLink / Sonoff
- HACS(Home Assistant Community Store)를 통해 `SonoffLAN`을 설치하거나 공식 클라우드 연동을 통해 로컬/클라우드 제어가 가능합니다.

### 4) Xiaomi / Aqara
- HACS에서 `Xiaomi Miot Auto`를 추가하면 계정 로그인만으로 대부분의 샤오미/아카라 센서가 자동 등록됩니다.

---

## 3. Long-Lived Access Token (접근 토큰) 발급

우리 대시보드 웹앱이 Home Assistant와 통신하려면 접근 토큰이 필요합니다:

1. Home Assistant 좌측 하단 **[내 프로필 아이콘]** 클릭
2. **[보안 (Security)]** 탭 선택
3. 화면 맨 아래의 **[장기 액세스 토큰 (Long-Lived Access Tokens)]** 항목에서 **[토큰 만들기]** 클릭
4. 이름 입력 (예: `HomeIoT-Dashboard`) 후 생성된 긴 문자열 복사
5. 우리 대시보드의 **관리자 센터 (`/admin`)** → **[HA & 보안 설정]** 탭에서:
   - HA URL: `http://localhost:8123`
   - 토큰 붙여넣기
   - 시뮬레이션 모드 해제 후 **[연결 테스트]** 및 **[설정 저장]** 클릭!
