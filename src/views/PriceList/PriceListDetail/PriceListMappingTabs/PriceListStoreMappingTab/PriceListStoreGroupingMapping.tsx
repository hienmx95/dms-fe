import React, { Dispatch, SetStateAction, useMemo } from 'react';
import {
  PriceList,
  PriceListStoreGroupingMappings,
} from 'models/priceList/PriceList';
import { priceListService } from 'views/PriceList/PriceListService';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { priceListRepository } from 'views/PriceList/PriceListRepository';
import Table, { ColumnProps } from 'antd/lib/table';
import nameof from 'ts-nameof.macro';
import { Row, Col } from 'antd';

export interface PriceListStoreGroupingMappingProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  isPreview?: boolean;
}

export default function PriceListStoreGroupingMapping(
  props: PriceListStoreGroupingMappingProps,
) {
  const { model, setModel, isPreview } = props;
  const {
    translate,
    list,
    loading,
    rowSelection,
  } = priceListService.useSimpleMappingTable<
    PriceListStoreGroupingMappings,
    StoreGrouping,
    StoreGroupingFilter
  >(
    PriceListStoreGroupingMappings,
    StoreGroupingFilter,
    model,
    setModel,
    nameof(model.priceListStoreGroupingMappings),
    nameof(model.priceListStoreGroupingMappings[0].storeGrouping),
    priceListRepository.filterListStoreGrouping,
    isPreview,
  );

  const columns: ColumnProps<StoreGrouping>[] = useMemo(
    () => [
      {
        title: translate('priceLists.storeGrouping.name'),
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
