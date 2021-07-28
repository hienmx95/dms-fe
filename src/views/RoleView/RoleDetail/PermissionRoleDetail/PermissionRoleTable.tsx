import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { MenuFilter } from 'models/MenuFilter';
import { Permission } from 'models/Permission';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { roleService } from 'views/RoleView/RoleService';
import '.././RoleDetail.scss';
import PermissionDetailModal from './PermissionDetailModal';
import { crudService } from 'core/services';
import { API_ROLE_ROUTE } from 'config/api-consts';
import { PermissionFilter } from 'models/PermissionFilter';

export interface PermissionRoleTableProps {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
  statusList: Status[];
}

function PermissionRoleTable(props: PermissionRoleTableProps) {
  const [translate] = useTranslation();
  const { role, statusList } = props;
  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE);

  const [
    filter,
    setFilter,
    list,
    setList,
    total,
    loading,
    setLoading,
    handleFilter,
    handleSearch,
    handleDefaultSearch,
    isReset,
    setIsReset,
  ] = roleService.usePermissionTableMaster(role);

  const [
    popupIsOpen,
    ,
    currentItem,
    setCurrentItem,
    handleClose,
    handleSave,
    handleOpen,
  ] = roleService.useDetailPopup(role, handleDefaultSearch);


  const [pagination, , newHandleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );


  const [handleDelete] = roleService.useDeleteHandler<Permission, PermissionFilter>(
    roleRepository.deletePermission,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
    filter,
    setFilter,
  );

  // permission filter
  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // render table columns
  const columns: ColumnProps<Permission>[] = React.useMemo(
    () => [
      {
        title: () => <>{translate(generalLanguageKeys.columns.index)}</>,
        children: [
          {
            title: '',
            key: nameof(generalLanguageKeys.columns.index),
            width: generalColumnWidths.index,
            render: renderMasterIndex<Permission>(pagination),
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('permissions.code')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(filter.code.contain)}
                filter={filter.code}
                onChange={handleFilter(nameof(filter.code))}
                className="w-100"
                isReset={isReset}
                setIsReset={setIsReset}
                placeholder={translate('permissions.code')}
              />
            ),
            key: nameof(list[0].code),
            dataIndex: nameof(list[0].code),
            render(...[, permission]) {
              return permission?.code;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('permissions.name')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(filter.name.contain)}
                filter={filter.name}
                onChange={handleFilter(nameof(filter.name))}
                className="w-100"
                isReset={isReset}
                setIsReset={setIsReset}
                placeholder={translate('permissions.name')}
              />
            ),
            key: nameof(list[0].name),
            dataIndex: nameof(list[0].name),
            render(...[, permission]) {
              return permission?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <div className="w-100">
            <div>{translate('permissions.permissionsMenu')}</div>
          </div>
        ),
        children: [
          {
            title: () =>
              validAction('singleListMenu') && (
                <AdvancedIdFilter
                  filter={filter.menuId}
                  filterType={nameof(filter.menuId.equal)}
                  value={filter.menuId.equal}
                  onChange={handleFilter(nameof(filter.menuId))}
                  getList={roleRepository.singleListMenu}
                  modelFilter={menuFilter}
                  setModelFilter={setMenuFilter}
                  searchField={nameof(menuFilter.name)}
                  placeholder={translate('permissions.permissionsMenu')}
                  isReset={isReset}
                  setIsReset={setIsReset}
                />
              ),
            key: nameof(list[0].menuId),
            dataIndex: nameof(list[0].menuId),
            render(...[, permission]) {
              return permission?.menu?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <div className="text-center">{translate('appUsers.status')}</div>
        ),
        children: [
          {
            title: '',
            key: nameof(list[0].status),
            dataIndex: nameof(list[0].status),
            align: 'center',
            width: generalColumnWidths.actions,
            render(...[, permission]) {
              return (
                <div className={permission.statusId === 1 ? 'active' : ''}>
                  <i className="fa fa-check-circle d-flex justify-content-center"></i>
                </div>
              );
            },
          },
        ],
      },
      {
        title: () => (
          <div className="text-center">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        children: [
          {
            title: '',
            key: nameof(generalLanguageKeys.columns.actions),
            dataIndex: nameof(list[0].id),
            width: generalColumnWidths.actions,
            align: 'center',
            render(...[id, permission]) {
              return (
                <div className="d-flex justify-content-center button-action-table">
                  {validAction('getPermission') && (
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpen(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  )}
                  {validAction('deletePermission') && (
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(permission)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  )}
                </div>
              );
            },
          },
        ],
      },
    ],
    [
      filter,
      handleDelete,
      handleFilter,
      handleOpen,
      isReset,
      list,
      menuFilter,
      pagination,
      setIsReset,
      translate,
      validAction,
    ],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        size="small"
        columns={columns}
        dataSource={list}
        pagination={pagination}
        rowKey={nameof(list[0].id)}
        onChange={newHandleTableChange}
        loading={loading}
        className="permission-table"
        title={() => (
          <>
            <div className="d-flex d-flex justify-content-between ml-2">
              <div className="flex-shrink-1 d-flex align-items-center">
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleOpen()}
                >
                  <i className="fa mr-2 fa-plus" />
                  {translate('roles.addPermission')}
                </button>
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
      <PermissionDetailModal
        isOpen={popupIsOpen}
        onSave={handleSave}
        onClose={handleClose}
        statusList={statusList}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
      />
    </>
  );
}

export default PermissionRoleTable;
