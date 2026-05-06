import { EMPTY_API_VALUE } from '../api/apiDataUtils';

export const HOURLY_CHART_SLOT_WIDTH = 80;
export const FULL_DAY_TIME_LABELS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);
export const FULL_DAY_TIME_CHART_MIN_WIDTH = FULL_DAY_TIME_LABELS.length * HOURLY_CHART_SLOT_WIDTH;
export const FULL_DAY_TIME_CHART_MAX_WIDTH = 2560;

export function getHourlyChartMinWidth(labelCount = FULL_DAY_TIME_LABELS.length) {
  return Math.max(FULL_DAY_TIME_CHART_MIN_WIDTH, labelCount * HOURLY_CHART_SLOT_WIDTH);
}

export function getHourlyChartMaxWidth(labelCount = FULL_DAY_TIME_LABELS.length) {
  return labelCount <= FULL_DAY_TIME_LABELS.length ? FULL_DAY_TIME_CHART_MAX_WIDTH : undefined;
}

export function normalizeHourLabel(value: string) {
  const trimmedValue = value.trim();
  const timeMatch = trimmedValue.match(/(\d{1,2}):(\d{2})/);

  if (!timeMatch) {
    return EMPTY_API_VALUE;
  }

  const hour = Number(timeMatch[1]);

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return EMPTY_API_VALUE;
  }

  return `${String(hour).padStart(2, '0')}:00`;
}

export function getHourlySlotLabel(dateLabel: string, timeLabel: string) {
  return dateLabel ? `${dateLabel} ${timeLabel}` : timeLabel;
}
