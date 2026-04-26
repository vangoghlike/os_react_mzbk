import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import type { HistorySearchCriteria } from '../../../../shared/ui/HistorySearchBar';
import { MetricTabs } from '../../../../shared/ui/MetricTabs';
import { PageCard } from '../../../../shared/ui/PageCard';
import { pcsChargeDischargeHistoryChartMock } from '../mock/pcsChargeDischargeHistoryChartMock';
import { pcsChargeDischargeHistoryMetricTabsMock } from '../mock/pcsChargeDischargeHistoryFilterMock';
import { pcsChargeDischargeHistoryTableMock } from '../mock/pcsChargeDischargeHistoryTableMock';
import type { PcsChargeDischargeHistoryMetric, PcsChargeDischargeHistoryMode } from '../types/pcsChargeDischargeHistory';
import '../styles/PcsChargeDischargeHistoryResultSection.css';

type PcsChargeDischargeHistoryResultSectionProps = {
  searchCriteria: HistorySearchCriteria<PcsChargeDischargeHistoryMode>;
  searchedAt: string;
};

/*
 * 필요: PCS 충방전 이력의 지표 탭, 충전/방전 차트, 상세 표를 배치한다.
 * 연결: MetricTabs, BaseChart, BasicTable, ExcelSaveButton, pcs history mock.
 * 설명: 탭별 충전/방전 series는 mock에서 받아 화면 상태만 재현한다.
 * 수정: 결과 패널 스타일은 styles/PcsChargeDischargeHistoryResultSection.css에서 조정한다.
 */
export function PcsChargeDischargeHistoryResultSection({ searchCriteria, searchedAt }: PcsChargeDischargeHistoryResultSectionProps) {
  const [metric, setMetric] = useState<PcsChargeDischargeHistoryMetric>('Max kWh');

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#e10000'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 64, containLabel: true },
      xAxis: {
        type: 'category',
        data: pcsChargeDischargeHistoryChartMock.labels,
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
          name: '충전 표시',
          type: 'bar',
          stack: 'charge',
              barWidth: 44,
          data: pcsChargeDischargeHistoryChartMock.chargeSeriesByMetric[metric]
        },
        {
          name: '방전 표시',
          type: 'bar',
          stack: 'charge',
              barWidth: 44,
          data: pcsChargeDischargeHistoryChartMock.dischargeSeriesByMetric[metric]
        }
      ]
    }),
    [metric]
  );

  return (
    <PageCard className="pcs-charge-history-result">
      <MetricTabs
        ariaLabel="PCS 충방전 이력 지표"
        value={metric}
        options={pcsChargeDischargeHistoryMetricTabsMock}
        onChange={setMetric}
      />
      <div className="history-query-status" aria-live="polite">
        조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
      </div>
      <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
      <div className="pcs-charge-history-result__table">
        <ExcelSaveButton
          fileName={`PCS_충방전_이력_${searchCriteria.mode}`}
          sheets={[
            {
              name: 'PCS 충방전 이력',
              headerRows: pcsChargeDischargeHistoryTableMock.headerRows,
              rows: pcsChargeDischargeHistoryTableMock.rows
            }
          ]}
        />
        <BasicTable
          ariaLabel={pcsChargeDischargeHistoryTableMock.ariaLabel}
          headerRows={pcsChargeDischargeHistoryTableMock.headerRows}
          rows={pcsChargeDischargeHistoryTableMock.rows}
          minWidth={pcsChargeDischargeHistoryTableMock.minWidth}
        />
      </div>
    </PageCard>
  );
}
