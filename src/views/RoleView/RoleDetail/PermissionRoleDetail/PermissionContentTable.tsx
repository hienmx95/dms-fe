import { Tooltip } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formService } from 'core/services';
import { crudService } from 'core/services/CRUDService';
import { indexInContent, renderMasterIndex } from 'helpers/ant-design/table';
import { FieldFilter } from 'models/FieldFilter';
import { Permission } from 'models/Permission';
import { PermissionContentFilter } from 'models/PermissionContentFilter';
import { PermissionContent } from 'models/PermissionContents';
import { PermissionOperatorFilter } from 'models/PermissionOperatorFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { roleRepository } from 'views/RoleView/RoleRepository';
import FieldInput from './FieldInput';

const { Item: FormItem } = Form;

export interface PermissionContentTableProps {
  permission: Permission;
  setPermission: Dispatch<SetStateAction<Permission>>;
  menuId?: number;
  // fieldFilter: FieldFilter;
  // setFieldFilter: Dispatch<SetStateAction<FieldFilter>>;
}

function PermissionContentTable(props: PermissionContentTableProps) {
  const [translate] = useTranslation();

  const { permission, setPermission, menuId } = props;
  // pagination delete content and handleInput
  const [contentFilter, setContentFilter] = React.useState<
    PermissionContentFilter
  >(new PermissionContentFilter());

  const [
    permissionContents,
    setPermissionContents,
    ,
    handleDelete,
  ] = crudService.useContentTable<Permission, PermissionContent>(
    permission,
    setPermission,
    nameof(permission.permissionContents),
  );

  const [
    contentFilters,
    setContentFilters,
    handleChangeRowFieldContent,
  ] = usePermissionContentFilters(
    menuId,
    permissionContents,
    setPermissionContents,
  );

  const [, handleChangeListObjectField] = crudService.useListChangeHandlers<
    PermissionContent
  >(permissionContents, setPermissionContents);

  const [dataSource, pagination] = tableService.useLocalTable(
    permissionContents,
    contentFilter,
    setContentFilter,
  );

  const handleAddContent = React.useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const newContent: PermissionContent = new PermissionContent();
      newContent.key = uuidv4();
      setPermissionContents([...permissionContents, newContent]);
    },
    [permissionContents, setPermissionContents],
  );

  const defaultList = React.useMemo(() => {
    return item => {
      if (item) {
        if (typeof item === 'object') {
          return [item];
        }
      }
      return [];
    };
  }, []);

  const columns: ColumnProps<PermissionContent>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: 100,
          render: renderMasterIndex<PermissionContent>(pagination),
        },
        {
          title: translate('permissionContents.field'),
          key: nameof(dataSource[0].fieldId),
          dataIndex: nameof(dataSource[0].fieldId),
          render(...[fieldId, record, index]) {
            return (
              <FormItem
                validateStatus={formService.getValidationStatus<any>(
                  record.errors,
                  nameof(record.field),
                )}
                help={record.errors?.field}
              >
                <SelectAutoComplete
                  value={fieldId}
                  onChange={handleChangeRowFieldContent(indexInContent(index))}
                  getList={roleRepository.singleListField}
                  modelFilter={contentFilters[index]?.fieldFilter}
                  setModelFilter={setContentFilters(index, 'fieldFilter')}
                  searchField={'name'}
                  searchType={'contain'}
                  placeholder={translate(
                    'permissionContents.placeholder.field',
                  )}
                  list={defaultList(record.field)}
                />
              </FormItem>
            );
          },
        },

        {
          title: translate('permissionContents.permissionOperator'),
          key: nameof(dataSource[0].permissionOperatorId),
          dataIndex: nameof(dataSource[0].permissionOperatorId),
          render(...[permissionOperatorId, record, index]) {
            return (
              <>
                {record.permissionOperator?.name === 'UserId' &&
                  permissionOperatorId === 101 ? (
                    '='
                  ) : (
                    <FormItem
                      validateStatus={formService.getValidationStatus<any>(
                        record.errors,
                        nameof(record.permissionOperator),
                      )}
                      help={record.errors?.permissionOperator}
                    >
                      <SelectAutoComplete
                        value={permissionOperatorId}
                        onChange={handleChangeListObjectField(
                          nameof(permissionContents[0].permissionOperator),
                          indexInContent(index),
                        )}
                        getList={roleRepository.singleListPermissionOperator}
                        modelFilter={contentFilters[index]?.operatorFilter}
                        setModelFilter={setContentFilters(
                          index,
                          'operatorFilter',
                        )}
                        searchField={'name'}
                        searchType={'contain'}
                        placeholder={translate(
                          'permissionContents.placeholder.permissionOperator',
                        )}
                        list={defaultList(record.permissionOperator)}
                        disabled={
                          record.fieldId === undefined || record.fieldId === 0
                        }
                      />
                    </FormItem>
                  )}
              </>
            );
          },
        },

        {
          title: translate('permissionContents.value'),
          key: nameof(dataSource[0].value),
          dataIndex: nameof(dataSource[0].value),
          render(...[value, record, index]) {
            return (
              <>
                <FieldInput
                  value={value}
                  index={index}
                  contents={permissionContents}
                  setContents={setPermissionContents}
                  disabled={
                    record.fieldId === undefined ||
                    typeof record.errors?.field === 'string'
                  }
                />
              </>
            );
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(dataSource[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(...[, , index]) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(indexInContent(index, pagination))}
                  >
                    <i className="tio-delete_outlined" />
                  </button>
                </Tooltip>
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      contentFilters,
      dataSource,
      defaultList,
      handleChangeListObjectField,
      handleChangeRowFieldContent,
      handleDelete,
      pagination,
      permissionContents,
      setContentFilters,
      setPermissionContents,
      translate,
    ],
  );

  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAddContent}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAddContent, translate],
  );

  return (
    <>
      <div>
        <Table
          tableLayout="fixed"
          bordered={false}
          columns={columns}
          dataSource={dataSource}
          rowKey={nameof(dataSource[0].key)}
          pagination={false}
          className="page-table"
          scroll={{ y: 480 }}
          footer={tableFooter}
        />
      </div>
    </>
  );
}

