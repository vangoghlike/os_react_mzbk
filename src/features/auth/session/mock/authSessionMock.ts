import type { AuthUser } from '../types/authSession';

/*
 * 필요: 로그인 성공 후 화면에 표시할 사용자 정보를 mock으로 관리한다.
 * 연결: AuthSessionProvider, Topbar.
 * 설명: 실제 사용자 조회 API가 생기기 전까지 로그인 유지 화면 상태만 재현한다.
 * 수정: 상단 사용자명과 권한 라벨은 이 파일에서 조정한다.
 */
export const authUserMock: AuthUser = {
  id: 'admin',
  name: 'admin(홍길동)',
  roleLabel: '관리자'
};
