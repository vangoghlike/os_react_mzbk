import type {
  PcsChargeDischargeChartMock,
  PcsChargeDischargeDistributionItem,
  PcsChargeDischargeSummaryMetric
} from '../types/pcsChargeDischargeStatus';

/*
 * 필요: PCS 충방전 상단 요약, 도넛, 충전/방전 차트 데이터.
 * 연결: PcsChargeDischargeSummarySection.
 * 설명: 충전과 방전 series를 같은 chart mock에서 관리해 차트 교체 지점을 고정한다.
 * 수정: 요약 컬럼, series, 범례값은 이 파일에서 조정한다.
 */
export const pcsChargeDischargeSummaryColumns = ['Total', 'IVT1'];

export const pcsChargeDischargeSummaryMetrics: PcsChargeDischargeSummaryMetric[] = [
  { label: '비중(%)', values: ['100.0', '100.0'] },
  { label: '발전량(kWh)', values: ['410', '410'] }
];

export const pcsChargeDischargeDistributionMock: PcsChargeDischargeDistributionItem[] = [
  { name: '충전 표시', value: 58 },
  { name: '방전 표시', value: 42 }
];

export const pcsChargeDischargeSummaryLegendLabels = ['충전 표시', '방전 표시'];

export const pcsChargeDischargeChartMock: PcsChargeDischargeChartMock = {
  labels: Array<string>(14).fill('00:00'),
  chargeSeries: [38, 0, 38, 38, 38, 28, 18, 0, 38, 38, 10, 5, 18, 0],
  dischargeSeries: [0, -12, -12, -30, -10, -10, -10, -12, 0, -12, 0, 0, -10, -7]
};
