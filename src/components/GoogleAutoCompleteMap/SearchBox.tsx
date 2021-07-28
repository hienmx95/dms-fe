import React, { RefObject, Dispatch, ChangeEvent } from 'react';
import { useCallback } from 'reactn';
import { debounce } from 'core/helpers/debounce';
import { useTranslation } from 'react-i18next';

export interface SearchBoxProps {
  map?: any;
  mapApi: any;
  placeholder?: string;
  onPlacesChanged: Dispatch<React.SetStateAction<any[]>>;
  className?: string;
  defaultAddress?: string;
  onSearchBoxChange?: (value: string) => void;
  disabled?: boolean;
}

function SearchBox(props: SearchBoxProps) {
  const ref: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const [translate] = useTranslation();
  const { onPlacesChanged, disabled, onSearchBoxChange } = props;
  const searchBox = React.useRef<google.maps.places.SearchBox>(null);

  const handlePlacesChanged = React.useCallback(() => {
    if (onPlacesChanged) {
      onPlacesChanged(searchBox.current.getPlaces());
      ref.current.value = null;
    }
  }, [onPlacesChanged, searchBox]);

  const handleSearchBoxChange = useCallback(
    debounce((value: string) => {
      ref.current.value = null;
      if (typeof onSearchBoxChange === 'function') {
        onSearchBoxChange(value);
      }
    }),
    [onSearchBoxChange],
  );

  React.useEffect(() => {
    searchBox.current = new google.maps.places.SearchBox(ref.current);
    searchBox.current.addListener('places_changed', handlePlacesChanged);
    return () => {
      google.maps.event.clearInstanceListeners(searchBox);
    };
  }, [handlePlacesChanged]);

  return (
    <div className="input-container">
      <i className="tio-search" />
      <input
        ref={ref}
        type="text"
        className="form-control form-control-sm mb- input-map"
        placeholder={translate('general.actions.searchLocation')}
        disabled={disabled}
        onBlur={(e: ChangeEvent<HTMLInputElement>) =>
          handleSearchBoxChange(e.target.value)
        }
      />
    </div>
  );
}

export default SearchBox;
