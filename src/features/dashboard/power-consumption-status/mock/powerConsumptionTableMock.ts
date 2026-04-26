import type { PowerConsumptionTableMock } from '../types/powerConsumptionStatus';

/*
 * 필요: 전력 소비 상세 표와 BANK 상세 표의 헤더/행 데이터.
 * 연결: PowerConsumptionTableSection, BasicTable.
 * 설명: 넓은 표라 minWidth를 mock 계약에 포함해 반응형 깨짐을 줄인다.
 * 수정: 상세 컬럼과 row 값은 이 파일에서 조정한다.
 */
export const powerConsumptionTableMock: PowerConsumptionTableMock = {
  ariaLabel: '전력 소비 현황 상세 내역',
  minWidth: 1680,
  headerRows: [
    [
      { label: 'TIME', rowSpan: 2 },
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
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};

export const powerConsumptionBankTableMock: PowerConsumptionTableMock = {
  ariaLabel: '전력 소비 현황 BANK 상세 내역',
  minWidth: 1420,
  headerRows: [
    [
      { label: 'TIME', rowSpan: 2 },
      { label: 'BANK 1', colSpan: 3 },
      { label: 'BANK 2', colSpan: 4 },
      { label: 'BANK 3', colSpan: 3 },
      { label: 'BANK 4', colSpan: 3 },
      { label: 'BANK 5', colSpan: 3 }
    ],
    [
      { label: 'TOTAL' },
      { label: '3P' },
      { label: '1P' },
      { label: 'TOTAL' },
      { label: '3P' },
      { label: '1P' },
      { label: 'PE' },
      { label: 'TOTAL' },
      { label: '3P' },
      { label: '1P' },
      { label: 'TOTAL' },
      { label: '3P' },
      { label: '1P' },
      { label: 'TOTAL' },
      { label: '3P' },
      { label: '1P' }
    ]
  ],
  rows: [
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
