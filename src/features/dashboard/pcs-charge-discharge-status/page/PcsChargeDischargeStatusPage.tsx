import { PageHeading } from '../../../../shared/ui/PageHeading';
import { PcsChargeDischargeSummarySection } from '../sections/PcsChargeDischargeSummarySection';
import { PcsChargeDischargeTableSection } from '../sections/PcsChargeDischargeTableSection';

/*
 * 필요: PCS 충방전 화면의 요약 차트와 상세 표를 page에서 조립한다.
 * 연결: PcsChargeDischargeSummarySection, PcsChargeDischargeTableSection.
 * 설명: route는 유지하고 기존 임시 page 대신 feature page가 화면 책임을 가진다.
 * 수정: 화면 전체 배치는 공통 page-stack과 각 section styles에서 조정한다.
 */
export function PcsChargeDischargeStatusPage() {
  return (
    <div className="page-stack">
      <PageHeading title="PCS 충방전" />
      <PcsChargeDischargeSummarySection />
      <PcsChargeDischargeTableSection />
    </div>
  );
}
