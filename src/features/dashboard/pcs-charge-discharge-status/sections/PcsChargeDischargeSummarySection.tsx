import { ChartSummaryPanel } from '../../../../shared/ui/ChartSummaryPanel';
import {
  pcsChargeDischargeChartMock,
  pcsChargeDischargeDistributionMock,
  pcsChargeDischargeSummaryColumns,
  pcsChargeDischargeSummaryLegendLabels,
  pcsChargeDischargeSummaryMetrics
} from '../mock/pcsChargeDischargeChartMock';

/*
 * 필요: PCS 충방전 도넛, 요약 표, 충전/방전 막대 차트를 구성한다.
 * 연결: ChartSummaryPanel, pcsChargeDischargeChartMock.
 * 설명: 충전/방전 series는 mock만 사용하고 공통 현황형 패널로 렌더링한다.
 * 수정: 색상/패딩/축/도넛 형태는 ChartSummaryPanel에서 공통 조정한다.
 */
export function PcsChargeDischargeSummarySection() {
  return (
    <ChartSummaryPanel
      donutTitle="그래프 제목"
      donutData={pcsChargeDischargeDistributionMock}
      donutLegendLabels={pcsChargeDischargeSummaryLegendLabels}
      donutColors={['#25b6fe', '#cdced2']}
      summaryAriaLabel="PCS 충방전 요약"
      summaryColumns={pcsChargeDischargeSummaryColumns}
      summaryMetrics={pcsChargeDischargeSummaryMetrics}
      chartLabels={pcsChargeDischargeChartMock.labels}
      chartYAxisName="Total kWh"
      chartSeries={[
        { name: '충전 표시', type: 'bar', stack: 'charge', data: pcsChargeDischargeChartMock.chargeSeries },
        { name: '방전 표시', type: 'bar', stack: 'charge', data: pcsChargeDischargeChartMock.dischargeSeries }
      ]}
    />
  );
}
