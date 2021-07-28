import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import './WorkflowDefinitionView.scss';
import WorkflowDefinitionDetail from './WorkflowDefinitionDetail/WorkflowDefinitionDetail';
import WorkflowDefinitionMaster from './WorkflowDefinitionMaster/WorkflowDefinitionMaster';
import WorkflowDefinitionPreview from './WorkflowDefinitionPreview/WorkflowDefinitionPreview';

function WorkflowDefinitionView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { WorkflowDefinitionDetail, WorkflowDefinitionMaster, WorkflowDefinitionPreview };
export default withRouter(WorkflowDefinitionView);
