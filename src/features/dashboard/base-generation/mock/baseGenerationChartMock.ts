import type { BaseGenerationChartDatum } from '../types/baseGeneration';

export const baseGenerationHourlyLabels = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00'
];

export const baseGenerationDistributionChartData: BaseGenerationChartDatum[] = [
  { value: 18, name: '그래프 명1' },
  { value: 34, name: '그래프 명2' },
  { value: 48, name: '그래프 명3' }
];

export const baseGenerationTotalOutputSeries = [420, 438, 412, 470, 455, 492, 480, 436, 394, 410, 435, 421, 474, 479, 508];

export const baseGenerationPfSeries = [0.89, 0.91, 0.87, 0.95, 0.92, 0.98, 0.96, 0.9, 0.84, 0.88, 0.91, 0.89, 0.95, 0.95, 0.99];
