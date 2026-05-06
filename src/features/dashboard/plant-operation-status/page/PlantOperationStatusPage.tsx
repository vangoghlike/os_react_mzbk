import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import type { PlantOperationViewMode } from '../api/plantOperationStatusApi';
import { usePlantOperationStatus } from '../hooks/usePlantOperationStatus';
import { PlantOperationDiagramSection } from '../sections/PlantOperationDiagramSection';

function getViewModeFromPath(pathname: string): PlantOperationViewMode {
  return pathname.includes('/plant') ? 'plant' : 'total';
}

/*
 * 필요: PPT와 발전소 운영현황 이미지 기준의 메인 대시보드 화면을 연결한다.
 * 연결: usePlantOperationStatus, PlantOperationDiagramSection, AppRouter, Sidebar.
 * 설명: page는 route로 API 도메인을 결정하고, 조회 대상 셀렉트는 API targetList를 카드 내부로 전달한다.
 * 수정: 화면 제목, route별 도메인, targetId 상세 조회가 바뀌면 이 page와 hook 사용부만 확인한다.
 */
export function PlantOperationStatusPage() {
  const location = useLocation();
  const viewMode = getViewModeFromPath(location.pathname);
  const isTargetSelectable = viewMode === 'plant';
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const { data, isLoading, errorMessage } = usePlantOperationStatus(viewMode, isTargetSelectable ? selectedTargetId : '');
  const targetOptions = useMemo(() => data?.targetOptions ?? [], [data?.targetOptions]);

  useEffect(() => {
    if (!isTargetSelectable || !targetOptions.length) {
      setSelectedTargetId('');
      return;
    }

    if (!targetOptions.some((option) => option.targetId === selectedTargetId)) {
      setSelectedTargetId(targetOptions[0].targetId);
    }
  }, [isTargetSelectable, selectedTargetId, targetOptions]);

  return (
    <div className="page-stack plant-operation-page">
      <PageHeading title="발전소 운영현황" />
      <PlantOperationDiagramSection
        data={data}
        targetOptions={isTargetSelectable ? targetOptions : []}
        selectedTargetId={selectedTargetId}
        onTargetChange={setSelectedTargetId}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}
