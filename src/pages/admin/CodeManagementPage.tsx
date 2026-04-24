import { useState } from 'react';
import { ActionButton } from '../../shared/ui/ActionButton';
import { ToggleSwitch } from '../../shared/ui/ToggleSwitch';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import { codeDetails, codeGroups } from '../../data/mock/admin';

export function CodeManagementPage() {
  const [selectedCode, setSelectedCode] = useState(codeGroups[0]?.id ?? '');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const modal = useDisclosure(false);

  const filteredCodes = includeDeleted ? codeGroups : codeGroups.filter((group) => !group.deleted);

  return (
    <div className="page-stack">
      <PageHeading
        title="코드 관리"
        actions={<ActionButton variant="primary" onClick={modal.open}>추가</ActionButton>}
      />

      <div className="split-grid">
        <PageCard
          title="1. Code List"
          actions={
            <div className="inline-actions">
              <span className="inline-label">삭제 코드 포함</span>
              <ToggleSwitch checked={includeDeleted} onChange={setIncludeDeleted} onLabel="ON" offLabel="OFF" />
            </div>
          }
        >
          <div className="list-panel">
            {filteredCodes.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`list-panel__item ${selectedCode === group.id ? 'is-active' : ''}`.trim()}
                onClick={() => setSelectedCode(group.id)}
              >
                <strong>{group.id}</strong>
                <span>{group.name}</span>
              </button>
            ))}
          </div>
        </PageCard>

        <PageCard
          title="2. Code Detail"
          actions={
            <div className="inline-actions">
              <ActionButton variant="outline">삭제</ActionButton>
              <ActionButton variant="primary">등록</ActionButton>
            </div>
          }
        >
          <div className="list-panel">
            {codeDetails.map((detail) => (
              <div key={detail.id} className="list-panel__item is-static">
                <div>
                  <strong>{detail.id}</strong>
                  <span>{detail.name}</span>
                </div>
                <p>{detail.description}</p>
                <small>사용여부: {detail.useYn}</small>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <Modal
        open={modal.isOpen}
        title="마스터 코드 정보 입력"
        confirmLabel="추가"
        onConfirm={modal.close}
        onCancel={modal.close}
      />
    </div>
  );
}
