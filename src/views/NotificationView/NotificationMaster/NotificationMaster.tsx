import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Notification } from 'models/Notification';
import { NotificationFilter } from 'models/NotificationFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import NotificationDetail from '../NotificationDetail/NotificationDetail';
import { notificationRepository } from '../NotificationRepository';
import NotificationPreview from './NotificationPreview';
import { NotificationStatus } from 'models/NotificationStatus';
import { NotificationStatusFilter } from 'models/NotificationStatusFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import { API_NOTIFICATION } from 'config/api-consts';
import { NOTIFICATION_ROUTE } from 'config/route-consts';
import path from 'path';
import { useHistory, useLocation } from 'react-router';

const { Item: FormItem } = Form;

function NotificationMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const { validAction } = crudService.useAction(
    'notification',
    API_NOTIFICATION,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    ,
    ,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    setLoadList,
  ] = crudService.useMaster<Notification, NotificationFilter>(
    Notification,
    NotificationFilter,
    notificationRepository.count,
    notificationRepository.list,
    notificationRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [
    notificationStatusFilter,
    setNotificationStatusFilter,
  ] = React.useState<NotificationStatusFilter>(new NotificationStatusFilter());

  const [handleDelete] = tableService.useDeleteHandler<Notification>(
    notificationRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<Notification>(
    new Notification(),
  );

  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);

  const handleGoDetail = React.useCallback(
    (notification: Notification) => {
      setCurrentItem(notification);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleOpenPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(NOTIFICATION_ROUTE + search + '#' + id));
      notificationRepository.get(id).then((noti: Notification) => {
        setPreviewModel(noti);
        setPreviewVisible(true);
      });
    },
    [history, search],
  );

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(NOTIFICATION_ROUTE + temp[0]));
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPreview);
  const columns: ColumnProps<Notification>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Notification>(pagination),
      },
      {
        title: translate('notifications.title'),
        key: nameof(list[0].title),
        dataIndex: nameof(list[0].title),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Notification>(
          nameof(list[0].title),
          sorter,
        ),
      },
      {
        title: translate('notifications.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Notification>(
          nameof(list[0].organization),
          sorter,
        ),
        render(organization: Organization) {
          return organization?.name;
        },
      },
      {
        title: translate('notifications.status'),
        key: nameof(list[0].notificationStatus),
        dataIndex: nameof(list[0].notificationStatus),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<Notification>(
          nameof(list[0].notificationStatus),
          sorter,
        ),
        render(notificationStatus: NotificationStatus) {
          return notificationStatus?.name;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, notification: Notification) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('update') && (
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleOpenPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
              )}
              {notification.notificationStatusId === 0 &&
                validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoDetail(notification)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
              {notification.notificationStatusId !== 1 &&
                validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(notification)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
            </div>
          );
        },
      },
    ];
  }, [
    handleDelete,
    handleGoDetail,
    handleOpenPreview,
    list,
    pagination,
    sorter,
    translate,
    validAction,
  ]);
  return (
    <div className="page master-page">
      <Card
        title={translate('notifications.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('notifications.title')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.title.contain)}
                    filter={filter.title}
                    onChange={handleFilter(nameof(previewModel.title))}
                    className="w-100"
                    placeholder={translate('notifications.placeholder.title')}
                  />
                </FormItem>
              </Col>
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('notifications.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={notificationRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListNotificationStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('brands.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.notificationStatusId}
                      filterType={nameof(filter.notificationStatusId.equal)}
                      value={filter.notificationStatusId.equal}
                      onChange={handleFilter(
                        nameof(filter.notificationStatusId),
                      )}
                      getList={
                        notificationRepository.filterListNotificationStatus
                      }
                      modelFilter={notificationStatusFilter}
                      setModelFilter={setNotificationStatusFilter}
                      searchField={nameof(notificationStatusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleReset}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          onChange={handleTableChange}
          className="table-none-row-selection"
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  )}
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
      </Card>
      {visible === true && (
        <NotificationDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListNotification={notificationRepository.list}
          setListNotification={setList}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
          currentItem={currentItem}
        />
      )}
      <NotificationPreview
        model={previewModel}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
        previewLoading={previewLoading}
      />
    </div>
  );
}

export default NotificationMaster;
