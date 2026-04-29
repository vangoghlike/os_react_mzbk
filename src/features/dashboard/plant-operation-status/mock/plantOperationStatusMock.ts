import type { PlantOperationStatusData } from '../types/plantOperationStatus';

/*
 * 필요: 발전소 운영현황 화면에 표시할 조회값 mock.
 * 연결: PlantOperationDiagramSection, 현황판 기준 constants.
 * 설명: 이 파일에는 값과 라벨만 두고 배치 기준, 칸 단위, 선 연결 규칙은 constants에서 관리한다.
 * 수정: 실제 데이터 형태가 바뀌면 이 파일의 값 구조만 우선 맞춘다.
 */
export const plantOperationStatusMock: PlantOperationStatusData = {
  banks: [
    {
      id: 'bank-1',
      name: 'Bank #1',
      rows: [
        { label: 'kW', status: '126.4', dAccm: '1,248.2' },
        { label: 'PF', status: '0.98', dAccm: '98.1%' }
      ]
    },
    {
      id: 'bank-2',
      name: 'Bank #2',
      rows: [
        { label: 'kW', status: '119.8', dAccm: '1,192.7' },
        { label: 'PF', status: '0.97', dAccm: '97.4%' }
      ]
    },
    {
      id: 'bank-3',
      name: 'Bank #3',
      rows: [
        { label: 'kW', status: '132.1', dAccm: '1,312.5' },
        { label: 'PF', status: '0.99', dAccm: '98.8%' }
      ]
    },
    {
      id: 'bank-4',
      name: 'Bank #4',
      rows: [
        { label: 'kW', status: '121.6', dAccm: '1,205.9' },
        { label: 'PF', status: '0.96', dAccm: '96.9%' }
      ]
    },
    {
      id: 'bank-5',
      name: 'Bank #5',
      rows: [
        { label: 'kW', status: '117.3', dAccm: '1,178.4' },
        { label: 'PF', status: '0.97', dAccm: '97.2%' }
      ]
    }
  ],
  topAuxiliaryTables: [
    {
      id: 'air-conditioner',
      title: 'A/C 상태',
      placement: 'bank-collector-left',
      rows: [
        { label: 'A/C 상태', value: '정상' },
        { label: 'A/C 배출공기 온도', value: '24.8℃' },
        { label: '온도(℃)', value: '22.6℃' },
        { label: '습도(%)', value: '46%' }
      ]
    }
  ],
  btb: {
    id: 'main-btb',
    nodeLabel: 'AGC-BTB',
    pf: '98.6%',
    rows: [
      { label: 'P ( kW)( A/R/P)', value: '124/18/142' },
      { label: 'V ( V )(L12/L23/31)', value: '389/391/388' },
      { label: 'A ( A )(L1/L2/L3)', value: '182/179/181' },
      { label: 'FR ( Hz )(L1/L2/L3)', value: '60.0/60.0/60.0' }
    ]
  },
  solar: {
    id: 'solar-agc',
    nodeLabel: 'AGC-Solar',
    pf: '99.1%',
    rows: [
      { label: 'P ( kW)( A/R/P)', value: '88/12/100' },
      { label: 'V ( V )(L12/L23/31)', value: '386/387/385' },
      { label: 'A ( A )(L1/L2/L3)', value: '121/118/119' },
      { label: 'FR ( Hz )(L1/L2/L3)', value: '60.0/60.0/60.0' }
    ]
  },
  storageBtb: {
    id: 'storage-btb',
    nodeLabel: 'AGC-BTB',
    pf: '97.8%',
    rows: [
      { label: 'P ( kW)( A/R/P)', value: '54/8/62' },
      { label: 'V ( V )(L12/L23/31)', value: '381/382/380' },
      { label: 'A ( A )(L1/L2/L3)', value: '80/77/79' },
      { label: 'FR ( Hz )(L1/L2/L3)', value: '60.0/60.0/60.0' }
    ]
  },
  pcs: {
    id: 'pcs',
    nodeLabel: 'PCS',
    rows: [
      { label: 'STATUS', value: 'Charge' },
      { label: 'DC V', value: '721.5' },
      { label: 'DC A', value: '68.2' },
      { label: 'MDL.T(℃)', value: '32.1℃' },
      { label: 'ABNT.T (℃)', value: '28.4℃' },
      { label: 'CABN.T (℃)', value: '30.7℃' }
    ]
  },
  battery: {
    id: 'battery',
    nodeLabel: '배터리',
    summary: [
      { label: 'SoC(%)', value: '72.8' },
      { label: 'SoH(%)', value: '98.2' }
    ],
    groups: [
      {
        title: 'RACK V',
        metrics: [
          { label: 'MAX', value: '731.2' },
          { label: 'MIN', value: '714.8' },
          { label: 'AVG', value: '723.5' }
        ]
      },
      {
        title: 'RACK A',
        metrics: [
          { label: 'MAX', value: '71.4' },
          { label: 'MIN', value: '64.2' },
          { label: 'AVG', value: '68.2' }
        ]
      },
      {
        title: 'PACK Temp',
        metrics: [
          { label: 'MAX', value: '33.2℃' },
          { label: 'MIN', value: '28.6℃' },
          { label: 'AVG', value: '30.4℃' }
        ]
      }
    ]
  },
  generators: [
    {
      id: 'diesel-1',
      agcLabel: 'AGC-GEN',
      equipmentLabel: '디젤 #01',
      rows: [
        { label: 'P', value: '210.4 kW' },
        { label: 'V', value: '389 V' },
        { label: 'A', value: '312 A' },
        { label: 'PF', value: '0.96' },
        { label: 'Freq', value: '60.0 Hz' },
        { label: 'RPM', value: '1,800' },
        { label: 'FUEL', value: '68%' },
        { label: 'CoolTmp', value: '82℃' },
        { label: 'OilTmp', value: '74℃' },
        { label: 'OilPres', value: '4.6 bar' }
      ]
    },
    {
      id: 'diesel-2',
      agcLabel: 'AGC-GEN',
      equipmentLabel: '디젤 #02',
      rows: [
        { label: 'P', value: '198.7 kW' },
        { label: 'V', value: '388 V' },
        { label: 'A', value: '299 A' },
        { label: 'PF', value: '0.95' },
        { label: 'Freq', value: '60.0 Hz' },
        { label: 'RPM', value: '1,798' },
        { label: 'FUEL', value: '63%' },
        { label: 'CoolTmp', value: '80℃' },
        { label: 'OilTmp', value: '73℃' },
        { label: 'OilPres', value: '4.4 bar' }
      ]
    }
  ],
  inverters: [
    { id: 'ivt-1', label: 'IVT #01' },
    { id: 'ivt-2', label: 'IVT #02' },
    { id: 'ivt-3', label: 'IVT #03' },
    { id: 'ivt-4', label: 'IVT #04' },
    { id: 'ivt-5', label: 'IVT #05' },
    { id: 'ivt-6', label: 'IVT #06' },
    { id: 'ivt-7', label: 'IVT #07' }
  ]
};
