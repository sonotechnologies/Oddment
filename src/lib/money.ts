/** Money is pence everywhere. Format only at the edges. */
export function formatPence(pence: number): string {
  const pounds = pence / 100;
  return pence % 100 === 0 ? `£${pounds.toFixed(0)}` : `£${pounds.toFixed(2)}`;
}
