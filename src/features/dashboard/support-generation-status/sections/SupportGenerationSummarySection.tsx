import { ChartSummaryPanel } from '../../../../shared/ui/ChartSummaryPanel';
import {
  supportGenerationDistributionChartMock,
  supportGenerationSummaryColumns,
  supportGenerationSummaryLegendLabels,
  supportGenerationSummaryMetrics
} from '../mock/supportGenerationSummaryMock';
import { supportGenerationTrendChartMock } from '../mock/supportGenerationTrendChartMock';

/*
 * 필요: 보조발전 상단 그래프 패널을 공통 ChartSummaryPanel 데이터로 연결한다.
 * 연결: ChartSummaryPanel, supportGeneration summary/trend mock.
 * 설명: 그래프 타입과 개수만 데이터로 넘기고 레이아웃/폰트/범례는 공통 컴포넌트가 담당한다.
 * 수정: 보조발전 값과 series 구성은 mock 파일에서 조정한다.
 */
export function SupportGenerationSummarySection() {
  return (
    <ChartSummaryPanel
      donutTitle="그래프 제목"
      donutData={supportGenerationDistributionChartMock}
      donutLegendLabels={supportGenerationSummaryLegendLabels}
      donutColors={['#25b6fe', '#396985', '#cdced2']}
      summaryAriaLabel="보조 발전현황 요약"
      summaryColumns={supportGenerationSummaryColumns}
      summaryMetrics={supportGenerationSummaryMetrics}
      chartLabels={supportGenerationTrendChartMock.labels}
      chartYAxisName="Total kWh"
      chartSeries={[
        { name: '그래프 명1', type: 'bar', data: supportGenerationTrendChartMock.totalOutputSeries },
        { name: '그래프 명2', type: 'line', data: supportGenerationTrendChartMock.batteryOutputSeries },
        { name: '그래프 명3', type: 'line', data: supportGenerationTrendChartMock.dieselOutputSeries }
      ]}
    />
  );
}
