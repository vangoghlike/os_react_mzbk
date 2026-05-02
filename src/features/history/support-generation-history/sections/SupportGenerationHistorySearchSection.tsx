import { HistorySearchBar, type HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import {
  supportGenerationHistoryDefaultCriteria,
  supportGenerationHistoryModes
} from '../constants/supportGenerationHistoryConfig';
import type { SupportGenerationHistoryMode } from '../types/supportGenerationHistory';

type SupportGenerationHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<SupportGenerationHistoryMode>) => void;
};

/*
 * 필요: 보조발전 이력 조회 조건 UI를 page heading action 영역에 연결한다.
 * 연결: HistorySearchBar, supportGenerationHistoryConfig.
 * 설명: 선택 조건을 상위 page로 전달하고 결과 영역의 API 조회 조건으로 사용한다.
 * 수정: 조회 모드와 기본 날짜는 constants/supportGenerationHistoryConfig.ts에서 조정한다.
 */
export function SupportGenerationHistorySearchSection({ onSearch }: SupportGenerationHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={supportGenerationHistoryModes}
      defaultMode={supportGenerationHistoryDefaultCriteria.mode}
      defaultStartDate={supportGenerationHistoryDefaultCriteria.startDate}
      defaultEndDate={supportGenerationHistoryDefaultCriteria.endDate}
      onSearch={onSearch}
    />
  );
}
