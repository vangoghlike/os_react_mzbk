import { useEffect, useState } from 'react';
import { ApiError } from '../../../../shared/api/apiClient';
import { toBaseGenerationPageData } from '../adapters/baseGenerationAdapter';
import { baseGenerationApi } from '../api/baseGenerationApi';
import type { BaseGenerationPageData } from '../types/baseGeneration';

type BaseGenerationStatusState = {
  data: BaseGenerationPageData | null;
  isLoading: boolean;
  errorMessage: string;
};

/*
 * 필요: 기저발전 API 조회 상태를 페이지에 전달한다.
 * 연결: BaseGenerationPage, baseGenerationApi, baseGenerationAdapter.
 * 설명: 화면 컴포넌트는 data/loading/error만 받고 API 호출과 DTO 변환은 이 hook 뒤에 숨긴다.
 * 수정: 자동 갱신이나 검색 조건이 들어오면 이 hook의 loadStatus 인자만 확장한다.
 */
export function useBaseGenerationStatus() {
  const [state, setState] = useState<BaseGenerationStatusState>({
    data: null,
    isLoading: true,
    errorMessage: ''
  });

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      setState((currentState) => ({ ...currentState, isLoading: true, errorMessage: '' }));

      try {
        const response = await baseGenerationApi.getStatus();
        const data = toBaseGenerationPageData(response);

        if (!mounted) {
          return;
        }

        setState({ data, isLoading: false, errorMessage: '' });
      } catch (error) {
        if (!mounted) {
          return;
        }

        const message = error instanceof ApiError ? error.message : '기저발전 데이터를 불러오지 못했습니다.';
        setState({ data: null, isLoading: false, errorMessage: message });
      }
    }

    loadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
