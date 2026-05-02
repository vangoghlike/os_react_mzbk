import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useLocation } from 'react-router-dom';
import { ApiError } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { formatApiNumber, getDateLabel, getRawValue, readApiField, toChartNumber, toNumber } from '../../shared/api/apiDataUtils';
import { monitoringApi, type ReportResource } from '../../shared/api/monitoringApi';
import type { TableRow } from '../../shared/types/table';
import { ActionButton } from '../../shared/ui/ActionButton';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import { DateRangeBar, type DateRangeSearchCriteria } from '../../shared/ui/DateRangeBar';
import { ExcelSaveButton } from '../../shared/ui/ExcelSaveButton';
import { PageCard } from '../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../shared/ui/PageHeading';
import { SegmentedTabs } from '../../shared/ui/SegmentedTabs';

const reportTabs = ['Daily', 'Monthly', 'Yearly'] as const;

type ReportTab = (typeof reportTabs)[number];

type ReportField = {
  label: string;
  key: string;
};

type ReportConfig = {
  title: string;
  resource: ReportResource;
  totalField: string;
  lineField: string;
  fields: ReportField[];
};

const reportConfigs: Record<ReportResource, ReportConfig> = {
  grid: {
    title: 'GRID 운영 리포트',
    resource: 'grid',
    totalField: 'sumBaAtpTot',
    lineField: 'avgBaAtpTot',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TOTAL kWh', key: 'sumBaAtpTot' },
      { label: 'AVG kWh', key: 'avgBaAtpTot' },
      { label: 'REACTIVE AVG', key: 'avgBaRtpTot' },
      { label: 'APPARENT AVG', key: 'avgBaArpTot' },
      { label: 'PF AVG', key: 'avgBaPfTot' }
    ]
  },
  ess: {
    title: 'ESS 운영 리포트',
    resource: 'ess',
    totalField: 'sumEssAtpTot',
    lineField: 'avgEssAtpTot',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TOTAL kWh', key: 'sumEssAtpTot' },
      { label: 'AVG kWh', key: 'avgEssAtpTot' },
      { label: 'REACTIVE AVG', key: 'avgEssRtpTot' },
      { label: 'APPARENT AVG', key: 'avgEssArpTot' },
      { label: 'PF AVG', key: 'avgEssPfTot' }
    ]
  },
  pcs: {
    title: 'PCS 운영 리포트',
    resource: 'pcs',
    totalField: 'sumPcsAtpTot',
    lineField: 'avgPcsAtpTot',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TOTAL kWh', key: 'sumPcsAtpTot' },
      { label: 'AVG kWh', key: 'avgPcsAtpTot' },
      { label: 'DC P AVG', key: 'avgPcsDcP' },
      { label: 'FR AVG', key: 'avgPcsFr' },
      { label: 'PF AVG', key: 'avgPcsPfTot' }
    ]
  },
  battery: {
    title: '배터리 운영 리포트',
    resource: 'battery',
    totalField: 'avgBatAvgSoc',
    lineField: 'avgBatAvgSoh',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'SOC AVG', key: 'avgBatAvgSoc' },
      { label: 'SOH AVG', key: 'avgBatAvgSoh' },
      { label: 'RACK V AVG', key: 'avgBatRackVAvg' },
      { label: 'RACK A AVG', key: 'avgBatRackAAvg' },
      { label: 'PACK TEMP AVG', key: 'avgBatPackTempAvg' }
    ]
  },
  diesel1: {
    title: '디젤1 운영 리포트',
    resource: 'diesel1',
    totalField: 'sumDslAtpTot',
    lineField: 'avgDslAtpTot',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TOTAL kWh', key: 'sumDslAtpTot' },
      { label: 'AVG kWh', key: 'avgDslAtpTot' },
      { label: 'REACTIVE AVG', key: 'avgDslRtpTot' },
      { label: 'APPARENT AVG', key: 'avgDslArpTot' },
      { label: 'PF AVG', key: 'avgDslPfTot' }
    ]
  },
  diesel2: {
    title: '디젤2 운영 리포트',
    resource: 'diesel2',
    totalField: 'sumDslAtpTot',
    lineField: 'avgDslAtpTot',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TOTAL kWh', key: 'sumDslAtpTot' },
      { label: 'AVG kWh', key: 'avgDslAtpTot' },
      { label: 'REACTIVE AVG', key: 'avgDslRtpTot' },
      { label: 'APPARENT AVG', key: 'avgDslArpTot' },
      { label: 'PF AVG', key: 'avgDslPfTot' }
    ]
  },
  ac: {
    title: '공조기 운영 리포트',
    resource: 'ac',
    totalField: 'avgAcTemp',
    lineField: 'avgAcHumidity',
    fields: [
      { label: 'DATE', key: 'baseDate' },
      { label: 'TEMP AVG', key: 'avgAcTemp' },
      { label: 'HUMIDITY AVG', key: 'avgAcHumidity' },
      { label: 'STATUS COUNT', key: 'dataCount' }
    ]
  }
};

