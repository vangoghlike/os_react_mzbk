import { useState } from 'react';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DataTableCard } from '../../../../shared/ui/DataTableCard';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { EquipmentSelect } from '../../../../shared/ui/EquipmentSelect';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import { supportGenerationTableMock } from '../mock/supportGenerationTableMock';
import '../styles/SupportGenerationDetailTableSection.css';

/*
 * 필요: 보조발전 운전 상세 표와 Diesel 상세 접힘 영역을 구성한다.
 * 연결: DataTableCard, DetailToggleBar, EquipmentSelect, ExcelSaveButton, supportGenerationTableMock.
 * 설명: 표 카드 구조는 공통으로 쓰고 장비 선택과 접힘 상태만 화면에서 관리한다.
 * 수정: 상세 패널 간격은 styles/SupportGenerationDetailTableSection.css에서 조정한다.
 */
export function SupportGenerationDetailTableSection() {
  const [expanded, setExpanded] = useState(supportGenerationTableMock.defaultExpanded);
  const [equipment, setEquipment] = useState(supportGenerationTableMock.defaultEquipmentValue);

  return (
    <div className="support-generation-detail">
      <DataTableCard
        title="운전 상세 현황"
        ariaLabel={supportGenerationTableMock.ariaLabel}
        headerRows={supportGenerationTableMock.headerRows}
        rows={supportGenerationTableMock.rows}
        minWidth={supportGenerationTableMock.minWidth}
        excel={{ fileName: '보조발전_운전상세현황', sheetName: '운전 상세 현황' }}
        className="support-generation-detail__panel"
      />

      <DetailToggleBar label="Diesel 상세 내역 보기" expanded={expanded} onClick={() => setExpanded((value) => !value)} />

      <CollapsibleContent open={expanded}>
        <DataTableCard
          ariaLabel="보조 발전현황 장비 상세 내역"
          headerRows={supportGenerationTableMock.headerRows}
          rows={supportGenerationTableMock.rows}
          minWidth={supportGenerationTableMock.minWidth}
          actions={
            <div className="inline-actions">
              <EquipmentSelect
                aria-label="보조발전 장비 선택"
                value={equipment}
                onChange={(event) => setEquipment(event.target.value)}
                options={supportGenerationTableMock.equipmentOptions}
              />
              <ExcelSaveButton
                fileName={`보조발전_${equipment}_상세내역`}
                sheets={[
                  {
                    name: 'Diesel 상세 내역',
                    headerRows: supportGenerationTableMock.headerRows,
                    rows: supportGenerationTableMock.rows
                  }
                ]}
              />
            </div>
          }
          className="support-generation-detail__panel"
        />
      </CollapsibleContent>
    </div>
  );
}
