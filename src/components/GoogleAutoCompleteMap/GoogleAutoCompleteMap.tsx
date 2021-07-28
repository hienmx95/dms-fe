import { Model } from 'core/models';
import { GoogleAPI, GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import SearchBox from './SearchBox';
import './GoogleAutoCompleteMap.scss';
export interface GoogleAutoCompleteMapProps<T> {
  defaultAddress?: string; // default value for autocomplate
  defaultZoom: number; // default zoom for map
  google: GoogleAPI; // google Api instance for map
  lat: number; // latitude
  lng: number; // longitude
  inputClassName?: string;
  inputMapClassName?: string;
  model: T;
  setModel: Dispatch<SetStateAction<T>>;
  isAddress: boolean;
  placeholder?: string;
  onSearchBoxChange?: (value: string) => void;
  onPlacesChanged?: (
    address: string,
    latitude: number,
    longitude: number,
  ) => void;
  disabled?: boolean;
}

function GoogleAutoCompleteMap<T extends Model>(
  props: GoogleAutoCompleteMapProps<T>,
) {
  const {
    defaultAddress,
    defaultZoom,
    google,
    lat,
    lng,
    inputClassName,
    placeholder,
    disabled,
    onPlacesChanged,
    onSearchBoxChange,
  } = props;
  const ref: RefObject<any> = React.useRef<any>(null);
  const [places, setPlaces] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (lat && lng) {
      ref.current.map.setCenter({ lat, lng });
    }
  }, [lat, lng]);

  const handlePlacesChanged = React.useCallback(
    places => {
      if (places !== undefined) {
        setPlaces(places);
        const { 0: place } = places;
        if (!place || !place.geometry) return;
        if (place.geometry.viewport && typeof onPlacesChanged === 'function') {
          const address = place.formatted_address;
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          onPlacesChanged(address, latitude, longitude);
          ref.current.map.fitBounds(place.geometry.viewport);
        } else {
          ref.current.map.setCenter(place.geometry.location);
          ref.current.map.setZoom(2);
        }
      }
    },
    [onPlacesChanged],
  );

  return (
    <div>
      <SearchBox
        onPlacesChanged={handlePlacesChanged}
        mapApi={google.maps}
        defaultAddress={defaultAddress}
        className={inputClassName}
        placeholder={placeholder}
        onSearchBoxChange={onSearchBoxChange}
        disabled={disabled}
      />
      <div style={{ display: 'block' }}>
        <Map
          ref={ref}
          google={google}
          zoom={defaultZoom}
          initialCenter={{ lat, lng }}
        >
          {places.length > 0 &&
            places.map((place, i) => {
              return <Marker key={i} position={place.geometry.location} />;
            })}
          {places.length === 0 && <Marker position={{ lat, lng }} />}
        </Map>
      </div>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
  libraries: ['places'],
})(GoogleAutoCompleteMap);
