import NavbarBrand from '@coreui/react/lib/NavbarBrand';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import classNames from 'classnames';
import { MenuContext } from 'core/components/App/AppContext';
import { AppUser } from 'models/AppUser';
import React, {
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useLocation } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useGlobal } from 'reactn';
import { v4 as uuidv4 } from 'uuid';
import './DefaultSidebar.scss';
import SidebarMenu from './SidebarMenu';

const { Sider } = Layout;

interface IDefaultSidebarProps extends RouteComponentProps {
  className?: string;
}

interface NavbarBrandLogoProps {
  src: string;

  width?: number;

  height?: number;

  alt?: string;
}

export interface DefaultSidebarState {
  selectedKeys?: string[];
  openKeys?: string[];
  navbarBrandFull?: NavbarBrandLogoProps;
}

export interface DefaultSidebarAction {
  type: DefaultSidebarEnum;
  data?: DefaultSidebarState;
  selectedKeys?: string[];
  openKeys?: string[];
  navbarBrandFull?: NavbarBrandLogoProps;
}

export enum DefaultSidebarEnum {
  SET_LOGO,
  SET_KEY,
}

export function DefaultSidebarReducer(
  state: DefaultSidebarState,
  action: DefaultSidebarAction,
): DefaultSidebarState {
  switch (action.type) {
    case DefaultSidebarEnum.SET_LOGO: {
      return {
        ...state,
        navbarBrandFull: action.navbarBrandFull,
      };
    }
    case DefaultSidebarEnum.SET_KEY: {
      return {
        ...state,
        openKeys: action.openKeys,
        selectedKeys: action.selectedKeys,
      };
    }
  }
}

function DefaultSidebar(props: IDefaultSidebarProps) {
  const { className } = props;
  const { pathname } = useLocation();
  const ref = useRef<boolean>(true);
  const [user] = useGlobal<AppUser>('user');
  const routes = useContext<RouteConfig[]>(MenuContext);

  const [{ selectedKeys, openKeys, navbarBrandFull }, dispatch] = useReducer<
    Reducer<DefaultSidebarState, DefaultSidebarAction>
  >(DefaultSidebarReducer, {
    selectedKeys: [],
    openKeys: [],
    navbarBrandFull: {
      src: '',
      width: 150,
      height: 50,
    },
  });

  useEffect(() => {
    if (ref.current) {
      if (user?.appUserSiteMappings && user?.appUserSiteMappings?.length > 0) {
        user.appUserSiteMappings?.forEach(item => {
          const code: string = item?.site?.code;
          if (pathname.includes(`${code}`)) {
            const logo = item.site.logo;
            dispatch({
              type: DefaultSidebarEnum.SET_LOGO,
              navbarBrandFull: {
                ...navbarBrandFull,
                src: logo,
              },
            });
          }
        });
        ref.current = false;
      }
    }
    dispatch({
      type: DefaultSidebarEnum.SET_KEY,
      openKeys: getOpenKeys(routes, pathname),
      selectedKeys: [convertPathName(pathname)],
    });
  }, [user, navbarBrandFull, pathname, routes]);

  const handleChange = useCallback(
    (keys: string[]) => {
      dispatch({
        type: DefaultSidebarEnum.SET_KEY,
        openKeys: [...keys],
        selectedKeys: [...selectedKeys],
      });
    },
    [selectedKeys],
  );

  const handleSelect = useCallback(
    ({ selectedKeys }) => {
      dispatch({
        type: DefaultSidebarEnum.SET_KEY,
        openKeys: getOpenKeys(routes, pathname),
        selectedKeys: [...selectedKeys],
      });
    },
    [pathname, routes],
  );

  return (
    <div>
      <div className={classNames('header-navbar-brand pb-4', className)}>
        <NavbarBrand full={navbarBrandFull} />
      </div>
      <Sider collapsible={false} className={classNames('pb-4', className)}>
        <Menu
          mode="inline"
          className="default-sidebar"
          inlineIndent={0}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleChange}
          onSelect={handleSelect}
        >
          {routes.length > 0 &&
            routes.map((route: RouteConfig) => (
              <SidebarMenu
                {...props}
                key={route.key ? route.key : uuidv4()}
                item={route}
              />
            ))}
        </Menu>
      </Sider>
    </div>
  );
}

/* pathName param from url */
function getOpenKeys(items: RouteConfig[], pathName) {
  const selectedKeys = [];
  items.forEach(item => {
    const paths = item.path
      .toString()
      .trim()
      .split('/');
    const modulePath = buildPath(paths);
    if (
      item.path === pathName ||
      item.key === pathName ||
      pathName.toString().indexOf(modulePath) !== -1
    ) {
      selectedKeys.push(item.key ? item.key : item.path);
    }
    if (item.children) {
      const itemKeys = getOpenKeys(item.children, pathName);
      selectedKeys.push(...itemKeys);
    }
  });
  return selectedKeys;
}

/* convert pathName which retrieved from url to master url of its module, to activating menu master item */
function convertPathName(pathName: string) {
  pathName = buildPath(pathName.trim().split('/'));
  if (pathName.match(/(-?detail)$/)) {
    return pathName.replace('detail', 'master');
  }
  if (pathName.match(/(-?preview)$/)) {
    return pathName.replace('preview', 'master');
  }
  return pathName;
}

/* builPath from item path, contain maximum 4 element. Eg: /dms/product-category/product/product-master */
function buildPath(paths: string[]) {
  let result = '';
  if (paths.length < 5) {
    for (let i = 1; i < paths.length; i++) {
      result = result + '/' + paths[i];
    }
    return result;
  }
  return `${paths[0]}/${paths[1]}/${paths[2]}/${paths[3]}/${paths[4]}`;
}

export default withRouter(DefaultSidebar);
