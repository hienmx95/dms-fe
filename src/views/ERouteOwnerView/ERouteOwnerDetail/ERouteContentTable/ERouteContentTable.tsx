import { Checkbox, Modal, Popconfirm } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import classNames from 'classnames';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import { indexInContent, renderMasterIndex } from 'helpers/ant-design/table';
import { ERoute } from 'models/ERoute';
import { ERouteContent } from 'models/ERouteContent';
import { ERouteContentFilter } from 'models/ERouteContentFilter';
import { ERouteFilter } from 'models/ERouteFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteOwnerService } from 'views/ERouteOwnerView/ERouteOwnerMaster/ERouteOwnerService';
import { eRouteOwnerRepository } from 'views/ERouteOwnerView/ERouteOwnerRepository';
import ERouteContentStoreMappingModal from './ERouteContentStoreMappingModal';
import './ERouteContentTable.scss';

export interface ERouteContentTableProps {
  eRoute: ERoute;
  setERoute: Dispatch<SetStateAction<ERoute>>;
  isDetail?: boolean;
}
function ERouteContentTable(props: ERouteContentTableProps) {
  const { eRoute, setERoute, isDetail } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('e-route', API_E_ROUTE_ROUTE);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [eRouteContents, setERouteContents] = crudService.useContentTable<
    ERoute,
    ERouteContent
  >(eRoute, setERoute, nameof(eRoute.eRouteContents));


  const [eRouteContentFilter, setRouteContentFilter] = React.useState<
    ERouteContentFilter
  >(new ERouteContentFilter());

  const [selectedContents, setSelectedContents] = React.useState<
    ERouteContent[]
  >([]);

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    eRouteContents,
    eRouteContentFilter,
    setRouteContentFilter,
  );

  const rowSelection: TableRowSelection<ERouteContent> = crudService.useContentModalList<
    ERouteContent
  >(selectedContents, setSelectedContents);

  const [eRouteFilter] = React.useState<ERouteFilter>(
    new ERouteFilter(),
  );
  React.useEffect(() => {
    if (eRoute.id === undefined) {
      eRouteFilter.id.equal = Number(0);
    } else {
      eRouteFilter.id.equal = eRoute.id;
    }
  }, [eRoute.id, eRouteFilter.id.equal]);
  const [
    handleImport,
    importERouteContents,
    setImportERouteContents,
    errVisible,
    setErrVisible,
    errModel,
    inputRef,
  ] = eRouteOwnerService.useImport(
    eRouteOwnerRepository.import,
    setLoading,
    eRouteFilter,
  );
  const [handleExport] = eRouteOwnerService.useExport(eRouteOwnerRepository.export, eRoute);

  const [handleExportTemplate] = eRouteOwnerService.useExport(
    eRouteOwnerRepository.exportTemplate,
    eRoute,
  );
  React.useEffect(() => {
    if (importERouteContents && importERouteContents.length > 0) {
      setERouteContents(importERouteContents);
      setImportERouteContents([]);
    }
  }, [importERouteContents, setERouteContents, setImportERouteContents]);

  const {
    loadList,
    setLoadList,
    handleOpenModal,
    handleSave,
    isOpen,
    selectedList,
    setSelectedList,
    handleCloseModal,
    filter,
    setFilter,
  } = modalService.useModal(
    StoreFilter,
  );

  const handleOpen = React.useCallback(() => {

    if (typeof eRoute.saleEmployeeId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('eRouteContents.errors.saleEmployee'),
      });
    } else {
      if (eRouteContents?.length > 0) {
        // const list = eRouteContents.map(item => item.store);
        setSelectedList(eRouteContents.map(item => item.store)); // map selectedList
      }

      setFilter({
        ...filter, saleEmployeeId: {
          equal: eRoute.saleEmployeeId,
        },
      }); // update filter

      handleOpenModal();
    }

    // openModal
  }, [eRoute.saleEmployeeId, eRouteContents, setFilter, filter, handleOpenModal, translate, setSelectedList]);
  const handleExportTemplateERoute = React.useCallback(() => {

    if (typeof eRoute.saleEmployeeId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('eRouteContents.errors.saleEmployee'),
      });
    } else {
      handleExportTemplate();
    }

    // openModal
  }, [eRoute.saleEmployeeId, translate, handleExportTemplate]);



  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        eRouteContents.splice(index, 1);
      }
      setERouteContents([...eRouteContents]);
    },
    [eRouteContents, setERouteContents],
  );

  const updateContentFromSelectedList = React.useCallback(
    (selectedStores: Store[]) => {
      if (eRouteContents) {
        if (selectedStores && selectedStores?.length > 0) {
          const listStoreIds = selectedStores.map(store => store.id);
          const usedStoreIds = eRouteContents.map(content => content.storeId);
          selectedStores.forEach((i: Store) => {
            const content = new ERouteContent();
            content.store = i;
            content.storeId = i?.id;
            if (eRouteContents.length > 0) {
              // add unused stores
              if (!usedStoreIds.includes(i.id)) {
                eRouteContents.push(content);
              }
            } else {
              eRouteContents.push(content);
            }
          });
          // remove content which used removed stores
          const newContents = eRouteContents.filter(content =>
            listStoreIds.includes(content.storeId),
          );
          setERouteContents([...newContents]);
          return;
        }
        // if no store selected, remove all contents
        setERouteContents([]);
      }
    },
    [eRouteContents, setERouteContents],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: ERouteContent) => content.storeId,
          );
          const remainContents = eRouteContents.filter(
            (content: ERouteContent) => {
              if (selectedStoreIds.includes(content.storeId)) {
                return false;
              }
              return true;
            },
          );
          setERouteContents([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [eRouteContents, selectedContents, setERouteContents, translate]);

  const handleChangeCheckbox = React.useCallback(
    (field, index) => {
      return (ev: CheckboxChangeEvent) => {
        // find content which need modify
        const content = eRouteContents[index];
        // modify value of content field
        content[field] = ev.target?.checked;
        // setList
        setERouteContents([...eRouteContents]);
      };
    },
    [eRouteContents, setERouteContents],
  );

  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        title: '',
        children: [
          {
            title: translate(generalLanguageKeys.columns.index),
            key: nameof(generalLanguageKeys.index),
            width: generalColumnWidths.index,
            render: renderMasterIndex<ERouteContent>(pagination),
          },
          {
            title: translate('eRouteContents.store.code'),
            key: nameof(dataSource[0].code),
            dataIndex: nameof(dataSource[0].store),
            width: 150,
            ellipsis: true,
            render(store: Store) {
              return store?.code;
            },
          },
          {
            title: translate('eRouteContents.store.codeDraft'),
            key: nameof(dataSource[0].codeDraft),
            dataIndex: nameof(dataSource[0].store),
            width: 150,
            ellipsis: true,
            render(store: Store) {
              return store?.codeDraft;
            },
          },
          {
            title: translate('eRouteContents.store.name'),
            key: nameof(dataSource[0].store.name),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(
              store: Store,
              content: ERouteContent,
            ) {
              return (
                <>
                  <div className={classNames({ 'errors': content.errors?.store }, { '': !content.errors?.store })}>
                    {store?.name}
                  </div>
                  {
                    content.errors && content.errors?.store && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          ERouteContent
                        >(content.errors, nameof(content.store))}
                        help={content.errors?.store}
                        className="validate-store"
                      />
                    )

                  }

                </>
              );
            },
          },
          {
            title: translate('eRouteContents.store.address'),
            key: nameof(dataSource[0].store.address),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(store: Store) {
              return store?.address;
            },
          },
        ],
      },
      {
        title: translate('eRouteContents.frequency'),
        children: [
          {
            title: translate('eRouteContents.monday'),
            key: nameof(dataSource[0].monday),
            dataIndex: nameof(dataSource[0].monday),
            width: 50,
            render(
              monday: boolean,
              content: ERouteContent,
              index: number,
            ) {
              return (
                <>
                  <Checkbox
                    defaultChecked={monday}
                    onChange={handleChangeCheckbox(
                      nameof(monday),
                      indexInContent(index, pagination),
                    )}
                    className={classNames('check-monday', { 'errors': content.errors?.id }, { '': !content.errors?.id })}
                    disabled={
                      eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                    }
                  />
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ERouteContent
                    >(content.errors, nameof(content.id))}
                    help={content.errors?.id}
                    className="validate-e-route-content"
                  />
                </>
              );
            },
          },
          {
            title: translate('eRouteContents.tuesday'),
            key: nameof(dataSource[0].tuesday),
            dataIndex: nameof(dataSource[0].tuesday),
            width: 50,
            render(...[tuesday, , index]) {
              return (
                <Checkbox
                  defaultChecked={tuesday}
                  onChange={handleChangeCheckbox(
                    nameof(tuesday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },

          {
            title: translate('eRouteContents.wednesday'),
            key: nameof(dataSource[0].wednesday),
            dataIndex: nameof(dataSource[0].wednesday),
            width: 50,
            render(...[wednesday, , index]) {
              return (
                <Checkbox
                  defaultChecked={wednesday}
                  onChange={handleChangeCheckbox(
                    nameof(wednesday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
          {
            title: translate('eRouteContents.thursday'),
            key: nameof(dataSource[0].thursday),
            dataIndex: nameof(dataSource[0].thursday),
            width: 50,
            render(...[thursday, , index]) {
              return (
                <Checkbox
                  defaultChecked={thursday}
                  onChange={handleChangeCheckbox(
                    nameof(thursday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
          {
            title: translate('eRouteContents.friday'),
            key: nameof(dataSource[0].friday),
            dataIndex: nameof(dataSource[0].friday),
            width: 50,
            render(...[friday, , index]) {
              return (
                <Checkbox
                  defaultChecked={friday}
                  onChange={handleChangeCheckbox(
                    nameof(friday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },

          {
            title: translate('eRouteContents.saturday'),
            key: nameof(dataSource[0].saturday),
            dataIndex: nameof(dataSource[0].saturday),
            width: 50,
            render(...[saturday, , index]) {
              return (
                <Checkbox
                  defaultChecked={saturday}
                  onChange={handleChangeCheckbox(
                    nameof(saturday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
          {
            title: translate('eRouteContents.sunday'),
            key: nameof(dataSource[0].sunday),
            dataIndex: nameof(dataSource[0].sunday),
            width: 50,
            render(...[sunday, , index]) {
              return (
                <Checkbox
                  defaultChecked={sunday}
                  onChange={handleChangeCheckbox(
                    nameof(sunday),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
          {
            title: translate('eRouteContents.week1'),
            key: nameof(dataSource[0].week1),
            dataIndex: nameof(dataSource[0].week1),
            width: 50,
            render(...[week1, , index]) {
              return (

                <Checkbox
                  defaultChecked={week1}
                  onChange={handleChangeCheckbox(
                    nameof(week1),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />

              );
            },
          },
          {
            title: translate('eRouteContents.week2'),
            key: nameof(dataSource[0].week2),
            dataIndex: nameof(dataSource[0].week2),
            width: 50,
            render(...[week2, , index]) {
              return (
                <Checkbox
                  defaultChecked={week2}
                  onChange={handleChangeCheckbox(
                    nameof(week2),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },

          {
            title: translate('eRouteContents.week3'),
            key: nameof(dataSource[0].week3),
            dataIndex: nameof(dataSource[0].week3),
            width: 50,
            render(...[week3, , index]) {
              return (
                <Checkbox
                  defaultChecked={week3}
                  onChange={handleChangeCheckbox(
                    nameof(week3),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
          {
            title: translate('eRouteContents.week4'),
            key: nameof(dataSource[0].week4),
            dataIndex: nameof(dataSource[0].week4),
            width: 50,
            render(...[week4, , index]) {
              return (
                <Checkbox
                  defaultChecked={week4}
                  onChange={handleChangeCheckbox(
                    nameof(week4),
                    indexInContent(index, pagination),
                  )}
                  disabled={
                    eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                  }
                />
              );
            },
          },
        ],
      },
      eRoute.requestStateId === 1 ?
        {
          title: '',
          children: [
            {
              title: translate(generalLanguageKeys.actions.label),
              key: nameof(generalLanguageKeys.columns.actions),
              dataIndex: nameof(dataSource[0].id),
              width: 50,
              align: 'center',
              render(...[, , index]) {
                return (
                  <div className="button-action-table">
                    <Popconfirm
                      placement="top"
                      title={translate('general.delete.content')}
                      onConfirm={() =>
                        handleDeleteItem(indexInContent(index, pagination))
                      }
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
        } : {
          width: 0,
        },
    ];
  }, [dataSource, handleChangeCheckbox, handleDeleteItem, pagination, translate, eRoute.requestStateId]);

  return (
    <>

      <Table
        dataSource={dataSource}
        rowKey={nameof(dataSource[0].key)}
        columns={columns}
        size="small"
        tableLayout="fixed"
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        className="table-content"
        loading={loading}
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listStore') && (
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleOpen}
                    disabled={
                      eRoute.requestStateId === 2 || eRoute.requestStateId === 3
                    }
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate('eRouteContents.create')}
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger mr-2"
                  disabled={!selectedContents.length || eRoute.requestStateId === 2 || eRoute.requestStateId === 3}
                  onClick={handleBulkDelete}
                >
                  <i className="fa mr-2 fa-trash" />
                  {translate(generalLanguageKeys.actions.delete)}
                </button>
                {validAction('import') && (
                  <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    <i className="tio-file_add_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                )}

                {validAction('export') && isDetail && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                )}
                {validAction('exportTemplate') && (
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplateERoute}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
                )}
              </div>
              <div className="flex-shrink-1 d-flex align-items-center mr-2">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination?.total,
                })}
              </div>
            </div>
          </>
        )}
      />

      <FormItem
        validateStatus={formService.getValidationStatus<ERoute>(
          eRoute.errors,
          nameof(eRoute.eRouteContents),
        )}
        help={eRoute.errors?.eRouteContents}
        className="form-eroute-content"
      ></FormItem>
      <ERouteContentStoreMappingModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSave={handleSave(updateContentFromSelectedList)}
        isSave={true}
        pagination={pagination}
        getList={eRouteOwnerRepository.listStore}
        count={eRouteOwnerRepository.countStore}
        loadList={loadList}
        setLoadList={setLoadList}
        setSelectedList={setSelectedList}
        selectedList={selectedList}
        modelFilterClass={StoreFilter}
        filter={filter}
        setFilter={setFilter}
        saleEmployeeId={eRoute.saleEmployeeId}
      />
      {validAction('import') && (
        <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          ref={inputRef}
        />
      )}

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

export default ERouteContentTable;
