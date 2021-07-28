import React, { Dispatch, SetStateAction } from 'react';
import { PriceList } from 'models/priceList/PriceList';
import PriceListItemMappingTable from './PriceListItemMappingTable';

export interface PriceListItemMappingTabProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  isDetail?: boolean;
}

export default function PriceListItemMappingTab(
  props: PriceListItemMappingTabProps,
) {
  const { model, setModel, isDetail } = props;
  return (
    <>
      <PriceListItemMappingTable model={model} setModel={setModel} isDetail={isDetail} />
    </>
  );
}
