import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

// Bump the version to invalidate everything cached by older app builds.
const PREFIX = "@pokedex/v2/";
// Old and current API cache keys. User data (favorites) lives under "@pokedex-user/" and is never cleared here.
const CACHE_ROOT = "@pokedex/";

const memory = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

/** Memory → AsyncStorage → fetcher. Concurrent callers for the same key share one request. */
export function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const fullKey = PREFIX + key;
  if (memory.has(fullKey)) return Promise.resolve(memory.get(fullKey) as T);
  const pending = inflight.get(fullKey);
  if (pending) return pending as Promise<T>;

  const promise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(fullKey).catch(() => null);
      if (raw !== null) {
        try {
          const value = JSON.parse(raw) as T;
          memory.set(fullKey, value);
          return value;
        } catch {
          // corrupt entry — fall through and refetch
        }
      }
      const value = await fetcher();
      memory.set(fullKey, value);
      // storage write failure is non-fatal — app continues with live data
      AsyncStorage.setItem(fullKey, JSON.stringify(value)).catch(() => {});
      return value;
    } finally {
      inflight.delete(fullKey);
    }
  })();
  inflight.set(fullKey, promise);
  return promise;
}

async function cacheKeys(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter((k) => k.startsWith(CACHE_ROOT));
}

/** Approximate bytes used by cached API data. */
export async function cacheSize(): Promise<number> {
  const entries = await AsyncStorage.multiGet(await cacheKeys());
  return entries.reduce((sum, [, v]) => sum + (v?.length ?? 0), 0);
}

export async function clearCache(): Promise<void> {
  memory.clear();
  await AsyncStorage.multiRemove(await cacheKeys());
  await Image.clearDiskCache().catch(() => {});
  await Image.clearMemoryCache().catch(() => {});
}
