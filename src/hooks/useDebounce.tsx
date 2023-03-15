/* eslint-disable valid-jsdoc */
import { useEffect, useState } from 'react';

/**
 * Aplica debounce e retorna valor 'atrasado'
 * @param value valor a aplicar debounce
 * @param delay tempo de debounce
 * @return {string} Valor com debounce
 */
export function useDebounce<T>(value: string | any, delay: number = 400, minCharacters: number = 0) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          if (typeof value == 'string') {
            if (value.length > 0 && value.length < minCharacters) return;
          }

          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay, minCharacters], // Only re-call effect if value or delay changes
  );
  return debouncedValue as T;
}
