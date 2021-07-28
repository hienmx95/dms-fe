import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import WorkflowStepDetail from './WorkflowStepDetail/WorkflowStepDetail';
import WorkflowStepMaster from './WorkflowStepMaster/WorkflowStepMaster';
import './WorkflowStepView.scss';

function WorkflowStepView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { WorkflowStepMaster, WorkflowStepDetail };
export default withRouter(WorkflowStepView);
