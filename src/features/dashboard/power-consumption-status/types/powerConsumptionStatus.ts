import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: 전력 소비 현황 요약, 차트, 표 mock 계약.
 * 연결: powerConsumption mock 파일들과 section 컴포넌트.
 * 설명: API 응답 연결 전까지 화면 표시용 타입만 둔다.
 * 수정: BANK 컬럼이나 series 구조가 바뀔 때 이 파일을 수정한다.
 */
export type PowerConsumptionSummaryMetric = {
  label: string;
  values: string[];
};

export type PowerConsumptionDistributionItem = {
  name: string;
  value: number;
};

export type PowerConsumptionTrendChartMock = {
  labels: string[];
  totalDemandSeries: number[];
  pfSeries: number[];
};

export type PowerConsumptionTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
