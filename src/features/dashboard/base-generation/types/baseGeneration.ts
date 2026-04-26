import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

/*
 * 필요: 기저발전 mock과 section이 공유하는 화면 view model 타입.
 * 연결: baseGeneration summary/chart/table mock, BaseGeneration section 컴포넌트.
 * 설명: 보조발전과 같은 구조로 summary, trend chart, 상세 표 계약을 나눠 API 교체 위치를 맞춘다.
 * 수정: 컬럼/series/장비 옵션 구조가 바뀔 때만 이 파일을 수정한다.
 */
export type BaseGenerationSummaryMetric = {
  label: string;
  values: string[];
};

export type BaseGenerationChartDatum = {
  value: number;
  name: string;
};

export type BaseGenerationTrendChartMock = {
  labels: string[];
  totalOutputSeries: number[];
  lineSeries: number[];
};

export type BaseGenerationDetailTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};

export type BaseGenerationEquipmentDetailTableMock = BaseGenerationDetailTableMock & {
  equipmentOptions: {
    label: string;
    value: string;
  }[];
  defaultEquipmentValue: string;
  defaultExpanded: boolean;
};
