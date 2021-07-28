import { Input, Popconfirm } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { API_ROLE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Role } from 'models/Role';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import '.././RoleDetail.scss';
import AppUserRoleMappingModal from './AppUserRoleMappingModal';

export interface AppUserRoleMappingTableProps {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
}

function AppUserRoleMappingTable(props: AppUserRoleMappingTableProps) {
  const [translate] = useTranslation();

  const { role, setRole } = props;
  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE);
  const [
    appUserRoleMappings,
    setAppUserRoleMappings,
  ] = crudService.useContentTable<Role, AppUserRoleMapping>(
    role,
    setRole,
    nameof(role.appUserRoleMappings),
  );

  const [appUsers, setAppUsers] = React.useState<AppUser[]>([]);
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [isChangeSelectedList, setIsChangeSelectedList] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (appUserRoleMappings.length > 0) {
      const appUsers = appUserRoleMappings.map(item => item.appUser);
      setAppUsers(appUsers);
    }
  }, [appUserRoleMappings, role]);
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<AppUser, AppUserFilter>(
    appUsers,
    appUserFilter,
    setAppUserFilter,
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    filter,
    setFilter,
    setList,
  ] = crudService.useContentModal(
    roleRepository.listAppUser,
    roleRepository.countAppUser,
    AppUserFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    AppUser,
    AppUserRoleMapping
  >(
    role.id,
    nameof(role),
    nameof(appUserRoleMappings[0].appUser),
    appUserRoleMappings,
    setAppUserRoleMappings,
  );

  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      appUserFilter[field].contain = ev.target.value.toLocaleLowerCase();
      appUserFilter.skip = 0;
      setAppUserFilter({
        ...appUserFilter,
      });
    },
    [appUserFilter],
  );

  const handleDelete = React.useCallback(
    (appUser: AppUser) => {
      return () => {

        let index: number;
        appUsers.forEach((user, i) => {
          if (appUser.id === user.id) {
            index = i;
          }
        });
        appUsers.splice(index, 1);
        setAppUsers([...appUsers]);
        appUserRoleMappings.splice(index, 1);
        setAppUserRoleMappings([...appUserRoleMappings]);
      };
    },
    [appUserRoleMappings, appUsers, setAppUserRoleMappings],
  );
  const handleAddUser = React.useCallback(() => {
    handleOpen();
    setIsChangeSelectedList(true);
  }, [handleOpen, setIsChangeSelectedList]);
  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.columns.index)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.username')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.username))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        render(...[, appUser]) {
          return appUser?.username;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.displayName')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.displayName))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        render(...[, appUser]) {
          return appUser?.displayName;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.phone')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.phone))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        render(...[, appUser]) {
          return appUser?.phone;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.email')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.email))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        render(...[, appUser]) {
          return appUser?.email;
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate('appUsers.status')}
          </div>
        ),
        key: nameof(dataSource[0].status),
        dataIndex: nameof(dataSource[0].status),
        align: 'center',
        render(...[, appUser]) {
          return (
            <div className={appUser.statusId === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, appUser]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={handleDelete(appUser)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-sm btn-link">
                  <i className="tio-delete_outlined" />
                </button>
              </Popconfirm>
            </div>
          );
        },
      },
    ],
    [
      appUserFilter.displayName,
      appUserFilter.email,
      appUserFilter.phone,
      appUserFilter.username,
      dataSource,
      handleDelete,
      handleValueFilter,
      list,
      pagination,
      translate,
    ],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(dataSource[0].id)}
        onChange={handleTableChange}
        title={() => (
          <>
            <div className="d-flex d-flex justify-content-between ml-2">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listAppUser') &&
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleAddUser}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate('roles.addAppUsers')}
                  </button>
                }
              </div>
              <div className="flex-shrink-1 d-flex align-items-center">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                })}
              </div>
            </div>
          </>
        )}
      />
      <AppUserRoleMappingModal
        list={list}
        setList={setList}
        getList={roleRepository.listAppUser}
        total={total}
        loading={loading}
        isOpen={visible}
        modelFilter={filter}
        setModelFilter={setFilter}
        rowSelection={rowSelection}
        onClose={handleClose}
        isChangeSelectedList={isChangeSelectedList}
        setIsChangeSelectedList={setIsChangeSelectedList}
      />
    </>
  );
}

export default AppUserRoleMappingTable;
