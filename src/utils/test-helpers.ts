export function parsePrice(text: string): number {
  const cleaned = text.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}
