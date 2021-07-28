import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import TaxTypeDetail from './TaxTypeDetail/TaxTypeDetail';
import TaxTypeMaster from './TaxTypeMaster/TaxTypeMaster';

import './TaxTypeView.scss';

function TaxTypeView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { TaxTypeMaster, TaxTypeDetail };
export default withRouter(TaxTypeView);