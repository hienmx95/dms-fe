import React, { ReactElement } from 'react';
import './ProductGroupingTree.scss';
import { TreeProps as AntTreeProps } from 'antd/lib/tree';
import { Model } from 'core/models';
import classNames from 'classnames';
import ProductGroupingTreeNode from './ProductGroupingTreeNode/ProductGroupingTreeNode';

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

  onEdit?(node: T): () => void;

  onPreview?(node: T): () => void;

  onActive?(node: T): void;
  currentItem?: any;
}

function ProductGroupingTree<T extends Model>(props: TreeProps<T>) {
  const {
    tree,
    className,
    onAdd,
    onEdit,
    onPreview,
    onDelete,
    onActive,
    nodeLevel,
    nodePadding,
    children,
    currentItem,
  } = props;

  return (
    <ul className={classNames('tree', className)} >
      {typeof children === 'object' ? (
        children
      ) : (
          <>
            {tree?.map((node: T) => {
              return (
                <ProductGroupingTreeNode
                  key={node.id + nodeLevel}
                  node={node}
                  onAdd={onAdd}
                  onPreview={onPreview}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onActive={onActive}
                  nodeLevel={nodeLevel}
                  nodePadding={nodePadding}
                  currentItem={currentItem}
                  className={classNames({ 'tree-active': node === currentItem })}
                ></ProductGroupingTreeNode>
              );
            })}
          </>
        )}
    </ul>
  );
}

ProductGroupingTree.defaultProps = {
  nodePadding: 12,
  nodeLevel: 0,
};

export default ProductGroupingTree;
