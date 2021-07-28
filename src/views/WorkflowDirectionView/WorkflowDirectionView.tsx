import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import WorkflowDirectionDetail from './WorkflowDirectionDetail/WorkflowDirectionDetail';
import WorkflowDirectionMaster from './WorkflowDirectionMaster/WorkflowDirectionMaster';
import './WorkflowDirectionView.scss';

function WorkflowDirectionView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { WorkflowDirectionMaster, WorkflowDirectionDetail };
export default withRouter(WorkflowDirectionView);
