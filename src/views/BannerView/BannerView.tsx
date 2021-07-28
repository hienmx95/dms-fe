import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import './BannerView.scss';
import BannerMaster from 'views/BannerView/BannerMaster/BannerMaster';
import BannerDetail from 'views/BannerView/BannerDetail/BannerDetail';

function BannerView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}
export { BannerMaster, BannerDetail };
export default withRouter(BannerView);
