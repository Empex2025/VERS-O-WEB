import { useEffect, useState } from 'react';

interface ApiDataResult<T> {
    data: T;
    loading: boolean;
    /** true quando a API falhou e estamos exibindo o mock (modo demo). */
    isFallback: boolean;
    error: unknown;
}

/**
 * Busca dados da API e, em caso de falha (API fora do ar), usa o `fallback` (mock)
 * para manter a tela navegável. Reexecuta quando `deps` mudam.
 */
export function useApiData<T>(fetcher: () => Promise<T>, fallback: T, deps: unknown[] = []): ApiDataResult<T> {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        fetcher()
            .then((res) => {
                if (!active) return;
                setData(res);
                setIsFallback(false);
            })
            .catch((err) => {
                if (!active) return;
                setData(fallback);
                setIsFallback(true);
                setError(err);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, loading, isFallback, error };
}
