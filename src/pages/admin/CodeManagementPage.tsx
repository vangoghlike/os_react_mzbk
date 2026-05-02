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
import { ToggleSwitch } from '../../shared/ui/ToggleSwitch';
import { adminApi } from './adminApi';

type CodeRow = {
  id: string;
  name: string;
  parentId: string;
  description: string;
  sortOrder: string;
  useYn: string;
};

function toCodeRow(row: ApiRecord): CodeRow {
  return {
    id: getRawValue(row.cdId),
    name: getRawValue(row.cdNm),
    parentId: getRawValue(row.uprCdId),
    description: getRawValue(row.cdDesc),
    sortOrder: getRawValue(row.sortOrd),
    useYn: getRawValue(row.useYn)
  };
}

/*
 * 필요: 코드 그룹과 상세 코드를 시스템 API 값으로 표시한다.
 * 연결: /system/codes, 삭제 포함 스위치, 코드 상세 목록.
 * 설명: parent id가 없는 코드를 그룹으로 보고, 선택 그룹의 하위 코드만 상세에 표시한다.
 * 수정: 코드 계층 필드명이 바뀌면 toCodeRow의 parentId 매핑만 조정한다.
 */
export function CodeManagementPage() {
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const modal = useDisclosure(false);

  useEffect(() => {
    let mounted = true;

    async function loadCodes() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const rows = await adminApi.getCodes();
        const nextCodes = rows.map(toCodeRow).filter((code) => code.id);

        if (!mounted) {
          return;
        }

        setCodes(nextCodes);
        setSelectedCode((current) => current || nextCodes.find((code) => !code.parentId)?.id || '');
      } catch (error) {
        if (!mounted) {
          return;
        }

        setErrorMessage(error instanceof ApiError ? error.message : '코드 데이터를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCodes();

    return () => {
      mounted = false;
    };
  }, []);

  const codeGroups = useMemo(
    () => codes.filter((code) => !code.parentId && (includeDeleted || code.useYn !== 'N')),
    [codes, includeDeleted]
  );
  const codeDetails = useMemo(
    () => codes.filter((code) => code.parentId === selectedCode && (includeDeleted || code.useYn !== 'N')),
    [codes, includeDeleted, selectedCode]
  );

  return (
    <div className="page-stack">
      <PageHeading
        title="코드 관리"
        actions={<ActionButton variant="primary" onClick={modal.open}>추가</ActionButton>}
      />

      {isLoading && <PageDataLoadingFallback title="코드 관리" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && !errorMessage && (
        <div className="split-grid">
          <PageCard
            title="1. Code List"
            actions={
              <div className="inline-actions">
                <span className="inline-label">미사용 코드 포함</span>
                <ToggleSwitch checked={includeDeleted} onChange={setIncludeDeleted} onLabel="ON" offLabel="OFF" />
              </div>
            }
          >
            <div className="list-panel">
              {codeGroups.map((group) => (
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
                  <p>{detail.description || '-'}</p>
                  <small>정렬: {detail.sortOrder || '-'} / 사용여부: {detail.useYn || '-'}</small>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      )}

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
