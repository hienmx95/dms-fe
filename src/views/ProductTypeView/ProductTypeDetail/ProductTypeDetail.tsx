import Form from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { productTypeRepository } from 'views/ProductTypeView/ProductTypeRepository';
import './ProductTypeDetail.scss';
import { API_PRODUCT_TYPE_ROUTE } from 'config/api-consts';
import { Input } from 'antd';
export interface ProductTypeDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListProductType?: (filter: TFilter) => Promise<T[]>;
  setListProductType?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function ProductTypeDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: ProductTypeDetailProps<T, TFilter>) {

  const { validAction } = crudService.useAction(
    'product-type',
    API_PRODUCT_TYPE_ROUTE,
    'mdm',
  );

  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListProductType,
    setListProductType,
    setLoadList,
  } = props;

  const [translate] = useTranslation();

  const [
    productType,
    setProductType,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    ProductType,
    ProductTypeFilter,
    isDetail,
    currentItem,
    setVisible,
    productTypeRepository.get,
    productTypeRepository.save,
    getListProductType,
    setListProductType,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ProductType>(
    productType,
    setProductType,
  );

  const [statusList] = crudService.useEnumList<Status>(
    productTypeRepository.singleListStatus,
  );

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  return (
    <>
      <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
        <ModalHeader className="title-header-popup">
          {isDetail === false
            ? translate('productTypes.detail.addNode')
            : translate('productTypes.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form >
            <Col>
              <FormItem className="mb-3"
                validateStatus={formService.getValidationStatus<ProductType>(
                  productType.errors,
                  nameof(productType.code),
                )}
                help={productType.errors?.code}
              >
                <span className="label-input mr-3">
                  {translate('productTypes.code')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={productType.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(productType.code))}
                  placeholder={translate('productTypes.placeholder.code')}
                />
              </FormItem>
              <FormItem className="mb-3"
                validateStatus={formService.getValidationStatus<ProductType>(
                  productType.errors,
                  nameof(productType.name),
                )}
                help={productType.errors?.name}
              >
                <span className="label-input mr-3">
                  {translate('productTypes.name')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={productType.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(productType.name))}
                  placeholder={translate('productTypes.placeholder.name')}
                />
              </FormItem>
              <FormItem className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('productTypes.status')}
                </span>
                {validAction('singleListStatus') && (
                  <Switch
                    checked={
                      // typeof productType.status?.id === 'number' &&
                      productType.statusId === statusList[1]?.id
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(productType.status))}
                  />
                )}
              </FormItem>
              <FormItem
                help={productType.errors?.description}
              >
                <span className="label-input mr-3">
                  {translate('productTypes.description')}
                </span>
                <Input
                  type="text"
                  value={productType.description}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(
                    nameof(productType.description),
                  )}
                  placeholder={translate('productTypes.placeholder.description')}
                />
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">
              {!isDetail && validAction('create') && <button
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>}

              {isDetail && validAction('update') && <button
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>}
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Form>
        </ModalBody>

      </Modal>
    </>
  );
}

export default ProductTypeDetail;
