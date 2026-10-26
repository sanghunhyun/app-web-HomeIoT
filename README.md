# 🏠 우리집 IoT 통합 대시보드 (`app-web-HomeIoT`)

SmartThings, Tuya/Smart Life, eWeLink(Sonoff), Xiaomi/Aqara 등 집에 있는 다양한 IoT 기기들을 하나의 직관적인 대시보드에서 제어하고 모니터링할 수 있는 Mac Mini 셀프호스팅 웹 애플리케이션입니다.

---

## ✨ 핵심 기능

1. **기기 타입별 전용 제어 카드**
   - **조명**: 전원 토글, 밝기 슬라이더 (0~100%)
   - **에어컨/난방**: 현재 온도 확인, 희망 온도 조절 (±0.5°C), 냉방/제습/송풍 모드
   - **스마트 플러그**: 실시간 소비 전력(W) 및 누적 소비량(kWh) 표시, 전원 제어
   - **온습도/공기질 센서**: 실내 온도, 습도, 미세먼지 수치(AQI), 배터리 잔량
   - **도어/창문 센서**: 열림/닫힘 보안 상태 표시 및 최근 변경 시간
   - **CCTV/홈캠**: 실시간 모니터링 배지, 스냅샷 프리뷰, 라이브 뷰 모달
   - **스마트 TV**: 전원, 볼륨 조절(±), 음소거, Netflix/YouTube 소스 전환
   - **로봇청소기**: 배터리 잔량, 상태, [청소 시작] / [일시정지] / [충전기 복귀]

2. **사용자 / 관리자 권한 분리 (PIN 인증)**
   - **일반 가족용 PIN (`1234`)**: 복잡한 세부 설정 없이 기기 제어만 깔끔하게 노출
   - **관리자 전용 PIN (`5678`)**: 기기 이름 변경, 방 배치, 숨김 여부, 정렬 순서, HA 연동 관리

3. **Home Assistant 미들웨어 + 시뮬레이션(Demo) 모드**
   - HA가 아직 설치되지 않았거나 테스트 중일 때도 모든 기기 제어가 100% 작동하는 **Mock 모드 내장**
   - HA 설치 후 URL과 토큰만 입력하면 실제 SmartThings 및 알리 센서들과 실시간 동기화

4. **FamilyWiki 및 Tailscale 연동 최적화**
   - FamilyWiki 사이드바 웹앱(`http://localhost:3100`)으로 iframe 내장 지원
   - Tailscale을 통해 외부에서도 추가 네트워크 설정 없이 안전하게 접속

---

## 🚀 빠른 시작

### 1. 개발 서버 실행 (포트 3100)
```bash
cd /Users/shyun/Dev/Web/app-web-HomeIoT
npm run dev
```

브라우저에서 `http://localhost:3100` 접속:
- 가족 PIN: `1234`
- 관리자 PIN: `5678`

### 2. 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

---

## 🔗 FamilyWiki 연계 방법

FamilyWiki 사이드바의 **웹앱** 메뉴에서 추가:
- 이름: `🏠 우리집 IoT`
- URL: `http://localhost:3100` (또는 `http://192.168.0.x:3100`)

---

## 📚 Home Assistant 설치 가이드
자세한 HA 설치 및 SmartThings/Tuya 연동 방법은 [`homeassistant/setup-guide.md`](./homeassistant/setup-guide.md) 문서를 참고하세요.
