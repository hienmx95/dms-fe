import { Modal, Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import Table, { ColumnProps, SorterResult } from 'antd/lib/table';
import { API_PRICELIST_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { PRICELIST_OWNER_DETAIL_ROUTE } from 'config/route-consts';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Organization } from 'models/Organization';
import { PriceList, PriceListType, SalesOrderType } from 'models/priceList/PriceList';
import { Status } from 'models/Status';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Moment } from 'moment';
import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { priceListOwnerRepository } from 'views/PriceListOwner/PriceListOwnerRepository';
import { priceListOwnerService } from 'views/PriceListOwner/PriceListOwnerService';
import PreviewPriceList from '../PriceListPreview';

export interface PriceListMasterTabProps {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  pagination?: PaginationProps;
  list?: PriceList[];
  sorter?: SorterResult<PriceList>;
  handleOpenPreview?: (id: number | string) => void;
  handleGoDetail?: (id: number | string) => void;
  handleDelete?: (priceList: PriceList) => void;
  loading?: boolean;
  handleGoCreate?: () => void;
  previewModel?: PriceList;
  total?: number;
  handleTableChange?: (
    newPagination: PaginationProps,
    filters: Record<string, any>,
    newSorter: SorterResult<PriceList>,
  ) => void;

  handleSearch?: () => void;

  handleViewHistory?: (id: number | string) => void;

  tab?: number;

  setLoadList?: Dispatch<SetStateAction<boolean>>;
  setList?: Dispatch<SetStateAction<PriceList[]>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

function PriceListTab(props: PriceListMasterTabProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'price-list',
    API_PRICELIST_ROUTE,
  );


  const history = useHistory();

  const {
    list,
    loading,
    previewModel,
    total,
    handleViewHistory,
    tab,
    pagination,
    sorter,
    setLoadList,
    handleTableChange,
    setLoading,
    setList,
    handleSearch,

  } = props;

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    PRICELIST_OWNER_DETAIL_ROUTE,
  );

  const [handleDelete] = tableService.useDeleteHandler<PriceList>(
    priceListOwnerRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  const {
    model,
    setModel,
    previewLoading,
    previewVisible,
    handleOpenPreview,
    handleClosePreview,
  } = priceListOwnerService.usePreview();

  const handleGoDetail2 = React.useCallback(
    id => {
      history.push(path.join(PRICELIST_OWNER_DETAIL_ROUTE, `${id}`));
    },
    [history],
  );

  const handleChangeRequestState = React.useCallback(
    priceList => {
      if (tab === 1) {
        Modal.confirm({
          content: translate('priceLists.noti.send'),

          onOk() {
            priceListOwnerRepository
              .getDetail(priceList.id)
              .then(res => {
                priceListOwnerRepository.send(res).then(() => {
                  setLoadList(true);
                });
              });
          },
        });
      }
      if (tab === 2) {
        handleGoDetail2(priceList.id);
      }
    },
    [translate, setLoadList, tab, handleGoDetail2],
  );

  const columns: ColumnProps<PriceList>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<PriceList>(pagination),
        },
        {
          title: translate('priceLists.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].code),
            sorter,
          ),
          // render(...[code]) {
          //   return <div className="display-code">{code}</div>;
          // },
        },
        {
          title: translate('priceLists.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].name),
            sorter,
          ),
          // render(...[name]) {
          //   return <div className="text-left">{name}</div>;
          // },
        },
        {
          title: translate('priceLists.organization'),
          key: nameof(list[0].organizationId),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          ellipsis: true,
          align: 'left',
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization.name;
          },
        },
        {
          title: translate('priceLists.priceListType'),
          key: nameof(list[0].priceListTypeId),
          dataIndex: nameof(list[0].priceListType),
          sorter: true,
          ellipsis: true,
          align: 'left',
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].priceListType),
            sorter,
          ),
          render(priceListType: PriceListType) {
            return priceListType.name;
          },
        },

        {
          title: translate('priceLists.salesOrderType'),
          key: nameof(list[0].salesOrderTypeId),
          dataIndex: nameof(list[0].salesOrderType),
          sorter: true,
          ellipsis: true,
          align: 'left',
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].salesOrderType),
            sorter,
          ),
          render(salesOrderType: SalesOrderType) {
            return salesOrderType.name;
          },
        },
        {
          title: translate('priceLists.updatedAt'),
          key: nameof(list[0].updatedAt),
          dataIndex: nameof(list[0].updatedAt),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].updatedAt),
            sorter,
          ),
          render(updatedAt: Moment) {
            return formatDateTime(updatedAt);
          },
        },
        {
          title: translate('priceLists.status'),
          key: nameof(list[0].statusId),
          dataIndex: nameof(list[0].status),
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<PriceList>(
            nameof(list[0].status),
            sorter,
          ),
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },
        {
          title: translate('priceLists.requestState'),
          key: nameof(list[0].requestState),
          dataIndex: nameof(list[0].requestState),
          align: 'center',
          render(...[requestState]) {
            return (
              <>
                {requestState && requestState?.id === 1 && (
                  <div className="new-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 2 && (
                  <div className="pending-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 3 && (
                  <div className="approved-state ml-4">
                    {requestState?.name}
                  </div>
                )}
                {requestState && requestState?.id === 4 && (
                  <div className="rejected-state ml-4">
                    {requestState?.name}
                  </div>
                )}
              </>
            );
          },
          ellipsis: true,
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: 200,
          align: 'center',
          render(id: number, priceList: PriceList) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {tab !== 3 && (
                  <Tooltip title={translate(generalLanguageKeys.actions.send)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() =>
                        handleChangeRequestState(priceList)
                      }
                    >
                      <i className="tio-swap_horizontal" />
                    </button>
                  </Tooltip>
                )}
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
                <Tooltip
                  title={translate(generalLanguageKeys.actions.history)}
                >
                  <button
                    className="btn btn-link"
                    onClick={() => handleViewHistory(id)}
                  >
                    <i
                      className="tio-history"
                      aria-hidden="true"
                    />
                  </button>
                </Tooltip>
                {(tab === 1 || tab === 3) && validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {/* Chỉ trạng thái Khởi tạo thì được phép xóa đơn hàng */}
                {!priceList.used && validAction('delete') && tab === 1 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(priceList)}
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
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      handleViewHistory,
      list,
      pagination,
      sorter,
      translate,
      validAction,
      tab,
      handleChangeRequestState,
    ],
  );

  return (
    <>
      <Table
        dataSource={list}
        columns={columns}
        size="small"
        tableLayout="fixed"
        loading={loading}
        rowKey={nameof(previewModel.id)}
        pagination={pagination}
        // rowSelection={rowSelection}
        onChange={handleTableChange}
        className="table-none-row-selection"
        title={() => (
          <>
            <div className="d-flex justify-content-between">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('create') && (
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleGoCreate}
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

      <PreviewPriceList
        model={model}
        setModel={setModel}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
        previewLoading={previewLoading}
        loading={loading}
      />
    </>
  );
}
export default PriceListTab;
