// App-managed image cache: remote images are downloaded once into <cache>/images and shown from the
// local file. Managing the folder ourselves gives an exact count/size (expo-image's own disk cache
// lives where Expo Go can't read it) and a size cap on every platform.
import { Platform } from "react-native";
import { Directory, File, Paths } from "expo-file-system";

export const IMAGE_CACHE_LIMIT = 100 * 1024 * 1024; // 100 MB
// Trim a little below the limit so we don't trim again on the very next download
const TRIM_TARGET = IMAGE_CACHE_LIMIT * 0.9;

// No file system on web; there the browser's HTTP cache does the job
const enabled = Platform.OS !== "web";
const dir = enabled ? new Directory(Paths.cache, "images") : null;
const inflight = new Map<string, Promise<string>>();
let trimTimer: ReturnType<typeof setTimeout> | null = null;

function fileFor(url: string): File {
  // e.g. https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/25.png → pokemon_25.png
  const name = url
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^gh\/PokeAPI\/sprites@master\/sprites\//, "")
    .replace(/[^a-zA-Z0-9.]+/g, "_");
  return new File(dir!, name);
}

/** Local uri if the image is already cached, else null (on web, the remote url). Synchronous. */
export function peekCachedImage(url: string): string | null {
  if (!enabled) return url;
  try {
    const file = fileFor(url);
    return file.exists ? file.uri : null;
  } catch {
    return null;
  }
}

/** Local uri for a remote image, downloading it on first use. Rejects if the download fails (e.g. 404). */
export function cachedImageUri(url: string): Promise<string> {
  const hit = peekCachedImage(url);
  if (hit) return Promise.resolve(hit);

  let pending = inflight.get(url);
  if (!pending) {
    pending = (async () => {
      try {
        dir!.create({ intermediates: true, idempotent: true });
        const file = await File.downloadFileAsync(url, fileFor(url), { idempotent: true });
        scheduleTrim();
        return file.uri;
      } finally {
        inflight.delete(url);
      }
    })();
    inflight.set(url, pending);
  }
  return pending;
}

function cachedFiles(): File[] {
  if (!dir?.exists) return [];
  return dir.list().filter((f): f is File => f instanceof File);
}

export function imageCacheStats(): { count: number; bytes: number } {
  if (!enabled) return { count: 0, bytes: 0 };
  const files = cachedFiles();
  return { count: files.length, bytes: files.reduce((sum, f) => sum + (f.size ?? 0), 0) };
}

/** Which entries to delete: nothing while under `limit`, else oldest first until at or under `target`. */
export function pickEvictions<T extends { size: number; time: number }>(entries: T[], limit: number, target: number): T[] {
  let total = entries.reduce((sum, e) => sum + e.size, 0);
  if (total <= limit) return [];
  const evict: T[] = [];
  for (const e of [...entries].sort((a, b) => a.time - b.time)) {
    if (total <= target) break;
    evict.push(e);
    total -= e.size;
  }
  return evict;
}

/** Over the limit → delete the oldest-downloaded images until back under it. */
export function trimImageCache(): void {
  if (!enabled) return;
  try {
    const entries = cachedFiles().map((f) => ({ f, size: f.size ?? 0, time: f.modificationTime ?? 0 }));
    for (const e of pickEvictions(entries, IMAGE_CACHE_LIMIT, TRIM_TARGET)) e.f.delete();
  } catch {
    // trimming is best effort; it runs again after the next download
  }
}

// Downloads come in bursts (scrolling the grid), so trim once things settle
function scheduleTrim() {
  if (trimTimer) clearTimeout(trimTimer);
  trimTimer = setTimeout(trimImageCache, 3000);
}

export function clearImageCache(): void {
  if (dir?.exists) dir.delete();
}
