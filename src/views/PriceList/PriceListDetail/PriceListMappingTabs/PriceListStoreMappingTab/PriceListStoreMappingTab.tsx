import { Col, Form, Row } from 'antd';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { formService } from 'core/services';
import { PriceList } from 'models/priceList/PriceList';
import { PriceListFilter } from 'models/priceList/PriceListFilter';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'reactn';
import nameof from 'ts-nameof.macro';
import { priceListRepository } from 'views/PriceList/PriceListRepository';
import PriceListStoreGroupingMapping from './PriceListStoreGroupingMapping';
import PriceListStoreMappingTable from './PriceListStoreMappingTable';
import PriceListStoreTypeMapping from './PriceListStoreTypeMapping';

const { Item: FormItem } = Form;

export interface PriceListStoreMappingTabProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
}

export default function PriceListStoreMappingTab(
  props: PriceListStoreMappingTabProps,
) {
  const [translate] = useTranslation();
  const { model, setModel } = props;

  const handleChangePriceListType = useCallback(
    (value: number | string) => {
      if (model.errors) {
        model.errors.priceListType = null;
      }
      setModel({
        ...model,
        priceListTypeId: typeof value !== 'undefined' ? +value : undefined,
        priceListStoreMappings: [],
        priceListStoreTypeMappings: [],
        priceListStoreGroupingMappings: [],
      });
    },
    [model, setModel],
  );

  const [priceListFilter, setPriceListFilter] = useState<PriceListFilter>(
    new PriceListFilter(),
  );

  return (
    <>
      <Row>
        <Col span={6}>
          <FormItem
            className="priceListType-formItem"
            validateStatus={formService.getValidationStatus<PriceList>(
              model.errors,
              nameof(model.priceListType),
            )}
            help={model.errors?.priceListType}
          >
            <SelectAutoComplete
              value={model.priceListType?.id}
              onChange={handleChangePriceListType}
              placeholder={translate('priceLists.placeholder.priceListType')}
              getList={priceListRepository.singleListPriceListType}
              modelFilter={priceListFilter}
              setModelFilter={setPriceListFilter}
              searchField={nameof(priceListFilter.name)}
              searchType={nameof(priceListFilter.name.contain)}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        {typeof model.priceListTypeId === 'number' &&
          model.priceListTypeId.toString() === '1' && (
            <Row>
              <Col span={12}>
                <div className="mt-3" style={{ marginLeft: '1rem' }}>
                  Tất cả đại lý thuộc đơn vị
                </div>
              </Col>
            </Row>
          )}
        {/* storeType Mapping */}
        {typeof model.priceListTypeId === 'number' &&
          model.priceListTypeId.toString() === '2' && (
            <PriceListStoreTypeMapping model={model} setModel={setModel} />
          )}
        {/* storeGrouping Mapping */}
        {typeof model.priceListTypeId === 'number' &&
          model.priceListTypeId.toString() === '3' && (
            <PriceListStoreGroupingMapping model={model} setModel={setModel} />
          )}
        {/* store Mapping */}
        {typeof model.priceListTypeId === 'number' &&
          model.priceListTypeId.toString() === '4' && (
            <PriceListStoreMappingTable model={model} setModel={setModel} />
          )}
      </Row>
    </>
  );
}
