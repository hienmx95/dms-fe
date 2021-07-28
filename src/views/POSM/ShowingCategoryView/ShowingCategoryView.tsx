import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import ShowingCategoryMaster from './ShowingCategoryMaster/ShowingCategoryMaster';
import ShowingCategoryDetail from './ShowingCategoryDetail/ShowingCategoryDetail';
import './ShowingCategoryView.scss';
function ShowingCategoryView(props: RouteConfigComponentProps) {
  const { route } = props;
  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { ShowingCategoryMaster, ShowingCategoryDetail };
export default withRouter(ShowingCategoryView);
