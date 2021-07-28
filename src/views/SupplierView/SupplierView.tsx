import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import SupplierDetail from './SupplierDetail/SupplierDetail';
import SupplierMaster from './SupplierMaster/SupplierMaster';
import './SupplierView.scss';

function SupplierView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { SupplierMaster, SupplierDetail };
export default withRouter(SupplierView);
