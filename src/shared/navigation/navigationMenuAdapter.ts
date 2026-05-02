import type { AuthSessionMenu } from '../../features/auth/session/types/authSession';
import { commonIconSources } from '../assets/icons/commonIconSources';
import {
  navigationGroups,
  productionNavigationGroups,
  sampleNavigationGroups,
  supplementalNavigationGroups,
  type NavigationGroup,
  type NavigationItem
} from './navigationGroups';

const knownNavigationPaths = new Set(navigationGroups.flatMap((group) => group.items.map((item) => item.path)));

const apiRouteAliases: Record<string, string> = {
  '/monitoring/dashboard': '/dashboard/plant-operation-status',
  '/monitoring/grid': '/dashboard/base-generation',
  '/monitoring/ess': '/dashboard/support-generation',
  '/monitoring/diesel1': '/dashboard/support-generation',
  '/monitoring/diesel2': '/dashboard/support-generation',
  '/monitoring/pcs': '/dashboard/charge-discharge',
  '/monitoring/battery': '/dashboard/charge-discharge',
  '/monitoring/ac': '/dashboard/ac-status',
  '/system/roles': '/admin/role',
  '/system/users': '/admin/user',
  '/system/codes': '/admin/code',
  '/system/menus': '/admin/role',
  '/master/plants': '/admin/master',
  '/master/pcs': '/admin/master',
  '/master/inverters': '/admin/master',
  '/master/batteries': '/admin/master',
  '/master/diesels': '/admin/master',
  '/report/pcs': '/reports/operation',
  '/report/battery': '/reports/operation',
  '/report/diesel1': '/reports/operation',
  '/report/diesel2': '/reports/operation',
  '/report/grid': '/reports/operation',
  '/report/ess': '/reports/operation',
  '/report/ac': '/reports/operation',
  '/excel': '/reports/operation'
};

const labelRouteRules: Array<{ includes: string[]; path: string }> = [
  { includes: ['발전소', '운영'], path: '/dashboard/plant-operation-status' },
  { includes: ['기저', '이력'], path: '/history/grid-base-generation-history' },
  { includes: ['기저'], path: '/dashboard/base-generation' },
  { includes: ['보조', '이력'], path: '/history/support-generation-history' },
  { includes: ['보조'], path: '/dashboard/support-generation' },
  { includes: ['충방전', '이력'], path: '/history/pcs-charge-discharge-history' },
  { includes: ['충방전'], path: '/dashboard/charge-discharge' },
  { includes: ['전력', '이력'], path: '/history/power-consumption-history' },
  { includes: ['전력'], path: '/dashboard/power-consumption-status' },
  { includes: ['공조'], path: '/dashboard/ac-status' },
  { includes: ['리포트'], path: '/reports/operation' },
  { includes: ['마스터'], path: '/admin/master' },
  { includes: ['코드'], path: '/admin/code' },
  { includes: ['사용자'], path: '/admin/user' },
  { includes: ['권한'], path: '/admin/role' },
  { includes: ['팝업'], path: '/system/popups' }
];

function hasNestedChildren(menus: AuthSessionMenu[]) {
  return menus.some((menu) => (menu.children?.length ?? 0) > 0);
}

function buildMenuTree(menus: AuthSessionMenu[]) {
  if (hasNestedChildren(menus)) {
    return menus;
  }

  const menuMap = new Map<string, AuthSessionMenu>();
  const rootMenus: AuthSessionMenu[] = [];

  menus.forEach((menu) => {
    menuMap.set(menu.sysMenuId, { ...menu, children: [] });
  });

  menuMap.forEach((menu) => {
    if (menu.sysUprmenuId && menuMap.has(menu.sysUprmenuId)) {
      menuMap.get(menu.sysUprmenuId)?.children?.push(menu);
      return;
    }

    rootMenus.push(menu);
  });

  return rootMenus.map((menu) => ({
    ...menu,
    children: menu.children && menu.children.length > 0 ? sortMenus(menu.children) : undefined
  }));
}

function sortMenus(menus: AuthSessionMenu[]) {
  return [...menus].sort((a, b) => a.sortOrd - b.sortOrd || a.menuNm.localeCompare(b.menuNm, 'ko'));
}

function getNormalizedMenuPath(menu: AuthSessionMenu) {
  const rawPath = menu.menuUrl?.trim();
  return rawPath ? (rawPath.startsWith('/') ? rawPath : `/${rawPath}`) : '';
}

function resolveMenuPath(menu: AuthSessionMenu) {
  const normalizedPath = getNormalizedMenuPath(menu);

  if (knownNavigationPaths.has(normalizedPath)) {
    return { path: normalizedPath };
  }

  const aliasPath = apiRouteAliases[normalizedPath];
  if (aliasPath) {
    return {
      path: normalizedPath,
      matchPaths: [aliasPath]
    };
  }

  const routeRule = labelRouteRules.find((rule) => rule.includes.every((keyword) => menu.menuNm.includes(keyword)));
  return routeRule ? { path: routeRule.path } : undefined;
}

function createMenuKey(prefix: string, value: string) {
  return `${prefix}-${value}`.replace(/[^a-zA-Z0-9가-힣-]/g, '-').replace(/-+/g, '-');
}

