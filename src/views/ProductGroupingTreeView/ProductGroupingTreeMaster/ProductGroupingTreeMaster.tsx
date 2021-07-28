import { Card, Row, Col } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { productGroupingRepository } from 'views/ProductGroupingTreeView/ProductGroupingRepository';
import ProductGroupingTreeDetail from '../ProductGroupingTreeDetail/ProductGroupingTreeDetail';
import ProductProductGroupingModal from '../ProductGroupingTreeDetail/ProductProductGroupingMappingModal/ProductProductGroupingMappingModal';
import './ProductGroupingTreeMaster.scss';
// import { Supplier } from 'models/Supplier';
import { Category } from 'models/Category';
import { API_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import ProductGroupingTree from './ProductGroupingTree/ProductGroupingTree';

function ProductGroupingTreeMaster() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'product-grouping',
    API_PRODUCT_GROUPING_ROUTE,
    'mdm',
  );
  /*  Hooks for crud tree */
  const [
    list,
    setList,
    ,
    setLoading,
    ,
    previewVisible,
    ,
    handleOpenPreview,
    handleClosePreview,
    ,
    handleSearch,
    isDetail,
    ,
    visible,
    setVisible,
    currentItem,
    setCurrentItem,
    handleAddProductGrouping,
    handleAdd,
    handleEdit,
    handlePopupCancel,
    setLoadList,
  ] = crudService.useTreeMaster<ProductGrouping, ProductGroupingFilter>(
    ProductGrouping,
    ProductGroupingFilter,
    productGroupingRepository.list,
    productGroupingRepository.get,
  );

  /* Hooks for modal functionalities, including open mappings modal, close modal, selectedItems, list, total, save mappings */
  const [
    loadingProduct,
    visibleProduct,
    setVisibleProduct,
    listProduct2,
    totalProduct,
    handleOpenProduct,
    ,
    filterProduct,
    setFilterProduct,
  ] = crudService.useContentModal(
    productGroupingRepository.listProduct,
    productGroupingRepository.countProduct,
    ProductFilter,
  );

  /* HandleDelete hooks for tree item */
  const [handleDelete] = tableService.useDeleteHandler<ProductGrouping>(
    productGroupingRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  /* HandleGetListMapping and HandleMappingBack */
  const [
    loadingMapping,
    ,
    listProduct,
    setListProduct,
    handleGetListProduct,
    handleMappingProduct,
    total,
  ] = crudService.useMappingContent<ProductGrouping, Product>(
    productGroupingRepository.get,
    'productProductGroupingMappings',
    'product',
    'productGroupingId',
    'productId',
    'product',
  );

  /* Hooks for local treeMappingTable functionalities */
  const [
    loadingProductMapping,
    setLoadingProductMapping,
    dataSource,
    pagination,
    handleTableChange,
    handleDeleteProduct,
  ] = tableService.useLocalMappingTreeTable(
    listProduct,
    setListProduct,
    filterProduct,
    setFilterProduct,
    'productProductGroupingMappings',
    handleMappingProduct,
    productGroupingRepository.update,
    setVisibleProduct,
  );

  // const [totalProductProductMappings, setTotalProductProductMappings] = React.useState<number>(0);

  const handleActive = React.useCallback(
    (node: ProductGrouping) => {
      setCurrentItem(node);
      filterProduct.productGroupingId.equal = node?.id;
      setFilterProduct({ ...filterProduct });
      setLoadingProductMapping(true);
      handleGetListProduct(node?.id);
    },
    [
      setCurrentItem,
      handleGetListProduct,
      setLoadingProductMapping,
      setFilterProduct,
      filterProduct,
    ],
  );

  const handleCloseProduct = React.useCallback(
    (currentItems: ProductGrouping) => {
      handleGetListProduct(currentItems?.id);
      setVisibleProduct(false);
    },
    [handleGetListProduct, setVisibleProduct],
  );

  const handleSaveProductModal = React.useCallback(
    (event, currentItems) => {
      const productProductGroupingMappings = handleMappingProduct(
        event,
        currentItems,
      );
      currentItems.productProductGroupingMappings = productProductGroupingMappings;
      productGroupingRepository
        .update(currentItems)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [handleMappingProduct, setLoading, setVisibleProduct],
  );

  React.useEffect(() => {
    if (
      (currentItem && currentItem?.id === undefined) ||
      loadingMapping === false
    ) {
      setLoadingProductMapping(false);
    }
  }, [currentItem, setLoadingProductMapping, loadingMapping]);

  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Product>(pagination),
      },
      {
        title: translate('productGrouping.master.product.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        ellipsis: true,
      },

      {
        title: translate('productGrouping.master.product.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
      },

      {
        title: translate('productGrouping.master.product.category'),
        key: nameof(dataSource[0].category),
        dataIndex: nameof(dataSource[0].category),
        ellipsis: true,
        render(category: Category) {
          return category?.name;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, product]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('update') && (
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleDeleteProduct(product, currentItem)}
                >
                  <i className="tio-delete_outlined" />
                </button>
              )}
            </div>
          );
        },
      },
    ];
  }, [
    currentItem,
    dataSource,
    handleDeleteProduct,
    pagination,
    translate,
    validAction,
  ]);

  return (
    <div className="page master-page">
      <Card
        className=" product-grouping-master"
        title={translate('productGroupings.master.title')}
      >
        <Row>
          <Col lg={12}>
            <div className="product-grouping">
              <div className="mb-3">
                <span className="title-product">
                  {translate('productGroupings.master.grouping.title')}
                </span>
                {validAction('create') && (
                  <i
                    role="button"
                    className="icon tio-add ml-2"
                    onClick={handleAddProductGrouping}
                  />
                )}
              </div>
              <ProductGroupingTree
                key={list[0]?.id}
                tree={list}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onPreview={handleOpenPreview}
                onDelete={handleDelete}
                onActive={handleActive}
                currentItem={currentItem}
              />
            </div>
          </Col>
          <Col lg={12}>
            {currentItem && currentItem?.id && (
              <div>
                {validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary mt-3 ml-1 mr-2"
                    onClick={handleOpenProduct}
                  >
                    <i className="icon tio-add mr-1" />
                    {translate('productGroupings.master.add')}
                  </button>
                )}

                {/* <label
                  className="btn btn-sm btn-outline-primary mt-3 mr-2 mb-0"
                  htmlFor="master-import"
                >
                  <i className="fa mr-2 fa-upload" />
                  {translate(generalLanguageKeys.actions.import)}
                </label>
                <button className="btn btn-sm btn-outline-primary mt-3 mr-2">
                  <i className="tio-download_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.export)}
                </button> */}
              </div>
            )}

            <div className="table-product">
              <div className="mb-3 title-product">
                {translate('productGroupings.master.product.title')}
              </div>
              <Table
                key={listProduct[0]?.id}
                dataSource={listProduct}
                columns={columns}
                bordered
                size="small"
                tableLayout="fixed"
                loading={loadingProductMapping}
                rowKey={nameof(dataSource[0].key)}
                pagination={pagination}
                onChange={handleTableChange}
                title={() => (
                  <>
                    <div className="d-flex justify-content-end">
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
            </div>
            {visibleProduct === true && validAction('listProduct') && (
              <ProductProductGroupingModal
                title={translate('productGroupings.master.product.title')}
                selectedList={listProduct}
                initSelectedList={listProduct}
                setSelectedList={setListProduct}
                list={listProduct2} // error here
                total={totalProduct}
                isOpen={visibleProduct}
                loading={loadingProduct}
                onClose={handleCloseProduct}
                onSave={handleSaveProductModal}
                currentItem={currentItem}
                isSave={true}
                pagination={pagination}
                dataSource={dataSource}
                getList={productGroupingRepository.listProduct}
                count={productGroupingRepository.countProduct}
              />
            )}
          </Col>
        </Row>
        {visible === true && validAction('update') && (
          <ProductGroupingTreeDetail
            isDetail={isDetail}
            visible={visible}
            setVisible={setVisible}
            getListGroup={productGroupingRepository.list}
            setListGroup={setList}
            currentItem={currentItem}
            onClose={handlePopupCancel}
            setLoadList={setLoadList}
          />
        )}
        {previewVisible === true && validAction('get') && (
          <ProductGroupingTreeDetail
            isDetail={isDetail}
            visible={previewVisible}
            isPreview={true}
            setVisible={setVisible}
            getListGroup={productGroupingRepository.list}
            setListGroup={setList}
            currentItem={currentItem}
            onClose={handleClosePreview}
          />
        )}
      </Card>
    </div>
  );
}

export default ProductGroupingTreeMaster;
