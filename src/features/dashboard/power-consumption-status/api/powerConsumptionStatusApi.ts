import { monitoringApi } from '../../../../shared/api/monitoringApi';
import type { ApiRecord } from '../../../../shared/api/apiDataUtils';

export type PowerConsumptionStatusResponse = {
  gridLatest: ApiRecord;
  essLatest: ApiRecord;
  pcsLatest: ApiRecord;
  diesel1Latest: ApiRecord;
  diesel2Latest: ApiRecord;
  gridStatusList: ApiRecord[];
};

/*
 * 필요: 전력 소비 현황에 임시 매핑되는 monitoring 실 API를 조회한다.
 * 연결: usePowerConsumptionStatus, powerConsumptionStatusAdapter.
 * 설명: Swagger에 전력 소비 전용 endpoint가 없어 GRID와 장비별 최신값을 API 기반으로 사용한다.
 * 수정: 전용 endpoint가 생기면 이 파일에서 호출 목록을 교체한다.
 */
export const powerConsumptionStatusApi = {
  async getStatus(): Promise<PowerConsumptionStatusResponse> {
    const [gridLatest, essLatest, pcsLatest, diesel1Latest, diesel2Latest, gridStatusList] = await Promise.all([
      monitoringApi.getLatest<ApiRecord>('grid'),
      monitoringApi.getLatest<ApiRecord>('ess'),
      monitoringApi.getLatest<ApiRecord>('pcs'),
      monitoringApi.getLatest<ApiRecord>('diesel1'),
      monitoringApi.getLatest<ApiRecord>('diesel2'),
      monitoringApi.getStatus<ApiRecord>('grid')
    ]);

    return {
      gridLatest,
      essLatest,
      pcsLatest,
      diesel1Latest,
      diesel2Latest,
      gridStatusList: Array.isArray(gridStatusList) ? gridStatusList : []
    };
  }
};
