import { API_BASE_URL } from './apiConfig';
import { authTokenStorage } from './authTokenStorage';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
};

type ApiClientOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

export const API_AUTH_REQUIRED_EVENT = 'ems-auth-required';

/*
 * 필요: Swagger API 호출 형식과 오류 처리를 한 곳에서 맞춘다.
 * 연결: authApi, 이후 monitoring/report/master API adapter.
 * 설명: auth 옵션이 켜진 요청은 저장된 bearer token을 Authorization 헤더로 붙인다.
 * 수정: 서버 공통 응답 래퍼가 바뀌면 이 함수에서만 응답 해석을 조정한다.
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function createHeaders(auth: boolean) {
  const headers = new Headers({ Accept: 'application/json' });

  if (auth) {
    const token = authTokenStorage.read();
    if (token?.accessToken) {
      headers.set('Authorization', `${token.tokenType || 'Bearer'} ${token.accessToken}`);
    }
  }

  return headers;
}

function notifyAuthRequired(auth: boolean, response: Response, payload?: ApiResponse<unknown>) {
  if (!auth) return;
  if (response.status !== 401 && payload?.code !== 'C002') return;
  if (typeof window === 'undefined') return;

  // 인증 API가 아닌 보호 API에서 인증 만료가 확인되면 화면 세션을 함께 정리한다.
  window.dispatchEvent(new CustomEvent(API_AUTH_REQUIRED_EVENT));
}

export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers = createHeaders(auth);
  const requestInit: RequestInit = { method, headers };

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestInit);
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? ((await response.json()) as ApiResponse<T>) : undefined;

  if (!response.ok || payload?.success === false) {
    notifyAuthRequired(auth, response, payload as ApiResponse<unknown> | undefined);
    throw new ApiError(payload?.message ?? 'API 요청 처리에 실패했습니다.', response.status, payload?.code);
  }

  return payload?.data as T;
}
