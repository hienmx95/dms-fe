import Form from 'antd/lib/form';
import { generalLanguageKeys } from 'config/consts';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import './ImportErrorModal.scss';
export interface ImportErrorModalProps {
  errModel: string;
  errVisible: boolean;
  setErrVisible?: Dispatch<SetStateAction<boolean>>;
}

export default function ImportErrorModal(props: ImportErrorModalProps) {
  const { errModel, errVisible, setErrVisible } = props;

  const [translate] = useTranslation();

  const handleCancel = React.useCallback(() => {
    setErrVisible(false);
  }, [setErrVisible]);
  return (
    <>
      <Modal
        isOpen={errVisible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader className="header-popup">
          {translate('general.detail.errorImport')}
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="div-scroll">
              {typeof errModel !== 'undefined' &&
                errModel.split('\n').map(err => (
                  <div className="mt-3 mb-3 pl-2" key={err}>
                    {err}
                  </div>
                ))}
            </div>

            <div className="d-flex justify-content-end mt-4 mr-3">
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
