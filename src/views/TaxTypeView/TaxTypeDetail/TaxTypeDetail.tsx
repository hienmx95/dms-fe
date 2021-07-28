import { Col, Input, Row } from 'antd';
import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import './TaxTypeDetail.scss';
import { taxTypeRepository } from 'views/TaxTypeView/TaxTypeRepository';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import InputNumber from 'components/InputNumber/InputNumber';

const { Item: FormItem } = Form;
export interface TaxTypeDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListTaxType?: (filter: TFilter) => Promise<T[]>;
  setListTaxType?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function TaxTypeDetail<T extends Model, TFilter extends ModelFilter>(
  props: TaxTypeDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListTaxType,
    setListTaxType,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const [statusList] = crudService.useEnumList<Status>(
    taxTypeRepository.singleListStatus,
  );
  // Hooks, useDetail, useChangeHandler
  const [taxType, setTaxType, , , handleSave] = crudService.usePopupDetail(
    TaxType,
    TaxTypeFilter,
    isDetail,
    currentItem,
    setVisible,
    taxTypeRepository.get,
    taxTypeRepository.save,
    getListTaxType,
    setListTaxType,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<TaxType>(taxType, setTaxType);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

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
        <ModalHeader>
          {isDetail === false
            ? translate('taxTypes.detail.title')
            : translate('taxTypes.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form className="ml-2">
            <Row>
              <Col>
                <FormItem
                  validateStatus={formService.getValidationStatus<TaxType>(
                    taxType.errors,
                    nameof(taxType.code),
                  )}
                  help={taxType.errors?.code}
                  className="mb-3"
                >
                  <span className="label-input mr-3">
                    {translate('taxTypes.code')}
                    <span className="text-danger"> *</span>
                  </span>
                  <Input
                    type="text"
                    value={taxType.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(taxType.code))}
                    placeholder={translate('taxTypes.placeholder.code')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<TaxType>(
                    taxType.errors,
                    nameof(taxType.name),
                  )}
                  help={taxType.errors?.name}
                >
                  <span className="label-input mr-3">
                    {translate('taxTypes.name')}
                    <span className="text-danger"> *</span>
                  </span>
                  <Input
                    type="text"
                    value={taxType.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(taxType.name))}
                    placeholder={translate('taxTypes.placeholder.name')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<TaxType>(
                    taxType.errors,
                    nameof(taxType.percentage),
                  )}
                  help={taxType.errors?.percentage}
                >
                  <span className="label-input mr-3">
                    {translate('taxTypes.percentage')}
                    <span className="text-danger"> *</span>
                  </span>
                  <InputNumber
                    value={taxType.percentage}
                    className="form-control form-control-sm sub-total"
                    onChange={handleChangeSimpleField(
                      nameof(taxType.percentage),
                    )}
                    placeholder={translate('taxTypes.placeholder.percentage')}
                  />
                  {/* <Input
                    type="text"
                    defaultValue={taxType.percentage}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(taxType.percentage))}
                    placeholder={translate('taxTypes.placeholder.percentage')}
                  /> */}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  validateStatus={formService.getValidationStatus<TaxType>(
                    taxType.errors,
                    nameof(taxType.status),
                  )}
                  help={taxType.errors?.status}
                >
                  <span className="label-input mr-3">
                    {translate('taxTypes.status')}
                  </span>
                  <Switch
                    checked={taxType.statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(taxType.status))}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <div className="d-flex justify-content-end mt-4 ">
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
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default TaxTypeDetail;
