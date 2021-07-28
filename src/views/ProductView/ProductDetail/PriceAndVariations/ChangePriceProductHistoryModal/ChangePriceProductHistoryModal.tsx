import React from 'react';
import { ChangePriceHistory } from 'models/ChangePriceHistory';
import { ChangePriceHistoryFilter } from 'models/ChangePriceHistoryFilter';

import ContentModal, { ContentModalProps } from './ContentModal';
import { Product } from 'models/Product';

export interface ChangePriceHistoryModalProps
  extends ContentModalProps<ChangePriceHistory> {
  title: string;

  list?: ChangePriceHistory[];

  loading?: boolean;

  handleClose?: () => void;

  isSave?: boolean;

  currentItem: Product;

  getList?: (
    ChangePriceHistoryFilter?: ChangePriceHistoryFilter,
  ) => Promise<ChangePriceHistory[]>;

  count?: (ChangePriceHistoryFilter?: ChangePriceHistoryFilter) => Promise<number>;
}

function ChangePriceProductHistoryModal(props: ChangePriceHistoryModalProps) {
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

export default ChangePriceProductHistoryModal;
