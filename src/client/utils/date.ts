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
