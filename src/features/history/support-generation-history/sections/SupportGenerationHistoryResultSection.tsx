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
import { supportGenerationHistoryMetrics } from '../constants/supportGenerationHistoryConfig';
import type { SupportGenerationHistoryMetric, SupportGenerationHistoryMode } from '../types/supportGenerationHistory';
import '../styles/SupportGenerationHistoryResultSection.css';

type SupportGenerationHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<SupportGenerationHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: 보조발전 이력의 지표 탭, 차트, 상세 표, 엑셀 저장을 API 데이터로 구성한다.
 * 연결: useMonitoringHistoryViewData, MetricTabs, BaseChart, BasicTable, ExcelSaveButton.
 * 설명: 보조발전 이력은 ESS 이력 API를 기준으로 받아 공통 history view model로 변환한다.
 * 수정: 차트 높이와 표 간격은 styles/SupportGenerationHistoryResultSection.css에서 조정한다.
 */
export function SupportGenerationHistoryResultSection({ searchCriteria, searchedAt }: SupportGenerationHistoryResultSectionProps) {
  const [metric, setMetric] = useState<SupportGenerationHistoryMetric>('Max kWh');
  const historyConfig = useMemo(
    () => ({
      resource: 'ess' as const,
      metrics: supportGenerationHistoryMetrics,
      tableTitle: '보조발전 이력',
      minWidth: 1280,
      barField: 'essAtpTot',
      lineField: 'essRtpTot',
      fields: [
        { label: 'ACTIVE POWER', key: 'essAtpTot' },
        { label: 'REACTIVE POWER', key: 'essRtpTot' },
        { label: 'APPARENT POWER', key: 'essArpTot' },
        { label: 'PF', key: 'essPfTot' },
        { label: 'SOC', key: 'essPlntSoc' },
        { label: 'SOH', key: 'essPlntSoh' }
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
          name: 'ACTIVE POWER',
          type: 'bar',
          barWidth: 44,
          data: data?.barSeriesByMetric[metric] ?? []
        },
        {
          name: 'REACTIVE POWER',
          type: 'line',
          smooth: false,
          data: data?.lineSeriesByMetric[metric] ?? []
        }
      ]
    }),
    [data, metric]
  );

  return (
    <PageCard className="support-generation-history-result">
      <MetricTabs
        ariaLabel="보조발전 이력 지표"
        value={metric}
        options={supportGenerationHistoryMetrics}
        onChange={setMetric}
      />
      <div className="sr-only" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      {isLoading && <PageDataLoadingFallback title="보조발전 이력" />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && data && (
        <>
          <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
          <div className="support-generation-history-result__table">
            <ExcelSaveButton
              fileName={`보조발전_이력_${searchCriteria.mode}`}
              sheets={[{ name: '보조발전 이력', headerRows: data.table.headerRows, rows: data.table.rows }]}
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
