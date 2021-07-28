import { Card, Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import React, { RefObject } from 'react';
import { Route, Switch } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';

function ATestMapMonitorView(props: RouteConfigComponentProps) {

  return (
    <Switch>
      <Route path={props.route.path}>
        <Card>
          <Row>
            <Col lg={12}>
              <FormItem>
                <div style={{ height: 300 }} className="mt-4">
                     {() => renderMap()}
                </div>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Route>
    </Switch>
  );
}

function GoogleMapMonitor(){
    const defaultZoom = 1;
    const ref: RefObject<any> = React.useRef<any>(null);
    const lat = 21.0278;
    const lng = 105.8342;
    const [places] = React.useState<any[]>([]);
    return (<Map
        ref={ref}
        google={google}
        zoom={defaultZoom}
        initialCenter={{ lat, lng }}
      >
        {places.length > 0 &&
          places.map((place, i) => {
            return (
              <Marker key={i} position={place.geometry.location} />
            );
          })}
        {places.length === 0 && <Marker position={{ lat, lng }} />}
      </Map>);
}

const renderMap = () => {
    return GoogleApiWrapper({
        apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
        libraries: ['places'],
      })(GoogleMapMonitor);
};

export default ATestMapMonitorView;
