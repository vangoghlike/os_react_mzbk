import type { BaseGenerationTrendChartMock } from '../types/baseGeneration';

/*
 * 필요: 기저발전 하단 시간대별 차트에 쓰는 라벨/series.
 * 연결: BaseGenerationSummarySection의 ECharts option.
 * 설명: 보조발전 trend mock과 같은 객체 구조로 맞춰 section의 데이터 접근 방식을 통일한다.
 * 수정: 시간 축, 막대 series, 꺾은선 series는 이 객체만 교체한다.
 */
export const baseGenerationTrendChartMock: BaseGenerationTrendChartMock = {
  labels: Array<string>(15).fill('00:00'),
  totalOutputSeries: [420, 438, 412, 470, 455, 492, 480, 436, 394, 410, 435, 421, 474, 479, 508],
  lineSeries: [260, 302, 232, 382, 320, 548, 492, 298, 180, 252, 300, 274, 395, 395, 522]
};
