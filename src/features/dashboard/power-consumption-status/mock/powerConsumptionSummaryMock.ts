import type { PowerConsumptionDistributionItem, PowerConsumptionSummaryMetric } from '../types/powerConsumptionStatus';

/*
 * 필요: 전력 소비 현황 상단 BANK 요약과 도넛 차트 데이터.
 * 연결: PowerConsumptionSummarySection.
 * 설명: BANK 컬럼과 요약 수치를 mock에 둬 화면 컴포넌트는 배치만 담당한다.
 * 수정: 수요비중, 수요량, 범례명은 이 파일에서 조정한다.
 */
export const powerConsumptionSummaryColumns = ['Total', 'BANK 1', 'BANK 2', 'BANK 3', 'BANK 4', 'BANK 5'];

export const powerConsumptionSummaryMetrics: PowerConsumptionSummaryMetric[] = [
  { label: '수요비중(%)', values: ['100.0', '18.6', '20.1', '19.4', '21.0', '20.9'] },
  { label: '수요량(kWh)', values: ['7,860', '1,462', '1,580', '1,525', '1,650', '1,643'] }
];

export const powerConsumptionDistributionMock: PowerConsumptionDistributionItem[] = [
  { name: '그래프 명1', value: 34 },
  { name: '그래프 명2', value: 48 },
  { name: '그래프 명3', value: 18 }
];

export const powerConsumptionSummaryLegendLabels = ['그래프 명1', '그래프 명2', '그래프 명3'];
