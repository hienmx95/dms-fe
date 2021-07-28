import React from 'react';
import { ContentTableProps } from 'react3l';
import { crudService, formService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { tableService } from 'services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import Form from 'antd/lib/form';
import { formItemLayout } from 'config/ant-design/form';
import { Col, Row } from 'antd/lib/grid';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
// import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
// import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';

import './VariationGroupingTable.scss';
import { Product } from 'models/Product';
import { VariationGroupingFilter } from 'models/VariationGroupingFilter';
import { VariationGrouping } from 'models/VariationGrouping';
import { Input } from 'antd';

const { Item: FormItem } = Form;

function VariationGroupingTable(
  props: ContentTableProps<Product, VariationGrouping>,
) {
  const [translate] = useTranslation();

  const { model, setModel } = props;

  const [
    variationGroupings,
    ,
    handleAdd,
    handleDelete,
  ] = crudService.useContentTable<Product, VariationGrouping>(
    model,
    setModel,
    nameof(model.variationGroupings),
  );

  const [variationGroupingFilter, setVariationGroupingFilter] = React.useState<
    VariationGroupingFilter
  >(new VariationGroupingFilter());

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(
    variationGroupings,
    variationGroupingFilter,
    setVariationGroupingFilter,
  );

  const columns: ColumnProps<VariationGrouping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<VariationGrouping>(pagination),
      },
      {
        title: translate('variationGroupings.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<VariationGrouping>(pagination),
      },

      {
        title: translate('variationGroupings.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].name),
          sorter,
        ),
        render(name: any, variationGrouping: VariationGrouping) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                VariationGrouping
              >(variationGrouping.errors, nameof(variationGrouping.name))}
              help={variationGrouping.errors?.name}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(name)}
                value={name}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [VariationGrouping, VariationGrouping, number]) {
          return (
            <>
              <button
                className="btn btn-link mr-2"
                onClick={handleDelete(params[2])}
              >
                <i className="fa fa-trash" />
              </button>
            </>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, sorter, translate],
  );

  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAdd}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAdd, translate],
  );

  return (
    <>
      <CollapsibleCard
        title={translate(generalLanguageKeys.actions.search)}
        className="mb-4"
      >
        <Form {...formItemLayout}>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('variationGroupings.name')}
              >
                <AdvancedStringFilter
                  filterType={nameof(variationGroupingFilter.name.startWith)}
                  filter={variationGroupingFilter.name}
                  onChange={handleFilter(nameof(variationGroupingFilter.name))}
                  className="w-100"
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={handleSearch}
          >
            <i className="fa fa-search mr-2" />
            {translate(generalLanguageKeys.actions.filter)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary text-dark"
            onClick={handleReset}
          >
            <i className="fa mr-2 fa-times" />
            {translate(generalLanguageKeys.actions.reset)}
          </button>
        </div>
      </CollapsibleCard>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        bordered={true}
        size="small"
        footer={tableFooter}
      />
    </>
  );
}
export default VariationGroupingTable;
