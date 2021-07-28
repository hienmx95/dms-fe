import React, { Dispatch, SetStateAction } from 'react';
import { PriceList } from 'models/priceList/PriceList';
import PriceListItemMappingTable from './PriceListItemMappingTable';

export interface PriceListItemMappingTabProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
}

export default function PriceListItemMappingTab(
  props: PriceListItemMappingTabProps,
) {
  const { model, setModel } = props;
  return (
    <>
      <PriceListItemMappingTable model={model} setModel={setModel} />
    </>
  );
}
