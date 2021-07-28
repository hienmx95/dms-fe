import {
  PriceList,
  PriceListStoreTypeMappings,
} from 'models/priceList/PriceList';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import nameof from 'ts-nameof.macro';
import { priceListRepository } from 'views/PriceList/PriceListRepository';
import { priceListService } from 'views/PriceList/PriceListService';
import Table, { ColumnProps } from 'antd/lib/table';
import { Row, Col } from 'antd';

export interface PriceListStoreTypeMappingProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  isPreview?: boolean;
}

export default function PriceListStoreTypeMapping(
  props: PriceListStoreTypeMappingProps,
) {
  const { model, setModel, isPreview } = props;
  const {
    translate,
    list,
    loading,
    rowSelection,
  } = priceListService.useSimpleMappingTable<
    PriceListStoreTypeMappings,
    StoreType,
    StoreTypeFilter
  >(
    PriceListStoreTypeMappings,
    StoreTypeFilter,
    model,
    setModel,
    nameof(model.priceListStoreTypeMappings),
    nameof(model.priceListStoreTypeMappings[0].storeType),
    priceListRepository.filterListStoreType,
    isPreview,
  );

  const columns: ColumnProps<StoreType>[] = useMemo(
    () => [
      {
        title: translate('priceLists.storeType.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        width: 200,
        render(name: string) {
          return name;
        },
        ellipsis: true,
      },
    ],
    [list, translate],
  );
  return (
    <Row>
      <Col span={6}>
        <Table
          bordered={false}
          loading={loading}
          pagination={false}
          dataSource={list}
          rowKey={nameof(list[0].id)}
          rowSelection={rowSelection}
          columns={columns}
          tableLayout="fixed"
          size="small"
          className="table-content-item priceList-simple-mapping-table mt-3"
        />
      </Col>
    </Row>
  );
}
