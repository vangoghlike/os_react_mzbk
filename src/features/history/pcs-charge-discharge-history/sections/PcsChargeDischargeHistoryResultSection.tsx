import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { DataTableCard } from '../../../../shared/ui/DataTableCard';
import type { SearchConditionCriteria } from '../../../../shared/ui/SearchConditionBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../../../shared/ui/PageDataLoadingFallback';
import { getHourlyChartMaxWidth, getHourlyChartMinWidth } from '../../../../shared/utils/hourlyChartSlots';
import { useMonitoringHistoryViewData } from '../../shared/monitoringHistoryViewData';
import { pcsChargeDischargeHistoryMetrics } from '../constants/pcsChargeDischargeHistoryConfig';
import type { PcsChargeDischargeHistoryMetric, PcsChargeDischargeHistoryMode } from '../types/pcsChargeDischargeHistory';
import '../styles/PcsChargeDischargeHistoryResultSection.css';

type PcsChargeDischargeHistoryResultSectionProps = {
  searchCriteria: SearchConditionCriteria<PcsChargeDischargeHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: PCS 충방전 이력의 지표 탭, 차트, 상세 표를 API 데이터로 배치한다.
 * 연결: useMonitoringHistoryViewData, MetricTabs, BaseChart, DataTableCard.
 * 설명: /monitoring/pcs/history 응답을 공통 history view model로 변환해 사용한다.
 * 수정: 결과 패널 스타일은 styles/PcsChargeDischargeHistoryResultSection.css에서 조정한다.
 */
export function PcsChargeDischargeHistoryResultSection({ searchCriteria, searchedAt }: PcsChargeDischargeHistoryResultSectionProps) {
  const [metric, setMetric] = useState<PcsChargeDischargeHistoryMetric>('Max kWh');
  const isHourlyChart = searchCriteria.mode !== 'Year' && searchCriteria.mode !== 'Month';
  const historyConfig = useMemo(
    () => ({
      resource: 'pcs' as const,
      metrics: pcsChargeDischargeHistoryMetrics,
      tableTitle: 'PCS 충방전 이력',
      minWidth: 1280,
      barField: 'pcsAtpTot',
      lineField: 'pcsDcP',
      fields: [
        { label: 'ACTIVE POWER', key: 'pcsAtpTot' },
        { label: 'DC P', key: 'pcsDcP' },
        { label: 'DC V', key: 'pcsDcV' },
        { label: 'DC A', key: 'pcsDcA' },
        { label: 'PF', key: 'pcsPfTot' },
        { label: 'FR', key: 'pcsFr' }
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
      grid: { left: 64, right: 24, top: 30, bottom: 38, containLabel: true },
      xAxis: {
        type: 'category',
        data: data?.labels ?? [],
        axisLabel: { color: '#b8c2d8' },
        axisLine: { lineStyle: { color: '#354057' } }
      },
      yAxis: {
        type: 'value',
        name: '',
        axisLabel: { color: '#b8c2d8' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      series: [
        {
          name: 'ACTIVE POWER',
          type: 'bar',
          barWidth: 44,
          data: data?.barSeriesByMetric[metric] ?? []
        },
        {
          name: 'DC POWER',
          type: 'line',
          smooth: false,
          data: data?.lineSeriesByMetric[metric] ?? []
        }
      ]
    }),
    [data, metric]
  );

  return (
    <>
    <PageCard className="pcs-charge-history-result pcs-charge-history-result--chart">
      <MetricTabs
        ariaLabel="PCS 충방전 이력 지표"
        value={metric}
        options={pcsChargeDischargeHistoryMetrics}
        onChange={setMetric}
      />
      <div className="sr-only" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      {isLoading && <PageDataLoadingFallback title="PCS 충방전 이력" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && data && (
          <BaseChart
            option={chartOption}
            height={420}
            minWidth={isHourlyChart ? getHourlyChartMinWidth(data.labels.length) : 1120}
            maxWidth={isHourlyChart ? getHourlyChartMaxWidth(data.labels.length) : undefined}
            scrollable
            scrollToCurrentTime={isHourlyChart && data.labels.length <= 24}
            yAxisLabel="Total kWh"
            legendItems={[
              { name: 'ACTIVE POWER', type: 'bar', color: '#2f9cff' },
              { name: 'DC POWER', type: 'line', color: '#f3f6ff' }
            ]}
          />
      )}
    </PageCard>
      {!isLoading && data && (
        <DataTableCard
          className="pcs-charge-history-result__table-card"
          ariaLabel={data.table.ariaLabel}
          headerRows={data.table.headerRows}
          rows={data.table.rows}
          minWidth={data.table.minWidth}
          excel={{ fileName: `PCS_충방전_이력_${searchCriteria.mode}`, sheetName: 'PCS 충방전 이력' }}
        />
      )}
    </>
  );
}
