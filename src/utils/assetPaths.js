const BASE_URL = import.meta.env.BASE_URL || '/';

export function resolveAssetPath(path) {
  const value = String(path || '');
  if (!value) return '';

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value;
  }

  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (normalizedBase && (value === normalizedBase || value.startsWith(`${normalizedBase}/`))) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${normalizedBase}${value}`;
  }

  return `${normalizedBase}/${value}`;
}
