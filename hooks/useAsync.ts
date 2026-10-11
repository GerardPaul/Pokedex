import { useEffect, useState, type DependencyList } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Runs `fn` whenever `deps` change; results from stale runs are dropped. Pass `null` to skip. */
export function useAsync<T>(fn: (() => Promise<T>) | null, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: fn !== null, error: null });

  useEffect(() => {
    if (!fn) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    fn().then(
      (data) => !cancelled && setState({ data, loading: false, error: null }),
      () => !cancelled && setState({ data: null, loading: false, error: "Failed to load. Please check your connection." })
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
