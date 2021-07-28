import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import { generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { Model } from 'core/models';
import { tableService } from 'services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { ChangePriceHistory } from 'models/ChangePriceHistory';
import { ChangePriceHistoryFilter } from 'models/ChangePriceHistoryFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import nameof from 'ts-nameof.macro';
import { productService } from '../../ProductService';
import { DateFilter } from 'core/filters';
import { formatNumber } from 'core/helpers/number';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  list?: T[];

  pagination?: PaginationConfig;

  isSave?: boolean;

  currentItem?: ChangePriceHistory;

  getList?: (
    ChangePriceHistoryFilter?: ChangePriceHistoryFilter,
  ) => Promise<ChangePriceHistory[]>;

  count?: (ChangePriceHistoryFilter?: ChangePriceHistoryFilter) => Promise<number>;
}

function ContentModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    handleClose,
    currentItem,
    getList,
    count,
  } = props;

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
    handleDefaultSearch,
  ] = productService.useChangePriceHistoryMaster(getList, count, currentItem);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const columns: ColumnProps<ChangePriceHistory>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 100,
        render: renderMasterIndex<ChangePriceHistory>(pagination),
      },
      {
        title: translate('products.changePriceHistorys.updateTime'),
        key: nameof(list[0].time),
        dataIndex: nameof(list[0].time),
        render(...[time]) {
          return formatDateTime(time);
        },
      },
      {
        title: translate('products.ChangePriceHistorys.changer'),
        key: nameof(list[0].modifier),
        dataIndex: nameof(list[0].modifier),
        render(modifier: AppUser) {
          return modifier?.displayName;
        },
      },
      {
        title: translate('products.ChangePriceHistorys.oldPrice'),
        key: nameof(list[0].oldPrice),
        dataIndex: nameof(list[0].oldPrice),
        align: 'right',
        render(...[oldPrice]){
          return formatNumber(oldPrice);
        },
      },
      {
        title: translate('products.ChangePriceHistorys.newPrice'),
        key: nameof(list[0].newPrice),
        dataIndex: nameof(list[0].newPrice),
        align: 'right',
        render(...[newPrice]){
          return formatNumber(newPrice);
        },
      },
    ];
  }, [list, pagination, translate]);

  const [listItemHistory, setListItemHistory] = React.useState<ChangePriceHistory[]>([]);
  const [totalItemHistory, setTotal] = React.useState<number>(0);
  React.useEffect(() => {
    setListItemHistory(list);
    setTotal(totalItemHistory);
    setLoading(false);
  }, [list, setLoading, totalItemHistory]);

  const handleChangeFilter = React.useCallback((modelFilter: DateFilter) => {
    setFilter({...filter, time: modelFilter});
    handleDefaultSearch();
  }, [filter, handleDefaultSearch, setFilter]);


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
        <Form>
          <Row>
            <Col className="pl-1" span={6}>
              <FormItem className="mb-3" labelAlign="left">
              <AdvancedDateFilter
                  filter={filter.time}
                  filterType={nameof(filter.time.greaterEqual)}
                  onChange={handleChangeFilter}
                  className="w-100"
                  placeholder={translate('products.placeholder.updateTime')}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          key={list[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listItemHistory}
          loading={loading}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
    </Modal>
  );
}

export default ContentModal;
