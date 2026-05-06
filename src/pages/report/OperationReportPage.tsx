import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ApiError } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { formatApiNumber, getRawValue, readApiField, toChartNumber } from '../../shared/api/apiDataUtils';
import { monitoringApi, type ReportPeriodResource } from '../../shared/api/monitoringApi';
import type { TableHeaderCell, TableRow } from '../../shared/types/table';
import { ActionButton } from '../../shared/ui/ActionButton';
import { BaseChart } from '../../shared/ui/BaseChart';
import { BasicTable } from '../../shared/ui/BasicTable';
import { DataTableCard } from '../../shared/ui/DataTableCard';
import { SearchConditionBar, type SearchConditionCriteria } from '../../shared/ui/SearchConditionBar';
import { PageCard } from '../../shared/ui/PageCard';
import { PageDataLoadingFallback } from '../../shared/ui/PageDataLoadingFallback';
import { PageHeading } from '../../shared/ui/PageHeading';
import './OperationReportPage.css';

const reportTabs = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;

type ReportTab = (typeof reportTabs)[number];

type ReportField = {
  label: string;
  key: string;
};

type ReportConfig = {
  title: string;
  resource: ReportPeriodResource;
  firstBarField: ReportField;
  secondBarField: ReportField;
  lineField: ReportField;
  fields: ReportField[];
};

const reportTabResourceMap: Record<ReportTab, ReportPeriodResource> = {
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly'
};

const reportResourceTabMap: Record<ReportPeriodResource, ReportTab> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly'
};

const reportSearchOptions = [
  { value: 'Daily', inputType: 'date' },
  { value: 'Weekly', inputType: 'dateRange' },
  { value: 'Monthly', label: 'Month', inputType: 'month' },
  { value: 'Yearly', inputType: 'year' }
] as const;

const reportPrintTitles: Record<ReportTab, string> = {
  Daily: 'Daily Operation Report',
  Weekly: 'Weekly Operation Report',
  Monthly: 'Monthly Operation Report',
  Yearly: 'Yearly Operation Report'
};

const operationReportFields: ReportField[] = [
  { label: 'DATE', key: 'baseDate' },
  { label: 'BASE MAX', key: 'maxBasePower' },
  { label: 'BASE MIN', key: 'minBasePower' },
  { label: 'BASE AVG', key: 'avgBasePower' },
  { label: 'ASSIST MAX', key: 'maxAssistPower' },
  { label: 'ASSIST AVG', key: 'avgAssistPower' },
  { label: 'STANDBY MAX', key: 'maxStandbyPower' },
  { label: 'STANDBY AVG', key: 'avgStandbyPower' },
  { label: 'DISPATCH MAX', key: 'maxDispatchPower' },
  { label: 'DISPATCH AVG', key: 'avgDispatchPower' },
  { label: 'SOC AVG', key: 'avgSoc' }
];

function getReportField(key: string) {
  const field = operationReportFields.find((candidate) => candidate.key === key);

  if (!field) {
    throw new Error(`OperationReportResponse field is not configured: ${key}`);
  }

  return field;
}

const reportConfigs: Record<ReportPeriodResource, ReportConfig> = {
  daily: {
    title: '일간 운전 보고서',
    resource: 'daily',
    firstBarField: getReportField('avgBasePower'),
    secondBarField: getReportField('avgDispatchPower'),
    lineField: getReportField('avgSoc'),
    fields: operationReportFields
  },
  weekly: {
    title: '주간 운전 보고서',
    resource: 'weekly',
    firstBarField: getReportField('avgBasePower'),
    secondBarField: getReportField('avgDispatchPower'),
    lineField: getReportField('avgSoc'),
    fields: operationReportFields
  },
  monthly: {
    title: '월간 운전 보고서',
    resource: 'monthly',
    firstBarField: getReportField('avgBasePower'),
    secondBarField: getReportField('avgDispatchPower'),
    lineField: getReportField('avgSoc'),
    fields: operationReportFields
  },
  yearly: {
    title: '연간 운전 보고서',
    resource: 'yearly',
    firstBarField: getReportField('avgBasePower'),
    secondBarField: getReportField('avgDispatchPower'),
    lineField: getReportField('avgSoc'),
    fields: operationReportFields
  }
};

