import { Col, Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { Store } from 'models/Store';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import './Modal.scss';

export interface ChangePasswordModalProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListStore?: (filter: TFilter) => Promise<T[]>;
  setListStore?: Dispatch<SetStateAction<T[]>>;
  currentItem?: Store;
  setCurrentItem: Dispatch<SetStateAction<Store>>;
  onClose?: (event) => void;
  onSave?: (event) => void;
}

export default function ChangePasswordModal<
  T extends Model,
  TFilter extends ModelFilter
>(props: ChangePasswordModalProps<T, TFilter>) {
  const {
    currentItem,
    visible,
    // setVisible,
    // getListStore,
    // setListStore,
    setCurrentItem,
    onSave,
  } = props;
  const [translate] = useTranslation();
  const [pass, setPass] = React.useState<string>('');
  const [cfPass, setCfPass] = React.useState<string>('');
  const [errorVisible, setErrorVisible] = React.useState<boolean>(false);
  const [errorName, setErrorName] = React.useState<string>('');
  const [currentStoreUser, setCurrentStoreUser] = React.useState<User>(
    new User(),
  );

  const handleChangePassword = React.useCallback(
    event => {
      const newPass: string = event.target.value;
      setPass(newPass);
      setErrorVisible(false);
    },
    [setPass],
  );
  const handleChangeConfirmPassword = React.useCallback(
    event => {
      const newPass: string = event.target.value;
      setCfPass(newPass);
      setErrorVisible(false);
    },
    [setCfPass],
  );

  const SaveNewPassword = React.useCallback(
    ({ pass, cfPass, onSave }) => {
      if (pass === '') {
        setErrorVisible(true);
        setErrorName(translate('stores.changePassword.notHavePassword'));
      } else if (cfPass === '') {
        setErrorVisible(true);
        setErrorName(translate('stores.changePassword.notHaveREPassword'));
      } else if (pass !== cfPass) {
        setErrorVisible(true);
        setErrorName(translate('stores.changePassword.passWordNotSame'));
      } else if (pass === cfPass) {
        currentItem.newPassword = pass;
        currentStoreUser.newPassword = pass;
        currentStoreUser.id = currentItem?.storeUserId;
        setCurrentStoreUser(currentStoreUser);
        setCurrentItem(currentItem);
        onSave(currentStoreUser);
      }
    },
    [currentItem, setCurrentItem, translate, currentStoreUser],
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
            {translate('stores.changePassword.title')}: {currentItem.username}
          </div>
          <Form>
            <Col>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('stores.changePassword.newPass')}
                </span>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangePassword}
                  placeholder={translate('stores.changePassword.newPass')}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('stores.changePassword.confirmPass')}
                </span>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangeConfirmPassword}
                  placeholder={translate('stores.changePassword.confirmPass')}
                />
              </FormItem>
              {errorVisible === true ? (
                <div className="text-danger mt-2">{errorName}</div>
              ) : (
                <br />
              )}
            </Col>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => SaveNewPassword({ pass, cfPass, onSave })}
                // disabled={!formIsValid}
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

export class User extends Model {
  id?: number;
  newPassword?: string;
}
