# MZBK React Publishing

## 실행
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
npm run preview
```

## 목적
- EMS 화면 퍼블리싱 납품용 React 프로젝트
- 백엔드 분리 구조
- UI/레이아웃/차트/테이블 중심

## 포함 화면
- 로그인
- 기저발전
- 보조발전
- 충방전 현황
- 운영 리포트
- 마스터 관리
- 코드 관리
- 사용자 관리
- 권한 관리
- 팝업 샘플

## 폴더 개요
- `src/components`: 공통 UI
- `src/layouts`: 레이아웃
- `src/pages`: 화면 단위 페이지
- `src/data/mock`: 목업 데이터
- `src/styles`: 전역 스타일

## 비고
- 저장/조회/엑셀/인쇄는 퍼블리싱용 버튼 상태만 구현
- 실제 API 연결은 별도 개발 단계에서 교체
