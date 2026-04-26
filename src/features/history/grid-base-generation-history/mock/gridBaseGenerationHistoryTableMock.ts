import type { GridBaseGenerationHistoryTableMock } from '../types/gridBaseGenerationHistory';

/*
 * 필요: GRID 기저발전 이력 상세 표 헤더와 행 데이터.
 * 연결: GridBaseGenerationHistoryResultSection, BasicTable.
 * 설명: 설계서 확정 전에도 표 컬럼 수정 위치가 보이도록 mock에 분리한다.
 * 수정: 이력 표 컬럼과 날짜별 row는 이 파일에서 조정한다.
 */
export const gridBaseGenerationHistoryTableMock: GridBaseGenerationHistoryTableMock = {
  ariaLabel: 'GRID 기저발전 이력 상세 표',
  minWidth: 1280,
  headerRows: [
    [
      { label: 'DATE', rowSpan: 2 },
      { label: 'POWER', colSpan: 4 },
      { label: 'ACTIVE.ACCM', colSpan: 4 },
      { label: 'REACTIVE.ACCM', colSpan: 4 }
    ],
    [
      { label: 'ACTIVE' },
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
    ['2026.01.01', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.02', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.03', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
