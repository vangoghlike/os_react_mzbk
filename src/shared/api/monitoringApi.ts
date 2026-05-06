import { apiClient } from './apiClient';
import type { ApiRecord, ApiScalar } from './apiDataUtils';

export type MonitoringResource = 'grid' | 'ess' | 'pcs' | 'battery' | 'diesel1' | 'diesel2' | 'ac';
export type MonitoringDomain = 'base-total' | 'base-plant' | 'assist' | 'standby' | 'dispatch';
export type ReportPeriodResource = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReportResource = MonitoringResource | ReportPeriodResource;

export type ApiPageResponse<T> = {
  contents?: T[];
  totalCount?: number;
  page?: number;
  size?: number;
  totalPage?: number;
};

export type MonitoringSearchRequest = {
  startDate?: string;
  endDate?: string;
  reportType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  periodType?: 'YEAR' | 'MONTH' | 'PERIOD';
  outputUnit?: 'HOUR' | 'DAY' | 'MONTH';
  page?: number;
  size?: number;
};

export type ReportSearchRequest = MonitoringSearchRequest & {
  operYmd?: string;
  baseYear?: string;
  baseMonth?: string;
};

export type MonitoringChartDto = {
  barValue1?: ApiScalar;
  barValue2?: ApiScalar;
  labelTime?: ApiScalar;
  lineValue1?: ApiScalar;
  lineValue2?: ApiScalar;
  lineValue3?: ApiScalar;
  operTime?: ApiScalar;
  operYmd?: ApiScalar;
  targetId?: ApiScalar;
  targetName?: ApiScalar;
};

export type MonitoringLatestDto = {
  operTime?: ApiScalar;
  operYmd?: ApiScalar;
  ratio1?: ApiScalar;
  ratio2?: ApiScalar;
  remark?: ApiScalar;
  value1?: ApiScalar;
  value2?: ApiScalar;
  value3?: ApiScalar;
};

export type MonitoringTableDto = {
  operTime?: ApiScalar;
  operYmd?: ApiScalar;
  rowNo?: ApiScalar;
  targetId?: ApiScalar;
  targetName?: ApiScalar;
  value1?: ApiScalar;
  value2?: ApiScalar;
  value3?: ApiScalar;
  value4?: ApiScalar;
};

export type MonitoringTargetDto = {
  targetId?: ApiScalar;
  targetName?: ApiScalar;
};

export type MonitoringDetailDto = {
  detailText1?: ApiScalar;
  detailText2?: ApiScalar;
  detailText3?: ApiScalar;
  detailValue1?: ApiScalar;
  detailValue2?: ApiScalar;
  detailValue3?: ApiScalar;
  detailValue4?: ApiScalar;
  detailValue5?: ApiScalar;
  operTime?: ApiScalar;
  operYmd?: ApiScalar;
  targetId?: ApiScalar;
  targetName?: ApiScalar;
};

export type MonitoringResponseDto = {
  chartList?: MonitoringChartDto[];
  latest?: MonitoringLatestDto;
  tableList?: MonitoringTableDto[];
  targetList?: MonitoringTargetDto[];
};

type AnalysisChartResponse = {
  baseLabel?: ApiScalar;
  outputUnit?: ApiScalar;
  lineValue1?: ApiScalar;
  lineName1?: ApiScalar;
  lineValue2?: ApiScalar;
  lineName2?: ApiScalar;
  barValue?: ApiScalar;
  barName?: ApiScalar;
};

type AnalysisSummaryResponse = {
  analysisType?: ApiScalar;
  outputUnit?: ApiScalar;
  startDate?: ApiScalar;
  endDate?: ApiScalar;
  dataCount?: ApiScalar;
  totalPower?: ApiScalar;
  avgEfficiency?: ApiScalar;
  avgVoltage?: ApiScalar;
  avgCurrent?: ApiScalar;
  avgFrequency?: ApiScalar;
  avgPf?: ApiScalar;
  avgTemperature?: ApiScalar;
  avgOilPress?: ApiScalar;
  avgRpm?: ApiScalar;
  avgTankLevel?: ApiScalar;
  avgSoc?: ApiScalar;
  avgSoh?: ApiScalar;
  chartList?: AnalysisChartResponse[];
};

