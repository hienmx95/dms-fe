import Table, { ColumnProps } from 'antd/lib/table';
import TreePopup from 'components/TreePopup/TreePopup';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
// Parent Class
import { Product } from 'models/Product';
// Class
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
// Filter Class
import { ProductProductGroupingMappingFilter } from 'models/ProductProductGroupingMappingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
// Parent Repo
import { productRepository } from 'views/ProductView/ProductRepository';
import './ProductProductGroupingMappingTable.scss';
import { API_PRODUCT_ROUTE } from 'config/api-consts';
// import { API_PRODUCT_ROUTE } from 'config/api-consts';

export interface ProductProductGroupingMappingTableProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  product: Product;

  setProduct: Dispatch<SetStateAction<Product>>;
  visible?: boolean;
  handleChangeTreePopup?: (selectedItem: T[]) => void;
  handleClose?: () => void;
  handleFocus?: () => void;
  list?: T[];
  modelFilter?: TModelFilter;
  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;
  selectedItems?: T[];
  setSelectedItems: Dispatch<SetStateAction<T[]>>;
}

function ProductProductGroupingMappingTable<
  T extends Model,
  TModelFilter extends ModelFilter
>(props: ProductProductGroupingMappingTableProps<T, TModelFilter>) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'product',
    API_PRODUCT_ROUTE,
    'mdm',
  );
  const {
    product,
    setProduct,
    handleFocus,
    handleClose,
    visible,
    handleChangeTreePopup,
    list,
    modelFilter,
    setModelFilter,
    selectedItems,
    setSelectedItems,
  } = props;

  const [
    productProductGroupingMappings,
    setProductProductGroupingMappings,
  ] = crudService.useContentTable<Product, ProductProductGroupingMapping>(
    product,
    setProduct,
    nameof(product.productProductGroupingMappings),
  );

  // When delete a mapping row in mapping table, update selectedItems in tree
  const handleDeleteProductGroupingMapping = React.useCallback(
    (index: number) => {
      return () => {
        productProductGroupingMappings.splice(index, 1);
        setProductProductGroupingMappings([...productProductGroupingMappings]);
        selectedItems.splice(index, 1);
        setSelectedItems(selectedItems);
      };
    },
    [
      productProductGroupingMappings,
      selectedItems,
      setProductProductGroupingMappings,
      setSelectedItems,
    ],
  );

  const [
    productProductGroupingMappingFilter,
    setProductProductGroupingMappingFilter,
  ] = React.useState<ProductProductGroupingMappingFilter>(
    new ProductProductGroupingMappingFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<
    ProductProductGroupingMapping,
    ProductProductGroupingMappingFilter
  >(
    productProductGroupingMappings,
    productProductGroupingMappingFilter,
    setProductProductGroupingMappingFilter,
  );

  const columns: ColumnProps<
    ProductProductGroupingMapping
  >[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ProductProductGroupingMapping>(pagination),
      },
      {
        title: translate('products.productGrouping'),
        key: nameof(dataSource[0].productGrouping),
        dataIndex: nameof(dataSource[0].productGrouping),
        ellipsis: true,
        render(...[, productGroupingMapping]) {
          return productGroupingMapping?.productGrouping.name;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="button-action-table">
              {validAction('update') && (
                <button
                  className="btn btn-sm btn-link "
                  onClick={handleDeleteProductGroupingMapping(index)}
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
    dataSource,
    handleDeleteProductGroupingMapping,
    pagination,
    translate,
    validAction,
  ]);

  return (
    <>
      {
        <Table
          tableLayout="fixed"
          className="product-table-mapping"
          size="small"
          columns={columns}
          dataSource={dataSource}
          rowKey={nameof(dataSource[0].productGroupingId)}
          onChange={handleTableChange}
          scroll={{ y: 240 }}
          title={() => (
            <>
              <div className="d-flex justify-content-end mb-2">
                {validAction('singleListProductGrouping') && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleFocus}
                  >
                    <i className="fa fa-plus mr-2" />
                    {translate('products.addProductGrouping')}
                  </button>
                )}
              </div>
            </>
          )}
        />
      }
      <TreePopup
        onChange={handleChangeTreePopup}
        list={list}
        getList={productRepository.singleListProductGrouping}
        selectedItems={selectedItems}
        visible={visible}
        onClose={handleClose}
        modelFilter={modelFilter}
        setModelFilter={setModelFilter}
      />
    </>
  );
}
export default ProductProductGroupingMappingTable;
