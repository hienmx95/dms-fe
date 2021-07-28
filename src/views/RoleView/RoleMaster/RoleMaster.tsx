import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { ROLE_DETAIL_ROUTE } from 'config/route-consts';
import { crudService } from 'core/services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import RolePreview from 'views/RoleView/RoleMaster/RolePreview';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { notification } from '../../../helpers/notification';
import RoleAppUserMappingModal from '../RoleDetail/AppUserRoleMappingModal/AppUserRoleMappingModal';
import PermissionDetailModal from '../RoleDetail/PermissionRoleDetail/PermissionDetailModal';
import { roleService } from '../RoleService';
import './RoleMaster.scss';
import { API_ROLE_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

function RoleMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'role',
    API_ROLE_ROUTE,
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
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<Role, RoleFilter>(
    Role,
    RoleFilter,
    roleRepository.count,
    roleRepository.list,
    roleRepository.get,
  );

  const [
    handleGoCreate,
    handleGoAppUserRole,
    handleGoPermissionRole,
  ] = roleService.useRoleMasterNavigation(ROLE_DETAIL_ROUTE);

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  const [rowSelection] = tableService.useRowSelection<Role>([], undefined, resetSelect, setResetSelect);

  /**
   * If import
   */
  // const [handleImport] = crudService.useImport(
  //   roleRepository.import,
  //   setLoading,
  // );

  const [
    loadingAppUser,
    visibleAppUser,
    ,
    listAppUserModal,
    totalAppUser,
    ,
    handleCloseAppUser,
    appUserFilter,
    setAppUserFilter,
  ] = crudService.useContentModal(
    roleRepository.listAppUser,
    roleRepository.countAppUser,
    AppUserFilter,
  );
  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [dataSource] = tableService.useLocalTable(
    listAppUser,
    appUserFilter,
    setAppUserFilter,
  );
  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Role>(
    roleRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const handleSavePopup = React.useCallback(
    (users: AppUser[]) => {
      const appUserRoleMappings = [];
      users.forEach((appUser: AppUser) => {
        appUserRoleMappings.push({
          appUserId: appUser?.id,
          roleId: currentItem?.id,
          appUser,
        });
      });
      currentItem.appUserRoleMappings = appUserRoleMappings;
      setCurrentItem(currentItem);
      roleRepository.assignAppUser(currentItem).then((role: Role) => {
        if (role) {
          // close popup when saving successfully
          handleCloseAppUser();
        }
      });
    },
    [currentItem, handleCloseAppUser, setCurrentItem],
  );

  /* hook for permission detail popup */
  const [currentRole, setCurrentRole] = React.useState<Role>(new Role());

  const [
    popupIsOpen,
    setPopupIsOpen,
    currentPermission,
    setCurrentPermission,
    handleClose,
    handleSave,
  ] = roleService.useDetailPopup(currentRole, handleDefaultSearch);

  const handleOpenPermissionPopup = React.useCallback(
    (role: Role) => {
      return () => {
        setCurrentRole(role);
        setPopupIsOpen(true);
      };
    },
    [setPopupIsOpen],
  );
  const handleClone = React.useCallback(
    (id: number) => {
      roleRepository.clone(id)
        .then(() => {
          notification.success({
            message: translate('roles.notification'),
          });
          handleSearch();
        },
        )
        .catch(() => {
          notification.error({
            message: translate('roles.errorClone'),
          });
        });

    }, [handleSearch, translate]);

  const [statusList, setStatusList] = React.useState<Status[]>([]);
  React.useEffect(() => {
    const filter = new StatusFilter();
    roleRepository.singleListStatus(filter).then((list: Status[]) => {
      setStatusList(list);
    });
  }, [setStatusList]);

  const columns: ColumnProps<Role>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Role>(pagination),
        },

        {
          title: translate('roles.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Role>(nameof(list[0].code), sorter),
          render(code: string, role: Role) {
            return <div className="display-code" onClick={handleOpenPreview(role.id)}>{code}</div>;
          },
        },

        {
          title: translate('roles.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Role>(nameof(list[0].name), sorter),
        },

        {
          title: translate('roles.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<Role>(nameof(list[0].status), sorter),
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
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
          render(id: number, role: Role) {
            return (
              <div className="d-flex justify-content-center btn-action">
                {validAction('clone') &&
                  <Tooltip title={translate('roles.clone')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleClone(id)}
                    >
                      <i className="tio-arrow_large_downward_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('assignAppUser') &&
                  <Tooltip title={translate('roles.assignUser')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoAppUserRole(id)}
                    >
                      <i className="tio-user_add" />
                    </button>
                  </Tooltip>
                }
                {validAction('createPermission') &&
                  <Tooltip title={translate('roles.assignPermission')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPermissionPopup(role)}
                    >
                      <i className="tio-account_circle" />
                    </button>
                  </Tooltip>
                }
                {validAction('get') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('update') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoPermissionRole(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!role.used && validAction('delete') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(role)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                }
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleClone,
      handleDelete,
      handleGoAppUserRole,
      handleGoPermissionRole,
      handleOpenPermissionPopup,
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('roles.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('roles.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('roles.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') &&
              <> <button
                className="btn btn-sm btn-primary mr-2"
                onClick={handleSearch}
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
            }
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
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') &&
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  }
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
        {/* <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
        /> */}

        <RolePreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />

        <RoleAppUserMappingModal
          title={translate('roles.master.appUser.title')}
          selectedList={listAppUser}
          setSelectedList={setListAppUser}
          list={listAppUserModal}
          total={totalAppUser}
          isOpen={visibleAppUser}
          loading={loadingAppUser}
          toggle={handleCloseAppUser}
          onClose={handleCloseAppUser}
          onSave={handleSavePopup}
          currentItem={currentItem}
          isSave={true}
          pagination={pagination}
          dataSource={dataSource}
          getList={roleRepository.listAppUser}
          count={roleRepository.countAppUser}
        />
      </Card>
      <PermissionDetailModal
        isOpen={popupIsOpen}
        onSave={handleSave}
        onClose={handleClose}
        statusList={statusList}
        currentItem={currentPermission}
        setCurrentItem={setCurrentPermission}
      />
    </div>
  );
}

export default RoleMaster;
