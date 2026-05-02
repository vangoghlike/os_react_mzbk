import { monitoringApi } from '../../../../shared/api/monitoringApi';
import type { ApiRecord } from '../../../../shared/api/apiDataUtils';

export type SupportGenerationStatusResponse = {
  essLatest: ApiRecord;
  diesel1Latest: ApiRecord;
  diesel2Latest: ApiRecord;
  essStatusList: ApiRecord[];
  diesel1StatusList: ApiRecord[];
  diesel2StatusList: ApiRecord[];
};

/*
 * 필요: 보조 발전현황에서 쓰는 ESS, 디젤1, 디젤2 실 API를 한 번에 조회한다.
 * 연결: useSupportGenerationStatus, supportGenerationStatusAdapter.
 * 설명: 화면은 endpoint를 직접 알지 않고, 이 파일에서 API 조합만 관리한다.
 * 수정: 보조발전 구성이 바뀌면 Promise 목록과 adapter 매핑을 같이 조정한다.
 */
export const supportGenerationStatusApi = {
  async getStatus(): Promise<SupportGenerationStatusResponse> {
    const [essLatest, diesel1Latest, diesel2Latest, essStatusList, diesel1StatusList, diesel2StatusList] = await Promise.all([
      monitoringApi.getLatest<ApiRecord>('ess'),
      monitoringApi.getLatest<ApiRecord>('diesel1'),
      monitoringApi.getLatest<ApiRecord>('diesel2'),
      monitoringApi.getStatus<ApiRecord>('ess'),
      monitoringApi.getStatus<ApiRecord>('diesel1'),
      monitoringApi.getStatus<ApiRecord>('diesel2')
    ]);

    return {
      essLatest,
      diesel1Latest,
      diesel2Latest,
      essStatusList: Array.isArray(essStatusList) ? essStatusList : [],
      diesel1StatusList: Array.isArray(diesel1StatusList) ? diesel1StatusList : [],
      diesel2StatusList: Array.isArray(diesel2StatusList) ? diesel2StatusList : []
    };
  }
};