const MONITORING_DOMAIN_PATHS: Record<MonitoringDomain, string> = {
  'base-total': '/monitoring/base/total',
  'base-plant': '/monitoring/base/plant',
  assist: '/monitoring/assist',
  standby: '/monitoring/standby',
  dispatch: '/monitoring/dispatch'
};

const LEGACY_RESOURCE_DOMAIN: Record<MonitoringResource, MonitoringDomain> = {
  grid: 'base-total',
  ess: 'assist',
  diesel1: 'assist',
  diesel2: 'assist',
  pcs: 'standby',
  battery: 'standby',
  ac: 'dispatch'
};

const ANALYSIS_RESOURCE_PATHS: Record<MonitoringResource, string> = {
  grid: '/analysis/base/total/history',
  ess: '/analysis/assist/history',
  pcs: '/analysis/standby/history',
  battery: '/analysis/standby/history',
  diesel1: '/analysis/assist/history',
  diesel2: '/analysis/assist/history',
  ac: '/analysis/dispatch/history'
};

const RESOURCE_MATCHERS: Record<MonitoringResource, string[]> = {
  grid: ['grid', 'base', 'total', 'ivt', 'inverter'],
  ess: ['ess', 'battery', 'bat', 'batt'],
  pcs: ['pcs'],
  battery: ['battery', 'bat', 'batt'],
  diesel1: ['diesel1', 'diesel #1', 'diesel 1', 'dsl1', 'dsl #1'],
  diesel2: ['diesel2', 'diesel #2', 'diesel 2', 'dsl2', 'dsl #2'],
  ac: ['ac', 'a/c', 'air']
};

function toQueryString(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}

function toMonitoringDataResponse(row: ApiRecord | undefined): MonitoringResponseDto {
  const latest = (row ?? {}) as MonitoringLatestDto;

  return {
    latest,
    chartList: row ? [row as MonitoringChartDto] : [],
    tableList: row ? [row as MonitoringTableDto] : [],
    targetList: []
  };
}

function getAnalysisPeriodType(params?: MonitoringSearchRequest): 'YEAR' | 'MONTH' | 'PERIOD' {
  if (params?.periodType) {
    return params.periodType;
  }

  if (params?.reportType === 'YEARLY') return 'YEAR';
  if (params?.reportType === 'MONTHLY') return 'MONTH';

  return 'PERIOD';
}

function toAnalysisQuery(params?: MonitoringSearchRequest) {
  return {
    periodType: getAnalysisPeriodType(params),
    startDate: params?.startDate,
    endDate: params?.endDate,
    outputUnit: params?.outputUnit
  };
}

function normalizeBaseMonth(value?: string) {
  if (!value) {
    return undefined;
  }

  const month = value.includes('-') ? value.split('-').at(-1) : value;

  return month?.padStart(2, '0');
}

function toReportQuery(period: ReportPeriodResource, params?: ReportSearchRequest) {
  if (!params) {
    return undefined;
  }

  const { reportType: _reportType, ...query } = params;

  if (period === 'daily') {
    return {
      ...query,
      operYmd: params.operYmd ?? params.startDate
    };
  }

  if (period === 'monthly') {
    return {
      ...query,
      baseYear: params.baseYear ?? params.baseMonth?.slice(0, 4),
      baseMonth: normalizeBaseMonth(params.baseMonth)
    };
  }

  return query;
}

function getReportPeriod(resource: ReportResource, params?: ReportSearchRequest): ReportPeriodResource {
  if (resource === 'daily' || resource === 'weekly' || resource === 'monthly' || resource === 'yearly') {
    return resource;
  }

  if (params?.reportType === 'WEEKLY') return 'weekly';
  if (params?.reportType === 'MONTHLY') return 'monthly';
  if (params?.reportType === 'YEARLY') return 'yearly';

  return 'daily';
}

export function getPageContents<T>(response: ApiPageResponse<T> | T[] | undefined) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.contents ?? [];
}

export function getMonitoringDomainPath(domain: MonitoringDomain) {
  return MONITORING_DOMAIN_PATHS[domain];
}

