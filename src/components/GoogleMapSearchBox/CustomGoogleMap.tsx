import { Input } from 'antd';
import { storeIcon } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import './CustomGoogleMap.scss';
import { GoogleMapServiceAutoComplete } from './GoogleMapServiceAutoComplete';

export interface Place {
  key: string;
  displayName?: string;
  storeName?: string;
  markerIcon?: string;
  zIndex?: number;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  telephone?: string;
  address?: string;
  phone?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const SpinContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

export const mapOverlayStyle: React.CSSProperties = {
  display: 'block',
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  background: 'rgba(0, 0, 0, 0.2)',
};

interface CustomGoogleMapProps<T extends Model, TFilter extends ModelFilter> {
  isLoad: boolean;
  setIsLoad: Dispatch<SetStateAction<boolean>>;
  renderInfoWindow: (place: T) => string;
  filter?: TFilter;
  getPlace?: (filter: TFilter) => Promise<T[]>;
  places?: T[];
}
export default function CustomGoogleMap<
  T extends Model,
  TFilter extends ModelFilter
>({
  isLoad,
  setIsLoad,
  places,
  renderInfoWindow,
}: CustomGoogleMapProps<T, TFilter>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapService = useRef<GoogleMapServiceAutoComplete>(null);
  const [translate] = useTranslation();

  useEffect(() => {
    if (mapContainer.current) {
      mapService.current = new GoogleMapServiceAutoComplete(
        mapContainer.current,
      );
    }
  }, []);

  useEffect(() => {
    const {
      map,
      clearClusters,
      addMarkers,
      subscriptions,
      unSubscribe,
      cluster,
      addCluster,
      setCluster,
      _getCluster,
      addSearchValue,
    } = mapService.current;
    if (map && isLoad && typeof renderInfoWindow === 'function') {
      if (cluster) {
        clearClusters(); // clear cluster if it exists
      }
      // tslint:disable-next-line:no-unused-expression
      places.length > 0 && addMarkers(places, renderInfoWindow); // add markers to markers array
      addSearchValue();
      subscriptions.push(_getCluster().subscribe(addCluster)); // subcribe to add marker to map
      setCluster();
      setIsLoad(false);
      return unSubscribe;
    }
  }, [places, isLoad, setIsLoad, renderInfoWindow]);

  return (
    <>
      <Input
        id="pac-input"
        className="form-control form-control-sm"
        type="text"
        placeholder={translate('priceLists.store.placeholder.address')}
      />
      <div id="google-map" ref={mapContainer} style={containerStyle} />
    </>
  );
}

interface InfoWindowProps<T extends Model> {
  place: T;
  displayKeys: string[];
}

export function InfoWindow<T extends Model>({
  place,
  displayKeys,
}: InfoWindowProps<T>) {
  const [translate] = useTranslation();
  const renderRowContent = useMemo(() => {
    return (key: string) => {
      const value: string | number = key ? place[key] : '';
      if (key.match(/(storeName)$/i)) {
        return <h3>{value}</h3>;
      }
      if (key.match(/(storeCode)$/i)) {
        return <div className="store-code mb-3">{value}</div>;
      }
      if (key.match(/(topBrandName)$/i)) {
        return (
          <div className="top-brand d-flex align-items-center">
            <i className="tio tio-award mr-2" />
            {value}
          </div>
        );
      }
      if (key.match(/(telephone)$/i)) {
        return (
          <div className="store-phone d-flex align-items-center">
            <i className="tio tio-call mr-2" />
            {value}
          </div>
        );
      }
      if (key.match(/(address)$/i)) {
        return (
          <div className="store-phone d-flex align-items-center">
            <i className="tio tio-poi mr-2" />
            {value}
          </div>
        );
      }

      if (key.match(/^(image)/i)) {
        return (
          <div>
            <span>
              {value && (
                <>
                  <b>{translate('maps.image')}: </b>
                  <div
                    className="image-thumb-wrap p-1 mt-2"
                    style={{
                      width: '100%',
                      height: 170,
                      background: `#e8e8e8 center / auto 100% no-repeat url('${value}')`,
                    }}
                  ></div>
                </>
              )}
            </span>
          </div>
        );
      }

      return (
        <p>
          <span>
            <b>{translate(`maps.${key}`)}: </b>
          </span>
          {value}
        </p>
      );
    };
  }, [place, translate]);

  return (
    <>
      {displayKeys?.length > 0 ? (
        <>
          <img src={storeIcon} alt="" />
          {displayKeys.map((key: string) => (
            <div key={key}>{renderRowContent(key)}</div>
          ))}
        </>
      ) : (
        <>Không có dữ liệu</>
      )}
    </>
  );
}
