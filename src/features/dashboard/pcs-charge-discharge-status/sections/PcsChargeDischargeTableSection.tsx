import { useState } from 'react';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DataTableCard } from '../../../../shared/ui/DataTableCard';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import {
  pcsChargeDischargeBatteryTableMock,
  pcsChargeDischargePcsTableMock
} from '../mock/pcsChargeDischargeTableMock';
import '../styles/PcsChargeDischargeTableSection.css';

/*
 * 필요: PCS 상세 표와 BATTERY 상세 접힘 표를 분리해 배치한다.
 * 연결: DataTableCard, DetailToggleBar, pcsChargeDischargeTableMock.
 * 설명: 표 카드와 엑셀 액션은 기저발전과 같은 공통 테이블 카드 계약을 따른다.
 * 수정: 패널 폭과 여백은 styles/PcsChargeDischargeTableSection.css에서 조정한다.
 */
export function PcsChargeDischargeTableSection() {
  const [batteryExpanded, setBatteryExpanded] = useState(true);

  return (
    <div className="pcs-charge-table-section">
      <DataTableCard
        title=""
        ariaLabel={pcsChargeDischargePcsTableMock.ariaLabel}
        headerRows={pcsChargeDischargePcsTableMock.headerRows}
        rows={pcsChargeDischargePcsTableMock.rows}
        minWidth={pcsChargeDischargePcsTableMock.minWidth}
        excel={{ fileName: 'PCS_충방전_PCS상세내역', sheetName: 'PCS 상세 내역' }}
      />

      <DetailToggleBar
        label="BATTERY 상세 내역 보기"
        expanded={batteryExpanded}
        onClick={() => setBatteryExpanded((value) => !value)}
      />

      <CollapsibleContent open={batteryExpanded}>
        <DataTableCard
          ariaLabel={pcsChargeDischargeBatteryTableMock.ariaLabel}
          headerRows={pcsChargeDischargeBatteryTableMock.headerRows}
          rows={pcsChargeDischargeBatteryTableMock.rows}
          minWidth={pcsChargeDischargeBatteryTableMock.minWidth}
          excel={{ fileName: 'PCS_충방전_BATTERY상세내역', sheetName: 'BATTERY 상세 내역' }}
        />
      </CollapsibleContent>
    </div>
  );
}
