import React, { Dispatch, SetStateAction } from 'react';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';

import ContentModal, { ContentModalProps } from '../ContentModal/ContentModal';
import { ProductGrouping } from 'models/ProductGrouping';

export interface ProductModalProps extends ContentModalProps<Product> {
  title: string;

  selectedList: Product[];

  setSelectedList: Dispatch<SetStateAction<Product[]>>;

  list: Product[];

  loading: boolean;

  total: number;

  onSave?: (selectedList: Product[], currentItem: ProductGrouping) => void;

  isSave?: boolean;

  currentItem: ProductGrouping;

  getList?: (productFilter?: ProductFilter) => Promise<Product[]>;

  count?: (productFilter?: ProductFilter) => Promise<number>;

  onClose?: () => void;

}

function ProductModal(props: ProductModalProps) {

  const {
    list,
    selectedList,
    setSelectedList,
    total,
    onSave,
    getList,
    onClose,
    ...restProps
  } = props;


  return (
    <ContentModal
      {...restProps}
      key={list[0]?.id}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
      list={list}
      onSave={onSave}
      isSave={props.isSave}
      total={total}
      getList={getList}
      onClose={onClose}
    >
    </ContentModal>
  );
}

export default ProductModal;