function usePermissionContentFilters(
  menuId: number,
  contents: PermissionContent[],
  setContents: (v: PermissionContent[]) => void,
): [
    any[],
    (index: number, field: string) => (f: any) => void,
    (index: number) => (value, model) => void,
  ] {
  const [contentFilters, setContentFilters] = React.useState<any[]>([]);
  React.useEffect(() => {
    const filters = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < contents.length; i++) {
      const fieldTypeId = contents[i]?.field?.fieldTypeId;
      const fieldFilter = { ...new FieldFilter(), menuId: { equal: menuId } };
      const operatorFilter = {
        ...new PermissionOperatorFilter(),
        fieldTypeId: { equal: fieldTypeId },
      };
      filters.push({
        fieldFilter,
        operatorFilter,
      });
    }
    setContentFilters([...filters]);
  }, [contents, menuId]);

  const setFilterList = React.useCallback(
    (index: number, field) => {
      return (f: any) => {
        contentFilters[index] = { ...contentFilters[index], [field]: f };
        setContentFilters([...contentFilters]);
      };
    },
    [contentFilters],
  );

  const handleChangeRowFieldContent = React.useCallback(
    (index: number) => {
      return (value, model?) => {
        // in case field is UserId, set permissionOperatorId = ID_EQ instantly
        if (model.fieldTypeId === 1 && model.name === 'UserId') {
          contents[index] = {
            ...contents[index],
            field: model,
            fieldId: value,
            permissionOperatorId: 0, // ID_EQ, Id = 101, FieldTypeId = 1
            value: undefined,
          };
          setContents([...contents]);
          return;
        }
        // update field in permissionContent
        contents[index] = {
          ...contents[index],
          fieldId: value,
          field: model,
          permissionOperatorId: undefined,
          value: undefined,
        };
        setContents([...contents]);
        contentFilters[index].operatorFilter = {
          ...contentFilters[index].operatorFilter,
          fieldTypeId: { equal: model?.fieldTypeId },
        };
        setContentFilters([...contentFilters]);
      };
    },
    [contentFilters, contents, setContents],
  );
  /* return each content one FieldFilter, PermissionOperatorFilter */
  return [contentFilters, setFilterList, handleChangeRowFieldContent];
}

export default PermissionContentTable;
