import { Col, Form, Row } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedStringNoTypeFilter from 'components/AdvancedStringNoTypeFilter/AdvancedStringNoTypeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { IdFilter } from 'core/filters';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { PromotionCode } from 'models/PromotionCode';
import { StatusFilter } from 'models/StatusFilter';
// import { Supplier } from 'models/Supplier';
import { Brand } from 'models/Brand';
// import { SupplierFilter } from 'models/SupplierFilter';
import { BrandFilter } from 'models/BrandFilter';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ModalBody, ModalFooter } from 'reactstrap/lib';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';
import { promotionCodeRepository } from 'views/PromotionCodeView/PromotionCodeRepository';
import { promotionCodeService } from 'views/PromotionCodeView/PromotionCodeService';

const { Item: FormItem } = Form;

export interface PromotionProductMappingModalProps extends ModalProps {
  model?: PromotionCode;
  loadList?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
  onSave?: (list: Product[]) => void;
  onClose?: () => void;
  selectedList?: Product[];
  setSelectedList?: Dispatch<SetStateAction<Product[]>>;
}

export default function PromotionProductMappingModal(
  props: PromotionProductMappingModalProps,
) {
  const {
    isOpen,
    toggle,
    loadList,
    setLoadList,
    onSave,
    onClose,
    selectedList,
    setSelectedList,
    model,
  } = props;
  const firstLoad = useRef<boolean>(true);

  const defaultState = useMemo(
    () => ({
      list: [],
      filter: new ProductFilter(),
      loading: false,
    }),
    [],
  );

  const customFilter = useCallback(
    (filter: ProductFilter) => {
      if (loadList && firstLoad.current) {
        firstLoad.current = false;
        return {
          ...filter,
          organizationId: { ...new IdFilter(), equal: model?.organizationId },
        };
      }
      return filter;
    },
    [loadList, model],
  );

  const {
    translate,
    handleSave,
    handleClose,
    loading,
    list,
    filter,
    isReset,
    setIsReset,
    handleFilter,
    handleDefaultSearch,
    handleReset,
    rowSelection,
    pagination,
    handleTableChange,
  } = promotionCodeService.usePromotionCodeMappingModal<Product, ProductFilter>(
    ProductFilter,
    loadList,
    setLoadList,
    onSave,
    onClose,
    promotionCodeRepository.listProduct,
    promotionCodeRepository.countProduct,
    defaultState,
    selectedList,
    setSelectedList,
    customFilter,
    firstLoad,
  );

  const {
    statusFilter,
    setStatusFilter,
    // supplierFilter,
    // setSupplierFilter,
    productTypeFilter,
    setProductTypeFilter,
    productGroupingFilter,
    setProductGroupingFilter,
    brandFilter,
    setBrandFilter,
  } = useModalFilter();

  const columns: ColumnProps<Product>[] = useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Product>(pagination),
      },
      {
        title: translate('promotionCodes.product.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        width: 150,
        render(code: string) {
          return code;
        },
        ellipsis: true,
      },
      {
        title: translate('promotionCodes.product.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        width: 150,
        render(name: string) {
          return name;
        },
        ellipsis: true,
      },
      {
        title: translate('promotionCodes.product.productGrouping'),
        key: nameof(list[0].productGrouping),
        dataIndex: nameof(list[0].productGrouping),

        render(productGrouping: ProductGrouping) {
          return productGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('promotionCodes.product.productType'),
        key: nameof(list[0].productType),
        dataIndex: nameof(list[0].productType),
        render(productType: ProductType) {
          return productType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('promotionCodes.product.brand'),
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
        width: 250,
        render(brand: Brand) {
          return brand?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('promotionCodes.product.salePrice'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        width: 250,
        render(salePrice: string) {
          return salePrice;
        },
        ellipsis: true,
      },
    ],
    [list, pagination, translate],
  );

  const handleEnterName = React.useCallback(
    (event: any, filterField) => {
      filter.search = event[filterField];
      filter.skip = 0;
      // setFilter({ ...filter, search: event[filterField], skip: 0 });
      setLoadList(true);
    },
    [filter, setLoadList],
  );

  return (
    <>
      <ModalContent
        size="xl"
        isOpen={isOpen}
        backdrop="static"
        toggle={toggle}
        unmountOnClose={true}
      >
        <ModalBody>
          <CollapsibleCard
            className="head-borderless modal-mapping mb-3"
            title={translate('promotionCodes.promotionProductMappingModal')}
          >
            <Form>
              <Row>
                <Col lg={6} className="pr-2">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.code')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.code.contain)}
                      filter={filter.code}
                      onChange={handleFilter(nameof(filter.code))}
                      placeholder={translate(
                        'promotionCodes.product.placeholder.code',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col lg={6} className="pr-2">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.name')}
                    labelAlign="left"
                  >
                    <AdvancedStringNoTypeFilter
                      filter={filter}
                      filterField={nameof(filter.search)}
                      onChange={handleEnterName}
                      placeholder={translate(
                        'promotionCodes.product.placeholder.name',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                    {/* <AdvancedStringFilter
                      filterType={nameof(filter.name.contain)}
                      filter={filter.name}
                      onChange={handleFilter(nameof(filter.name))}
                      placeholder={translate('promotionCodes.product.placeholder.name')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    /> */}
                  </FormItem>
                </Col>
                <Col lg={6} className="pr-2">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.productGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productGroupingId}
                      filterType={nameof(filter.productGroupingId.equal)}
                      value={filter.productGroupingId.equal}
                      onChange={handleFilter(nameof(filter.productGroupingId))}
                      getList={
                        promotionCodeRepository.singleListProductGrouping
                      }
                      modelFilter={productGroupingFilter}
                      setModelFilter={setProductGroupingFilter}
                      searchField={nameof(productGroupingFilter.name)}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
                <Col lg={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.productType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.productTypeId}
                      filterType={nameof(filter.productTypeId.equal)}
                      value={filter.productTypeId.equal}
                      onChange={handleFilter(nameof(filter.productTypeId))}
                      getList={promotionCodeRepository.singleListProductType}
                      modelFilter={productTypeFilter}
                      setModelFilter={setProductTypeFilter}
                      searchField={nameof(productTypeFilter.name)}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col lg={6} className="pr-2">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.otherName')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.otherName.contain)}
                      filter={filter.name}
                      onChange={handleFilter(nameof(filter.otherName))}
                      placeholder={translate(
                        'promotionCodes.product.placeholder.otherName',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col lg={6} className="pr-2">
                  <FormItem
                    className="mb-1"
                    label={translate('promotionCodes.product.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={promotionCodeRepository.filterListStatus}
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
                {/* <Col lg={6} className="col-right">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.supplier')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.supplierId}
                      filterType={nameof(filter.supplierId.equal)}
                      value={filter.supplierId.equal}
                      onChange={handleFilter(nameof(filter.supplierId))}
                      getList={promotionCodeRepository.singleListSupplier}
                      modelFilter={supplierFilter}
                      setModelFilter={setSupplierFilter}
                      searchField={nameof(supplierFilter.name)}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col> */}
                <Col lg={6} className="col-right">
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.product.brand')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.brandId}
                      filterType={nameof(filter.brandId.equal)}
                      value={filter.brandId.equal}
                      onChange={handleFilter(nameof(filter.brandId))}
                      getList={promotionCodeRepository.singleListBrand}
                      modelFilter={brandFilter}
                      setModelFilter={setBrandFilter}
                      searchField={nameof(brandFilter.name)}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
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
            bordered={false}
            dataSource={list}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(list[0].id)}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={handleTableChange}
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            {/* saveModal */}
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            {/* closeModal */}
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleClose}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </>
  );
}

function useModalFilter() {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  // const [supplierFilter, setSupplierFilter] = React.useState<SupplierFilter>(
  //   new SupplierFilter(),
  // );

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const [productTypeFilter, setProductTypeFilter] = useState<ProductTypeFilter>(
    new ProductTypeFilter(),
  );

  const [productGroupingFilter, setProductGroupingFilter] = useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());
  return {
    statusFilter,
    setStatusFilter,
    // supplierFilter,
    // setSupplierFilter,
    productTypeFilter,
    setProductTypeFilter,
    productGroupingFilter,
    setProductGroupingFilter,
    brandFilter,
    setBrandFilter,
  };
}

PromotionProductMappingModal.defaultProps = {
  loadList: false,
  selectedList: [],
};
