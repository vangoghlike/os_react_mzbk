import type { PlantOperationBankStatus, PlantOperationPanel } from '../types/plantOperationStatus';

/*
 * 필요: 발전소 운영현황 토폴로지 화면의 BANK, AGC, PCS, 배터리 표시 데이터.
 * 연결: PlantOperationDiagramSection.
 * 설명: 실제 API 연결 전까지 설비별 상태값과 누적값을 mock view model로 분리한다.
 * 수정: 설비명, 상태값, 표시 행은 이 파일에서만 조정한다.
 */
export const plantOperationBankStatusMock: PlantOperationBankStatus[] = [
  { name: 'Bank #1', status: 'Standby', dAccm: '0.0 kWh', kw: '0.0', pf: '0.00' },
  { name: 'Bank #2', status: 'Standby', dAccm: '0.0 kWh', kw: '0.0', pf: '0.00' },
  { name: 'Bank #3', status: 'Standby', dAccm: '0.0 kWh', kw: '0.0', pf: '0.00' },
  { name: 'Bank #4', status: 'Standby', dAccm: '0.0 kWh', kw: '0.0', pf: '0.00' },
  { name: 'Bank #5', status: 'Standby', dAccm: '0.0 kWh', kw: '0.0', pf: '0.00' }
];

export const plantOperationAirConditionerMock: PlantOperationPanel = {
  title: 'A/C',
  rows: [
    { label: 'A/C 상태', value: '-' },
    { label: 'A/C 배출공기 온도', value: '-' },
    { label: '온도(℃)', value: '-' },
    { label: '습도(%)', value: '-' }
  ]
};

export const plantOperationBtbMock: PlantOperationPanel = {
  title: 'AGC-BTB',
  rows: [
    { label: 'P ( kW )( A/R/P )', value: '00/00/00' },
    { label: 'V ( V )(L12/L23/31)', value: '00/00/00' },
    { label: 'A ( A )(L1/L2/L3)', value: '00/00/00' },
    { label: 'FR ( Hz )(L1/L2/L3)', value: '00/00/00' },
    { label: 'PF(%)', value: '00.0%' }
  ]
};

export const plantOperationSolarMock: PlantOperationPanel = {
  title: 'AGC-Solar',
  rows: [
    { label: 'P ( kW )( A/R/P )', value: '00/00/00' },
    { label: 'V ( V )(L12/L23/31)', value: '00/00/00' },
    { label: 'A ( A )(L1/L2/L3)', value: '00/00/00' },
    { label: 'FR ( Hz )(L1/L2/L3)', value: '00/00/00' },
    { label: 'PF(%)', value: '00.0%' }
  ]
};

export const plantOperationPcsMock: PlantOperationPanel = {
  title: 'PCS',
  rows: [
    { label: 'STATUS', value: '-' },
    { label: 'DC V', value: '-' },
    { label: 'DC A', value: '-' },
    { label: 'MDL.T(℃)', value: '-' },
    { label: 'ABNT.T (℃)', value: '-' },
    { label: 'CABN.T (℃)', value: '-' }
  ]
};

export const plantOperationBatteryMock: PlantOperationPanel = {
  title: '배터리',
  rows: [
    { label: 'SoC(%)', value: '-' },
    { label: 'SoH(%)', value: '-' },
    { label: 'RACK V MAX / MIN / AVG', value: '- / - / -' },
    { label: 'RACK A MAX / MIN / AVG', value: '- / - / -' },
    { label: 'PACK Temp MAX / MIN / AVG', value: '- / - / -' }
  ]
};

export const plantOperationInverterLabelsMock = ['IVT #01', 'IVT #02', 'IVT #03', 'IVT #04', 'IVT #05', 'IVT #06', 'IVT #07'];
