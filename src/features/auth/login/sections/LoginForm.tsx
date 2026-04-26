import { useEffect, useMemo, useState, type FormEventHandler } from 'react';
import { ActionButton } from '../../../../shared/ui/ActionButton';
import { TextField } from '../../../../shared/ui/Field';
import { ToggleSwitch } from '../../../../shared/ui/ToggleSwitch';
import { loginScreenMock } from '../mock/loginScreenMock';
import type { LoginCredentials, LoginValidationState } from '../types/loginValidation';
import '../styles/LoginForm.css';

type LoginFormProps = {
  autoLogin: boolean;
  onAutoLoginChange: (nextValue: boolean) => void;
  onSubmit: (credentials: LoginCredentials) => void;
};

/*
 * 필요: 아이디, 패스워드, 자동로그인, 로그인 버튼 구조를 시안대로 유지한다.
 * 연결: LoginPage가 자동로그인 상태와 submit 동작을 넘긴다.
 * 설명: 실제 API 없이 mock 계정 기준의 비동기 검증 상태만 재현한다.
 * 수정: 폼 폭, 입력 높이, 버튼 간격은 styles/LoginForm.css에서 조정한다.
 */
export function LoginForm({ autoLogin, onAutoLoginChange, onSubmit }: LoginFormProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [idValidation, setIdValidation] = useState<LoginValidationState>({ status: 'idle', message: '' });
  const [passwordValidation, setPasswordValidation] = useState<LoginValidationState>({ status: 'idle', message: '' });

  const validating = idValidation.status === 'checking' || passwordValidation.status === 'checking';
  const canSubmit = idValidation.status === 'valid' && passwordValidation.status === 'valid' && !validating;

  useEffect(() => {
    if (!idTouched && !loginId) return;

    if (!loginId.trim()) {
      setIdValidation({ status: 'invalid', message: loginScreenMock.validationMessages.idRequired });
      return;
    }

    setIdValidation({ status: 'checking', message: loginScreenMock.validationMessages.idChecking });

    // 입력 직후 바로 확정하지 않고 일반 로그인 검증처럼 잠깐 확인 상태를 보여 준다.
    const validationTimer = window.setTimeout(() => {
      const valid = loginId.trim() === loginScreenMock.mockAccount.id;
      setIdValidation({
        status: valid ? 'valid' : 'invalid',
        message: valid ? loginScreenMock.validationMessages.idValid : loginScreenMock.validationMessages.idInvalid
      });
    }, 280);

    return () => window.clearTimeout(validationTimer);
  }, [idTouched, loginId]);

  useEffect(() => {
    if (!passwordTouched && !password) return;

    if (!password) {
      setPasswordValidation({ status: 'invalid', message: loginScreenMock.validationMessages.passwordRequired });
      return;
    }

    setPasswordValidation({ status: 'checking', message: loginScreenMock.validationMessages.passwordChecking });

    // 비밀번호도 mock 계정 기준으로 비동기 확인 상태를 거친 뒤 결과를 표시한다.
    const validationTimer = window.setTimeout(() => {
      const valid = password === loginScreenMock.mockAccount.password;
      setPasswordValidation({
        status: valid ? 'valid' : 'invalid',
        message: valid ? loginScreenMock.validationMessages.passwordValid : loginScreenMock.validationMessages.passwordInvalid
      });
    }, 280);

    return () => window.clearTimeout(validationTimer);
  }, [passwordTouched, password]);

  const fieldStatusClass = useMemo(
    () => ({
      id: idValidation.status !== 'idle' ? `login-form__field--${idValidation.status}` : '',
      password: passwordValidation.status !== 'idle' ? `login-form__field--${passwordValidation.status}` : ''
    }),
    [idValidation.status, passwordValidation.status]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIdTouched(true);
    setPasswordTouched(true);

    const validId = loginId.trim() === loginScreenMock.mockAccount.id;
    const validPassword = password === loginScreenMock.mockAccount.password;

    if (!validId || !validPassword) {
      setIdValidation({
        status: validId ? 'valid' : 'invalid',
        message: validId ? loginScreenMock.validationMessages.idValid : loginScreenMock.validationMessages.idInvalid
      });
      setPasswordValidation({
        status: validPassword ? 'valid' : 'invalid',
        message: validPassword ? loginScreenMock.validationMessages.passwordValid : loginScreenMock.validationMessages.passwordInvalid
      });
      return;
    }

    onSubmit({ id: loginId.trim(), password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {/* 로그인 화면에서 직접 보이는 입력 구조만 이 섹션에 모아 둔다. */}
      <div className="login-form__field-group">
        <TextField
          className={`login-form__field ${fieldStatusClass.id}`.trim()}
          value={loginId}
          placeholder={loginScreenMock.idPlaceholder}
          aria-label={loginScreenMock.idPlaceholder}
          aria-invalid={idValidation.status === 'invalid'}
          aria-describedby="login-id-validation"
          autoComplete="username"
          onBlur={() => setIdTouched(true)}
          onChange={(event) => {
            setIdTouched(true);
            setLoginId(event.target.value);
          }}
        />
        <p
          id="login-id-validation"
          className={`login-form__validation login-form__validation--${idValidation.status}`}
          aria-live="polite"
        >
          {idValidation.message}
        </p>
      </div>

      <div className="login-form__field-group">
        <TextField
          className={`login-form__field ${fieldStatusClass.password}`.trim()}
          type="password"
          value={password}
          placeholder={loginScreenMock.passwordPlaceholder}
          aria-label={loginScreenMock.passwordPlaceholder}
          aria-invalid={passwordValidation.status === 'invalid'}
          aria-describedby="login-password-validation"
          autoComplete="current-password"
          onBlur={() => setPasswordTouched(true)}
          onChange={(event) => {
            setPasswordTouched(true);
            setPassword(event.target.value);
          }}
        />
        <p
          id="login-password-validation"
          className={`login-form__validation login-form__validation--${passwordValidation.status}`}
          aria-live="polite"
        >
          {passwordValidation.message}
        </p>
      </div>

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

      <ActionButton
        type="submit"
        variant="primary"
        size="lg"
        className="login-form__submit"
        aria-disabled={!canSubmit}
      >
        {validating ? loginScreenMock.checkingSubmitLabel : loginScreenMock.submitLabel}
      </ActionButton>
    </form>
  );
}
