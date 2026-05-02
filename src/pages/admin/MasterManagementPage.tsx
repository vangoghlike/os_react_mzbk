import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiError } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { EMPTY_API_VALUE, getRawValue } from '../../shared/api/apiDataUtils';
import { ActionButton } from '../../shared/ui/ActionButton';
import { PageCard } from '../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../shared/ui/PageHeading';
import { adminApi, type MasterResource } from './adminApi';
import './MasterManagementPage.css';

type MasterField = {
  key: string;
  label: string;
};

type MasterResourceViewConfig = {
  resource: MasterResource;
  title: string;
  description: string;
  listFields: MasterField[];
  detailFields: MasterField[];
};

const masterResourceConfigs: Record<MasterResource, MasterResourceViewConfig> = {
  plants: {
    resource: 'plants',
    title: '발전소관리',
    description: '06. Master-Plant API 목록과 선택 상세를 표시한다.',
    listFields: [
      { key: 'plntId', label: '발전소 ID' },
      { key: 'plntSeq', label: '순번' },
      { key: 'plntNm', label: '발전소명' },
      { key: 'pplntDelyn', label: '삭제' }
    ],
    detailFields: [
      { key: 'plntId', label: '발전소 ID' },
      { key: 'plntSeq', label: '발전소 순번' },
      { key: 'plntNm', label: '발전소명' },
      { key: 'plntAddr', label: '주소' },
      { key: 'pplntDelyn', label: '삭제 여부' }
    ]
  },
  pcs: {
    resource: 'pcs',
    title: 'PCS관리',
    description: '07. Master-PCS API 목록과 선택 상세를 표시한다.',
    listFields: [
      { key: 'pcsId', label: 'PCS ID' },
      { key: 'pcsSeq', label: '순번' },
      { key: 'pcsNm', label: 'PCS명' },
      { key: 'pcsDelyn', label: '삭제' }
    ],
    detailFields: [
      { key: 'pcsId', label: 'PCS ID' },
      { key: 'pcsSeq', label: 'PCS 순번' },
      { key: 'pcsNm', label: 'PCS명' },
      { key: 'plntId', label: '발전소 ID' },
      { key: 'plntSeq', label: '발전소 순번' },
      { key: 'modlNm', label: '모델명' },
      { key: 'pcsDelyn', label: '삭제 여부' }
    ]
  },
  inverters: {
    resource: 'inverters',
    title: '인버터관리',
    description: '08. Master-Inverter API 목록과 선택 상세를 표시한다.',
    listFields: [
      { key: 'ivtId', label: '인버터 ID' },
      { key: 'ivtSeq', label: '순번' },
      { key: 'ivtNm', label: '인버터명' },
      { key: 'ivtDelyn', label: '삭제' }
    ],
    detailFields: [
      { key: 'ivtId', label: '인버터 ID' },
      { key: 'ivtSeq', label: '인버터 순번' },
      { key: 'ivtNm', label: '인버터명' },
      { key: 'pcsId', label: 'PCS ID' },
      { key: 'plntId', label: '발전소 ID' },
      { key: 'modlNm', label: '모델명' },
      { key: 'ivtDelyn', label: '삭제 여부' }
    ]
  },
  batteries: {
    resource: 'batteries',
    title: '배터리관리',
    description: '09. Master-Battery API 목록과 선택 상세를 표시한다.',
    listFields: [
      { key: 'batId', label: '배터리 ID' },
      { key: 'batSeq', label: '순번' },
      { key: 'batNm', label: '배터리명' },
      { key: 'batDelyn', label: '삭제' }
    ],
    detailFields: [
      { key: 'batId', label: '배터리 ID' },
      { key: 'batSeq', label: '배터리 순번' },
      { key: 'batNm', label: '배터리명' },
      { key: 'pcsId', label: 'PCS ID' },
      { key: 'plntId', label: '발전소 ID' },
      { key: 'modlNm', label: '모델명' },
      { key: 'batDelyn', label: '삭제 여부' }
    ]
  },
  diesels: {
    resource: 'diesels',
    title: '디젤관리',
    description: '10. Master-Diesel API 목록과 선택 상세를 표시한다.',
    listFields: [
      { key: 'dslId', label: '디젤 ID' },
      { key: 'dslSeq', label: '순번' },
      { key: 'dslNm', label: '디젤명' },
      { key: 'dslDelyn', label: '삭제' }
    ],
    detailFields: [
      { key: 'dslId', label: '디젤 ID' },
      { key: 'dslSeq', label: '디젤 순번' },
      { key: 'dslNm', label: '디젤명' },
      { key: 'plntId', label: '발전소 ID' },
      { key: 'plntSeq', label: '발전소 순번' },
      { key: 'modlNm', label: '모델명' },
      { key: 'dslDelyn', label: '삭제 여부' }
    ]
  }
};

const masterRouteResources: Array<{ path: string; resource: MasterResource }> = [
  { path: '/master/plants', resource: 'plants' },
  { path: '/master/pcs', resource: 'pcs' },
  { path: '/master/inverters', resource: 'inverters' },
  { path: '/master/batteries', resource: 'batteries' },
  { path: '/master/diesels', resource: 'diesels' }
];

function resolveMasterResource(pathname: string) {
  return masterRouteResources.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))?.resource ?? 'plants';
}

