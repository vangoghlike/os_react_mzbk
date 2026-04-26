import { ChartSummaryPanel } from '../../../../shared/ui/ChartSummaryPanel';
import {
  powerConsumptionDistributionMock,
  powerConsumptionSummaryColumns,
  powerConsumptionSummaryLegendLabels,
  powerConsumptionSummaryMetrics
} from '../mock/powerConsumptionSummaryMock';
import { powerConsumptionTrendChartMock } from '../mock/powerConsumptionTrendChartMock';

/*
 * 필요: 전력 소비 도넛, BANK 요약 표, 소비 추이 차트를 구성한다.
 * 연결: ChartSummaryPanel, powerConsumption summary/trend mock.
 * 설명: 같은 현황형 그래프 패널은 공통 컴포넌트가 담당하고 화면별 데이터만 mock에서 바꾼다.
 * 수정: 색상/패딩/축/도넛 형태는 ChartSummaryPanel에서 공통 조정한다.
 */
export function PowerConsumptionSummarySection() {
  return (
    <ChartSummaryPanel
      donutTitle="그래프 제목"
      donutData={powerConsumptionDistributionMock}
      donutLegendLabels={powerConsumptionSummaryLegendLabels}
      donutColors={['#25b6fe', '#396985', '#cdced2']}
      summaryAriaLabel="전력 소비 현황 요약"
      summaryColumns={powerConsumptionSummaryColumns}
      summaryMetrics={powerConsumptionSummaryMetrics}
      chartLabels={powerConsumptionTrendChartMock.labels}
      chartYAxisName="Total kWh"
      chartSeries={[
        { name: '그래프 명1', type: 'bar', data: powerConsumptionTrendChartMock.totalDemandSeries },
        { name: '그래프 명2', type: 'line', data: powerConsumptionTrendChartMock.pfSeries }
      ]}
    />
  );
}
