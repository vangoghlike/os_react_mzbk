export type AuthUser = {
  id: string;
  name: string;
  roleLabel: string;
};

export type AuthSession = {
  user: AuthUser;
  remember: boolean;
  loggedInAt: string;
};

export type LoginSessionRequest = {
  remember: boolean;
};
