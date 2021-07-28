import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import SurveyDetail from './SurveyDetail/SurveyDetail';
import SurveyMaster from './SurveyMaster/SurveyMaster';
import './SurveyView.scss';

function SurveyView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { SurveyMaster, SurveyDetail };
export default withRouter(SurveyView);
