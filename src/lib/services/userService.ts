import { apiRequest } from '@/middleware/errorHandler';
import api from '../api';
import { ApiResponse, PaginationMeta, RequestModel, ResponseModel } from '../models/response.model';
import { UserDetailWithSettings, UsersResponse } from '../models/user.model';

const baseURL = '/users';

export interface PaginatedUsersResponse extends ResponseModel<UsersResponse> {
  data: UsersResponse;
  meta: PaginationMeta;
}

export const UserService = {
  async getAllUsersWithSettings(payload?: RequestModel): Promise<PaginatedUsersResponse> {
    const response = await api.get(`${baseURL}/all`, { params: { ...payload } });
    return response.data as PaginatedUsersResponse;
  },

  async getUserById(id: string): Promise<ApiResponse<UserDetailWithSettings>> {
    return apiRequest<UserDetailWithSettings>(() => api.get(`${baseURL}/${id}`).then((res) => res.data));
  },

  async toggleUserBlock(id: string): Promise<ResponseModel<{ id: string; isBlocked: boolean }>> {
    const response = await api.patch(`${baseURL}/${id}/block`);
    return response.data as ResponseModel<{ id: string; isBlocked: boolean }>;
  },
};