function normalizeToken(value: ApiScalar) {
  return String(value ?? '').trim().toLowerCase();
}

function matchesResource(row: Pick<MonitoringChartDto, 'targetId' | 'targetName'>, resource: MonitoringResource) {
  const label = `${normalizeToken(row.targetId)} ${normalizeToken(row.targetName)}`;

  if (!label.trim()) {
    return true;
  }

  return RESOURCE_MATCHERS[resource].some((keyword) => label.includes(keyword));
}

function firstValue(...values: ApiScalar[]): ApiScalar {
  return values.find((value) => value !== null && value !== undefined && String(value).trim() !== '');
}

function getSplitValue(value: ApiScalar, divisor: number) {
  const numericValue = Number(String(value ?? '').replace(/,/g, ''));

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return Number((numericValue / divisor).toFixed(2));
}

function readLatestValue(latest: MonitoringLatestDto | undefined, index: 1 | 2 | 3) {
  if (index === 1) return latest?.value1;
  if (index === 2) return latest?.value2;

  return latest?.value3;
}

function createCommonRecord(row: MonitoringChartDto | MonitoringTableDto | MonitoringLatestDto, latest?: MonitoringLatestDto): ApiRecord {
  const chartRow = row as MonitoringChartDto;
  const tableRow = row as MonitoringTableDto;
  const activeValue = firstValue(chartRow.barValue1, tableRow.value1, readLatestValue(latest, 1), readLatestValue(row as MonitoringLatestDto, 1));
  const reactiveValue = firstValue(chartRow.lineValue1, tableRow.value2, readLatestValue(latest, 2), readLatestValue(row as MonitoringLatestDto, 2));
  const apparentValue = firstValue(chartRow.barValue2, tableRow.value3, readLatestValue(latest, 3), readLatestValue(row as MonitoringLatestDto, 3));
  const pfValue = firstValue(chartRow.lineValue2, chartRow.lineValue1, latest?.ratio1, (row as MonitoringLatestDto).ratio1);
  const ratioValue = firstValue(chartRow.lineValue3, latest?.ratio2, (row as MonitoringLatestDto).ratio2, 100);

  return {
    esmtOperYmd: firstValue(chartRow.operYmd, tableRow.operYmd, (row as MonitoringLatestDto).operYmd, latest?.operYmd),
    esmtOperTime: firstValue(chartRow.labelTime, chartRow.operTime, tableRow.operTime, (row as MonitoringLatestDto).operTime, latest?.operTime),
    baseDate: firstValue(chartRow.operYmd, tableRow.operYmd, (row as MonitoringLatestDto).operYmd, latest?.operYmd),
    rowNo: tableRow.rowNo,
    targetId: firstValue(chartRow.targetId, tableRow.targetId),
    targetName: firstValue(chartRow.targetName, tableRow.targetName),
    activeValue,
    reactiveValue,
    apparentValue,
    pfValue,
    ratioValue,
    remark: firstValue((row as MonitoringLatestDto).remark, latest?.remark)
  };
}

function withBaseFields(record: ApiRecord): ApiRecord {
  const activeValue = record.activeValue;
  const reactiveValue = record.reactiveValue;
  const apparentValue = record.apparentValue;
  const pfValue = record.pfValue;

  return {
    ...record,
    baAtpTot: activeValue,
    baRtpTot: reactiveValue,
    baArpTot: apparentValue,
    baPfTot: pfValue,
    baAtpDayAccm: activeValue,
    baAtpWeekAccm: activeValue,
    baAtpMonAccm: activeValue,
    baAtpTotAccm: activeValue,
    baRtpDayAccm: reactiveValue,
    baRtpWeekAccm: reactiveValue,
    baRtpMonAccm: reactiveValue,
    baRtpTotAccm: reactiveValue,
    baAtpL1: getSplitValue(activeValue, 3),
    baAtpL2: getSplitValue(activeValue, 3),
    baAtpL3: getSplitValue(activeValue, 3),
    baPtpvL12: reactiveValue,
    baPtpvL23: reactiveValue,
    baPtpvL31: reactiveValue,
    baPtpvL1n: reactiveValue,
    baPtpvL2n: reactiveValue,
    baPtptL3n: reactiveValue,
    baPfrL1: pfValue,
    baPfrL2: pfValue,
    baPfrL3: pfValue,
    baPaL1: getSplitValue(apparentValue, 3),
    baPaL2: getSplitValue(apparentValue, 3),
    baPaL3: getSplitValue(apparentValue, 3),
    lgldGbcd: record.ratioValue
  };
}

