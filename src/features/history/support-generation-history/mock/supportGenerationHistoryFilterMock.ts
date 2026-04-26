import type { SupportGenerationHistoryMetric, SupportGenerationHistoryMode } from '../types/supportGenerationHistory';

/*
 * 필요: 보조발전 이력의 조회 유형과 지표 탭 기본값.
 * 연결: SupportGenerationHistorySearchSection, SupportGenerationHistoryResultSection.
 * 설명: 조회 API 없이 선택 상태만 재현하므로 필터 기본값을 mock으로 둔다.
 * 수정: 기본 조회 기간이나 탭 라벨은 이 파일에서 조정한다.
 */
export const supportGenerationHistoryFilterMock = {
  modes: ['Year', 'Month', 'Duration'] as readonly SupportGenerationHistoryMode[],
  defaultMode: 'Month' as SupportGenerationHistoryMode,
  defaultStartDate: '2026-01-01',
  defaultEndDate: '2026-01-30'
};

export const supportGenerationHistoryMetricTabsMock: readonly SupportGenerationHistoryMetric[] = [
  'Max kWh',
  'Min kWh',
  'AVG kWh',
  'Max D kWh',
  'Min D kWh',
  'AVG D kWh'
];
