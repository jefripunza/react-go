export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "system";

export interface INotification {
  id: number;
  type: NotificationType;
  title: { id: string; en: string };
  message: { id: string; en: string };
  link?: string;
  navigate?: string;
  is_read: boolean;
  created_at: string; // ISO 8601
  read_at: string | null;
}
