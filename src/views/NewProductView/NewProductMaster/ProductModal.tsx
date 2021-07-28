import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, {
  ColumnProps,
  PaginationConfig,
  TableRowSelection,
} from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvanceTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
// import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
// import { Supplier } from 'models/Supplier';
// import { SupplierFilter } from 'models/SupplierFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { newProductRepository } from '../NewProductRepository';
import { newProductService } from '../NewProductService';
import './NewProductMaster.scss';
export interface ProductModalIProps<T extends Model> extends ModalProps {
  selectedList: T[];
  setSelectedList: Dispatch<SetStateAction<T[]>>;
  list: T[];
  pagination?: PaginationConfig;
  isSave?: boolean;
  onSave?: (selectedList: T[]) => () => void;
  total?: number;
  getList?: (storeFilter?: ProductFilter) => Promise<Product[]>;
  count?: (storeFilter?: ProductFilter) => Promise<number>;
  onClose?: () => void;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function ProductModal<T extends Model>(
  props: ProductModalIProps<T>,
) {
  const [translate] = useTranslation();
  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    onSave,
    getList,
    count,
    onClose,
    isVisible,
    setIsVisible,
  } = props;

  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [listProduct, setListProduct] = React.useState<Product[]>([]);
  const [totalProduct, setTotal] = React.useState<number>(0);
  const [selectedProducts, setSelectedProducts] = React.useState<T[]>([]);

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

  const rowSelection: TableRowSelection<Product> = crudService.useContentModalList<
    T
  >(selectedProducts, setSelectedProducts);
  const [
    filterProduct,
    setFilterProduct,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = newProductService.useProductContentMaster(getList, count);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterProduct,
    setFilterProduct,
    total,
    handleSearch,
  );
  const handleChangeFilter = React.useCallback(() => {
    filterProduct.skip = 0;
    Promise.all([getList(filterProduct), count(filterProduct)])
      .then(([listProduct, totalProduct]) => {
        setListProduct(listProduct);
        setTotal(totalProduct);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filterProduct, getList, count, handleSearch, setLoading]);
  React.useEffect(() => {
    setListProduct(list);
    setTotal(totalProduct);
    setLoading(false);
    if (isVisible) {
      handleChangeFilter();
      setIsVisible(false);
      setSelectedProducts([]);
    }
  }, [
    setLoading,
    list,
    totalProduct,
    isVisible,
    handleChangeFilter,
    setIsVisible,
    selectedProducts,
  ]);
  React.useEffect(() => {
    if (selectedList) {
      if (selectedList.length > 0) {
        setSelectedProducts([...selectedList]);
      } else {
        setSelectedProducts([]);
      }
    }
  }, [selectedList, setSelectedList]);
  const handleReset = React.useCallback(() => {
    const newFilter = new ProductFilter();
    setFilterProduct(newFilter);
    setListProduct(list);
    setIsReset(true);
    handleSearch();
  }, [setFilterProduct, list, handleSearch, setListProduct]);
  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 60,
        render: renderMasterIndex<Product>(pagination),
      },
      {
        title: translate('products.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        ellipsis: true,
      },
      {
        title: translate('products.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('products.productGrouping'),
        key: nameof(list[0].productProductGroupingMappings),
        dataIndex: nameof(list[0].productProductGroupingMappings),
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
        ellipsis: true,
        render(productType: ProductType) {
          return productType?.name;
        },
      },
      {
        title: translate('products.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
        ellipsis: true,
        render: (brand: Brand) => brand && brand.name,
      },
    ];
  }, [list, pagination, translate]);

  // const handleEnterName = React.useCallback(
  //   (event: any, filterField) => {
  //     setFilterProduct({
  //       ...filterProduct,
  //       search: event[filterField],
  //       skip: 0,
  //     });
  //     handleSearch();
  //   },
  //   [filterProduct, handleSearch, setFilterProduct],
  // );

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
          className="head-borderless mb-3 "
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row className="form-filter">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterProduct.code.contain)}
                    filter={filterProduct.code}
                    onChange={handleChangeFilter}
                    className="w-100"
                    placeholder={translate('products.placeholder.code')}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.productGrouping')}
                  labelAlign="left"
                >
                  <AdvanceTreeFilter
                    filter={filterProduct.productGroupingId}
                    filterType={nameof(filterProduct.productGroupingId.equal)}
                    value={filterProduct.productGroupingId.equal}
                    onChange={handleChangeFilter}
                    getList={newProductRepository.filterListProductGrouping}
                    modelFilter={productGroupingFilter}
                    setModelFilter={setProductGroupingFilter}
                    searchField={nameof(productGroupingFilter.name)}
                    // searchType={nameof(productGroupingFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    // isReset={isReset}
                    // setIsReset={setIsReset}
                    mode={'single'}
                  />
                </FormItem>
              </Col>
              {/* <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.supplier')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterProduct.supplierId}
                    filterType={nameof(filterProduct.supplierId.equal)}
                    value={filterProduct.supplierId.equal}
                    onChange={handleChangeFilter}
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
              </Col> */}
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.brand')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterProduct.brandId}
                    filterType={nameof(filterProduct.brandId.equal)}
                    value={filterProduct.brandId.equal}
                    onChange={handleChangeFilter}
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
            </Row>
            <Row className="form-filter">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.name')}
                  labelAlign="left"
                >
                  {/* <AdvancedStringFilter
                    filter={filterProduct}
                    filterField={nameof(filterProduct.name)}
                    onChange={handleChangeFilter}
                    placeholder={translate('items.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  /> */}
                  <AdvancedStringFilter
                    filterType={nameof(filterProduct.name.contain)}
                    filter={filterProduct.name}
                    onChange={handleChangeFilter}
                    className="w-100"
                    placeholder={translate('products.placeholder.name')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('products.productType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterProduct.productTypeId}
                    filterType={nameof(filterProduct.productTypeId.equal)}
                    value={filterProduct.productTypeId.equal}
                    onChange={handleChangeFilter}
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
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter ml-1">
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
          </div>
        </CollapsibleCard>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listProduct}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listProduct[0].id)}
          onChange={handleTableChange}
          className="ml-4"
        />
        <div className=" d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={onSave(selectedProducts)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => onClose()}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
