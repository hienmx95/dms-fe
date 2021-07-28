import { Spin } from 'antd';
import CustomGoogleMap, {
  InfoWindow,
  mapOverlayStyle,
  Place,
  SpinContainerStyle,
} from 'components/GoogleMapSearchBox/CustomGoogleMap';
import { Model } from 'core/models';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import { StoreCheckerMonitorFilter } from 'models/monitor';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useDashboardMap } from './DashboardMapHook';

export interface StoreCoverageMapProps {
  getList?: (filter: StoreCheckerMonitorFilter) => Promise<Place[]>;
  getFilterList?: (filter: OrganizationFilter) => Promise<Organization[]>;
  filter?: DashboardDirectorFilter;
  loadMap?: boolean;
  setLoadMap?: Dispatch<SetStateAction<boolean>>;
}

export default function StoreMap({
  getList,
  filter,
  loadMap,
  setLoadMap,
}: StoreCoverageMapProps) {
  const {
    translate,
    loadMarker,
    setLoadMarker,
    places,
    loading,
  } = useDashboardMap(getList, filter, loadMap, setLoadMap);

  return (
    <>
      <div style={{ height: '100%', position: 'relative' }}>
        {useMemo(
          () => (
            <CustomGoogleMap
              setIsLoad={setLoadMarker}
              isLoad={loadMarker}
              places={places}
              renderInfoWindow={renderInfoWindow}
            />
          ),
          [setLoadMarker, loadMarker, places],
        )}
        {loading && (
          <div style={mapOverlayStyle}>
            <div style={SpinContainerStyle}>
              <Spin tip={translate('general.actions.updatingData')} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function renderInfoWindow<T extends Model>(place: T) {
  return ReactDOMServer.renderToString(
    <InfoWindow
      place={place}
      displayKeys={[
        'storeName',
        'storeCode',
        'topBrandName',
        'telephone',
        'address',
      ]}
    />,
  );
}
