import React, { ReactElement } from 'react';
import './OrganizationTree.scss';
import { TreeProps as AntTreeProps } from 'antd/lib/tree';
import { Model } from 'core/models';
import classNames from 'classnames';
import OrganizationTreeNode from './OrganizationTreeNode/OrganizationTreeNode';
import { Id } from 'react3l';

export interface TreeProps<T> extends AntTreeProps {
  className?: string;

  parent?: T;

  tree?: T[];

  nodePadding?: number;

  children?: ReactElement<any> | ReactElement<any>[];

  nodeLevel?: number;

  onAdd?(node: T): () => void;

  onChange?(value: T[]): void;

  onDelete?(node: T): () => void;

  onEdit?(id: Id): () => void;

  onPreview?(node: T): () => void;

  onActive?(node: T): void;

  onChangeDisplay?(node: T): () => void;

  currentItem?: any;
}

function OrganizationTree<T extends Model>(props: TreeProps<T>) {
  const {
    tree,
    className,
    onAdd,
    onEdit,
    onPreview,
    onDelete,
    onActive,
    onChangeDisplay,
    nodeLevel,
    nodePadding,
    children,
    currentItem,
  } = props;

  return (
    <ul className={classNames('tree', className)}>
      {typeof children === 'object' ? (
        children
      ) : (
        <>
          {tree?.map((node: T) => {
            return (
              <OrganizationTreeNode
                className={classNames({ 'tree-active': node === currentItem })}
                key={node.id}
                node={node}
                onAdd={onAdd}
                onPreview={onPreview}
                onEdit={onEdit}
                onDelete={onDelete}
                onActive={onActive}
                onChangeDisplay={onChangeDisplay}
                nodeLevel={nodeLevel}
                nodePadding={nodePadding}
                currentItem={currentItem}
              ></OrganizationTreeNode>
            );
          })}
        </>
      )}
    </ul>
  );
}

OrganizationTree.defaultProps = {
  nodePadding: 12,
  nodeLevel: 0,
};

export default OrganizationTree;
