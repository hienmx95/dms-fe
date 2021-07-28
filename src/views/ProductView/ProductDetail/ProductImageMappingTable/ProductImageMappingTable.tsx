import React, { Dispatch, SetStateAction } from 'react';
import { crudService, tableService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';

// Parent Repo
import { productRepository } from 'views/ProductView/ProductRepository';
// Parent Class
import { Product } from 'models/Product';
// Class
import { ProductImageMapping } from 'models/ProductImageMapping';
// Filter Class
import { ProductImageMappingFilter } from 'models/ProductImageMappingFilter';
// Mapping Class
import { Image } from 'models/Image';
import ProductImageMappingModal from 'views/ProductView/ProductDetail/ProductImageMappingModal/ProductImageMappingModal';

export interface ProductImageMappingTableProps {
  product: Product;

  setProduct: Dispatch<SetStateAction<Product>>;
}

function ProductImageMappingTable(props: ProductImageMappingTableProps) {
  const [translate] = useTranslation();

  const { product, setProduct } = props;

  const [
    productImageMappings,
    setProductImageMappings,
  ] = crudService.useContentTable<Product, ProductImageMapping>(
    product,
    setProduct,
    nameof(product.productImageMappings),
  );

  const [
    productImageMappingFilter,
    setProductImageMappingFilter,
  ] = React.useState<ProductImageMappingFilter>(
    new ProductImageMappingFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<
    ProductImageMapping,
    ProductImageMappingFilter
  >(
    productImageMappings,
    productImageMappingFilter,
    setProductImageMappingFilter,
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    filter,
    setFilter,
  ] = crudService.useContentModal(
    productRepository.listProductImageMapping,
    productRepository.countProductImageMapping,
    ProductImageMappingFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    Image,
    ProductImageMapping
  >(
    product.id,
    nameof(product),
    nameof(productImageMappings[0].image),
    productImageMappings,
    setProductImageMappings,
  );

  const columns: ColumnProps<ProductImageMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ProductImageMapping>(pagination),
      },
      {
        title: translate('products.images.productId'),
        key: nameof(dataSource[0].image.productId),
        dataIndex: nameof(dataSource[0].image),
        render(image: Image) {
          return image?.productId;
        },
      },
      {
        title: translate('products.images.imageId'),
        key: nameof(dataSource[0].image.imageId),
        dataIndex: nameof(dataSource[0].image),
        render(image: Image) {
          return image?.imageId;
        },
      },
    ],
    [dataSource, pagination, translate],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        bordered={true}
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(productImageMappings[0].imageId)}
        onChange={handleTableChange}
        title={() => (
          <>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-primary" onClick={handleOpen}>
                <i className="fa fa-plus mr-2" />
                {translate(generalLanguageKeys.actions.add)}
              </button>
            </div>
          </>
        )}
      />
      <ProductImageMappingModal
        current={productImageMappings}
        list={list}
        total={total}
        loading={loading}
        isOpen={visible}
        modelFilter={filter}
        setModelFilter={setFilter}
        rowSelection={rowSelection}
        onClose={handleClose}
      />
    </>
  );
}
export default ProductImageMappingTable;
