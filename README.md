# catch-mind
(진행중)react+ts, node 서버 기반 캐치 마인드 개인 프로젝트
webRTC, socket.io를 사용하여 실시간 채팅, 음성, canvas 통신 기능 구현

## 프로젝트 환경 구성
### 프론트
react, typescript, vite, chakra-ui, (storybook, vitest)

### 백엔드
node, express, socket.io

## 프로젝트 1차 구현 목표 (23.11.18 ~ )
- 회원 시스템 없이 진행하며, mesh 아키텍처의 webRTC 성능 고려하여 호스트 + 참가자 총 4인으로 각 게임방 구성
- webRTC 기반의 음성, 캔버스, 채팅 구현
- webRTC 연결 보조를 위한 express + socket 서버 구축
- 게임을 위한 페이지(방선택, 방설정, 게임) 및 chakra-ui 외 추가 컴포넌트 구현
