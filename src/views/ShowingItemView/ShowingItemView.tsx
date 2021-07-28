import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import ShowingItemDetail from './ShowingItemDetail/ShowingItemDetail';
import ShowingItemMaster from './ShowingItemMaster/ShowingItemMaster';
import './ShowingItem.scss';

function ShowingItemView(props: RouteConfigComponentProps) {
    const { route } = props;

    return (
        <Switch>
            {route && renderRoutes(route.children)}
        </Switch>
    );
}

export { ShowingItemMaster, ShowingItemDetail };
export default withRouter(ShowingItemView);
