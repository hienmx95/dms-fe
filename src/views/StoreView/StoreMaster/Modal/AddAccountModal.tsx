import { Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import SwitchStatus from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { Status } from 'models/Status';
import { Store } from 'models/Store';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalHeader } from 'reactstrap';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { storeRepository } from 'views/StoreView/StoreRepository';
import './Modal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {
  model?: T;
  setModel?: Dispatch<SetStateAction<T>>;
  loading?: boolean;
  onSave?: (model: Store) => void;
  onClose?: () => void;
}

function AddAccountModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const { model, toggle, isOpen, onSave, onClose } = props;

  const [statusList] = crudService.useEnumList<Status>(
    storeRepository.filterListStatus,
  );

  const [accountStore, setAcocuntStore] = React.useState<Store>(new Store());
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (loading) {
      setAcocuntStore({
        ...accountStore,
        store: model?.store,
        storeId: model?.storeId,
      });
      if (model?.storeId) {
        setLoading(false);
      }
    }
  }, [loading, setAcocuntStore, accountStore, setLoading, model]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = React.useCallback(() => {
    if (typeof onSave === 'function') {
      onSave(accountStore);
    }
  }, [onSave, accountStore]);

  const handleChangeStatus = React.useCallback(
    (statusId, status) => {
      setAcocuntStore({
        ...accountStore,
        statusId,
        status,
      });
    },
    [setAcocuntStore, accountStore],
  );

  return (
    <ModalContent
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader>
        {translate('stores.account.title') + ` ${model?.displayName}`}
      </ModalHeader>
      <ModalBody>
        <Form className="page detail-page">
          <Row className="ml-2 mr-3">
            <FormItem>
              <span className="label-input ml-3">
                {translate('stores.name')}
                <span className="text-danger">*</span>
              </span>
              <input
                type="text"
                defaultValue={model?.displayName}
                className="form-control form-control-sm"
                disabled
              />
            </FormItem>
            <FormItem>
              <span className="label-input ml-3">
                {translate('stores.username')}
              </span>
              <input
                type="text"
                defaultValue={model?.username}
                className="form-control form-control-sm"
                disabled
              />
            </FormItem>
            <FormItem>
              <span className="label-input ml-3">
                {translate('stores.password')}
              </span>
              <input
                type="text"
                defaultValue={model?.password}
                className="form-control form-control-sm"
                disabled
              />
            </FormItem>
            <FormItem>
              <span className="label-input ml-3">
                {translate('stores.status')}
              </span>
              <SwitchStatus
                checked={
                  accountStore?.statusId === statusList[1]?.id ? true : false
                }
                list={statusList}
                onChange={handleChangeStatus}
              />
            </FormItem>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={handleClose}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
      ;
    </ModalContent>
  );
}

export default AddAccountModal;
