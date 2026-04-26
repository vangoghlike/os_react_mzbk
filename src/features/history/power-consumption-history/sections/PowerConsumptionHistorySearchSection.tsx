import { HistorySearchBar, type HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { powerConsumptionHistoryFilterMock } from '../mock/powerConsumptionHistoryFilterMock';
import type { PowerConsumptionHistoryMode } from '../types/powerConsumptionHistory';

type PowerConsumptionHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<PowerConsumptionHistoryMode>) => void;
};

/*
 * 필요: 전력소비 이력 조회 조건 UI를 공통 검색바로 연결한다.
 * 연결: HistorySearchBar, powerConsumptionHistoryFilterMock.
 * 설명: 조회 버튼은 mock 상태만 갱신하고 API 호출은 하지 않는다.
 * 수정: 검색 기본값은 mock 파일에서 조정한다.
 */
export function PowerConsumptionHistorySearchSection({ onSearch }: PowerConsumptionHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={powerConsumptionHistoryFilterMock.modes}
      defaultMode={powerConsumptionHistoryFilterMock.defaultMode}
      defaultStartDate={powerConsumptionHistoryFilterMock.defaultStartDate}
      defaultEndDate={powerConsumptionHistoryFilterMock.defaultEndDate}
      onSearch={onSearch}
    />
  );
}
