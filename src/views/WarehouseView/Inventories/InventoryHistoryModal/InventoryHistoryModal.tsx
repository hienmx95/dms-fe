import React from 'react';
import { InventoryHistory } from 'models/InventoryHistory';
import { InventoryHistoryFilter } from 'models/InventoryHistoryFilter';

import ContentModal, { ContentModalProps } from './ContentModal';
import { Inventory } from 'models/Inventory';

export interface InventoryHistoryModalProps
  extends ContentModalProps<InventoryHistory> {
  title: string;

  list?: InventoryHistory[];

  loading?: boolean;

  handleClose?: () => void;

  isSave?: boolean;

  currentItem: Inventory;

  getList?: (
    InventoryHistoryFilter?: InventoryHistoryFilter,
  ) => Promise<InventoryHistory[]>;

  count?: (InventoryHistoryFilter?: InventoryHistoryFilter) => Promise<number>;
}

function InventoryHistoryModal(props: InventoryHistoryModalProps) {
  const { list, handleClose, getList, ...restProps } = props;

  return (
    <ContentModal
      {...restProps}
      list={list}
      handleClose={handleClose}
      isSave={props.isSave}
      getList={getList}
    ></ContentModal>
  );
}

export default InventoryHistoryModal;
