import type { PcsChargeDischargeTableMock } from '../types/pcsChargeDischargeStatus';

/*
 * 필요: PCS 상세 표와 BATTERY 상세 표의 헤더/행 데이터.
 * 연결: PcsChargeDischargeTableSection, BasicTable.
 * 설명: 두 표의 컬럼 구조가 달라 각각의 mock 객체로 나눠 둔다.
 * 수정: PCS/BATTERY 컬럼명과 행 데이터는 이 파일에서 조정한다.
 */
export const pcsChargeDischargePcsTableMock: PcsChargeDischargeTableMock = {
  ariaLabel: 'PCS 충방전 ESS PCS 상세 내역',
  minWidth: 1380,
  headerRows: [
    [
      { label: 'TIME', rowSpan: 2 },
      { label: 'ESS PCS', colSpan: 4 },
      { label: 'ESS BATT', colSpan: 9 }
    ],
    [
      { label: 'OPER' },
      { label: 'AC A' },
      { label: 'AC V' },
      { label: 'AC P' },
      { label: 'OPER BSC' },
      { label: 'SoC (BSC)' },
      { label: 'SoH (BSC)' },
      { label: 'DC V (BSC)' },
      { label: 'DC A (BSC)' },
      { label: 'RACK (AVG) V' },
      { label: 'RACK (AVG) A' },
      { label: 'CELL (AVG) V' },
      { label: 'TEMP (AVG)' }
    ]
  ],
  rows: [
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};

export const pcsChargeDischargeBatteryTableMock: PcsChargeDischargeTableMock = {
  ariaLabel: 'PCS 충방전 BATTERY 상세 내역',
  minWidth: 1560,
  headerRows: [
    [
      { label: 'TIME', rowSpan: 3 },
      { label: 'RACK', colSpan: 8 },
      { label: 'CELL', colSpan: 8 },
      { label: 'PACK', colSpan: 2 }
    ],
    [
      { label: 'V', colSpan: 4 },
      { label: 'A', colSpan: 4 },
      { label: 'V', colSpan: 4 },
      { label: 'A', colSpan: 4 },
      { label: 'TEMP', colSpan: 2 }
    ],
    [
      { label: 'MAX' },
      { label: 'MIN' },
      { label: 'MAX #' },
      { label: 'MIN #' },
      { label: 'MAX' },
      { label: 'MIN' },
      { label: 'MAX #' },
      { label: 'MIN #' },
      { label: 'MAX' },
      { label: 'MIN' },
      { label: 'MAX #' },
      { label: 'MIN #' },
      { label: 'MAX' },
      { label: 'MIN' },
      { label: 'MAX #' },
      { label: 'MIN #' },
      { label: 'MAX' },
      { label: 'MAX #' }
    ]
  ],
  rows: [
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
