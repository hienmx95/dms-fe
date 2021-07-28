import { Popconfirm, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import InputNumber from 'components/InputNumber/InputNumber';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { indexInContent, renderMasterIndex } from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import {
  PriceList,
  PriceListItemMappings,
  PriceListItemMappingsFilter,
} from 'models/priceList/PriceList';
import { ProductGrouping } from 'models/ProductGrouping';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { priceListRepository } from 'views/PriceList/PriceListRepository';
import { priceListService } from 'views/PriceList/PriceListService';
import PriceListItemHistoryModal from './PriceListItemHistoryModal';
import PriceListItemMappingModal from './PriceListItemMappingModal';

export interface PriceListItemMappingTabProps {
  model: PriceList;
  setModel: Dispatch<SetStateAction<PriceList>>;
  isPreview?: boolean;
}

export default function PriceListItemMappingTable(
  props: PriceListItemMappingTabProps,
) {
  const { model, setModel, isPreview } = props;

  const {
    translate,
    dataSource,
    pagination,
    handleTableChange,
    handleBulkDelete,
    handleDeleteContent,
    rowSelection,
    hasSelect,
    handleOpenModal,
    handleCloseModal,
    isOpen,
    loadList,
    setLoadList,
    selectedList,
    setSelectedList,
    handleChangeListSimpleField: handleChangeValue,
    filter: priceListItemMappingsFilter,
    setFilter,
    handleFilter,
    content,
    setContent,
  } = priceListService.usePriceListMappingTable<
    PriceListItemMappings,
    Item,
    PriceListItemMappingsFilter
  >(
    PriceListItemMappingsFilter,
    model,
    setModel,
    nameof(model.priceListItemMappings),
    nameof(model.priceListItemMappings[0].item),
    mapper,
    isPreview,
  );

  const {
    isOpen: historyOpen,
    loadList: historyLoadList,
    setLoadList: historySetLoadList,
    handleOpenModal: handleOpenHistoryModal,
    handleCloseModal: handleCloseHistoryModal,
    selectedList: historySelectedList,
    setSelectedList: historySetSelectedList,
    itemId,
  } = priceListService.useSimpleModal<any>();

  /* receive content from BE and update them */
  const { handleSuccess } = priceListService.useImportContentHandler<
    PriceListItemMappings,
    Item,
    PriceListItemMappingsFilter
  >(
    PriceListItemMappingsFilter,
    setContent,
    setSelectedList,
    setFilter,
    nameof(content[0].item),
  );

  /* import service */
  const {
    ref,
    loading,
    errVisible,
    setErrVisible,
    errorModel,
    handleChange,
    handleClick,
  } = priceListService.useImport<PriceListItemMappings>(
    priceListRepository.importItem,
    model.id,
    handleSuccess,
  );

  /* export service */
  const { handleExport, handleExportTemplate } = priceListService.useExport(
    priceListRepository.exportItem,
    priceListRepository.exportTemplateItem,
    model,
  );

  /* saveModal method, filter noteSelectedIds and create new Contents */
  const handleSaveModal = useCallback(
    (list: Item[]) => {
      if (list?.length > 0) {
        if (content.length > 0) {
          const listIds = list.map(item => item.id);
          const selectedIds = content.map(item => item.itemId);
          // merge old and new content
          list
            .filter((item: Item) => !selectedIds.includes(item.id))
            .forEach((item: Item) => {
              content.push(mapper(item));
            });
          // remove contents which id not included in list ids
          const newContent = content.filter((item: PriceListItemMappings) =>
            listIds.includes(item.itemId),
          );
          setContent([...newContent]);
          return;
        }
        const newContents = list.map((item: Item) => mapper(item));
        setContent([...newContents]);
        return;
      }
      // if list empty, setContent to []
      setContent([]);
    },
    [content, setContent],
  );

  const columns: ColumnProps<PriceListItemMappings>[] = useMemo(
    () => [
      {
        title: () => <>{translate(generalLanguageKeys.columns.index)}</>,
        children: [
          {
            title: '',
            key: nameof(generalLanguageKeys.columns.index),
            width: generalColumnWidths.index,
            render: renderMasterIndex<PriceListItemMappings>(pagination),
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.item.code')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListItemMappingsFilter.itemCode.contain,
                )}
                filter={priceListItemMappingsFilter.itemCode}
                onChange={handleFilter(
                  nameof(priceListItemMappingsFilter.itemCode),
                )}
                className="w-100"
                placeholder={translate('priceLists.item.code')}
              />
            ),
            key: nameof(dataSource[0].code),
            dataIndex: nameof(dataSource[0].item),
            ellipsis: true,
            render(item: Item) {
              return item?.code;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.item.name')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListItemMappingsFilter.itemName.contain,
                )}
                filter={priceListItemMappingsFilter.itemName}
                onChange={handleFilter(
                  nameof(priceListItemMappingsFilter.itemName),
                )}
                className="w-100"
                placeholder={translate('priceLists.item.name')}
              />
            ),
            key: nameof(dataSource[0].name),
            dataIndex: nameof(dataSource[0].item),
            ellipsis: true,
            render(item: Item) {
              return item?.name;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.item.itemScanCode')}</div>
          </>
        ),
        children: [
          {
            title: () => (
              <AdvancedStringFilter
                filterType={nameof(
                  priceListItemMappingsFilter.itemScanCode.contain,
                )}
                filter={priceListItemMappingsFilter.itemScanCode}
                onChange={handleFilter(
                  nameof(priceListItemMappingsFilter.itemScanCode),
                )}
                className="w-100"
                placeholder={translate('priceLists.item.itemScanCode')}
              />
            ),
            key: nameof(dataSource[0].itemScanCode),
            dataIndex: nameof(dataSource[0].item),
            ellipsis: true,
            render(item: Item) {
              return item?.scanCode;
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.item.productGrouping')}</div>
          </>
        ),
        children: [
          {
            title: () => '',
            key: nameof(dataSource[0].productGroupings),
            dataIndex: nameof(dataSource[0].productGroupings),
            ellipsis: true,
            render(items: ProductGrouping[]) {
              return (
                <>
                  {items &&
                    items.length > 0 &&
                    items.map(item => (
                      <div
                        key={item.id ? item.id : uuidv4()}
                        className="p-1 mb-1"
                        style={{
                          background: '#f0f0f0',
                          borderRadius: 5,
                          border: '1px solid #eeeeee',
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                </>
              );
            },
          },
        ],
      },
      {
        title: () => (
          <>
            <div>{translate('priceLists.price')}</div>
          </>
        ),
        children: [
          {
            title: () => '',
            key: nameof(dataSource[0].price),
            dataIndex: nameof(dataSource[0].price),
            ellipsis: true,
            render(...[price, , index]) {
              return (
                <InputNumber
                  min={0}
                  disabled={isPreview}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  defaultValue={price}
                  onChange={handleChangeValue(
                    nameof(price),
                    indexInContent(index),
                  )}
                />
              );
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
                  PriceListItemMappings,
                  PriceListItemMappings,
                  number,
                ]
              ) {
                return (
                  <div className="button-action-table">
                    {/* {validAction('create') && ( */}
                    {model.id && (
                      <Tooltip
                        title={translate('storeProblemMonitors.history')}
                      >
                        <button
                          className="btn btn-sm"
                          onClick={handleOpenHistoryModal(params[0].itemId)}
                        >
                          <i className="tio-history" />
                        </button>
                      </Tooltip>
                    )}
                    {/* )} */}
                    {/* {validAction('create') && ( */}
                    <Popconfirm
                      placement="left"
                      title={translate('general.delete.content')}
                      onConfirm={handleDeleteContent(
                        params[1],
                        params[1].tableIndex,
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
      handleChangeValue,
      handleDeleteContent,
      handleFilter,
      handleOpenHistoryModal,
      isPreview,
      model.id,
      pagination,
      priceListItemMappingsFilter.itemCode,
      priceListItemMappingsFilter.itemName,
      priceListItemMappingsFilter.itemScanCode,
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
                          htmlFor="master-import-item"
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
                  {/* )} */}
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
        id="master-import-item"
        onChange={handleChange}
        onClick={handleClick}
      />
      {/* ItemModal */}
      <PriceListItemMappingModal
        isOpen={isOpen}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
        loadList={loadList}
        setLoadList={setLoadList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
      {/* HistoryModal */}
      <PriceListItemHistoryModal
        modelId={model.id}
        itemId={itemId}
        isOpen={historyOpen}
        onClose={handleCloseHistoryModal}
        loadList={historyLoadList}
        setLoadList={historySetLoadList}
        selectedList={historySelectedList}
        setSelectedList={historySetSelectedList}
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

function mapper(model: PriceListItemMappings | Item): PriceListItemMappings {
  if (model.hasOwnProperty('item')) {
    const { item } = model;
    return {
      ...model,
      itemId: item?.id,
      itemCode: item?.code,
      itemName: item?.name,
      itemScanCode: item?.scanCode,
      productGroupings: item?.product?.productProductGroupingMappings.map(
        ({ productGrouping }) => ({ ...productGrouping }),
      ),
    };
  }
  return mapper({ ...new PriceListItemMappings(), item: model });
}
