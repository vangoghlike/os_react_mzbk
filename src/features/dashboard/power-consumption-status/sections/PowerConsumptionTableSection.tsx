import { useState } from 'react';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import { PageCard } from '../../../../shared/ui/PageCard';
import { powerConsumptionBankTableMock, powerConsumptionTableMock } from '../mock/powerConsumptionTableMock';
import '../styles/PowerConsumptionTableSection.css';

/*
 * 필요: 전력 소비 상세 표와 BANK 상세 접힘 표를 배치한다.
 * 연결: BasicTable, DetailToggleBar, ExcelSaveButton, powerConsumptionTableMock.
 * 설명: 넓은 표는 mock의 minWidth와 BasicTable 가로 스크롤 계약으로 보호한다.
 * 수정: 상세 영역 간격은 styles/PowerConsumptionTableSection.css에서 조정한다.
 */
export function PowerConsumptionTableSection() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="power-consumption-table-section">
      <PageCard
        actions={
          <ExcelSaveButton
            fileName="전력소비현황_상세내역"
            sheets={[
              {
                name: '전력 소비 상세',
                headerRows: powerConsumptionTableMock.headerRows,
                rows: powerConsumptionTableMock.rows
              }
            ]}
          />
        }
        className="power-consumption-table-section__panel"
      >
        <BasicTable
          ariaLabel={powerConsumptionTableMock.ariaLabel}
          headerRows={powerConsumptionTableMock.headerRows}
          rows={powerConsumptionTableMock.rows}
          minWidth={powerConsumptionTableMock.minWidth}
        />
      </PageCard>

      <DetailToggleBar label="인버터 상세 내역 보기" expanded={expanded} onClick={() => setExpanded((value) => !value)} />

      <CollapsibleContent open={expanded}>
        <PageCard
          actions={
            <ExcelSaveButton
              fileName="전력소비현황_BANK상세내역"
              sheets={[
                {
                  name: 'BANK 상세 내역',
                  headerRows: powerConsumptionBankTableMock.headerRows,
                  rows: powerConsumptionBankTableMock.rows
                }
              ]}
            />
          }
          className="power-consumption-table-section__panel"
        >
          <BasicTable
            ariaLabel={powerConsumptionBankTableMock.ariaLabel}
            headerRows={powerConsumptionBankTableMock.headerRows}
            rows={powerConsumptionBankTableMock.rows}
            minWidth={powerConsumptionBankTableMock.minWidth}
          />
        </PageCard>
      </CollapsibleContent>
    </div>
  );
}
