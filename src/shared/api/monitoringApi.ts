import { apiClient } from './apiClient';
import type { ApiRecord } from './apiDataUtils';

export type MonitoringResource = 'grid' | 'ess' | 'pcs' | 'battery' | 'diesel1' | 'diesel2' | 'ac';
export type ReportResource = MonitoringResource;

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
  page?: number;
  size?: number;
};

export type ReportSearchRequest = MonitoringSearchRequest & {
  reportType?: 'DAILY' | 'MONTHLY' | 'YEARLY';
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

export function getPageContents<T>(response: ApiPageResponse<T> | T[] | undefined) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.contents ?? [];
}

export const monitoringApi = {
  getDashboard<T extends ApiRecord>() {
    return apiClient<T>('/monitoring/dashboard');
  },
  getLatest<T extends ApiRecord>(resource: MonitoringResource) {
    return apiClient<T>(`/monitoring/${resource}/latest`);
  },
  getStatus<T extends ApiRecord>(resource: MonitoringResource, params?: MonitoringSearchRequest) {
    return apiClient<T[]>(`/monitoring/${resource}/status${toQueryString(params)}`);
  },
  getHistory<T extends ApiRecord>(resource: MonitoringResource, params?: MonitoringSearchRequest) {
    return apiClient<ApiPageResponse<T> | T[]>(`/monitoring/${resource}/history${toQueryString(params)}`);
  },
  getReport<T extends ApiRecord>(resource: ReportResource, params?: ReportSearchRequest) {
    return apiClient<T[]>(`/report/${resource}${toQueryString(params)}`);
  }
};
