import { useState } from 'react';
import { ActionButton } from '../../shared/ui/ActionButton';
import { TextField } from '../../shared/ui/Field';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { useDisclosure } from '../../shared/hooks/useDisclosure';
import {
  batteryRowsAdmin,
  dieselRows,
  inverterRowsAdmin,
  pcsRows,
  plantRows,
  type RegistryRow
} from '../../data/mock/admin';

type RegistrySectionProps = {
  title: string;
  initialRows: RegistryRow[];
};

function RegistrySection({ title, initialRows }: RegistrySectionProps) {
  const [rows, setRows] = useState<RegistryRow[]>(initialRows);
  const modal = useDisclosure(false);
  const [draft, setDraft] = useState<RegistryRow>({
    id: '',
    name: '',
    location: '',
    status: '운영중'
  });

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const addRow = () => {
    if (!draft.name.trim()) return;

    setRows((current) => [
      ...current,
      {
        ...draft,
        id: draft.id || `${title.replace(/\s+/g, '-').toUpperCase()}-${String(current.length + 1).padStart(3, '0')}`
      }
    ]);

    setDraft({ id: '', name: '', location: '', status: '운영중' });
    modal.close();
  };

  return (
    <>
      <PageCard
        title={title}
        actions={<ActionButton variant="primary" onClick={modal.open}>추가</ActionButton>}
      >
        <div className="registry-list">
          {rows.map((row) => (
            <div key={row.id} className="registry-item">
              <div>
                <strong>{row.id}</strong>
                <p>{row.name}</p>
                <span>{row.location} · {row.status}</span>
              </div>

              <div className="inline-actions">
                <ActionButton variant="outline">변경</ActionButton>
                <ActionButton variant="danger" onClick={() => removeRow(row.id)}>삭제</ActionButton>
              </div>
            </div>
          ))}
        </div>
      </PageCard>

      <Modal
        open={modal.isOpen}
        tone="info"
        title={`${title} 정보 입력`}
        confirmLabel="추가"
        onConfirm={addRow}
        onCancel={modal.close}
      >
        <div className="form-grid">
          <TextField
            label="ID"
            value={draft.id}
            onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value }))}
          />
          <TextField
            label="명칭"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
          />
          <TextField
            label="위치"
            value={draft.location}
            onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
          />
          <TextField
            label="상태"
            value={draft.status}
            onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
          />
        </div>
      </Modal>
    </>
  );
}

export function MasterManagementPage() {
  return (
    <div className="page-stack">
      <PageHeading
        title="마스터 관리"
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline">취소</ActionButton>
            <ActionButton variant="primary">등록</ActionButton>
          </div>
        }
      />

      <div className="page-stack">
        <RegistrySection title="발전소" initialRows={plantRows} />
        <RegistrySection title="PCS" initialRows={pcsRows} />
        <RegistrySection title="INVERTOR" initialRows={inverterRowsAdmin} />
        <RegistrySection title="BATTERY" initialRows={batteryRowsAdmin} />
        <RegistrySection title="Diesel" initialRows={dieselRows} />
      </div>
    </div>
  );
}
