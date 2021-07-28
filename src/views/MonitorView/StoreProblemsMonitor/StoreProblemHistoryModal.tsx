import Card from 'antd/lib/card';
import { Col, Row } from 'antd/lib/grid';
import Table from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import {
  StoreProblemsHistoryMonitor,
  StoreProblemsHistoryMonitorFilter,
} from 'models/monitor/StoreProblemsMonitor';
import React, {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { storeProblemsRepository } from './StoreProblemsRepository';
import { tableService } from 'services';
export interface StoreProblemHistoryModalProps extends ModalProps {
  isOpen: boolean;
  modelId?: number;
  onClose?: () => void;
  loadList: boolean;
  setLoadList: Dispatch<SetStateAction<boolean>>;
}

function StoreProblemHistoryModal(props: StoreProblemHistoryModalProps) {
  const [translate] = useTranslation();
  const { modelId, toggle, isOpen, onClose, loadList, setLoadList } = props;
  const {
    filter,
    setFilter,
    list,
    loading,
    handleFilter,
    total,
    handleSearch,
    handleClose,
  } = useStoreProblemHistoryMaster(
    modelId,
    storeProblemsRepository.listProblemHistory,
    storeProblemsRepository.countProblemHistory,
    loadList,
    setLoadList,
    onClose,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const columns = React.useMemo(() => {
    return [
      {
        title: translate('storeProblemMonitors.historyList.time'),
        key: nameof(list[0].time),
        dataIndex: nameof(list[0].time),
        width: generalColumnWidths.actions,
        render(...[time]) {
          return <div className="text-left">{formatDateTime(time)}</div>;
        },
      },
      {
        title: translate('storeProblemMonitors.historyList.modifier'),
        key: nameof(list[0].modifier),
        dataIndex: nameof(list[0].modifier),
        width: generalColumnWidths.actions,
        render(...[modifier]) {
          return <div className="text-left">{modifier.displayName}</div>;
        },
      },
      {
        title: translate('storeProblemMonitors.historyList.problemStatus'),
        key: nameof(list[0].problemStatus),
        dataIndex: nameof(list[0].problemStatus),
        width: generalColumnWidths.actions,
        render(...[problemStatus]) {
          return <div className="text-left">{problemStatus.name}</div>;
        },
      },
    ];
  }, [list, translate]);
  return (
    <Modal size="m" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
      <ModalBody>
        <Card
          title={
            <>
              {translate('permissions.detail.title')}
              <button
                className="btn btn-sm btn-outline-primary float-right "
                onClick={handleClose}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </>
          }
        >
          <Row>
            <Col>
              <AdvancedDateFilter
                filter={filter.time}
                filterType={nameof(filter.time.greaterEqual)}
                onChange={handleFilter(nameof(filter.time))}
                className="w-100 mb-3"
                placeholder={translate('banners.placeholder.createAt')}
              />
            </Col>
          </Row>
          <Row>
            <Table
              dataSource={list}
              pagination={pagination}
              onChange={handleTableChange}
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(list[0].id)}
              columns={columns}
            />
          </Row>
        </Card>
      </ModalBody>
    </Modal>
  );
}

function useStoreProblemHistoryMaster(
  modelId: number,
  getList: (
    filter: StoreProblemsHistoryMonitorFilter,
  ) => Promise<StoreProblemsHistoryMonitor[]>,
  count: (filter: StoreProblemsHistoryMonitorFilter) => Promise<number>,
  loadList: boolean,
  setLoadList: Dispatch<SetStateAction<boolean>>,
  onClose: () => void,
) {
  const [filter, setFilter] = useState<StoreProblemsHistoryMonitorFilter>({
    ...new StoreProblemsHistoryMonitorFilter(),
    problemId: { equal: modelId },
  });
  const [list, setList] = useState<StoreProblemsHistoryMonitor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loadList) {
      const initialFilter = { ...filter, problemId: { equal: modelId } };
      const isCanceled = false;
      const fetch = async () => {
        const list: StoreProblemsHistoryMonitor[] = await getList(
          initialFilter,
        );
        const total: number = await count(initialFilter);
        if (!isCanceled) {
          await setList([...list]);
          await setTotal(total);
          await setLoadList(false);
        }
      };
      fetch();
    }
  }, [count, filter, getList, loadList, modelId, setLoadList]);

  const handleFilter = useCallback(
    (field: string) => {
      return (f: any) => {
        setFilter({ ...filter, [field]: f });
        if (setLoadList) {
          setLoadList(true);
        }
      };
    },
    [filter, setLoadList],
  );

  const handleSearch = useCallback(() => {
    setLoadList(true);
  }, [setLoadList]);

  const handleClose = useCallback(() => {
    setFilter({ ...new StoreProblemsHistoryMonitorFilter() });
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  return {
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    handleFilter,
    total,
    handleSearch,
    handleClose,
  };
}

export default StoreProblemHistoryModal;
