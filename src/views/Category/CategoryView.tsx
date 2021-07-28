import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import CategoryMaster from './CategoryMaster/CategoryMaster';
import CategoryDetail from './CategoryDetail/CategoryDetail';
import './Category.scss';
function CategoryView(props: RouteConfigComponentProps) {
  const { route } = props;
  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { CategoryMaster, CategoryDetail };
export default withRouter(CategoryView);
