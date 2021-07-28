import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import ProductGroupingTreeDetail from './ProductGroupingTreeDetail/ProductGroupingTreeDetail';
import ProductGroupingTreeMaster from './ProductGroupingTreeMaster/ProductGroupingTreeMaster';

import './ProductGroupingView.scss';

function ProductGroupingTreeView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { ProductGroupingTreeMaster, ProductGroupingTreeDetail };
export default withRouter(ProductGroupingTreeView);
