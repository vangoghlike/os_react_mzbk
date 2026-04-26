import { PageHeading } from '../../../../shared/ui/PageHeading';
import { PowerConsumptionSummarySection } from '../sections/PowerConsumptionSummarySection';
import { PowerConsumptionTableSection } from '../sections/PowerConsumptionTableSection';

/*
 * 필요: 전력 소비 현황 화면의 상단 요약과 하단 상세 표를 page에서 조립한다.
 * 연결: PowerConsumptionSummarySection, PowerConsumptionTableSection.
 * 설명: 신규 이미지 기준 큰 구조만 잡고 메뉴 위치 확정은 후속 확인으로 둔다.
 * 수정: 화면 전체 배치는 공통 page-stack과 각 section styles에서 조정한다.
 */
export function PowerConsumptionStatusPage() {
  return (
    <div className="page-stack">
      <PageHeading title="전력 소비 현황" />
      <PowerConsumptionSummarySection />
      <PowerConsumptionTableSection />
    </div>
  );
}
