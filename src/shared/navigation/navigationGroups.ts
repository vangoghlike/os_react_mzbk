export type NavigationItem = {
  label: string;
  path: string;
  iconSrc: string;
  iconAlt: string;
};

export type NavigationGroup = {
  key: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
  items: NavigationItem[];
};

import { commonIconSources } from '../assets/icons/commonIconSources';

export const navigationGroups: NavigationGroup[] = [
  {
    key: 'operation-status',
    label: '운영 현황',
    iconSrc: commonIconSources.operationStatus.src,
    iconAlt: commonIconSources.operationStatus.alt,
    items: [
      {
        label: '발전소 운영현황',
        path: '/dashboard/plant-operation-status',
        iconSrc: commonIconSources.plantOperation.src,
        iconAlt: commonIconSources.plantOperation.alt
      },
      {
        label: '기저발전',
        path: '/dashboard/base-generation',
        iconSrc: commonIconSources.baseGeneration.src,
        iconAlt: commonIconSources.baseGeneration.alt
      },
      {
        label: '보조발전',
        path: '/dashboard/support-generation',
        iconSrc: commonIconSources.supportGeneration.src,
        iconAlt: commonIconSources.supportGeneration.alt
      },
      {
        label: '충방전 현황',
        path: '/dashboard/charge-discharge',
        iconSrc: commonIconSources.chargeDischarge.src,
        iconAlt: commonIconSources.chargeDischarge.alt
      },
      {
        label: '전력 소비 현황',
        path: '/dashboard/power-consumption-status',
        iconSrc: commonIconSources.powerConsumption.src,
        iconAlt: commonIconSources.powerConsumption.alt
      }
    ]
  },
  {
    key: 'operation-history',
    label: '운영 이력',
    iconSrc: commonIconSources.operationHistory.src,
    iconAlt: commonIconSources.operationHistory.alt,
    items: [
      {
        label: 'GRID 기저발전 이력',
        path: '/history/grid-base-generation-history',
        iconSrc: commonIconSources.gridHistory.src,
        iconAlt: commonIconSources.gridHistory.alt
      },
      {
        label: '보조발전 이력',
        path: '/history/support-generation-history',
        iconSrc: commonIconSources.supportHistory.src,
        iconAlt: commonIconSources.supportHistory.alt
      },
      {
        label: 'PCS 충방전 이력',
        path: '/history/pcs-charge-discharge-history',
        iconSrc: commonIconSources.pcsHistory.src,
        iconAlt: commonIconSources.pcsHistory.alt
      },
      {
        label: '전력소비 이력',
        path: '/history/power-consumption-history',
        iconSrc: commonIconSources.powerHistory.src,
        iconAlt: commonIconSources.powerHistory.alt
      }
    ]
  },
  {
    key: 'operation-report',
    label: '운영 리포트',
    iconSrc: commonIconSources.operationReport.src,
    iconAlt: commonIconSources.operationReport.alt,
    items: [
      {
        label: '운영 리포트',
        path: '/reports/operation',
        iconSrc: commonIconSources.operationDetail.src,
        iconAlt: commonIconSources.operationDetail.alt
      }
    ]
  },
  {
    key: 'admin-management',
    label: '관리자 화면',
    iconSrc: commonIconSources.adminManagement.src,
    iconAlt: commonIconSources.adminManagement.alt,
    items: [
      {
        label: '마스터 관리',
        path: '/admin/master',
        iconSrc: commonIconSources.masterManagement.src,
        iconAlt: commonIconSources.masterManagement.alt
      },
      {
        label: '코드 관리',
        path: '/admin/code',
        iconSrc: commonIconSources.codeManagement.src,
        iconAlt: commonIconSources.codeManagement.alt
      },
      {
        label: '사용자 관리',
        path: '/admin/user',
        iconSrc: commonIconSources.userManagement.src,
        iconAlt: commonIconSources.userManagement.alt
      },
      {
        label: '권한 관리',
        path: '/admin/role',
        iconSrc: commonIconSources.roleManagement.src,
        iconAlt: commonIconSources.roleManagement.alt
      }
    ]
  },
  {
    key: 'system-samples',
    label: '시스템 샘플',
    iconSrc: commonIconSources.systemSamples.src,
    iconAlt: commonIconSources.systemSamples.alt,
    items: [
      {
        label: '팝업 샘플',
        path: '/system/popups',
        iconSrc: commonIconSources.popupSamples.src,
        iconAlt: commonIconSources.popupSamples.alt
      }
    ]
  }
];
