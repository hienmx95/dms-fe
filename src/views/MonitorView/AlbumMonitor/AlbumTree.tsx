import React, { ReactElement } from 'react';
import AlbumTreeNode from './AlbumTreeNode';
import './AlbumTree.scss';
import { TreeProps as AntTreeProps } from 'antd/lib/tree';
import { Album } from 'models/Album';
import { Model } from 'core/models';
import classNames from 'classnames';
// tslint:disable-next-line:no-empty-interface
export interface AlbumTreeProps<T> extends AntTreeProps {
  tree?: T[];
  nodePadding?: number;
  className?: string;
  nodeLevel?: number;
  children?: ReactElement<any> | ReactElement<any>[];
  onActive?(node: T): void;
  currentItem?: T;
}

const AlbumTree = <T extends Model>(props: AlbumTreeProps<T>) => {
  const {
    tree,
    nodePadding,
    className,
    nodeLevel,
    children,
    onActive,
    currentItem,
  } = props;

  return (
    <div className={classNames('album-tree', className)}>
      {typeof children === 'object' ? (
        children
      ) : (
        <>
          {tree?.map((node: Album) => {
            return (
              <AlbumTreeNode
                key={node.id + nodeLevel}
                node={node}
                onActive={onActive}
                nodeLevel={nodeLevel}
                nodePadding={nodePadding}
                currentItem={currentItem}
                className={classNames({
                  'tree-active':
                    node.id?.toString() === currentItem.id?.toString(), // setActive from click or default from filter
                })}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

AlbumTree.defaultProps = {
  nodePadding: 12,
  nodeLevel: 0,
};

export default AlbumTree;
