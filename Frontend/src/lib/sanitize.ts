const TAG = /[<>]/g;

export function sanitize(value: string, max = 2000) {
  return value.replace(TAG, "").slice(0, max);
}

export function clean(value: string, max = 2000) {
  return sanitize(value, max).trim();
}

export function safeToken(value: string) {
  return clean(value, 128);
}
