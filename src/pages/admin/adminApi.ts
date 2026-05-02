import { apiClient } from '../../shared/api/apiClient';
import type { ApiRecord } from '../../shared/api/apiDataUtils';
import { getRawValue } from '../../shared/api/apiDataUtils';
import { getPageContents, type ApiPageResponse } from '../../shared/api/monitoringApi';

export type MasterResource = 'plants' | 'pcs' | 'inverters' | 'batteries' | 'diesels';

export type RoleMenuNode = ApiRecord & {
  children?: RoleMenuNode[];
};

type MasterResourceEndpoint = {
  idKey: string;
  sequenceKey: string;
};

const masterResourceEndpoints: Record<MasterResource, MasterResourceEndpoint> = {
  plants: { idKey: 'plntId', sequenceKey: 'plntSeq' },
  pcs: { idKey: 'pcsId', sequenceKey: 'pcsSeq' },
  inverters: { idKey: 'ivtId', sequenceKey: 'ivtSeq' },
  batteries: { idKey: 'batId', sequenceKey: 'batSeq' },
  diesels: { idKey: 'dslId', sequenceKey: 'dslSeq' }
};

function toPagedRows(response: ApiPageResponse<ApiRecord> | ApiRecord[] | undefined) {
  return getPageContents(response);
}

function createMasterDetailPath(resource: MasterResource, row: ApiRecord) {
  const endpoint = masterResourceEndpoints[resource];
  const id = getRawValue(row[endpoint.idKey]);
  const sequence = getRawValue(row[endpoint.sequenceKey]);

  if (!id || !sequence) {
    return '';
  }

  return `/master/${resource}/${encodeURIComponent(id)}/${encodeURIComponent(sequence)}`;
}

export const adminApi = {
  async getUsers() {
    return toPagedRows(await apiClient<ApiPageResponse<ApiRecord> | ApiRecord[]>('/system/users'));
  },
  async getRoles() {
    return toPagedRows(await apiClient<ApiPageResponse<ApiRecord> | ApiRecord[]>('/system/roles'));
  },
  async getUserRoles(userId: string) {
    return apiClient<ApiRecord[]>(`/system/users/${encodeURIComponent(userId)}/roles`);
  },
  async getCodes() {
    return toPagedRows(await apiClient<ApiPageResponse<ApiRecord> | ApiRecord[]>('/system/codes'));
  },
  async getRoleMenuTree(roleId: string) {
    return apiClient<RoleMenuNode[]>(`/system/roles/${encodeURIComponent(roleId)}/menus/tree`);
  },
  async getMasterRows(resource: MasterResource) {
    return toPagedRows(await apiClient<ApiPageResponse<ApiRecord> | ApiRecord[]>(`/master/${resource}`));
  },
  async getMasterDetail(resource: MasterResource, row: ApiRecord) {
    const detailPath = createMasterDetailPath(resource, row);

    if (!detailPath) {
      return row;
    }

    return apiClient<ApiRecord>(detailPath);
  }
};
