import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../../../shared/ui/PageDataLoadingFallback';
import { gridBaseGenerationHistoryMetrics } from '../constants/gridBaseGenerationHistoryConfig';
import { useMonitoringHistoryViewData } from '../../shared/monitoringHistoryViewData';
import type { GridBaseGenerationHistoryMetric, GridBaseGenerationHistoryMode } from '../types/gridBaseGenerationHistory';
import '../styles/GridBaseGenerationHistoryResultSection.css';

type GridBaseGenerationHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<GridBaseGenerationHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: GRID 이력 차트와 표를 API 이력 데이터로 표시한다.
 * 연결: useMonitoringHistoryViewData, MetricTabs, BaseChart, BasicTable, ExcelSaveButton.
 * 설명: /monitoring/grid/history 응답을 공통 history view model로 변환한다.
 * 수정: GRID 이력 필드 추가/삭제는 config fields만 조정한다.
 */
export function GridBaseGenerationHistoryResultSection({ searchCriteria, searchedAt }: GridBaseGenerationHistoryResultSectionProps) {
  const [metric, setMetric] = useState<GridBaseGenerationHistoryMetric>('Max kWh');
  const historyConfig = useMemo(
    () => ({
      resource: 'grid' as const,
      metrics: gridBaseGenerationHistoryMetrics,
      tableTitle: 'GRID 기저발전 이력',
      minWidth: 1280,
      barField: 'baAtpTot',
      lineField: 'baRtpTot',
      fields: [
        { label: 'TOTAL kWh', key: 'baAtpTot' },
        { label: 'Reactive', key: 'baRtpTot' },
        { label: 'PF', key: 'baPfTot' },
        { label: 'V L12', key: 'baPtpvL12' },
        { label: 'A L1', key: 'baPaL1' },
        { label: 'FR L1', key: 'baPfrL1' }
      ],
      searchCriteria
    }),
    [searchCriteria]
  );
  const { data, isLoading, errorMessage } = useMonitoringHistoryViewData(historyConfig);

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#f3f6ff'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: data?.labels ?? [],
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
        { name: '유효전력', type: 'bar', barWidth: 44, data: data?.barSeriesByMetric[metric] ?? [] },
        { name: '무효전력', type: 'line', smooth: false, data: data?.lineSeriesByMetric[metric] ?? [] }
      ]
    }),
    [data, metric]
  );

  return (
    <PageCard className="grid-base-history-result">
      <MetricTabs ariaLabel="GRID 기저발전 이력 지표" value={metric} options={gridBaseGenerationHistoryMetrics} onChange={setMetric} />
      <div className="sr-only" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>

      {isLoading && <PageDataLoadingFallback title="GRID 기저발전 이력" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && data && (
        <>
          <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
          <div className="grid-base-history-result__table">
            <ExcelSaveButton
              fileName={`GRID_기저발전_이력_${searchCriteria.mode}`}
              sheets={[{ name: 'GRID 기저발전 이력', headerRows: data.table.headerRows, rows: data.table.rows }]}
            />
            <BasicTable
              ariaLabel={data.table.ariaLabel}
              headerRows={data.table.headerRows}
              rows={data.table.rows}
              minWidth={data.table.minWidth}
            />
          </div>
        </>
      )}
    </PageCard>
  );
}
