import { useEffect, useState, type ReactNode } from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { Topbar } from '../navigation/Topbar';
import './DashboardLayout.css';

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // 모바일은 처음부터 닫힌 상태로 시작해 메뉴 버튼이 실제 온오프 역할을 하게 한다.
  const [isMobileSidebar, setIsMobileSidebar] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 720px)').matches : false
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 720px)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)');
    const syncSidebarMode = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileSidebar(event.matches);
      setSidebarCollapsed(event.matches);
    };

    syncSidebarMode(mediaQuery);
    mediaQuery.addEventListener('change', syncSidebarMode);

    return () => {
      mediaQuery.removeEventListener('change', syncSidebarMode);
    };
  }, []);

  const closeMobileSidebar = () => {
    if (isMobileSidebar) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="dashboard-layout">
      {isMobileSidebar && !sidebarCollapsed && (
        <button type="button" className="dashboard-layout__scrim" aria-label="모바일 메뉴 닫기" onClick={closeMobileSidebar} />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        onRequestExpand={() => setSidebarCollapsed(false)}
        onRequestClose={closeMobileSidebar}
        onNavigate={closeMobileSidebar}
      />

      <div className="dashboard-layout__main">
        <Topbar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((current) => !current)} />
        <main className="dashboard-layout__content">{children}</main>
      </div>
    </div>
  );
}
