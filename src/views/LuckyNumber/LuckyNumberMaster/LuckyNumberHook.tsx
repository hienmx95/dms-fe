import { Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { DateFilter } from 'core/filters';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable, renderMasterIndex,
} from 'helpers/ant-design/table';
import { notification } from 'helpers/notification';
import { LuckyNumber } from 'models/LuckyNumber';
import { LuckyNumberFilter } from 'models/LuckyNumberFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { luckyNumberRepository } from '../LuckyNumberRepository';
export function useLuckyNumberMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    ,
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
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<LuckyNumber, LuckyNumberFilter>(
    LuckyNumber,
    LuckyNumberFilter,
    luckyNumberRepository.count,
    luckyNumberRepository.list,
    luckyNumberRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [handleDelete] = tableService.useDeleteHandler<LuckyNumber>(
    luckyNumberRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [rowSelection, hasSelected] = tableService.useRowSelection<LuckyNumber>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );

  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    luckyNumberRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const [handleExport] = crudService.useExport(
    luckyNumberRepository.export,
    filter,
  );

  const [handleExportStore] = crudService.useExport(
    luckyNumberRepository.exportStore,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    luckyNumberRepository.exportTemplate,
    filter,
  );

  // import data
  const [loadingImport, setLoadingImport] = React.useState<boolean>(false);
  const ref: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
    null,
  );
  const [errVisible, setErrVisible] = React.useState<boolean>(false);
  const [errorModel, setErrorModel] = React.useState<string>();
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files.length > 0) {
        const file: File = event.target.files[0];
        setLoadingImport(true);
        luckyNumberRepository
          .import(file)
          .then(() => {
            notification.success({
              message: translate(generalLanguageKeys.update.success),
            });
            handleDefaultSearch();
          })
          .catch((error: AxiosError<any>) => {
            setErrorModel(error.response.data);
            setErrVisible(true);
          })
          .finally(() => {
            setLoadingImport(false);
          });
      }
    },
    [setLoadingImport, translate, handleDefaultSearch],
  );

  const handleClick = React.useCallback(() => {
    ref.current.value = null;
  }, []);

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'usedAt') {
          filter.usedAt.lessEqual = f.lessEqual;
          filter.usedAt.greaterEqual = undefined;
          filter.usedAt.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const columns: ColumnProps<LuckyNumber>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<LuckyNumber>(pagination),
      },
      {
        title: translate('luckyNumbers.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<LuckyNumber>(
          nameof(list[0].code),
          sorter,
        ),
      },
      {
        title: translate('luckyNumbers.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<LuckyNumber>(
          nameof(list[0].name),
          sorter,
        ),
      },
      {
        title: translate('luckyNumbers.value'),
        key: nameof(list[0].value),
        dataIndex: nameof(list[0].value),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<LuckyNumber>(
          nameof(list[0].value),
          sorter,
        ),
      },
      {
        title: translate('luckyNumbers.organization'),
        key: nameof(list[0].luckyNumberGrouping),
        dataIndex: nameof(list[0].luckyNumberGrouping),
        sorter: true,
        sortOrder: getOrderTypeForTable<LuckyNumber>(
          nameof(list[0].luckyNumberGrouping),
          sorter,
        ),
        render(...[luckyNumberGrouping]) {
          return luckyNumberGrouping?.organization?.name;
        },
      },
      {
        title: translate('luckyNumbers.status'),
        key: nameof(list[0].rewardStatus),
        dataIndex: nameof(list[0].rewardStatus),
        sorter: true,
        sortOrder: getOrderTypeForTable<LuckyNumber>(
          nameof(list[0].status),
          sorter,
        ),
        align: 'center',
        render(rewardStatus: Status) {
          return (
            // <div className={rewardStatus?.id === 1 ? 'active' : ''}>
            //   <i className="fa fa-check-circle d-flex justify-content-center"></i>
            // </div>
            <div className="text-center">
              {rewardStatus.name}
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
        render(...params: [number, LuckyNumber, number]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {/* {!product.used && validAction('delete') && ( */}
              <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                {!params[1].used && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(params[1])}
                    disabled={params[1].rewardStatusId === 2}
                  >
                    <i className="tio-delete_outlined" />
                  </button>
                )}
              </Tooltip>
              {/* )} */}
            </div>
          );
        },
      },
    ],
    [handleDelete, list, pagination, sorter, translate],
  ); // table columns

  return {
    translate,
    columns,
    list,
    setList,
    filter,
    setFilter,
    loading,
    setLoading,
    handleFilter,
    isReset,
    setIsReset,
    handleDefaultSearch,
    handleTableChange,
    statusFilter,
    setStatusFilter,
    handleReset,
    pagination,
    sorter,
    rowSelection,
    hasSelected,
    total,
    handleBulkDelete,
    handleExport,
    handleExportStore,
    handleExportTemplate,
    loadingImport,
    errVisible,
    setErrVisible,
    errorModel,
    handleClick,
    handleChange,
    ref,
    organizationFilter,
    setOrganizationFilter,
    dateFilter,
    setDateFilter,
    handleDateFilter,
  };
}
