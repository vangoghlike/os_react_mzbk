import { PageHeading } from '../../../../shared/ui/PageHeading';
import { SupportGenerationDetailTableSection } from '../sections/SupportGenerationDetailTableSection';
import { SupportGenerationSummarySection } from '../sections/SupportGenerationSummarySection';

/*
 * 필요: 보조 발전현황의 제목, 요약 섹션, 상세 표 섹션을 분리한다.
 * 연결: SupportGenerationSummarySection, SupportGenerationDetailTableSection.
 * 설명: 기존 임시 page를 feature page로 옮겨 수정 위치를 명확히 한다.
 * 수정: 화면 전체 배치는 공통 page-stack과 각 section styles에서 조정한다.
 */
export function SupportGenerationStatusPage() {
  return (
    <div className="page-stack">
      <PageHeading title="보조 발전현황" />
      <SupportGenerationSummarySection />
      <SupportGenerationDetailTableSection />
    </div>
  );
}
