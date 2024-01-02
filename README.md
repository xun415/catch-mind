# catch-mind
: react+ts, node 서버 기반 캐치 마인드 개인 프로젝트 <br />
webRTC, socket.io를 사용하여 실시간 채팅, 음성, canvas 통신 기능 구현

## 진행 상태: 1차 완료. 에러 처리 중

## 프로젝트 환경 구성
### 프론트
react, typescript, vite, chakra-ui

### 백엔드
node, express, socket.io

## 프로젝트 1차 구현 (23.11.18 ~ 24.1.1)
- 회원 시스템 없이 진행하며, mesh 아키텍처의 webRTC 성능 고려하여 호스트 + 참가자 총 4인으로 각 게임방 구성
- webRTC 기반의 음성, 캔버스, 채팅 구현
- webRTC 연결 보조를 위한 express + socket 서버 구축
- 게임을 위한 페이지(방선택, 방설정, 게임) 및 chakra-ui 외 추가 컴포넌트 구현
- 프론트 로직 구현(webRTC, socket 통신, 게임 로직)

## 프로젝트 2차 구현 목표 (시작일 미정)
- 백엔드 서버의 아키텍처 개선 및 타입스크립트 도입 (nest.js 도입 고려)
- 백엔드, 프론트 monorepo 구성을 통한 공통 상수 의존, 유틸 함수 공통화 고려