import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps } from 'antd/lib/table';
import { formatDateTime } from 'core/helpers/date-time';
import { Model } from 'core/models';
import { AppUser } from 'models/AppUser';
import { InventoryHistory } from 'models/InventoryHistory';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  list?: T[];

  pagination?: PaginationConfig;

  isSave?: boolean;

  currentItem?: InventoryHistory;

  isOpen?: boolean;

  handleClose?: () => void;

}

function HistoryModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    handleClose,
    list,
  } = props;
  const columns: ColumnProps<InventoryHistory>[] = React.useMemo(() => {
    return [
      {
        title: translate('directSalesOrders.history.role'),
        key: nameof(list[0].workflowStep),
        dataIndex: nameof(list[0].workflowStep),
        render(...[workflowStep]) {
          return workflowStep?.role?.name;
        },
      },
      {
        title: translate('directSalesOrders.history.appUser'),
        key: nameof(list[0].appUser),
        dataIndex: nameof(list[0].appUser),
        render(appUser: AppUser, content) {
          return (
            <>
              {
                content?.workflowState && (content.workflowState.code === 'APPROVED' || content.workflowState.code === 'REJECTED') && (
                  <>{appUser.username} - {appUser.displayName}</>
                )
              }
              {
                content?.workflowState && content.workflowState.code === 'PENDING' && (
                  <>{
                    content.nextApprovers && content.nextApprovers.length > 0 && content.nextApprovers.map((nextApprover: AppUser) => (
                      <>{nextApprover.username} - {nextApprover.displayName}</>
                    ))
                  }
                  </>
                )
              }

            </>
          );
        },
      },
      {
        title: translate('directSalesOrders.history.workflowState'),
        key: nameof(list[0].workflowState),
        dataIndex: nameof(list[0].workflowState),
        render(...[workflowState]) {
          return workflowState?.name;
        },
      },
      {
        title: translate('directSalesOrders.history.updateTime'),
        key: nameof(list[0].updatedAt),
        dataIndex: nameof(list[0].updatedAt),
        render(...[updatedAt]) {
          return formatDateTime(updatedAt);
        },
      },
    ];
  }, [list, translate]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
      className="modal-content-org"
    >
      <div className="d-flex justify-content-between modal-header">
        <h5 className="d-flex align-items-center">{title}</h5>
        <button
          className="btn btn-outline-primary d-flex align-items-center "
          onClick={handleClose}
        >
          <i className="fa mr-2 fa-times-circle" />
          {translate('general.actions.close')}
        </button>
      </div>
      <ModalBody>
        <Table
          key={uuidv4()}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          rowKey={nameof(list[0].workflowStepId)}
          pagination={false}
        />
      </ModalBody>
    </Modal>
  );
}

export default HistoryModal;
