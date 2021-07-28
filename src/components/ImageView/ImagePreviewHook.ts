import { Model } from 'core/models';
import { Dispatch, SetStateAction } from 'react';

export function ImagePreviewHook<T extends Model>(
  currentItem?: T,
  setCurrentItem?: Dispatch<SetStateAction<T>>,
  onSave?: () => void,
  onClose?: () => void,
) {
  return {
    currentItem,
    setCurrentItem,
    onSave,
    onClose,
  };
}
