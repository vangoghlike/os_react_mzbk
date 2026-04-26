import type { PcsChargeDischargeHistoryChartMock } from '../types/pcsChargeDischargeHistory';

/*
 * 필요: PCS 충방전 이력의 시간 축과 지표별 충전/방전 series.
 * 연결: PcsChargeDischargeHistoryResultSection.
 * 설명: 탭별로 charge/discharge series를 나눠 화면 상태만 바꾸게 한다.
 * 수정: 시간 라벨과 지표별 series는 이 파일에서 조정한다.
 */
export const pcsChargeDischargeHistoryChartMock: PcsChargeDischargeHistoryChartMock = {
  labels: [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00'
  ],
  chargeSeriesByMetric: {
    'Max kWh': [38, 0, 38, 38, 38, 28, 18, 0, 38, 38, 10, 5, 18, 0],
    'Min kWh': [18, 0, 20, 21, 19, 15, 8, 0, 18, 19, 4, 2, 8, 0],
    'AVG kWh': [28, 0, 29, 30, 29, 21, 13, 0, 28, 29, 7, 4, 13, 0],
    'Max D kWh': [38, 0, 38, 38, 38, 28, 18, 0, 38, 38, 10, 5, 18, 0],
    'Min D kWh': [18, 0, 20, 21, 19, 15, 8, 0, 18, 19, 4, 2, 8, 0],
    'AVG D kWh': [28, 0, 29, 30, 29, 21, 13, 0, 28, 29, 7, 4, 13, 0]
  },
  dischargeSeriesByMetric: {
    'Max kWh': [0, -12, -12, -30, -10, -10, -10, -12, 0, -12, 0, 0, -10, -7],
    'Min kWh': [0, -5, -6, -14, -4, -5, -4, -5, 0, -5, 0, 0, -4, -3],
    'AVG kWh': [0, -8, -9, -22, -7, -8, -7, -9, 0, -8, 0, 0, -7, -5],
    'Max D kWh': [0, -12, -12, -30, -10, -10, -10, -12, 0, -12, 0, 0, -10, -7],
    'Min D kWh': [0, -5, -6, -14, -4, -5, -4, -5, 0, -5, 0, 0, -4, -3],
    'AVG D kWh': [0, -8, -9, -22, -7, -8, -7, -9, 0, -8, 0, 0, -7, -5]
  }
};