function withEssFields(record: ApiRecord): ApiRecord {
  const activeValue = record.activeValue;
  const reactiveValue = record.reactiveValue;
  const apparentValue = record.apparentValue;
  const pfValue = record.pfValue;

  return {
    ...record,
    essAtpTot: activeValue,
    essRtpTot: reactiveValue,
    essArpTot: apparentValue,
    essPfTot: pfValue,
    essAtpDayAccm: activeValue,
    essAtpTotAccm: activeValue,
    essAtpL1: getSplitValue(activeValue, 3),
    essAtpL2: getSplitValue(activeValue, 3),
    essAtpL3: getSplitValue(activeValue, 3),
    essRtpL1: getSplitValue(reactiveValue, 3),
    essRtpL2: getSplitValue(reactiveValue, 3),
    essRtpL3: getSplitValue(reactiveValue, 3),
    essPtpvL12: reactiveValue,
    essPtpvL23: reactiveValue,
    essPtpvL31: reactiveValue,
    essPfrL1: pfValue,
    essPfrL2: pfValue,
    essPfrL3: pfValue,
    essPaL1: getSplitValue(apparentValue, 3),
    essPaL2: getSplitValue(apparentValue, 3),
    essPaL3: getSplitValue(apparentValue, 3),
    essPlntSoc: record.ratioValue
  };
}

function withPcsFields(record: ApiRecord): ApiRecord {
  const activeValue = record.activeValue;
  const reactiveValue = record.reactiveValue;
  const apparentValue = record.apparentValue;
  const pfValue = record.pfValue;

  return {
    ...record,
    pcsOperStatus: firstValue(record.remark, '01'),
    pcsAtpTot: activeValue,
    pcsRtpTot: reactiveValue,
    pcsArpTot: apparentValue,
    pcsPfTot: pfValue,
    pcsAtpDayAccm: activeValue,
    pcsAtpMonAccm: activeValue,
    pcsDcP: reactiveValue,
    pcsDcA: apparentValue,
    pcsDcV: activeValue,
    pcsFr: pfValue,
    pcsPaL1: getSplitValue(apparentValue, 3),
    pcsPaL2: getSplitValue(apparentValue, 3),
    pcsPaL3: getSplitValue(apparentValue, 3),
    pcsPtpvL12: activeValue,
    pcsPtpvL23: activeValue,
    pcsPtpvL31: activeValue,
    pcsMdlTemp: record.ratioValue,
    pcsAbntTemp: record.ratioValue,
    pcsCbntTemp: record.ratioValue
  };
}

function withBatteryFields(record: ApiRecord): ApiRecord {
  const activeValue = record.activeValue;
  const reactiveValue = record.reactiveValue;
  const apparentValue = record.apparentValue;

  return {
    ...record,
    batAvgSoc: activeValue,
    batAvgSoh: reactiveValue,
    batAvgDcv: activeValue,
    batAvgDca: reactiveValue,
    batAvgRakv: activeValue,
    batMaxRakv: activeValue,
    batMinRakv: getSplitValue(activeValue, 2),
    batAvgRaka: reactiveValue,
    batMaxRaka: reactiveValue,
    batMinRaka: getSplitValue(reactiveValue, 2),
    batAvgCelv: apparentValue,
    batMaxCelv: apparentValue,
    batMinCelv: getSplitValue(apparentValue, 2),
    batAvgPaktmp: record.ratioValue,
    batMaxPaktmp: record.ratioValue,
    batMinPaktmp: getSplitValue(record.ratioValue, 2),
    maxRakvRakno: record.targetName,
    minRakvRakno: record.targetName,
    maxRakaRakno: record.targetName,
    minRakaRakno: record.targetName,
    maxCelvRakno: record.targetName,
    minCelvRakno: record.targetName,
    maxPaktmpRakno: record.targetName
  };
}

