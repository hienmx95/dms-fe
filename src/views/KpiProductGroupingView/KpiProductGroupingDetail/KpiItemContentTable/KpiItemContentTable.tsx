import { Modal, Popconfirm, Tooltip } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import { API_KPI_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import { indexInContent, renderMasterIndex } from 'helpers/ant-design/table';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { KpiProductGrouping } from 'models/kpi/KpiProductGrouping';
import { KpiProductGroupingContent } from 'models/kpi/KpiProductGroupingContent';
import { KpiProductGroupingContentFilter } from 'models/kpi/KpiProductGroupingContentFilter';
import { KpiProductGroupingContentItemMapping } from 'models/kpi/KpiProductGroupingContentItemMapping';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiItemRepository } from 'views/KpiProductGroupingView/KpiProductGroupingRepository';
import { kpiItemService } from 'views/KpiProductGroupingView/KpiProductGroupingService';
import ItemModal from './ItemModal';
import './KpiItemContentTable.scss';
import { ProductGrouping } from 'models/ProductGrouping';
import { formatNumber } from 'core/helpers/number';

const { Item: FormItem } = Form;

function KpiItemContentTable(
  props: ContentTableProps<KpiProductGrouping, KpiProductGroupingContent>,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-product-grouping',
    API_KPI_PRODUCT_GROUPING_ROUTE,
  );

  const { model, setModel } = props;

  const [
    kpiItemContents,
    setKpiItemContents,
    ,
    ,
  ] = crudService.useContentTable<
    KpiProductGrouping,
    KpiProductGroupingContent
  >(model, setModel, nameof(model.kpiProductGroupingContents));

  // const [kpiItemContentMappings, setKpiItemContentMappings , , ,] = crudService.useMappingContent<KpiProductGroupingContent, Item>(
  //   kpiItemRepository.listItem,
  //   'kpiProductGroupingContentItemMappings',
  //   'item',
  //   ''
  // );
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
    KpiProductGroupingContentFilter
  >(new KpiProductGroupingContentFilter());
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
  // filter selected product grouping
  const selectedProductGroupingIds = React.useMemo(() => {
    return kpiItemContents
      .map((content: KpiProductGroupingContent) => {
        return content?.productGroupingId;
      })
      .filter(productGroupingId => productGroupingId !== undefined);
  }, [kpiItemContents]);

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  // Handling change in content table
  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    KpiProductGroupingContent
  >(kpiItemContents, setKpiItemContents);

  const handleChangeProductGrouping = React.useCallback(
    (index: number) => (
      productGroupingId: any,
      productGrouping: ProductGrouping,
    ) => {
      if (selectedProductGroupingIds.includes(productGroupingId)) {
        Modal.warning({
          title: '',
          content: translate(
            'kpiProductGroupingContents.errors.duplicateProductGrouping',
          ),
        });
      } else {
        kpiItemContents[index] = new KpiProductGroupingContent();
        kpiItemContents[index].kpiProductGroupingContentItemMappings = [];
        kpiItemContents[index].productGrouping = productGrouping;
        kpiItemContents[index].productGroupingId = productGroupingId;
        setKpiItemContents([...kpiItemContents]);
      }
    },
    [
      kpiItemContents,
      setKpiItemContents,
      selectedProductGroupingIds,
      translate,
    ],
  );

  const [selectedContents, setSelectedContents] = React.useState<
    KpiProductGroupingContent[]
  >([]);

  const rowSelection: TableRowSelection<KpiProductGroupingContent> = crudService.useContentModalList<
    KpiProductGroupingContent
  >(selectedContents, setSelectedContents);

  const [isNew, setIsNew] = React.useState<boolean>(true);
  // current content to set for item modal
  const [currentContent, setCurrentContent] = React.useState<number>();

  const handleOpenModal = React.useCallback(
    (index: number) => {
      // TODO: thêm cảnh báo nếu chưa chọn nhóm sản phẩm -> đợi api có

      if (
        typeof model.kpiProductGroupingContents[index].productGroupingId ===
          'undefined' ||
        model.kpiProductGroupingContents[index].productGroupingId === 0
      ) {
        Modal.warning({
          title: '',
          content: translate(
            'kpiProductGroupingContents.errors.productGrouping',
          ),
        });
      } else {
        setCurrentContent(index);
        filter.productGroupingId.equal =
          model.kpiProductGroupingContents[index].productGroupingId;
        if (
          kpiItemContents[index].kpiProductGroupingContentItemMappings &&
          kpiItemContents[index].kpiProductGroupingContentItemMappings.length >
            0
        ) {
          setSelectedList(
            kpiItemContents[index].kpiProductGroupingContentItemMappings.map(
              item => {
                if (item.item === null) {
                  // since error response does not have item (null) we check this to add itemId to item
                  item.item = new Item();
                  item.item.id = item.itemId;
                }
                return item.item;
              }, // chính là chỗ này (do cái item null nên bị lỗi) TODO: fix bugs
            ),
          ); // map selectedList
        }

        setFilter({ ...filter });
        setIsNew(true);
        setIsOpen(true);
        setLoadList(true);
      }
    },
    [
      setLoadList,
      setIsOpen,
      setIsNew,
      model,
      translate,
      filter,
      setFilter,
      kpiItemContents,
      setSelectedList,
    ],
  );

  const handleAddItem = React.useCallback(() => {
    if (
      typeof model.kpiProductGroupingTypeId === 'undefined' ||
      model.kpiProductGroupingTypeId === 0
    ) {
      Modal.warning({
        title: '',
        content: translate('kpiItemContents.errors.kpiItemType'),
      });
    } else {
      const newContent = new KpiProductGroupingContent();
      newContent.kpiProductGroupingContentItemMappings = [];
      kpiItemContents.push(newContent);

      setKpiItemContents([...kpiItemContents]);
    }
  }, [kpiItemContents, setKpiItemContents, model, translate]);

  const handleDeleteItem = React.useCallback(
    key => {
      const dataSource = [...newContents];
      setKpiItemContents([...dataSource.filter(item => item.key !== key)]);
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
            (content: KpiProductGroupingContent) => content.key,
          );
          const remainContents = kpiItemContents.filter(
            (content: KpiProductGroupingContent) => {
              if (selectedItemIds.includes(content.key)) {
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
  // TODO: viết lại hàm này là sẽ update content cho kpiProductGroupingContentItemMappings cho từng kpiProductGroupingContent (maybe thêm tham số index ??)
  const updateContentFromSelectedList = React.useCallback(
    (index: number) => (list: Item[]) => {
      if (kpiItemContents[index].kpiProductGroupingContentItemMappings) {
        if (
          kpiItemContents[index].kpiProductGroupingContentItemMappings.length >
          0
        ) {
          const contentItemIds = kpiItemContents[
            index
          ].kpiProductGroupingContentItemMappings.map(
            (content: KpiProductGroupingContentItemMapping) => content.itemId,
          );
          if (list && list.length > 0) {
            const usedIds = list.map((i: Item) => i.id);
            list.forEach((i: Item) => {
              if (!contentItemIds.includes(i.id)) {
                const content = new KpiProductGroupingContentItemMapping();
                content.item = i;
                content.itemId = i?.id;
                kpiItemContents[
                  index
                ].kpiProductGroupingContentItemMappings.push(content);
              }
            });
            const newContents = kpiItemContents[
              index
            ].kpiProductGroupingContentItemMappings.filter(content =>
              usedIds.includes(content.itemId),
            );
            kpiItemContents[index].kpiProductGroupingContentItemMappings = [
              ...newContents,
            ];
            setKpiItemContents([...kpiItemContents]);
          } else {
            kpiItemContents[index].kpiProductGroupingContentItemMappings = [];
            setKpiItemContents([...kpiItemContents]);
          }
        } else {
          if (list && list.length > 0) {
            list.forEach((i: Item) => {
              const content = new KpiProductGroupingContentItemMapping();
              content.item = i;
              content.itemId = i?.id;
              kpiItemContents[index].kpiProductGroupingContentItemMappings.push(
                content,
              );
            });
            setKpiItemContents([...kpiItemContents]);
          }
        }
      }
      // after select mapping item for this kpi content we need to pass selectedList to [] otherwise it will push to other kpi content
      setSelectedList([]);
    },
    [kpiItemContents, setKpiItemContents, setSelectedList],
  );

  const columns: ColumnProps<KpiProductGroupingContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<KpiProductGroupingContent>(pagination),
      },

      // TODO: đợi có api thì get list nhóm sản phẩm, khi chọn nhóm sản phẩm được rồi thì set lại filter của item modal
      // là filter.productGroupingId.equal = model.productGroupingId
      // làm chức chức năng là khi chọn lại nhóm sản phẩm, nếu nhóm sản phẩm khác nhóm sản phẩm hiện tại thì clear hết những gì đã nhập: các sản phẩm
      // đã lựa chọn, số lượng, doanh thu,...

      {
        title: (
          <div style={{ marginLeft: '1rem' }}>
            {translate('kpiProductGroupingContents.productGroupingName')}
          </div>
        ),
        key: nameof(dataSource[0].productGrouping.name),
        dataIndex: nameof(dataSource[0].productGrouping),
        render(...[, kpiItemContent, index]) {
          return (
            validAction('singleListProductGrouping') && (
              <FormItem
                validateStatus={formService.getValidationStatus<
                  KpiProductGroupingContent
                >(
                  kpiItemContent.errors,
                  nameof(kpiItemContent.productGrouping),
                )}
                help={kpiItemContent.errors?.productGrouping}
              >
                <TreeSelectDropdown
                  value={kpiItemContent?.productGroupingId}
                  mode="single"
                  onChange={handleChangeProductGrouping(
                    indexInContent(index, pagination),
                  )}
                  modelFilter={productGroupingFilter}
                  setModelFilter={setProductGroupingFilter}
                  getList={kpiItemRepository.singleListProductGrouping}
                  searchField={nameof(productGroupingFilter.id)}
                  placeholder={translate(
                    'kpiProductGroupings.placeholder.productGrouping',
                  )}
                />
              </FormItem>
            )
          );
        },
      },
      // TODO: tính kpiProductGroupingContentItemMappings.length của từng kpiProductGroupingContent trong kpiProductGroupingContents
      {
        title: translate('kpiProductGroupingContents.itemQuantity'),
        key: nameof(dataSource[0].item.code),
        dataIndex: nameof(dataSource[0].item),
        width: 150,
        align: 'right',
        render(...[, record]) {
          const value = record?.kpiProductGroupingContentItemMappings
            ? formatNumber(record.kpiProductGroupingContentItemMappings.length)
            : null;
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              {value}

              {record.kpiProductGroupingContentItemMappings.length === 0 &&
                record.errors?.kpiProductGroupingContentItemMappings && (
                  <>
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        KpiProductGroupingContent
                      >(
                        record.errors,
                        nameof(record.kpiProductGroupingContentItemMappings),
                      )}
                      help={
                        record.errors?.kpiProductGroupingContentItemMappings
                      }
                      className="validate-item"
                      style={{
                        padding: 0,
                      }}
                    />
                  </>
                )}
            </div>
          );
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
        render(...[indirectRevenue, record, index]) {
          return (
            <>
              <InputNumber
                className="form-control form-control-sm"
                value={
                  indirectRevenue !== null && indirectRevenue !== undefined
                    ? indirectRevenue
                    : record.kpiProductGroupingContentCriteriaMappings
                    ? record.kpiProductGroupingContentCriteriaMappings['2']
                    : null
                }
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
        render(...[indirectStore, record, index]) {
          return (
            <>
              <InputNumber
                className="form-control form-control-sm"
                value={
                  indirectStore !== null && indirectStore !== undefined
                    ? indirectStore
                    : record.kpiProductGroupingContentCriteriaMappings
                    ? record.kpiProductGroupingContentCriteriaMappings[4]
                    : null
                }
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
        render(...[, record, index]) {
          return (
            <div className="button-action-table">
              <Tooltip title={translate('kpiProductGroupings.actions.addItem')}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() =>
                    handleOpenModal(indexInContent(index, pagination))
                  }
                >
                  <i className="tio-menu_hamburger" />
                  {/* <DatabaseFilled /> */}
                </button>
              </Tooltip>
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={() => handleDeleteItem(record.key)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button className="btn btn-sm btn-link">
                    <i className="tio-delete_outlined" />
                  </button>
                </Tooltip>
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
      validAction,
      handleOpenModal,
      // kpiItemContents,
      productGroupingFilter,
      handleChangeProductGrouping,
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
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleAddItem}
                >
                  <i className="fa mr-2 fa-plus" />
                  {translate('kpiProductGroupingContents.create')}
                </button>

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
        onSave={handleSave(updateContentFromSelectedList(currentContent))}
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
        kpiProductGroupingTypeId={model?.kpiProductGroupingType?.id}
        isNew={isNew}
        setIsNew={setIsNew}
      />
    </>
  );
}

export default KpiItemContentTable;
