import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import AlbumDetail from './AlbumDetail/AlbumDetail';
import AlbumMaster from './AlbumMaster/AlbumMaster';
import './AlbumView.scss';

function AlbumView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { AlbumMaster, AlbumDetail };
export default withRouter(AlbumView);
