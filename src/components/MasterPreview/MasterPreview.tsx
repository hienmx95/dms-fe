import classNames from 'classnames';
import { translate } from 'core/helpers/internationalization';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import './MasterPreview.scss';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';

export interface MasterPreviewProps extends ModalProps {
  children?: any;

  title?: string;

  code?: string;

  statusId?: number;

  className?: string;

  onClose?(): void;
}

function MasterPreview(props: MasterPreviewProps) {
  const [translate] = useTranslation();
  const {
    title,
    children,
    code,
    statusId,
    className,
    onClose,
    ...restProps
  } = props;

  return (
    <Modal
      {...restProps}
      className={classNames('master-preview', className)}
      unmountOnClose={true}
    >
      <div className="d-flex justify-content-between modal-header">
        <Tooltip title={title}>
          <h5 className="d-flex align-items-center">
            {limitWord(title, 50)}
          </h5>
        </Tooltip>
        <button
          className="btn btn-outline-primary d-flex align-items-center "
          onClick={onClose}
        >
          <i className="fa mr-2 fa-times-circle" />
          {translate('general.actions.close')}
        </button>
      </div>
      {code !== undefined && (
        <div className="d-flex justify-content-start">
          <span className="code">{code}</span>
          {statusId !== undefined && (
            <div className={statusId === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle ml-2 "></i>
            </div>
          )}
        </div>
      )}
      <ModalBody>{children}</ModalBody>
      {/* <ModalFooter>
        <button className="btn btn-primary" onClick={onClose}>
          {translate('general.actions.close')}
        </button>
      </ModalFooter> */}
    </Modal>
  );
}

MasterPreview.defaultProps = {
  title: translate('general.master.defaultPreviewTitle'),
};

export default MasterPreview;
