import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { HistorySearchBar } from '../../../../shared/ui/HistorySearchBar';
import { gridBaseGenerationHistoryFilterMock } from '../mock/gridBaseGenerationHistoryFilterMock';
import type { GridBaseGenerationHistoryMode } from '../types/gridBaseGenerationHistory';

type GridBaseGenerationHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<GridBaseGenerationHistoryMode>) => void;
};

/*
 * 필요: Year, Month, Duration 조회 조건 UI를 이력 화면 상단에 붙인다.
 * 연결: HistorySearchBar, gridBaseGenerationHistoryFilterMock.
 * 설명: 검색 폼은 상태 재현만 담당하고 실제 조회 API는 호출하지 않는다.
 * 수정: 기본 선택값은 mock/gridBaseGenerationHistoryFilterMock.ts에서 조정한다.
 */
export function GridBaseGenerationHistorySearchSection({ onSearch }: GridBaseGenerationHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={gridBaseGenerationHistoryFilterMock.modes}
      defaultMode={gridBaseGenerationHistoryFilterMock.defaultMode}
      defaultStartDate={gridBaseGenerationHistoryFilterMock.defaultStartDate}
      defaultEndDate={gridBaseGenerationHistoryFilterMock.defaultEndDate}
      onSearch={onSearch}
    />
  );
}
