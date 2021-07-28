import { Modal, Popconfirm } from 'antd';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import { API_KPI_ITEM_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import { indexInContent, renderMasterIndex } from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { KpiItem } from 'models/kpi/KpiItem';
import { KpiItemContent } from 'models/kpi/KpiItemContent';
import { KpiItemContentFilter } from 'models/kpi/KpiItemContentFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiItemRepository } from 'views/KpiItemView/KpiItemRepository';
import { kpiItemService } from 'views/KpiItemView/KpiItemService';
import ItemModal from './ItemModal';
import './KpiItemContentTable.scss';

function KpiItemContentTable(
  props: ContentTableProps<KpiItem, KpiItemContent>,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('kpi-item', API_KPI_ITEM_ROUTE);

  const { model, setModel } = props;

  const [
    kpiItemContents,
    setKpiItemContents,
    ,
    ,
  ] = crudService.useContentTable<KpiItem, KpiItemContent>(
    model,
    setModel,
    nameof(model.kpiItemContents),
  );
  const {
    isOpen,
    loadList,
    setLoadList,
    handleSave,
    handleCloseModal,
    selectedList,
    setSelectedList,
    filter,
    setFilter,
    setIsOpen,
  } = modalService.useModal(ItemFilter);

  const [kpiItemContentFilter, setKpiItemContentFilter] = React.useState<
    KpiItemContentFilter
  >(new KpiItemContentFilter());
  const [changeContent, setChangeContent] = React.useState<boolean>(true);

  const [newContents] = kpiItemService.useKpiContentTable(
    changeContent,
    setChangeContent,
    kpiItemContents,
    setKpiItemContents,
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    newContents,
    kpiItemContentFilter,
    setKpiItemContentFilter,
  );

  // Handling change in content table
  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    KpiItemContent
  >(kpiItemContents, setKpiItemContents);

  const [selectedContents, setSelectedContents] = React.useState<
    KpiItemContent[]
  >([]);

  const rowSelection: TableRowSelection<KpiItemContent> = crudService.useContentModalList<
    KpiItemContent
  >(selectedContents, setSelectedContents);

  const [isNew, setIsNew] = React.useState<boolean>(true);

  // const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpenModal = React.useCallback(() => {
    if (
      typeof model.kpiItemTypeId === 'undefined' ||
      model.kpiItemTypeId === 0
    ) {
      Modal.warning({
        title: '',
        content: translate('kpiItemContents.errors.kpiItemType'),
      });
    } else {
      if (model.kpiItemContents.length === 0) {
        setSelectedList([]);
      }
      setIsNew(true);
      setIsOpen(true);
      setLoadList(true);
    }
  }, [model, setLoadList, translate, setIsOpen, setIsNew, setSelectedList]);

  const handleAddItem = React.useCallback(() => {
    if (kpiItemContents?.length > 0) {
      setSelectedList(kpiItemContents.map(item => item.item)); // map selectedList
    }
    handleOpenModal();
  }, [handleOpenModal, kpiItemContents, setSelectedList]);

  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        newContents.splice(index, 1);
      }
      setKpiItemContents([...newContents]);
    },
    [newContents, setKpiItemContents],
  );
  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedItemIds = selectedContents.map(
            (content: KpiItemContent) => content.itemId,
          );
          const remainContents = kpiItemContents.filter(
            (content: KpiItemContent) => {
              if (selectedItemIds.includes(content.itemId)) {
                return false;
              }
              return true;
            },
          );
          setKpiItemContents([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [kpiItemContents, selectedContents, setKpiItemContents, translate]);

  const updateContentFromSelectedList = React.useCallback(
    (list: Item[]) => {
      if (kpiItemContents) {
        if (kpiItemContents.length > 0) {
          const contentItemIds = kpiItemContents.map(
            (content: KpiItemContent) => content.itemId,
          );
          if (list && list.length > 0) {
            const usedIds = list.map((i: Item) => i.id);
            list.forEach((i: Item) => {
              if (!contentItemIds.includes(i.id)) {
                const content = new KpiItemContent();
                content.item = i;
                content.itemId = i?.id;
                kpiItemContents.push(content);
              }
            });
            const newContents = kpiItemContents.filter(content =>
              usedIds.includes(content.itemId),
            );
            setKpiItemContents([...newContents]);
          } else {
            setKpiItemContents([]);
          }
        } else {
          if (list && list.length > 0) {
            list.forEach((i: Item) => {
              const content = new KpiItemContent();
              content.item = i;
              content.itemId = i?.id;
              kpiItemContents.push(content);
            });
            setKpiItemContents([...kpiItemContents]);
          }
        }
      }
    },
    [kpiItemContents, setKpiItemContents],
  );

  const columns: ColumnProps<KpiItemContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<KpiItemContent>(pagination),
      },
      {
        title: translate('kpiItemContents.itemCode'),
        key: nameof(dataSource[0].item.code),
        dataIndex: nameof(dataSource[0].item),
        width: 250,
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('kpiItemContents.itemName'),
        key: nameof(dataSource[0].item.name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
      },

      // {
      //   title: translate('kpiItemContents.indirectQuantity'),
      //   key: nameof(dataSource[0].indirectQuantity),
      //   dataIndex: nameof(dataSource[0].indirectQuantity),
      //   render(...[indirectQuantity, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={indirectQuantity !== null ? indirectQuantity : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(indirectQuantity),
      //             indexInContent(index, pagination),
      //           )}

      //         />
      //       </>);
      //   },
      // },
      {
        title: translate('kpiItemContents.indirectRevenue'),
        key: nameof(dataSource[0].indirectRevenue),
        dataIndex: nameof(dataSource[0].indirectRevenue),
        render(...[indirectRevenue, , index]) {
          return (
            <>
              <InputNumber
                className="form-control form-control-sm"
                value={indirectRevenue !== null ? indirectRevenue : null}
                min={0}
                allowNegative={false}
                onChange={handleChangeListSimpleField(
                  nameof(indirectRevenue),
                  indexInContent(index, pagination),
                )}
              />
            </>
          );
        },
      },
      // {
      //   title: translate('kpiItemContents.indirectAmount'),
      //   key: nameof(dataSource[0].indirectAmount),
      //   dataIndex: nameof(dataSource[0].indirectAmount),
      //   render(...[indirectAmount, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={indirectAmount !== null ? indirectAmount : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(indirectAmount),
      //             indexInContent(index, pagination),
      //           )}
      //         />
      //       </>
      //     );
      //   },
      // },
      {
        title: translate('kpiItemContents.indirectStore'),
        key: nameof(dataSource[0].indirectStore),
        dataIndex: nameof(dataSource[0].indirectStore),
        render(...[indirectStore, , index]) {
          return (
            <>
              <InputNumber
                className="form-control form-control-sm"
                value={indirectStore !== null ? indirectStore : null}
                min={0}
                allowNegative={false}
                onChange={handleChangeListSimpleField(
                  nameof(indirectStore),
                  indexInContent(index, pagination),
                )}
              />
            </>
          );
        },
      },
      // {
      //   title: translate('kpiItemContents.directQuantity'),
      //   key: nameof(dataSource[0].directQuantity),
      //   dataIndex: nameof(dataSource[0].directQuantity),
      //   render(...[directQuantity, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={directQuantity !== null ? directQuantity : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(directQuantity),
      //             indexInContent(index, pagination),
      //           )}
      //         />
      //       </>
      //     );
      //   },
      // },
      // {
      //   title: translate('kpiItemContents.directRevenue'),
      //   key: nameof(dataSource[0].directRevenue),
      //   dataIndex: nameof(dataSource[0].directRevenue),
      //   render(...[directRevenue, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={directRevenue !== null ? directRevenue : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(directRevenue),
      //             indexInContent(index, pagination),
      //           )}
      //         />
      //       </>
      //     );
      //   },
      // },

      // {
      //   title: translate('kpiItemContents.directAmount'),
      //   key: nameof(dataSource[0].directAmount),
      //   dataIndex: nameof(dataSource[0].directAmount),
      //   render(...[directAmount, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={directAmount !== null ? directAmount : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(directAmount),
      //             indexInContent(index, pagination),
      //           )}
      //         />
      //       </>
      //     );
      //   },
      // },
      // {
      //   title: translate('kpiItemContents.directStore'),
      //   key: nameof(dataSource[0].directStore),
      //   dataIndex: nameof(dataSource[0].directStore),
      //   render(...[directStore, , index]) {
      //     return (
      //       <>
      //         <InputNumber
      //           className="form-control form-control-sm"
      //           value={directStore !== null ? directStore : null}
      //           min={0}
      //           allowNegative={false}
      //           onChange={handleChangeListSimpleField(
      //             nameof(directStore),
      //             indexInContent(index, pagination),
      //           )}
      //         />
      //       </>
      //     );
      //   },
      // },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="button-action-table">
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={() => handleDeleteItem(index)}
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
    [
      dataSource,
      handleChangeListSimpleField,
      handleDeleteItem,
      pagination,
      translate,
    ],
  );
  return (
    <>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        rowSelection={rowSelection}
        className="table-kpi-item-content"
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table mt-2">
              <div className="flex-shrink-1 d-flex align-items-center ml-3">
                {validAction('listItem') && (
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleAddItem}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate('kpiItemContents.create')}
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger mr-2"
                  disabled={!selectedContents.length}
                  onClick={handleBulkDelete}
                >
                  <i className="fa mr-2 fa-trash" />
                  {translate(generalLanguageKeys.actions.delete)}
                </button>
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

      <ItemModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSave={handleSave(updateContentFromSelectedList)}
        pagination={pagination}
        getList={kpiItemRepository.listItem}
        count={kpiItemRepository.countItem}
        loadList={loadList}
        setLoadList={setLoadList}
        setSelectedList={setSelectedList}
        selectedList={selectedList}
        modelFilterClass={ItemFilter}
        filter={filter}
        setFilter={setFilter}
        kpiItemTypeId={model?.kpiItemType?.id}
        isNew={isNew}
        setIsNew={setIsNew}
      />
    </>
  );
}
export default KpiItemContentTable;
