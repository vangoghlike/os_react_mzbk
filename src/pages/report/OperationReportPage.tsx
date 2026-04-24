import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ActionButton } from '../../shared/ui/ActionButton';
import { DateRangeBar } from '../../shared/ui/DateRangeBar';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { SegmentedTabs } from '../../shared/ui/SegmentedTabs';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import { reportIvtSeries, reportLabels, reportSummary, reportTableRows, reportTabs, reportTotalSeries } from '../../data/mock/report';

type ReportTab = (typeof reportTabs)[number];

export function OperationReportPage() {
  const [tab, setTab] = useState<ReportTab>('Daily');

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
            <ActionButton variant="outline">Print</ActionButton>
            <ActionButton variant="success">Excel Download</ActionButton>
          </div>
        }
      />

      <PageCard className="card--tight">
        <SegmentedTabs value={tab} options={reportTabs} onChange={setTab} />
        <div className="gap-16" />
        <DateRangeBar />
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