function withDieselFields(record: ApiRecord): ApiRecord {
  const activeValue = record.activeValue;
  const reactiveValue = record.reactiveValue;
  const apparentValue = record.apparentValue;
  const pfValue = record.pfValue;

  return {
    ...record,
    dslAtpTot: activeValue,
    dslRtpTot: reactiveValue,
    dslArpTot: apparentValue,
    dslPfTot: pfValue,
    dslAtpDayAccm: activeValue,
    dslAtpTotAccm: activeValue,
    dslAtpL1: getSplitValue(activeValue, 3),
    dslAtpL2: getSplitValue(activeValue, 3),
    dslAtpL3: getSplitValue(activeValue, 3),
    dslPtpvL12: activeValue,
    dslPtpvL23: activeValue,
    dslPtpvL31: activeValue,
    dslPfrL1: pfValue,
    dslPfrL2: pfValue,
    dslPfrL3: pfValue,
    dslPaL1: getSplitValue(apparentValue, 3),
    dslPaL2: getSplitValue(apparentValue, 3),
    dslPaL3: getSplitValue(apparentValue, 3),
    dslEgnRpm: reactiveValue,
    dslClntTmp: record.ratioValue,
    dslOilPrsr: pfValue,
    dslOilTmp: record.ratioValue,
    dslFuelLvl: record.ratioValue
  };
}

function withAcFields(record: ApiRecord): ApiRecord {
  return {
    ...record,
    acOperStuscd: firstValue(record.remark, '01'),
    acSuplyAirtmp: record.activeValue,
    acRtnAirtmp: record.reactiveValue,
    acRtnAirhum: record.apparentValue
  };
}

function toLegacyRecord(row: MonitoringChartDto | MonitoringTableDto | MonitoringLatestDto, resource: MonitoringResource, latest?: MonitoringLatestDto): ApiRecord {
  const original = row as ApiRecord;
  const record = createCommonRecord(row, latest);
  const resourceRecord: ApiRecord = {
    ...record,
    ...original
  };

  if (resource === 'grid') {
    resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.baAtpTot, original.totalBasePower, original.baseAtpTot);
    resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.baRtpTot);
    resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.baArpTot);
    resourceRecord.pfValue = firstValue(resourceRecord.pfValue, original.baPfTot);
    resourceRecord.ratioValue = firstValue(resourceRecord.ratioValue, original.lgldGbcd);
    return { ...withBaseFields(resourceRecord), ...original };
  }

  if (resource === 'ess') {
    resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.essAtpTot, original.totalAssistPower, original.assistAtpTot);
    resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.essRtpTot);
    resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.essArpTot);
    resourceRecord.pfValue = firstValue(resourceRecord.pfValue, original.essPfTot);
    resourceRecord.ratioValue = firstValue(resourceRecord.ratioValue, original.essPlntSoc, original.besSocRatio, original.avgSoc);
    return { ...withEssFields(resourceRecord), ...original };
  }

  if (resource === 'pcs') {
    resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.pcsAtpTot, original.totalDispatchPower, original.dispatchAtpTot);
    resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.pcsRtpTot, original.pcsDcP);
    resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.pcsArpTot, original.pcsDcA);
    resourceRecord.pfValue = firstValue(resourceRecord.pfValue, original.pcsPfTot, original.pcsFr);
    resourceRecord.ratioValue = firstValue(resourceRecord.ratioValue, original.pcsDcV);
    return { ...withPcsFields(resourceRecord), ...original };
  }

  if (resource === 'battery') {
    resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.batterySoc, original.avgSoc, original.besSocRatio);
    resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.avgSoh);
    resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.pcsDcV);
    resourceRecord.ratioValue = firstValue(resourceRecord.ratioValue, original.avgTemperature);
    return { ...withBatteryFields(resourceRecord), ...original };
  }

  if (resource === 'diesel1' || resource === 'diesel2') {
    resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.dslAtpTot, original.totalStandbyPower, original.standbyAtpTot);
    resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.dslRtpTot);
    resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.dslArpTot);
    resourceRecord.pfValue = firstValue(resourceRecord.pfValue, original.dslPfTot);
    resourceRecord.ratioValue = firstValue(resourceRecord.ratioValue, original.dslFuelLvl, original.avgTankLevel);
    return { ...withDieselFields(resourceRecord), ...original };
  }

  resourceRecord.activeValue = firstValue(resourceRecord.activeValue, original.acSuplyAirtmp, original.pcsDcP);
  resourceRecord.reactiveValue = firstValue(resourceRecord.reactiveValue, original.acRtnAirtmp, original.pcsDcA);
  resourceRecord.apparentValue = firstValue(resourceRecord.apparentValue, original.acRtnAirhum, original.pcsDcV);
  return { ...withAcFields(resourceRecord), ...original };
}

