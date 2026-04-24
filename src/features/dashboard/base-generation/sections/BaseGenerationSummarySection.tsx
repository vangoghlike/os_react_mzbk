import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { PageCard } from '../../../../shared/ui/PageCard';
import {
  baseGenerationDistributionChartData,
  baseGenerationHourlyLabels,
  baseGenerationPfSeries,
  baseGenerationTotalOutputSeries
} from '../mock/baseGenerationChartMock';
import {
  baseGenerationSummaryColumns,
  baseGenerationSummaryMetrics
} from '../mock/baseGenerationSummaryMock';
import './BaseGenerationSummarySection.css';

export function BaseGenerationSummarySection() {
  // 상단 요약, 비중표, 추이 차트를 한 구역으로 묶어 수정 범위를 줄인다.
  const distributionOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 8,
        left: 22,
        textStyle: { color: '#cfd6e8' },
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 14,
        icon: 'circle'
      },
      series: [
        {
          type: 'pie',
          radius: ['58%', '78%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: false,
          label: { show: false },
          itemStyle: {
            borderColor: '#060c1a',
            borderWidth: 6
          },
          data: baseGenerationDistributionChartData
        }
      ]
    }),
    []
  );

  const outputTrendOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: {
        bottom: 0,
        textStyle: { color: '#cfd6e8' }
      },
      grid: {
        left: 10,
        right: 10,
        top: 28,
        bottom: 36,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: baseGenerationHourlyLabels,
        axisLabel: { color: '#aab3c5' },
        axisLine: { lineStyle: { color: '#2f3a52' } }
      },
      yAxis: [
        {
          type: 'value',
          name: '전체 kWh',
          nameTextStyle: { color: '#aab3c5' },
          axisLabel: { color: '#aab3c5' },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
        },
        {
          type: 'value',
          name: 'PF',
          nameTextStyle: { color: '#aab3c5' },
          axisLabel: { color: '#aab3c5' },
          splitLine: { show: false },
          min: 0.7,
          max: 1
        }
      ],
      series: [
        {
          name: '전체 발전량',
          type: 'bar',
          itemStyle: {
            color: '#3897ff'
          },
          barWidth: 26,
          data: baseGenerationTotalOutputSeries
        },
        {
          name: 'PF',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          showSymbol: true,
          symbolSize: 7,
          lineStyle: {
            color: '#e2ff34',
            width: 2
          },
          itemStyle: {
            color: '#f7ff88',
            borderColor: '#d3ff38',
            borderWidth: 2
          },
          data: baseGenerationPfSeries
        }
      ]
    }),
    []
  );

  return (
    <PageCard className="card--tight">
      <div className="grid grid--top-summary">
        <div className="grid__donut">
          <h4 className="section-title">발전 비중</h4>
          <BaseChart option={distributionOption} height={280} />
        </div>

        <div className="grid__table base-generation-summary__matrix-scroll">
          <div className="mini-matrix base-generation-summary__matrix">
            <div className="mini-matrix__row mini-matrix__row--head">
              <span />
              {baseGenerationSummaryColumns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>

            {baseGenerationSummaryMetrics.map((metric) => (
              <div key={metric.label} className="mini-matrix__row">
                <span>{metric.label}</span>
                {metric.values.map((value, index) => (
                  <span key={`${metric.label}-${index}`}>{value}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="base-generation-summary__chart-scroll">
        <BaseChart className="base-generation-summary__trend-chart" option={outputTrendOption} height={360} />
      </div>
    </PageCard>
  );
}
