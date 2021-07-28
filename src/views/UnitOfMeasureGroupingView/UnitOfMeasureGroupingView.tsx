import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import UnitOfMeasureGroupingDetail from './UnitOfMeasureGroupingDetail/UnitOfMeasureGroupingDetail';
import UnitOfMeasureGroupingMaster from './UnitOfMeasureGroupingMaster/UnitOfMeasureGroupingMaster';

import './UnitOfMeasureGroupingView.scss';

function UnitOfMeasureGroupingView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { UnitOfMeasureGroupingMaster, UnitOfMeasureGroupingDetail };
export default withRouter(UnitOfMeasureGroupingView);
