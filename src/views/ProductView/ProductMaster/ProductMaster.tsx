import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_PRODUCT_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { PRODUCT_DETAIL_ROUTE, PRODUCT_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Category, CategoryFilter } from 'models/Category';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductImageMapping } from 'models/ProductImageMapping';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
// import { Supplier } from 'models/Supplier';
import { BrandFilter } from 'models/BrandFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { productRepository } from 'views/ProductView/ProductRepository';
import ChangePriceProductHistoryModal from '../ProductDetail/PriceAndVariations/ChangePriceProductHistoryModal/ChangePriceProductHistoryModal';
import PreviewProduct from './PreviewProduct';
import './ProductMaster.scss';
import { Brand } from 'models/Brand';

const { Item: FormItem } = Form;

function ProductMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const { validAction } = crudService.useAction(
    'product',
    API_PRODUCT_ROUTE,
    'mdm',
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    ,
    ,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    setLoadList,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<Product, ProductFilter>(
    Product,
    ProductFilter,
    productRepository.count,
    productRepository.list,
    productRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    PRODUCT_DETAIL_ROUTE,
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

  /**
   * If import
   */
  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(productRepository.import, setLoading);

  const [visibleHistory, setVisibleHistory] = React.useState<boolean>(false);

  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<Product>(
    new Product(),
  );

  const handleOpenHistory = React.useCallback(
    (product: Product) => {
      setVisibleHistory(true);
      setCurrentItem(product);
    },
    [setCurrentItem],
  );

  const handleClose = React.useCallback(() => {
    setVisibleHistory(false);
  }, [setVisibleHistory]);
  /**
   * If export
   */

  const [handleExport] = crudService.useExport(
    productRepository.export,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    productRepository.exportTemplate,
    filter,
  );

  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [usedVariationFilter, setUsedVariationFilter] = React.useState<
    StatusFilter
  >(new StatusFilter());

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );

  const [handleDelete] = tableService.useDeleteHandler<Product>(
    productRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    productRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const handleOpenPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(PRODUCT_ROUTE + search + '#' + id));
      productRepository.get(id).then((product: Product) => {
        setPreviewModel(product);
        setPreviewVisible(true);
      });
    },
    [history, search],
  );

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(PRODUCT_ROUTE + temp[0]));
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPreview);
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
        ellipsis: true,
        render(productImageMappings: ProductImageMapping) {
          return (
            <>
              {productImageMappings &&
                productImageMappings.length > 0 &&
                productImageMappings.map((productImageMapping, index) => {
                  return (
                    <img
                      key={index}
                      src={productImageMapping?.image?.url}
                      width="40"
                      height="40"
                      alt=""
                    />
                  );
                })}
            </>
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
        render(code: string, product: Product) {
          return (
            <div
              className="display-code"
              onClick={() => handleOpenPreview(product.id)}
            >
              {code}
            </div>
          );
        },
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
          nameof(list[0].categoryId),
          sorter,
        ),
        render(category: Category) {
          return <div className="text-left">{category?.name}</div>;
        },
      },

      {
        title: translate('products.productGrouping'),
        key: nameof(list[0].productProductGroupingMappings),
        dataIndex: nameof(list[0].productProductGroupingMappings),
        width: 200,
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
        sortOrder: getOrderTypeForTable<Product>(
          nameof(list[0].productType),
          sorter,
        ),
        ellipsis: true,
        render(productType: ProductType) {
          return productType?.name;
        },
      },
      {
        title: translate('products.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(nameof(list[0].brand), sorter),
        ellipsis: true,
        render: (brand: Brand) => brand && brand.name,
      },

      {
        title: translate('products.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
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
        title: translate('products.usedVariation'),
        key: nameof(list[0].usedVariation),
        dataIndex: nameof(list[0].usedVariation),
        sorter: true,
        sortOrder: getOrderTypeForTable<Product>(
          nameof(list[0].usedVariation),
          sorter,
        ),
        ellipsis: true,
        render(usedVariation, product: Product) {
          return (
            <>
              {product.usedVariationId === 0 ? (
                <span>{usedVariation?.name}</span>
              ) : (
                <span>
                  {usedVariation?.name} ( {product?.variationCounter} ){' '}
                </span>
              )}
            </>
          );
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, product: Product) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('get') && (
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleOpenPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
              )}
              {validAction('update') && (
                <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleGoDetail(id)}
                  >
                    <i className="tio-edit" />
                  </button>
                </Tooltip>
              )}
              {!product.used && validAction('delete') && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(product)}
                  >
                    <i className="tio-delete_outlined" />
                  </button>
                </Tooltip>
              )}
              {product.usedVariation.id === 0 &&
                validAction('listItemHistory') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.history)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleOpenHistory(product)}
                    >
                      <i className="tio-history" />
                    </button>
                  </Tooltip>
                )}
            </div>
          );
        },
      },
    ];
  }, [
    handleDelete,
    handleGoDetail,
    handleOpenHistory,
    handleOpenPreview,
    list,
    pagination,
    sorter,
    translate,
    validAction,
  ]);

  const handleEnterName = React.useCallback(
    (event: any, filterField) => {
      filter.search = event[filterField];
      setFilter({ ...filter, skip: 0 });
      setLoadList(true);
    },
    [setFilter, filter, setLoadList],
  );

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
                      getList={productRepository.filterListStatus}
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
                      getList={productRepository.filterListProductGrouping}
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('products.otherName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.otherName.contain)}
                    filter={filter.otherName}
                    onChange={handleFilter(nameof(previewModel.otherName))}
                    className="w-100"
                    placeholder={translate('products.placeholder.otherName')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('products.name')}
                  labelAlign="left"
                >
                  <AdvancedStringNoTypeFilter
                    filter={filter}
                    filterField={nameof(filter.search)}
                    onChange={handleEnterName}
                    placeholder={translate('products.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>

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
                      getList={productRepository.filterListProductType}
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
              {validAction('singleListBrand') && (
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
                      getList={productRepository.singleListBrand}
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
              {validAction('filterListUsedVariation') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('products.usedVariation')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.usedVariationId}
                      filterType={nameof(filter.usedVariationId.equal)}
                      value={filter.usedVariationId.equal}
                      onChange={handleFilter(nameof(filter.usedVariationId))}
                      getList={productRepository.filterListUsedVariation}
                      modelFilter={usedVariationFilter}
                      setModelFilter={setUsedVariationFilter}
                      searchField={nameof(usedVariationFilter.name)}
                      searchType={nameof(usedVariationFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
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
                      getList={productRepository.filterListCategory}
                      modelFilter={categoryFilter}
                      setModelFilter={setCategoryFilter}
                      allowClear={true}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
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
                  {/* create button */}
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  )}
                  {/* bulk delete button */}
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
                  {validAction('import') && (
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                  )}
                  {validAction('export') && (
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExport}
                    >
                      <i className="tio-file_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.export)}
                    </button>
                  )}
                  {validAction('exportTemplate') && (
                    <button
                      className="btn btn-sm btn-export-template mr-2"
                      onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
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
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />
        <PreviewProduct
          product={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
      </Card>
      {visibleHistory && (
        <ChangePriceProductHistoryModal
          title={translate('products.master.changePriceHistory')}
          isOpen={visibleHistory}
          currentItem={currentItem}
          getList={productRepository.listItemHistory}
          count={productRepository.countItemHistory}
          handleClose={handleClose}
        />
      )}

      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </div>
  );
}

export default ProductMaster;
