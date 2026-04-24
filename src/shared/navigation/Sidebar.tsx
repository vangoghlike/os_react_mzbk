import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { commonLogoSources } from '../assets/logos/commonLogoSources';
import { navigationGroups } from './navigationGroups';
import './Sidebar.css';

type SidebarProps = {
  collapsed: boolean;
};

function SidebarChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`sidebar__caret ${open ? 'is-open' : ''}`.trim()}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  // 현재 경로를 기준으로 기본 펼침 상태를 맞춘다.
  const defaultOpenState = useMemo(() => {
    return navigationGroups.reduce<Record<string, boolean>>((acc, group) => {
      acc[group.key] = group.items.some((item) => location.pathname.startsWith(item.path));
      return acc;
    }, {});
  }, [location.pathname]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(defaultOpenState);

  useEffect(() => {
    setOpenMap((current) => ({ ...current, ...defaultOpenState }));
  }, [defaultOpenState]);

  const toggleGroup = (key: string) => {
    setOpenMap((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`.trim()}>
      <div className="sidebar__brand">
        <img src={commonLogoSources.sidebarBrand.src} alt={commonLogoSources.sidebarBrand.alt} className="sidebar__logo" />
      </div>

      <nav className="sidebar__nav" aria-label="주 메뉴">
        {navigationGroups.map((group) => (
          <div
            key={group.key}
            className={`sidebar__group ${openMap[group.key] ? 'is-open' : ''} ${
              group.items.some((item) => location.pathname.startsWith(item.path)) ? 'is-current' : ''
            }`.trim()}
          >
            <button type="button" className="sidebar__group-button" onClick={() => toggleGroup(group.key)}>
              <span className="sidebar__group-label">
                <img src={group.iconSrc} alt={group.iconAlt} className="sidebar__group-icon" />
                {!collapsed && <span>{group.label}</span>}
              </span>
              {!collapsed && <SidebarChevron open={openMap[group.key]} />}
            </button>

            <div className={`sidebar__items ${openMap[group.key] ? 'is-open' : ''}`.trim()}>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar__item ${isActive ? 'is-active' : ''}`.trim()}
                >
                  <img src={item.iconSrc} alt={item.iconAlt} className="sidebar__item-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <footer className="sidebar__footer">MG EMS System</footer>
    </aside>
  );
}
