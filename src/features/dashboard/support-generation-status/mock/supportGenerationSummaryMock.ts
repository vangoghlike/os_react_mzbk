import type { SupportGenerationDistributionItem, SupportGenerationSummaryMetric } from '../types/supportGenerationStatus';

/*
 * 필요: 보조 발전현황 상단 요약 표와 도넛 차트 데이터.
 * 연결: SupportGenerationSummarySection.
 * 설명: Diesel, Battery 기준 컬럼과 범례를 mock으로 분리해 section을 얇게 둔다.
 * 수정: 요약 컬럼, 비중, 발전량, 범례명은 이 파일에서 조정한다.
 */
export const supportGenerationSummaryColumns = ['Total', 'Diesel #1', 'Diesel #2', 'Battery D.Charge'];

export const supportGenerationSummaryMetrics: SupportGenerationSummaryMetric[] = [
  { label: '발전비중(%)', values: ['100.0', '36.8', '33.5', '29.7'] },
  { label: '발전량(kWh)', values: ['5,360', '1,972', '1,796', '1,592'] }
];

export const supportGenerationDistributionChartMock: SupportGenerationDistributionItem[] = [
  { name: '그래프 명1', value: 34 },
  { name: '그래프 명2', value: 48 },
  { name: '그래프 명3', value: 18 }
];

export const supportGenerationSummaryLegendLabels = ['그래프 명1', '그래프 명2', '그래프 명3'];
