import { useState } from 'react';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { powerConsumptionHistoryFilterMock } from '../mock/powerConsumptionHistoryFilterMock';
import { PowerConsumptionHistoryResultSection } from '../sections/PowerConsumptionHistoryResultSection';
import { PowerConsumptionHistorySearchSection } from '../sections/PowerConsumptionHistorySearchSection';
import type { PowerConsumptionHistoryMode } from '../types/powerConsumptionHistory';

/*
 * 필요: PPT의 전력소비 이력 화면을 독립 route로 조립한다.
 * 연결: PowerConsumptionHistorySearchSection, PowerConsumptionHistoryResultSection.
 * 설명: 검색 조건과 조회 시각만 page 상태로 관리하고 실제 API는 연결하지 않는다.
 * 수정: 최종 메뉴명 확정 시 제목과 navigationGroups를 같이 조정한다.
 */
export function PowerConsumptionHistoryPage() {
  const [searchCriteria, setSearchCriteria] = useState<HistorySearchCriteria<PowerConsumptionHistoryMode>>({
    mode: powerConsumptionHistoryFilterMock.defaultMode,
    startDate: powerConsumptionHistoryFilterMock.defaultStartDate,
    endDate: powerConsumptionHistoryFilterMock.defaultEndDate
  });
  const [searchedAt, setSearchedAt] = useState('초기 mock 데이터');

  const handleSearch = (nextCriteria: HistorySearchCriteria<PowerConsumptionHistoryMode>) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  return (
    <div className="page-stack">
      <PageHeading title="전력소비 이력" actions={<PowerConsumptionHistorySearchSection onSearch={handleSearch} />} />
      <PowerConsumptionHistoryResultSection searchCriteria={searchCriteria} searchedAt={searchedAt} />
    </div>
  );
}
