import { PageHeading } from '../../../../shared/ui/PageHeading';
import { usePlantOperationStatus } from '../hooks/usePlantOperationStatus';
import { PlantOperationDiagramSection } from '../sections/PlantOperationDiagramSection';

/*
 * 필요: PPT와 발전소 운영현황 이미지 기준의 메인 대시보드 화면을 연결한다.
 * 연결: usePlantOperationStatus, PlantOperationDiagramSection, AppRouter, Sidebar.
 * 설명: page는 API 조회 상태를 받고, 섹션은 받은 ViewModel만 렌더링한다.
 * 수정: 화면 제목 또는 조회 주기가 바뀌면 PageHeading과 hook 사용부만 확인한다.
 */
export function PlantOperationStatusPage() {
  const { data, isLoading, errorMessage } = usePlantOperationStatus();

  return (
    <div className="page-stack plant-operation-page">
      <PageHeading title="발전소 운영현황" />
      <PlantOperationDiagramSection data={data} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
