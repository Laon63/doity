import { format } from 'date-fns';

export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = 'MMM d'
): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (e) {
    console.error('Error formatting date:', e);
    return String(date); // Fallback to original string if formatting fails
  }
}

export function getRangeOfDay(date: Date): [Date, Date] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return [startOfDay, endOfDay];
}

export function getRangeOfMonth(date: Date): [Date, Date] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return [startOfMonth, endOfMonth];
}
