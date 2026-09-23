export function numberValue(value: unknown): number {
  return Number(value ?? 0);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
