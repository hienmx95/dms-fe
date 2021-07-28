import { Modal, Popconfirm } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingOrder } from 'models/posm/ShowingOrder';
import { ShowingOrderContent } from 'models/posm/ShowingOrderContent';
import { ShowingOrderContentFilter } from 'models/posm/ShowingOrderContentFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { showingOrderService } from '../../ShowingOrderService';
import ItemModal from './ItemModal';
import './ShowingOrderContentTable.scss';
import { showingItemRepository } from '../../../../ShowingItemView/ShowingItemRepository';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';

const { Item: FormItem } = Form;

export interface ShowingOrderContentTableProps
  extends ContentTableProps<ShowingOrder, ShowingOrderContent> {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  setCalculateTotal?: Dispatch<SetStateAction<boolean>>;
  isDetail?: boolean;
}

function ShowingOrderContentTable(props: ShowingOrderContentTableProps) {
  const [translate] = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { validAction } = crudService.useAction(
    'showing-order',
    API_SHOWING_ORDER_ROUTE,
  );
  const { model, setModel, setCalculateTotal, isDetail } = props;

  const [
    showingOrderContents,
    setShowingOrderContents,
  ] = crudService.useContentTable<ShowingOrder, ShowingOrderContent>(
    model,
    setModel,
    nameof(model.showingOrderContents),
  );

  const [
    showingOrderContentFilter,
    setShowingOrderContentFilter,
  ] = React.useState<ShowingOrderContentFilter>(
    new ShowingOrderContentFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    showingOrderContents,
    showingOrderContentFilter,
    setShowingOrderContentFilter,
  );

  const [selectedContents, setSelectedContents] = React.useState<
    ShowingOrderContent[]
  >([]);

  const rowSelection: TableRowSelection<ShowingOrderContent> = crudService.useContentModalList<
    ShowingOrderContent
  >(selectedContents, setSelectedContents);

  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    filter,
    setFilter,
    handleCloseModal,
    handleOpenModal,
    loadList,
    setLoadList,
    selectedList,
    setSelectedList,
  } = showingOrderService.useItemModal(setVisible, model);

  const calculateTotal = React.useMemo(() => {
    return (quantity: number, salePrice: number) => {
      return Number(quantity * salePrice);
    };
  }, []);

  const handleChangeQuantity = React.useCallback(
    index => {
      return event => {
        const nameField = 'quantity';
        if (
          showingOrderContents[index] &&
          showingOrderContents[index].unitOfMeasure
        ) {
          const total = calculateTotal(
            Number(event),
            showingOrderContents[index].salePrice,
          );

          showingOrderContents[index] = {
            ...showingOrderContents[index],
            quantity: Number(event),
            amount: total,
          };
          if (showingOrderContents[index]?.errors) {
            showingOrderContents[index].errors[`${nameField}`] = null;
          }
        }
        setShowingOrderContents([...showingOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      showingOrderContents,
      setCalculateTotal,
      setShowingOrderContents,
    ],
  );

  const handleSaveModal = React.useCallback(
    listItem => {
      if (listItem && listItem.length > 0) {
        // listItem = listItem.filter(
        //   p => !showingOrderContents?.map(x => x.itemId).includes(p.id),
        // );
        const contents = listItem.map((item: ShowingItem) => {
          const content = new ShowingOrderContent();
          content.showingItem = item;
          content.showingItemId = item?.id;
          content.unitOfMeasure = item?.unitOfMeasure;
          content.unitOfMeasureId = item?.unitOfMeasureId;
          content.showingCategory = item?.showingCategory;
          content.showingCategoryId = item?.showingCategoryId;
          content.salePrice = item.salePrice;
          return content;
        });

        setShowingOrderContents([...contents]);
      }
      setVisible(false);
    },
    [setShowingOrderContents, setVisible],
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
    showingItemRepository.import,
    setLoading,
    showingOrderContentFilter,
  );
  const [handleExport] = showingOrderService.useExport(
    showingItemRepository.export,
    showingOrderContentFilter,
  );

  const [handleExportTemplate] = showingOrderService.useExport(
    showingItemRepository.exportTemplate,
    showingOrderContentFilter,
  );

  React.useEffect(() => {
    if (importERouteContents && importERouteContents.length > 0) {
      setShowingOrderContents(importERouteContents);
      setImportERouteContents([]);
    }
  }, [importERouteContents, setImportERouteContents, setShowingOrderContents]);

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        showingOrderContents.splice(index, 1);
        setShowingOrderContents([...showingOrderContents]);
        const selectedShowingItem = showingOrderContents.map(
          (content: ShowingOrderContent) => {
            return content.showingItem;
          },
        );
        setSelectedList([...selectedShowingItem]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      showingOrderContents,
      setShowingOrderContents,
      setCalculateTotal,
      setSelectedList,
    ],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: ShowingOrderContent) => content.showingItemId,
          );

          const remainContents = showingOrderContents.filter(
            (content: ShowingOrderContent) => {
              if (selectedStoreIds.includes(content.showingItemId)) {
                return false;
              }
              return true;
            },
          );

          setShowingOrderContents([...remainContents]);
          setSelectedContents([]);

          const selectedShowingItem = remainContents.map(
            (content: ShowingOrderContent) => {
              return content.showingItem;
            },
          );
          setSelectedList([...selectedShowingItem]);
          if (setCalculateTotal) {
            setCalculateTotal(true);
          }
        }
      },
    });
  }, [
    showingOrderContents,
    selectedContents,
    setShowingOrderContents,
    translate,
    setCalculateTotal,
    setSelectedList,
  ]);

  const columns: ColumnProps<ShowingOrderContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ShowingOrderContent>(pagination),
      },
      {
        title: translate('showingOrderContents.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].showingItem),
        render(item: ShowingItem) {
          return item?.code;
        },
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].showingItem),
        render(item: ShowingItem) {
          return item?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.category'),
        key: nameof(dataSource[0].showingCategory),
        dataIndex: nameof(dataSource[0].showingCategory),
        render(showingCategory) {
          return showingCategory?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('showingOrderContents.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasure),
        dataIndex: nameof(dataSource[0].unitOfMeasure),
        align: 'center',
        width: 120,
        ellipsis: true,
        render(unitOfMeasure: UnitOfMeasure) {
          return unitOfMeasure?.name;
        },
      },
      {
        title: translate('showingOrderContents.salePrice'),
        key: nameof(dataSource[0].salePrice),
        dataIndex: nameof(dataSource[0].salePrice),
        align: 'right',
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
        ellipsis: true,
      },
      {
        title: () => (
          <div className="mr-2">
            {translate('showingOrderContents.quantity')}
          </div>
        ),
        key: nameof(dataSource[0].quantity),
        dataIndex: nameof(dataSource[0].quantity),
        align: 'right',
        ellipsis: true,
        render(quantity: any, showingOrderContent: ShowingOrderContent, index) {
          return (
            <>
              <FormItem
                validateStatus={formService.getValidationStatus<
                  ShowingOrderContent
                >(
                  showingOrderContent.errors,
                  nameof(showingOrderContent.quantity),
                )}
                help={showingOrderContent.errors?.quantity}
                className="input-quantity"
              >
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(quantity)}
                  defaultValue={quantity}
                  onChange={handleChangeQuantity(index)}
                />
              </FormItem>
            </>
          );
        },
      },

      {
        title: translate('showingOrderContents.amount'),
        key: nameof(dataSource[0].amount),
        dataIndex: nameof(dataSource[0].amount),
        render(...[amount]) {
          return formatNumber(amount);
        },
        align: 'right',
        ellipsis: true,
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [ShowingOrderContent, ShowingOrderContent, number]) {
          return (
            <div className="button-action-table">
              {validAction('create') && (
                <Popconfirm
                  placement="left"
                  title={translate('general.delete.content')}
                  onConfirm={handleDelete(params[2])}
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
    [
      dataSource,
      handleChangeQuantity,
      handleDelete,
      pagination,
      translate,
      validAction,
    ],
  );

  //   React.useEffect(() => {
  //     if (changeEditPrice === true && showingOrderContents.length > 0) {
  //       showingOrderContents.forEach((...[, index]) => {
  //         const amount = calculateTotal(
  //           showingOrderContents[index].quantity,
  //           showingOrderContents[index].salePrice,
  //         );
  //         showingOrderContents[index] = {
  //           ...showingOrderContents[index],
  //           amount,
  //         };
  //       });
  //       setShowingOrderContents([...showingOrderContents]);
  //       setChangeEditPrice(false);
  //       if (setCalculateTotal) {
  //         setCalculateTotal(true);
  //       }
  //     }
  //   }, [
  //     changeEditPrice,
  //     showingOrderContents,
  //     setCalculateTotal,
  //     setChangeEditPrice,
  //     setShowingOrderContents,
  //     calculateTotal,
  //   ]);

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
        className="table-content-item"
        scroll={{ y: 700 }}
        loading={loading}
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listShowingItem') && (
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenModal}
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
                        onClick={handleExportTemplate}
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
      {showingOrderContents?.length === 0 && (
        <FormItem
          validateStatus={formService.getValidationStatus<ShowingOrder>(
            model.errors,
            nameof(model.showingOrderContents),
          )}
          help={model.errors?.showingOrderContents}
          className="indirect-sales-order-content"
        ></FormItem>
      )}
      <ItemModal
        title={translate('showingOrderContents.master.item.title')}
        isOpen={visible}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        filter={filter}
        setFilter={setFilter}
        loadList={loadList}
        setloadList={setLoadList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
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
export default ShowingOrderContentTable;
