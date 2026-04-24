import { useState } from 'react';
import { ActionButton } from '../../shared/ui/ActionButton';
import { Modal } from '../../shared/ui/Modal';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';

type PopupTone = 'info' | 'warning' | 'error';

export function PopupSamplesPage() {
  const [tone, setTone] = useState<PopupTone | null>(null);

  return (
    <div className="page-stack">
      <PageHeading title="팝업 샘플" />

      <PageCard title="메시지 팝업">
        <div className="inline-actions">
          <ActionButton variant="outline" onClick={() => setTone('info')}>Information</ActionButton>
          <ActionButton variant="outline" onClick={() => setTone('warning')}>Warning</ActionButton>
          <ActionButton variant="danger" onClick={() => setTone('error')}>Error</ActionButton>
        </div>
      </PageCard>

      <Modal
        open={tone !== null}
        tone={tone ?? 'info'}
        title="데이터 조회 메시지"
        description="데이터 조회에 문제가 발생하였습니다. 관리자에게 문의하여 주세요."
        confirmLabel="확인"
        onConfirm={() => setTone(null)}
        onCancel={() => setTone(null)}
      />
    </div>
  );
}
