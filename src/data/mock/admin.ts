export type RegistryRow = {
  id: string;
  name: string;
  location: string;
  status: string;
};

export const plantRows: RegistryRow[] = [
  { id: 'PLANT-001', name: 'Mozambique Plant A', location: 'Maputo', status: '운영중' },
  { id: 'PLANT-002', name: 'Mozambique Plant B', location: 'Tete', status: '대기' }
];

export const pcsRows: RegistryRow[] = [
  { id: 'PCS-001', name: 'PCS Unit #1', location: 'Block A', status: '운영중' },
  { id: 'PCS-002', name: 'PCS Unit #2', location: 'Block B', status: '점검중' }
];

export const inverterRowsAdmin: RegistryRow[] = [
  { id: 'IVT-001', name: 'Invertor #1', location: 'Bank #1', status: '운영중' },
  { id: 'IVT-002', name: 'Invertor #2', location: 'Bank #2', status: '운영중' }
];

export const batteryRowsAdmin: RegistryRow[] = [
  { id: 'BAT-001', name: 'Battery Rack #1', location: 'Storage A', status: '운영중' },
  { id: 'BAT-002', name: 'Battery Rack #2', location: 'Storage B', status: '점검중' }
];

export const dieselRows: RegistryRow[] = [
  { id: 'DSL-001', name: 'Diesel #1', location: 'Generator Zone', status: '운영중' },
  { id: 'DSL-002', name: 'Diesel #2', location: 'Generator Zone', status: '대기' }
];

export const codeGroups = [
  { id: 'SYSTEM_CODE', name: 'SYSTEM Code', deleted: false },
  { id: 'EMS_SYSTEM', name: 'EMS 시스템', deleted: false },
  { id: 'DEVICE_STATUS', name: 'Device Status', deleted: true }
];

export const codeDetails = [
  { id: 'RUN', name: '운영중', description: '정상 가동 상태', useYn: 'Y' },
  { id: 'STOP', name: '정지', description: '가동 중지 상태', useYn: 'Y' },
  { id: 'FAULT', name: '고장', description: '장애 상태', useYn: 'Y' }
];

export const usersByRole = {
  'SYSTEM ADMIN': [
    { id: 'admin', name: '총괄관리자', corporation: 'NuriFlex' },
    { id: 'admin02', name: '운영관리자', corporation: 'NuriFlex' }
  ],
  'SYSTEM MONITOR': [
    { id: 'monitor01', name: '모니터요원', corporation: 'Client' }
  ],
  'PLANT MANAGER': [
    { id: 'plant01', name: '발전소장', corporation: 'Mozambique Plant' }
  ]
} as const;

export const privilegeTree = [
  {
    menu: 'EMS 시스템',
    children: ['기저발전', '보조발전', '충방전 현황']
  },
  {
    menu: '운영 리포트',
    children: ['Daily Report', 'Weekly Report', 'Monthly Report', 'Yearly Report']
  },
  {
    menu: '관리자',
    children: ['마스터 관리', '코드 관리', '사용자 관리', '권한 관리']
  }
];
