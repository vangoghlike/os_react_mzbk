import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: PCS 충방전 요약, 차트, 표 mock 계약.
 * 연결: pcsChargeDischarge mock 파일들과 section 컴포넌트.
 * 설명: 실제 PCS 조회 전까지 퍼블리싱 view model만 정의한다.
 * 수정: 충전/방전 series나 상세 표 구조가 바뀔 때 이 파일을 수정한다.
 */
export type PcsChargeDischargeSummaryMetric = {
  label: string;
  values: string[];
};

export type PcsChargeDischargeDistributionItem = {
  name: string;
  value: number;
};

export type PcsChargeDischargeChartMock = {
  labels: string[];
  chargeSeries: number[];
  dischargeSeries: number[];
};

export type PcsChargeDischargeTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
