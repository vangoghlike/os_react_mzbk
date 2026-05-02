export type NavigationItem = {
  label: string;
  path: string;
  matchPaths?: string[];
  iconSrc: string;
  iconAlt: string;
  source?: 'api' | 'fallback' | 'sample' | 'supplemental';
};

export type NavigationGroup = {
  key: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
  items: NavigationItem[];
  source?: 'api' | 'fallback' | 'sample' | 'supplemental';
};

import { commonIconSources } from '../assets/icons/commonIconSources';

export const productionNavigationGroups: NavigationGroup[] = [
  {
    key: 'monitoring',
    label: '모니터링',
    iconSrc: commonIconSources.operationStatus.src,
    iconAlt: commonIconSources.operationStatus.alt,
    source: 'fallback',
    items: [
      {
        label: '대시보드',
        path: '/monitoring/dashboard',
        matchPaths: ['/dashboard/plant-operation-status'],
        iconSrc: commonIconSources.plantOperation.src,
        iconAlt: commonIconSources.plantOperation.alt,
        source: 'fallback'
      },
      {
        label: 'PCS현황',
        path: '/monitoring/pcs',
        matchPaths: ['/dashboard/charge-discharge'],
        iconSrc: commonIconSources.chargeDischarge.src,
        iconAlt: commonIconSources.chargeDischarge.alt,
        source: 'fallback'
      },
      {
        label: '배터리현황',
        path: '/monitoring/battery',
        matchPaths: ['/dashboard/charge-discharge'],
        iconSrc: commonIconSources.chargeDischarge.src,
        iconAlt: commonIconSources.chargeDischarge.alt,
        source: 'fallback'
      },
      {
        label: '디젤1현황',
        path: '/monitoring/diesel1',
        matchPaths: ['/dashboard/support-generation'],
        iconSrc: commonIconSources.supportGeneration.src,
        iconAlt: commonIconSources.supportGeneration.alt,
        source: 'fallback'
      },
      {
        label: '디젤2현황',
        path: '/monitoring/diesel2',
        matchPaths: ['/dashboard/support-generation'],
        iconSrc: commonIconSources.supportGeneration.src,
        iconAlt: commonIconSources.supportGeneration.alt,
        source: 'fallback'
      },
      {
        label: 'GRID현황',
        path: '/monitoring/grid',
        matchPaths: ['/dashboard/base-generation'],
        iconSrc: commonIconSources.baseGeneration.src,
        iconAlt: commonIconSources.baseGeneration.alt,
        source: 'fallback'
      },
      {
        label: 'ESS현황',
        path: '/monitoring/ess',
        matchPaths: ['/dashboard/support-generation'],
        iconSrc: commonIconSources.supportGeneration.src,
        iconAlt: commonIconSources.supportGeneration.alt,
        source: 'fallback'
      },
      {
        label: '공조기현황',
        path: '/monitoring/ac',
        matchPaths: ['/dashboard/ac-status'],
        iconSrc: commonIconSources.acStatus.src,
        iconAlt: commonIconSources.acStatus.alt,
        source: 'fallback'
      }
    ]
  },
  {
    key: 'operation-history',
    label: '운영 이력',
    iconSrc: commonIconSources.operationHistory.src,
    iconAlt: commonIconSources.operationHistory.alt,
    source: 'fallback',
    items: [
      {
        label: 'GRID이력',
        path: '/history/grid',
        matchPaths: ['/history/grid-base-generation-history'],
        iconSrc: commonIconSources.gridHistory.src,
        iconAlt: commonIconSources.gridHistory.alt,
        source: 'fallback'
      },
      {
        label: 'ESS이력',
        path: '/history/ess',
        matchPaths: ['/history/support-generation-history'],
        iconSrc: commonIconSources.supportHistory.src,
        iconAlt: commonIconSources.supportHistory.alt,
        source: 'fallback'
      },
      {
        label: 'PCS이력',
        path: '/history/pcs',
        matchPaths: ['/history/pcs-charge-discharge-history'],
        iconSrc: commonIconSources.pcsHistory.src,
        iconAlt: commonIconSources.pcsHistory.alt,
        source: 'fallback'
      },
      {
        label: '전력소비 이력',
        path: '/history/power-consumption',
        matchPaths: ['/history/power-consumption-history'],
        iconSrc: commonIconSources.powerHistory.src,
        iconAlt: commonIconSources.powerHistory.alt,
        source: 'fallback'
      }
    ]
  }
];

export const sampleNavigationGroups: NavigationGroup[] = [
  {
    key: 'operation-report',
    label: '운영 리포트',
    iconSrc: commonIconSources.operationReport.src,
    iconAlt: commonIconSources.operationReport.alt,
    source: 'sample',
    items: [
      {
        label: '운영 리포트',
        path: '/reports/operation',
        iconSrc: commonIconSources.operationDetail.src,
        iconAlt: commonIconSources.operationDetail.alt,
        source: 'sample'
      }
    ]
  },
  {
    key: 'admin-management',
    label: '관리자 화면',
    iconSrc: commonIconSources.adminManagement.src,
    iconAlt: commonIconSources.adminManagement.alt,
    source: 'sample',
    items: [
      {
        label: '마스터 관리',
        path: '/admin/master',
        iconSrc: commonIconSources.masterManagement.src,
        iconAlt: commonIconSources.masterManagement.alt,
        source: 'sample'
      },
      {
        label: '코드 관리',
        path: '/admin/code',
        iconSrc: commonIconSources.codeManagement.src,
        iconAlt: commonIconSources.codeManagement.alt,
        source: 'sample'
      },
      {
        label: '사용자 관리',
        path: '/admin/user',
        iconSrc: commonIconSources.userManagement.src,
        iconAlt: commonIconSources.userManagement.alt,
        source: 'sample'
      },
      {
        label: '권한 관리',
        path: '/admin/role',
        iconSrc: commonIconSources.roleManagement.src,
        iconAlt: commonIconSources.roleManagement.alt,
        source: 'sample'
      }
    ]
  },
  {
    key: 'system-samples',
    label: '시스템 샘플',
    iconSrc: commonIconSources.systemSamples.src,
    iconAlt: commonIconSources.systemSamples.alt,
    source: 'sample',
    items: [
      {
        label: '팝업 샘플',
        path: '/system/popups',
        iconSrc: commonIconSources.popupSamples.src,
        iconAlt: commonIconSources.popupSamples.alt,
        source: 'sample'
      }
    ]
  }
];

// 백엔드 메뉴에 아직 없는 이력 화면만 API 메뉴와 분리해 별도 보조 그룹으로 유지한다.
export const supplementalNavigationGroups: NavigationGroup[] = productionNavigationGroups
  .filter((group) => group.key === 'operation-history')
  .map((group) => ({
    ...group,
    key: `supplemental-${group.key}`,
    source: 'supplemental',
    items: group.items.map((item) => ({
      ...item,
      source: 'supplemental'
    }))
  }));

export const navigationGroups: NavigationGroup[] = [...productionNavigationGroups, ...sampleNavigationGroups];
