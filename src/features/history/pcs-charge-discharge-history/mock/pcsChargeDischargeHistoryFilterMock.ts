import type {
  PcsChargeDischargeHistoryFilterMock,
  PcsChargeDischargeHistoryMetric
} from '../types/pcsChargeDischargeHistory';

/*
 * 필요: PCS 충방전 이력 검색 모드와 충전/방전 지표 탭 목록.
 * 연결: PcsChargeDischargeHistorySearchSection, MetricTabs.
 * 설명: 화면별 기본 조건은 mock에 두고 공통 검색바는 표시만 담당한다.
 * 수정: 기본 조회 모드와 탭명은 이 파일에서 조정한다.
 */
export const pcsChargeDischargeHistoryFilterMock: PcsChargeDischargeHistoryFilterMock = {
  modes: ['Year', 'Month', 'Duration'],
  defaultMode: 'Month',
  defaultStartDate: '2026.01.01',
  defaultEndDate: '2026.01.15'
};

export const pcsChargeDischargeHistoryMetricTabsMock = [
  'Max kWh',
  'Min kWh',
  'AVG kWh',
  'Max D kWh',
  'Min D kWh',
  'AVG D kWh'
] as const satisfies readonly PcsChargeDischargeHistoryMetric[];
