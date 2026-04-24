import { useMemo, useState } from 'react';
import { ActionButton } from '../../shared/ui/ActionButton';
import { SelectField, TextField } from '../../shared/ui/Field';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { usersByRole } from '../../data/mock/admin';

type RoleKey = keyof typeof usersByRole;

const roleOptions = Object.keys(usersByRole) as RoleKey[];

export function UserManagementPage() {
  const [role, setRole] = useState<RoleKey>(roleOptions[0]);
  const passwordModal = useDisclosure(false);

  const users = useMemo(() => usersByRole[role], [role]);

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

      <div className="split-grid">
        <PageCard
          title="1. User List"
          actions={<ActionButton variant="primary">추가</ActionButton>}
        >
          <div className="role-filter">
            {roleOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`role-filter__button ${role === option ? 'is-active' : ''}`.trim()}
                onClick={() => setRole(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="list-panel">
            {users.map((user) => (
              <div key={user.id} className="list-panel__item is-static">
                <strong>{user.id}</strong>
                <span>{user.name}</span>
                <small>{user.corporation}</small>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="2. User Detail Information">
          <div className="form-grid">
            <TextField label="User ID(*)" defaultValue={users[0]?.id ?? ''} />
            <TextField label="User Name(*)" defaultValue={users[0]?.name ?? ''} />
            <TextField label="Phone" defaultValue="010-1234-5678" />
            <SelectField label="ROLE(*)" options={roleOptions} value={role} onChange={(event) => setRole(event.target.value as RoleKey)} />
            <TextField label="Corporation" defaultValue={users[0]?.corporation ?? ''} />
            <TextField label="Dept" defaultValue="Operation Team" />
            <TextField label="Corp Telephone" defaultValue="+258-000-1234" />
            <TextField label="Corp Fax" defaultValue="+258-000-1235" />
          </div>
        </PageCard>
      </div>

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
