import type { PowerConsumptionHistoryTableMock } from '../types/powerConsumptionHistory';

/*
 * 필요: 전력소비 이력 상세 표 헤더와 행 데이터.
 * 연결: PowerConsumptionHistoryResultSection, BasicTable, ExcelSaveButton.
 * 설명: BANK별 전력 사용량 컬럼을 mock에 두어 API 응답으로 바꾸기 쉽게 한다.
 * 수정: BANK 컬럼 확정 시 headerRows와 rows만 수정한다.
 */
export const powerConsumptionHistoryTableMock: PowerConsumptionHistoryTableMock = {
  ariaLabel: '전력소비 이력 상세 표',
  minWidth: 1560,
  headerRows: [
    [
      { label: 'DATE', rowSpan: 2 },
      { label: 'Gen', rowSpan: 2 },
      { label: 'TOTAL', colSpan: 2 },
      { label: 'USE Rate (%)', rowSpan: 2 },
      { label: 'BANK 1', colSpan: 3 },
      { label: 'BANK 2', colSpan: 3 },
      { label: 'BANK 3', colSpan: 3 },
      { label: 'BANK 4', colSpan: 3 },
      { label: 'BANK 5', colSpan: 3 }
    ],
    [
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'PF' },
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'PF' },
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'PF' },
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'PF' },
      { label: 'Active' },
      { label: 'Reactive' },
      { label: 'PF' }
    ]
  ],
  rows: [
    ['2026.01.01', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.02', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.03', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
