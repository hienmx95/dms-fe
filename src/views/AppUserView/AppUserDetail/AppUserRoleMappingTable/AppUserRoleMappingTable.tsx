import React, { Dispatch, SetStateAction } from 'react';
import { crudService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';

// Parent Repo
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
// Parent Class
import { AppUser } from 'models/AppUser';
// Class
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
// Filter Class
import { AppUserRoleMappingFilter } from 'models/AppUserRoleMappingFilter';
// Mapping Class
import { Role } from 'models/Role';
import AppUserRoleMappingModal from 'views/AppUserView/AppUserDetail/AppUserRoleMappingModal/AppUserRoleMappingModal';
import { tableService } from 'services';

export interface AppUserRoleMappingTableProps {
  appUser: AppUser;

  setAppUser: Dispatch<SetStateAction<AppUser>>;
}

function AppUserRoleMappingTable(props: AppUserRoleMappingTableProps) {
  const [translate] = useTranslation();

  const { appUser, setAppUser } = props;

  const [
    appUserRoleMappings,
    setAppUserRoleMappings,
  ] = crudService.useContentTable<AppUser, AppUserRoleMapping>(
    appUser,
    setAppUser,
    nameof(appUser.appUserRoleMappings),
  );

  const [
    appUserRoleMappingFilter,
    setAppUserRoleMappingFilter,
  ] = React.useState<AppUserRoleMappingFilter>(new AppUserRoleMappingFilter());

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<AppUserRoleMapping, AppUserRoleMappingFilter>(
    appUserRoleMappings,
    appUserRoleMappingFilter,
    setAppUserRoleMappingFilter,
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
  ] = crudService.useContentModal(
    appUserRepository.listRole,
    appUserRepository.countRole,
    AppUserRoleMappingFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    Role,
    AppUserRoleMapping
  >(
    appUser.id,
    nameof(appUser),
    nameof(appUserRoleMappings[0].role),
    appUserRoleMappings,
    setAppUserRoleMappings,
  );

  const columns: ColumnProps<AppUserRoleMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUserRoleMapping>(pagination),
      },
      {
        title: translate('appUsers.roles.appUserId'),
        key: nameof(dataSource[0].role.appUserId),
        dataIndex: nameof(dataSource[0].role),
        render(role: Role) {
          return role?.appUserId;
        },
      },
      {
        title: translate('appUsers.roles.roleId'),
        key: nameof(dataSource[0].role.roleId),
        dataIndex: nameof(dataSource[0].role),
        render(role: Role) {
          return role?.roleId;
        },
      },
    ],
    [dataSource, pagination, translate],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        bordered={true}
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(appUserRoleMappings[0].roleId)}
        onChange={handleTableChange}
        title={() => (
          <>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-primary" onClick={handleOpen}>
                <i className="fa fa-plus mr-2" />
                {translate(generalLanguageKeys.actions.add)}
              </button>
            </div>
          </>
        )}
      />
      <AppUserRoleMappingModal
        current={appUserRoleMappings}
        list={list}
        total={total}
        loading={loading}
        isOpen={visible}
        modelFilter={filter}
        setModelFilter={setFilter}
        rowSelection={rowSelection}
        onClose={handleClose}
      />
    </>
  );
}
export default AppUserRoleMappingTable;
