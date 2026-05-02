import { monitoringApi } from '../../../../shared/api/monitoringApi';
import type { ApiRecord } from '../../../../shared/api/apiDataUtils';

export type PcsChargeDischargeStatusResponse = {
  pcsLatest: ApiRecord;
  batteryLatest: ApiRecord;
  pcsStatusList: ApiRecord[];
  batteryStatusList: ApiRecord[];
};

/*
 * 필요: PCS 충방전 화면에서 쓰는 PCS/Battery 실 API를 묶어서 조회한다.
 * 연결: usePcsChargeDischargeStatus, pcsChargeDischargeStatusAdapter.
 * 설명: 페이지는 endpoint를 직접 호출하지 않고 이 API 조합만 사용한다.
 * 수정: PCS와 Battery가 별도 화면으로 분리되면 이 조합 기준을 먼저 나눈다.
 */
export const pcsChargeDischargeStatusApi = {
  async getStatus(): Promise<PcsChargeDischargeStatusResponse> {
    const [pcsLatest, batteryLatest, pcsStatusList, batteryStatusList] = await Promise.all([
      monitoringApi.getLatest<ApiRecord>('pcs'),
      monitoringApi.getLatest<ApiRecord>('battery'),
      monitoringApi.getStatus<ApiRecord>('pcs'),
      monitoringApi.getStatus<ApiRecord>('battery')
    ]);

    return {
      pcsLatest,
      batteryLatest,
      pcsStatusList: Array.isArray(pcsStatusList) ? pcsStatusList : [],
      batteryStatusList: Array.isArray(batteryStatusList) ? batteryStatusList : []
    };
  }
};
