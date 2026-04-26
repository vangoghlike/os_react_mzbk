import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseChart } from '../../../../shared/ui/BaseChart';
import { BasicTable } from '../../../../shared/ui/BasicTable';
import { CollapsibleContent } from '../../../../shared/ui/CollapsibleContent';
import { DetailToggleBar } from '../../../../shared/ui/DetailToggleBar';
import { ExcelSaveButton } from '../../../../shared/ui/ExcelSaveButton';
import { PageCard } from '../../../../shared/ui/PageCard';
import {
  baseGenerationStatusChartMock,
  baseGenerationStatusMetrics,
  baseGenerationStatusSummaryColumns,
  baseGenerationStatusTableMock
} from '../mock/baseGenerationStatusMock';
import '../styles/BaseGenerationStatusScaffoldSection.css';

/*
 * 필요: 기저 발전현황 캡처의 요약 표, 차트, 상세 표 골격을 확인용으로 둔다.
 * 연결: BaseChart, BasicTable, DetailToggleBar, ExcelSaveButton, baseGenerationStatusMock.
 * 설명: 별도 화면 확정 전까지 실제 메뉴 노출 없이 퍼블리싱 비교만 가능하게 한다.
 * 수정: 비교용 패널 간격은 styles/BaseGenerationStatusScaffoldSection.css에서 조정한다.
 */
export function BaseGenerationStatusScaffoldSection() {
  const [inverterExpanded, setInverterExpanded] = useState(false);

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#f3f6ff'],
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { color: '#d6ddea' } },
      grid: { left: 24, right: 24, top: 30, bottom: 54, containLabel: true },
      xAxis: {
        type: 'category',
        data: baseGenerationStatusChartMock.labels,
        axisLabel: { color: '#b8c2d8' },
        axisLine: { lineStyle: { color: '#354057' } }
      },
      yAxis: {
        type: 'value',
        name: 'Total kWh',
        nameTextStyle: { color: '#d6ddea' },
        axisLabel: { color: '#b8c2d8' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      series: [
        { name: '그래프 명1', type: 'bar', barWidth: 44, data: baseGenerationStatusChartMock.outputSeries },
        { name: '그래프 명2', type: 'line', smooth: false, data: baseGenerationStatusChartMock.pfSeries }
      ]
    }),
    []
  );

  return (
    <div className="base-generation-status-scaffold">
      <PageCard>
        <BasicTable
          ariaLabel="기저 발전현황 상단 지표"
          headers={baseGenerationStatusSummaryColumns}
          rows={baseGenerationStatusMetrics.map((metric) => metric.values)}
          minWidth={1280}
        />
        <div className="base-generation-status-scaffold__chart">
          <BaseChart option={chartOption} height={420} minWidth={1100} scrollable />
        </div>
      </PageCard>
      <PageCard
        actions={
          <ExcelSaveButton
            fileName="기저_발전현황_상세내역"
            sheets={[
              {
                name: '기저 발전현황 상세',
                headerRows: baseGenerationStatusTableMock.headerRows,
                rows: baseGenerationStatusTableMock.rows
              }
            ]}
          />
        }
      >
        <BasicTable
          ariaLabel={baseGenerationStatusTableMock.ariaLabel}
          headerRows={baseGenerationStatusTableMock.headerRows}
          rows={baseGenerationStatusTableMock.rows}
          minWidth={baseGenerationStatusTableMock.minWidth}
        />
      </PageCard>
      <DetailToggleBar
        label="인버터 상세 내역 보기"
        expanded={inverterExpanded}
        onClick={() => setInverterExpanded((current) => !current)}
      />
      <CollapsibleContent open={inverterExpanded}>
        <PageCard
          actions={
            <ExcelSaveButton
              fileName="기저_발전현황_인버터상세내역"
              sheets={[
                {
                  name: '인버터 상세 내역',
                  headerRows: baseGenerationStatusTableMock.headerRows,
                  rows: baseGenerationStatusTableMock.rows
                }
              ]}
            />
          }
        >
          <BasicTable
            ariaLabel="기저 발전현황 인버터 상세 내역"
            headerRows={baseGenerationStatusTableMock.headerRows}
            rows={baseGenerationStatusTableMock.rows}
            minWidth={baseGenerationStatusTableMock.minWidth}
          />
        </PageCard>
      </CollapsibleContent>
    </div>
  );
}
