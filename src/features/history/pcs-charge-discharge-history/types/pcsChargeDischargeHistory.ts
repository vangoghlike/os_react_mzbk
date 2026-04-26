import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: PCS 충방전 이력 검색, 지표, 차트, 표 mock 계약.
 * 연결: pcsChargeDischargeHistory mock 파일들과 section 컴포넌트.
 * 설명: 실제 이력 조회 전까지 화면 표시용 타입만 관리한다.
 * 수정: 지표명이나 충전/방전 series 구조가 바뀔 때 이 파일을 수정한다.
 */
export type PcsChargeDischargeHistoryMode = 'Year' | 'Month' | 'Duration';

export type PcsChargeDischargeHistoryMetric =
  | 'Max kWh'
  | 'Min kWh'
  | 'AVG kWh'
  | 'Max D kWh'
  | 'Min D kWh'
  | 'AVG D kWh';

export type PcsChargeDischargeHistoryFilterMock = {
  modes: readonly PcsChargeDischargeHistoryMode[];
  defaultMode: PcsChargeDischargeHistoryMode;
  defaultStartDate: string;
  defaultEndDate: string;
};

export type PcsChargeDischargeHistoryChartMock = {
  labels: string[];
  chargeSeriesByMetric: Record<PcsChargeDischargeHistoryMetric, number[]>;
  dischargeSeriesByMetric: Record<PcsChargeDischargeHistoryMetric, number[]>;
};

export type PcsChargeDischargeHistoryTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
