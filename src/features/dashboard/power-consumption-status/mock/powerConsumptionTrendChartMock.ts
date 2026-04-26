import type { PowerConsumptionTrendChartMock } from '../types/powerConsumptionStatus';

/*
 * 필요: 전력 소비 현황 시간대별 소비량과 PF 차트 데이터.
 * 연결: PowerConsumptionSummarySection의 ECharts option.
 * 설명: 실제 수요 데이터 연결 전까지 labels와 series만 mock으로 유지한다.
 * 수정: 시간 축, 수요량, PF 값은 이 파일에서 조정한다.
 */
export const powerConsumptionTrendChartMock: PowerConsumptionTrendChartMock = {
  labels: Array<string>(15).fill('00:00'),
  totalDemandSeries: [420, 438, 412, 470, 455, 492, 480, 436, 394, 410, 435, 421, 474, 479, 508],
  pfSeries: [0.89, 0.91, 0.87, 0.95, 0.92, 0.98, 0.96, 0.9, 0.84, 0.88, 0.91, 0.89, 0.95, 0.95, 0.99]
};