const reportDemandSupplyHeaderRows: TableHeaderCell[][] = [
  [{ label: 'Power Demand & Supply', colSpan: 10 }],
  [
    { label: 'Generation', colSpan: 5 },
    { label: 'Consumption', colSpan: 5 }
  ],
  [
    { label: 'Maximum', colSpan: 2 },
    { label: 'Minimum', colSpan: 2 },
    { label: 'Average' },
    { label: 'Maximum', colSpan: 2 },
    { label: 'Minimum', colSpan: 2 },
    { label: 'Average' }
  ],
  [
    { label: 'QTY' },
    { label: 'Time' },
    { label: 'QTY' },
    { label: 'Time' },
    { label: 'QTY' },
    { label: 'QTY' },
    { label: 'Time' },
    { label: 'QTY' },
    { label: 'Time' },
    { label: 'QTY' }
  ]
];

const reportDetailHeaderRows: TableHeaderCell[][] = [
  [
    { label: 'TIME', rowSpan: 3 },
    { label: 'Total', colSpan: 3 },
    { label: 'PV', rowSpan: 3 },
    { label: 'Generator', colSpan: 3 },
    { label: 'Bat', colSpan: 1 },
    { label: 'Consumption', colSpan: 8 }
  ],
  [
    { label: 'Gen' },
    { label: 'Consumption' },
    { label: 'Use Rate' },
    { label: '#1', rowSpan: 2 },
    { label: '#2', rowSpan: 2 },
    { label: 'SubTot', rowSpan: 2 },
    { label: 'Discharge', rowSpan: 2 },
    { label: 'Consumer', colSpan: 5 },
    { label: 'SubTot', rowSpan: 2 },
    { label: 'Bat', colSpan: 1 },
    { label: 'Sub Total', rowSpan: 2 }
  ],
  [
    { label: 'Gen(kWh)' },
    { label: 'Use(kWh)' },
    { label: 'Urate(%)' },
    { label: 'BANK 1' },
    { label: 'BANK 2' },
    { label: 'BANK 3' },
    { label: 'BANK 4' },
    { label: 'BANK 5' },
    { label: 'Charge' }
  ]
];

function getResourceFromPath(pathname: string): ReportPeriodResource {
  const resource = pathname.split('/').filter(Boolean).at(-1);

  if (resource === 'weekly' || resource === 'monthly' || resource === 'yearly') {
    return resource;
  }

  return 'daily';
}

function getReportType(resource: ReportPeriodResource) {
  if (resource === 'weekly') return 'WEEKLY';
  if (resource === 'monthly') return 'MONTHLY';
  if (resource === 'yearly') return 'YEARLY';

  return 'DAILY';
}

