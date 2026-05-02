import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../../../shared/ui/PageDataLoadingFallback';
import { useMonitoringHistoryViewData } from '../../shared/monitoringHistoryViewData';
import { powerConsumptionHistoryMetrics } from '../constants/powerConsumptionHistoryConfig';
import type { PowerConsumptionHistoryMetric, PowerConsumptionHistoryMode } from '../types/powerConsumptionHistory';
import '../styles/PowerConsumptionHistoryResultSection.css';

type PowerConsumptionHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<PowerConsumptionHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: 전력소비 이력의 지표 탭, 차트, 표, 엑셀 저장을 API 데이터로 묶는다.
 * 연결: useMonitoringHistoryViewData, MetricTabs, BaseChart, BasicTable, ExcelSaveButton.
 * 설명: 전력소비 전용 이력 endpoint 확정 전까지 GRID 이력 API를 기준 데이터로 사용한다.
 * 수정: 결과 영역 간격과 표 위치는 styles/PowerConsumptionHistoryResultSection.css에서 조정한다.
 */
export function PowerConsumptionHistoryResultSection({ searchCriteria, searchedAt }: PowerConsumptionHistoryResultSectionProps) {
  const [metric, setMetric] = useState<PowerConsumptionHistoryMetric>('Max kWh');
  const historyConfig = useMemo(
    () => ({
      resource: 'grid' as const,
      metrics: powerConsumptionHistoryMetrics,
      tableTitle: '전력소비 이력',
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
        {
          name: '유효전력',
          type: 'bar',
          barWidth: 44,
          data: data?.barSeriesByMetric[metric] ?? []
        },
        {
          name: '무효전력',
          type: 'line',
          smooth: false,
          data: data?.lineSeriesByMetric[metric] ?? []
        }
      ]
    }),
    [data, metric]
  );

  return (
    <PageCard className="power-consumption-history-result">
      <MetricTabs
        ariaLabel="전력소비 이력 지표"
        value={metric}
        options={powerConsumptionHistoryMetrics}
        onChange={setMetric}
      />
      <div className="sr-only" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      {isLoading && <PageDataLoadingFallback title="전력소비 이력" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && data && (
        <>
          <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
          <div className="power-consumption-history-result__table">
            <ExcelSaveButton
              fileName={`전력소비_이력_${searchCriteria.mode}`}
              sheets={[{ name: '전력소비 이력', headerRows: data.table.headerRows, rows: data.table.rows }]}
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
