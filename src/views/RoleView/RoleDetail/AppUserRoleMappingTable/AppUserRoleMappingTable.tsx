import React from 'react';
import { ContentTableProps } from 'react3l';
import { crudService, formService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { tableService } from 'services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import Form from 'antd/lib/form';
import { formItemLayout } from 'config/ant-design/form';
import { Col, Row } from 'antd/lib/grid';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';

import { roleRepository } from 'views/RoleView/RoleRepository';
import { Role } from 'models/Role';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { AppUserRoleMappingFilter } from 'models/AppUserRoleMappingFilter';
import AppUserRoleMappingModal from 'views/RoleView/RoleDetail/AppUserRoleMappingModal/AppUserRoleMappingModal';
import { Input } from 'antd';
const { Item: FormItem } = Form;

function AppUserRoleMappingTable(props: ContentTableProps<Role, AppUserRoleMapping>) {
  const [translate] = useTranslation();

  const {
    model,
    setModel,
  } = props;

  const [
    appUserRoleMappings,
    setAppUserRoleMappings,
    handleAdd,
    handleDelete,
  ] = crudService.useContentTable<Role, AppUserRoleMapping>(
    model,
    setModel,
    nameof(model.appUserRoleMappings),
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    appUserRoleMappingFilter,
    setAppUserRoleMappingFilter,
  ] = crudService.useContentModal(
    roleRepository.listAppUserRoleMapping,
    roleRepository.countAppUserRoleMapping,
    AppUserRoleMappingFilter,
  );

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(
    appUserRoleMappings,
    appUserRoleMappingFilter,
    setAppUserRoleMappingFilter,
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
        title: translate('appUserRoleMappings.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<AppUserRoleMapping>(pagination),
      },
      {
        title: translate('appUserRoleMappings.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Role>(nameof(dataSource[0].name), sorter),
        render(name: string, appUserRoleMapping: AppUserRoleMapping) {
          return (
            <FormItem validateStatus={formService.getValidationStatus<AppUserRoleMapping>(appUserRoleMapping.errors, nameof(appUserRoleMapping.name))}
              help={appUserRoleMapping.errors?.name}
            >
              <Input
                type="text"
                className="form-control form-control-sm"
                name={nameof(name)}
                value={name}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [AppUserRoleMapping, AppUserRoleMapping, number]) {
          return (
            <>
              <button className="btn btn-link mr-2" onClick={handleDelete(params[2])}>
                <i className="fa fa-trash" />
              </button>
            </>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, sorter, translate],
  );
  const tableTitle = React.useCallback(
    () => (
      <button className="btn btn-sm btn-primary" onClick={handleOpen}>
        <i className="fa fa-plus mr-2" />
        {translate(generalLanguageKeys.actions.add)}
      </button>
    ),
    [handleOpen, translate],
  );
  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAdd}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAdd, translate],
  );

  return (
    <>
      <CollapsibleCard title={translate(generalLanguageKeys.actions.search)} className="mb-4">
        <AppUserRoleMappingModal title={translate('role.appUserRoleMappingModal.title')}
          selectedList={appUserRoleMappings}
          setSelectedList={setAppUserRoleMappings}
          list={list}
          total={total}
          isOpen={visible}
          loading={loading}
          toggle={handleClose}
          onClose={handleClose}
          filter={appUserRoleMappingFilter}
          setFilter={setAppUserRoleMappingFilter}
        />
        <Form {...formItemLayout}>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('roles.id')}>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-end mt-2">
          <button className="btn btn-sm btn-primary mr-2" onClick={handleSearch}>
            <i className="fa fa-search mr-2" />
            {translate(generalLanguageKeys.actions.filter)}
          </button>
          <button className="btn btn-sm btn-outline-primary text-dark" onClick={handleReset}>
            <i className="fa mr-2 fa-times" />
            {translate(generalLanguageKeys.actions.reset)}
          </button>
        </div>
      </CollapsibleCard>
      <Table pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        bordered={true}
        size="small"
        title={tableTitle}
        footer={tableFooter}
      />
    </>
  );
}

export default AppUserRoleMappingTable;
