import { Model } from 'core/models';
import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import './ProductGroupingTreeNode.scss';
import ProductGroupingTree from 'components/ProductGroupingTree/ProductGroupingTree';
import { Tooltip } from 'antd';
import { crudService } from 'core/services';
import { API_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';

export interface TreeNodeProps<T extends Model> {
  className?: string;

  node?: T;

  nodeLevel?: number;

  nodePadding?: number;

  children?: ReactElement<any> | ReactElement<any>[];

  onPreview?(node: T): () => void;

  onAdd?(node: T): () => void;

  onEdit?(node: T): () => void;

  onDelete?(node: T): () => void;

  onActive?(node: T): void;

  onChange?(value: T[]): void;

  render?(node: T): ReactNode;

  currentItem?: any;
}

function ProductGroupingTreeNode<T extends Model>(props: TreeNodeProps<T>) {

  const { validAction } = crudService.useAction(
    'product-grouping',
    API_PRODUCT_GROUPING_ROUTE,
    'mdm',
  );
  const {
    node,
    onAdd,
    onPreview,
    onDelete,
    onEdit,
    onActive,
    children,
    nodeLevel,
    nodePadding,
    currentItem,
  } = props;
  const hasChildren: boolean = node?.children?.length > 0;

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleToggle = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleClick = React.useCallback(
    nodeItem => {
      if (onActive) {
        onActive(nodeItem);
      }
    },
    [onActive],
  );

  const handleSliceName = React.useCallback(
    (name: string) => {
      if (name.length > 50) {
        return name.slice(0, 50) + '...';
      }
      else {
        return name;
      }
    },
    [],
  );


  return (
    <>
      <li
        className={classNames('tree-item', `tree-item-level-${nodeLevel}`, {
          'tree-active': node === currentItem,
          'tree-has-children': hasChildren,
        })}
        style={{
          paddingLeft: `${nodePadding}px`,
          // width: `${104 - nodeLevel * 3.63}%`,
          width: `${100 + nodeLevel * 0.11}%`,
          borderRadius: `3px`,
        }}
        key={node.id}
      >
        <i
          role="button"
          onClick={handleToggle}
          className={classNames('fa mr-2 node-toggler', {
            show: hasChildren,
            'tio-chevron_right': !isExpanded,
            'tio-chevron_down': isExpanded,
          })}
        />
        <div className="tree-content-wrapper" onClick={() => handleClick(node)}>
          {
            node?.name.length > 50 && (
              <Tooltip placement="topLeft" title={node?.name}>
                <span className="display"> {handleSliceName(node?.name)} </span>
              </Tooltip>
            )
          }
          {
            node?.name.length <= 50 && (
              <span className="display"> {handleSliceName(node?.name)} </span>
            )
          }
          <div className="actions mr-3"
            style={{
              right: 25,
              position: 'absolute',
            }}
          >
            {typeof onPreview === 'function' && validAction('get') && (
              <i
                role="button"
                className="icon tio-visible_outlined"
                onClick={onPreview(node)}
              />
            )}
            {typeof onAdd === 'function' && validAction('create') && (
              <i
                role="button"
                className="icon tio-add"
                onClick={onAdd(node)}
              />
            )}
            {typeof onEdit === 'function' && validAction('update') && (
              <i
                role="button"
                className="icon tio-edit"
                onClick={onEdit(node)}
              />
            )}
            {typeof onDelete === 'function' && !hasChildren && validAction('delete') && (
              <i
                role="button"
                className="icon fa tio-delete_outlined"
                onClick={onDelete(node)}
              />
            )}

            {children}
          </div>
        </div>
      </li>
      {hasChildren && (
        <li className={classNames('tree-item')} key={node.id + 1}
          style={{
            marginLeft: `${nodePadding + 5}px`,
            // width: `${100 - (nodeLevel * 2 + 1)}%`
            // width: `${104 - nodeLevel * 3.63}%`
            width: 'unset',
          }}
        >
          <ProductGroupingTree
            tree={node.children}
            className={classNames('sub-tree', {
              expanded: isExpanded,
            },
              'parent-border',
            )}
            // style={{
            //   width: `${100 - (nodeLevel + 1)}%`
            // }}

            parent={node}
            onAdd={onAdd}
            onEdit={onEdit}
            onPreview={onPreview}
            onDelete={onDelete}
            onActive={onActive}
            nodeLevel={nodeLevel + 1}
            nodePadding={nodePadding}
            currentItem={currentItem}
          />
        </li>
      )}
    </>
  );
}

ProductGroupingTreeNode.defaultProps = {
  nodeLevel: 0,
  nodePadding: 12,
  render<T extends Model>(node: T) {
    return node.name;
  },
};

export default ProductGroupingTreeNode;
