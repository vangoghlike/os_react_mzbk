import type {
  GridBaseGenerationHistoryFilterMock,
  GridBaseGenerationHistoryMetric
} from '../types/gridBaseGenerationHistory';

/*
 * 필요: GRID 기저발전 이력 검색 모드와 지표 탭 목록.
 * 연결: GridBaseGenerationHistorySearchSection, MetricTabs.
 * 설명: 검색 조건과 지표 목록은 mock에서 관리해 화면 조건문을 줄인다.
 * 수정: 기본 조회 모드와 탭명은 이 파일에서 조정한다.
 */
export const gridBaseGenerationHistoryFilterMock: GridBaseGenerationHistoryFilterMock = {
  modes: ['Year', 'Month', 'Duration'],
  defaultMode: 'Month',
  defaultStartDate: '2026.01.01',
  defaultEndDate: '2026.01.15'
};

export const gridBaseGenerationHistoryMetricTabsMock = ['Max kWh', 'Min kWh', 'AVG kWh'] as const satisfies readonly GridBaseGenerationHistoryMetric[];