function getGroupIcon(label: string, firstPath?: string) {
  if (label.includes('이력') || firstPath?.startsWith('/history')) {
    return commonIconSources.operationHistory;
  }

  if (label.includes('리포트') || firstPath?.startsWith('/reports')) {
    return commonIconSources.operationReport;
  }

  if (label.includes('엑셀') || firstPath?.startsWith('/excel')) {
    return commonIconSources.excelSave;
  }

  if (label.includes('관리') || firstPath?.startsWith('/admin')) {
    return commonIconSources.adminManagement;
  }

  if (label.includes('샘플') || firstPath?.startsWith('/system')) {
    return commonIconSources.systemSamples;
  }

  return commonIconSources.operationStatus;
}

function getItemIcon(label: string, path: string) {
  if (path.includes('grid-base-generation-history')) return commonIconSources.gridHistory;
  if (path.includes('support-generation-history')) return commonIconSources.supportHistory;
  if (path.includes('pcs-charge-discharge-history')) return commonIconSources.pcsHistory;
  if (path.includes('power-consumption-history')) return commonIconSources.powerHistory;
  if (path.includes('plant-operation') || label.includes('발전소')) return commonIconSources.plantOperation;
  if (path.includes('ac-status') || label.includes('공조')) return commonIconSources.acStatus;
  if (path.includes('base-generation') || label.includes('기저')) return commonIconSources.baseGeneration;
  if (path.includes('support-generation') || label.includes('보조')) return commonIconSources.supportGeneration;
  if (path.includes('charge-discharge') || label.includes('충방전')) return commonIconSources.chargeDischarge;
  if (path.includes('power-consumption') || label.includes('전력')) return commonIconSources.powerConsumption;
  if (path.includes('reports')) return commonIconSources.operationDetail;
  if (path.includes('excel')) return commonIconSources.excelSave;
  if (path.includes('master')) return commonIconSources.masterManagement;
  if (path.includes('code')) return commonIconSources.codeManagement;
  if (path.includes('user')) return commonIconSources.userManagement;
  if (path.includes('role')) return commonIconSources.roleManagement;
  if (path.includes('popups')) return commonIconSources.popupSamples;

  return commonIconSources.operationStatus;
}

function toNavigationItem(menu: AuthSessionMenu): NavigationItem | null {
  const resolvedPath = resolveMenuPath(menu);

  if (!resolvedPath) {
    return null;
  }

  const { path, matchPaths } = resolvedPath;
  const icon = getItemIcon(menu.menuNm, path);
  return {
    label: menu.menuNm,
    path,
    matchPaths,
    iconSrc: icon.src,
    iconAlt: icon.alt,
    source: 'api'
  };
}

function toNavigationGroup(menu: AuthSessionMenu): NavigationGroup | null {
  const items = sortMenus(menu.children ?? [])
    .map((childMenu) => toNavigationItem(childMenu))
    .filter((item): item is NavigationItem => Boolean(item));

  const ownItem = toNavigationItem(menu);
  const groupItems = items.length > 0 ? items : ownItem ? [ownItem] : [];

  if (groupItems.length === 0) {
    return null;
  }

  const icon = getGroupIcon(menu.menuNm, groupItems[0]?.path);
  return {
    key: createMenuKey('api', menu.sysMenuId || menu.menuNm),
    label: menu.menuNm,
    iconSrc: icon.src,
    iconAlt: icon.alt,
    items: groupItems,
    source: 'api'
  };
}

function removeDuplicateSampleItems(baseGroups: NavigationGroup[]) {
  const activePaths = new Set(baseGroups.flatMap((group) => group.items.flatMap((item) => [item.path, ...(item.matchPaths ?? [])])));

  return sampleNavigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !activePaths.has(item.path))
    }))
    .filter((group) => group.items.length > 0);
}

function getSupplementalGroups(baseGroups: NavigationGroup[]) {
  if (baseGroups.length === 0) {
    return [];
  }

  // API 메뉴에 없는 퍼블리싱 확인용 화면은 중복 제거하지 않고 별도 그룹으로 유지한다.
  return supplementalNavigationGroups;
}

/*
 * 필요: /me/menus 응답을 사이드바 렌더링 데이터로 변환한다.
 * 연결: AuthSessionProvider, Sidebar, navigationGroups.
 * 설명: API 메뉴가 있으면 API를 우선하고, 초기 로딩/권한 미응답 동안은 화면 확인용 기본 메뉴를 유지한다.
 * 수정: 백엔드 메뉴 URL이나 명칭이 확정되면 labelRouteRules만 보정하면 된다.
 */
export function getNavigationGroups(sessionMenus: AuthSessionMenu[]) {
  const apiGroups = sortMenus(buildMenuTree(sessionMenus))
    .map((menu) => toNavigationGroup(menu))
    .filter((group): group is NavigationGroup => Boolean(group));
  const baseGroups = apiGroups.length > 0 ? apiGroups : productionNavigationGroups;
  const supplementalGroups = apiGroups.length > 0 ? getSupplementalGroups(baseGroups) : [];
  const sampleGroups = removeDuplicateSampleItems([...baseGroups, ...supplementalGroups]);

  return [...baseGroups, ...supplementalGroups, ...sampleGroups];
}
