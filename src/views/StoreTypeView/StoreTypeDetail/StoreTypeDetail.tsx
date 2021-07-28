import { Input, Select } from 'antd';
import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { API_STORE_TYPE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Color } from 'models/Color';
import { Status } from 'models/Status';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { storeTypeRepository } from 'views/StoreTypeView/StoreTypeRepository';
import './StoreTypeDetail.scss';

const { Item: FormItem } = Form;
const { Option } = Select;

export interface StoreGroupingDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListStore?: (filter: TFilter) => Promise<T[]>;
  setListStore?: Dispatch<SetStateAction<T[]>>;
  total?: number;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function StoreTypeDetail<T extends Model, TFilter extends ModelFilter>(
  props: StoreGroupingDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListStore,
    setListStore,
    setLoadList,
  } = props;

  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'store-type',
    API_STORE_TYPE_ROUTE,
  );

  // Hooks, useDetail, useChangeHandler
  const [storeType, setStoreType, , , handleSave] = crudService.usePopupDetail(
    StoreType,
    StoreTypeFilter,
    isDetail,
    currentItem,
    setVisible,
    storeTypeRepository.get,
    storeTypeRepository.save,
    getListStore,
    setListStore,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<StoreType>(storeType, setStoreType);
  const [statusList] = crudService.useEnumList<Status>(
    storeTypeRepository.singleListStatus,
  );
  const [colorDefaultList] = crudService.useEnumList<Color>(
    storeTypeRepository.singleListColor,
  );
  const [color, setColor] = React.useState<Color>(new Color());

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );
  const handleChangeColor = React.useCallback(
    event => {
      const colorId = event;
      setColor({
        ...color,
        id: colorId,
      });
      setStoreType({
        ...storeType,
        color,
        colorId,
      });
    },
    [color, setStoreType, storeType],
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
            ? translate('storeTypes.detail.title')
            : translate('storeTypes.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col>
              <FormItem
                className="mb-3"
                validateStatus={formService.getValidationStatus<StoreType>(
                  storeType.errors,
                  nameof(storeType.code),
                )}
                help={storeType.errors?.code}
              >
                <span className="label-input mr-3">
                  {translate('storeTypes.code')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={storeType.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeType.code))}
                  placeholder={translate('storeTypes.placeholder.code')}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem
                className="mb-3"
                validateStatus={formService.getValidationStatus<StoreType>(
                  storeType.errors,
                  nameof(storeType.name),
                )}
                help={storeType.errors?.name}
              >
                <span className="label-input mr-3">
                  {translate('storeTypes.name')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={storeType.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeType.name))}
                  placeholder={translate('storeTypes.placeholder.name')}
                />
              </FormItem>
            </Col>
            {validAction('singleListColor') && (
              <FormItem
                validateStatus={formService.getValidationStatus<StoreType>(
                  storeType.errors,
                  nameof(storeType.color),
                )}
                help={storeType.errors?.color}
              >
                <span className="label-input ml-3">
                  {translate('storeTypes.color')}
                </span>
                <Select
                  className="ml-1"
                  value={storeType?.colorId}
                  style={{ width: 290 }}
                  onChange={handleChangeColor}
                >
                  {colorDefaultList.map(item => {
                    return (
                      <Option value={item.id} key={item?.name}>
                        <div className=" form-color">
                          <div
                            className="color mr-4"
                            style={{
                              backgroundColor: `${item?.code}`,
                              border: `1px solid #e8e8e8`,
                            }}
                          />
                          <div>{item?.name}</div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            )}
            {validAction('singleListStatus') && (
              <Col>
                <FormItem className="mb-3">
                  <span className="label-input mr-3">
                    {translate('storeTypes.status')}:{' '}
                  </span>
                  <Switch
                    checked={
                      storeType.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(storeType.status))}
                  />
                </FormItem>
              </Col>
            )}
            <div className="d-flex justify-content-end mt-4 mr-3">
              {isDetail && validAction('update') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              {!isDetail && validAction('create') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
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
export default StoreTypeDetail;
