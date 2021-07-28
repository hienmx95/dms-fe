import React from 'react';
import './CollapsibleCard.scss';
import Card, { CardProps } from 'antd/lib/card';
import classNames from 'classnames';

function CollapsibleCard(props: CardProps) {
  const {
    title,
    children,
    className,
    ...restProps
  } = props;

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const handleToggleCard = React.useCallback(
    () => {
      setCollapsed(!collapsed);
    },
    [collapsed],
  );

  return (
    <Card {...restProps}
      className={classNames('collapsible-card', 'head-borderless', className, {
        collapsed,
      })}
      title={(
        <div className="d-flex justify-content-between">
          <span className="ml-12">
            {title}
          </span>
          {!collapsed && (
            <button className="btn-collapsed" onClick={handleToggleCard}>
              <i className="fa fa-angle-down" />
            </button>
          )}
          {collapsed && (
            <span className="btn-collapsed" onClick={handleToggleCard}>
              <i className="fa fa-angle-up" />
            </span>
          )
          }

        </div>
      )}
    >
      {children}
    </Card>
  );
}

export default CollapsibleCard;
