import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { ActionButton } from '../../shared/ui/ActionButton';
import { PageCard } from '../../shared/ui/PageCard';
import { PageHeading } from '../../shared/ui/PageHeading';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import { batteryDetailRows, chargeSeries, hourlyLabels } from '../../data/mock/dashboard';

export function ChargeDischargePage() {
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
      yAxis: [
        {
          type: 'value',
          name: 'kWh',
          axisLabel: { color: '#aab3c5' },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
        },
        {
          type: 'value',
          name: 'SoC(%)',
          axisLabel: { color: '#aab3c5' },
          min: 0,
          max: 100
        }
      ],
      series: [
        {
          name: '충전량',
          type: 'bar',
          stack: 'energy',
          data: chargeSeries.charge
        },
        {
          name: '방전량',
          type: 'bar',
          stack: 'energy',
          data: chargeSeries.discharge
        },
        {
          name: 'SoC(%)',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: chargeSeries.soc
        }
      ]
    }),
    []
  );

  return (
    <div className="page-stack">
      <PageHeading
        title="충방전 현황"
        actions={<ActionButton variant="ghost">BANK 기준 보기</ActionButton>}
      />

      <PageCard title="Battery 운영 그래프" subtitle="SoC / Charge / Discharge">
        <BaseChart option={option} height={360} />
      </PageCard>

      <PageCard
        title="BATTERY 상세 내역 보기"
        actions={<ActionButton variant="success">전체엑셀 저장</ActionButton>}
      >
        <BasicTable
          headers={['TIME', 'SOC', 'SOH', 'V', 'A', 'RACK V MAX', 'RACK V MIN', 'CELL V MAX', 'CELL V MIN']}
          rows={batteryDetailRows}
        />
      </PageCard>
    </div>
  );
}
