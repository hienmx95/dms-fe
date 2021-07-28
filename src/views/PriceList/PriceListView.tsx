import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import PriceListDetail from './PriceListDetail/PriceListDetail';
import PriceListMaster from './PriceListMaster/PriceListMaster';

import './PriceList.scss';

function PriceListView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { PriceListMaster, PriceListDetail };
export default withRouter(PriceListView);