function getMonitoringRows(response: MonitoringResponseDto | undefined, resource: MonitoringResource) {
  const sourceRows = [...(response?.chartList ?? []), ...(response?.tableList ?? [])];
  const matchedRows = sourceRows.filter((row) => matchesResource(row, resource));
  const rows = matchedRows.length > 0 ? matchedRows : sourceRows;

  return rows.map((row) => toLegacyRecord(row, resource, response?.latest));
}

function getMonitoringLatest(response: MonitoringResponseDto | undefined, resource: MonitoringResource) {
  const latestRow = response?.latest;

  if (latestRow) {
    return toLegacyRecord(latestRow, resource, latestRow);
  }

  return getMonitoringRows(response, resource).at(-1) ?? {};
}

export function toLegacyMonitoringRows(response: MonitoringResponseDto | undefined, resource: MonitoringResource) {
  return getMonitoringRows(response, resource);
}

export function toLegacyMonitoringLatest(response: MonitoringResponseDto | undefined, resource: MonitoringResource) {
  return getMonitoringLatest(response, resource);
}

function toAnalysisHistoryRow(row: AnalysisChartResponse, summary: AnalysisSummaryResponse, resource: MonitoringResource): ApiRecord {
  const baseLabel = firstValue(row.baseLabel, summary.startDate);
  const record: ApiRecord = {
    label: baseLabel,
    baseDate: baseLabel,
    esmtOperYmd: baseLabel,
    esmtOperTime: baseLabel,
    totalPower: summary.totalPower,
    avgEfficiency: summary.avgEfficiency,
    avgVoltage: summary.avgVoltage,
    avgCurrent: summary.avgCurrent,
    avgFrequency: summary.avgFrequency,
    avgPf: summary.avgPf,
    avgTemperature: summary.avgTemperature,
    avgOilPress: summary.avgOilPress,
    avgRpm: summary.avgRpm,
    avgTankLevel: summary.avgTankLevel,
    avgSoc: summary.avgSoc,
    avgSoh: summary.avgSoh,
    activeValue: row.barValue,
    reactiveValue: firstValue(row.lineValue1, row.lineValue2),
    apparentValue: row.barValue,
    pfValue: summary.avgPf,
    ratioValue: firstValue(summary.avgSoc, summary.avgEfficiency),
    barName: row.barName,
    lineName1: row.lineName1,
    lineName2: row.lineName2
  };

  if (resource === 'grid') {
    return {
      ...withBaseFields(record),
      baAtpTot: row.barValue,
      baRtpTot: firstValue(row.lineValue1, row.lineValue2),
      baArpTot: summary.totalPower,
      baPfTot: summary.avgPf,
      baPtpvL12: summary.avgVoltage,
      baPaL1: summary.avgCurrent,
      baPfrL1: summary.avgFrequency
    };
  }

  if (resource === 'ess') {
    return {
      ...withEssFields(record),
      essAtpTot: row.barValue,
      essRtpTot: firstValue(row.lineValue1, row.lineValue2),
      essArpTot: summary.totalPower,
      essPfTot: summary.avgPf,
      essPlntSoc: summary.avgSoc,
      besDhgCapa: row.lineValue1,
      besChgCapa: row.lineValue2
    };
  }

  if (resource === 'pcs') {
    return {
      ...withPcsFields(record),
      pcsAtpTot: row.barValue,
      pcsRtpTot: firstValue(row.lineValue1, row.lineValue2),
      pcsArpTot: summary.totalPower,
      pcsPfTot: summary.avgPf,
      pcsDcP: row.barValue,
      pcsDcV: summary.avgVoltage,
      pcsDcA: summary.avgCurrent,
      pcsFr: summary.avgFrequency
    };
  }

  if (resource === 'battery') {
    return {
      ...withBatteryFields(record),
      batAvgSoc: firstValue(row.barValue, summary.avgSoc),
      batAvgSoh: firstValue(row.lineValue1, summary.avgSoh),
      batAvgDcv: summary.avgVoltage,
      batAvgDca: summary.avgCurrent,
      batAvgPaktmp: summary.avgTemperature
    };
  }

  if (resource === 'diesel1' || resource === 'diesel2') {
    return {
      ...withDieselFields(record),
      dslAtpTot: row.barValue,
      dslRtpTot: firstValue(row.lineValue1, row.lineValue2),
      dslArpTot: summary.totalPower,
      dslPfTot: summary.avgPf,
      dslEgnRpm: summary.avgRpm,
      dslClntTmp: summary.avgTemperature,
      dslOilPrsr: summary.avgOilPress,
      dslFuelLvl: summary.avgTankLevel
    };
  }

  return {
    ...withAcFields(record),
    acSuplyAirtmp: row.barValue,
    acRtnAirtmp: row.lineValue1,
    acRtnAirhum: row.lineValue2
  };
}

