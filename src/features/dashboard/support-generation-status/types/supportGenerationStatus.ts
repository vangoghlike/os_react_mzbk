import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: 보조 발전현황 요약, 차트, 상세 표 mock 계약.
 * 연결: supportGeneration mock 파일들과 section 컴포넌트.
 * 설명: API 응답이 생기면 이 타입 모양에 맞춘 view model로 교체한다.
 * 수정: 컬럼/series/장비 옵션 구조가 바뀔 때 이 파일을 수정한다.
 */
export type SupportGenerationSummaryMetric = {
  label: string;
  values: string[];
};

export type SupportGenerationDistributionItem = {
  name: string;
  value: number;
};

export type SupportGenerationTrendChartMock = {
  labels: string[];
  totalOutputSeries: number[];
  batteryOutputSeries: number[];
  dieselOutputSeries: number[];
};

export type SupportGenerationDetailTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
  equipmentOptions: {
    label: string;
    value: string;
  }[];
  defaultEquipmentValue: string;
  defaultExpanded: boolean;
};
