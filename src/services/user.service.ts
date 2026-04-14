import satellite from "@/lib/satellite";
import type { User } from "@/types/user";
import type { Response, WithPagination } from "@/types/response";
import type { AuthOn } from "@/types/auth";

export const getMe = async (on: AuthOn) => {
  let url = "/api/user/me";
  if (on === "live") {
    url = "/api/live/user/me";
  }
  const response = await satellite.get<Response<{ user: User }>>(url);
  return response.data.data.user;
};

export const getPaginatedUsers = async (params: {
  page: number;
  limit: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  search_fields?: string;
}) => {
  const response = await satellite.get<Response<WithPagination<User>>>(
    "/api/user/manage/paginate",
    {
      params,
    },
  );
  return response.data.data;
};

export const editUserProfile = async (
  on: AuthOn,
  id: string,
  payload: { name?: string; phone_number?: string; avatar?: File | null },
) => {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }
  if (payload.phone_number !== undefined && payload.phone_number !== "62") {
    formData.append("phone_number", payload.phone_number);
  }
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  let url = "/api/user/manage/:id/edit";
  if (on === "live") {
    url = "/api/live/user/edit/:id";
  }
  const response = await satellite.put<Response<{ user: User }>>(
    url.replace(":id", id),
    formData,
  );
  return response.data.data.user;
};

export const changePassword = async (
  id: string,
  payload: { password: string },
) => {
  const response = await satellite.patch<Response<{ user: User }>>(
    `/api/live/user/change-password/${id}`,
    payload,
  );
  return response.data.data.user;
};

export const switchUserRole = async (id: string) => {
  const response = await satellite.patch<Response<{ user: User }>>(
    `/api/user/manage/${id}/role-switch`,
  );
  return response.data.data.user;
};

export const removeUser = async (id: string) => {
  const response = await satellite.delete<Response<unknown>>(
    `/api/user/manage/${id}`,
  );
  return response.data.data;
};
