import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import InputString from 'components/Input/Input';
import InputNumber from 'components/InputNumber/InputNumber';
import Switch from 'components/Switch/Switch';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { Image } from 'models/Image';
import { Item } from 'models/Item';
import { ItemImageMapping } from 'models/ItemImageMapping';
import { Product } from 'models/Product';
import { Status } from 'models/Status';
import { VariationGrouping } from 'models/VariationGrouping';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import InputTag from 'views/ProductView/ProductDetail/PriceAndVariations/InputTag';
import { productService } from 'views/ProductView/ProductDetail/ProductService';
import { productRepository } from 'views/ProductView/ProductRepository';
import './PriceAndVariations.scss';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ChangePriceProductHistoryModal from './ChangePriceProductHistoryModal/ChangePriceProductHistoryModal';
import { Input, Tooltip } from 'antd';

const { Item: FormItem } = Form;

export interface PriceAndVariations {
  product: Product;

  setProduct: Dispatch<SetStateAction<Product>>;
}

function PriceAndVariations(props: PriceAndVariations) {
  const [translate] = useTranslation();

  const { product, setProduct } = props;
  const [loading, setLoading] = React.useState<boolean>(false);

  const [items, setItems] = crudService.useContentTable<Product, Item>(
    product,
    setProduct,
    nameof(product.items),
  );
  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const [visibleHistory, setVisibleHistory] = React.useState<boolean>(false);

  const handleViewHistory = React.useCallback(
    (product: Product) => {
      setVisibleHistory(true);
      setCurrentItem(product);
    },
    [setCurrentItem],
  );

  const handleClose = React.useCallback(() => {
    setVisibleHistory(false);
  }, [setVisibleHistory]);

  const [
    // retailPrice,
    // setRetailPrice,
    // price,
    // setPrice,
    handleAddVariation,
    addable,
    handleChangeVariationGroupingName,
    ,
    combine,
    setCombine,
  ] = productService.usePrice(product, setProduct);

  const [
    visible,
    visibleErrorCode,
    currentVariation,
    currentVariationGrouping,
    handleOpenModal,
    handleCloseModal,
    handleUpdateVariationGrouping,
    handleChangeCurrentVariation,
    getDisplayValue,
    handleCombine,
    handleRemoveVariation,
    handleDeleteItem,
    handleRemoveVariationGrouping,
  ] = productService.useVariationGrouping(
    product,
    setProduct,
    productRepository.save,
    items,
    setItems,
    product.salePrice,
    product.retailPrice,
    setLoading,
    setCombine,
  );

  const [statusList] = crudService.useEnumList<Status>(
    productRepository.singleListStatus,
  );

  const [
    handleChangeListSimpleField,
    handleChangeListObjectField,
  ] = crudService.useListChangeHandlers<Item>(items, setItems);

  const columns: ColumnProps<Item>[] = React.useMemo(() => {
    return [
      {
        title: translate('items.status'),
        key: nameof(product.items[0].key),
        dataIndex: nameof(product.items[0].status),
        align: 'center',
        width: 150,
        render(...[, item, index]) {
          return (
            <>
              {statusList.length > 0 && (
                <Switch
                  checked={item.statusId === statusList[1]?.id ? true : false}
                  list={statusList}
                  onChange={handleChangeListObjectField(
                    nameof(item.status),
                    index,
                  )}
                />
              )}
            </>
          );
        },
      },
      {
        title: translate('items.name'),
        key: nameof(product.items[0].name),
        dataIndex: nameof(product.items[0].name),
        render(...[, item]) {
          return item?.name;
        },
      },
      {
        title: translate('items.code'),
        key: nameof(product.items[0].code),
        dataIndex: nameof(product.items[0].code),
        render(...[, item]) {
          return item?.code;
        },
      },
      {
        title: translate('items.scanCode'),
        key: nameof(product.items[0].scanCode),
        dataIndex: nameof(product.items[0].scanCode),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.scanCode),
              )}
              help={item.errors?.scanCode}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(item.scanCode)}
                value={item.scanCode}
                onChange={handleChangeListSimpleField(
                  nameof(item.scanCode),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.eRPCode'),
        key: nameof(product.items[0].eRPCode),
        dataIndex: nameof(product.items[0].eRPCode),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.eRPCode),
              )}
              help={item.errors?.eRPCode}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(item.eRPCode)}
                value={item.eRPCode}
                onChange={handleChangeListSimpleField(
                  nameof(item.eRPCode),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.price'),
        key: nameof(product.items[0].salePrice),
        dataIndex: nameof(product.items[0].salePrice),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.salePrice),
              )}
              help={item.errors?.salePrice}
              className="form-sale-price"
            >
              <InputNumber
                className="form-control form-control-sm"
                value={item.salePrice}
                onChange={handleChangeListSimpleField(
                  nameof(item.salePrice),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('items.retailPrice'),
        key: nameof(product.items[0].retailPrice),
        dataIndex: nameof(product.items[0].retailPrice),
        render(...[, item, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Item>(
                item.errors,
                nameof(item.retailPrice),
              )}
              help={item.errors?.retailPrice}
            >
              <InputNumber
                className="form-control form-control-sm"
                value={item.retailPrice}
                onChange={handleChangeListSimpleField(
                  nameof(item.retailPrice),
                  index,
                )}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [Item, Item, number]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Tooltip title={translate(generalLanguageKeys.actions.history)}>
                <button
                  className="btn btn-link btn-action"
                  onClick={() => handleViewHistory(params[1])}
                >
                  <i className="tio-history" />
                </button>
              </Tooltip>
              {!params[1].used && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-link btn-action"
                    onClick={handleDeleteItem(params[2])}
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
  }, [
    handleChangeListObjectField,
    handleChangeListSimpleField,
    handleDeleteItem,
    handleViewHistory,
    product.items,
    statusList,
    translate,
  ]);

  const handleChangeImages = React.useCallback(
    index => {
      return (images: Image[]) => {
        const itemImageMappings = [];
        if (images && images.length > 0) {
          images.forEach(image => {
            itemImageMappings.push({
              image,
              imageId: image.id,
              itemId: items[index].id,
            });
          });
        }
        items[index] = {
          ...items[index],
          itemImageMappings,
          images,
        };
        setItems(items);
      };
    },
    [items, setItems],
  );

  const imageTableColumns: ColumnProps<any>[] = React.useMemo(() => {
    return [
      {
        title: translate('items.name'),
        key: nameof(product.items[0].name),
        dataIndex: nameof(product.items[0].name),
        width: 250,
        render(...[, item]) {
          return item?.name;
        },
      },
      {
        title: translate('items.images'),
        key: nameof(product.items[0].images),
        dataIndex: nameof(product.items[0].images),
        render(...[, item, index]) {
          const images = [];
          if (item?.itemImageMappings && item?.itemImageMappings.length > 0) {
            item?.itemImageMappings.map(
              (itemImageMapping: ItemImageMapping) => {
                return images.push(itemImageMapping.image);
              },
            );
          }
          return (
            <ImageUpload
              defaultItems={images}
              limit={15}
              aspectRatio={1}
              onUpload={productRepository.saveItemImage}
              onChange={handleChangeImages(index)}
            />
          );
        },
      },
    ];
  }, [handleChangeImages, product.items, translate]);

  return (
    <div className="price-and-variations pl-3 ">
      <Modal
        isOpen={visible}
        toggle={handleCloseModal}
        className="form-modal-detail"
      >
        <ModalHeader className=" mb-2 header-popup">
          {translate('variations.add')}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormItem className="mb-3 mt-4">
              <span className="label-input ml-3">
                {translate('variations.code')}
              </span>
              <Input
                value={currentVariation?.code}
                onChange={handleChangeCurrentVariation(
                  nameof(currentVariationGrouping.code),
                )}
              />
            </FormItem>
            {visibleErrorCode === true && (
              <div className="error-name">{translate('variations.error')}</div>
            )}
            <FormItem className="mb-3">
              <span className="label-input ml-3">
                {translate('variations.name')}
              </span>
              <Input
                value={currentVariation?.name}
                onChange={handleChangeCurrentVariation(
                  nameof(currentVariationGrouping.name),
                )}
              />
            </FormItem>
          </Form>
          <div className="d-flex justify-content-end mt-4 ">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleUpdateVariationGrouping}
              disabled={visibleErrorCode || !currentVariation?.code}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleCloseModal}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Row>
        <Col>
          {product?.variationGroupings &&
            product?.variationGroupings.length > 0 && (
              <ul className="variations ml-3">
                {product?.variationGroupings.map(
                  (variationGrouping: VariationGrouping, index: number) => {
                    return (
                      <li
                        className="ant-row ant-form-item variation"
                        key={index}
                      >
                        <div className="name">
                          <span className="label ml-1">
                            {translate('products.variationGrouping')}
                          </span>
                          <InputString
                            className="flex-grow-1"
                            value={variationGrouping.name}
                            onChange={handleChangeVariationGroupingName(index)}
                          />
                        </div>
                        <div className="value">
                          <span className="label">
                            {translate('products.variationValue')}
                          </span>
                          <InputTag
                            // max={4}
                            value={getDisplayValue(index)}
                            onClick={handleOpenModal(index)}
                            onRemoveVariationGrouping={handleRemoveVariationGrouping(
                              index,
                            )}
                            onRemoveVariation={handleRemoveVariation(index)}
                          />
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            )}
          <div className="btn-add">
            {addable && (
              <button
                className="btn btn-sm btn-primary mt-3"
                onClick={handleAddVariation}
              >
                <img
                  className="btn-icon mr-2 mb-1"
                  src="/dms/assets/icons/baseline-add-24px.svg"
                  alt=""
                />
                {translate('products.addVariation')}
              </button>
            )}
          </div>
          <div className="d-flex justify-content-start btn-add">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleCombine}
              disabled={combine ? false : true}
            >
              <img
                className="btn-icon mr-2  mb-1"
                src="/dms/assets/icons/baseline-history-24px.svg"
                alt=""
              />
              {translate('products.createVariations')}
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <FormItem
            validateStatus={formService.getValidationStatus<Product>(
              product.errors,
              nameof(product.variationGroupings),
            )}
            help={product.errors?.variationGroupings}
            className="table-error"
          ></FormItem>
          <Table
            tableLayout="fixed"
            columns={columns}
            dataSource={items}
            pagination={false}
            rowKey={nameof(items[0].key)}
            loading={loading}
            className="table-variation"
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Table
            tableLayout="fixed"
            columns={imageTableColumns}
            dataSource={product.items}
            pagination={false}
            rowKey={nameof(product.items[0].key)}
            className="table-variation"
          />
        </Col>
      </Row>

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
    </div>
  );
}

export default PriceAndVariations;
