import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuthSession } from '../features/auth/session/AuthSessionProvider';
import { AuthLayout } from '../shared/layouts/AuthLayout';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { PageLoadingFallback } from '../shared/ui/PageLoadingFallback';

const LoginPage = lazy(() => import('../features/auth/login/page/LoginPage').then((module) => ({ default: module.LoginPage })));
const PlantOperationStatusPage = lazy(() =>
  import('../features/dashboard/plant-operation-status/page/PlantOperationStatusPage').then((module) => ({
    default: module.PlantOperationStatusPage
  }))
);
const BaseGenerationPage = lazy(() =>
  import('../features/dashboard/base-generation/page/BaseGenerationPage').then((module) => ({ default: module.BaseGenerationPage }))
);
const SupportGenerationStatusPage = lazy(() =>
  import('../features/dashboard/support-generation-status/page/SupportGenerationStatusPage').then((module) => ({
    default: module.SupportGenerationStatusPage
  }))
);
const PcsChargeDischargeStatusPage = lazy(() =>
  import('../features/dashboard/pcs-charge-discharge-status/page/PcsChargeDischargeStatusPage').then((module) => ({
    default: module.PcsChargeDischargeStatusPage
  }))
);
const PowerConsumptionStatusPage = lazy(() =>
  import('../features/dashboard/power-consumption-status/page/PowerConsumptionStatusPage').then((module) => ({
    default: module.PowerConsumptionStatusPage
  }))
);
const GridBaseGenerationHistoryPage = lazy(() =>
  import('../features/history/grid-base-generation-history/page/GridBaseGenerationHistoryPage').then((module) => ({
    default: module.GridBaseGenerationHistoryPage
  }))
);
const SupportGenerationHistoryPage = lazy(() =>
  import('../features/history/support-generation-history/page/SupportGenerationHistoryPage').then((module) => ({
    default: module.SupportGenerationHistoryPage
  }))
);
const PcsChargeDischargeHistoryPage = lazy(() =>
  import('../features/history/pcs-charge-discharge-history/page/PcsChargeDischargeHistoryPage').then((module) => ({
    default: module.PcsChargeDischargeHistoryPage
  }))
);
const PowerConsumptionHistoryPage = lazy(() =>
  import('../features/history/power-consumption-history/page/PowerConsumptionHistoryPage').then((module) => ({
    default: module.PowerConsumptionHistoryPage
  }))
);
const OperationReportPage = lazy(() => import('../pages/report/OperationReportPage').then((module) => ({ default: module.OperationReportPage })));
const MasterManagementPage = lazy(() => import('../pages/admin/MasterManagementPage').then((module) => ({ default: module.MasterManagementPage })));
const CodeManagementPage = lazy(() => import('../pages/admin/CodeManagementPage').then((module) => ({ default: module.CodeManagementPage })));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage').then((module) => ({ default: module.UserManagementPage })));
const RoleManagementPage = lazy(() => import('../pages/admin/RoleManagementPage').then((module) => ({ default: module.RoleManagementPage })));
const PopupSamplesPage = lazy(() => import('../pages/system/PopupSamplesPage').then((module) => ({ default: module.PopupSamplesPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function AuthOutlet() {
  const { isAuthenticated } = useAuthSession();
  const location = useLocation();
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard/base-generation';

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  return (
    <AuthLayout>
      <Suspense fallback={<PageLoadingFallback label="로그인 화면을 불러오는 중입니다." />}>
        <Outlet />
      </Suspense>
    </AuthLayout>
  );
}

function DashboardOutlet() {
  const { isAuthenticated } = useAuthSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoadingFallback label="화면을 불러오는 중입니다." />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthOutlet />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<DashboardOutlet />}>
        <Route path="/" element={<Navigate to="/dashboard/base-generation" replace />} />
        <Route path="/dashboard/plant-operation-status" element={<PlantOperationStatusPage />} />
        <Route path="/dashboard/base-generation" element={<BaseGenerationPage />} />
        <Route path="/dashboard/support-generation" element={<SupportGenerationStatusPage />} />
        <Route path="/dashboard/charge-discharge" element={<PcsChargeDischargeStatusPage />} />
        <Route path="/dashboard/power-consumption-status" element={<PowerConsumptionStatusPage />} />
        <Route path="/history/grid-base-generation-history" element={<GridBaseGenerationHistoryPage />} />
        <Route path="/history/support-generation-history" element={<SupportGenerationHistoryPage />} />
        <Route path="/history/pcs-charge-discharge-history" element={<PcsChargeDischargeHistoryPage />} />
        <Route path="/history/power-consumption-history" element={<PowerConsumptionHistoryPage />} />
        <Route path="/reports/operation" element={<OperationReportPage />} />
        <Route path="/admin/master" element={<MasterManagementPage />} />
        <Route path="/admin/code" element={<CodeManagementPage />} />
        <Route path="/admin/user" element={<UserManagementPage />} />
        <Route path="/admin/role" element={<RoleManagementPage />} />
        <Route path="/system/popups" element={<PopupSamplesPage />} />
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<PageLoadingFallback label="화면을 불러오는 중입니다." />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
