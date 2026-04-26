import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

export type PowerConsumptionHistoryMode = 'Year' | 'Month' | 'Duration';

export type PowerConsumptionHistoryMetric = 'Max kWh' | 'Min kWh' | 'AVG kWh';

export type PowerConsumptionHistoryChartMock = {
  labels: string[];
  totalSeriesByMetric: Record<PowerConsumptionHistoryMetric, number[]>;
  bankAverageSeriesByMetric: Record<PowerConsumptionHistoryMetric, number[]>;
};

export type PowerConsumptionHistoryTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
