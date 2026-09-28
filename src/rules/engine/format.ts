export function signed(value: number): string {
  return value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
}

export function damageFormula(dice: string, modifier: number): string {
  // 零调整值不附加尾项，负数只保留一个减号。
  return modifier === 0 ? dice : `${dice}${signed(modifier)}`;
}
