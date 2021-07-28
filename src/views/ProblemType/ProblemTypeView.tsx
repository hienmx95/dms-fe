import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import ProblemTypeDetail from './ProblemTypeDetail/ProblemTypeDetail';
import ProblemTypeMaster from './ProblemTypeMaster/ProblemTypeMaster';

import './ProblemTypeView.scss';

function ProblemTypeView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ProblemTypeMaster, ProblemTypeDetail };
export default withRouter(ProblemTypeView);