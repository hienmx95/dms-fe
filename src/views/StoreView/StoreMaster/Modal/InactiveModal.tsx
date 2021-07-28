import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import './Modal.scss';
import { AppUser } from 'models/AppUser';

export interface InActivedModalProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListAppUser?: (filter: TFilter) => Promise<T[]>;
  setListAppUser?: Dispatch<SetStateAction<T[]>>;
  currentItem?: AppUser;
  onClose?: (event) => void;
  onSave?: (event) => void;
  isDetail?: boolean;
}

export default function InactiveModal<
  T extends Model,
  TFilter extends ModelFilter
>(props: InActivedModalProps<T, TFilter>) {
  const { visible, currentItem, onSave } = props;
  const [translate] = useTranslation();

  // const [userStatusList] = crudService.useEnumList<Status>(
  //   appUserRepository.singleListStatus,
  // );

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );
  // console.log('userStatusList : ', userStatusList);
  return (
    <>
      <Modal
        className="form-modal-detail"
        isOpen={visible}
        toggle={handleCancel}
      >
        <ModalBody>
          <div className="title" style={{ marginLeft: 0 }}>
            {currentItem?.storeUser?.statusId === 1
              ? translate('appUsers.inactive.title')
              : translate('appUsers.active.title')}
          </div>
          <div>
            {currentItem?.storeUser?.statusId === 1
              ? translate('appUsers.inactive.content')
              : translate('appUsers.active.content')}
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(currentItem)}
            >
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
