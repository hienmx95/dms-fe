import { ShowingInventory } from 'models/posm/ShowingInventory';
import { ShowingInventoryHistory } from 'models/posm/ShowingInventoryHistory';
import { ShowingInventoryHistoryFilter } from 'models/posm/ShowingInventoryHistoryFilter';
import React from 'react';

import ContentModal, { ContentModalProps } from './ContentModal';

export interface ShowingInventoryHistoryModalProps
  extends ContentModalProps<ShowingInventoryHistory> {
  title: string;

  list?: ShowingInventoryHistory[];

  loading?: boolean;

  handleClose?: () => void;

  isSave?: boolean;

  currentItem: ShowingInventory;

  getList?: (
    ShowingInventoryHistoryFilter?: ShowingInventoryHistoryFilter,
  ) => Promise<ShowingInventoryHistory[]>;

  count?: (
    ShowingInventoryHistoryFilter?: ShowingInventoryHistoryFilter,
  ) => Promise<number>;
}

function ShowingInventoryHistoryModal(
  props: ShowingInventoryHistoryModalProps,
) {
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

export default ShowingInventoryHistoryModal;
