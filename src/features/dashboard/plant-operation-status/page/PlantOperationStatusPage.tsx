import { PageHeading } from '../../../../shared/ui/PageHeading';
import { PlantOperationDiagramSection } from '../sections/PlantOperationDiagramSection';

/*
 * 필요: PPT와 발전소 운영현황 이미지 기준의 메인 대시보드 화면을 연결한다.
 * 연결: PlantOperationDiagramSection, AppRouter, Sidebar.
 * 설명: 설비 토폴로지는 섹션에서 관리하고 page는 제목과 화면 조립만 담당한다.
 * 수정: 화면 제목 또는 상단 액션이 생기면 이 파일에서 PageHeading만 조정한다.
 */
export function PlantOperationStatusPage() {
  return (
    <div className="page-stack">
      <PageHeading title="발전소 운영현황" />
      <PlantOperationDiagramSection />
    </div>
  );
}
