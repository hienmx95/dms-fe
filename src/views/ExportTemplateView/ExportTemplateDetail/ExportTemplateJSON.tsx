import Form from 'antd/lib/form';
import { Col } from 'antd/lib/grid';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export interface ExportTemplateJSONProps<T> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  model?: string;
  onClose?: (event) => void;
  exportTemplate?: T;
  loading?: boolean;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

function ExportTemplateJSON<T extends Model>(
  props: ExportTemplateJSONProps<T>,
) {
  const {
    visible,
    setVisible,
    model,
    exportTemplate,
    loading,
    setLoading,
  } = props;
  const [translate] = useTranslation();

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  React.useEffect(() => {
    if (loading && document.getElementById('json')) {
      document.getElementById('json').textContent = model;
      setLoading(false);
    }
  }, [loading, model, setLoading]);

  return (
    <>
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader>
          {translate('exportTemplates.detail.edit', exportTemplate?.name)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Col className="ml-2">
              <pre id="json"></pre>
            </Col>
          </Form>
          <div className="d-flex justify-content-end mt-4">
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

export default ExportTemplateJSON;
