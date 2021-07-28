import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import KpiGeneralDetail from './KpiGeneralDetail/KpiGeneralDetail';
import KpiGeneralMaster from './KpiGeneralMaster/KpiGeneralMaster';
import './KpiGeneralView.scss';

function KpiGeneralView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { KpiGeneralMaster, KpiGeneralDetail };
export default withRouter(KpiGeneralView);
