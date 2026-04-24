import type { BasicTableHeaderCell } from '../../../../shared/ui/BasicTable';
import type { BaseGenerationSummaryMetric } from '../types/baseGeneration';

export const baseGenerationSummaryColumns = ['Total', 'IVT1', 'IVT2', 'IVT3', 'IVT4', 'IVT5', 'IVT6', 'IVT7'];

export const baseGenerationSummaryMetrics: BaseGenerationSummaryMetric[] = [
  { label: '발전비중(%)', values: ['100.0', '13.4', '14.2', '14.0', '13.8', '14.1', '15.2', '15.3'] },
  { label: '발전량(kWh)', values: ['8,420', '1,140', '1,180', '1,176', '1,165', '1,181', '1,276', '1,302'] }
];

export const baseGenerationSummaryLegendLabels = ['그래프 명1', '그래프 명2', '그래프 명3'];

export const baseGenerationPowerHeaderRows: BasicTableHeaderCell[][] = [
  [
    { label: 'TIME', rowSpan: 2 },
    { label: 'POWER', colSpan: 4 },
    { label: 'ACTIVE.ACCM', colSpan: 4 },
    { label: 'REACTIVE.ACCM', colSpan: 4 }
  ],
  [
    { label: 'ACTIV' },
    { label: 'REACTIVE' },
    { label: 'APPARENT' },
    { label: 'PF' },
    { label: 'DAY' },
    { label: 'WEEK' },
    { label: 'MON' },
    { label: 'TOT' },
    { label: 'DAY' },
    { label: 'WEEK' },
    { label: 'MON' },
    { label: 'TOT' }
  ]
];

export const baseGenerationInverterHeaderRows: BasicTableHeaderCell[][] = [
  [
    { label: 'TIME', rowSpan: 2 },
    { label: 'V', colSpan: 3 },
    { label: 'A', colSpan: 3 },
    { label: 'FR', colSpan: 3 },
    { label: 'ACTIVE POWER', colSpan: 3 },
    { label: 'REACTIVE POWER', colSpan: 3 },
    { label: 'APPARENT POWER', colSpan: 3 }
  ],
  [
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' },
    { label: 'L1.2' }
  ]
];
