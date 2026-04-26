import { useState } from 'react';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { pcsChargeDischargeHistoryFilterMock } from '../mock/pcsChargeDischargeHistoryFilterMock';
import { PcsChargeDischargeHistoryResultSection } from '../sections/PcsChargeDischargeHistoryResultSection';
import { PcsChargeDischargeHistorySearchSection } from '../sections/PcsChargeDischargeHistorySearchSection';
import type { PcsChargeDischargeHistoryMode } from '../types/pcsChargeDischargeHistory';

/*
 * 필요: PCS 충방전 이력의 제목, 검색 조건, 결과 영역을 page에서 연결한다.
 * 연결: PageHeading actions, PcsChargeDischargeHistorySearchSection, PcsChargeDischargeHistoryResultSection.
 * 설명: 최종 메뉴명 확정 전에도 route 스캐폴딩이 깨지지 않게 유지한다.
 * 수정: route 이름 확정 시 app/router.tsx와 navigation을 같이 확인한다.
 */
export function PcsChargeDischargeHistoryPage() {
  const [searchCriteria, setSearchCriteria] = useState<HistorySearchCriteria<PcsChargeDischargeHistoryMode>>({
    mode: pcsChargeDischargeHistoryFilterMock.defaultMode,
    startDate: pcsChargeDischargeHistoryFilterMock.defaultStartDate,
    endDate: pcsChargeDischargeHistoryFilterMock.defaultEndDate
  });
  const [searchedAt, setSearchedAt] = useState('초기 mock 데이터');

  const handleSearch = (nextCriteria: HistorySearchCriteria<PcsChargeDischargeHistoryMode>) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  return (
    <div className="page-stack">
      <PageHeading title="PCS 충방전 이력" actions={<PcsChargeDischargeHistorySearchSection onSearch={handleSearch} />} />
      <PcsChargeDischargeHistoryResultSection searchCriteria={searchCriteria} searchedAt={searchedAt} />
    </div>
  );
}
