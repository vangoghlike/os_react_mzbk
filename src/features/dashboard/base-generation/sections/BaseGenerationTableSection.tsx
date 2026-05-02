import { useState } from 'react';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DataTableCard } from '../../../../shared/ui/DataTableCard';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { EquipmentSelect } from '../../../../shared/ui/EquipmentSelect';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { BaseGenerationTableData } from '../types/baseGeneration';
import '../styles/BaseGenerationTableSection.css';

type BaseGenerationTableSectionProps = {
  tables: BaseGenerationTableData;
};

/*
 * 필요: 운전 상세 표, 인버터 상세 접기/펼치기, 장비 선택, 엑셀 버튼을 배치한다.
 * 연결: DataTableCard, DetailToggleBar, EquipmentSelect, ExcelSaveButton, useBaseGenerationStatus.
 * 설명: 표 구조와 엑셀 액션은 공통 카드가 맡고, 접힘/장비 선택만 화면 상태로 둔다.
 * 수정: 표 폭과 패널 간격은 styles/BaseGenerationTableSection.css에서 조정한다.
 */
export function BaseGenerationTableSection({ tables }: BaseGenerationTableSectionProps) {
  // 하단 상세 표를 분리해 요약 차트 수정과 충돌하지 않게 둔다.
  const [inverterExpanded, setInverterExpanded] = useState(tables.inverterTable.defaultExpanded);
  const [selectedInverter, setSelectedInverter] = useState(tables.inverterTable.defaultEquipmentValue);

  return (
    <div className="base-generation-table-section">
      <DataTableCard
        ariaLabel={tables.powerTable.ariaLabel}
        headerRows={tables.powerTable.headerRows}
        rows={tables.powerTable.rows}
        minWidth={tables.powerTable.minWidth}
        excel={{ fileName: '기저발전_운전상세현황', sheetName: '운전 상세 현황' }}
      />

      <DetailToggleBar
        label="인버터 상세 내역 보기"
        expanded={inverterExpanded}
        onClick={() => setInverterExpanded((current) => !current)}
      />

      <CollapsibleContent open={inverterExpanded}>
        <DataTableCard
          ariaLabel={tables.inverterTable.ariaLabel}
          headerRows={tables.inverterTable.headerRows}
          rows={tables.inverterTable.rows}
          minWidth={tables.inverterTable.minWidth}
          actions={
            <div className="inline-actions">
              <EquipmentSelect
                aria-label="기저발전 GRID 선택"
                value={selectedInverter}
                onChange={(event) => setSelectedInverter(event.target.value)}
                options={tables.inverterTable.equipmentOptions}
              />
              <ExcelSaveButton
                fileName={`기저발전_${selectedInverter}_상세내역`}
                sheets={[
                  {
                    name: '인버터 상세 내역',
                    headerRows: tables.inverterTable.headerRows,
                    rows: tables.inverterTable.rows
                  }
                ]}
              />
            </div>
          }
        />
      </CollapsibleContent>
    </div>
  );
}
