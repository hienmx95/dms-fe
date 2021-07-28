import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import PromotionCodeDetail from './PromotionCodeDetail/PromotionCodeDetail';
import PromotionCodeMaster from './PromotionCodeMaster/PromotionCodeMaster';
import PromotionCodePreview from './PromotionCodeMaster/PromotionCodePreview';
import './PromotionCodeView.scss';

function PromotionCodeView(props: RouteConfigComponentProps) {
  const { route } = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { PromotionCodeMaster, PromotionCodeDetail, PromotionCodePreview };
export default withRouter(PromotionCodeView);
