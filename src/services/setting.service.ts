import satellite from "@/lib/satellite";
import type { Response } from "@/types/response";

export const settingService = {
  getAll: async () => {
    const response = await satellite.get<Response<Record<string, string>>>(
      "/api/setting/all",
    );
    return response.data.data;
  },

  setNewPassword: async (last_password: string, password: string) => {
    const response = await satellite.put<Response<unknown>>(
      "/api/setting/set",
      {
        auth_password: password,
      },
      {
        headers: {
          "X-Last-Password": last_password,
        },
      },
    );
    return response.data;
  },

  toggleMaintenance: async () => {
    const response = await satellite.post<
      Response<{ maintenance_mode: boolean }>
    >("/api/setting/toggle-maintenance");
    return response.data;
  },
};
