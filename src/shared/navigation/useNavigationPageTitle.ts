import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthSession } from '../../features/auth/session/AuthSessionProvider';
import { getNavigationGroups } from './navigationMenuAdapter';

type TitleCandidate = {
  label: string;
  score: number;
  pathLength: number;
  matchedByAlias: boolean;
};

const routeTitleFallbacks: Record<string, string> = {
  '/login': '로그인',
  '/dashboard/plant-operation-status': '발전소 운영현황',
  '/dashboard/base-generation': '기저발전',
  '/dashboard/support-generation': '보조 발전현황',
  '/dashboard/charge-discharge': '충방전 현황',
  '/dashboard/power-consumption-status': '전력 소비 현황',
  '/dashboard/ac-status': '공조기현황',
  '/monitoring/dashboard': '대시보드',
  '/monitoring/grid': 'GRID현황',
  '/monitoring/ess': 'ESS현황',
  '/monitoring/diesel1': '디젤1현황',
  '/monitoring/diesel2': '디젤2현황',
  '/monitoring/pcs': 'PCS현황',
  '/monitoring/battery': '배터리현황',
  '/monitoring/ac': '공조기현황',
  '/history/grid-base-generation-history': 'GRID 기저발전 이력',
  '/history/support-generation-history': '보조발전 이력',
  '/history/pcs-charge-discharge-history': 'PCS 충방전 이력',
  '/history/power-consumption-history': '전력소비 이력',
  '/reports/operation': '운영 리포트',
  '/report/pcs': 'PCS 리포트',
  '/report/battery': '배터리 리포트',
  '/report/diesel1': '디젤1 리포트',
  '/report/diesel2': '디젤2 리포트',
  '/report/grid': 'GRID 리포트',
  '/report/ess': 'ESS 리포트',
  '/report/ac': '공조기 리포트',
  '/excel': '엑셀다운로드',
  '/master/plants': '발전소관리',
  '/master/pcs': 'PCS관리',
  '/master/inverters': '인버터관리',
  '/master/batteries': '배터리관리',
  '/master/diesels': '디젤관리',
  '/admin/master': '마스터 관리',
  '/admin/code': '코드 관리',
  '/admin/user': '사용자 관리',
  '/admin/role': '권한 관리',
  '/system/roles': '권한 관리',
  '/system/menus': '메뉴 관리',
  '/system/users': '사용자 관리',
  '/system/codes': '코드 관리',
  '/system/popups': '팝업 샘플'
};

function isSameRoute(pathname: string, targetPath: string) {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

function resolveRouteFallbackTitle(pathname: string) {
  const matchedPath = Object.keys(routeTitleFallbacks)
    .filter((path) => isSameRoute(pathname, path))
    .sort((a, b) => b.length - a.length)[0];

  return matchedPath ? routeTitleFallbacks[matchedPath] : undefined;
}

function resolveNavigationTitle(pathname: string, fallbackTitle: string, groups: ReturnType<typeof getNavigationGroups>) {
  const candidates: TitleCandidate[] = [];
  const routeFallbackTitle = resolveRouteFallbackTitle(pathname);

  groups.forEach((group) => {
    group.items.forEach((item) => {
      if (isSameRoute(pathname, item.path)) {
        candidates.push({
          label: item.label,
          score: 3,
          pathLength: item.path.length,
          matchedByAlias: false
        });
      }

      (item.matchPaths ?? []).forEach((aliasPath) => {
        if (isSameRoute(pathname, aliasPath)) {
          candidates.push({
            label: item.label,
            score: 2,
            pathLength: aliasPath.length,
            matchedByAlias: true
          });
        }
      });
    });
  });

  if (candidates.length === 0) {
    return routeFallbackTitle ?? fallbackTitle;
  }

  candidates.sort((a, b) => b.score - a.score || b.pathLength - a.pathLength);

  const bestScore = candidates[0].score;
  const bestCandidates = candidates.filter((candidate) => candidate.score === bestScore);

  // 하나의 기존 퍼블리싱 경로에 여러 API 메뉴가 붙어 있으면 화면 전용 제목을 유지한다.
  if (bestCandidates.length > 1 && bestCandidates.every((candidate) => candidate.matchedByAlias)) {
    return routeFallbackTitle ?? fallbackTitle;
  }

  return candidates[0].label;
}

/*
 * 필요: 백엔드 메뉴명과 기존 퍼블리싱 화면명을 함께 사용할 수 있게 화면 제목 해석 규칙을 모은다.
 * 연결: PageHeading, AuthSessionProvider, navigationMenuAdapter.
 * 설명: API 메뉴 경로로 들어오면 메뉴명을 우선하고, 여러 메뉴가 하나의 기존 화면에 붙은 경우에는 fallback 제목을 유지한다.
 * 수정: 특정 화면명을 강제로 유지해야 하면 PageHeading의 preferMenuTitle 값을 false로 넘긴다.
 */
export function useNavigationPageTitle(fallbackTitle: string, preferMenuTitle = true) {
  const location = useLocation();
  const { session } = useAuthSession();

  return useMemo(() => {
    if (!preferMenuTitle) {
      return fallbackTitle;
    }

    return resolveNavigationTitle(location.pathname, fallbackTitle, getNavigationGroups(session?.menus ?? []));
  }, [fallbackTitle, location.pathname, preferMenuTitle, session?.menus]);
}
