import { useEffect, useState } from "react";
import { Image, type ImageProps } from "expo-image";
import { cachedImageUri, peekCachedImage } from "@/lib/imageCache";

type CachedImageProps = Omit<ImageProps, "source" | "cachePolicy" | "onError"> & {
  uri: string | null | undefined;
  /** Called when the image can't be downloaded (e.g. a 404), so callers can fall back. */
  onError?: () => void;
};

/** expo-image fed from the app's own image cache (lib/imageCache.ts). Already-cached images show instantly. */
export function CachedImage({ uri, onError, ...props }: CachedImageProps) {
  const [local, setLocal] = useState(() => (uri ? peekCachedImage(uri) : null));

  useEffect(() => {
    if (!uri) {
      setLocal(null);
      return;
    }
    const hit = peekCachedImage(uri);
    setLocal(hit);
    if (hit) return;
    let live = true;
    cachedImageUri(uri).then(
      (file) => live && setLocal(file),
      () => live && onError?.()
    );
    return () => {
      live = false;
    };
    // onError is a callback prop; re-running on its identity would refetch on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  // The file is already on disk, so expo-image only needs to keep it in memory
  return <Image {...props} source={local ? { uri: local } : null} cachePolicy="memory" />;
}
