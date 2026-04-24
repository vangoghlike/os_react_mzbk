function createIconDataUri(fill: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2" fill="${fill}" stroke="#EAF2FF" stroke-opacity="0.68" stroke-width="1.2"/><path d="M5 6H11" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/><path d="M5 8.5H11" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/><path d="M5 11H8.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const commonIconSources = {
  operationStatus: {
    src: createIconDataUri('#56B2FF'),
    alt: '운영 현황 아이콘'
  },
  operationReport: {
    src: createIconDataUri('#6C8CFF'),
    alt: '운영 리포트 아이콘'
  },
  adminManagement: {
    src: createIconDataUri('#7E95FF'),
    alt: '관리자 화면 아이콘'
  },
  systemSamples: {
    src: createIconDataUri('#4FC8C0'),
    alt: '시스템 샘플 아이콘'
  },
  baseGeneration: {
    src: createIconDataUri('#9AB2FF'),
    alt: '기저발전 아이콘'
  },
  supportGeneration: {
    src: createIconDataUri('#A7BFFF'),
    alt: '보조발전 아이콘'
  },
  chargeDischarge: {
    src: createIconDataUri('#B7C5FF'),
    alt: '충방전 현황 아이콘'
  },
  operationDetail: {
    src: createIconDataUri('#7DA4FF'),
    alt: '운영 리포트 상세 아이콘'
  },
  masterManagement: {
    src: createIconDataUri('#8FA8FF'),
    alt: '마스터 관리 아이콘'
  },
  codeManagement: {
    src: createIconDataUri('#8FA8FF'),
    alt: '코드 관리 아이콘'
  },
  userManagement: {
    src: createIconDataUri('#8FA8FF'),
    alt: '사용자 관리 아이콘'
  },
  roleManagement: {
    src: createIconDataUri('#8FA8FF'),
    alt: '권한 관리 아이콘'
  },
  popupSamples: {
    src: createIconDataUri('#72C2FF'),
    alt: '팝업 샘플 아이콘'
  },
  excelSave: {
    src: createIconDataUri('#58C88A'),
    alt: '엑셀 저장 아이콘'
  }
} as const;
