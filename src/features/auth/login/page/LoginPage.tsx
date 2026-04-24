import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMark from '../../../../assets/logo-mark.svg';
import { loginScreenMock } from '../mock/loginScreenMock';
import { LoginForm } from '../sections/LoginForm';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  // 페이지는 화면 상태와 이동만 들고, 폼 렌더링은 별도 섹션으로 분리한다.
  const [autoLogin, setAutoLogin] = useState(false);

  return (
    <section className="login-shell">
      <div className="login-card">
        <h1 className="sr-only">{loginScreenMock.pageTitle}</h1>

        <img src={logoMark} alt={loginScreenMock.logoAlt} className="login-card__logo" />

        <LoginForm
          autoLogin={autoLogin}
          onAutoLoginChange={setAutoLogin}
          onSubmit={(event) => {
            event.preventDefault();
            navigate('/dashboard/base-generation');
          }}
        />
      </div>
    </section>
  );
}
