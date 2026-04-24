import type { ReactNode } from 'react';
import { ActionButton } from './ActionButton';
import './Modal.css';

type ModalTone = 'info' | 'warning' | 'error';

type ModalProps = {
  open: boolean;
  title: string;
  tone?: ModalTone;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

function getToneLabel(tone: ModalTone) {
  if (tone === 'error') return 'ERROR';
  if (tone === 'warning') return 'WARNING';
  return 'INFO';
}

export function Modal({
  open,
  title,
  tone = 'info',
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  children
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`modal modal--${tone}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__badge">{getToneLabel(tone)}</div>
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        {description && <p className="modal__description">{description}</p>}

        {children && <div className="modal__content">{children}</div>}

        <div className="modal__actions">
          {onConfirm && (
            <ActionButton variant={tone === 'error' ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </ActionButton>
          )}
          <ActionButton variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </ActionButton>
        </div>
      </section>
    </div>
  );
}
