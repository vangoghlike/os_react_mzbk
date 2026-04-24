import { useLocation } from 'react-router-dom';
import { commonImageSources } from '../assets/images/commonImageSources';
import './Topbar.css';

type TopbarProps = {
  onToggleSidebar: () => void;
};

function getPageName(pathname: string) {
  const map: Record<string, string> = {
    '/dashboard/base-generation': '운영 현황 / 기저발전',
    '/dashboard/support-generation': '운영 현황 / 보조발전',
    '/dashboard/charge-discharge': '운영 현황 / 충방전 현황',
    '/reports/operation': '운영 리포트',
    '/admin/master': '관리자 화면 / 마스터 관리',
    '/admin/code': '관리자 화면 / 코드 관리',
    '/admin/user': '관리자 화면 / 사용자 관리',
    '/admin/role': '관리자 화면 / 권한 관리',
    '/system/popups': '시스템 샘플 / 팝업 샘플'
  };

  return map[pathname] ?? 'EMS';
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 5H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 10H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 15H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const location = useLocation();

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="topbar__menu-button" aria-label="사이드바 열기" onClick={onToggleSidebar}>
          <MenuIcon />
        </button>
      </div>

      <div className="topbar__right">
        <button type="button" className="topbar__icon-button" aria-label={`${getPageName(location.pathname)} 검색`}>
          <SearchIcon />
        </button>

        <div className="topbar__profile">
          <span className="topbar__profile-name">admin(홍길동)</span>
          <img src={commonImageSources.topbarProfile.src} alt={commonImageSources.topbarProfile.alt} className="topbar__avatar" />
        </div>
      </div>
    </header>
  );
}
