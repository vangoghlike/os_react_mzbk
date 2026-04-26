import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoMark from '../../../../assets/logo-comm.svg';
import { useAuthSession } from '../../session/AuthSessionProvider';
import { loginScreenMock } from '../mock/loginScreenMock';
import { LoginForm } from '../sections/LoginForm';
import '../styles/LoginPage.css';

/*
 * 필요: 로그인 화면 배경, 카드, 로고 배치를 시안 기준으로 유지한다.
 * 연결: LoginForm, loginScreenMock, 로그인 성공 후 기저발전 route.
 * 설명: mock 로그인 성공 시 세션을 저장하고 보호 화면으로 이동한다.
 * 수정: 카드 크기와 배경은 styles/LoginPage.css에서 조정한다.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthSession();
  // 페이지는 화면 상태와 이동만 들고, 폼 렌더링은 별도 섹션으로 분리한다.
  const [autoLogin, setAutoLogin] = useState(false);
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard/base-generation';

  return (
    <section className="login-shell">
      <div className="login-card">
        <h1 className="sr-only">{loginScreenMock.pageTitle}</h1>

        <img src={logoMark} alt={loginScreenMock.logoAlt} className="login-card__logo" />

        <LoginForm
          autoLogin={autoLogin}
          onAutoLoginChange={setAutoLogin}
          onSubmit={() => {
            login({ remember: autoLogin });
            navigate(fromPath, { replace: true });
          }}
        />
      </div>
    </section>
  );
}
