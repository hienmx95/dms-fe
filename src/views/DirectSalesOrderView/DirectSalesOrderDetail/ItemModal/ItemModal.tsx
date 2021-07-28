import { Col, Form, Popconfirm, Row, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { limitWord } from 'core/helpers/string';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
// import { SupplierFilter } from 'models/SupplierFilter';
import { BrandFilter } from 'models/BrandFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import './ItemModal.scss';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { directSalesOrderService } from 'views/DirectSalesOrderView/DirectSalesOrderService';
import { directSalesOrderRepository } from 'views/DirectSalesOrderView/DirectSalesOrderRepository';

export interface ContentModalProps<T extends Model> extends ModalProps {
  filter?: ItemFilter;

  setFilter?: Dispatch<SetStateAction<ItemFilter>>;

  handleFilter?: (field: string) => (f: any) => void;

  loadList?: boolean;
  setloadList?: Dispatch<SetStateAction<boolean>>;
  currentItem?: DirectSalesOrder;

  selectedList?: T[];

  setSelectedList?: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: Item[]) => void;

  total?: number;
  // getList?: (itemFilter?: ItemFilter) => Promise<Item[]>;

  // count?: (itemFilter?: ItemFilter) => Promise<number>;

  onClose?: () => void;

  isChangeSelectedList?: boolean;

  setIsChangeSelectedList?: Dispatch<SetStateAction<boolean>>;
}

function ItemModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    onSave,
    onClose,
    isChangeSelectedList,
    setIsChangeSelectedList,
    filter,
    setFilter,
    loadList,
    setloadList,
  } = props;
  // const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
  //   new SupplierFilter(),
  // );
  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );
  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());

  const [listItem, setListItem] = React.useState<Item[]>([]);
  const [selectedList, setSelectedList] = React.useState<Item[]>([]);

  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [totalItem, setTotal] = React.useState<number>(0);
  const {
    list,
    loading,
    total,
    handleChangeFilter,
    handleSearch,
    handleReset,
  } = directSalesOrderService.useModalMaster(
    filter,
    setFilter,
    loadList,
    setloadList,
    directSalesOrderRepository.listItem,
    directSalesOrderRepository.countItem,
    onSave,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  React.useEffect(() => {
    setListItem(list);
    setTotal(totalItem);
    setSelectedList([]);

    if (isChangeSelectedList === true) {
      setIsChangeSelectedList(false);
      setFilter(new ItemFilter());
      setloadList(true);
    }
  }, [
    setListItem,
    setTotal,
    list,
    totalItem,
    isChangeSelectedList,
    setIsChangeSelectedList,
    setFilter,
    setloadList,
  ]);

  const rowSelection: TableRowSelection<Item> = crudService.useContentModalList<
    Item
  >(selectedList, setSelectedList);

  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const columns: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 70,
        render: renderMasterIndex<Item>(pagination),
      },
      {
        title: translate('items.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),

        ellipsis: true,
      },
      {
        title: translate('items.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('items.category'),
        key: nameof(list[0].category),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.category?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.productGrouping'),
        key: nameof(list[0].productGrouping),
        dataIndex: nameof(list[0].product),
        width: 200,
        render(product: Product) {
          return (
            <>
              {product?.productProductGroupingMappings &&
                product?.productProductGroupingMappings.length > 0 &&
                product?.productProductGroupingMappings.map(
                  (
                    productMapping: ProductProductGroupingMapping,
                    index: number,
                  ) => (
                    <div key={index}>
                      {productMapping?.productGrouping?.name?.length > 20 && (
                        <Tooltip
                          placement="topLeft"
                          title={productMapping?.productGrouping?.name}
                        >
                          <span className="display">
                            {' '}
                            {limitWord(
                              productMapping?.productGrouping?.name,
                              20,
                            )}{' '}
                          </span>
                        </Tooltip>
                      )}
                      {productMapping?.productGrouping?.name?.length < 20 &&
                        productMapping?.productGrouping?.name}
                      {index <
                        product?.productProductGroupingMappings.length - 1 && (
                        <span>,</span>
                      )}
                    </div>
                  ),
                )}
            </>
          );
        },
        ellipsis: true,
      },
      {
        title: translate('items.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.productType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.brand?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.saleStock'),
        key: nameof(list[0].saleStock),
        dataIndex: nameof(list[0].saleStock),
        render(...[saleStock]) {
          return formatNumber(saleStock);
        },
      },
      {
        title: translate('items.salePrice'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
      },
    ];
  }, [list, pagination, translate]);

  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        selectedList.splice(index, 1);
      }
      setSelectedList([...selectedList]);
    },
    [selectedList],
  );

  const columnsSelected: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 80,
        render: renderMasterIndex<Item>(),
      },
      {
        title: translate('items.code'),
        key: nameof(selectedList[0].code),
        dataIndex: nameof(selectedList[0].code),
      },
      {
        title: translate('items.name'),
        key: nameof(selectedList[0].name),
        dataIndex: nameof(selectedList[0].name),
        ellipsis: true,
      },
      {
        title: translate('items.productGrouping'),
        key: nameof(selectedList[0].productGrouping),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.productGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.productType'),
        key: nameof(selectedList[0].productType),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.productType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.supplier'),
        key: nameof(selectedList[0].supplier),
        dataIndex: nameof(selectedList[0].product),
        render(product: Product) {
          return product?.supplier?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('items.saleStock'),
        key: nameof(selectedList[0].saleStock),
        dataIndex: nameof(selectedList[0].saleStock),
        render(...[saleStock]) {
          return formatNumber(saleStock);
        },
      },
      {
        title: translate('items.salePrice'),
        key: nameof(selectedList[0].salePrice),
        dataIndex: nameof(selectedList[0].salePrice),
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(selectedList[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={() => handleDeleteItem(index)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-sm btn-link">
                  <i className="tio-delete_outlined" />
                </button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [handleDeleteItem, selectedList, translate]);

  return (
    <ModalContent
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      {/* <ModalHeader>{title}</ModalHeader> */}
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row className="ml-2 mr-3">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.name')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {/* <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('items.supplier')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.supplierId}
                    filterType={nameof(filter.supplierId.equal)}
                    value={filter.buyerStoreId.equal}
                    onChange={handleChangeFilter}
                    getList={directSalesOrderRepository.singleListSupplier}
                    modelFilter={supplierFilter}
                    setModelFilter={setSupplierFilter}
                    searchField={nameof(supplierFilter.name)}
                    searchType={nameof(supplierFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col> */}
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('items.brand')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.brandId}
                    filterType={nameof(filter.brandId.equal)}
                    value={filter.brandId.equal}
                    onChange={handleChangeFilter}
                    getList={directSalesOrderRepository.filterListBrand}
                    modelFilter={brandFilter}
                    setModelFilter={setBrandFilter}
                    searchField={nameof(brandFilter.name)}
                    searchType={nameof(brandFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('items.productType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.productTypeId}
                    filterType={nameof(filter.productTypeId.equal)}
                    value={filter.productTypeId.equal}
                    onChange={handleChangeFilter}
                    getList={directSalesOrderRepository.singleListProductType}
                    modelFilter={productTypeFilter}
                    setModelFilter={setProductTypeFilter}
                    searchField={nameof(productTypeFilter.name)}
                    searchType={nameof(productTypeFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1 product-grouping"
                  label={translate('items.productGrouping')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filter.productGroupingId}
                    filterType={nameof(filter.productGroupingId.equal)}
                    value={filter.productGroupingId.equal}
                    onChange={handleChangeFilter}
                    getList={
                      directSalesOrderRepository.singleListProductGrouping
                    }
                    modelFilter={productTypeFilter}
                    setModelFilter={setProductTypeFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.otherName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.otherName.contain)}
                    filter={filter.otherName}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.otherName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 ml-2">
            <button
              className="btn btn-sm btn-primary mr-2 ml-1"
              onClick={handleDefaultSearch}
            >
              <i className="tio-filter_outlined mr-2" />
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleReset}
            >
              <i className="tio-clear_circle_outlined mr-2" />
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>

        <Table
          key={listItem[0]?.id}
          tableLayout="fixed"
          columns={columns}
          dataSource={listItem}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listItem[0].id)}
          onChange={handleTableChange}
          className="ml-4 mr-4"
        />
        <div className="title-table mb-3 mt-3">
          <span className="text-table ml-5">
            {translate('items.selectedTable')}
          </span>
        </div>
        <Table
          scroll={{ y: 240 }}
          tableLayout="fixed"
          columns={columnsSelected}
          dataSource={selectedList}
          loading={loading}
          rowKey={nameof(selectedList[0].id)}
          pagination={false}
          className="ml-4 mr-4"
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={onClose}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
}

export default ItemModal;
