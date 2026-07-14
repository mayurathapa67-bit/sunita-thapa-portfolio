// SAFE VERSION - NO FILE READING
// Returns empty objects on Vercel, API routes will fetch from GitHub

export function readDB() {
  return {}; // Always return empty - pages should use API instead
}

export function writeDB(data: any) {
  console.warn('writeDB called but not implemented for Vercel');
  return false;
}

export function readDrafts() {
  return {};
}

export function writeDrafts(data: any) {
  console.warn('writeDrafts called but not implemented for Vercel');
  return false;
}

export function clearDraft(section: string) {
  return false;
}