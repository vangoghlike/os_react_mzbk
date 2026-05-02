import { useBaseGenerationStatus } from '../hooks/useBaseGenerationStatus';
import { PageDataLoadingFallback } from '../../../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { BaseGenerationSummarySection } from '../sections/BaseGenerationSummarySection';
import { BaseGenerationTableSection } from '../sections/BaseGenerationTableSection';
import '../styles/BaseGenerationPage.css';

/*
 * 필요: 기저발전 화면의 제목, API 조회, 상단 요약, 하단 상세 표 순서를 유지한다.
 * 연결: useBaseGenerationStatus, BaseGenerationSummarySection, BaseGenerationTableSection.
 * 설명: 페이지는 조회 상태와 섹션 조립만 담당하고, API 필드 변환은 adapter에 둔다.
 * 수정: 화면 전체 여백은 styles/BaseGenerationPage.css에서 조정한다.
 */
export function BaseGenerationPage() {
  const { data, isLoading, errorMessage } = useBaseGenerationStatus();

  return (
    <div className="page-stack base-generation-page">
      <PageHeading title="기저발전" />

      {isLoading && <PageDataLoadingFallback title="기저발전" />}

      {!isLoading && errorMessage && (
        <div className="base-generation-page__message" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && data && (
        <>
          <BaseGenerationSummarySection summary={data.summary} trendChart={data.trendChart} />
          <BaseGenerationTableSection tables={data.tables} />
        </>
      )}
    </div>
  );
}
