import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from './BaseChart';
import { PageCard } from './PageCard';
import { SummaryMatrix, type SummaryMatrixMetric } from './SummaryMatrix';
import './ChartSummaryPanel.css';

const CHART_FONT_FAMILY = 'NotoSansKR-Regular, Noto Sans KR, Malgun Gothic, sans-serif';
const BAR_GRADIENT = {
  type: 'linear' as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: '#25affa' },
    { offset: 1, color: '#1988f6' }
  ]
};
const DEFAULT_BAR_WIDTH = 44;

export type ChartSummaryDonutItem = {
  name: string;
  value: number;
};

export type ChartSummarySeries = {
  name: string;
  type: 'bar' | 'line';
  data: number[];
  color?: string;
  stack?: string;
  barWidth?: number;
  smooth?: boolean;
  showSymbol?: boolean;
};

export type ChartSummaryPanelProps = {
  donutTitle: string;
  donutData: ChartSummaryDonutItem[];
  donutLegendLabels: string[];
  donutColors: string[];
  summaryAriaLabel: string;
  summaryColumns: string[];
  summaryMetrics: SummaryMatrixMetric[];
  chartLabels: string[];
  chartSeries: ChartSummarySeries[];
  chartYAxisName?: string;
  chartHeight?: number;
  chartMinWidth?: number;
  className?: string;
};

/*
 * 필요: 도넛, 요약표, 막대/선 그래프 조합을 하나의 공통 패널로 렌더링한다.
 * 연결: 기저발전, 보조발전, 전력/충방전 등 같은 현황형 화면.
 * 설명: 그래프 개수와 종류는 chartSeries의 type 값으로만 결정하고 화면 컴포넌트는 옵션을 만들지 않는다.
 * 수정: 공통 배치와 차트 기본 축/범례 스타일은 이 파일과 ChartSummaryPanel.css에서 조정한다.
 */
export function ChartSummaryPanel({
  donutTitle,
  donutData,
  donutLegendLabels,
  donutColors,
  summaryAriaLabel,
  summaryColumns,
  summaryMetrics,
  chartLabels,
  chartSeries,
  chartYAxisName = 'Total kWh',
  chartHeight = 360,
  chartMinWidth = 1247,
  className = ''
}: ChartSummaryPanelProps) {
  const getSeriesColor = (series: ChartSummarySeries, index: number) =>
    series.color ?? donutColors[index % donutColors.length] ?? '#25b6fe';
  const summaryMinWidth = summaryColumns.length >= 8 ? 1160 : 880;

  const donutOption = useMemo<EChartsOption>(
    () => ({
      textStyle: { fontFamily: CHART_FONT_FAMILY },
      color: donutColors,
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 0,
        data: donutLegendLabels,
        selectedMode: true,
        inactiveColor: 'rgba(214, 221, 234, 0.38)',
        textStyle: { color: '#d6ddea', fontFamily: CHART_FONT_FAMILY, fontSize: 13, fontWeight: 300 },
        itemWidth: 18,
        itemHeight: 10,
        itemGap: 12
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '78%'],
          center: ['50%', '44%'],
          avoidLabelOverlap: false,
          label: { show: false },
          itemStyle: { borderWidth: 0 },
          data: donutData
        }
      ]
    }),
    [donutColors, donutData, donutLegendLabels]
  );

  const chartOption = useMemo<EChartsOption>(
    () => ({
      textStyle: { fontFamily: CHART_FONT_FAMILY },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderWidth: 0,
        textStyle: { color: '#5f6675', fontFamily: CHART_FONT_FAMILY, fontWeight: 300 },
        axisPointer: {
          type: 'line',
          lineStyle: { color: 'rgba(215, 216, 216, 0.82)', type: 'dashed', width: 1 }
        }
      },
      legend: {
        bottom: 0,
        selectedMode: true,
        inactiveColor: 'rgba(214, 221, 234, 0.38)',
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 18,
        textStyle: { color: '#d6ddea', fontFamily: CHART_FONT_FAMILY, fontSize: 13, fontWeight: 300 }
      },
      grid: { left: 50, right: 24, top: 34, bottom: 76, containLabel: false },
      xAxis: {
        type: 'category',
        data: chartLabels,
        axisTick: { show: false },
        axisLabel: { color: '#b8c2d8', fontFamily: CHART_FONT_FAMILY, fontSize: 13, fontWeight: 300 },
        axisLine: { lineStyle: { color: '#354057' } }
      },
      yAxis: {
        type: 'value',
        name: '',
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: chartSeries.map((series, seriesIndex) => {
        const seriesColor = getSeriesColor(series, seriesIndex);

        return series.type === 'bar'
          ? {
              name: series.name,
              type: 'bar',
              stack: series.stack,
              barWidth: series.barWidth ?? DEFAULT_BAR_WIDTH,
              barMaxWidth: series.barWidth ?? DEFAULT_BAR_WIDTH,
              itemStyle: {
                color:
                  series.color || donutColors.length
                    ? {
                        ...BAR_GRADIENT,
                        colorStops: [
                          { offset: 0, color: seriesColor },
                          {
                            offset: 1,
                            color: seriesColor === '#25b6fe' ? '#1988f6' : seriesColor
                          }
                        ]
                      }
                    : BAR_GRADIENT
              },
              data: series.data
            }
          : {
              name: series.name,
              type: 'line',
              smooth: series.smooth ?? false,
              showSymbol: series.showSymbol ?? true,
              symbolSize: 8,
              lineStyle: { color: seriesColor, width: 2 },
              itemStyle: {
                color: '#ffffff',
                borderColor: seriesColor,
                borderWidth: 2
              },
              data: series.data
            };
      })
    }),
    [chartLabels, chartSeries, chartYAxisName, donutColors]
  );

  return (
    <PageCard className={`card--tight chart-summary-panel ${className}`.trim()}>
      <div className="chart-summary-panel__top">
        <div className="chart-summary-panel__donut">
          <h3>{donutTitle}</h3>
          <BaseChart option={donutOption} height={330} />
        </div>

        <SummaryMatrix
          ariaLabel={summaryAriaLabel}
          columns={summaryColumns}
          metrics={summaryMetrics}
          minWidth={summaryMinWidth}
          className="chart-summary-panel__matrix"
        />
      </div>

      <div className="chart-summary-panel__trend">
        <span className="chart-summary-panel__axis-title">
          {chartYAxisName.split(' ').map((text) => (
            <span key={text}>{text}</span>
          ))}
        </span>
        <BaseChart option={chartOption} height={chartHeight} minWidth={chartMinWidth} scrollable />
      </div>
    </PageCard>
  );
}
