import { PageHeading } from '../../../../shared/ui/PageHeading';
import { BaseGenerationSummarySection } from '../sections/BaseGenerationSummarySection';
import { BaseGenerationTableSection } from '../sections/BaseGenerationTableSection';
import '../styles/BaseGenerationPage.css';

/*
 * 필요: 기저발전 화면의 제목, 상단 요약, 하단 상세 표 순서를 유지한다.
 * 연결: BaseGenerationSummarySection, BaseGenerationTableSection.
 * 설명: 페이지는 섹션 조립만 담당하고 차트/표 데이터는 section과 mock에 둔다.
 * 수정: 화면 전체 여백은 styles/BaseGenerationPage.css에서 조정한다.
 */
export function BaseGenerationPage() {
  return (
    <div className="page-stack base-generation-page">
      <PageHeading title="기저발전" />
      <BaseGenerationSummarySection />
      <BaseGenerationTableSection />
    </div>
  );
}
