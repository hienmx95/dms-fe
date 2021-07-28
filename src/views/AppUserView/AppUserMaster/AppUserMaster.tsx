import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_APP_USER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { notification } from 'helpers/notification';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { AppUserStoreMapping } from 'models/AppUserStoreMapping';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React from 'react';
import Avatar, { ConfigProvider } from 'react-avatar';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import AppUserPreview from 'views/AppUserView/AppUserMaster/AppUserPreview';
import ChangeERouteScopeModal from 'views/AppUserView/AppUserMaster/Modal/ChangeERouteScopeModal';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import './AppUserMaster.scss';
import ChangeRoleModal from './Modal/ChangeRoleModal';

const { Item: FormItem } = Form;

function AppUserMaster() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction('app-user', API_APP_USER_ROUTE);

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    setLoadListMaster,
  ] = crudService.useMaster<AppUser, AppUserFilter>(
    AppUser,
    AppUserFilter,
    appUserRepository.count,
    appUserRepository.list,
    appUserRepository.get,
  );
  const [handleExport] = crudService.useExport(
    appUserRepository.exportStore,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    appUserRepository.exportTemplateStore,
    filter,
  );

  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(appUserRepository.importStore, setLoading);

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [appUser, setAppUser] = React.useState<AppUser>(new AppUser());

  const {
    loadList,
    setLoadList,
    handleOpenModal,
    handleSave,
    isOpen,
    selectedList,
    setSelectedList,
    handleCloseModal,
    filter: storeFilter,
    setFilter: setStoreFilter,
  } = modalService.useModal(
    StoreFilter,
  );

  const handleOpen = React.useCallback((id: number) => {
    return () => {
      appUserRepository.get(id)
        .then(user => {
          setAppUser({ ...user }); // setAppUser
          if (
            user?.appUserStoreMappings &&
            user?.appUserStoreMappings.length > 0
          ) {
            setSelectedList(user?.appUserStoreMappings.map(

              (item: AppUserStoreMapping) => item?.store,
            )); // map selectedList
          } // set selectedList from user
          else {
            setSelectedList([]);
          }
          handleOpenModal(); // open modal, setloadList
        });
    };
  }, [handleOpenModal, setSelectedList]);

  const updateContentFromSelectedList = React.useCallback(
    (list: Store[]) => {
      if (appUser.appUserStoreMappings) {
        if (list && list?.length > 0) {
          const listStoreIds = list.map(store => store.id);
          const usedStoreIds = appUser.appUserStoreMappings.map(
            content => content.storeId,
          );
          list.forEach((i: Store) => {
            const content = new AppUserStoreMapping();
            content.store = i;
            content.storeId = i?.id;
            if (appUser.appUserStoreMappings.length > 0) {
              // add unused stores
              if (!usedStoreIds.includes(i.id)) {
                appUser.appUserStoreMappings.push(content);
              }
            } else {
              appUser.appUserStoreMappings.push(content);
            }
          });
          // remove content which used removed stores
          const newContents = appUser.appUserStoreMappings.filter(content =>
            listStoreIds.includes(content.storeId),
          );
          appUser.appUserStoreMappings = newContents;
          setAppUser(appUser);
        } else {
          // if no store selected, remove all contents
          appUser.appUserStoreMappings = [];
          setAppUser({
            ...appUser,
          });
        }
        appUserRepository
          .update(appUser)
          .then(item => {
            setAppUser({ ...item });
            setLoadListMaster(true);
            setTimeout(() => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
            }, 0);
          })
          .catch((error: AxiosError<AppUser>) => {
            if (error.response && error.response.status === 400) {
              setAppUser(error.response?.data);
            }
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      }
    },
    [appUser, setLoadListMaster, translate],
  );

  // appUser Role mapping
  const [visibleRole, setVisibleRole] = React.useState<boolean>(false);
  const [loadingRole, setLoadingRole] = React.useState<boolean>(false);

  const handleCloseRole = React.useCallback(() => {
    setVisibleRole(false);
  }, [setVisibleRole]);

  const handleOpenRole = React.useCallback(
    (id: number) => {
      return () => {
        appUserRepository.get(id).then(user => {
          setAppUser({ ...user });
          setVisibleRole(true);
        });
      };
    },
    [setAppUser, setVisibleRole],
  );

  const handleSaveRole = React.useCallback(
    list => {
      if (appUser?.appUserRoleMappings) {
        if (list && list?.length > 0) {
          const listRoleIds = list.map(role => role.id);
          const usedRoleIds = appUser.appUserRoleMappings.map(
            content => content.roleId,
          );
          list.forEach((i: Role) => {
            const content = new AppUserRoleMapping();
            content.role = i;
            content.roleId = i?.id;
            if (appUser.appUserRoleMappings.length > 0) {
              // add unused role
              if (!usedRoleIds.includes(i.id)) {
                appUser.appUserRoleMappings.push(content);
              }
            } else {
              appUser.appUserRoleMappings.push(content);
            }
          });
          // remove content which used removed role
          const newContents = appUser.appUserRoleMappings.filter(content =>
            listRoleIds.includes(content.roleId),
          );
          appUser.appUserRoleMappings = newContents;
          setAppUser(appUser);
        } else {
          // if no store selected, remove all contents
          appUser.appUserRoleMappings = [];
          setAppUser({
            ...appUser,
          });
        }
        appUserRepository
          .updateRole(appUser)
          .then(item => {
            setAppUser({ ...item });
            setLoadListMaster(true);
            setTimeout(() => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
            }, 0);
            setVisibleRole(false);
          })
          .finally(() => {
            setLoadingRole(false);
          })
          .catch((error: AxiosError<AppUser>) => {
            if (error.response && error.response.status === 400) {
              setAppUser(error.response?.data);
            }
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      }
    },
    [appUser, setLoadListMaster, translate],
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        title: translate('appUsers.avatar'),
        key: nameof(list[0].avatar),
        dataIndex: nameof(list[0].avatar),
        render(avatar: string, appUser: AppUser) {
          return (
            <div className="button-hover">
              {avatar && <img src={avatar} className="image" alt="" />}
              {!avatar && (
                <ConfigProvider colors={['#ef5e5e', '#6fde6f', '#3c3c5f38']}>
                  <Avatar
                    maxInitials={1}
                    round={true}
                    size="40"
                    name={appUser?.displayName}
                  />
                </ConfigProvider>
              )}
            </div>
          );
        },
      },
      {
        title: translate('appUsers.username'),
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
        sorter: true,
        sortOrder: getOrderTypeForTable<AppUser>(
          nameof(list[0].username),
          sorter,
        ),
        render(username: string, appUser: AppUser) {
          return (
            <div
              className="display-username"
              onClick={handleOpenPreview(appUser.id)}
            >
              {username}
            </div>
          );
        },
      },
      {
        title: translate('appUsers.displayName'),
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<AppUser>(
          nameof(list[0].displayName),
          sorter,
        ),
      },

      {
        title: translate('appUsers.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        sortOrder: getOrderTypeForTable<AppUser>(
          nameof(list[0].organization),
          sorter,
        ),
        render(organization: Organization) {
          return organization?.name;
        },
      },
      {
        title: translate('appUsers.phone'),
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
        sorter: true,
        sortOrder: getOrderTypeForTable<AppUser>(nameof(list[0].phone), sorter),
      },
      {
        title: translate('appUsers.email'),
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
        ellipsis: true,
        sorter: true,
        sortOrder: getOrderTypeForTable<AppUser>(nameof(list[0].email), sorter),
      },

      {
        title: translate('appUsers.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        align: 'center',
        sortOrder: getOrderTypeForTable<AppUser>(
          nameof(list[0].status),
          sorter,
        ),
        render(status: Status) {
          return (
            <div className={status?.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('updateRole') && (
                <Tooltip title={translate('appUsers.tooltip.role')}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpenRole(id)}
                  >
                    <i className="tio-user_outlined" />
                  </button>
                </Tooltip>
              )}
              {validAction('update') && (
                <Tooltip title={translate('appUsers.tooltip.eRouteScope')}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpen(id)} // start of error
                  >
                    <i className="tio-comment_text_outlined" />
                  </button>
                </Tooltip>
              )}
              {validAction('get') && (
                <Tooltip title={translate('appUsers.tooltip.view')}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleOpenPreview(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ];
  }, [
    handleOpen,
    handleOpenPreview,
    handleOpenRole,
    list,
    pagination,
    sorter,
    translate,
    validAction,
  ]);

  return (
    <div className="page master-page">
      <Card title={translate('appUsers.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.username.contain)}
                    filter={filter.username}
                    onChange={handleFilter(nameof(filter.username))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.username')}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('appUsers.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={appUserRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      searchType={nameof(statusFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('appUsers.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={appUserRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.email.contain)}
                    filter={filter.email}
                    onChange={handleFilter(nameof(filter.email))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.email')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.displayName.contain)}
                    filter={filter.displayName}
                    onChange={handleFilter(nameof(filter.displayName))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.displayName')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.phone.contain)}
                    filter={filter.phone}
                    onChange={handleFilter(nameof(filter.phone))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.phone')}
                  />
                </FormItem>
              </Col>
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
            <div className="d-flex justify-content-between">
              <div className="flex-shrink-1 d-flex align-items-center">

                {validAction('importStore') && (
                  <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    <i className="tio-file_add_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                )}
                {validAction('exportStore') && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                )}
                {validAction('exportTemplateStore') && (
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
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
          )}
        />
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />

        {typeof errModel !== 'undefined' && (
          <ImportErrorModal
            errVisible={errVisible}
            setErrVisible={setErrVisible}
            errModel={errModel}
          />
        )}
        <AppUserPreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />
        {/* change ERouteScope */}
        <ChangeERouteScopeModal
          title={translate('indirectSalesOrderContents.master.item.title')}
          modelFilterClass={StoreFilter}
          model={appUser}
          isOpen={isOpen}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          onClose={handleCloseModal}
          onSave={handleSave(updateContentFromSelectedList)}
          getList={appUserRepository.listStore}
          count={appUserRepository.countStore}
          loadList={loadList}
          setLoadList={setLoadList}
          filter={storeFilter}
          setFilter={setStoreFilter}
        />

        <ChangeRoleModal
          model={appUser}
          isOpen={visibleRole}
          loading={loadingRole}
          onClose={handleCloseRole}
          onSave={handleSaveRole}
        />
      </Card>
    </div>
  );
}

export default AppUserMaster;
