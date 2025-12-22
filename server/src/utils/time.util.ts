export function getSafeIsoTimestamp(date: Date): string {
  return date.toISOString().replace(/:/g, '-').replace(/\..+/, '');
}
