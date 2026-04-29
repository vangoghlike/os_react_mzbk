import { useState } from 'react';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DataTableCard } from '../../../../shared/ui/DataTableCard';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { powerConsumptionBankTableMock, powerConsumptionTableMock } from '../mock/powerConsumptionTableMock';
import '../styles/PowerConsumptionTableSection.css';

/*
 * 필요: 전력 소비 상세 표와 BANK 상세 접힘 표를 배치한다.
 * 연결: DataTableCard, DetailToggleBar, powerConsumptionTableMock.
 * 설명: 표 카드와 엑셀 액션은 기저발전과 같은 공통 테이블 카드 계약을 따른다.
 * 수정: 상세 영역 간격은 styles/PowerConsumptionTableSection.css에서 조정한다.
 */
export function PowerConsumptionTableSection() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="power-consumption-table-section">
      <DataTableCard
        title=""
        ariaLabel={powerConsumptionTableMock.ariaLabel}
        headerRows={powerConsumptionTableMock.headerRows}
        rows={powerConsumptionTableMock.rows}
        minWidth={powerConsumptionTableMock.minWidth}
        excel={{ fileName: '전력소비현황_상세내역', sheetName: '전력 소비 상세' }}
      />

      <DetailToggleBar label="인버터 상세 내역 보기" expanded={expanded} onClick={() => setExpanded((value) => !value)} />

      <CollapsibleContent open={expanded}>
        <DataTableCard
          ariaLabel={powerConsumptionBankTableMock.ariaLabel}
          headerRows={powerConsumptionBankTableMock.headerRows}
          rows={powerConsumptionBankTableMock.rows}
          minWidth={powerConsumptionBankTableMock.minWidth}
          excel={{ fileName: '전력소비현황_BANK상세내역', sheetName: 'BANK 상세 내역' }}
        />
      </CollapsibleContent>
    </div>
  );
}
