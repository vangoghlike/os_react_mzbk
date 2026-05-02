import { useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { getRawValue } from '../../shared/api/apiDataUtils';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { ActionButton } from '../../shared/ui/ActionButton';
import { SelectField, TextField } from '../../shared/ui/Field';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../shared/ui/PageHeading';
import { adminApi } from './adminApi';

type RoleOption = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  useYn: string;
  lockYn: string;
  lastLoginDttm: string;
  roleIds: string[];
  roleNames: string[];
  primaryRoleId: string;
};

type UserRoleRow = {
  roleId: string;
  roleName: string;
};

const ALL_ROLE_FILTER_ID = 'ALL';

function toUserRow(row: ApiRecord): UserRow {
  return {
    id: getRawValue(row.usrId),
    name: getRawValue(row.usrNm),
    email: getRawValue(row.email),
    mobileNo: getRawValue(row.mobileNo),
    useYn: getRawValue(row.useYn),
    lockYn: getRawValue(row.lockYn),
    lastLoginDttm: getRawValue(row.lastLoginDttm),
    roleIds: [],
    roleNames: [],
    primaryRoleId: ''
  };
}

function toRoleOption(row: ApiRecord): RoleOption {
  return {
    id: getRawValue(row.roleId),
    name: getRawValue(row.roleNm)
  };
}

function toUserRoleRow(row: ApiRecord): UserRoleRow {
  return {
    roleId: getRawValue(row.roleId),
    roleName: getRawValue(row.roleNm)
  };
}

/*
 * 필요: 사용자/권한 목록을 시스템 API 값으로 표시한다.
 * 연결: /system/users, /system/roles, 사용자 상세 폼, 암호 변경 팝업.
 * 설명: 등록/암호변경은 퍼블리싱 UI만 유지하고 목록/상세 값은 API 응답에서만 만든다.
 * 수정: 사용자 API 필드명이 바뀌면 toUserRow 매핑만 조정한다.
 */
export function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [selectedRoleFilterId, setSelectedRoleFilterId] = useState(ALL_ROLE_FILTER_ID);
  const [selectedDetailRoleId, setSelectedDetailRoleId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const passwordModal = useDisclosure(false);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [userRows, roleRows] = await Promise.all([adminApi.getUsers(), adminApi.getRoles()]);
        const baseUsers = userRows.map(toUserRow).filter((user) => user.id);
        const nextUsers = await Promise.all(
          baseUsers.map(async (user) => {
            const userRoleRows = (await adminApi.getUserRoles(user.id)).map(toUserRoleRow).filter((role) => role.roleId);

            return {
              ...user,
              roleIds: userRoleRows.map((role) => role.roleId),
              roleNames: userRoleRows.map((role) => role.roleName || role.roleId),
              primaryRoleId: userRoleRows[0]?.roleId ?? ''
            };
          })
        );
        const nextRoles = roleRows.map(toRoleOption).filter((role) => role.id);

        if (!mounted) {
          return;
        }

        setUsers(nextUsers);
        setRoles(nextRoles);
        setSelectedUserId((current) => current || nextUsers[0]?.id || '');
        setSelectedDetailRoleId((current) => current || nextUsers[0]?.primaryRoleId || nextRoles[0]?.id || '');
      } catch (error) {
        if (!mounted) {
          return;
        }

        setErrorMessage(error instanceof ApiError ? error.message : '사용자 데이터를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const roleFilterOptions = useMemo(() => [{ id: ALL_ROLE_FILTER_ID, name: '전체' }, ...roles], [roles]);
  const filteredUsers = useMemo(() => {
    if (selectedRoleFilterId === ALL_ROLE_FILTER_ID) {
      return users;
    }

    return users.filter((user) => user.roleIds.includes(selectedRoleFilterId));
  }, [selectedRoleFilterId, users]);
  const selectedUser = useMemo(
    () => filteredUsers.find((user) => user.id === selectedUserId) ?? filteredUsers[0],
    [filteredUsers, selectedUserId]
  );
  const roleOptions = roles.map((role) => role.id);

  useEffect(() => {
    if (filteredUsers.some((user) => user.id === selectedUserId)) {
      return;
    }

    setSelectedUserId(filteredUsers[0]?.id ?? '');
  }, [filteredUsers, selectedUserId]);

  useEffect(() => {
    setSelectedDetailRoleId(selectedUser?.primaryRoleId || roles[0]?.id || '');
  }, [roles, selectedUser?.id, selectedUser?.primaryRoleId]);

  return (
    <div className="page-stack">
      <PageHeading
        title="사용자 관리"
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline" onClick={passwordModal.open}>암호 변경</ActionButton>
            <ActionButton variant="primary">등록</ActionButton>
          </div>
        }
      />

      {isLoading && <PageDataLoadingFallback title="사용자 관리" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && !errorMessage && (
        <div className="split-grid">
          <PageCard title="1. User List" actions={<ActionButton variant="primary">추가</ActionButton>}>
            <div className="role-filter">
              {/* 역할 탭은 사용자별 권한 API 응답을 기준으로 목록을 분류한다. */}
              {roleFilterOptions.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-filter__button ${selectedRoleFilterId === role.id ? 'is-active' : ''}`.trim()}
                  onClick={() => setSelectedRoleFilterId(role.id)}
                >
                  {role.name || role.id}
                </button>
              ))}
            </div>

            <div className="list-panel">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`list-panel__item ${selectedUser?.id === user.id ? 'is-active' : ''}`.trim()}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <strong>{user.id}</strong>
                  <span>{user.name || '-'}</span>
                  <small>{user.email || '-'}</small>
                </button>
              ))}
              {filteredUsers.length === 0 && <p className="list-panel__empty">선택한 권한의 사용자가 없습니다.</p>}
            </div>
          </PageCard>

          <PageCard title="2. User Detail Information">
            <div className="form-grid">
              <TextField label="User ID(*)" value={selectedUser?.id ?? ''} readOnly />
              <TextField label="User Name(*)" value={selectedUser?.name ?? ''} readOnly />
              <TextField label="Phone" value={selectedUser?.mobileNo ?? ''} readOnly />
              <SelectField
                label="ROLE(*)"
                options={roleOptions}
                value={selectedDetailRoleId}
                onChange={(event) => setSelectedDetailRoleId(event.target.value)}
              />
              <TextField label="Email" value={selectedUser?.email ?? ''} readOnly />
              <TextField label="Use" value={selectedUser?.useYn ?? ''} readOnly />
              <TextField label="Lock" value={selectedUser?.lockYn ?? ''} readOnly />
              <TextField label="Last Login" value={selectedUser?.lastLoginDttm ?? ''} readOnly />
            </div>
          </PageCard>
        </div>
      )}

      <Modal
        open={passwordModal.isOpen}
        title="사용자 암호 변경"
        confirmLabel="확인"
        onConfirm={passwordModal.close}
        onCancel={passwordModal.close}
      >
        <div className="form-grid">
          <TextField label="새 암호" type="password" />
          <TextField label="새 암호 확인" type="password" />
        </div>
      </Modal>
    </div>
  );
}
