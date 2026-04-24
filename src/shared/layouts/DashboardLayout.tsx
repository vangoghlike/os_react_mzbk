import { useState, type ReactNode } from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { Topbar } from '../navigation/Topbar';
import './DashboardLayout.css';

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // 사이드바 접힘 상태만 공통 레이아웃에서 관리한다.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="dashboard-layout__main">
        <Topbar onToggleSidebar={() => setSidebarCollapsed((current) => !current)} />
        <main className="dashboard-layout__content">{children}</main>
      </div>
    </div>
  );
}
