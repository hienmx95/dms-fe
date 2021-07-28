import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import ProductTypeDetail from './ProductTypeDetail/ProductTypeDetail';
import ProductTypeMaster from './ProductTypeMaster/ProductTypeMaster';

import './ProductTypeView.scss';

function ProductTypeView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ProductTypeMaster, ProductTypeDetail };
export default withRouter(ProductTypeView);
