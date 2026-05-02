import { apiClient } from '../../../../shared/api/apiClient';

type ApiScalar = string | number | null | undefined;

export type DashboardSummaryResponseDto = {
  esmtOperYmd?: ApiScalar;
  esmtOperTime?: ApiScalar;
  pcsOperStatus?: ApiScalar;
  pcsAtpTot?: ApiScalar;
  pcsFr?: ApiScalar;
  pcsDcP?: ApiScalar;
  batAvgSoc?: ApiScalar;
  batAvgSoh?: ApiScalar;
  dsl1AtpTot?: ApiScalar;
  dsl2AtpTot?: ApiScalar;
  baAtpTot?: ApiScalar;
  essAtpTot?: ApiScalar;
  essPlntSoc?: ApiScalar;
  acOperStuscd?: ApiScalar;
};

export type GridStatusResponseDto = {
  baPtpvL12?: ApiScalar;
  baPtpvL23?: ApiScalar;
  baPtpvL31?: ApiScalar;
  baPfrL1?: ApiScalar;
  baPfrL2?: ApiScalar;
  baPfrL3?: ApiScalar;
  baPaL1?: ApiScalar;
  baPaL2?: ApiScalar;
  baPaL3?: ApiScalar;
  baAtpTot?: ApiScalar;
  baRtpTot?: ApiScalar;
  baArpTot?: ApiScalar;
  baPfTot?: ApiScalar;
  baAtpDayAccm?: ApiScalar;
  baAtpTotAccm?: ApiScalar;
};

export type EssStatusResponseDto = {
  essPtpvL12?: ApiScalar;
  essPtpvL23?: ApiScalar;
  essPtpvL31?: ApiScalar;
  essPfrL1?: ApiScalar;
  essPfrL2?: ApiScalar;
  essPfrL3?: ApiScalar;
  essPaL1?: ApiScalar;
  essPaL2?: ApiScalar;
  essPaL3?: ApiScalar;
  essAtpTot?: ApiScalar;
  essRtpTot?: ApiScalar;
  essArpTot?: ApiScalar;
  essPfTot?: ApiScalar;
  essAtpDayAccm?: ApiScalar;
  essAtpTotAccm?: ApiScalar;
};

export type PcsStatusResponseDto = {
  pcsOperStatus?: ApiScalar;
  pcsMdlTemp?: ApiScalar;
  pcsAbntTemp?: ApiScalar;
  pcsCbntTemp?: ApiScalar;
  pcsPfTot?: ApiScalar;
  pcsAtpTot?: ApiScalar;
  pcsRtpTot?: ApiScalar;
  pcsArpTot?: ApiScalar;
  pcsPaL1?: ApiScalar;
  pcsPaL2?: ApiScalar;
  pcsPaL3?: ApiScalar;
  pcsFr?: ApiScalar;
  pcsPtpvL12?: ApiScalar;
  pcsPtpvL23?: ApiScalar;
  pcsPtpvL31?: ApiScalar;
  pcsAtpDayAccm?: ApiScalar;
  pcsAtpMonAccm?: ApiScalar;
  pcsDcP?: ApiScalar;
  pcsDcA?: ApiScalar;
  pcsDcV?: ApiScalar;
};

export type BatteryStatusResponseDto = {
  batAvgSoc?: ApiScalar;
  batAvgSoh?: ApiScalar;
  batMaxRakv?: ApiScalar;
  batAvgRakv?: ApiScalar;
  batMinRakv?: ApiScalar;
  batMaxRaka?: ApiScalar;
  batAvgRaka?: ApiScalar;
  batMinRaka?: ApiScalar;
  batMaxPaktmp?: ApiScalar;
  batAvgPaktmp?: ApiScalar;
  batMinPaktmp?: ApiScalar;
};

export type DieselStatusResponseDto = {
  dslPtpvL12?: ApiScalar;
  dslPtpvL23?: ApiScalar;
  dslPtpvL31?: ApiScalar;
  dslPfrL1?: ApiScalar;
  dslPfrL2?: ApiScalar;
  dslPfrL3?: ApiScalar;
  dslPaL1?: ApiScalar;
  dslPaL2?: ApiScalar;
  dslPaL3?: ApiScalar;
  dslAtpTot?: ApiScalar;
  dslRtpTot?: ApiScalar;
  dslArpTot?: ApiScalar;
  dslAtpDayAccm?: ApiScalar;
  dslAtpTotAccm?: ApiScalar;
  dslPfTot?: ApiScalar;
  dslEgnRpm?: ApiScalar;
  dslClntTmp?: ApiScalar;
  dslOilPrsr?: ApiScalar;
  dslOilTmp?: ApiScalar;
  dslFuelLvl?: ApiScalar;
};

export type AcStatusResponseDto = {
  acOperStuscd?: ApiScalar;
  acSuplyAirtmp?: ApiScalar;
  acRtnAirhum?: ApiScalar;
  acRtnAirtmp?: ApiScalar;
};

export type PlantOperationStatusLatestResponse = {
  dashboard: DashboardSummaryResponseDto;
  grid: GridStatusResponseDto;
  ess: EssStatusResponseDto;
  pcs: PcsStatusResponseDto;
  battery: BatteryStatusResponseDto;
  diesel1: DieselStatusResponseDto;
  diesel2: DieselStatusResponseDto;
  ac: AcStatusResponseDto;
};

/*
 * 필요: 발전소 운영현황에서 사용하는 monitoring 최신값 API를 한 번에 조회한다.
 * 연결: usePlantOperationStatus, plantOperationStatusAdapter.
 * 설명: 화면 컴포넌트에 endpoint가 흩어지지 않게 API 호출만 이 파일에 둔다.
 * 수정: PM API 문서에서 endpoint가 바뀌면 이 Promise 목록만 우선 확인한다.
 */
export const plantOperationStatusApi = {
  async getLatestStatus(): Promise<PlantOperationStatusLatestResponse> {
    const [dashboard, grid, ess, pcs, battery, diesel1, diesel2, ac] = await Promise.all([
      apiClient<DashboardSummaryResponseDto>('/monitoring/dashboard'),
      apiClient<GridStatusResponseDto>('/monitoring/grid/latest'),
      apiClient<EssStatusResponseDto>('/monitoring/ess/latest'),
      apiClient<PcsStatusResponseDto>('/monitoring/pcs/latest'),
      apiClient<BatteryStatusResponseDto>('/monitoring/battery/latest'),
      apiClient<DieselStatusResponseDto>('/monitoring/diesel1/latest'),
      apiClient<DieselStatusResponseDto>('/monitoring/diesel2/latest'),
      apiClient<AcStatusResponseDto>('/monitoring/ac/latest')
    ]);

    return { dashboard, grid, ess, pcs, battery, diesel1, diesel2, ac };
  }
};
