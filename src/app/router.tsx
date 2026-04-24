import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../features/auth/login/page/LoginPage';
import { BaseGenerationPage } from '../features/dashboard/base-generation/page/BaseGenerationPage';
import { AuthLayout } from '../shared/layouts/AuthLayout';
import { DashboardLayout } from '../shared/layouts/DashboardLayout';
import { CodeManagementPage } from '../pages/admin/CodeManagementPage';
import { MasterManagementPage } from '../pages/admin/MasterManagementPage';
import { RoleManagementPage } from '../pages/admin/RoleManagementPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { ChargeDischargePage } from '../pages/dashboard/ChargeDischargePage';
import { SupportGenerationPage } from '../pages/dashboard/SupportGenerationPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OperationReportPage } from '../pages/report/OperationReportPage';
import { PopupSamplesPage } from '../pages/system/PopupSamplesPage';

function AuthOutlet() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

function DashboardOutlet() {
  return (
    <DashboardLayout>
      <Outlet />
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
        <Route path="/dashboard/base-generation" element={<BaseGenerationPage />} />
        <Route path="/dashboard/support-generation" element={<SupportGenerationPage />} />
        <Route path="/dashboard/charge-discharge" element={<ChargeDischargePage />} />
        <Route path="/reports/operation" element={<OperationReportPage />} />
        <Route path="/admin/master" element={<MasterManagementPage />} />
        <Route path="/admin/code" element={<CodeManagementPage />} />
        <Route path="/admin/user" element={<UserManagementPage />} />
        <Route path="/admin/role" element={<RoleManagementPage />} />
        <Route path="/system/popups" element={<PopupSamplesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
