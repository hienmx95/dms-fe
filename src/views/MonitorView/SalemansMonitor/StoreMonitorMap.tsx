import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerProps,
  useLoadScript,
} from '@react-google-maps/api';
import { Spin } from 'antd';
import {
  INDIRECT_SALES_ORDER_ROUTE,
  STORE_PROBLEMS_MONITOR,
} from 'config/route-consts';
import { formatDateTime } from 'core/helpers/date-time';
import { buildAbsoluteLink } from 'core/helpers/string';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { StoreProblemsMonitor } from 'models/monitor/StoreProblemsMonitor';
import { Moment } from 'moment';
import React, { ReactChildren, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
export interface Place {
  key: string;
  storeName?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  checkIn?: Moment;
  checkOut?: Moment;
  saleOrders?: IndirectSalesOrder;
  storeProblems?: StoreProblemsMonitor[];
  storeCompetitors?: StoreProblemsMonitor[];
  imageUrl?: string;
}

const containerStyle = {
  width: '100%',
  height: '600px',
};
const defaultCenter = {
  lat: 21.027763,
  lng: 105.83416,
};
export interface StoreMonitorMapProps {
  defaultZoom?: number; // default zoom for map
  center?: google.maps.LatLngLiteral;
  places?: Place[];
  children?: ReactChildren;
}

const libraries = ['places'] as any;

export default function StoreMonitorMap(props: StoreMonitorMapProps) {
  const [translate] = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_APIKEY,
    libraries,
  });
  if (loadError) {
    return <>Error when loading map</>;
  }
  if (!isLoaded) {
    return <Spin tip={translate('general.actions.loadingMap')} />;
  }
  return (
    <>
      <Map {...props} />
    </>
  );
}

interface MapProps {
  defaultZoom?: number; // default zoom for map
  center?: google.maps.LatLngLiteral;
  places?: Place[];
  children?: ReactChildren;
}

const Map = (props: MapProps) => {
  const { defaultZoom, center, places, children } = props;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={defaultZoom}
    >
      {places.map(place => (
        <MarkerView mapInstance={window.google} place={place} key={place.key} />
      ))}
      {children}
    </GoogleMap>
  );
};

interface MarkerViewProps extends MarkerProps {
  mapInstance: typeof google;
  onClick?: (marker: any) => void;
  place?: Place;
}

const MarkerView = (props: MarkerViewProps) => {
  const [translate] = useTranslation();
  const { place, onClick } = props;
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const handleClick = useCallback(
    (event: any) => {
      if (typeof onClick === 'function') {
        onClick(event);
      }
      setShowInfo(true);
    },
    [onClick],
  );

  const handleClose = useCallback(() => {
    setShowInfo(false);
  }, []);

  return (
    <Marker
      position={{ lat: +place.latitude, lng: +place.longitude }}
      onClick={handleClick}
      // icon="assets/img/brand/location.svg"
    >
      {showInfo && (
        <InfoWindow onCloseClick={handleClose}>
          <div style={{ minWidth: 200 }}>
            <h3 className="mb-3">{place.storeName}</h3>
            <p>{place.address}</p>
            <p>
              <span>
                <b>{translate('maps.checkIn')}: </b>
              </span>
              {formatDateTime(place.checkIn)}
            </p>
            <p>
              <span>
                <b>{translate('maps.checkOut')}: </b>
              </span>
              {formatDateTime(place.checkOut)}
            </p>
            <p>
              <span>
                <b>{translate('maps.saleOrder')}: </b>
              </span>
              <Link
                to={{
                  pathname: buildAbsoluteLink(
                    `${INDIRECT_SALES_ORDER_ROUTE}#${place.saleOrders?.code}`,
                  ),
                }}
                key={place.saleOrders?.code}
              >
                {place.saleOrders?.code}
              </Link>
            </p>
            <div>
              <span>
                <b>{translate('maps.storeProblems')}: </b>
              </span>
              <ul>
                {place.storeProblems?.length > 0 &&
                  place.storeProblems.map(problem => (
                    <Link
                      to={{
                        pathname: problem?.id
                          ? buildAbsoluteLink(
                              `${STORE_PROBLEMS_MONITOR}/?id=${problem?.id}`,
                            )
                          : '#',
                      }}
                      key={problem.code}
                    >
                      <li>{problem.code}</li>
                    </Link>
                  ))}
              </ul>
            </div>
            <div>
              <span>
                <b>{translate('maps.image')}: </b>
                {place.imageUrl && (
                  <>
                    <div
                      className="image-thumb-wrap p-1 mt-2"
                      style={{
                        width: '100%',
                        height: 170,
                        background: `#e8e8e8 center / auto 100% no-repeat url('${place.imageUrl}')`,
                      }}
                    ></div>
                  </>
                )}
              </span>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

MarkerView.defaultProps = {
  position: defaultCenter,
};