function getResourceFromPath(pathname: string): ReportResource {
  const resource = pathname.split('/').filter(Boolean).at(-1);

  if (resource === 'pcs' || resource === 'battery' || resource === 'diesel1' || resource === 'diesel2' || resource === 'grid' || resource === 'ess' || resource === 'ac') {
    return resource;
  }

  return 'grid';
}

function getReportType(tab: ReportTab) {
  if (tab === 'Monthly') return 'MONTHLY';
  if (tab === 'Yearly') return 'YEARLY';

  return 'DAILY';
}

function sortReportRows(rows: ApiRecord[]) {
  return [...rows].sort((a, b) => getDateLabel(a).localeCompare(getDateLabel(b)));
}

function getAverage(values: number[]) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildSummary(rows: ApiRecord[], totalField: string) {
  const values = rows.map((row) => toNumber(readApiField(row, totalField))).filter((value): value is number => value !== null);
  const maxValue = values.length ? Math.max(...values) : null;
  const minValue = values.length ? Math.min(...values) : null;
  const avgValue = getAverage(values);

  return [
    { label: 'Max', value: maxValue === null ? '-' : formatApiNumber(maxValue) },
    { label: 'Min', value: minValue === null ? '-' : formatApiNumber(minValue) },
    { label: 'AVG', value: avgValue === null ? '-' : formatApiNumber(avgValue) }
  ];
}

function buildTableRows(rows: ApiRecord[], fields: ReportField[]): TableRow[] {
  return rows.map((row) =>
    fields.map((field) => {
      const value = readApiField(row, field.key);

      if (field.key === 'baseDate') {
        return getRawValue(value) || '-';
      }

      return formatApiNumber(value);
    })
  );
}

/*
 * 필요: 운영 리포트를 report API 값으로 표시한다.
 * 연결: /report/{resource}, DateRangeBar, SegmentedTabs, BaseChart, BasicTable, ExcelSaveButton.
 * 설명: 현재 route 마지막 segment로 report resource를 판단하고 조회 조건 변경 시 다시 호출한다.
 * 수정: report 응답 필드가 바뀌면 reportConfigs의 field key만 조정한다.
 */
