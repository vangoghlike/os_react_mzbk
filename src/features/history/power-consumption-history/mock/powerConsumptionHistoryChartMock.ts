import type { PowerConsumptionHistoryChartMock } from '../types/powerConsumptionHistory';

/*
 * 필요: 전력소비 이력 차트의 날짜 축과 지표별 총 사용량/BANK 평균 series.
 * 연결: PowerConsumptionHistoryResultSection.
 * 설명: PPT의 전력소비 이력 그래프 구조를 mock 데이터 기반으로 재현한다.
 * 수정: 날짜 라벨과 지표별 값은 이 파일에서 조정한다.
 */
export const powerConsumptionHistoryChartMock: PowerConsumptionHistoryChartMock = {
  labels: [
    '2026.01.01',
    '2026.01.02',
    '2026.01.03',
    '2026.01.04',
    '2026.01.05',
    '2026.01.06',
    '2026.01.07',
    '2026.01.08',
    '2026.01.09',
    '2026.01.10',
    '2026.01.11',
    '2026.01.12'
  ],
  totalSeriesByMetric: {
    'Max kWh': [520, 545, 510, 575, 560, 598, 590, 548, 520, 535, 568, 582],
    'Min kWh': [340, 360, 326, 386, 370, 405, 398, 354, 332, 348, 372, 386],
    'AVG kWh': [430, 452, 418, 480, 465, 502, 494, 451, 426, 441, 470, 484]
  },
  bankAverageSeriesByMetric: {
    'Max kWh': [104, 109, 102, 115, 112, 120, 118, 110, 104, 107, 114, 116],
    'Min kWh': [68, 72, 65, 77, 74, 81, 80, 71, 66, 70, 74, 77],
    'AVG kWh': [86, 90, 84, 96, 93, 100, 99, 90, 85, 88, 94, 97]
  }
};
