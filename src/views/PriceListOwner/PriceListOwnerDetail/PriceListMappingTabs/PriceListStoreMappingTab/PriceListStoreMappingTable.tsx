import { Popconfirm, Spin } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import {
  PriceList,
  PriceListStoreMappings,
  PriceListStoreMappingsFilter,
} from 'models/priceList/PriceList';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Store } from 'models/Store';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import nameof from 'ts-nameof.macro';
import { priceListOwnerRepository } from 'views/PriceListOwner/PriceListOwnerRepository';
import { priceListOwnerService } from 'views/PriceListOwner/PriceListOwnerService';
import PriceListStoreMappingModal from './PriceListStoreMappingModal';

export interface PriceListStoreMappingTabProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  isPreview?: boolean;
}

export default function PriceListStoreMappingTable(
  props: PriceListStoreMappingTabProps,
) {
  const { model, setModel, isPreview } = props;

  const {
    translate,
    dataSource,
    pagination,
    handleTableChange,
    handleBulkDelete,
    handleOpenModal,
    handleCloseModal,
    isOpen,
    loadList,
    setLoadList,
    selectedList,
    setSelectedList,
    rowSelection,
    hasSelect,
    handleDeleteContent,
    filter: priceListStoreMappingsFilter,
    setFilter,
    handleFilter,
    content,
    setContent,
  } = priceListOwnerService.usePriceListMappingTable<
    PriceListStoreMappings,
    Store,
    PriceListStoreMappingsFilter
  >(
    PriceListStoreMappingsFilter,
    model,
    setModel,
    nameof(model.priceListStoreMappings),
    nameof(model.priceListStoreMappings[0].store),
    mapper,
    isPreview,
  );

  /* receive content from BE and update them */
  const { handleSuccess } = priceListOwnerService.useImportContentHandler<
    PriceListStoreMappings,
    Store,
    PriceListStoreMappingsFilter
  >(
    PriceListStoreMappingsFilter,
    setContent,
    setSelectedList,
    setFilter,
    nameof(content[0].store),
  );

  const {
    ref,
    loading,
    errVisible,
    setErrVisible,
    errorModel,
    handleChange,
    handleClick,
  } = priceListOwnerService.useImport<PriceListStoreMappings>(
    priceListOwnerRepository.importStore,
    model.id,
    handleSuccess,
  );

  /* export service */
  const { handleExport, handleExportTemplate } = priceListOwnerService.useExport(
    priceListOwnerRepository.exportStore,
    priceListOwnerRepository.exportTemplateStore,
    model,
  );

  const {
    storeTypeFilter,
    setStoreTypeFilter,
    provinceFilter,
    setProvinceFilter,
    storeGroupingFilter,
    setStoreGroupingFilter,
  } = usePriceListStoreMappingFilter();

  /* saveModal method, filter noteSelectedIds and create new Contents */
  const handleSaveModal = useCallback(
    (list: Store[]) => {
      if (list?.length > 0) {
        if (content.length > 0) {
          const listIds = list.map(item => item.id);
          const selectedIds = content.map(item => item.storeId);
          // merge old and new content
          list
            .filter((store: Store) => !selectedIds.includes(store.id))
            .forEach((store: Store) => {
              content.push(mapper(store));
            });
          // remove contents which id not included in list ids
          const newContent = content.filter((item: PriceListStoreMappings) =>
            listIds.includes(item.storeId),
          );
          setContent([...newContent]);
          return;
        }
        const newContents = list.map((store: Store) => mapper(store));
        setContent([...newContents]);
        return;
      }
      // if list empty, setContent to []
      setContent([]);
    },
    [content, setContent],
  );


  const columns: ColumnProps<PriceListStoreMappings>[] = useMemo(
    () => [
      {
        title: () => <>{translate(generalLanguageKeys.columns.index)}</>,
        children: [
          {
            title: '',
            key: nameof(generalLanguageKeys.columns.index),
            width: generalColumnWidths.index,
            render: renderMasterIndex<PriceListStoreMappings>(pagination),
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.code')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListStoreMappingsFilter.storeCode.contain,
                )}
                filter={priceListStoreMappingsFilter.storeCode}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.storeCode),
                )}
                className="w-100"
                placeholder={translate('priceLists.store.placeholder.code')}
              />
            ),
            key: nameof(dataSource[0].code),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(item: Store) {
              return item?.code;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.codeDraft')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListStoreMappingsFilter.storeCodeDraft.contain,
                )}
                filter={priceListStoreMappingsFilter.storeCodeDraft}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.storeCodeDraft),
                )}
                className="w-100"
                placeholder={translate('priceLists.store.placeholder.code')}
              />
            ),
            key: nameof(dataSource[0].storeCodeDraft),
            dataIndex: nameof(dataSource[0].storeCodeDraft),
            ellipsis: true,
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.name')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListStoreMappingsFilter.storeName.contain,
                )}
                filter={priceListStoreMappingsFilter.storeName}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.storeName),
                )}
                className="w-100"
                placeholder={translate('priceLists.store.name')}
              />
            ),
            key: nameof(dataSource[0].name),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(item: Store) {
              return item?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.storeType')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedIdFilter
                filter={priceListStoreMappingsFilter.storeTypeId}
                filterType={nameof(
                  priceListStoreMappingsFilter.storeTypeId.equal,
                )}
                value={priceListStoreMappingsFilter.storeTypeId.equal}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.storeTypeId),
                )}
                getList={priceListOwnerRepository.singleListStoreType}
                modelFilter={storeTypeFilter}
                setModelFilter={setStoreTypeFilter}
                searchField={nameof(storeTypeFilter.name)}
                searchType={nameof(storeTypeFilter.name.contain)}
                placeholder={translate('priceLists.store.storeType')}
              />
            ),
            key: nameof(dataSource[0].storeType),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(item: Store) {
              return item?.storeType?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.province')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedIdFilter
                filter={priceListStoreMappingsFilter.provinceId}
                filterType={nameof(
                  priceListStoreMappingsFilter.provinceId.equal,
                )}
                value={priceListStoreMappingsFilter.provinceId.equal}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.provinceId),
                )}
                getList={priceListOwnerRepository.singleListProvince}
                modelFilter={provinceFilter}
                setModelFilter={setProvinceFilter}
                searchField={nameof(provinceFilter.name)}
                searchType={nameof(provinceFilter.name.contain)}
                placeholder={translate('priceLists.store.province')}
              />
            ),
            key: nameof(dataSource[0].province),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(item: Store) {
              return item?.province?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.store.storeGrouping')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedIdFilter
                filter={priceListStoreMappingsFilter.storeGroupingId}
                filterType={nameof(
                  priceListStoreMappingsFilter.storeGroupingId.equal,
                )}
                value={priceListStoreMappingsFilter.storeGroupingId.equal}
                onChange={handleFilter(
                  nameof(priceListStoreMappingsFilter.storeGroupingId),
                )}
                getList={priceListOwnerRepository.singleListStoreGrouping}
                modelFilter={storeGroupingFilter}
                setModelFilter={setStoreGroupingFilter}
                searchField={nameof(storeGroupingFilter.name)}
                searchType={nameof(storeGroupingFilter.name.contain)}
                placeholder={translate('priceLists.store.storeGrouping')}
              />
            ),
            key: nameof(dataSource[0].storeGrouping),
            dataIndex: nameof(dataSource[0].store),
            ellipsis: true,
            render(item: Store) {
              return item?.storeGrouping?.name;
            },
          },
        ],
      },
      !isPreview
        ? {
          title: () => <>{translate(generalLanguageKeys.actions.label)}</>,
          children: [
            {
              title: '',
              key: nameof(generalLanguageKeys.actions),
              width: generalColumnWidths.actions,
              render(
                ...params: [
                  PriceListStoreMappings,
                  PriceListStoreMappings,
                  number,
                ]
              ) {
                return (
                  <div className="button-action-table">
                    {/* {validAction('create') && ( */}
                    <Popconfirm
                      placement="left"
                      title={translate('general.delete.content')}
                      onConfirm={handleDeleteContent(
                        params[1],
                        params[1].tableIndex, // just reserving indexIn Content for deleting exactly
                      )}
                      okText={translate('general.actions.delete')}
                      cancelText={translate('general.actions.cancel')}
                    >
                      <button className="btn btn-link mr-2">
                        <i className="tio-delete_outlined" />
                      </button>
                    </Popconfirm>
                    {/* )} */}
                  </div>
                );
              },
            },
          ],
        }
        : {
          width: 0,
        },
    ],
    [
      dataSource,
      handleDeleteContent,
      handleFilter,
      isPreview,
      pagination,
      priceListStoreMappingsFilter.provinceId,
      priceListStoreMappingsFilter.storeCode,
      priceListStoreMappingsFilter.storeCodeDraft,
      priceListStoreMappingsFilter.storeGroupingId,
      priceListStoreMappingsFilter.storeName,
      priceListStoreMappingsFilter.storeTypeId,
      provinceFilter,
      setProvinceFilter,
      setStoreGroupingFilter,
      setStoreTypeFilter,
      storeGroupingFilter,
      storeTypeFilter,
      translate,
    ],
  );

  return (
    <>
      {/* StoreTable */}
      <Table
        pagination={pagination}
        rowKey={nameof(dataSource[0].key)}
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        className="table-content-item"
        scroll={{ y: 700 }}
        title={() => (
          <>
            {!isPreview && (
              <div className="d-flex justify-content-between button-table">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {/* {validAction('listItem') && ( */}
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenModal}
                    // disabled={
                    //   model.requestStateId === 2 || model.requestStateId === 3
                    // }
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate('general.actions.addNew')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      onClick={handleBulkDelete}
                      disabled={!hasSelect}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                    {loading ? (
                      <Spin spinning={loading} size="small" />
                    ) : (
                        <label
                          className="btn btn-sm btn-outline-primary mr-2 mb-0"
                          htmlFor="master-import-store"
                        >
                          <i className="tio-file_add_outlined mr-2" />
                          {translate(generalLanguageKeys.actions.import)}
                        </label>
                      )}

                    {model.id !== 0 && typeof model.id !== 'undefined' && (
                      <button
                        className="btn btn-sm btn-outline-primary mr-2"
                        onClick={handleExport}
                      >
                        <i className="tio-file_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.export)}
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-export-template mr-2"
                      onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
                    </button>
                  </>
                </div>
              </div>
            )}
          </>
        )}
      />
      {/* input import file */}
      <input
        ref={ref}
        type="file"
        className="hidden"
        id="master-import-store"
        onChange={handleChange}
        onClick={handleClick}
      />
      {/* StoreModal */}
      <PriceListStoreMappingModal
        model={model} // pass model to filter orgUnit by model.orgUnit path
        isOpen={isOpen}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
        loadList={loadList}
        setLoadList={setLoadList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
      {typeof errorModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errorModel}
        />
      )}
    </>
  );
}

function usePriceListStoreMappingFilter() {
  const [storeTypeFilter, setStoreTypeFilter] = useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );
  const [provinceFilter, setProvinceFilter] = useState<ProvinceFilter>(
    new ProvinceFilter(),
  );
  const [storeGroupingFilter, setStoreGroupingFilter] = useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());
  return {
    storeTypeFilter,
    setStoreTypeFilter,
    provinceFilter,
    setProvinceFilter,
    storeGroupingFilter,
    setStoreGroupingFilter,
  };
}

function mapper(model: PriceListStoreMappings | Store): PriceListStoreMappings {
  if (model.hasOwnProperty('store')) {
    const { store } = model;
    return {
      ...model,
      storeId: store?.id,
      storeCode: store?.code,
      storeCodeDraft: store?.codeDraft,
      storeName: store?.name,
      storeTypeId: store?.storeTypeId,
      provinceId: store?.provinceId,
      storeGroupingId: store?.storeGroupingId,
      storeType: store?.storeType,
      storeGrouping: store?.storeGrouping,
      province: store?.province,
    };
  }
  return mapper({ ...new PriceListStoreMappings(), store: model });
}
