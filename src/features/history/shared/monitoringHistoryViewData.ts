import { useEffect, useMemo, useState } from 'react';
import { ApiError } from '../../../shared/api/apiClient';
import {
  EMPTY_API_VALUE,
  formatApiNumber,
  getDateLabel,
  getTimeLabel,
  readApiField,
  sortByDateTime,
  toChartNumber
} from '../../../shared/api/apiDataUtils';
import type { ApiRecord } from '../../../shared/api/apiDataUtils';
import { getPageContents, monitoringApi, type MonitoringResource } from '../../../shared/api/monitoringApi';
import type { TableHeaderCell, TableRow } from '../../../shared/types/table';
import type { HistorySearchCriteria } from '../../../shared/ui/HistorySearchBar';

type HistoryField = {
  label: string;
  key: string;
};

export type MonitoringHistoryConfig<TMetric extends string, TMode extends string> = {
  resource: MonitoringResource;
  metrics: readonly TMetric[];
  tableTitle: string;
  minWidth: number;
  barField: string;
  lineField?: string;
  fields: HistoryField[];
  searchCriteria: HistorySearchCriteria<TMode>;
};

export type MonitoringHistoryViewData<TMetric extends string> = {
  labels: string[];
  barSeriesByMetric: Record<TMetric, number[]>;
  lineSeriesByMetric: Record<TMetric, number[]>;
  metricTabs: readonly TMetric[];
  table: {
    ariaLabel: string;
    minWidth: number;
    headerRows: TableHeaderCell[][];
    rows: TableRow[];
  };
};

type MonitoringHistoryState<TMetric extends string> = {
  data: MonitoringHistoryViewData<TMetric> | null;
  isLoading: boolean;
  errorMessage: string;
};

function getReportType(mode: string) {
  if (mode === 'Year') return 'YEARLY';
  if (mode === 'Month') return 'MONTHLY';

  return 'DAILY';
}

function getLabel(row: ApiRecord) {
  const date = getDateLabel(row);
  const time = getTimeLabel(row);

  if (date !== EMPTY_API_VALUE) {
    return time !== EMPTY_API_VALUE ? `${date} ${time}` : date;
  }

  return time;
}

function buildSeriesByMetric<TMetric extends string>(metrics: readonly TMetric[], rows: ApiRecord[], field: string) {
  return metrics.reduce<Record<TMetric, number[]>>((seriesByMetric, metric) => {
    seriesByMetric[metric] = rows.map((row) => toChartNumber(readApiField(row, field)));
    return seriesByMetric;
  }, {} as Record<TMetric, number[]>);
}

function buildHistoryViewData<TMetric extends string, TMode extends string>(
  config: MonitoringHistoryConfig<TMetric, TMode>,
  rows: ApiRecord[]
): MonitoringHistoryViewData<TMetric> {
  const sortedRows = sortByDateTime(rows);
  const headerRows: TableHeaderCell[][] = [[{ label: 'DATE' }, ...config.fields.map((field) => ({ label: field.label }))]];
  const tableRows = sortedRows.map((row) => [getLabel(row), ...config.fields.map((field) => formatApiNumber(readApiField(row, field.key)))]);

  return {
    labels: sortedRows.map((row) => getLabel(row)),
    barSeriesByMetric: buildSeriesByMetric(config.metrics, sortedRows, config.barField),
    lineSeriesByMetric: buildSeriesByMetric(config.metrics, sortedRows, config.lineField ?? config.barField),
    metricTabs: config.metrics,
    table: {
      ariaLabel: config.tableTitle,
      minWidth: config.minWidth,
      headerRows,
      rows: tableRows.length > 0 ? tableRows : [[EMPTY_API_VALUE]]
    }
  };
}

/*
 * 필요: 이력 화면들이 동일한 조회/변환 흐름으로 API 데이터를 사용하게 한다.
 * 연결: GRID/PCS/보조/전력 소비 이력 ResultSection.
 * 설명: resource와 필드 목록만 화면별로 받고, loading/error/table/chart 계약은 공통으로 유지한다.
 * 수정: 전용 이력 endpoint나 필드가 바뀌면 각 화면 config의 resource/fields만 조정한다.
 */
export function useMonitoringHistoryViewData<TMetric extends string, TMode extends string>(
  config: MonitoringHistoryConfig<TMetric, TMode>
) {
  const [state, setState] = useState<MonitoringHistoryState<TMetric>>({
    data: null,
    isLoading: true,
    errorMessage: ''
  });

  const query = useMemo(
    () => ({
      startDate: config.searchCriteria.startDate,
      endDate: config.searchCriteria.endDate,
      reportType: getReportType(config.searchCriteria.mode),
      page: 1,
      size: 200
    }),
    [config.searchCriteria.endDate, config.searchCriteria.mode, config.searchCriteria.startDate]
  );

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      setState((currentState) => ({ ...currentState, isLoading: true, errorMessage: '' }));

      try {
        const response = await monitoringApi.getHistory<ApiRecord>(config.resource, query);
        const rows = getPageContents(response);
        const data = buildHistoryViewData(config, rows);

        if (!mounted) {
          return;
        }

        setState({ data, isLoading: false, errorMessage: '' });
      } catch (error) {
        if (!mounted) {
          return;
        }

        const message = error instanceof ApiError ? error.message : '이력 데이터를 불러오지 못했습니다.';
        setState({ data: null, isLoading: false, errorMessage: message });
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, [config, query]);

  return state;
}
