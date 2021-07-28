import { Card, Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import CustomGoogleMap, {
  InfoWindow,
} from 'components/GoogleMap/CustomGoogleMap';
import { Model } from 'core/models';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import React, { createContext, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, Switch } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import signalRService, { SignalRService } from 'services/SignalRService';
import dashboardManagerRepository from 'views/DashboardManagerView/DashboardManagerRepository';
import { useDashboardMap } from 'views/DashboardManagerView/DashboardMapHook';

const SignalRContext = createContext<SignalRService>(null);

function ATestMapView(props: RouteConfigComponentProps) {
  const {
    isLoad,
    setIsLoad,

    places,
  } = useDashboardMap(dashboardManagerRepository.storeCoverage);

  const [filter] = React.useState<DashboardDirectorFilter>(
    new DashboardDirectorFilter(),
  );

  const map = useMemo(
    () => (
      <CustomGoogleMap
        filter={filter}
        setIsLoad={setIsLoad}
        isLoad={isLoad}
        getPlace={dashboardManagerRepository.storeCoverage}
        places={places}
        renderInfoWindow={renderInfoWindow}
      />
    ),
    [filter, setIsLoad, isLoad, places],
  );

  return (
    <SignalRContext.Provider value={signalRService}>
      <Switch>
        <Route path={props.route.path}>
          <Card>
            <Row>
              <Col lg={12}>
                <FormItem>
                  {/* <AdvancedTreeFilter
                    filter={filter.organizationId}
                    filterType={nameof(filter.organizationId.equal)}
                    value={filter.organizationId.equal}
                    onChange={handleFilter(nameof(filter.organizationId))}
                    getList={dashboardManagerRepository.filterListOrganization}
                    modelFilter={childFilter}
                    setModelFilter={setChildFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  /> */}
                  {map}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Route>
      </Switch>
    </SignalRContext.Provider>
  );
}

function renderInfoWindow<T extends Model>(place: T) {
  return ReactDOMServer.renderToString(
    <InfoWindow
      place={place}
      displayKeys={['storeName', 'telephone', 'imageUrl']}
    />,
  );
}

export default ATestMapView;
