import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import { IDefaultSidebarProps } from './SidebarMenu';
import './DefaultSidebar.scss';
import { Menu } from 'antd';

function ItemRenderer(props: IDefaultSidebarProps) {
  const { staticContext, item, ...rest } = props;
  const [translate] = useTranslation();

  return (
    <>
      {item.isShow && (
        <Menu.Item key={item.path as string} {...rest}>
          <Link to={item.path as string}>
            {item.icon && <i className={item.icon} />}
            <span className="ml-2">{translate(item.name)}</span>
          </Link>
        </Menu.Item>
      )}
    </>
  );
}

export default withRouter(ItemRenderer);
