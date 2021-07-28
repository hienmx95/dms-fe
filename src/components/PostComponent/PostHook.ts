import { Model } from 'core/models';
import { useState, useEffect, useCallback } from 'react';

export default function usePostHook<T extends Model>(
  modelClass: new () => T,
  defaultModel: T,
  onSubmit: (model: T) => void,
) {
  const [model, setModel] = useState<T>(new modelClass());

  useEffect(() => {
    setModel({ ...new modelClass(), ...defaultModel });
  }, [defaultModel, modelClass]);

  const handleChange = useCallback(
    (value: string) => {
      setModel({ ...model, content: value });
    },
    [model],
  );

  const handleSubmit = useCallback(
    (item: T) => {
      return () => {
        if (onSubmit) {
          onSubmit(item);
        }
        setModel({ ...model, content: '' });
      };
    },
    [model, onSubmit],
  );

  return {
    model,
    setModel,
    handleChange,
    handleSubmit,
  };
}
