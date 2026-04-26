import type {
  BaseGenerationStatusChartMock,
  BaseGenerationStatusMetric,
  BaseGenerationStatusTableMock
} from '../types/baseGenerationStatus';

/*
 * 필요: 기저 발전현황 이미지가 별도 화면인지 비교할 수 있는 임시 mock.
 * 연결: BaseGenerationStatusScaffoldSection.
 * 설명: route 미연결 상태라 실제 메뉴 데이터로 사용하지 않는다.
 * 수정: 화면 확정 후 기존 기저발전 mock에 병합하거나 이 파일을 정식 mock으로 확장한다.
 */
export const baseGenerationStatusSummaryColumns = [
  'DC. P (kWh)',
  'AC.P ( Active ) (kWh)',
  'AC.P ( Reactive ) (kWh)',
  'PF (%)',
  'CHANGE EFFICIENT (%)',
  'DAILY ACCM.P ( Active ) (kWh)',
  'DAILY ACCM.P ( Reactive ) (kWh)'
];

export const baseGenerationStatusMetrics: BaseGenerationStatusMetric[] = [
  { label: '현재값', values: ['420', '390', '48', '0.95', '98.2', '8,420', '1,205'] }
];

export const baseGenerationStatusChartMock: BaseGenerationStatusChartMock = {
  labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00'],
  outputSeries: [420, 438, 412, 470, 455, 492, 480, 436, 394, 410],
  pfSeries: [0.89, 0.91, 0.87, 0.95, 0.92, 0.98, 0.96, 0.9, 0.84, 0.88]
};

export const baseGenerationStatusTableMock: BaseGenerationStatusTableMock = {
  ariaLabel: '기저 발전현황 상세 내역',
  minWidth: 1260,
  headerRows: [
    [
      { label: 'TIME', rowSpan: 2 },
      { label: 'POWER', colSpan: 4 },
      { label: 'ACTIVE.ACCM', colSpan: 4 },
      { label: 'REACTIVE.ACCM', colSpan: 4 }
    ],
    [
      { label: 'ACTIV' },
      { label: 'REACTIVE' },
      { label: 'APPARENT' },
      { label: 'PF' },
      { label: 'DAY' },
      { label: 'WEEK' },
      { label: 'MON' },
      { label: 'TOT' },
      { label: 'DAY' },
      { label: 'WEEK' },
      { label: 'MON' },
      { label: 'TOT' }
    ]
  ],
  rows: [
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
