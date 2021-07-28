import { Input, Modal } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { Item } from 'models/Item';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import ItemModal from '../ItemModal/ItemModal';
import './DirectSalesOrderPromotionTable.scss';
import { Store } from 'models/Store';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderPromotion } from 'models/Direct/DirectSalesOrderPromotion';
import { DirectSalesOrderPromotionFilter } from 'models/Direct/DirectSalesOrderPromotionFilter';
import { directSalesOrderService } from 'views/DirectSalesOrderView/DirectSalesOrderService';
import { directSalesOrderRepository } from 'views/DirectSalesOrderView/DirectSalesOrderRepository';

const { Item: FormItem } = Form;
export interface DirectSalesOrderPromotionTableProps
  extends ContentTableProps<DirectSalesOrder, DirectSalesOrderPromotion> {
  currentStore: Store;
}

function DirectSalesOrderPromotionTable(
  props: DirectSalesOrderPromotionTableProps,
) {
  const [translate] = useTranslation();

  const { model, setModel, currentStore } = props;

  const { validAction } = crudService.useAction(
    'indirect-sales-order',
    API_INDIRECT_SALES_ORDER_ROUTE,
  );

  const [
    directSalesOrderPromotions,
    setDirectSalesOrderPromotions,
    ,
    handleDelete,
  ] = crudService.useContentTable<
    DirectSalesOrder,
    DirectSalesOrderPromotion
  >(model, setModel, nameof(model.directSalesOrderPromotions));


  const [selectedPromotions, setSelectedPromotion] = React.useState<
    DirectSalesOrderPromotion[]
  >([]);

  const rowSelection: TableRowSelection<DirectSalesOrderPromotion> = crudService.useContentModalList<
    DirectSalesOrderPromotion
  >(selectedPromotions, setSelectedPromotion);

  const [
    directSalesOrderPromotionFilter,
    setDirectSalesOrderPromotionFilter,
  ] = React.useState<DirectSalesOrderPromotionFilter>(
    new DirectSalesOrderPromotionFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    directSalesOrderPromotions,
    directSalesOrderPromotionFilter,
    setDirectSalesOrderPromotionFilter,
  );

  const [listItemSelected, setListItem] = React.useState<Item[]>([]);
  const [currentItem] = React.useState<any>(null);

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    DirectSalesOrderPromotion
  >(directSalesOrderPromotions, setDirectSalesOrderPromotions);

  const [isChangeSelectedList, setIsChangeSelectedList] = React.useState<
    boolean
  >(false);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [listItem] = React.useState<Item[]>([]);

  const {
    filterItem,
    setFilterItem,
    handleCloseModal,
    handleOpenModal,
    loadList,
    setLoadList,
  } = directSalesOrderService.useItemModal(
    currentStore,
    setVisible,
    model,
  );

  const defaultUOMList = React.useMemo(() => {
    return (content: DirectSalesOrderPromotion) => {
      const unit = content.unitOfMeasure;
      if (unit) {
        return [unit];
      }
      return [];
    };
  }, []);

  const handleChangeUOMInContent = React.useCallback(
    (...[, index]) => {
      return (id: number | string | null, t: UnitOfMeasure) => {
        const requestedQuantitys = Number(
          directSalesOrderPromotions[index].quantity * t?.factor,
        );
        directSalesOrderPromotions[index] = {
          ...directSalesOrderPromotions[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
          requestedQuantity: requestedQuantitys,
        };

        setDirectSalesOrderPromotions([...directSalesOrderPromotions]);
      };
    },
    [directSalesOrderPromotions, setDirectSalesOrderPromotions],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedPromotions && selectedPromotions.length > 0) {
          const selectedStoreIds = selectedPromotions.map(
            (content: DirectSalesOrderPromotion) => content.itemId,
          );
          const remainContents = directSalesOrderPromotions.filter(
            (content: DirectSalesOrderPromotion) => {
              if (selectedStoreIds.includes(content.itemId)) {
                return false;
              }
              return true;
            },
          );
          setDirectSalesOrderPromotions([...remainContents]);
          setSelectedPromotion([]);
        }
      },
    });
  }, [
    directSalesOrderPromotions,
    selectedPromotions,
    setDirectSalesOrderPromotions,
    translate,
  ]);

  const handleChangeQuantity = React.useCallback(
    index => {
      return event => {
        if (
          directSalesOrderPromotions[index] &&
          directSalesOrderPromotions[index].unitOfMeasure
        ) {
          let requestedQuantitys = 0;
          if (event === undefined || event === null) {
            requestedQuantitys = 0;
          } else if (directSalesOrderPromotions[index].factor) {
            requestedQuantitys = Number(
              Number(event) *
              directSalesOrderPromotions[index].factor,
            );
          }
          directSalesOrderPromotions[index] = {
            ...directSalesOrderPromotions[index],
            quantity: Number(event),
            requestedQuantity: requestedQuantitys,
          };
        }
        setDirectSalesOrderPromotions([...directSalesOrderPromotions]);
      };
    },
    [directSalesOrderPromotions, setDirectSalesOrderPromotions],
  );




  const handleSaveItemModal = React.useCallback(
    listItem => {
      if (listItem && listItem.length > 0) {
        const contents = listItem.map((item: Item) => {
          const content = new DirectSalesOrderPromotion();
          content.item = item;
          content.itemId = item?.id;
          content.primaryUnitOfMeasure = item?.product?.unitOfMeasure;
          content.primaryUnitOfMeasureId = item?.product?.unitOfMeasureId;
          content.quantity = 0;
          content.factor = 1;
          content.unitOfMeasure = item?.product?.unitOfMeasure;
          content.unitOfMeasureId = item?.product?.unitOfMeasure?.id;
          return content;
        });
        setDirectSalesOrderPromotions([
          ...directSalesOrderPromotions,
          ...contents,
        ]);
      }
      setVisible(false);

    },
    [directSalesOrderPromotions, setDirectSalesOrderPromotions, setVisible],
  );

  const columns: ColumnProps<DirectSalesOrderPromotion>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<DirectSalesOrderPromotion>(pagination),
      },
      {
        title: translate('directSalesOrderPromotions.items.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('directSalesOrderPromotions.items.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderPromotions.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasure),
        dataIndex: nameof(dataSource[0].unitOfMeasure),
        align: 'center',
        width: 200,
        render(...[unit, content, index]) {
          const defaultFilter = new UnitOfMeasureFilter();
          defaultFilter.productId.equal =
            content.item?.product?.id;
          return (
            <>
              {validAction('singleListUnitOfMeasure') &&
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrderPromotion
                  >(content.errors, nameof(content.unitOfMeasure))}
                  help={content.errors?.unitOfMeasure}
                >
                  <SelectAutoComplete
                    value={content?.primaryUnitOfMeasure?.id}
                    onChange={handleChangeUOMInContent(unit, index)}
                    getList={directSalesOrderRepository.singleListUnitOfMeasure}
                    list={defaultUOMList(content)}
                    modelFilter={defaultFilter}
                    setModelFilter={setUnitOfMeasureFilter}
                    searchField={nameof(unitOfMeasureFilter.name)}
                    searchType={nameof(unitOfMeasureFilter.name.contain)}
                    placeholder={translate(
                      'directSalesOrderPromotions.placeholder.unitOfMeasure',
                    )}
                    allowClear={false}
                  />
                </FormItem>
              }
            </>

          );
        },
      },
      {
        title: () => (
          <div className="mr-2">
            {translate('directSalesOrderContents.quantity')}
          </div>
        ),
        key: nameof(dataSource[0].quantity),
        dataIndex: nameof(dataSource[0].quantity),
        align: 'right',
        render(
          quantity: any,
          directSalesOrderPromotion: DirectSalesOrderPromotion,
          index,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                DirectSalesOrderPromotion
              >(
                directSalesOrderPromotion.errors,
                nameof(directSalesOrderPromotion.quantity),
              )}
              help={directSalesOrderPromotion.errors?.quantity}
            >
              <InputNumber
                min={0}
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(quantity)}
                defaultValue={quantity}
                onChange={handleChangeQuantity(index)}
                disabled={
                  directSalesOrderPromotion?.unitOfMeasure?.id ? false : true
                }
              />
            </FormItem>
          );
        },
      },
      {
        title: translate('directSalesOrderPromotions.requestedQuantity'),
        key: nameof(dataSource[0].requestedQuantity),
        dataIndex: nameof(dataSource[0].requestedQuantity),
        render(...[requestedQuantity]) {
          return formatNumber(requestedQuantity);
        },
        align: 'right',
      },
      {
        title: translate('directSalesOrderContents.primaryUnitOfMeasure'),
        key: nameof(dataSource[0].primaryUnitOfMeasure),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.product?.unitOfMeasure?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderPromotions.note'),
        key: nameof(dataSource[0].note),
        dataIndex: nameof(dataSource[0].note),
        ellipsis: true,
        render(...[note, , index]) {
          return <><Input value={note} onChange={handleChangeListSimpleField(nameof(note), index)} /></>;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(
          ...params: [
            DirectSalesOrderPromotion,
            DirectSalesOrderPromotion,
            number,
          ]
        ) {
          return (
            <div className="button-action-table">
              {validAction('create') &&
                <button
                  className="btn btn-link mr-2"
                  onClick={handleDelete(params[2])}
                >
                  <i className="tio-delete_outlined" />
                </button>
              }

            </div>
          );
        },
      },
    ],
    [dataSource, defaultUOMList, handleChangeListSimpleField, handleChangeQuantity, handleChangeUOMInContent, handleDelete, pagination, translate, unitOfMeasureFilter.name, validAction],
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
        className="table-content-item"
        scroll={{ y: 700 }}
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listItem') &&
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenModal}
                      disabled={
                        model.requestStateId === 2 || model.requestStateId === 3
                      }
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate('general.actions.addNew')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={
                        !selectedPromotions.length
                      }
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  </>
                }
                {/* {(model.requestStateId === 1 || model.requestStateId === 4) && (
                  <>
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      // onClick={handleExport}
                    >
                       <i className="tio-file_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.export)}
                    </button>
                    <button
                      className="btn btn-sm btn-export-template mr-2"
                      // onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
                    </button>
                  </>
                )} */}
              </div>
            </div>
          </>
        )}
      />
      <ItemModal
        filter={filterItem}
        setFilter={setFilterItem}
        loadList={loadList}
        setloadList={setLoadList}
        currentStore={currentStore}
        selectedList={listItemSelected}
        initSelectedList={listItemSelected}
        setSelectedList={setListItem}
        list={listItem}
        isOpen={visible}
        onClose={handleCloseModal}
        onSave={handleSaveItemModal}
        currentItem={currentItem}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        isChangeSelectedList={isChangeSelectedList}
        setIsChangeSelectedList={setIsChangeSelectedList}
      />
    </>
  );
}

export default DirectSalesOrderPromotionTable;
