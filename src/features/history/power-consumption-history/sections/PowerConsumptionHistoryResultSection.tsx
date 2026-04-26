import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { powerConsumptionHistoryChartMock } from '../mock/powerConsumptionHistoryChartMock';
import { powerConsumptionHistoryMetricTabsMock } from '../mock/powerConsumptionHistoryFilterMock';
import { powerConsumptionHistoryTableMock } from '../mock/powerConsumptionHistoryTableMock';
import type { PowerConsumptionHistoryMetric, PowerConsumptionHistoryMode } from '../types/powerConsumptionHistory';
import '../styles/PowerConsumptionHistoryResultSection.css';

type PowerConsumptionHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<PowerConsumptionHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: 전력소비 이력의 지표 탭, 차트, 표, 엑셀 저장을 한 결과 패널로 묶는다.
 * 연결: MetricTabs, BaseChart, BasicTable, ExcelSaveButton, power history mock.
 * 설명: 조회 조건과 지표 선택은 화면 상태만 재현하며 실제 조회는 하지 않는다.
 * 수정: 결과 영역 간격과 표 위치는 styles/PowerConsumptionHistoryResultSection.css에서 조정한다.
 */
export function PowerConsumptionHistoryResultSection({ searchCriteria, searchedAt }: PowerConsumptionHistoryResultSectionProps) {
  const [metric, setMetric] = useState<PowerConsumptionHistoryMetric>('Max kWh');

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#c9f21f'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: powerConsumptionHistoryChartMock.labels,
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
          name: 'Total',
          type: 'bar',
              barWidth: 44,
          data: powerConsumptionHistoryChartMock.totalSeriesByMetric[metric]
        },
        {
          name: 'BANK AVG',
          type: 'line',
              smooth: false,
          data: powerConsumptionHistoryChartMock.bankAverageSeriesByMetric[metric]
        }
      ]
    }),
    [metric]
  );

  return (
    <PageCard className="power-consumption-history-result">
      <MetricTabs
        ariaLabel="전력소비 이력 지표"
        value={metric}
        options={powerConsumptionHistoryMetricTabsMock}
        onChange={setMetric}
      />
      <div className="history-query-status" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
      <div className="power-consumption-history-result__table">
        <ExcelSaveButton
          fileName={`전력소비_이력_${searchCriteria.mode}`}
          sheets={[
            {
              name: '전력소비 이력',
              headerRows: powerConsumptionHistoryTableMock.headerRows,
              rows: powerConsumptionHistoryTableMock.rows
            }
          ]}
        />
        <BasicTable
          ariaLabel={powerConsumptionHistoryTableMock.ariaLabel}
          headerRows={powerConsumptionHistoryTableMock.headerRows}
          rows={powerConsumptionHistoryTableMock.rows}
          minWidth={powerConsumptionHistoryTableMock.minWidth}
        />
      </div>
    </PageCard>
  );
}
