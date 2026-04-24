import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { ActionButton } from '../../shared/ui/ActionButton';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import {
  hourlyLabels,
  supportBarSeries,
  supportBatteryLine,
  supportDieselLine,
  supportRows
} from '../../data/mock/dashboard';

export function SupportGenerationPage() {
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
        data: hourlyLabels,
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
          data: supportBarSeries
        },
        {
          name: 'Batt kWh',
          type: 'line',
          smooth: true,
          data: supportBatteryLine
        },
        {
          name: 'Diesel kWh',
          type: 'line',
          smooth: true,
          data: supportDieselLine
        }
      ]
    }),
    []
  );

  return (
    <div className="page-stack">
      <PageHeading
        title="보조발전"
        actions={<ActionButton variant="ghost">출력 주기 1시간</ActionButton>}
      />

      <PageCard title="보조발전 그래프" subtitle="총 디젤 + 배터리 방전 kWh / 배터리 방전 kWh / 디젤 발전 kWh">
        <BaseChart option={option} height={360} />
      </PageCard>

      <PageCard
        title="Diesel 상세 내역 보기"
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline">Diesel #1</ActionButton>
            <ActionButton variant="success">전체엑셀 저장</ActionButton>
          </div>
        }
      >
        <BasicTable
          headers={['TIME', 'TOTAL', 'BATT', 'DIESEL', 'PF', 'V', 'FR', 'TEMP', 'TODAY kWh']}
          rows={supportRows}
        />
      </PageCard>
    </div>
  );
}