function createDefaultReportCriteria(mode: ReportTab): SearchConditionCriteria<ReportTab> {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = `${year}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const date = `${month}-${String(today.getDate()).padStart(2, '0')}`;
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const formatDate = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

  if (mode === 'Daily') {
    return {
      mode,
      startDate: date,
      endDate: date,
      year,
      month
    };
  }

  if (mode === 'Weekly') {
    return {
      mode,
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
      year,
      month
    };
  }

  if (mode === 'Yearly') {
    return {
      mode,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      year,
      month
    };
  }

  return {
    mode,
    startDate: `${month}-01`,
    endDate: `${month}-${String(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).padStart(2, '0')}`,
    year,
    month
  };
}

function getReportDateLabel(row: ApiRecord) {
  return getRawValue(row.baseDate) || getRawValue(row.operYmd) || '-';
}

function sortReportRows(rows: ApiRecord[]) {
  return [...rows].sort((a, b) => getReportDateLabel(a).localeCompare(getReportDateLabel(b)));
}

function buildDetailTableRows(rows: ApiRecord[]): TableRow[] {
  return rows.map((row) =>
    [
      getReportDateLabel(row),
      formatApiNumber(readApiField(row, 'avgBasePower')),
      formatApiNumber(readApiField(row, 'avgDispatchPower')),
      formatApiNumber(readApiField(row, 'avgSoc')),
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-'
    ]
  );
}

function getSummarySourceRow(rows: ApiRecord[]) {
  return rows[0] ?? {};
}

function buildDemandSupplyRows(row: ApiRecord): TableRow[] {
  return [
    [
      formatApiNumber(readApiField(row, 'maxBasePower')),
      '-',
      formatApiNumber(readApiField(row, 'minBasePower')),
      '-',
      formatApiNumber(readApiField(row, 'avgBasePower')),
      formatApiNumber(readApiField(row, 'maxDispatchPower')),
      '-',
      formatApiNumber(readApiField(row, 'minDispatchPower')),
      '-',
      formatApiNumber(readApiField(row, 'avgDispatchPower'))
    ]
  ];
}

function ReportSummaryValueTable({
  row,
  criteria
}: {
  row: ApiRecord;
  criteria: SearchConditionCriteria<ReportTab>;
}) {
  const dateLabel =
    criteria.mode === 'Daily'
      ? criteria.startDate
      : criteria.mode === 'Monthly'
        ? criteria.month
        : criteria.mode === 'Yearly'
          ? criteria.year
          : `${criteria.startDate} ~ ${criteria.endDate}`;

  return (
    <div className="report-summary-value-table" role="table" aria-label="리포트 요약 값">
      <div className="report-summary-value-table__row report-summary-value-table__row--date" role="row">
        <div className="report-summary-value-table__header" role="columnheader">
          Date
        </div>
        <div className="report-summary-value-table__value" role="cell">
          {dateLabel || getReportDateLabel(row)}
        </div>
      </div>
      <div className="report-summary-value-table__body">
        <div className="report-summary-value-table__side" role="rowheader">
          Summary
        </div>
        <div className="report-summary-value-table__items">
          <div className="report-summary-value-table__row" role="row">
            <div className="report-summary-value-table__label" role="cell">
              Generation
            </div>
            <div className="report-summary-value-table__value" role="cell">
              {formatApiNumber(readApiField(row, 'avgBasePower'))}
            </div>
          </div>
          <div className="report-summary-value-table__row" role="row">
            <div className="report-summary-value-table__label" role="cell">
              Consumption
            </div>
            <div className="report-summary-value-table__value" role="cell">
              {formatApiNumber(readApiField(row, 'avgDispatchPower'))}
            </div>
          </div>
          <div className="report-summary-value-table__row" role="row">
            <div className="report-summary-value-table__label" role="cell">
              Use Rate
            </div>
            <div className="report-summary-value-table__value" role="cell">
              {formatApiNumber(readApiField(row, 'avgSoc'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * 필요: 리포트 화면은 v2 report API의 보고서 타입 기준으로 검색, 요약, 그래프, 상세 데이터를 표시한다.
 * 연결: /report/daily, /report/weekly, /report/monthly, /report/yearly, SearchConditionBar, BasicTable, BaseChart, DataTableCard.
 * 설명: 검색 조건 선택만 바꾸고, 표시 차트 구조는 공통 컴포넌트로 고정한다.
 * 수정: report 응답 필드가 바뀌면 reportConfigs와 summary builder만 조정한다.
 */
export function OperationReportPage() {
  const location = useLocation();
  const pathResource = getResourceFromPath(location.pathname);
  const [searchCriteria, setSearchCriteria] = useState<SearchConditionCriteria<ReportTab>>(() =>
    createDefaultReportCriteria(reportResourceTabMap[pathResource])
  );
  const [rows, setRows] = useState<ApiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const resource = reportTabResourceMap[searchCriteria.mode];
  const config = reportConfigs[resource];

  useEffect(() => {
    setSearchCriteria(createDefaultReportCriteria(reportResourceTabMap[pathResource]));
  }, [pathResource]);

  useEffect(() => {
    let mounted = true;

    async function loadReport() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const nextRows = await monitoringApi.getReport<ApiRecord>(config.resource, {
          startDate: searchCriteria.startDate,
          endDate: searchCriteria.endDate,
          reportType: getReportType(config.resource),
          baseYear: searchCriteria.year,
          baseMonth: searchCriteria.month
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
  }, [config.resource, searchCriteria.endDate, searchCriteria.month, searchCriteria.startDate, searchCriteria.year]);

  useEffect(() => {
    const enablePrintMode = () => setIsPrintMode(true);
    const disablePrintMode = () => setIsPrintMode(false);

    window.addEventListener('beforeprint', enablePrintMode);
    window.addEventListener('afterprint', disablePrintMode);

    return () => {
      window.removeEventListener('beforeprint', enablePrintMode);
      window.removeEventListener('afterprint', disablePrintMode);
    };
  }, []);

  const labels = useMemo(() => rows.map((row) => getReportDateLabel(row)), [rows]);
  const firstBarSeries = useMemo(() => rows.map((row) => toChartNumber(readApiField(row, config.firstBarField.key))), [config.firstBarField, rows]);
  const secondBarSeries = useMemo(() => rows.map((row) => toChartNumber(readApiField(row, config.secondBarField.key))), [config.secondBarField, rows]);
  const lineSeries = useMemo(() => rows.map((row) => toChartNumber(readApiField(row, config.lineField.key))), [config.lineField, rows]);
  const detailRows = useMemo(() => buildDetailTableRows(rows), [rows]);
  const summarySourceRow = useMemo(() => getSummarySourceRow(rows), [rows]);
  const demandSupplyRows = useMemo(() => buildDemandSupplyRows(summarySourceRow), [summarySourceRow]);
  const printTitle = reportPrintTitles[searchCriteria.mode];

  const handlePrintReport = () => {
    flushSync(() => setIsPrintMode(true));
    window.setTimeout(() => window.print(), 120);
  };

  const chartOption = useMemo<EChartsOption>(
    () => ({
      color: ['#2f9cff', '#f7c978', '#f3f6ff'],
      title: {
        text: 'Power Generation & Consumption',
        left: 'center',
        top: 0,
        textStyle: { color: '#f3f6ff', fontSize: isPrintMode ? 8 : 14, fontWeight: 800 }
      },
      tooltip: { trigger: 'axis' },
      legend: {
        bottom: 0,
        itemWidth: isPrintMode ? 10 : 25,
        itemHeight: isPrintMode ? 6 : 14,
        textStyle: { color: '#cfd6e8', fontSize: isPrintMode ? 7 : 12 }
      },
      grid: {
        left: isPrintMode ? 4 : 24,
        right: isPrintMode ? 4 : 24,
        top: isPrintMode ? 28 : 64,
        bottom: isPrintMode ? 26 : 50,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { color: '#aab3c5', fontSize: isPrintMode ? 6 : 12 },
        axisLine: { lineStyle: { color: '#2f3a52' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#cfd6e8', fontSize: isPrintMode ? 6 : 12 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      series: [
        {
          name: config.firstBarField.label,
          type: 'bar',
          barWidth: isPrintMode ? 10 : 28,
          data: firstBarSeries
        },
        {
          name: config.secondBarField.label,
          type: 'bar',
          barWidth: isPrintMode ? 10 : 28,
          data: secondBarSeries
        },
        {
          name: config.lineField.label,
          type: 'line',
          smooth: false,
          symbolSize: isPrintMode ? 4 : 9,
          data: lineSeries
        }
      ]
    }),
    [config.firstBarField.label, config.lineField.label, config.secondBarField.label, firstBarSeries, isPrintMode, labels, lineSeries, secondBarSeries]
  );

  return (
    <div className="page-stack operation-report-page">
      <PageHeading title={config.title} />

      <section className="report-search-section" aria-label="리포트 조회 조건">
        <SearchConditionBar
          key={searchCriteria.mode}
          modes={reportSearchOptions}
          defaultMode={searchCriteria.mode}
          align="left"
          className="report-search-bar"
          defaultStartDate={searchCriteria.startDate}
          defaultEndDate={searchCriteria.endDate}
          defaultYear={searchCriteria.year}
          defaultMonth={searchCriteria.month}
          onSearch={setSearchCriteria}
        />
      </section>

      {isLoading && <PageDataLoadingFallback title={config.title} />}
      {!isLoading && errorMessage && <div role="alert" className="report-message">{errorMessage}</div>}
      {!isLoading && !errorMessage && (
        <div className="report-print-area">
          <h2 className="report-print-title">{printTitle}</h2>

          <div className="report-print-section-label">1. Summary</div>
          <PageCard
            title="Summary"
            className="report-summary-card"
            ariaLabel={`${config.title} 요약`}
            actions={<ActionButton variant="primary" className="report-summary-card__print" onClick={handlePrintReport}>Print</ActionButton>}
          >
            <div className="report-summary-card__tables">
              <ReportSummaryValueTable row={summarySourceRow} criteria={searchCriteria} />
              <BasicTable
                className="report-demand-supply-table"
                ariaLabel="Power Demand & Supply"
                headerRows={reportDemandSupplyHeaderRows}
                rows={demandSupplyRows}
                minWidth={980}
              />
            </div>
          </PageCard>

          <div className="report-print-section-label">2. Moving Graph</div>
          <PageCard className="report-chart-card" ariaLabel={`${config.title} 그래프`}>
            <BaseChart option={chartOption} height={isPrintMode ? 170 : 360} minWidth="100%" maxWidth={isPrintMode ? '100%' : 2560} />
          </PageCard>

          <div className="report-print-section-label">3. Detail Data</div>
          <DataTableCard
            title="Detail Data"
            className="report-detail-card"
            ariaLabel={`${config.title} 상세 데이터`}
            headerRows={reportDetailHeaderRows}
            rows={detailRows}
            minWidth={1500}
            excel={{ fileName: `${config.title}_${searchCriteria.mode}`, sheetName: 'Detail Data' }}
          />
        </div>
      )}
    </div>
  );
}
