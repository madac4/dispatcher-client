export interface ResponseModel<T> {
  data: T | null;
  status: number;
  success: boolean;
  message?: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedModel<T> extends ResponseModel<T[]> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type SelectModel = {
  label: string;
  value: string;
};

export class RequestModel {
  page: number;
  limit: number;
  search?: string;
  [key: string]: string | number | string[] | number[] | undefined | boolean;

  constructor(data?: RequestModel) {
    this.page = data?.page || 1;
    this.limit = data?.limit || 10;
    this.search = data?.search || '';
  }
}

export type ApiResponse<T> = {
  data: T | null;
  message: string | undefined;
};
