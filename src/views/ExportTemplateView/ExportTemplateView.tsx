import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import './ExportTemplateView.scss';
import ExportTemplateDetail from './ExportTemplateDetail/ExportTemplateDetail';
import ExportTemplateMaster from './ExportTemplateMaster/ExportTemplateMaster';

function ExportTemplateView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { ExportTemplateMaster, ExportTemplateDetail };
export default withRouter(ExportTemplateView);
