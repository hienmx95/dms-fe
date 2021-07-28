import { Modal, Popconfirm } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';

import { API_SHOWING_ORDER_WITHDRAW_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';

import { ShowingOrderWithdraw } from 'models/posm/ShowingOrderWithdraw';
import { Store } from 'models/Store';

import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { showingOrderService } from '../../ShowingOrderService';

import '../ShowingOrderContentTable/ShowingOrderContentTable.scss';
import { StoreFilter } from 'models/StoreFilter';
import StoreModal from '../StoreModal';
import { showingOrderWithdrawRepository } from '../../ShowingOrderWithdrawRepository';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { storeRepository } from '../../../../StoreView/StoreRepository';

const { Item: FormItem } = Form;

export interface ShowingOrderWithdrawContentTableProps {
  showingOrderWithdraw?: ShowingOrderWithdraw;
  setShowingOrderWithdraw?: Dispatch<SetStateAction<ShowingOrderWithdraw>>;
  isDetail?: boolean;
}

function ShowingListStoreTable(props: ShowingOrderWithdrawContentTableProps) {
  const [translate] = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { validAction } = crudService.useAction(
    'showing-order-with-draw',
    API_SHOWING_ORDER_WITHDRAW_ROUTE,
  );
  const { showingOrderWithdraw, setShowingOrderWithdraw, isDetail } = props;

  const [stores, setStores] = crudService.useContentTable<
    ShowingOrderWithdraw,
    Store
  >(
    showingOrderWithdraw,
    setShowingOrderWithdraw,
    nameof(showingOrderWithdraw.stores),
  );

  const [showingStoreFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(stores, showingStoreFilter, setStoreFilter);

  const [selectedContents, setSelectedContents] = React.useState<Store[]>([]);

  const rowSelection: TableRowSelection<Store> = crudService.useContentModalList<
    Store
  >(selectedContents, setSelectedContents);

  const {
    loadList,
    setLoadList,
    isOpen,
    setIsOpen,
    selectedList,
    setSelectedList,
    handleCloseStoreModal,
    filterStore,
    setFilterStore,
  } = showingOrderService.useModal(StoreFilter);

  const handleOpenStoreModal = React.useCallback(() => {
    if (typeof showingOrderWithdraw.organizationId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('stores.errors.organizationId'),
      });
    } else {
      if (stores?.length > 0) {
        setSelectedList([...stores]);
      }

      setIsOpen(true);
      setLoadList(true);
      filterStore.organizationId.equal = showingOrderWithdraw?.organization?.id;
      setFilterStore({ ...filterStore });
    }
  }, [
    filterStore,
    setFilterStore,
    setIsOpen,
    setLoadList,
    showingOrderWithdraw,
    setSelectedList,
    stores,
    translate,
  ]);

  const handleSaveStore = React.useCallback(
    list => {
      showingOrderWithdraw.stores = list;
      setStores([...list]);
      setShowingOrderWithdraw({ ...showingOrderWithdraw });
      setIsOpen(false);
    },
    [setIsOpen, setShowingOrderWithdraw, showingOrderWithdraw, setStores],
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        stores.splice(index, 1);
        setStores([...stores]);
        setSelectedList([...stores]);
      };
    },
    [stores, setStores, setSelectedList],
  );

  const [
    handleImport,
    importERouteContents,
    setImportERouteContents,
    errVisible,
    setErrVisible,
    errModel,
    inputRef,
  ] = showingOrderService.useImport(
    storeRepository.import,
    setLoading,
    showingStoreFilter,
  );

  React.useEffect(() => {
    if (importERouteContents && importERouteContents.length > 0) {
      setStores(importERouteContents);
      setImportERouteContents([]);
    }
  }, [importERouteContents, setImportERouteContents, setStores]);

  const [handleExport] = showingOrderService.useExport(
    storeRepository.export,
    showingStoreFilter,
  );

  const [handleExportTemplate] = showingOrderService.useExport(
    storeRepository.exportTemplate,
    showingStoreFilter,
  );

  const handleExportTemplateStore = React.useCallback(() => {
    if (typeof showingOrderWithdraw.organizationId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('stores.errors.organization'),
      });
    } else {
      handleExportTemplate();
    }

    // openModal
  }, [showingOrderWithdraw, translate, handleExportTemplate]);

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: Store) => content.id,
          );
          const remainContents = stores.filter((content: Store) => {
            if (selectedStoreIds.includes(content.id)) {
              return false;
            }
            return true;
          });
          setSelectedList([...remainContents]);

          setStores([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [stores, selectedContents, setStores, translate, setSelectedList]);

  const columns: ColumnProps<Store>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Store>(pagination),
      },

      {
        title: translate('showingOrders.stores.codeDraft'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.address'),
        key: nameof(dataSource[0].address),
        dataIndex: nameof(dataSource[0].address),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.telephone'),
        key: nameof(dataSource[0].telephone),
        dataIndex: nameof(dataSource[0].telephone),
        ellipsis: true,
      },

      {
        key: nameof(dataSource[0].storeType),
        dataIndex: nameof(dataSource[0].storeType),
        title: translate('showingOrders.stores.storeType'),
        render(storeType) {
          return storeType?.name;
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        dataIndex: nameof(dataSource[0].id),
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="button-action-table">
              {validAction('create') && (
                <Popconfirm
                  placement="left"
                  title={translate('general.delete.content')}
                  onConfirm={handleDelete(index)}
                  okText={translate('general.actions.delete')}
                  cancelText={translate('general.actions.cancel')}
                >
                  <button className="btn btn-link mr-2">
                    <i className="tio-delete_outlined" />
                  </button>
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, translate, validAction],
  );

  return (
    <>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        rowSelection={rowSelection}
        loading={loading}
        className="table-content-item"
        scroll={{ y: 700 }}
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listStore') && (
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenStoreModal}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate('general.actions.addNew')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      onClick={handleBulkDelete}
                      disabled={!selectedContents.length}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                    {
                      <label
                        className="btn btn-sm btn-outline-primary mr-2 mb-0"
                        htmlFor="master-import"
                      >
                        <i className="tio-file_add_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.import)}
                      </label>
                    }

                    {isDetail && (
                      <button
                        className="btn btn-sm btn-outline-primary mr-2"
                        onClick={handleExport}
                      >
                        <i className="tio-file_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.export)}
                      </button>
                    )}
                    {
                      <button
                        className="btn btn-sm btn-export-template mr-2"
                        onClick={handleExportTemplateStore}
                      >
                        <i className="tio-download_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.exportTemplate)}
                      </button>
                    }
                  </>
                )}
              </div>
            </div>
          </>
        )}
      />
      {stores?.length === 0 && (
        <FormItem
          validateStatus={formService.getValidationStatus<ShowingOrderWithdraw>(
            showingOrderWithdraw.errors,
            nameof(showingOrderWithdraw.stores),
          )}
          help={showingOrderWithdraw.errors?.stores}
          className="indirect-sales-order-content"
        ></FormItem>
      )}

      <StoreModal
        isOpen={isOpen}
        onClose={handleCloseStoreModal}
        onSave={handleSaveStore}
        isSave={true}
        pagination={pagination}
        getList={showingOrderWithdrawRepository.listStore}
        count={showingOrderWithdrawRepository.countStore}
        loadList={loadList}
        setLoadList={setLoadList}
        setSelectedList={setSelectedList}
        selectedList={selectedList}
        modelFilterClass={StoreFilter}
        filter={filterStore}
        setFilter={setFilterStore}
      />
      {
        <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          ref={inputRef}
        />
      }

      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </>
  );
}
export default ShowingListStoreTable;
