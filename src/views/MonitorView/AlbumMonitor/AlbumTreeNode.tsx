import { Tooltip } from 'antd';
import classNames from 'classnames';
import { sliceText } from 'core/helpers/string';
import { Model } from 'core/models';
import React, { ReactElement } from 'react';
import AlbumTree from './AlbumTree';

export interface AlbumTreeNodeProps<T extends Model> {
  node?: T;
  nodeLevel?: number;
  nodePadding?: number;
  currentItem?: T;
  onActive?(node: T): void;
  className?: string;
  children?: ReactElement<any> | ReactElement<any>[];
}

const AlbumTreeNode = <T extends Model>(props: AlbumTreeNodeProps<T>) => {
  const {
    node,
    nodeLevel,
    nodePadding,
    currentItem,
    onActive,
    children,
  } = props;
  const hasChildren: boolean = node?.children?.length > 0;
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleToggle = React.useCallback(
    (node: T) => {
      return () => {
        setIsExpanded(!isExpanded);
        if (onActive) {
          onActive(node);
        }
      };
    },
    [isExpanded, onActive],
  );

  return (
    <>
      <div
        key={node.id}
        className={classNames('album-tree-node d-flex align-items-center', {
          'tree-node-active':
            node.id?.toString() === currentItem.id?.toString(), // setActive from click or default from filter
        })}
        style={{
          paddingLeft: `${nodePadding}px`,
          width: `${100 + nodeLevel * 0.11}%`,
          borderRadius: `3px`,
        }}
        onClick={handleToggle(node)}
      >
        <div className={'album-label pr-2'}>
          <i role="button" className={classNames('tio-folder_photo')} />
        </div>
        {/* name */}
        <div className={'album-name p-2'}>
          {node?.name.length > 50 ? (
            <Tooltip placement="topLeft" title={node?.name}>
              <span className="display"> {sliceText(node?.name)} </span>
            </Tooltip>
          ) : (
            <span className="display"> {sliceText(node?.name)} </span>
          )}
          {children}
        </div>
        {/* toggle */}
        <span
          className={classNames('album-toggle p-2 ml-auto', {
            show: hasChildren,
          })}
        >
          <i
            className={isExpanded ? 'tio-chevron_down' : 'tio-chevron_right'}
          />
        </span>
      </div>
      {/* render subtree */}
      {hasChildren && (
        <div
          key={node.id + 1}
          style={{
            marginLeft: `${nodePadding + 5}px`,
            width: 'unset',
          }}
        >
          <AlbumTree
            tree={node.children}
            className={classNames(
              'sub-tree',
              {
                expanded: isExpanded,
              },
              'parent-border',
            )}
            nodePadding={nodePadding}
            nodeLevel={nodeLevel + 1}
            currentItem={currentItem}
          />
        </div>
      )}
    </>
  );
};

export default AlbumTreeNode;
