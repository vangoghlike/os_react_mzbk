import { HistorySearchBar, type HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { supportGenerationHistoryFilterMock } from '../mock/supportGenerationHistoryFilterMock';
import type { SupportGenerationHistoryMode } from '../types/supportGenerationHistory';

type SupportGenerationHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<SupportGenerationHistoryMode>) => void;
};

/*
 * 필요: 보조발전 이력 조회 조건 UI를 page heading action 영역에 연결한다.
 * 연결: HistorySearchBar, supportGenerationHistoryFilterMock.
 * 설명: 실제 조회 호출 없이 선택 조건만 상위 page로 전달한다.
 * 수정: 조회 모드와 기본 날짜는 mock 파일에서 조정한다.
 */
export function SupportGenerationHistorySearchSection({ onSearch }: SupportGenerationHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={supportGenerationHistoryFilterMock.modes}
      defaultMode={supportGenerationHistoryFilterMock.defaultMode}
      defaultStartDate={supportGenerationHistoryFilterMock.defaultStartDate}
      defaultEndDate={supportGenerationHistoryFilterMock.defaultEndDate}
      onSearch={onSearch}
    />
  );
}
