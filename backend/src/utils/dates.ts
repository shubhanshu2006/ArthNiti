/** Returns the start of a given day (00:00:00.000) */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns the end of a given day (23:59:59.999) */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Returns a Date that is `n` days before the reference date */
export function daysAgo(n: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

/** Returns the current fiscal quarter string, e.g. "Q2-FY2025" */
export function currentQuarter(date: Date = new Date()): string {
  const month = date.getMonth(); // 0-indexed
  // Indian fiscal year: April–March
  // Q1: Apr-Jun (3-5), Q2: Jul-Sep (6-8), Q3: Oct-Dec (9-11), Q4: Jan-Mar (0-2)
  let quarter: number;
  let fiscalYear: number;

  if (month >= 3) {
    fiscalYear = date.getFullYear() + 1;
    if (month <= 5) quarter = 1;
    else if (month <= 8) quarter = 2;
    else quarter = 3;
  } else {
    fiscalYear = date.getFullYear();
    quarter = 4;
  }

  return `Q${quarter}-FY${fiscalYear}`;
}

/** Calculates the number of days between two dates */
export function daysBetween(from: Date, to: Date): number {
  const msPerDay = 86_400_000;
  return Math.round(Math.abs(to.getTime() - from.getTime()) / msPerDay);
}
