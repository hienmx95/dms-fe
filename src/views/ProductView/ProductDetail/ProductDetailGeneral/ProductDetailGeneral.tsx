import { Col, Input, Row } from 'antd';
import Form from 'antd/lib/form';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_PRODUCT_ROUTE } from 'config/api-consts';
import { crudService, formService } from 'core/services';
import { BrandFilter } from 'models/BrandFilter';
import { CategoryFilter } from 'models/Category';
import { Image } from 'models/Image';
import { Product } from 'models/Product';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductImageMapping } from 'models/ProductImageMapping';
import { ProductProductGroupingMappings } from 'models/ProductProductGroupingMappings';
import { ProductProductGroupingMappingsFilter } from 'models/ProductProductGroupingMappingsFilter';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import nameof from 'ts-nameof.macro';
import { productRepository } from '../../ProductRepository';
import ProductProductGroupingMappingTable from '../ProductProductGroupingMappingTable/ProductProductGroupingMappingTable';
import './ProductDetailGeneral.scss';

const { Item: FormItem } = Form;
const { TextArea } = Input;

export interface ProductDetailGeneralProps {
  product: Product;
  setProduct: Dispatch<SetStateAction<Product>>;
}

function ProductDetailGeneral(props: ProductDetailGeneralProps) {
  const { product, setProduct } = props;
  const [translate] = useTranslation();
  const { id } = useParams();

  const { validAction } = crudService.useAction(
    'product',
    API_PRODUCT_ROUTE,
    'mdm',
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    // handleChangeDateField,
  ] = crudService.useChangeHandlers<Product>(product, setProduct);

  const handleChangeErpCode = React.useCallback(
    (field: string) => (event: any) => {
      // regex for test space in erp code
      const regex = /\s/g;
      if (
        product &&
        product.errors &&
        product.errors.eRPCode &&
        !regex.test(event.target.value)
      ) {
        product.errors.eRPCode = null;
        setProduct({ ...product });
      }
      product[field] = event.target.value;
      setProduct({ ...product });
      // handleChangeSimpleField(field);
    },
    [product, setProduct],
  );

  const [
    productProductGroupingMappingsFilter,
    setProductProductGroupingMappingsFilter,
  ] = React.useState<ProductProductGroupingMappingsFilter>(
    new ProductProductGroupingMappingsFilter(),
  );

  const [statusList] = crudService.useEnumList<Status>(
    productRepository.singleListStatus,
  );

  const [usedVariationList] = crudService.useEnumList<Status>(
    productRepository.singleListUsedVariation,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
  const [productTypeFilter, setProductTypeFilter] = React.useState<
    ProductTypeFilter
  >(new ProductTypeFilter());

  const [taxTypeFilter, setTaxTypeFilter] = React.useState<TaxTypeFilter>(
    new TaxTypeFilter(),
  );

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [
    unitOfMeasureGroupingFilter,
    setUnitOfMeasureGroupingFilter,
  ] = React.useState<UnitOfMeasureGroupingFilter>(
    new UnitOfMeasureGroupingFilter(),
  );

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );

  const defaultProductProductGroupingMappingsList: ProductProductGroupingMappings[] = crudService.useDefaultList<
    ProductProductGroupingMappings
  >(product.productProductGroupingMappings);

  const [visible, setVisible] = React.useState<boolean>(false);

  const [productGroupings, setProductGroupings] = React.useState<
    ProductGrouping[]
  >([]);

  const [productImageMappings, setProductImageMappings] = React.useState<
    Image[]
  >([]);

  const [isCodeGenerated, setIsCodeGenerated] = React.useState<boolean>(false);

  const [isReset, setIsReset] = React.useState<boolean>(false);

  const handleFocus = React.useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleChangeTreePopup = React.useCallback(
    (items: ProductGrouping[]) => {
      setVisible(false);
      setProductGroupings(items);
      const productProductGroupingMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          productProductGroupingMappings.push({
            productGrouping: item,
            productGroupingId: item.id,
          });
        });
      }
      setProduct({
        ...product,
        productProductGroupingMappings,
      });
    },
    [setVisible, setProductGroupings, setProduct, product],
  );

  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setProductImageMappings(items);
      const productImageMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          productImageMappings.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      setProduct({
        ...product,
        productImageMappings,
      });
    },
    [setProduct, product],
  );

  React.useEffect(() => {
    productRepository
      .checkCodeGeneratorRule()
      .then((res: boolean) => setIsCodeGenerated(res));
  }, []);

  React.useEffect(() => {
    if (product.unitOfMeasureId) {
      const newFilter = new UnitOfMeasureGroupingFilter();
      newFilter.unitOfMeasureId.equal = product.unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...newFilter });
    }
  }, [product.unitOfMeasureId]);
  React.useEffect(() => {
    const listPorductGrouping = [];
    if (
      product.productProductGroupingMappings &&
      product.productProductGroupingMappings.length > 0
    ) {
      product.productProductGroupingMappings.map(
        (productGrouping: ProductProductGroupingMappings) => {
          return listPorductGrouping.push(productGrouping.productGrouping);
        },
      );
      setProductGroupings(listPorductGrouping);
    }
  }, [product.productProductGroupingMappings, setProductGroupings]);

  React.useEffect(() => {
    const images = [];
    if (
      product.productImageMappings &&
      product.productImageMappings.length > 0
    ) {
      product.productImageMappings.map(
        (productImageMapping: ProductImageMapping) => {
          return images.push(productImageMapping.image);
        },
      );
      setProductImageMappings(images);
    }
  }, [
    product.productImageMappings,
    product.productProductGroupingMappings,
    setProductGroupings,
  ]);

  /* set UOMGroupingFilter for UOMGrouping if UOM existed */
  React.useEffect(() => {
    if (product.unitOfMeasureId) {
      const newFilter = new UnitOfMeasureGroupingFilter();
      newFilter.unitOfMeasureId.equal = product.unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...newFilter });
    }
  }, [product.unitOfMeasureId]);

  /* render content for UOMGrouping contents */
  const renderItems = React.useMemo(() => {
    const contentList = [];
    if (product) {
      if (product.unitOfMeasureGrouping) {
        if (
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents &&
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents.length > 0
        )
          product.unitOfMeasureGrouping.unitOfMeasureGroupingContents.forEach(
            (content: UnitOfMeasureGroupingContent) => {
              if (content.unitOfMeasure && content.factor) {
                const { unitOfMeasure, factor } = content;
                const value = `${unitOfMeasure.name} (${factor})`;
                contentList.push(value);
              }
            },
          );
      }
    }
    return contentList.join(',');
  }, [product]);

  /* handle Change UOM */

  const handleChangeUnitOfMeasure = React.useCallback(
    (event, item) => {
      const unitOfMeasureId = event;
      const unitOfMeasure = item;
      if (
        unitOfMeasureGroupingFilter.unitOfMeasureId.equal !== unitOfMeasureId
      ) {
        const unitOfMeasureGroupingId = undefined;
        const unitOfMeasureGrouping = undefined;
        if (product.errors?.unitOfMeasure) product.errors.unitOfMeasure = null;
        setProduct({
          ...product,
          unitOfMeasure,
          unitOfMeasureId,
          unitOfMeasureGroupingId,
          unitOfMeasureGrouping,
        });
        setIsReset(true);
      }
      unitOfMeasureGroupingFilter.unitOfMeasureId.equal = unitOfMeasureId;
      setUnitOfMeasureGroupingFilter({ ...unitOfMeasureGroupingFilter });
    },
    [unitOfMeasureGroupingFilter, setProduct, product],
  );

  return (
    <Form className="product-detail-general">
      <Row>
        <Col span={11}>
          <FormItem
            validateStatus={formService.getValidationStatus<Product>(
              product.errors,
              nameof(product.code),
            )}
            help={product.errors?.code}
          >
            <span className="label-input ml-3">
              {translate('products.code')}
              <span className="text-danger">*</span>
            </span>
            <Input
              type="text"
              value={product.code}
              className="form-control form-control-sm"
              onChange={handleChangeSimpleField(nameof(product.code))}
              placeholder={
                isCodeGenerated
                  ? translate('products.placeholder.codeGenerated')
                  : translate('products.placeholder.code')
              }
              disabled={isCodeGenerated}
            />
          </FormItem>
          <FormItem
            validateStatus={formService.getValidationStatus<Product>(
              product.errors,
              nameof(product.name),
            )}
            help={product.errors?.name}
          >
            <span className="label-input ml-3">
              {translate('products.name')}
              <span className="text-danger">*</span>
            </span>
            <Input
              type="text"
              value={product.name}
              className="form-control form-control-sm"
              onChange={handleChangeSimpleField(nameof(product.name))}
              placeholder={translate('products.placeholder.name')}
            />
          </FormItem>
        </Col>
        <Col span={2} />
        {validAction('saveImage') && (
          <Col span={11}>
            <FormItem>
              <label className="label-input label-image">
                {translate('productDetail.images')}
              </label>

              <ImageUpload
                defaultItems={productImageMappings}
                limit={15}
                aspectRatio={1}
                onUpload={productRepository.saveImage}
                onChange={handleChangeImages}
              />
            </FormItem>
          </Col>
        )}
      </Row>
      <Row>
        <Col lg={11}>
          {validAction('singleListStatus') && (
            <Row>
              <Form.Item
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.status),
                )}
                help={product.errors?.status}
              >
                <span className="label-input ml-3">
                  {translate('products.status')}
                </span>
                <SwitchStatus
                  checked={
                    product.statusId === statusList[1]?.id ? true : false
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(nameof(product.status))}
                />
              </Form.Item>
            </Row>
          )}
          {validAction('singleListCategory') && (
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.category),
              )}
              help={product.errors?.category}
            >
              <span className="label-input ml-3">
                {translate('products.category')}
                <span className="text-danger"> *</span>
              </span>

              <TreeSelectDropdown
                defaultValue={
                  product.category
                    ? translate('products.placeholder.category')
                    : product.categoryId
                }
                value={product.categoryId === 0 ? null : product.categoryId}
                mode="single"
                onChange={handleChangeObjectField(nameof(product.category))}
                modelFilter={categoryFilter}
                setModelFilter={setCategoryFilter}
                getList={productRepository.singleListCategory}
                searchField={nameof(categoryFilter.id)}
                placeholder={translate('products.placeholder.category')}
                onlyLeaf={true}
              />
            </FormItem>
          )}
          {validAction('singleListProductType') && (
            <Row>
              <FormItem
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.productType),
                )}
                help={product.errors?.productType}
              >
                <span className="label-input ml-3">
                  {translate('products.productType')}
                  <span className="text-danger">*</span>
                </span>
                <SelectAutoComplete
                  value={product.productType?.id}
                  onChange={handleChangeObjectField(
                    nameof(product.productType),
                  )}
                  placeholder={translate('products.placeholder.productType')}
                  getList={productRepository.singleListProductType}
                  modelFilter={productTypeFilter}
                  setModelFilter={setProductTypeFilter}
                  searchField={nameof(productTypeFilter.name)}
                  searchType={nameof(productTypeFilter.name.contain)}
                />
              </FormItem>
            </Row>
          )}

          {validAction('singleListUnitOfMeasure') && (
            <Row>
              <FormItem
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.unitOfMeasure),
                )}
                help={product.errors?.unitOfMeasure}
              >
                <span className="label-input ml-3">
                  {translate('products.unitOfMeasure')}
                  <span className="text-danger">*</span>
                </span>
                <SelectAutoComplete
                  value={product.unitOfMeasure?.id}
                  onChange={handleChangeUnitOfMeasure}
                  placeholder={translate('products.placeholder.unitOfMeasure')}
                  getList={productRepository.singleListUnitOfMeasure}
                  modelFilter={unitOfMeasureFilter}
                  setModelFilter={setUnitOfMeasureFilter}
                  searchField={nameof(unitOfMeasureFilter.name)}
                  searchType={nameof(productTypeFilter.name.contain)}
                />
              </FormItem>
            </Row>
          )}

          {validAction('singleListUnitOfMeasureGrouping') && (
            <Row>
              <FormItem
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.unitOfMeasureGrouping),
                )}
                help={product.errors?.unitOfMeasureGrouping}
              >
                <span className="label-input ml-3">
                  {translate('products.unitOfMeasureGrouping')}
                </span>
                <SelectAutoComplete
                  value={product.unitOfMeasureGrouping?.id}
                  onChange={handleChangeObjectField(
                    nameof(product.unitOfMeasureGrouping),
                  )}
                  placeholder={translate(
                    'products.placeholder.unitOfMeasureGrouping',
                  )}
                  getList={productRepository.singleListUnitOfMeasureGrouping}
                  modelFilter={unitOfMeasureGroupingFilter}
                  setModelFilter={setUnitOfMeasureGroupingFilter}
                  searchField={nameof(unitOfMeasureGroupingFilter.name)}
                  searchType={nameof(productTypeFilter.name.contain)}
                  disabled={product?.unitOfMeasureId ? false : true}
                  isReset={isReset}
                  setIsReset={setIsReset}
                />
              </FormItem>
            </Row>
          )}
          <Row>
            <FormItem>
              <span className="label-input ml-3">
                {translate('products.unitOfMeasureContent')}
              </span>
              <Input
                type="text"
                value={renderItems}
                disabled={true}
                className="form-control form-control-sm"
                placeholder={translate(
                  'products.placeholder.unitOfMeasureGroupingContents',
                )}
              />
            </FormItem>
          </Row>

          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.eRPCode),
              )}
              help={product.errors?.eRPCode}
            >
              <span className="label-input ml-3">
                {translate('products.eRPCode')}
              </span>
              <Input
                type="text"
                value={product.erpCode}
                className="form-control form-control-sm"
                onChange={handleChangeErpCode(nameof(product.erpCode))}
                placeholder={translate('products.placeholder.eRPCode')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.scanCode),
              )}
              help={product.errors?.scanCode}
            >
              <span className="label-input ml-3">
                {translate('products.scanCode')}
              </span>
              <Input
                type="text"
                value={product.scanCode}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.scanCode))}
                placeholder={translate('products.placeholder.scanCode')}
              />
            </FormItem>
          </Row>
          {validAction('singleListBrand') && (
            <Row>
              <FormItem>
                <span className="label-input ml-3">
                  {translate('products.brand')}
                </span>
                <SelectAutoComplete
                  value={product.brand?.id}
                  onChange={handleChangeObjectField(nameof(product.brand))}
                  placeholder={translate('products.placeholder.brand')}
                  getList={productRepository.singleListBrand}
                  modelFilter={brandFilter}
                  setModelFilter={setBrandFilter}
                  searchField={nameof(brandFilter.name)}
                  searchType={nameof(productTypeFilter.name.contain)}
                />
              </FormItem>
            </Row>
          )}
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.otherName),
              )}
              help={product.errors?.otherName}
            >
              <span className="label-input ml-3">
                {translate('products.otherName')}
              </span>
              <Input
                type="text"
                value={product.otherName}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(product.otherName))}
                placeholder={translate('products.placeholder.otherName')}
              />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              validateStatus={formService.getValidationStatus<Product>(
                product.errors,
                nameof(product.technicalName),
              )}
              help={product.errors?.technicalName}
            >
              <span className="label-input ml-3">
                {translate('products.technicalName')}
              </span>
              <Input
                type="text"
                value={product.technicalName}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(
                  nameof(product.technicalName),
                )}
                placeholder={translate('products.placeholder.technicalName')}
              />
            </FormItem>
          </Row>
          {/* // todo */}
          {validAction('singleListTaxType') && (
            <Row>
              <FormItem
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.taxType),
                )}
                help={product.errors?.taxType}
              >
                <span className="label-input ml-3">
                  {translate('products.taxType')}
                  <span className="text-danger">*</span>
                </span>
                <SelectAutoComplete
                  value={product.taxType?.id}
                  onChange={handleChangeObjectField(nameof(product.taxType))}
                  placeholder={translate('products.placeholder.taxType')}
                  getList={productRepository.singleListTaxType}
                  modelFilter={taxTypeFilter}
                  setModelFilter={setTaxTypeFilter}
                  searchField={nameof(taxTypeFilter.name)}
                  searchType={nameof(taxTypeFilter.name.contain)}
                />
              </FormItem>
            </Row>
          )}
          {id === 'create' && validAction('singleListUsedVariation') && (
            <Row>
              <Form.Item
                validateStatus={formService.getValidationStatus<Product>(
                  product.errors,
                  nameof(product.usedVariationId),
                )}
                help={product.errors?.usedVariationId}
              >
                <span className="label-input ml-3">
                  {translate('products.usedVariation')}
                </span>
                <SwitchStatus
                  checked={
                    product.usedVariationId === usedVariationList[1]?.id
                      ? true
                      : false
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(
                    nameof(product.usedVariation),
                  )}
                />
              </Form.Item>
            </Row>
          )}
        </Col>
        <Col lg={2}></Col>
        <Col lg={11}>
          <FormItem
            validateStatus={formService.getValidationStatus<Product>(
              product.errors,
              nameof(product.salePrice),
            )}
            help={product.errors?.salePrice}
            className="form-price"
          >
            <span className="label-input ">
              {translate('products.price')}
              {/* <span className="text-danger">*</span> */}
            </span>
            <InputNumber
              value={product.salePrice}
              onChange={handleChangeSimpleField(nameof(product.salePrice))}
              placeholder={translate(`products.placeholder.price`)}
            />
          </FormItem>

          {/* <FormItem
            validateStatus={formService.getValidationStatus<Product>(
              product.errors,
              nameof(product.retailPrice),
            )}
            help={product.errors?.retailPrice}
          >
            <span className="label-input ">
              {translate('products.retailPrice')}
            </span>
            <InputNumber
              value={product.retailPrice}
              placeholder={translate(`products.placeholder.retailPrice`)}
              onChange={handleChangeSimpleField(nameof(product.retailPrice))}
            />
          </FormItem> */}
          <FormItem className="mt-1">
            <span className="label-input">
              {translate('products.description')}
            </span>
            <TextArea
              rows={4}
              placeholder={translate(`products.placeholder.description`)}
              onChange={handleChangeSimpleField(nameof(product.description))}
              value={product.description}
            />
          </FormItem>
          <div className="product-grouping mb-3">
            <ProductProductGroupingMappingTable
              product={product}
              list={defaultProductProductGroupingMappingsList}
              modelFilter={productProductGroupingMappingsFilter}
              setModelFilter={setProductProductGroupingMappingsFilter}
              setProduct={setProduct}
              handleClose={handlePopupCancel}
              visible={visible}
              handleChangeTreePopup={handleChangeTreePopup}
              handleFocus={handleFocus}
              selectedItems={productGroupings}
              setSelectedItems={setProductGroupings}
            />
          </div>
        </Col>
        <Col lg={1}></Col>
      </Row>
      <div className="col-6"></div>
      {/* </div> */}
    </Form>
  );
}

export default ProductDetailGeneral;
