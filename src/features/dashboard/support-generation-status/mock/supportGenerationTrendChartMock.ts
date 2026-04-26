import type { SupportGenerationTrendChartMock } from '../types/supportGenerationStatus';

/*
 * 필요: 보조 발전현황 시간대별 발전량 차트 데이터.
 * 연결: SupportGenerationSummarySection의 trend ECharts option.
 * 설명: bar/line series를 한 파일에 모아 API 응답 교체 위치를 고정한다.
 * 수정: 시간 축과 발전량 series는 이 객체만 교체한다.
 */
export const supportGenerationTrendChartMock: SupportGenerationTrendChartMock = {
  labels: Array<string>(15).fill('00:00'),
  totalOutputSeries: [420, 438, 412, 470, 455, 492, 480, 436, 394, 410, 435, 421, 474, 479, 508],
  batteryOutputSeries: [120, 128, 118, 138, 132, 150, 146, 133, 112, 124, 132, 120, 146, 149, 158],
  dieselOutputSeries: [300, 310, 294, 332, 323, 342, 334, 303, 282, 286, 303, 301, 328, 330, 350]
};
