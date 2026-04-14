import { toZeroPadding } from "@/utils/convert";

export const formatDateTime = (date: string) =>
  new Date(date)
    .toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\./g, ":");

export const formatDateTimeReverse = (date: string) => {
  const [dateString, timeString] = formatDateTime(date).split(", ");
  const fixDate = dateString.split("/").reverse().join("-");
  return `${fixDate}, ${timeString}`;
};

export const formatDate = (date: string) => {
  const [month, day, year] = new Date(date).toLocaleDateString().split("/");
  return `${year}-${toZeroPadding(Number(month))}-${toZeroPadding(Number(day))}`;
};
