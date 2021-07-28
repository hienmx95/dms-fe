import { Input } from 'antd';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { formItemLayout } from 'config/ant-design/form';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import './ItemTable.scss';

const { Item: FormItem } = Form;

function ItemTable(props: ContentTableProps<Product, Item>) {
  const [translate] = useTranslation();

  const { model, setModel } = props;

  const [items, , handleAdd, handleDelete] = crudService.useContentTable<
    Product,
    Item
  >(model, setModel, nameof(model.items));

  const [itemFilter, setItemFilter] = React.useState<ItemFilter>(
    new ItemFilter(),
  );

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(items, itemFilter, setItemFilter);

  const columns: ColumnProps<Item>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Item>(pagination),
      },
      {
        title: translate('items.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<Item>(pagination),
      },

      {
        title: translate('items.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].code),
          sorter,
        ),
        render(code: any, item: Item) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.code),
              )}
              help={item.errors?.code}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(code)}
                value={code}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('items.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].name),
          sorter,
        ),
        render(name: any, item: Item) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.name),
              )}
              help={item.errors?.name}
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
        title: translate('items.scanCode'),
        key: nameof(dataSource[0].scanCode),
        dataIndex: nameof(dataSource[0].scanCode),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].scanCode),
          sorter,
        ),
        render(scanCode: any, item: Item) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.scanCode),
              )}
              help={item.errors?.scanCode}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(scanCode)}
                value={scanCode}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('items.salePrice'),
        key: nameof(dataSource[0].salePrice),
        dataIndex: nameof(dataSource[0].salePrice),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].salePrice),
          sorter,
        ),
        render(salePrice: any, item: Item) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.salePrice),
              )}
              help={item.errors?.salePrice}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(salePrice)}
                value={salePrice}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('items.retailPrice'),
        key: nameof(dataSource[0].retailPrice),
        dataIndex: nameof(dataSource[0].retailPrice),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(dataSource[0].retailPrice),
          sorter,
        ),
        render(retailPrice: any, item: Item) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.retailPrice),
              )}
              help={item.errors?.retailPrice}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(retailPrice)}
                value={retailPrice}
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
        render(...params: [Item, Item, number]) {
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
              <FormItem className="mb-0" label={translate('items.code')}>
                <AdvancedStringFilter
                  filterType={nameof(itemFilter.code.startWith)}
                  filter={itemFilter.code}
                  onChange={handleFilter(nameof(itemFilter.code))}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('items.name')}>
                <AdvancedStringFilter
                  filterType={nameof(itemFilter.name.startWith)}
                  filter={itemFilter.name}
                  onChange={handleFilter(nameof(itemFilter.name))}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('items.scanCode')}>
                <AdvancedStringFilter
                  filterType={nameof(itemFilter.scanCode.startWith)}
                  filter={itemFilter.scanCode}
                  onChange={handleFilter(nameof(itemFilter.scanCode))}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('items.salePrice')}>
                <AdvancedNumberFilter
                  filterType={nameof(itemFilter.salePrice.equal)}
                  filter={itemFilter.salePrice}
                  onChange={handleFilter(nameof(itemFilter.salePrice))}
                  placeholder={translate('items.placeholder.salePrice')}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('items.retailPrice')}>
                <AdvancedNumberFilter
                  filterType={nameof(itemFilter.retailPrice.equal)}
                  filter={itemFilter.retailPrice}
                  onChange={handleFilter(nameof(itemFilter.retailPrice))}
                  placeholder={translate('items.placeholder.retailPrice')}
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
export default ItemTable;
