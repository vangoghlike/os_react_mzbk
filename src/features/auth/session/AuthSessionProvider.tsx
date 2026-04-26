import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { authUserMock } from './mock/authSessionMock';
import type { AuthSession, LoginSessionRequest } from './types/authSession';
import { authSessionStorage } from './utils/authSessionStorage';

type AuthSessionContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (request: LoginSessionRequest) => void;
  logout: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: ReactNode;
};

/*
 * 필요: 로그인 여부를 앱 전체 route와 topbar에서 공유한다.
 * 연결: App, router guard, LoginPage, Topbar.
 * 설명: 실제 인증 토큰 없이 mock 세션을 storage에 저장해 로그인 유지 흐름만 재현한다.
 * 수정: 실제 API 세션으로 교체할 때는 login/logout 내부만 바꾸면 된다.
 */
export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => authSessionStorage.read());

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login(request) {
        const nextSession: AuthSession = {
          user: authUserMock,
          remember: request.remember,
          loggedInAt: new Date().toISOString()
        };

        authSessionStorage.write(nextSession);
        setSession(nextSession);
      },
      logout() {
        authSessionStorage.clear();
        setSession(null);
      }
    }),
    [session]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('AuthSessionProvider 안에서만 useAuthSession을 사용할 수 있습니다.');
  }

  return context;
}
