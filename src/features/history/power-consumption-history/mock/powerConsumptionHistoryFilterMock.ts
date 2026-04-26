import type { PowerConsumptionHistoryMetric, PowerConsumptionHistoryMode } from '../types/powerConsumptionHistory';

/*
 * 필요: 전력소비 이력 조회 유형과 지표 탭 기본값.
 * 연결: PowerConsumptionHistorySearchSection, PowerConsumptionHistoryResultSection.
 * 설명: 실제 조회 API 없이 mock 검색 상태를 재현한다.
 * 수정: 기본 조회 기간과 탭 라벨은 이 파일에서 조정한다.
 */
export const powerConsumptionHistoryFilterMock = {
  modes: ['Year', 'Month', 'Duration'] as readonly PowerConsumptionHistoryMode[],
  defaultMode: 'Month' as PowerConsumptionHistoryMode,
  defaultStartDate: '2026-01-01',
  defaultEndDate: '2026-01-30'
};

export const powerConsumptionHistoryMetricTabsMock: readonly PowerConsumptionHistoryMetric[] = ['Max kWh', 'Min kWh', 'AVG kWh'];
