import {
  monitoringApi,
  toLegacyMonitoringLatest,
  toLegacyMonitoringRows,
  type MonitoringDomain,
  type MonitoringDetailDto,
  type MonitoringResponseDto,
  type MonitoringTargetDto
} from '../../../../shared/api/monitoringApi';

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
  detailList: MonitoringDetailDto[];
  targetList: MonitoringTargetDto[];
  selectedTargetId: string;
};

/*
 * 필요: 기저전력 화면에서 쓰는 v3 monitoring 현재값 API를 모은다.
 * 연결: useBaseGenerationStatus, baseGenerationAdapter.
 * 설명: v3에서 제거된 /data, /detail 대신 /monitoring/base/{total|plant} 직접 호출 결과를 기존 화면 계약으로 변환한다.
 * 수정: 기저전력 API 도메인이나 targetId 파라미터가 바뀌면 이 파일에서 먼저 조정한다.
 */
export const baseGenerationApi = {
  async getStatus(domain: MonitoringDomain = 'base-total', targetId = ''): Promise<BaseGenerationStatusResponse> {
    const response = await monitoringApi.getData<MonitoringResponseDto>(domain);
    const selectedTargetId = targetId || String(response.targetList?.[0]?.targetId ?? '');
    const detailList =
      domain === 'base-plant' && selectedTargetId ? await monitoringApi.getDetail<MonitoringDetailDto[]>(domain, selectedTargetId) : [];
    const latest = toLegacyMonitoringLatest(response, 'grid') as GridStatusResponseDto;
    const statusList = toLegacyMonitoringRows(response, 'grid') as GridStatusResponseDto[];

    return {
      latest,
      statusList: Array.isArray(statusList) ? statusList : [],
      detailList,
      targetList: response.targetList ?? [],
      selectedTargetId
    };
  }
};
