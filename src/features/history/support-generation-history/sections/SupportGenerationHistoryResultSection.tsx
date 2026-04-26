import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { supportGenerationHistoryChartMock } from '../mock/supportGenerationHistoryChartMock';
import { supportGenerationHistoryMetricTabsMock } from '../mock/supportGenerationHistoryFilterMock';
import { supportGenerationHistoryTableMock } from '../mock/supportGenerationHistoryTableMock';
import type { SupportGenerationHistoryMetric, SupportGenerationHistoryMode } from '../types/supportGenerationHistory';
import '../styles/SupportGenerationHistoryResultSection.css';

type SupportGenerationHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<SupportGenerationHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: 보조발전 이력의 지표 탭, 차트, 상세 표, 엑셀 저장을 한 패널로 구성한다.
 * 연결: MetricTabs, BaseChart, BasicTable, ExcelSaveButton, support history mock.
 * 설명: 탭 변경은 mock series만 바꾸고 실제 데이터 조회는 하지 않는다.
 * 수정: 차트 높이와 표 간격은 styles/SupportGenerationHistoryResultSection.css에서 조정한다.
 */
export function SupportGenerationHistoryResultSection({ searchCriteria, searchedAt }: SupportGenerationHistoryResultSectionProps) {
  const [metric, setMetric] = useState<SupportGenerationHistoryMetric>('Max kWh');

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#c9f21f', '#f4f7ff'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: supportGenerationHistoryChartMock.labels,
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
          data: supportGenerationHistoryChartMock.totalSeriesByMetric[metric]
        },
        {
          name: 'Diesel',
          type: 'line',
              smooth: false,
          data: supportGenerationHistoryChartMock.dieselSeriesByMetric[metric]
        },
        {
          name: 'Battery',
          type: 'line',
              smooth: false,
          data: supportGenerationHistoryChartMock.batterySeriesByMetric[metric]
        }
      ]
    }),
    [metric]
  );

  return (
    <PageCard className="support-generation-history-result">
      <MetricTabs
        ariaLabel="보조발전 이력 지표"
        value={metric}
        options={supportGenerationHistoryMetricTabsMock}
        onChange={setMetric}
      />
      <div className="history-query-status" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
      <div className="support-generation-history-result__table">
        <ExcelSaveButton
          fileName={`보조발전_이력_${searchCriteria.mode}`}
          sheets={[
            {
              name: '보조발전 이력',
              headerRows: supportGenerationHistoryTableMock.headerRows,
              rows: supportGenerationHistoryTableMock.rows
            }
          ]}
        />
        <BasicTable
          ariaLabel={supportGenerationHistoryTableMock.ariaLabel}
          headerRows={supportGenerationHistoryTableMock.headerRows}
          rows={supportGenerationHistoryTableMock.rows}
          minWidth={supportGenerationHistoryTableMock.minWidth}
        />
      </div>
    </PageCard>
  );
}