export function OperationReportPage() {
  const location = useLocation();
  const resource = getResourceFromPath(location.pathname);
  const config = reportConfigs[resource];
  const [tab, setTab] = useState<ReportTab>('Daily');
  const [searchCriteria, setSearchCriteria] = useState<DateRangeSearchCriteria>({
    startDate: '2026-05-01',
    endDate: '2026-05-02',
    mode: 'Month'
  });
  const [searchedAt, setSearchedAt] = useState('조회 전');
  const [rows, setRows] = useState<ApiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadReport() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const nextRows = await monitoringApi.getReport<ApiRecord>(config.resource, {
          startDate: searchCriteria.startDate,
          endDate: searchCriteria.endDate,
          reportType: getReportType(tab)
        });

        if (!mounted) {
          return;
        }

        setRows(sortReportRows(nextRows));
      } catch (error) {
        if (!mounted) {
          return;
        }

        setRows([]);
        setErrorMessage(error instanceof ApiError ? error.message : '리포트 데이터를 불러오지 못했습니다.');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      mounted = false;
    };
  }, [config.resource, searchCriteria.endDate, searchCriteria.startDate, tab]);

  const handleSearch = (nextCriteria: DateRangeSearchCriteria) => {
    setSearchCriteria(nextCriteria);
    setSearchedAt(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
  };

  const labels = useMemo(() => rows.map((row) => getDateLabel(row)), [rows]);
  const totalSeries = useMemo(() => rows.map((row) => toChartNumber(readApiField(row, config.totalField))), [config.totalField, rows]);
  const lineSeries = useMemo(() => rows.map((row) => toChartNumber(readApiField(row, config.lineField))), [config.lineField, rows]);
  const tableRows = useMemo(() => buildTableRows(rows, config.fields), [config.fields, rows]);
  const tableHeaders = useMemo(() => config.fields.map((field) => field.label), [config.fields]);
  const reportSummary = useMemo(() => buildSummary(rows, config.totalField), [config.totalField, rows]);

  const option = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#f3f6ff'],
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
        data: labels,
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
          name: config.fields.find((field) => field.key === config.totalField)?.label ?? 'Total',
          type: 'bar',
          barWidth: 26,
          data: totalSeries
        },
        {
          name: config.fields.find((field) => field.key === config.lineField)?.label ?? 'Average',
          type: 'line',
          smooth: false,
          data: lineSeries
        }
      ]
    }),
    [config.fields, config.lineField, config.totalField, labels, lineSeries, totalSeries]
  );

  return (
    <div className="page-stack">
      <PageHeading
        title={config.title}
        actions={
          <div className="inline-actions">
            <ActionButton variant="outline" onClick={() => window.print()}>Print</ActionButton>
            <ExcelSaveButton
              label="Excel Download"
              fileName={`${config.title}_${tab}_${searchCriteria.mode}`}
              sheets={[{ name: 'Detail Data', headers: tableHeaders, rows: tableRows }]}
            />
          </div>
        }
      />

      <PageCard className="card--tight">
        <SegmentedTabs value={tab} options={reportTabs} onChange={setTab} />
        <div className="gap-16" />
        <DateRangeBar
          defaultStartDate={searchCriteria.startDate}
          defaultEndDate={searchCriteria.endDate}
          defaultMode={searchCriteria.mode}
          onSearch={handleSearch}
        />
        <div className="history-query-status" aria-live="polite">
          조회 조건: {searchCriteria.mode} / {searchCriteria.startDate || '-'} ~ {searchCriteria.endDate || '-'} / 조회 시각: {searchedAt}
        </div>
      </PageCard>

      {isLoading && <PageDataLoadingFallback title={config.title} />}
      {!isLoading && errorMessage && <div role="alert">{errorMessage}</div>}
      {!isLoading && !errorMessage && (
        <>
          <PageCard title={`${tab} Operation Report`} subtitle="Summary / Moving Graph / Detail Data">
            <BaseChart option={option} height={360} />
          </PageCard>

          <div className="stat-grid">
            {reportSummary.map((item) => (
              <PageCard key={item.label} className="stat-card">
                <p className="stat-card__label">{item.label}</p>
                <strong className="stat-card__value">{item.value}</strong>
              </PageCard>
            ))}
          </div>

          <PageCard title="Detail Data">
            <BasicTable headers={tableHeaders} rows={tableRows} />
          </PageCard>
        </>
      )}
    </div>
  );
}
