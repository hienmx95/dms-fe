import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Status } from 'models/Status';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { unitOfMeasureRepository } from 'views/UnitOfMeasureView/UnitOfMeasureRepository';
import './UnitOfMeasureDetail.scss';
import { Col } from 'antd/lib/grid';
import { Input } from 'antd';

const { Item: FormItem } = Form;

export interface UnitOfMeasureDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListUnitOfMeasure?: (filter: TFilter) => Promise<T[]>;
  setListUnitOfMeasure?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}


function UnitOfMeasureDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: UnitOfMeasureDetailProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListUnitOfMeasure,
    setListUnitOfMeasure,
    setLoadList,
  } = props;
  const [translate] = useTranslation();

  const [statusList] = crudService.useEnumList<Status>(
    unitOfMeasureRepository.singleListStatus,
  );

  // Hooks, useDetail, useChangeHandler
  const [
    unitOfMeasure,
    setUnitOfMeasure,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    UnitOfMeasure,
    UnitOfMeasureFilter,
    isDetail,
    currentItem,
    setVisible,
    unitOfMeasureRepository.get,
    unitOfMeasureRepository.save,
    getListUnitOfMeasure,
    setListUnitOfMeasure,
    setLoadList,
  );

  const [handleChangeSimpleField, handleChangeObjectField] = crudService.useChangeHandlers<
    UnitOfMeasure
  >(unitOfMeasure, setUnitOfMeasure);

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
        <ModalHeader>
          {isDetail === false
            ? translate('unitOfMeasures.detail.title')
            : translate('unitOfMeasures.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col className="ml-2">
              <FormItem
                className="mb-3"
                validateStatus={formService.getValidationStatus<UnitOfMeasure>(
                  unitOfMeasure.errors,
                  nameof(unitOfMeasure.code),
                )}
                help={unitOfMeasure.errors?.code}
              >
                <span className="label-input mr-3">
                  {translate('unitOfMeasures.code')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={unitOfMeasure.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(unitOfMeasure.code))}
                  placeholder={translate('unitOfMeasures.placeholder.code')}
                />
              </FormItem>

              <FormItem
                className="mb-3"
                validateStatus={formService.getValidationStatus<UnitOfMeasure>(
                  unitOfMeasure.errors,
                  nameof(unitOfMeasure.name),
                )}
                help={unitOfMeasure.errors?.name}
              >
                <span className="label-input mr-3">
                  {translate('unitOfMeasures.name')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={unitOfMeasure.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(unitOfMeasure.name))}
                  placeholder={translate('unitOfMeasures.placeholder.name')}
                />
              </FormItem>
              <FormItem
                className="mb-3">
                <span className="label-input mr-3">
                  {translate('unitOfMeasures.status')}
                </span>
                <Switch
                  checked={
                    // typeof unitOfMeasure.status?.id === 'number' &&
                    unitOfMeasure.statusId === statusList[1]?.id ? true : false
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(nameof(unitOfMeasure.status))}
                />
              </FormItem>
            </Col>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleCancel}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalBody>

      </Modal>
    </>
  );
}

export default UnitOfMeasureDetail;
