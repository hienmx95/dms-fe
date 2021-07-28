import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductImageMapping } from 'models/ProductImageMapping';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { StatusFilter } from 'models/StatusFilter';
import { Supplier } from 'models/Supplier';
// import { SupplierFilter } from 'models/SupplierFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { newProductRepository } from '../NewProductRepository';
import ProductModal from './ProductModal';
import { notification } from 'helpers/notification';
import { Status } from 'models/Status';
import { Tooltip } from 'antd';
import { API_NEW_PRODUCT_ROUTE } from 'config/api-consts';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import { newProductService } from '../NewProductService';
import { Category, CategoryFilter } from 'models/Category';
// import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';

const { Item: FormItem } = Form;

function NewProductMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'new-product',
    API_NEW_PRODUCT_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    ,
    ,
    previewModel,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    ,
    resetSelect,
    setResetSelect,
  ] = newProductService.useNewProductMaster(
    newProductRepository.count,
    newProductRepository.list,
    newProductRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  const [rowSelection, hasSelected] = tableService.useRowSelection<Product>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );

  const [
    loadingModal,
    visibleModal,
    setVisibleModal,
    listProductModal,
    totalModal,
  ] = crudService.useContentModal(
    newProductRepository.listProduct,
    newProductRepository.countProduct,
    ProductFilter,
  );

  const [productList, setProductList] = React.useState<Product[]>([]);
  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());
  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  // const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
  //   new SupplierFilter(),
  // );
  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );
  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [updateFilter, setUpdateFilter] = React.useState<boolean>(true);

  React.useEffect(() => {
    setProductList(list);
    if (updateFilter) {
      filter.orderType = 'DESC';
      filter.orderBy = 'updatedAt';
      setFilter(filter);
      setUpdateFilter(false);
    }
  }, [filter, list, setFilter, updateFilter]);
  const [handleDelete] = tableService.useDeleteHandler<Product>(
    newProductRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    newProductRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const handleGoCreate = React.useCallback(() => {
    setVisibleModal(true);
    setIsVisible(true);
  }, [setVisibleModal]);

  const handleClose = React.useCallback(() => {
    setVisibleModal(false);
  }, [setVisibleModal]);

  const handleSaveModal = React.useCallback(
    (listProducts: Product[]) => {
      return () => {
        const ids: number[] = listProducts.map((item: Product) => item.id);
        newProductRepository
          .create(ids)
          .then(res => {
            if (res) {
              setVisibleModal(false);
              setList(productList);
              handleSearch();
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
            }
          })
          .finally(() => {
            setLoading(false);
          })
          .catch((error: Error) => {
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      };
    },
    [
      handleSearch,
      productList,
      setList,
      setLoading,
      setVisibleModal,
      translate,
    ],
  );
  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Product>(pagination),
      },

      {
        title: translate('products.image'),
        key: nameof(list[0].productImageMappings),
        dataIndex: nameof(list[0].productImageMappings),
        render(productImageMappings: ProductImageMapping) {
          return (
            <img
              src={productImageMappings[0]?.image?.url}
              width="40"
              height="40"
              alt=""
            />
          );
        },
      },
      {
        title: translate('products.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Product>(nameof(list[0].code), sorter),
      },
      {
        title: translate('products.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Product>(nameof(list[0].name), sorter),
      },
      {
        title: translate('products.category'),
        key: nameof(list[0].category),
        dataIndex: nameof(list[0].category),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(list[0].category),
          sorter,
        ),
        render(category: Category) {
          return category?.name;
        },
      },
      {
        title: translate('products.productGrouping'),
        key: nameof(list[0].productProductGroupingMappings),
        dataIndex: nameof(list[0].productProductGroupingMappings),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(nameof(list[0].name), sorter),
        ellipsis: true,
        render(productProductGroupingMappings: ProductProductGroupingMapping) {
          return (
            <>
              {productProductGroupingMappings &&
                productProductGroupingMappings?.length > 0 &&
                productProductGroupingMappings.map((productGrouping, index) => {
                  return (
                    <span key={index}>
                      {productGrouping?.productGrouping &&
                        productGrouping?.productGrouping?.name}
                      {index < productProductGroupingMappings.length - 1 && (
                        <span>, </span>
                      )}
                    </span>
                  );
                })}
            </>
          );
        },
      },

      {
        title: translate('products.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].productType),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(list[0].productType),
          sorter,
        ),
        render(productType: ProductType) {
          return productType?.name;
        },
      },

      {
        title: translate('products.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(nameof(list[0].brand), sorter),
        render: (supplier: Supplier) => supplier && supplier.name,
      },
      {
        title: translate('products.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        width: generalColumnWidths.actions,
        align: 'center',
        sorter: true,
        sortOrder: getOrderTypeForTable<Status>(nameof(list[0].status), sorter),
        render(status: Status) {
          return (
            <div className={status.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, product]) {
          return (
            <div className="button-action-table">
              {validAction('delete') && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(product)}
                  >
                    <i className="tio-delete_outlined" />
                  </button>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ];
  }, [handleDelete, list, pagination, sorter, translate, validAction]);
  return (
    <div className="page master-page">
      <Card title={translate('products.master.title')} className="header-title">
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('products.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    className="w-100"
                    placeholder={translate('products.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('products.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(previewModel.name))}
                    className="w-100"
                    placeholder={translate('products.placeholder.name')}
                  />
                </FormItem>
              </Col>
              {validAction('filterListProductGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleFilter(nameof(filter.productGroupingId))}
                      getList={newProductRepository.filterListProductGrouping}
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListProductType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.productType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productTypeId}
                      filterType={nameof(filter.productTypeId.equal)}
                      value={filter.productTypeId.equal}
                      onChange={handleFilter(nameof(filter.productTypeId))}
                      getList={newProductRepository.filterListProductType}
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
            </Row>
            <Row>
              {/* {validAction('filterListSupplier') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.supplier')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.supplierId}
                      filterType={nameof(filter.supplierId.equal)}
                      value={filter.supplierId.equal}
                      onChange={handleFilter(nameof(filter.supplierId))}
                      getList={newProductRepository.filterListSupplier}
                      modelFilter={supplierFilter}
                      setModelFilter={setSupplierFilter}
                      searchField={nameof(supplierFilter.name)}
                      searchType={nameof(supplierFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )} */}
              {validAction('filterListCategory') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('products.category')}
                  >
                    <AdvancedTreeFilter
                      filter={filter.categoryId}
                      filterType={nameof(filter.categoryId.equal)}
                      value={filter.categoryId.equal}
                      onChange={handleFilter(nameof(filter.categoryId))}
                      getList={newProductRepository.filterListCategory}
                      modelFilter={categoryFilter}
                      setModelFilter={setCategoryFilter}
                      allowClear={true}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListBrand') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.brand')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.brandId}
                      filterType={nameof(filter.brandId.equal)}
                      value={filter.brandId.equal}
                      onChange={handleFilter(nameof(filter.brandId))}
                      getList={newProductRepository.filterListBrand}
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
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={newProductRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      searchType={nameof(statusFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
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
                  onClick={handleReset}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.add)}
                    </button>
                  )}
                  {validAction('bulkDelete') && (
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  )}
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
      </Card>
      <ProductModal
        selectedList={list}
        setSelectedList={setList}
        list={listProductModal}
        total={totalModal}
        isOpen={visibleModal}
        loading={loadingModal}
        toggle={handleClose}
        onClose={handleClose}
        onSave={handleSaveModal}
        isSave={true}
        pagination={pagination}
        getList={newProductRepository.listProduct}
        count={newProductRepository.countProduct}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  );
}

export default NewProductMaster;
