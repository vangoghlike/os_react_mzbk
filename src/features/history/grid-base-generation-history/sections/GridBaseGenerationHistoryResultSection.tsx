import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { gridBaseGenerationHistoryChartMock } from '../mock/gridBaseGenerationHistoryChartMock';
import {
  gridBaseGenerationHistoryMetricTabsMock
} from '../mock/gridBaseGenerationHistoryFilterMock';
import { gridBaseGenerationHistoryTableMock } from '../mock/gridBaseGenerationHistoryTableMock';
import type { GridBaseGenerationHistoryMetric, GridBaseGenerationHistoryMode } from '../types/gridBaseGenerationHistory';
import '../styles/GridBaseGenerationHistoryResultSection.css';

type GridBaseGenerationHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<GridBaseGenerationHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: 지표 탭, 이력 차트, 이력 상세 표, 엑셀 버튼을 한 결과 패널로 묶는다.
 * 연결: MetricTabs, BaseChart, BasicTable, ExcelSaveButton, grid history mock.
 * 설명: 탭 선택에 따라 mock series만 바꾸고 실제 재조회는 하지 않는다.
 * 수정: 결과 표 위치와 차트 높이는 styles/GridBaseGenerationHistoryResultSection.css에서 조정한다.
 */
export function GridBaseGenerationHistoryResultSection({ searchCriteria, searchedAt }: GridBaseGenerationHistoryResultSectionProps) {
  const [metric, setMetric] = useState<GridBaseGenerationHistoryMetric>('Max kWh');

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#f3f6ff'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: gridBaseGenerationHistoryChartMock.labels,
        axisLabel: { color: '#b8c2d8' },
        axisLine: { lineStyle: { color: '#354057' } }
      },
      yAxis: {
        type: 'value',
        name: 'Total kWh',
        nameTextStyle: { color: '#d6ddea' },
        axisLabel: { color: '#b8c2d8' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      series: [
        {
          name: '그래프 명1',
          type: 'bar',
              barWidth: 44,
          data: gridBaseGenerationHistoryChartMock.barSeriesByMetric[metric]
        },
        {
          name: '그래프 명1',
          type: 'line',
              smooth: false,
          data: gridBaseGenerationHistoryChartMock.lineSeriesByMetric[metric]
        }
      ]
    }),
    [metric]
  );

  return (
    <PageCard className="grid-base-history-result">
      <MetricTabs
        ariaLabel="GRID 기저발전 이력 지표"
        value={metric}
        options={gridBaseGenerationHistoryMetricTabsMock}
        onChange={setMetric}
      />
      <div className="history-query-status" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
      <div className="grid-base-history-result__table">
        <ExcelSaveButton
          fileName={`GRID_기저발전_이력_${searchCriteria.mode}`}
          sheets={[
            {
              name: 'GRID 기저발전 이력',
              headerRows: gridBaseGenerationHistoryTableMock.headerRows,
              rows: gridBaseGenerationHistoryTableMock.rows
            }
          ]}
        />
        <BasicTable
          ariaLabel={gridBaseGenerationHistoryTableMock.ariaLabel}
          headerRows={gridBaseGenerationHistoryTableMock.headerRows}
          rows={gridBaseGenerationHistoryTableMock.rows}
          minWidth={gridBaseGenerationHistoryTableMock.minWidth}
        />
      </div>
    </PageCard>
  );
}
