import { Model, ModelFilter } from 'core/models';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMapService } from './GoogleMapService';
import './CustomGoogleMap.scss';

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
  const mapService = useRef<GoogleMapService>(null);

  useEffect(() => {
    if (mapContainer.current) {
      mapService.current = new GoogleMapService(mapContainer.current);
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
    } = mapService.current;
    if (map && isLoad && typeof renderInfoWindow === 'function') {
      if (cluster) {
        clearClusters(); // clear cluster if it exists
      }
      // tslint:disable-next-line:no-unused-expression
      places.length > 0 && addMarkers(places, renderInfoWindow); // add markers to markers array
      subscriptions.push(_getCluster().subscribe(addCluster)); // subcribe to add marker to map
      setCluster();
      setIsLoad(false);
      return unSubscribe;
    }
  }, [places, isLoad, setIsLoad, renderInfoWindow]);

  return <div id="google-map" ref={mapContainer} style={containerStyle} />;
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
      if (key.match(/(name)$/i)) {
        return <h3>{value}</h3>;
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
