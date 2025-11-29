import api from '../api';
import { PaginationMeta, RequestModel, ResponseModel } from '../models/response.model';
import { UsersResponse } from '../models/user.model';

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
};
