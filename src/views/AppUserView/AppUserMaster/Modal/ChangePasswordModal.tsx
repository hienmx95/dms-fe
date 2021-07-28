import { Col, Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import nameof from 'ts-nameof.macro';
import './Modal.scss';

export interface ChangePasswordModalProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListAppUser?: (filter: TFilter) => Promise<T[]>;
  setListAppUser?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  onSave?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

export default function ChangePasswordModal<
  T extends Model,
  TFilter extends ModelFilter
>(props: ChangePasswordModalProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListAppUser,
    setListAppUser,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const [formIsValid, setFormIsValid] = React.useState<boolean>(false);
  const [appUser, setAppUser, , , handleSave] = crudService.usePopupDetail(
    AppUser,
    AppUserFilter,
    isDetail,
    currentItem,
    setVisible,
    appUserRepository.get,
    appUserRepository.save,
    getListAppUser,
    setListAppUser,
    setLoadList,
  );

  const [handleChangeSimpleField] = crudService.useChangeHandlers<AppUser>(
    appUser,
    setAppUser,
  );

  const handleChangeConfirmPassword = React.useCallback(
    event => {
      const pass: string = event.target.value;
      if (pass === appUser.password) {
        setFormIsValid(true);
      }
    },
    [appUser.password],
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
        className="form-modal-detail"
        isOpen={visible}
        toggle={handleCancel}
      >
        <ModalBody>
          <div className="title">
            {translate('appUsers.changePassword.title')}: {appUser.username}
          </div>
          <Form>
            <Col>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('appUsers.changePassword.newPass')}
                </span>
                <Input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(appUser.password))}
                  placeholder={translate('appUsers.changePassword.newPass')}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('appUsers.changePassword.confirmPass')}
                </span>
                <Input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangeConfirmPassword}
                  placeholder={translate('appUsers.changePassword.confirmPass')}
                />
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSave}
                disabled={!formIsValid}
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
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
