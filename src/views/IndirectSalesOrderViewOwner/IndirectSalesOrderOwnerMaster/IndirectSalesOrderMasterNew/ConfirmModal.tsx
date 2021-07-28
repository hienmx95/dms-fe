import { Row } from 'antd';
import { generalLanguageKeys } from 'config/consts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalHeader } from 'reactstrap';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import './IndirectSalesOrderMasterTab.scss';

export interface ContentModalProps extends ModalProps {
  selectedRowKeys: number[] | string[];
  onBulkApproved?: (selectedRowKeys: number[] | string[]) => void;
  onBulkReject?: (selectedRowKeys: number[] | string[]) => void;
}

function ConfirmModal(props: ContentModalProps) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    setOpen,
    selectedRowKeys,
    onBulkApproved,
    onBulkReject,
  } = props;

  const handleChangeToggle = React.useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);


  return (
    <Modal
      size="xs"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
      className="modal-cofirm-approved"
    >
      <ModalHeader toggle={handleChangeToggle} />
      <ModalBody>
        <Row>{translate('indirectSalesOrders.confirm')}</Row>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mr-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onBulkApproved(selectedRowKeys)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.approve)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => onBulkReject(selectedRowKeys)}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.reject)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ConfirmModal;
