import type { AuthSession } from '../types/authSession';

const PERSIST_SESSION_KEY = 'ems-auth-session';
const BROWSER_SESSION_KEY = 'ems-browser-session';

function readJsonSession(value: string | null): AuthSession | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
}

/*
 * 필요: 자동로그인 여부에 따라 로그인 유지 저장소를 나눈다.
 * 연결: AuthSessionProvider.
 * 설명: 자동로그인은 localStorage, 일반 로그인은 sessionStorage만 사용한다.
 * 수정: 저장 키나 만료 정책이 필요하면 이 파일에서만 조정한다.
 */
export const authSessionStorage = {
  read() {
    return readJsonSession(localStorage.getItem(PERSIST_SESSION_KEY)) ?? readJsonSession(sessionStorage.getItem(BROWSER_SESSION_KEY));
  },
  write(session: AuthSession) {
    this.clear();
    const serializedSession = JSON.stringify(session);

    if (session.remember) {
      localStorage.setItem(PERSIST_SESSION_KEY, serializedSession);
      return;
    }

    sessionStorage.setItem(BROWSER_SESSION_KEY, serializedSession);
  },
  clear() {
    localStorage.removeItem(PERSIST_SESSION_KEY);
    sessionStorage.removeItem(BROWSER_SESSION_KEY);
  }
};