function getDisplayValue(row: ApiRecord | null | undefined, key: string) {
  const value = getRawValue(row?.[key]);
  return value || EMPTY_API_VALUE;
}

function getRowKey(row: ApiRecord, resource: MasterResource, index: number) {
  const config = masterResourceConfigs[resource];
  const primaryValues = config.listFields.map((field) => getRawValue(row[field.key])).filter(Boolean);

  return primaryValues.length > 0 ? `${resource}-${primaryValues.join('-')}` : `${resource}-${index}`;
}

function getDetailEntries(detail: ApiRecord | null, config: MasterResourceViewConfig) {
  if (!detail) {
    return [];
  }

  const usedKeys = new Set(config.detailFields.map((field) => field.key));
  const configuredEntries = config.detailFields.map((field) => ({
    label: field.label,
    value: getDisplayValue(detail, field.key)
  }));
  const extraEntries = Object.entries(detail)
    .filter(([key, value]) => !usedKeys.has(key) && getRawValue(value))
    .map(([key, value]) => ({ label: key, value: getRawValue(value) }));

  return [...configuredEntries, ...extraEntries];
}

/*
 * 필요: 마스터 06~10번 API를 같은 화면 규칙으로 읽어 목록과 상세를 분리한다.
 * 연결: /master/plants, /master/pcs, /master/inverters, /master/batteries, /master/diesels.
 * 설명: 디자인 확정 전이라도 실제 API 값이 들어오는 위치를 명확히 두고, 상세 실패 시 목록 행을 상세 대체값으로 보여준다.
 */
export function MasterManagementPage() {
  const location = useLocation();
  const resource = resolveMasterResource(location.pathname);
  const config = masterResourceConfigs[resource];
  const [rows, setRows] = useState<ApiRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detail, setDetail] = useState<ApiRecord | null>(null);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailMessage, setDetailMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadRows() {
      setIsListLoading(true);
      setErrorMessage('');
      setDetailMessage('');
      setRows([]);
      setDetail(null);
      setSelectedIndex(0);

      try {
        const nextRows = await adminApi.getMasterRows(resource);

        if (!mounted) {
          return;
        }

        setRows(nextRows);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setErrorMessage(error instanceof ApiError ? error.message : `${config.title} 데이터를 불러오지 못했습니다.`);
      } finally {
        if (mounted) {
          setIsListLoading(false);
        }
      }
    }

    loadRows();

    return () => {
      mounted = false;
    };
  }, [config.title, resource]);

  const selectedRow = rows[selectedIndex] ?? null;

  useEffect(() => {
    let mounted = true;

    async function loadDetail() {
      if (!selectedRow) {
        setDetail(null);
        return;
      }

      setIsDetailLoading(true);
      setDetailMessage('');

      try {
        const nextDetail = await adminApi.getMasterDetail(resource, selectedRow);

        if (!mounted) {
          return;
        }

        setDetail(nextDetail);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setDetail(selectedRow);
        setDetailMessage(error instanceof ApiError ? error.message : '상세 API 응답이 없어 목록 값을 표시합니다.');
      } finally {
        if (mounted) {
          setIsDetailLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [resource, selectedRow]);

  const detailEntries = useMemo(() => getDetailEntries(detail, config), [config, detail]);

  return (
    <div className="page-stack master-management-page">
      <PageHeading
        title={config.title}
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline">삭제</ActionButton>
            <ActionButton variant="primary">등록</ActionButton>
          </div>
        }
      />

      <div className="master-management-page__grid">
        <PageCard title={`${config.title} 목록`} subtitle={config.description} className="master-management-page__list-card">
          {isListLoading && <PageDataLoadingFallback title={config.title} preferMenuTitle={false} />}
          {!isListLoading && errorMessage && <div role="alert" className="master-management-page__message">{errorMessage}</div>}
          {!isListLoading && !errorMessage && rows.length === 0 && (
            <div className="master-management-page__message">표시할 데이터가 없습니다.</div>
          )}
          {!isListLoading && !errorMessage && rows.length > 0 && (
            <div className="master-management-table-wrap">
              <table className="master-management-table" aria-label={`${config.title} 목록`}>
                <thead>
                  <tr>
                    {config.listFields.map((field) => (
                      <th key={field.key}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={getRowKey(row, resource, rowIndex)}
                      className={selectedIndex === rowIndex ? 'is-active' : ''}
                      onClick={() => setSelectedIndex(rowIndex)}
                    >
                      {config.listFields.map((field) => (
                        <td key={field.key}>{getDisplayValue(row, field.key)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageCard>

        <PageCard title={`${config.title} 상세`} className="master-management-page__detail-card">
          {isDetailLoading && <PageDataLoadingFallback title={`${config.title} 상세`} preferMenuTitle={false} />}
          {!isDetailLoading && detailMessage && <div role="status" className="master-management-page__message">{detailMessage}</div>}
          {!isDetailLoading && detailEntries.length === 0 && (
            <div className="master-management-page__message">선택된 데이터가 없습니다.</div>
          )}
          {!isDetailLoading && detailEntries.length > 0 && (
            <dl className="master-detail-list">
              {detailEntries.map((entry) => (
                <div key={`${entry.label}-${entry.value}`} className="master-detail-list__item">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </PageCard>
      </div>
    </div>
  );
}
