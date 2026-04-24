import { useState } from 'react';
import { ActionButton } from '../../shared/ui/ActionButton';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { privilegeTree } from '../../data/mock/admin';

const roles = ['SYSTEM ADMIN', 'SYSTEM MONITOR', 'PLANT MANAGER'] as const;

export function RoleManagementPage() {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]>('SYSTEM ADMIN');
  const [checkedItems, setCheckedItems] = useState<string[]>(['기저발전', '보조발전', '운영 리포트']);
  const modal = useDisclosure(false);

  const togglePrivilege = (name: string) => {
    setCheckedItems((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
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

      <div className="split-grid">
        <PageCard title="1. ROLE List">
          <div className="list-panel">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`list-panel__item ${selectedRole === role ? 'is-active' : ''}`.trim()}
                onClick={() => setSelectedRole(role)}
              >
                <strong>{role}</strong>
                <span>ROLE 설명</span>
              </button>
            ))}
          </div>
        </PageCard>

        <PageCard title="2. Privilege List">
          <div className="privilege-tree">
            {privilegeTree.map((branch) => (
              <div key={branch.menu} className="privilege-tree__branch">
                <div className="privilege-tree__menu">{branch.menu}</div>
                <div className="privilege-tree__children">
                  {branch.children.map((child) => (
                    <label key={child} className="checkbox">
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(child)}
                        onChange={() => togglePrivilege(child)}
                      />
                      <span>{child}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

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
