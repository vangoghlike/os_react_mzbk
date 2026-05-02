import { useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { getRawValue } from '../../shared/api/apiDataUtils';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { ActionButton } from '../../shared/ui/ActionButton';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../shared/ui/PageHeading';
import { adminApi, type RoleMenuNode } from './adminApi';

type RoleRow = {
  id: string;
  name: string;
  description: string;
};

function toRoleRow(row: ApiRecord): RoleRow {
  return {
    id: getRawValue(row.roleId),
    name: getRawValue(row.roleNm),
    description: getRawValue(row.roleDesc)
  };
}

function getMenuId(node: RoleMenuNode) {
  return getRawValue(node.sysMenuId);
}

function getMenuName(node: RoleMenuNode) {
  return getRawValue(node.menuNm) || getMenuId(node);
}

function getCheckedKey(menuId: string, type: 'read' | 'write') {
  return `${menuId}:${type}`;
}

type PrivilegeTreeNodeProps = {
  node: RoleMenuNode;
  checkedItems: string[];
  onToggle: (key: string) => void;
};

function PrivilegeTreeNode({ node, checkedItems, onToggle }: PrivilegeTreeNodeProps) {
  const menuId = getMenuId(node);
  const children = node.children ?? [];
  const readKey = getCheckedKey(menuId, 'read');
  const writeKey = getCheckedKey(menuId, 'write');

  return (
    <div className="privilege-tree__branch">
      <div className="privilege-tree__menu">{getMenuName(node)}</div>
      <div className="privilege-tree__children">
        <label className="checkbox">
          <input type="checkbox" checked={checkedItems.includes(readKey)} onChange={() => onToggle(readKey)} />
          <span>읽기</span>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={checkedItems.includes(writeKey)} onChange={() => onToggle(writeKey)} />
          <span>쓰기</span>
        </label>
        {children.map((childNode) => (
          <PrivilegeTreeNode key={getMenuId(childNode)} node={childNode} checkedItems={checkedItems} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

function getInitialCheckedItems(nodes: RoleMenuNode[]) {
  const checkedItems: string[] = [];

  const visit = (node: RoleMenuNode) => {
    const menuId = getMenuId(node);

    if (getRawValue(node.readYn) === 'Y') {
      checkedItems.push(getCheckedKey(menuId, 'read'));
    }

    if (getRawValue(node.writeYn) === 'Y') {
      checkedItems.push(getCheckedKey(menuId, 'write'));
    }

    node.children?.forEach(visit);
  };

  nodes.forEach(visit);

  return checkedItems;
}

/*
 * 필요: 권한 목록과 권한별 메뉴 트리를 시스템 API 값으로 표시한다.
 * 연결: /system/roles, /system/roles/{roleId}/menus/tree, 권한 선택 UI.
 * 설명: 권한 체크 상태는 API 응답을 초기값으로 쓰며 저장 API는 아직 연결하지 않는다.
 * 수정: 메뉴 권한 응답 구조가 바뀌면 getInitialCheckedItems와 PrivilegeTreeNode만 조정한다.
 */
export function RoleManagementPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [menuTree, setMenuTree] = useState<RoleMenuNode[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const modal = useDisclosure(false);

  useEffect(() => {
    let mounted = true;

    async function loadRoles() {
      setIsLoadingRoles(true);
      setErrorMessage('');

      try {
        const rows = await adminApi.getRoles();
        const nextRoles = rows.map(toRoleRow).filter((role) => role.id);

        if (!mounted) {
          return;
        }

        setRoles(nextRoles);
        setSelectedRoleId((current) => current || nextRoles[0]?.id || '');
      } catch (error) {
        if (!mounted) {
          return;
        }

        setErrorMessage(error instanceof ApiError ? error.message : '권한 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setIsLoadingRoles(false);
        }
      }
    }

    loadRoles();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRoleId) {
      return;
    }

    let mounted = true;

    async function loadMenuTree() {
      setIsLoadingTree(true);
      setErrorMessage('');

      try {
        const nextTree = await adminApi.getRoleMenuTree(selectedRoleId);

        if (!mounted) {
          return;
        }

        setMenuTree(nextTree);
        setCheckedItems(getInitialCheckedItems(nextTree));
      } catch (error) {
        if (!mounted) {
          return;
        }

        setMenuTree([]);
        setCheckedItems([]);
        setErrorMessage(error instanceof ApiError ? error.message : '권한 메뉴 트리를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setIsLoadingTree(false);
        }
      }
    }

    loadMenuTree();

    return () => {
      mounted = false;
    };
  }, [selectedRoleId]);

  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId), [roles, selectedRoleId]);

  const togglePrivilege = (key: string) => {
    setCheckedItems((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return (
    <div className="page-stack">
      <PageHeading
        title="권한 관리"
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline" onClick={modal.open}>추가</ActionButton>
            <ActionButton variant="primary">등록</ActionButton>
          </div>
        }
      />

      {isLoadingRoles && <PageDataLoadingFallback title="권한 관리" />}
      {!isLoadingRoles && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoadingRoles && (
        <div className="split-grid">
          <PageCard title="1. ROLE List">
            <div className="list-panel">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`list-panel__item ${selectedRoleId === role.id ? 'is-active' : ''}`.trim()}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <strong>{role.name || role.id}</strong>
                  <span>{role.description || '-'}</span>
                </button>
              ))}
            </div>
          </PageCard>

          <PageCard title={`2. Privilege List${selectedRole ? ` - ${selectedRole.name}` : ''}`}>
            {isLoadingTree && <PageDataLoadingFallback title="권한 관리" />}
            {!isLoadingTree && (
              <div className="privilege-tree">
                {menuTree.map((node) => (
                  <PrivilegeTreeNode key={getMenuId(node)} node={node} checkedItems={checkedItems} onToggle={togglePrivilege} />
                ))}
              </div>
            )}
          </PageCard>
        </div>
      )}

      <Modal
        open={modal.isOpen}
        title="시스템 권한 정보 입력"
        confirmLabel="추가"
        onConfirm={modal.close}
        onCancel={modal.close}
      />
    </div>
  );
}
