import type { SupportGenerationHistoryTableMock } from '../types/supportGenerationHistory';

/*
 * 필요: 보조발전 이력 상세 표 헤더와 행 데이터.
 * 연결: SupportGenerationHistoryResultSection, BasicTable, ExcelSaveButton.
 * 설명: PPT의 Diesel/Battery/PCS 계열 이력 표를 API 교체 가능한 mock으로 분리한다.
 * 수정: 컬럼 확정 시 headerRows와 rows만 수정한다.
 */
export const supportGenerationHistoryTableMock: SupportGenerationHistoryTableMock = {
  ariaLabel: '보조발전 이력 상세 표',
  minWidth: 1560,
  headerRows: [
    [
      { label: 'DATE', rowSpan: 2 },
      { label: 'Diesel #1', colSpan: 5 },
      { label: 'Diesel #2', colSpan: 5 },
      { label: 'PCS (Discharge)', colSpan: 4 },
      { label: 'Battery', colSpan: 3 }
    ],
    [
      { label: 'P TOT' },
      { label: 'P L1' },
      { label: 'P L2' },
      { label: 'P L3' },
      { label: 'PF' },
      { label: 'P TOT' },
      { label: 'P L1' },
      { label: 'P L2' },
      { label: 'P L3' },
      { label: 'PF' },
      { label: 'P TOT' },
      { label: 'P L1' },
      { label: 'P L2' },
      { label: 'P L3' },
      { label: 'SoC' },
      { label: 'SoH' },
      { label: 'D.Accm' }
    ]
  ],
  rows: [
    ['2026.01.01', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.02', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2026.01.03', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
