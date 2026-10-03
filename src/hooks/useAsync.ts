import { useCallback, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Hook for handling async operations with loading, error, and data states
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const execute = useCallback(async () => {
    setState({ data: null, error: null, loading: true });
    try {
      const response = await asyncFunction();
      setState({ data: response, error: null, loading: false });
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: err, loading: false });
      throw err;
    }
  }, [asyncFunction]);

  // Execute on mount if immediate is true
  if (immediate && state.loading && !state.error) {
    execute();
  }

  return {
    ...state,
    execute,
  };
};

/**
 * Hook for handling form submissions with async operations
 */
export const useAsyncHandler = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    execute,
  };
};
