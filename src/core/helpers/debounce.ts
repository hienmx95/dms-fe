import {useState, useEffect} from 'react';
import lodashDebounce from 'lodash/debounce';
import {INPUT_DEBOUNCE_TIME} from '../config';

export function debounce(fn: (...params: any[]) => any, debounceTime: number = INPUT_DEBOUNCE_TIME) {
  return lodashDebounce(fn, debounceTime);
}

export function useDebounce(){
  const [debouncedValue, setDebouncedValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, INPUT_DEBOUNCE_TIME);
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  return {debouncedValue, setSearchValue};
}