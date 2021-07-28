import { Col, Row, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter, {
  AdvancedIdFilterType,
} from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_KPI_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { limitWord } from 'core/helpers/string';
import { crudService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
// import { SupplierFilter } from 'models/SupplierFilter';
import { CategoryFilter } from 'models/Category';
import { BrandFilter } from 'models/BrandFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiItemRepository } from 'views/KpiProductGroupingView/KpiProductGroupingRepository';
export interface ItemModalIProps extends ModalProps {
  selectedList: Item[];
  setSelectedList: Dispatch<SetStateAction<Item[]>>;
  modelFilterClass: new () => ItemFilter;
  filter: ItemFilter;
  setFilter: Dispatch<SetStateAction<ItemFilter>>;
  loadList: boolean;
  setLoadList: Dispatch<SetStateAction<boolean>>;
  onSave?: (selectedList: Item[]) => void;
  getList?: (itemFilter?: ItemFilter) => Promise<Item[]>;
  count?: (itemFilter?: ItemFilter) => Promise<number>;
  onClose?: () => void;
  kpiProductGroupingTypeId?: number;
  isNew?: boolean;
  setIsNew?: Dispatch<SetStateAction<boolean>>;
}

export default function ItemModal(props: ItemModalIProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-product-grouping',
    API_KPI_PRODUCT_GROUPING_ROUTE,
  );
  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    modelFilterClass,
    loadList,
    setLoadList,
    onSave,
    getList,
    count,
    onClose,
    filter,
    setFilter,
    kpiProductGroupingTypeId,
    isNew,
    setIsNew,
  } = props;

  const {
    total,
    handleSearch,
    list,
    handleFilter,
    handleResetFilter,
    handleDefaultSearch,
    isReset,
    setIsReset,
    loading,
    handleClose,
    handleSave,
  } = modalService.useMasterModal<Item, ItemFilter>(
    modelFilterClass,
    filter,
    setFilter,
    getList,
    count,
    loadList,
    setLoadList,
    onSave,
    onClose,
  );

  React.useEffect(() => {
    if (isNew && isOpen) {
      if (kpiProductGroupingTypeId === 1) {
        filter.isNew = true;
      } else {
        filter.isNew = null;
      }
      setFilter({ ...filter });
      setIsNew(false);
    }
  }, [setFilter, filter, kpiProductGroupingTypeId, isNew, isOpen, setIsNew]);
  // bug here
  const rowSelection: TableRowSelection<Item> = crudService.useContentModalList<
    Item
  >(selectedList, setSelectedList);

  // const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
  //   new SupplierFilter(),
  // );

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const idFilterEnum = React.useMemo(
    () => [
      { id: 1, name: translate('general.placeholder.title') },
      { id: 2, name: translate('general.actions.filterSelected') },
      { id: 3, name: translate('general.actions.filterUnSelected') },
    ],
    [translate],
  ); // enum List

  const selectedIds = React.useMemo(
    () => (selectedList.length > 0 ? selectedList.map(item => item.id) : []),
    [selectedList],
  );
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
      // cột này sẽ được thay thành danh mục sản phẩm nếu có api
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
      // cột này sẽ được sửa thành nhãn hiệu, khi có api
      {
        title: translate('items.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].product),
        render(product: Product) {
          return product?.brand?.name;
        },
        ellipsis: true,
      },
    ];
  }, [list, pagination, translate]);

  const handleEnterName = React.useCallback(
    (event: any, filterField) => {
      setFilter({ ...filter, search: event[filterField], skip: 0 });
      setLoadList(true);
    },
    [setFilter, filter, setLoadList],
  );

  return (
    <Modal
      size="xl"
      unmountOnClose={true}
      backdrop="static"
      toggle={toggle}
      isOpen={isOpen}
    >
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row className="ml-2 mr-3">
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('items.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter('code')}
                    placeholder={translate('items.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
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
              {/** ở đây sẽ là chỗ của danh mục sản phẩm nhưng api chưa có, nên sẽ đợi mai có api r test */}

              {validAction('filterListCategory') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('items.category')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.categoryId}
                      filterType={nameof(filter.categoryId.equal)}
                      value={filter.categoryId.equal}
                      onChange={handleFilter('categoryId')}
                      getList={kpiItemRepository.filterListCategory}
                      modelFilter={categoryFilter}
                      setModelFilter={setCategoryFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}

              {validAction('filterListProductGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0 product-grouping"
                    label={translate('items.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleFilter('productGroupingId')}
                      getList={kpiItemRepository.filterListProductGrouping}
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row className="ml-2">
              {validAction('filterListProductType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('items.productType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productTypeId}
                      filterType={nameof(filter.productTypeId.equal)}
                      value={filter.productTypeId.equal}
                      onChange={handleFilter('productTypeId')}
                      getList={kpiItemRepository.filterListProductType}
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
              )}
              {/** ở đây sẽ là nhãn hiệu, nhưng chưa có api nên sẽ để tạm là nhà cung cấp */}
              {validAction('filterListBrand') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('items.brand')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.brandId}
                      filterType={nameof(filter.brandId.equal)}
                      value={filter.brandId.equal}
                      onChange={handleFilter('brandId')}
                      getList={kpiItemRepository.filterListBrand}
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
              )}
              {/** TODO: fix bug chỗ này: đang ko filter được */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('general.selection')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={(filter as any).id}
                    onChange={handleFilter('id')}
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
          {/* button area */}
          <div className="d-flex justify-content-start mt-3 mb-3 ml-2">
            {validAction('listItem') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleResetFilter}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
          className="ml-3"
        />
        <div className=" d-flex justify-content-end mt-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleSave(selectedList)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => handleClose()}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
