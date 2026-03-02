export function parsePrice(text: string): number {
  const normalizedPrice  = text.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(normalizedPrice );
}
