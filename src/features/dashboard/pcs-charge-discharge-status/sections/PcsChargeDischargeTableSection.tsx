import { useState } from 'react';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import { PageCard } from '../../../../shared/ui/PageCard';
import {
  pcsChargeDischargeBatteryTableMock,
  pcsChargeDischargePcsTableMock
} from '../mock/pcsChargeDischargeTableMock';
import '../styles/PcsChargeDischargeTableSection.css';

/*
 * 필요: PCS 상세 표와 BATTERY 상세 접힘 표를 분리해 배치한다.
 * 연결: BasicTable, DetailToggleBar, ExcelSaveButton, pcsChargeDischargeTableMock.
 * 설명: 접힘 상태는 화면 재현용이며 실제 상세 조회는 연결하지 않는다.
 * 수정: 패널 폭과 여백은 styles/PcsChargeDischargeTableSection.css에서 조정한다.
 */
export function PcsChargeDischargeTableSection() {
  const [batteryExpanded, setBatteryExpanded] = useState(true);

  return (
    <div className="pcs-charge-table-section">
      <PageCard
        actions={
          <ExcelSaveButton
            fileName="PCS_충방전_PCS상세내역"
            sheets={[
              {
                name: 'PCS 상세 내역',
                headerRows: pcsChargeDischargePcsTableMock.headerRows,
                rows: pcsChargeDischargePcsTableMock.rows
              }
            ]}
          />
        }
        className="pcs-charge-table-section__panel"
      >
        <BasicTable
          ariaLabel={pcsChargeDischargePcsTableMock.ariaLabel}
          headerRows={pcsChargeDischargePcsTableMock.headerRows}
          rows={pcsChargeDischargePcsTableMock.rows}
          minWidth={pcsChargeDischargePcsTableMock.minWidth}
        />
      </PageCard>

      <DetailToggleBar
        label="BATTERY 상세 내역 보기"
        expanded={batteryExpanded}
        onClick={() => setBatteryExpanded((value) => !value)}
      />

      <CollapsibleContent open={batteryExpanded}>
        <PageCard
          actions={
            <ExcelSaveButton
              fileName="PCS_충방전_BATTERY상세내역"
              sheets={[
                {
                  name: 'BATTERY 상세 내역',
                  headerRows: pcsChargeDischargeBatteryTableMock.headerRows,
                  rows: pcsChargeDischargeBatteryTableMock.rows
                }
              ]}
            />
          }
          className="pcs-charge-table-section__panel"
        >
          <BasicTable
            ariaLabel={pcsChargeDischargeBatteryTableMock.ariaLabel}
            headerRows={pcsChargeDischargeBatteryTableMock.headerRows}
            rows={pcsChargeDischargeBatteryTableMock.rows}
            minWidth={pcsChargeDischargeBatteryTableMock.minWidth}
          />
        </PageCard>
      </CollapsibleContent>
    </div>
  );
}
