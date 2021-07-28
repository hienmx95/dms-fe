import { Col, Form, Row, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter, {
  AdvancedIdFilterType,
} from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
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
import { useCallback } from 'reactn';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { directSalesOrderOwnerRepository } from 'views/DirectSalesOrderOwnerView/DirectSalesOrderOwnerRepository';
import { directSalesOrderOwnerService } from 'views/DirectSalesOrderOwnerView/DirectSalesOrderOwnerService';
import { CategoryFilter } from 'models/Category';
import './ItemModal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {
  filter?: ItemFilter;
  setFilter?: Dispatch<SetStateAction<ItemFilter>>;
  handleFilter?: (field: string) => (f: any) => void;
  loadList?: boolean;
  setloadList?: Dispatch<SetStateAction<boolean>>;
  selectedList?: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  isSave?: boolean;
  onSave?: (selectedList: Item[]) => void;
  onClose?: () => void;
  firstTime?: boolean;
  setFirstTime?: Dispatch<SetStateAction<boolean>>;
}

function ItemModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    onSave,
    onClose,
    filter,
    setFilter,
    loadList,
    setloadList,
    firstTime,
    setFirstTime,
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

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );
  const [selectedList, setSelectedList] = React.useState<Item[]>([]);

  const {
    list,
    loading,
    total,
    handleChangeFilter,
    handleSearch,
    handleDefaultSearch,
    handleReset,
    isReset,
    setIsReset,
  } = directSalesOrderOwnerService.useModalMaster(
    filter,
    setFilter,
    loadList,
    setloadList,
    directSalesOrderOwnerRepository.listItem,
    directSalesOrderOwnerRepository.countItem,
    onSave,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  React.useEffect(() => {
    if (firstTime) {
      setSelectedList([]);
      setFirstTime(false);
    }
  }, [firstTime, setSelectedList, setFirstTime]);

  const rowSelection: TableRowSelection<Item> = crudService.useContentModalList<
    Item
  >(selectedList, setSelectedList);

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

  const idFilterEnum = React.useMemo(
    () => [
      { id: 1, name: translate('general.placeholder.title') },
      { id: 2, name: translate('general.actions.filterSelected') },
      { id: 3, name: translate('general.actions.filterUnSelected') },
    ],
    [translate],
  );

  const selectedIds = React.useMemo(
    () => (selectedList.length > 0 ? selectedList.map(item => item.id) : []),
    [selectedList],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedList([]);
    if (typeof onClose === 'function') onClose();
  }, [onClose]); // reset selected list and close

  const handleEnterName = React.useCallback(
    (event: any, filterField) => {
      setFilter({ ...filter, search: event[filterField], skip: 0 });
      setloadList(true);
    },
    [setFilter, filter, setloadList],
  );

  return (
    <ModalContent
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleChangeFilter(nameof(filter.code))}
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
                  <AdvancedStringNoTypeFilter
                    filter={filter}
                    filterField={nameof(filter.search)}
                    onChange={handleEnterName}
                    placeholder={translate('items.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
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
                    onChange={handleChangeFilter(nameof(filter.supplierId))}
                    getList={directSalesOrderOwnerRepository.singleListSupplier}
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
                    onChange={handleChangeFilter(nameof(filter.brandId))}
                    getList={directSalesOrderOwnerRepository.filterListBrand}
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
            </Row>
            <Row>
              {
                <Col className="pl-1" span={8}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('products.category')}
                  >
                    <AdvancedTreeFilter
                      filter={filter.categoryId}
                      filterType={nameof(filter.categoryId.equal)}
                      value={filter.categoryId.equal}
                      onChange={handleChangeFilter(nameof(filter.categoryId))}
                      getList={
                        directSalesOrderOwnerRepository.filterListCategory
                      }
                      modelFilter={categoryFilter}
                      setModelFilter={setCategoryFilter}
                      allowClear={true}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              }
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
                    onChange={handleChangeFilter(nameof(filter.productTypeId))}
                    getList={
                      directSalesOrderOwnerRepository.singleListProductType
                    }
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
                    onChange={handleChangeFilter(
                      nameof(filter.productGroupingId),
                    )}
                    getList={
                      directSalesOrderOwnerRepository.singleListProductGrouping
                    }
                    modelFilter={productTypeFilter}
                    setModelFilter={setProductTypeFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.otherName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.otherName.contain)}
                    filter={filter.otherName}
                    onChange={handleChangeFilter(nameof(filter.otherName))}
                    placeholder={translate('items.placeholder.otherName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('items.selection')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.id}
                    onChange={handleChangeFilter(nameof(filter.id))}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    type={AdvancedIdFilterType.SELECTION}
                    selectedIds={selectedIds}
                    list={idFilterEnum}
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
          key={list[0]?.id}
          tableLayout="fixed"
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
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
            onClick={handleCloseModal}
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
