import { useState } from 'react';
import { commonIconSources } from '../../../../shared/assets/icons/commonIconSources';
import { ActionButton } from '../../../../shared/ui/ActionButton';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { PageCard } from '../../../../shared/ui/PageCard';
import {
  baseGenerationInverterHeaderRows,
  baseGenerationPowerHeaderRows
} from '../mock/baseGenerationSummaryMock';
import {
  baseGenerationInverterTableRows,
  baseGenerationPowerTableRows
} from '../mock/baseGenerationTableMock';
import './BaseGenerationTableSection.css';

export function BaseGenerationTableSection() {
  // 하단 상세 표를 분리해 요약 차트 수정과 충돌하지 않게 둔다.
  const [inverterExpanded, setInverterExpanded] = useState(true);

  return (
    <div className="base-generation-table-section">
      <PageCard
        title="운전 상세 현황"
        className="base-generation-table-section__panel"
        actions={
          <ActionButton variant="success" className="base-generation-table-section__excel-button">
            <img
              src={commonIconSources.excelSave.src}
              alt={commonIconSources.excelSave.alt}
              className="base-generation-table-section__button-icon"
            />
            <span>전체엑셀 저장</span>
          </ActionButton>
        }
      >
        <BasicTable
          ariaLabel="기저발전 운전 상세 현황"
          headerRows={baseGenerationPowerHeaderRows}
          rows={baseGenerationPowerTableRows}
          className="base-generation-table-section__table"
        />
      </PageCard>

      <button
        type="button"
        className={`base-generation-table-section__toggle ${inverterExpanded ? 'is-open' : ''}`.trim()}
        aria-expanded={inverterExpanded}
        onClick={() => setInverterExpanded((current) => !current)}
      >
        <span>인버터 상세 내역 보기</span>
        <span className="base-generation-table-section__toggle-caret">{inverterExpanded ? '▾' : '▸'}</span>
      </button>

      {inverterExpanded && (
        <PageCard
          title=""
          className="base-generation-table-section__panel"
          actions={
            <div className="inline-actions">
              <ActionButton variant="outline" className="base-generation-table-section__outline-button">
                Inverter #1
              </ActionButton>
              <ActionButton variant="success" className="base-generation-table-section__excel-button">
                <img
                  src={commonIconSources.excelSave.src}
                  alt={commonIconSources.excelSave.alt}
                  className="base-generation-table-section__button-icon"
                />
                <span>전체엑셀 저장</span>
              </ActionButton>
            </div>
          }
        >
          <BasicTable
            ariaLabel="기저발전 인버터 상세 내역"
            headerRows={baseGenerationInverterHeaderRows}
            rows={baseGenerationInverterTableRows}
            className="base-generation-table-section__table base-generation-table-section__table--wide"
          />
        </PageCard>
      )}
    </div>
  );
}
