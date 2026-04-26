import type { BaseGenerationDetailTableMock, BaseGenerationEquipmentDetailTableMock } from '../types/baseGeneration';

const baseGenerationPowerTimes = ['00:00', '01:00', '02:00', '03:00'];
const baseGenerationInverterTimes = ['00:00', '01:00', '02:00', '03:00'];
const baseGenerationPowerRows = baseGenerationPowerTimes.map((time) => [time, ...Array<string>(21).fill('')]);
const baseGenerationInverterRows = baseGenerationInverterTimes.map((time) => [time, ...Array<string>(17).fill('')]);

/*
 * 필요: 기저발전 운전 상세 표와 인버터 상세 표의 헤더, 행, 장비 선택 기본값.
 * 연결: BaseGenerationTableSection의 BasicTable rows.
 * 설명: 보조발전 table mock처럼 표 계약을 객체로 묶어 컴포넌트 수정 없이 컬럼을 바꾼다.
 * 수정: 인버터 장비명, 표 컬럼, 빈 행은 이 파일에서 조정한다.
 */
export const baseGenerationPowerTableMock: BaseGenerationDetailTableMock = {
  ariaLabel: '기저발전 운전 상세 현황',
  minWidth: 1760,
  headerRows: [
    [
      { label: 'Time', rowSpan: 2 },
      { label: 'IVT 1 (kWh)', colSpan: 3 },
      { label: 'IVT 2 (kWh)', colSpan: 3 },
      { label: 'IVT 3 (kWh)', colSpan: 3 },
      { label: 'IVT 4(kWh)', colSpan: 3 },
      { label: 'IVT 5 (kWh)', colSpan: 3 },
      { label: 'IVT 6(kWh)', colSpan: 3 },
      { label: 'IVT 7(kWh)', colSpan: 3 }
    ],
    [
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' },
      { label: 'DC' },
      { label: 'AC' },
      { label: '효율(%)' }
    ]
  ],
  rows: baseGenerationPowerRows
};

export const baseGenerationInverterTableMock: BaseGenerationEquipmentDetailTableMock = {
  ariaLabel: '기저발전 인버터 상세 내역',
  minWidth: 1880,
  defaultExpanded: true,
  defaultEquipmentValue: 'inverter-1',
  equipmentOptions: [{ label: 'Inverter #1', value: 'inverter-1' }],
  headerRows: [
    [
      { label: 'Time', rowSpan: 3 },
      { label: 'DC', colSpan: 3 },
      { label: 'AC', colSpan: 13 },
      { label: 'PF', rowSpan: 3 }
    ],
    [
      { label: 'P', rowSpan: 2 },
      { label: 'V', rowSpan: 2 },
      { label: 'A', rowSpan: 2 },
      { label: 'P', colSpan: 4 },
      { label: 'V', colSpan: 3 },
      { label: 'A', colSpan: 3 },
      { label: 'Frequency', colSpan: 3 }
    ],
    [
      { label: 'TOT' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' },
      { label: 'L12' },
      { label: 'L23' },
      { label: 'L32' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' },
      { label: 'L1' },
      { label: 'L2' },
      { label: 'L3' }
    ]
  ],
  rows: baseGenerationInverterRows
};
