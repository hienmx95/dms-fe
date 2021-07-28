import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductType } from 'models/ProductType';
// import { Supplier } from 'models/Supplier';
import { API_PRODUCT_ROUTE } from 'config/api-consts';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { productGroupingService } from 'views/ProductGroupingTreeView/ProductGroupingTreeService';
import './ProductProductGroupingMappingModal.scss';
import { ProductProductGroupingMapping } from 'models/ProductProductGroupingMapping';
import { Brand } from 'models/Brand';
import { Category } from 'models/Category';
import { productRepository } from 'views/ProductView/ProductRepository';
import { CategoryFilter } from 'models/Category';
import { BrandFilter } from 'models/BrandFilter';
export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: any;

  total?: number;

  getList?: (productFilter?: ProductFilter) => Promise<Product[]>;

  count?: (productFilter?: ProductFilter) => Promise<number>;

  onClose?: (currentItem) => void;
}

function ProductProductGroupingModal<T extends Model>(
  props: ContentModalProps<T>,
) {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'product',
    API_PRODUCT_ROUTE,
    'mdm',
  );

  const {
    toggle,
    isOpen,
    title,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    getList,
    count,
    onClose,
  } = props;

  const [listProduct, setListProduct] = React.useState<Product[]>([]);

  // const [totalProduct, setTotal] = React.useState<number>(0);

  const [
    filterProduct,
    setFilterProduct,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = productGroupingService.useProductContentMaster(
    getList,
    count,
    currentItem,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterProduct,
    setFilterProduct,
    total,
    handleSearch,
  );

  // React.useEffect(() => {
  //   setListProduct(list);
  //   setTotal(totalProduct);
  //   setLoading(false);
  //   if (isOpen === true) {
  //     handleSearch();
  //   }
  // }, [
  //   setListProduct,
  //   setTotal,
  //   list,
  //   setLoading,
  //   totalProduct,
  //   handleSearch,
  //   isOpen,
  // ]);

  const rowSelection: TableRowSelection<Product> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  // const handleChangeFilter = React.useCallback(() => {
  //   filterProduct.skip = 0;
  //   Promise.all([getList(filterProduct), count(filterProduct)])
  //     .then(([listProduct, totalProduct]) => {
  //       setListProduct(listProduct);
  //       setTotal(totalProduct);
  //       handleSearch();
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [
  //   getList,
  //   filterProduct,
  //   count,
  //   setListProduct,
  //   setTotal,
  //   handleSearch,
  //   setLoading,
  // ]);

  const handleChangeFilter = React.useCallback(() => {
    filterProduct.skip = 0;
    // Promise.all([getList(filterProduct), count(filterProduct)])
    getList(filterProduct)
      .then(listProduct => {
        setListProduct(listProduct);
        // setTotal(totalProduct);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    getList,
    filterProduct,
    // count,
    setListProduct,
    // setTotal,
    handleSearch,
    setLoading,
  ]);

  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new ProductFilter();
    setFilterProduct(newFilter);
    setListProduct(list);
    handleSearch();
  }, [list, setFilterProduct, setListProduct, handleSearch]);

  const handleSave = React.useCallback(() => {
    handleReset();
    if (typeof onSave === 'function') {
      onSave(selectedList, currentItem);
    }
  }, [handleReset, onSave, selectedList, currentItem]);

  const handleClose = React.useCallback(() => {
    handleReset();
    onClose(currentItem);
  }, [currentItem, handleReset, onClose]);

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const columns: ColumnProps<Product>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 100,
        render: renderMasterIndex<Product>(pagination),
      },
      {
        title: translate('products.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate('products.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
      },
      {
        title: translate('products.category'),
        key: nameof(list[0].category),
        dataIndex: nameof(list[0].category),
        render(category: Category) {
          return category?.name;
        },
      },
      {
        title: translate('products.productGrouping'),
        key: nameof(list[0].productProductGroupingMappings),
        dataIndex: nameof(list[0].productProductGroupingMappings),
        render(productProductGroupingMappings: ProductProductGroupingMapping) {
          return (
            <>
              {productProductGroupingMappings &&
                productProductGroupingMappings.length > 0 &&
                productProductGroupingMappings.map(
                  (
                    productMapping: ProductProductGroupingMapping,
                    index: number,
                  ) => (
                    <div key={index}>
                      {productMapping?.productGrouping?.name}
                      <span>, </span>
                    </div>
                  ),
                )}
            </>
          );
        },
      },
      {
        title: translate('products.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].productType),
        render(productType: ProductType) {
          return productType?.name;
        },
      },
      {
        title: translate('products.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
        render(brand: Brand) {
          return brand?.name;
        },
      },
    ];
  }, [list, pagination, translate]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader className="header">{title}</ModalHeader>
      <ModalBody>
        <CollapsibleCard
          className=" mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row className="filter">
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('products.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterProduct.code.contain)}
                    filter={filterProduct.code}
                    onChange={handleChangeFilter}
                    placeholder={translate('products.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('products.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterProduct.name.contain)}
                    filter={filterProduct.name}
                    onChange={handleChangeFilter}
                    placeholder={translate('products.placeholder.name')}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              {validAction('filterListCategory') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('products.category')}
                  >
                    <AdvancedTreeFilter
                      filter={filterProduct.categoryId}
                      filterType={nameof(filterProduct.categoryId.equal)}
                      value={filterProduct.categoryId.equal}
                      onChange={handleChangeFilter}
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

              {validAction('singleListBrand') && (
                <Col className="pl-1" span={6}>
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
                      getList={productRepository.singleListBrand}
                      modelFilter={brandFilter}
                      setModelFilter={setBrandFilter}
                      searchField={nameof(brandFilter.name)}
                      searchType={nameof(brandFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      // isReset={isReset}
                      // setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 button-under-filter">
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
          key={listProduct[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listProduct[0].id)}
          onChange={handleTableChange}
          className="ml-3 mr-3"
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => handleClose()}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ProductProductGroupingModal;
