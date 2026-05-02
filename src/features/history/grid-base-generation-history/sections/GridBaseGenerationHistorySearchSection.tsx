import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { HistorySearchBar } from '../../../../shared/ui/HistorySearchBar';
import {
  gridBaseGenerationHistoryDefaultCriteria,
  gridBaseGenerationHistoryModes
} from '../constants/gridBaseGenerationHistoryConfig';
import type { GridBaseGenerationHistoryMode } from '../types/gridBaseGenerationHistory';

type GridBaseGenerationHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<GridBaseGenerationHistoryMode>) => void;
};

/*
 * 필요: Year, Month, Duration 조회 조건 UI를 이력 화면 상단에 붙인다.
 * 연결: HistorySearchBar, gridBaseGenerationHistoryConfig.
 * 설명: 검색 폼은 조건 상태만 만들고 결과 영역이 해당 조건으로 API를 조회한다.
 * 수정: 모드 목록과 기본 날짜는 constants 파일에서 조정한다.
 */
export function GridBaseGenerationHistorySearchSection({ onSearch }: GridBaseGenerationHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={gridBaseGenerationHistoryModes}
      defaultMode={gridBaseGenerationHistoryDefaultCriteria.mode}
      defaultStartDate={gridBaseGenerationHistoryDefaultCriteria.startDate}
      defaultEndDate={gridBaseGenerationHistoryDefaultCriteria.endDate}
      onSearch={onSearch}
    />
  );
}
