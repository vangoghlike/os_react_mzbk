import type { PcsChargeDischargeHistoryTableMock } from '../types/pcsChargeDischargeHistory';

/*
 * 필요: PCS 충방전 이력 상세 표 헤더와 행 데이터.
 * 연결: PcsChargeDischargeHistoryResultSection, BasicTable.
 * 설명: PCS 이력 표 컬럼은 mock에서만 관리해 section 수정 없이 바꾸게 한다.
 * 수정: 상세 컬럼과 시간별 row는 이 파일에서 조정한다.
 */
export const pcsChargeDischargeHistoryTableMock: PcsChargeDischargeHistoryTableMock = {
  ariaLabel: 'PCS 충방전 이력 상세 표',
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
