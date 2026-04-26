import { ChartSummaryPanel } from '../../../../shared/ui/ChartSummaryPanel';
import { baseGenerationTrendChartMock } from '../mock/baseGenerationChartMock';
import {
  baseGenerationDistributionChartMock,
  baseGenerationSummaryColumns,
  baseGenerationSummaryLegendLabels,
  baseGenerationSummaryMetrics
} from '../mock/baseGenerationSummaryMock';

/*
 * 필요: 기저발전 상단 그래프 패널을 공통 ChartSummaryPanel 데이터로 연결한다.
 * 연결: ChartSummaryPanel, baseGeneration summary/trend mock.
 * 설명: 그래프 개수와 막대/선 타입만 데이터로 넘기고 레이아웃/폰트/범례는 공통 컴포넌트가 담당한다.
 * 수정: 기저발전 값과 series 구성은 mock 파일에서 조정한다.
 */
export function BaseGenerationSummarySection() {
  return (
    <ChartSummaryPanel
      donutTitle="그래프 제목"
      donutData={baseGenerationDistributionChartMock}
      donutLegendLabels={baseGenerationSummaryLegendLabels}
      donutColors={['#25b6fe', '#f3f6ff']}
      summaryAriaLabel="기저발전 요약"
      summaryColumns={baseGenerationSummaryColumns}
      summaryMetrics={baseGenerationSummaryMetrics}
      chartLabels={baseGenerationTrendChartMock.labels}
      chartYAxisName="Total kWh"
      chartSeries={[
        { name: '그래프 명1', type: 'bar', data: baseGenerationTrendChartMock.totalOutputSeries },
        { name: '그래프 명2', type: 'line', data: baseGenerationTrendChartMock.lineSeries, color: '#f3f6ff' }
      ]}
    />
  );
}
