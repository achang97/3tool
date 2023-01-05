import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

const DEFAULT_DEBOUNCE_TIME_MS = 300;

type HookReturnType = {
  query: string;
  debouncedQuery: string;
  handleQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useDebouncedQuery = (
  debounceTimeMs = DEFAULT_DEBOUNCE_TIME_MS
): HookReturnType => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSetDebouncedQuery = useMemo(() => {
    return debounce(
      (newQuery: string) => setDebouncedQuery(newQuery),
      debounceTimeMs
    );
  }, [debounceTimeMs]);

  const handleQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      debouncedSetDebouncedQuery(e.target.value);
    },
    [debouncedSetDebouncedQuery]
  );

  return { query, debouncedQuery, handleQueryChange };
};
