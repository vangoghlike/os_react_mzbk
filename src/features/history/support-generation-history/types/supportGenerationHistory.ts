import type { TableHeaderCell, TableRow } from '../../../../shared/types/table';

export type SupportGenerationHistoryMode = 'Year' | 'Month' | 'Duration';

export type SupportGenerationHistoryMetric = 'Max kWh' | 'Min kWh' | 'AVG kWh' | 'Max D kWh' | 'Min D kWh' | 'AVG D kWh';

export type SupportGenerationHistoryChartMock = {
  labels: string[];
  totalSeriesByMetric: Record<SupportGenerationHistoryMetric, number[]>;
  dieselSeriesByMetric: Record<SupportGenerationHistoryMetric, number[]>;
  batterySeriesByMetric: Record<SupportGenerationHistoryMetric, number[]>;
};

export type SupportGenerationHistoryTableMock = {
  ariaLabel: string;
  minWidth: number;
  headerRows: TableHeaderCell[][];
  rows: TableRow[];
};
