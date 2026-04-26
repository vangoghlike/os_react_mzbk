import type { BaseGenerationChartDatum, BaseGenerationSummaryMetric } from '../types/baseGeneration';

/*
 * 필요: 기저발전 상단 요약 표와 도넛 차트 데이터.
 * 연결: BaseGenerationSummarySection, SummaryMatrix.
 * 설명: 보조발전 summary mock과 같은 구조로 컬럼, 지표, 도넛, 범례를 한곳에서 관리한다.
 * 수정: 요약 컬럼, 비중, 발전량, 범례명은 이 파일에서 조정한다.
 */
export const baseGenerationSummaryColumns = ['Total', 'IVT1', 'IVT2', 'IVT3', 'IVT4', 'IVT5', 'IVT6', 'IVT7'];

export const baseGenerationSummaryMetrics: BaseGenerationSummaryMetric[] = [
  { label: '발전비중(%)', values: ['100.0', '13.4', '14.2', '14.0', '13.8', '14.1', '15.2', '15.3'] },
  { label: '발전량(kWh)', values: ['8,420', '1,140', '1,180', '1,176', '1,165', '1,181', '1,276', '1,302'] }
];

export const baseGenerationSummaryLegendLabels = ['그래프 명1', '그래프 명2'];

export const baseGenerationDistributionChartMock: BaseGenerationChartDatum[] = [
  { value: 34, name: '그래프 명1' },
  { value: 66, name: '그래프 명2' }
];
