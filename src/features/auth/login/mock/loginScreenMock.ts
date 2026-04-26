/*
 * 필요: 로그인 화면에 노출되는 문구와 alt 값을 한곳에서 관리한다.
 * 연결: LoginPage, LoginForm.
 * 설명: 실제 인증 없이 mock 계정과 검증 메시지를 기준으로 화면 상태를 재현한다.
 * 수정: 입력 placeholder, 버튼 문구, 검증 문구, mock 계정은 이 파일에서 조정한다.
 */
export const loginScreenMock = {
  logoAlt: 'MG EMS 로고',
  pageTitle: 'MG EMS 로그인',
  idPlaceholder: '아이디',
  passwordPlaceholder: '패스워드',
  autoLoginLabel: '자동로그인',
  autoLoginOnLabel: 'ON',
  autoLoginOffLabel: 'OFF',
  submitLabel: '로그인',
  checkingSubmitLabel: '확인 중',
  mockAccount: {
    id: 'admin',
    password: 'admin'
  },
  validationMessages: {
    idRequired: '아이디를 입력해 주세요.',
    idChecking: '아이디 확인 중입니다.',
    idValid: '등록된 아이디입니다.',
    idInvalid: '등록되지 않은 아이디입니다.',
    passwordRequired: '비밀번호를 입력해 주세요.',
    passwordChecking: '비밀번호 확인 중입니다.',
    passwordValid: '비밀번호가 일치합니다.',
    passwordInvalid: '비밀번호가 일치하지 않습니다.'
  }
};
