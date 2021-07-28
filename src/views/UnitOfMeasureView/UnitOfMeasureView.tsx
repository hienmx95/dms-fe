import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import UnitOfMeasureDetail from './UnitOfMeasureDetail/UnitOfMeasureDetail';
import UnitOfMeasureMaster from './UnitOfMeasureMaster/UnitOfMeasureMaster';

import './UnitOfMeasureView.scss';

function UnitOfMeasureView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { UnitOfMeasureMaster, UnitOfMeasureDetail };
export default withRouter(UnitOfMeasureView);
