import React, { Dispatch, SetStateAction } from 'react';
import { Modal, ModalHeader, ModalBody, Col } from 'reactstrap';
import { Model, ModelFilter } from 'core/models';
import Form from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { Status } from 'models/Status';
import nameof from 'ts-nameof.macro';
import { brandRepository } from 'views/BrandView/BrandRepository';
import './BrandDetail.scss';
import { API_BRAND_ROUTE } from 'config/api-consts';
import { Input } from 'antd';
export interface BrandDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListBrand?: (filter: TFilter) => Promise<T[]>;
  setListBrand?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function BrandDetail<T extends Model, TFilter extends ModelFilter>(
  props: BrandDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListBrand,
    setListBrand,
    setLoadList,
  } = props;

  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('brand', API_BRAND_ROUTE, 'mdm');

  const [brand, setBrand, , , handleSave] = crudService.usePopupDetail(
    Brand,
    BrandFilter,
    isDetail,
    currentItem,
    setVisible,
    brandRepository.get,
    brandRepository.save,
    getListBrand,
    setListBrand,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Brand>(brand, setBrand);

  const [statusList] = crudService.useEnumList<Status>(
    brandRepository.singleListStatus,
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
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader className="header-popup">
          {isDetail === false
            ? translate('brands.detail.addNode')
            : translate('brands.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col>
              <FormItem
                validateStatus={formService.getValidationStatus<Brand>(
                  brand.errors,
                  nameof(brand.code),
                )}
                help={brand.errors?.code}
                className="mb-3">
                <span className="label-input mr-3">
                  {translate('brands.code')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={brand.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(brand.code))}
                  placeholder={translate('brands.placeholder.code')}
                />
              </FormItem>
              <FormItem
                validateStatus={formService.getValidationStatus<Brand>(
                  brand.errors,
                  nameof(brand.name),
                )}
                help={brand.errors?.name}
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('brands.name')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={brand.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(brand.name))}
                  placeholder={translate('brands.placeholder.name')}
                />
              </FormItem>
              <FormItem className="mb-3">
                <span className="label-input mr-3">
                  {translate('brands.status')}
                </span>
                <Switch
                  checked={
                    // typeof brand.status?.id === 'number' &&
                    brand.statusId === statusList[1]?.id
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(nameof(brand.status))}
                />
              </FormItem>
              <FormItem className="mb-3">
                <span className="label-input mr-3">
                  {translate('brands.description')}
                </span>
                <Input
                  type="text"
                  value={brand.description}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(brand.description))}
                  placeholder={translate('brands.placeholder.description')}
                />
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">

              {isDetail && validAction('update') &&
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
              {!isDetail && validAction('create') &&
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
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

export default BrandDetail;
