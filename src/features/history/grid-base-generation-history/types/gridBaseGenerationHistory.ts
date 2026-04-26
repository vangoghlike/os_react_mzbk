import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: GRID 기저발전 이력 검색, 지표, 차트, 표 mock 계약.
 * 연결: gridBaseGenerationHistory mock 파일들과 section 컴포넌트.
 * 설명: 조회 API 없이 퍼블리싱 상태를 재현하기 위한 view model이다.
 * 수정: 검색 모드나 지표명이 바뀌면 이 파일 타입부터 맞춘다.
 */
export type GridBaseGenerationHistoryMode = 'Year' | 'Month' | 'Duration';

export type GridBaseGenerationHistoryMetric = 'Max kWh' | 'Min kWh' | 'AVG kWh';

export type GridBaseGenerationHistoryFilterMock = {
  modes: readonly GridBaseGenerationHistoryMode[];
  defaultMode: GridBaseGenerationHistoryMode;
  defaultStartDate: string;
  defaultEndDate: string;
};

export type GridBaseGenerationHistoryChartMock = {
  labels: string[];
  barSeriesByMetric: Record<GridBaseGenerationHistoryMetric, number[]>;
  lineSeriesByMetric: Record<GridBaseGenerationHistoryMetric, number[]>;
};

export type GridBaseGenerationHistoryTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