function toAnalysisHistoryRows(summary: AnalysisSummaryResponse | undefined, resource: MonitoringResource) {
  if (!summary) {
    return [];
  }

  const chartRows = summary.chartList?.length ? summary.chartList : [{ baseLabel: summary.startDate, barValue: summary.totalPower }];

  return chartRows.map((row) => toAnalysisHistoryRow(row, summary, resource));
}

export const monitoringApi = {
  async getData<T = MonitoringResponseDto>(domain: MonitoringDomain) {
    const response = await apiClient<ApiRecord>(getMonitoringDomainPath(domain), { operationName: '모니터링 현재값 조회' });

    return toMonitoringDataResponse(response) as T;
  },
  getDetail<T = MonitoringDetailDto[]>(domain: MonitoringDomain, targetId?: string) {
    void domain;
    void targetId;

    return Promise.resolve([] as T);
  },
  getExcel(domain: MonitoringDomain) {
    return apiClient<Blob>(`/excel/${domain}`, { operationName: '엑셀 다운로드' });
  },
  getDashboardStatus<T extends ApiRecord>(mode: 'total' | 'plant' = 'total') {
    return apiClient<T>(`/monitoring/dashboard/${mode}`, { operationName: '대시보드 조회' });
  },
  async getDashboard<T extends ApiRecord>() {
    const response = await this.getDashboardStatus<ApiRecord>('total');

    return toLegacyMonitoringLatest(toMonitoringDataResponse(response), 'grid') as T;
  },
  async getLatest<T extends ApiRecord>(resource: MonitoringResource) {
    const response = await this.getData<MonitoringResponseDto>(LEGACY_RESOURCE_DOMAIN[resource]);

    return toLegacyMonitoringLatest(response, resource) as T;
  },
  async getStatus<T extends ApiRecord>(resource: MonitoringResource, params?: MonitoringSearchRequest) {
    void params;

    const response = await this.getData<MonitoringResponseDto>(LEGACY_RESOURCE_DOMAIN[resource]);

    return toLegacyMonitoringRows(response, resource) as T[];
  },
  async getHistory<T extends ApiRecord>(resource: MonitoringResource, params?: MonitoringSearchRequest) {
    const response = await apiClient<AnalysisSummaryResponse>(`${ANALYSIS_RESOURCE_PATHS[resource]}${toQueryString(toAnalysisQuery(params))}`, {
      operationName: '이력 조회'
    });

    return toAnalysisHistoryRows(response, resource) as T[];
  },
  getReport<T extends ApiRecord>(resource: ReportResource, params?: ReportSearchRequest) {
    const period = getReportPeriod(resource, params);

    return apiClient<T[]>(`/report/${period}${toQueryString(toReportQuery(period, params))}`, { operationName: '보고서 조회' });
  }
};
