import { MENU_URL_REGEX } from 'config/consts';
import { menu } from 'config/menu';
import {
  DASHBOARD_ROUTE,
  DASHBOARD_USER_ROUTE,
  DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_GENERAL_ROUTE,
  DIRECT_SALES_ORDER_OWNER_ROUTE,
  DIRECT_SALES_ORDER_ROUTE,
  DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_GENERAL_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_ROUTE,
  INDIRECT_SALES_ORDER_ROUTE,
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
} from 'config/route-consts';
import { SystemConfiguration } from 'models/SystemConfiguration';
import { Reducer, useEffect } from 'react';
import { RouteConfig } from 'react-router-config';
import { useReducer } from 'reactn';
import permissionService from 'services/PermissionService';

export interface AppState {
  permissionPaths?: string[];
  authorizedMenus?: RouteConfig[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
}

export interface AppAction {
  type: AppActionEnum;
  data: AppState;
}

export enum AppActionEnum {
  SET_PERMISSION,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.SET_PERMISSION: {
      return {
        ...state,
        ...action.data,
      };
    }
  }
}

export default function useAuthorizedApp() {
  const [
    {
      permissionPaths,
      authorizedMenus,
      authorizedAction,
      authorizedMenuMapper,
    },
    dispatch,
  ] = useReducer<Reducer<AppState, AppAction>>(appReducer, {
    permissionPaths: [],
    authorizedMenus: [],
    authorizedAction: [],
    authorizedMenuMapper: null,
  });
  useEffect(() => {
    let isCancelled = false;
    try {
      const fetch = async () => {
        let permissions = [];
        const listportal = await permissionService.listPath();
        const listMDM = await permissionService.listPathMDM();
        const checkSYS = await permissionService.getSystemConfig();
        permissions = [...listportal, ...listMDM];

        if (!isCancelled) {
          if (permissions.length > 0) {
            const menuMapper: Record<string, number> = {};
            const actions: string[] = [];
            permissions.forEach((path: string, index) => {
              if (path.includes('rpc')) {
                menuMapper[`/${path as string}`] = index;
              } else {
                if (path.match(MENU_URL_REGEX)) {
                  menuMapper[`/${path as string}`] = index;
                  // set legal action
                  // }
                }
              }
              actions.push(path);
            });

            dispatch({
              type: AppActionEnum.SET_PERMISSION,
              data: {
                permissionPaths: [...permissions],
                authorizedMenus: menu.map((item: RouteConfig) =>
                  mapTree(item, menuMapper, checkSYS),
                ),
                authorizedAction: actions,
                authorizedMenuMapper: menuMapper,
              }, // update all appState
            });
            return;
          }
          dispatch({
            type: AppActionEnum.SET_PERMISSION,
            data: {
              authorizedMenuMapper: {
                hasAnyPermission: 0,
              },
            },
          }); // if listPath length === 0, set hasAnyPermission to 0
        }
      };
      fetch();
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.log(`ex: `, ex);
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    permissionPaths,
    authorizedMenus,
    authorizedMenuMapper,
    authorizedAction,
  };
}

const mapTree = (
  tree: RouteConfig,
  mapper: Record<string, number>,
  checkSYS?: SystemConfiguration,
) => {
  const { path, children, validPath } = tree;
  let isShow = false;

  if (path === DASHBOARD_ROUTE) isShow = true; // always show dashboard because dashboard user visible by default
  if (path === DASHBOARD_USER_ROUTE) isShow = true; // default url when user has right to access dms
  if (!validPath && mapper.hasOwnProperty(path as string)) isShow = true; // if any path contained by mapper's keys
  if (validPath && mapper.hasOwnProperty(validPath as string)) {
    isShow = true; // if any path contained by mapper's keys
  }

  /* Check direct sale order */

  if (
    path === DIRECT_SALES_ORDER_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;

  if (
    path === DIRECT_SALES_ORDER_OWNER_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  ) {
    isShow = false;
  }

  if (
    path === DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;

  if (
    path === DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === DIRECT_SALES_ORDER_GENERAL_ROUTE &&
    checkSYS?.usE_DIRECT_SALES_ORDER === false
  )
    isShow = false;
  /* Check indirect sale order */

  if (
    path === INDIRECT_SALES_ORDER_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_OWNER_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (
    path === INDIRECT_SALES_ORDER_GENERAL_ROUTE &&
    checkSYS?.usE_INDIRECT_SALES_ORDER === false
  )
    isShow = false;
  if (typeof tree.checkVisible === 'function' && tree.notTitle)
    isShow = tree.checkVisible(mapper);
  if (typeof tree.checkVisible === 'function' && tree?.visible)
    isShow = tree.checkVisible(mapper);
  if (!children || (typeof children === 'object' && children.length === 0))
    return { ...tree, isShow };

  return {
    ...tree,
    isShow,
    children: children.map((item: RouteConfig) =>
      mapTree(item, mapper, checkSYS),
    ),
  };
};
