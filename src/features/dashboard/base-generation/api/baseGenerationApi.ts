import { apiClient } from '../../../../shared/api/apiClient';

type ApiScalar = string | number | null | undefined;

export type GridStatusResponseDto = {
  esmtOperYmd?: ApiScalar;
  esmtOperTime?: ApiScalar;
  baPtpvL12?: ApiScalar;
  baPtpvL23?: ApiScalar;
  baPtpvL31?: ApiScalar;
  baPtpvL1n?: ApiScalar;
  baPtpvL2n?: ApiScalar;
  baPtptL3n?: ApiScalar;
  baPfrL1?: ApiScalar;
  baPfrL2?: ApiScalar;
  baPfrL3?: ApiScalar;
  baPaL1?: ApiScalar;
  baPaL2?: ApiScalar;
  baPaL3?: ApiScalar;
  baAtpL1?: ApiScalar;
  baAtpL2?: ApiScalar;
  baAtpL3?: ApiScalar;
  baAtpTot?: ApiScalar;
  baRtpTot?: ApiScalar;
  baArpTot?: ApiScalar;
  baPfTot?: ApiScalar;
  baAtpDayAccm?: ApiScalar;
  baAtpWeekAccm?: ApiScalar;
  baAtpMonAccm?: ApiScalar;
  baAtpTotAccm?: ApiScalar;
  baRtpDayAccm?: ApiScalar;
  baRtpWeekAccm?: ApiScalar;
  baRtpMonAccm?: ApiScalar;
  baRtpTotAccm?: ApiScalar;
  lgldGbcd?: ApiScalar;
};

export type BaseGenerationStatusResponse = {
  latest: GridStatusResponseDto | null;
  statusList: GridStatusResponseDto[];
};

/*
 * 필요: 기저발전 화면에서 쓰는 GRID 최신/일자별 현황 API를 모은다.
 * 연결: useBaseGenerationStatus, baseGenerationAdapter.
 * 설명: 화면 컴포넌트는 endpoint를 모르고, API 변경 시 이 파일에서만 경로를 조정한다.
 * 수정: 조회 조건이 확정되면 getStatusList에 query parameter 조립만 추가한다.
 */
export const baseGenerationApi = {
  async getStatus(): Promise<BaseGenerationStatusResponse> {
    const [latest, statusList] = await Promise.all([
      apiClient<GridStatusResponseDto>('/monitoring/grid/latest'),
      apiClient<GridStatusResponseDto[]>('/monitoring/grid/status')
    ]);

    return {
      latest,
      statusList: Array.isArray(statusList) ? statusList : []
    };
  }
};
