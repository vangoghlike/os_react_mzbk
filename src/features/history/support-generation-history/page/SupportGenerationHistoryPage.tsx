import { useState } from 'react';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { supportGenerationHistoryFilterMock } from '../mock/supportGenerationHistoryFilterMock';
import { SupportGenerationHistoryResultSection } from '../sections/SupportGenerationHistoryResultSection';
import { SupportGenerationHistorySearchSection } from '../sections/SupportGenerationHistorySearchSection';
import type { SupportGenerationHistoryMode } from '../types/supportGenerationHistory';

/*
 * 필요: PPT의 보조발전 이력 화면을 독립 route에서 확인할 수 있게 조립한다.
 * 연결: SupportGenerationHistorySearchSection, SupportGenerationHistoryResultSection.
 * 설명: 검색 조건과 조회 시각만 page 상태로 두고 실제 API 호출은 하지 않는다.
 * 수정: 최종 메뉴명이 바뀌면 PageHeading 제목과 navigationGroups를 같이 조정한다.
 */
export function SupportGenerationHistoryPage() {
  const [searchCriteria, setSearchCriteria] = useState<HistorySearchCriteria<SupportGenerationHistoryMode>>({
    mode: supportGenerationHistoryFilterMock.defaultMode,
    startDate: supportGenerationHistoryFilterMock.defaultStartDate,
    endDate: supportGenerationHistoryFilterMock.defaultEndDate
  });
  const [searchedAt, setSearchedAt] = useState('초기 mock 데이터');

  const handleSearch = (nextCriteria: HistorySearchCriteria<SupportGenerationHistoryMode>) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  return (
    <div className="page-stack">
      <PageHeading title="보조발전 이력" actions={<SupportGenerationHistorySearchSection onSearch={handleSearch} />} />
      <SupportGenerationHistoryResultSection searchCriteria={searchCriteria} searchedAt={searchedAt} />
    </div>
  );
}
