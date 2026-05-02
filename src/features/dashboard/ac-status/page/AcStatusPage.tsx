import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { PageCard } from '../../../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../../../shared/ui/PageHeading';
import { useAcStatus } from '../hooks/useAcStatus';
import '../styles/AcStatusPage.css';

/*
 * 필요: /monitoring/ac 공조기 현황을 대시보드와 분리해 표시한다.
 * 연결: useAcStatus, /monitoring/ac/latest, /monitoring/ac/status.
 * 설명: 최신 상태 카드, 온도/습도 차트, 상세 표만 공조기 API 값으로 구성한다.
 * 수정: 공조기 전용 시안이 오면 이 page의 섹션 배치와 CSS만 조정한다.
 */
export function AcStatusPage() {
  const { data, isLoading, errorMessage } = useAcStatus();

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#25b6fe', '#f3f6ff', '#6cd6d0'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea', fontWeight: 300 } },
      grid: { left: 48, right: 28, top: 36, bottom: 72, containLabel: false },
      xAxis: {
        type: 'category',
        data: data?.chart.labels ?? [],
        axisTick: { show: false },
        axisLabel: { color: '#b8c2d8' },
        axisLine: { lineStyle: { color: '#354057' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        { name: '급기 온도', type: 'line', smooth: false, data: data?.chart.supplyTemperatureSeries ?? [] },
        { name: '환기 온도', type: 'line', smooth: false, data: data?.chart.returnTemperatureSeries ?? [] },
        { name: '습도', type: 'bar', barWidth: 36, data: data?.chart.humiditySeries ?? [] }
      ]
    }),
    [data]
  );

  return (
    <div className="page-stack ac-status-page">
      <PageHeading title="공조기현황" />

      {isLoading && <PageDataLoadingFallback title="공조기현황" />}
      {!isLoading && errorMessage && (
        <div className="ac-status-page__message" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && data && (
        <>
          <PageCard title="공조기 최신 현황" className="ac-status-page__latest-card">
            <div className="ac-status-page__latest-list" aria-label="공조기 최신 현황">
              {data.latestItems.map((item) => (
                <div className="ac-status-page__latest-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </PageCard>

          <PageCard title="공조기 온도/습도 추이">
            <BaseChart option={chartOption} height={420} minWidth={1120} scrollable />
          </PageCard>

          <PageCard title="공조기 상세 현황">
            <BasicTable
              ariaLabel={data.table.ariaLabel}
              headerRows={data.table.headerRows}
              rows={data.table.rows}
              minWidth={data.table.minWidth}
            />
          </PageCard>
        </>
      )}
    </div>
  );
}
