import React, { ReactElement } from 'react';
import { TreeProps as AntTreeProps } from 'antd/lib/tree';
import { Tooltip } from 'antd';
import { Id } from 'react3l';
import { Model } from 'core/models';
import classNames from 'classnames';
// import styled from 'styled-components';

import './TreeMaster.scss';
import { crudService } from 'core/services';
import { API_CATEGORY_ROUTE } from 'config/api-consts';

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
  checkDeleteCondition?: (node: T) => boolean;
  onEdit?(id: Id): () => void;
  onPreview?(node: T | number): () => void;
  onActive?(node: T): void;
  currentItem?: any;
  maxWord?: number;
}

function TreeMaster<T extends Model>(props: TreeProps<T>) {
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
    checkDeleteCondition,
  } = props;

  return (
    <ul className={classNames('tree', className)}>
      {typeof children === 'object' ? (
        children
      ) : (
          <>
            {tree?.map((node: T) => {
              return (
                <TreeNode
                  className={classNames({ 'tree-active': node === currentItem })}
                  key={node.id}
                  node={node}
                  onAdd={onAdd}
                  onPreview={onPreview}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onActive={onActive}
                  nodeLevel={nodeLevel}
                  nodePadding={nodePadding}
                  currentItem={currentItem}
                  checkDeleteCondition={checkDeleteCondition}
                ></TreeNode>
              );
            })}
          </>
        )}
    </ul>
  );
}

TreeMaster.defaultProps = {
  nodePadding: 12,
  nodeLevel: 0,
};

export interface TreeNodeProps<T extends Model> {
  className?: string;
  node?: T;
  nodeLevel?: number;
  nodePadding?: number;
  children?: ReactElement<any> | ReactElement<any>[];
  onPreview?(node: T | number): () => void;
  onAdd?(node: T): () => void;
  onEdit?(id: Id): () => void;
  onDelete?(node: T): () => void;
  checkDeleteCondition?: (node: T) => boolean;
  onActive?(node: T): void;
  onChange?(value: T[]): void;
  currentItem?: any;
  maxWord?: number;
}

function TreeNode<T extends Model>(props: TreeNodeProps<T>) {
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
    maxWord,
    checkDeleteCondition,
  } = props;

  const { validAction } = crudService.useAction('category', API_CATEGORY_ROUTE, 'mdm');
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const hasChildren = React.useMemo(() => node?.children.length > 0, [node]);
  const handleToggle = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleClick = React.useCallback(
    nodeItem => {
      return () => {
        if (onActive) onActive(nodeItem);
      };
    },
    [onActive],
  );

  const canDelete = React.useMemo(() => {
    if (typeof checkDeleteCondition === 'function')
      return checkDeleteCondition(node);
    return true;
  }, [node, checkDeleteCondition]);

  return (
    <>
      <li
        className={classNames('tree-item', `tree-item-level-${nodeLevel}`, {
          'tree-active': node === currentItem,
        })}
        style={{
          paddingLeft: `${nodePadding}px`,
          width: `${102.7 + nodeLevel * 0.11}%`,
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

        <div className="tree-content-wrapper" onClick={handleClick(node)}>
          <Tooltip title={node?.name}>
            <span className="display">{limitWord(node?.name, maxWord)}</span>
          </Tooltip>
          <div
            className="actions"
            style={{
              right: 25,
              position: 'absolute',
            }}
          >
            {typeof onPreview === 'function' && (
              <i
                role="button"
                className="tio-visible_outlined color-primary "
                onClick={onPreview(
                  typeof node.id !== 'undefined' ? node.id : node,
                )}
              />
            )}
            {/* if user does not allowed to add node, onAdd should be undefined */}
            {typeof onAdd === 'function' && validAction('create') && (
              <i
                role="button"
                className="tio-add color-primary"
                onClick={onAdd(node)}
              />
            )}
            {/* if user does not allowed to edit node, onEdit should be undefined */}
            {typeof onEdit === 'function' && validAction('update') && (
              <i
                role="button"
                className="tio-edit color-primary "
                onClick={onEdit(node.id)}
              />
            )}
            {/* if user does not allowed to delete node, onDelete should be undefined */}
            {typeof onDelete === 'function' && canDelete && !hasChildren && validAction('delete') && (
              <i
                role="button"
                className="tio-delete_outlined color-primary"
                onClick={onDelete(node)}
              />
            )}

            {children}
          </div>
        </div>
      </li>
      {hasChildren && (
        <li
          className="tree-item"
          style={{
            marginLeft: `${nodePadding + 5}px`,
            width: `unset`,
          }}
        >
          <TreeMaster
            tree={node.children}
            className={classNames(
              'sub-tree',
              {
                expanded: isExpanded,
              },
              'parent-border',
            )}
            parent={node}
            onAdd={onAdd}
            checkDeleteCondition={checkDeleteCondition}
            onPreview={onPreview}
            onEdit={onEdit}
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

TreeNode.defaultProps = {
  nodeLevel: 0,
  nodePadding: 12,
  maxWord: 70,
};

export function limitWord(input: string, max: number) {
  if (input?.length > max) {
    input = input.slice(0, max);
    const output: string = input + '...';
    return output;
  }
  return input;
}

export default TreeMaster;
