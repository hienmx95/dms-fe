import { Col, Input } from 'antd';
import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Status } from 'models/Status';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { storeGroupingRepository } from 'views/StoreGroupingTreeView/StoreGroupingRepository';
import './StoreGroupingDetail.scss';
import { API_STORE_GROUPING_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

export interface StoreGroupingDetailProps<T, TFilter> {
  isDetail?: boolean;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListStoreGrouping?: (filter: TFilter) => Promise<T[]>;
  setListStoreGrouping?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function StoreGroupingTreeDetail<T extends Model, TFilter extends ModelFilter>(
  props: StoreGroupingDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListStoreGrouping,
    setListStoreGrouping,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('store-grouping', API_STORE_GROUPING_ROUTE);
  // Service goback

  // Hooks, useDetail, useChangeHandler
  const [
    storeGrouping,
    setStoreGrouping,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    StoreGrouping,
    StoreGroupingFilter,
    isDetail,
    currentItem,
    setVisible,
    storeGroupingRepository.get,
    storeGroupingRepository.save,
    getListStoreGrouping,
    setListStoreGrouping,
    setLoadList,
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [statusList] = crudService.useEnumList<Status>(
    storeGroupingRepository.singleListStatus,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<StoreGrouping>(
    storeGrouping,
    setStoreGrouping,
  );

  React.useEffect(() => {
    const parentList: number[] = [storeGrouping.id];
    storeGroupingFilter.id.notIn = parentList;
    setStoreGroupingFilter(storeGroupingFilter);
  }, [storeGrouping.id, storeGroupingFilter]);

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
        <ModalHeader >
          {isDetail === false
            ? translate('storeGroupings.detail.title')
            : translate('storeGroupings.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form className="ml-2">
            <Col>
              <FormItem
                validateStatus={formService.getValidationStatus<StoreGrouping>(
                  storeGrouping.errors,
                  nameof(storeGrouping.code),
                )}
                help={storeGrouping.errors?.code}
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('storeGroupings.code')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={storeGrouping.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeGrouping.code))}
                  placeholder={translate('storeGroupings.placeholder.code')}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem
                validateStatus={formService.getValidationStatus<StoreGrouping>(
                  storeGrouping.errors,
                  nameof(storeGrouping.name),
                )}
                help={storeGrouping.errors?.name}
                className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('storeGroupings.name')}
                  <span className="text-danger">*</span>
                </span>
                <Input
                  type="text"
                  value={storeGrouping.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(storeGrouping.name))}
                  placeholder={translate('storeGroupings.placeholder.name')}
                />
              </FormItem>
            </Col>
            {validAction('singleListStatus') &&
              <Col>
                <FormItem className="mb-3">
                  <span className="label-input mr-3">
                    {translate('storeGroupings.isActive')}
                  </span>
                  <Switch
                    checked={
                      storeGrouping.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(storeGrouping.status),
                    )}
                  />
                </FormItem>
              </Col>
            }
            <div className="d-flex justify-content-end mt-4 ">
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

export default StoreGroupingTreeDetail;
