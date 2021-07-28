import { Card, Spin } from 'antd';
import CustomGoogleMap, {
  InfoWindow,
  mapOverlayStyle,
  Place,
  SpinContainerStyle,
} from 'components/GoogleMap/CustomGoogleMap';
import { Model } from 'core/models';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import { StoreCheckerMonitorFilter } from 'models/monitor/StoreCheckerMonitorFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React, { useMemo, Dispatch, SetStateAction } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useDashboardMap } from './DashboardMapHook';

export interface StoreCheckingMapProps {
  getList?: (filter: StoreCheckerMonitorFilter) => Promise<Place[]>;
  getFilterList?: (filter: OrganizationFilter) => Promise<Organization[]>;
  filter?: DashboardDirectorFilter;
  loadMap?: boolean;
  setLoadMap?: Dispatch<SetStateAction<boolean>>;
}

export default function StoreCheckingMap({
  getList,
  filter,
  loadMap,
  setLoadMap,
}: StoreCheckingMapProps) {
  const {
    translate,
    loadMarker,
    setLoadMarker,

    places,
    loading,
  } = useDashboardMap(getList, filter, loadMap, setLoadMap);

  return (
    <>
      <Card className="mt-3 mb-3 map-card card-dashboard">
        <div className="chart-title mt-3 mb-3 d-flex justify-content-between align-items-center">
          <div className="col">
            <span>
              <i className="tio tio-poi_user mr-3" />
            </span>
            <span>{translate('dashboardManager.title.employeeLocation')}</span>
          </div>
          {/* <div className="col mr-2">
            <AdvancedTreeFilter
              filter={filter.organizationId}
              filterType={nameof(filter.organizationId.equal)}
              value={filter.organizationId.equal}
              onChange={handleFilter(nameof(filter.organizationId))}
              getList={getFilterList}
              modelFilter={childFilter}
              setModelFilter={setChildFilter}
              placeholder={translate('general.placeholder.title')}
              mode="single"
            />
          </div> */}
        </div>
        <Card className="map-card">
          <div style={{ height: 300 }}>
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
        </Card>
      </Card>
    </>
  );
}

function renderInfoWindow<T extends Model>(place: T) {
  return ReactDOMServer.renderToString(
    <InfoWindow place={place} displayKeys={['displayName', 'phone']} />,
  );
}
