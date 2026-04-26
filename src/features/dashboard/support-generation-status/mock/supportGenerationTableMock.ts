import type { SupportGenerationDetailTableMock } from '../types/supportGenerationStatus';

/*
 * 필요: 보조 발전현황 상세 표 헤더, 행, 장비 선택 기본값.
 * 연결: SupportGenerationDetailTableSection, BasicTable, EquipmentSelect.
 * 설명: 다중 헤더와 장비 옵션을 mock에 둬 컴포넌트 수정 없이 컬럼을 바꾼다.
 * 수정: Diesel 장비명, 표 컬럼, 빈 행은 이 파일에서 조정한다.
 */
export const supportGenerationTableMock: SupportGenerationDetailTableMock = {
  ariaLabel: '보조 발전현황 디젤 상세 내역',
  minWidth: 1620,
  defaultExpanded: true,
  defaultEquipmentValue: 'diesel-1',
  equipmentOptions: [
    { label: 'Diesel #1', value: 'diesel-1' },
    { label: 'Diesel #2', value: 'diesel-2' }
  ],
  headerRows: [
    [
      { label: 'TIME', rowSpan: 3 },
      { label: 'Diesel #1', colSpan: 5 },
      { label: 'Diesel #2', colSpan: 5 },
      { label: 'PCS ( Discharge )', colSpan: 8 }
    ],
    [
      { label: 'P', colSpan: 4 },
      { label: 'PF', rowSpan: 2 },
      { label: 'P', colSpan: 4 },
      { label: 'PF', rowSpan: 2 },
      { label: 'P', colSpan: 4 },
      { label: 'PE', colSpan: 4 }
    ],
    [
      { label: 'TOT' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' },
      { label: 'TOT' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' },
      { label: 'TOT' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' },
      { label: 'TOT' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' }
    ]
  ],
  rows: [
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['00:00', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ]
};
