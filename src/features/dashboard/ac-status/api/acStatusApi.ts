import { monitoringApi } from '../../../../shared/api/monitoringApi';
import type { ApiScalar } from '../../../../shared/api/apiDataUtils';

export type AcStatusResponseDto = {
  esmtOperYmd?: ApiScalar;
  esmtOperTime?: ApiScalar;
  acOperStuscd?: ApiScalar;
  acSuplyAirtmp?: ApiScalar;
  acRtnAirtmp?: ApiScalar;
  acRtnAirhum?: ApiScalar;
};

export type AcStatusResponse = {
  latest: AcStatusResponseDto | null;
  statusList: AcStatusResponseDto[];
};

/*
 * 필요: 공조기 현황 화면에서 사용하는 monitoring/ac API를 분리한다.
 * 연결: useAcStatus, acStatusAdapter.
 * 설명: 대시보드와 같은 화면을 재사용하지 않고 공조기 latest/status만 조회한다.
 * 수정: 공조기 필드가 추가되면 DTO 타입과 adapter만 확장한다.
 */
export const acStatusApi = {
  async getStatus(): Promise<AcStatusResponse> {
    const [latest, statusList] = await Promise.all([
      monitoringApi.getLatest<AcStatusResponseDto>('ac'),
      monitoringApi.getStatus<AcStatusResponseDto>('ac')
    ]);

    return { latest, statusList };
  }
};
