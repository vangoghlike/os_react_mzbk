import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ActionButton } from '../../shared/ui/ActionButton';
import { DateRangeBar, type DateRangeSearchCriteria } from '../../shared/ui/DateRangeBar';
import { ExcelSaveButton } from '../../shared/ui/ExcelSaveButton';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { SegmentedTabs } from '../../shared/ui/SegmentedTabs';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import { reportIvtSeries, reportLabels, reportSummary, reportTableRows, reportTabs, reportTotalSeries } from '../../data/mock/report';

type ReportTab = (typeof reportTabs)[number];

export function OperationReportPage() {
  const [tab, setTab] = useState<ReportTab>('Daily');
  const [searchCriteria, setSearchCriteria] = useState<DateRangeSearchCriteria>({
    startDate: '2026-01-01',
    endDate: '2026-01-08',
    mode: 'Month'
  });
  const [searchedAt, setSearchedAt] = useState('초기 mock 데이터');

  const handleSearch = (nextCriteria: DateRangeSearchCriteria) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: {
        bottom: 0,
        textStyle: { color: '#cfd6e8' }
      },
      grid: {
        left: 16,
        right: 16,
        top: 24,
        bottom: 48,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: reportLabels,
        axisLabel: { color: '#aab3c5' },
        axisLine: { lineStyle: { color: '#2f3a52' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#aab3c5' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      series: [
        {
          name: 'Total kWh',
          type: 'bar',
          barWidth: 26,
          data: reportTotalSeries
        },
        {
          name: 'IVT #1 kWh',
          type: 'line',
          smooth: true,
          data: reportIvtSeries
        }
      ]
    }),
    []
  );

  return (
    <div className="page-stack">
      <PageHeading
        title="운영 리포트"
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline" onClick={() => window.print()}>Print</ActionButton>
            <ExcelSaveButton
              label="Excel Download"
              fileName={`운영리포트_${tab}_${searchCriteria.mode}`}
              sheets={[
                {
                  name: 'Detail Data',
                  headers: ['DATE', 'TOTAL kWh', 'IVT kWh', 'PF AVG', 'V AVG', 'A AVG', 'FR AVG'],
                  rows: reportTableRows
                }
              ]}
            />
          </div>
        }
      />

      <PageCard className="card--tight">
        <SegmentedTabs value={tab} options={reportTabs} onChange={setTab} />
        <div className="gap-16" />
        <DateRangeBar
          defaultStartDate={searchCriteria.startDate}
          defaultEndDate={searchCriteria.endDate}
          defaultMode={searchCriteria.mode}
          onSearch={handleSearch}
        />
        <div className="history-query-status" aria-live="polite">
          조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
        </div>
      </PageCard>

      <PageCard title={`${tab} Operation Report`} subtitle="Summary / Moving Graph / Detail Data">
        <BaseChart option={option} height={360} />
      </PageCard>

      <div className="stat-grid">
        {reportSummary.map((item) => (
          <PageCard key={item.label} className="stat-card">
            <p className="stat-card__label">{item.label}</p>
            <strong className="stat-card__value">{item.value}</strong>
          </PageCard>
        ))}
      </div>

      <PageCard title="Detail Data">
        <BasicTable
          headers={['DATE', 'TOTAL kWh', 'IVT kWh', 'PF AVG', 'V AVG', 'A AVG', 'FR AVG']}
          rows={reportTableRows}
        />
      </PageCard>
    </div>
  );
}
