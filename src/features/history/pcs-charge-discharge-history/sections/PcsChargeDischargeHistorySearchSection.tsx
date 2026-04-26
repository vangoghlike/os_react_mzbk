import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { HistorySearchBar } from '../../../../shared/ui/HistorySearchBar';
import { pcsChargeDischargeHistoryFilterMock } from '../mock/pcsChargeDischargeHistoryFilterMock';
import type { PcsChargeDischargeHistoryMode } from '../types/pcsChargeDischargeHistory';

type PcsChargeDischargeHistorySearchSectionProps = {
  onSearch: (criteria: HistorySearchCriteria<PcsChargeDischargeHistoryMode>) => void;
};

/*
 * 필요: PCS 이력의 기간 선택 검색 UI를 공통 검색바로 표시한다.
 * 연결: HistorySearchBar, pcsChargeDischargeHistoryFilterMock.
 * 설명: 조회 버튼은 퍼블리싱 상태만 보여 주며 실제 데이터 호출은 없다.
 * 수정: 기본 선택값은 mock/pcsChargeDischargeHistoryFilterMock.ts에서 조정한다.
 */
export function PcsChargeDischargeHistorySearchSection({ onSearch }: PcsChargeDischargeHistorySearchSectionProps) {
  return (
    <HistorySearchBar
      modes={pcsChargeDischargeHistoryFilterMock.modes}
      defaultMode={pcsChargeDischargeHistoryFilterMock.defaultMode}
      defaultStartDate={pcsChargeDischargeHistoryFilterMock.defaultStartDate}
      defaultEndDate={pcsChargeDischargeHistoryFilterMock.defaultEndDate}
      onSearch={onSearch}
    />
  );
}
