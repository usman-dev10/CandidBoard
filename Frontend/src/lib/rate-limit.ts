const hits = new Map<string, { n: number; t: number }>();

export function tooMany(ip: string, max = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > windowMs) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > max;
}
