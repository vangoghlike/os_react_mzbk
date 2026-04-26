import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: 기저 발전현황 확인용 표, 차트, 지표 타입.
 * 연결: baseGenerationStatusMock, BaseGenerationStatusScaffoldSection.
 * 설명: 별도 화면 확정 전까지 스캐폴딩 전용 계약으로 유지한다.
 * 수정: 정식 화면 전환 시 API 대응 view model에 맞춰 재정리한다.
 */
export type BaseGenerationStatusMetric = {
  label: string;
  values: string[];
};

export type BaseGenerationStatusChartMock = {
  labels: string[];
  outputSeries: number[];
  pfSeries: number[];
};

export type BaseGenerationStatusTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
