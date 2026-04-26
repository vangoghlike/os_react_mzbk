import { useState } from 'react';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { gridBaseGenerationHistoryFilterMock } from '../mock/gridBaseGenerationHistoryFilterMock';
import { GridBaseGenerationHistoryResultSection } from '../sections/GridBaseGenerationHistoryResultSection';
import { GridBaseGenerationHistorySearchSection } from '../sections/GridBaseGenerationHistorySearchSection';
import type { GridBaseGenerationHistoryMode } from '../types/gridBaseGenerationHistory';

/*
 * 필요: GRID 기저발전 이력의 제목, 검색 조건, 결과 영역을 page에서 연결한다.
 * 연결: PageHeading actions, GridBaseGenerationHistorySearchSection, GridBaseGenerationHistoryResultSection.
 * 설명: 메뉴명과 route 확정 전에도 화면 구조를 독립 feature로 확인할 수 있게 한다.
 * 수정: 검색 조건 노출 위치는 PageHeading actions 연결을 조정한다.
 */
export function GridBaseGenerationHistoryPage() {
  const [searchCriteria, setSearchCriteria] = useState<HistorySearchCriteria<GridBaseGenerationHistoryMode>>({
    mode: gridBaseGenerationHistoryFilterMock.defaultMode,
    startDate: gridBaseGenerationHistoryFilterMock.defaultStartDate,
    endDate: gridBaseGenerationHistoryFilterMock.defaultEndDate
  });
  const [searchedAt, setSearchedAt] = useState('초기 mock 데이터');

  const handleSearch = (nextCriteria: HistorySearchCriteria<GridBaseGenerationHistoryMode>) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  return (
    <div className="page-stack">
      <PageHeading title="GRID 기저발전 이력" actions={<GridBaseGenerationHistorySearchSection onSearch={handleSearch} />} />
      <GridBaseGenerationHistoryResultSection searchCriteria={searchCriteria} searchedAt={searchedAt} />
    </div>
  );
}
