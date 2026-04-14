export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}
