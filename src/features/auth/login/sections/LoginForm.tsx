import type { FormEventHandler } from 'react';
import { ActionButton } from '../../../../shared/ui/ActionButton';
import { TextField } from '../../../../shared/ui/Field';
import { ToggleSwitch } from '../../../../shared/ui/ToggleSwitch';
import { loginScreenMock } from '../mock/loginScreenMock';
import './LoginForm.css';

type LoginFormProps = {
  autoLogin: boolean;
  onAutoLoginChange: (nextValue: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function LoginForm({ autoLogin, onAutoLoginChange, onSubmit }: LoginFormProps) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      {/* 로그인 화면에서 직접 보이는 입력 구조만 이 섹션에 모아 둔다. */}
      <TextField
        className="login-form__field"
        placeholder={loginScreenMock.idPlaceholder}
        aria-label={loginScreenMock.idPlaceholder}
        autoComplete="username"
      />

      <TextField
        className="login-form__field"
        type="password"
        placeholder={loginScreenMock.passwordPlaceholder}
        aria-label={loginScreenMock.passwordPlaceholder}
        autoComplete="current-password"
      />

      <div className="login-form__toggle-row">
        <span className="login-form__toggle-label">{loginScreenMock.autoLoginLabel}</span>

        <ToggleSwitch
          className="login-form__toggle"
          checked={autoLogin}
          onChange={onAutoLoginChange}
          onLabel={loginScreenMock.autoLoginOnLabel}
          offLabel={loginScreenMock.autoLoginOffLabel}
          aria-label={`${loginScreenMock.autoLoginLabel} ${autoLogin ? '켜짐' : '꺼짐'}`}
        />
      </div>

      <ActionButton type="submit" variant="primary" size="lg" className="login-form__submit">
        {loginScreenMock.submitLabel}
      </ActionButton>
    </form>
  );
}
