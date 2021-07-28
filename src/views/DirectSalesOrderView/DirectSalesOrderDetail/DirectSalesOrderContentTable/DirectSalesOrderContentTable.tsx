import { Modal, Popconfirm } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { API_DIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatNumber } from 'core/helpers/number';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { parseNumber } from 'helpers/number-format';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderContent } from 'models/Direct/DirectSalesOrderContent';
import { DirectSalesOrderContentFilter } from 'models/Direct/DirectSalesOrderContentFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { Item } from 'models/Item';
import { Status } from 'models/Status';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { directSalesOrderRepository } from 'views/DirectSalesOrderView/DirectSalesOrderRepository';
import { directSalesOrderService } from 'views/DirectSalesOrderView/DirectSalesOrderService';
import ItemModal from '../ItemModal/ItemModal';
import './DirectSalesOrderContentTable.scss';

const { Item: FormItem } = Form;

export interface DirectSalesOrderContentTableProps
  extends ContentTableProps<DirectSalesOrder, DirectSalesOrderContent> {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  setCalculateTotal?: Dispatch<SetStateAction<boolean>>;
  changeEditPrice?: boolean;
  setChangeEditPrice?: Dispatch<SetStateAction<boolean>>;
  currentStore?: any;
}

function DirectSalesOrderContentTable(
  props: DirectSalesOrderContentTableProps,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'direct-sales-order',
    API_DIRECT_SALES_ORDER_ROUTE,
  );
  const {
    model,
    setModel,
    setCalculateTotal,
    changeEditPrice,
    setChangeEditPrice,
    currentStore,
  } = props;

  const [
    directSalesOrderContents,
    setDirectSalesOrderContents,
    ,
    ,
  ] = crudService.useContentTable<DirectSalesOrder, DirectSalesOrderContent>(
    model,
    setModel,
    nameof(model.directSalesOrderContents),
  );

  const [
    directSalesOrderContentFilter,
    setDirectSalesOrderContentFilter,
  ] = React.useState<DirectSalesOrderContentFilter>(
    new DirectSalesOrderContentFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    directSalesOrderContents,
    directSalesOrderContentFilter,
    setDirectSalesOrderContentFilter,
  );

  const [selectedContents, setSelectedContents] = React.useState<
    DirectSalesOrderContent[]
  >([]);

  const rowSelection: TableRowSelection<DirectSalesOrderContent> = crudService.useContentModalList<
    DirectSalesOrderContent
  >(selectedContents, setSelectedContents);
  // const [listItemSelected, setListItem] = React.useState<Item[]>([]);
  const [currentItem] = React.useState<any>(null);
  const [isChangeSelectedList, setIsChangeSelectedList] = React.useState<
    boolean
  >(false);

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [listItemSelected, setListItemSelected] = React.useState<Item[]>([]);

  const [listItem] = React.useState<Item[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);

  const [taxTypeFilter, setTaxTypeFilter] = React.useState<TaxTypeFilter>(
    new TaxTypeFilter(),
  );

  const {
    filterItem,
    setFilterItem,
    handleCloseModal,
    handleOpenModal,
    loadList,
    setLoadList,
  } = directSalesOrderService.useItemModal(currentStore, setVisible, model);

  const calculateTotal = React.useMemo(() => {
    return (quantity: number, salePrice: number, disCount: number) => {
      return Number.parseFloat(
        (quantity * salePrice * ((100 - disCount) / 100)).toFixed(3),
      );
    };
  }, []);

  const defaultUOMList = React.useMemo(() => {
    return (content: DirectSalesOrderContent) => {
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
        const newSalePrice =
          directSalesOrderContents[index]?.item?.salePrice * t?.factor;
        const total = calculateTotal(
          directSalesOrderContents[index].quantity,
          newSalePrice,
          directSalesOrderContents[index].discountPercentage,
        );
        const requestedQuantitys = Number(
          directSalesOrderContents[index].quantity * t?.factor,
        );

        directSalesOrderContents[index] = {
          ...directSalesOrderContents[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
          salePrice: newSalePrice,
          amount: total,
          factor: t?.factor,
          requestedQuantity: requestedQuantitys,
        };
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      setCalculateTotal,
      directSalesOrderContents,
      calculateTotal,
      setDirectSalesOrderContents,
    ],
  );

  const handleChangeQuantity = React.useCallback(
    index => {
      return event => {
        if (
          directSalesOrderContents[index] &&
          directSalesOrderContents[index].unitOfMeasure
        ) {
          let requestedQuantity = 0;
          let total = calculateTotal(
            Number(event),
            directSalesOrderContents[index].salePrice,
            directSalesOrderContents[index].discountPercentage,
          );
          if (event === undefined || event === null) {
            requestedQuantity = 0;
            total = 0;
          } else if (directSalesOrderContents[index].factor) {
            requestedQuantity = Number(
              Number(event) * directSalesOrderContents[index].factor,
            );
          }

          directSalesOrderContents[index] = {
            ...directSalesOrderContents[index],
            quantity: Number(event),
            requestedQuantity,
            amount: total,
          };
        }
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      directSalesOrderContents,
      setCalculateTotal,
      setDirectSalesOrderContents,
    ],
  );

  const handleChangeDiscountPercentage = React.useCallback(
    index => {
      return event => {
        const total = calculateTotal(
          directSalesOrderContents[index].quantity,
          directSalesOrderContents[index].salePrice,
          Number(event),
        );
        directSalesOrderContents[index] = {
          ...directSalesOrderContents[index],
          discountPercentage: Number(event),
          amount: (total),
        };
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      directSalesOrderContents,
      setCalculateTotal,
      setDirectSalesOrderContents,
    ],
  );

  const handleChangePrimaryPrice = React.useCallback(
    index => {
      return event => {
        const primaryPrice = Number(event);
        directSalesOrderContents[index].salePrice =
          primaryPrice * directSalesOrderContents[index].factor;
        const lowerBlock = directSalesOrderContents[index].item.salePrice * 0.9;
        const blockOn = directSalesOrderContents[index].item.salePrice * 1.1;
        const total = calculateTotal(
          directSalesOrderContents[index].quantity,
          directSalesOrderContents[index].salePrice,
          directSalesOrderContents[index].discountPercentage,
        );
        let errors: any = directSalesOrderContents[index].errors;
        if (Number(event) < lowerBlock || Number(event) > blockOn) {
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.primaryPrice = 'Giá nằm ngoài khoảng cho phép';
          } else {
            errors = {};
            errors.primaryPrice = 'Giá nằm ngoài khoảng cho phép';
          }
        } else {
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.primaryPrice = null;
          } else {
            errors = {};
            errors.primaryPrice = null;
          }
        }
        directSalesOrderContents[index] = {
          ...directSalesOrderContents[index],
          primaryPrice: Number(event),
          salePrice: directSalesOrderContents[index].salePrice,
          amount: total,
          errors,
        };
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      directSalesOrderContents,
      setCalculateTotal,
      setDirectSalesOrderContents,
    ],
  );

  const handleChangeTaxType = React.useCallback(
    (...[, index]) => {
      return (id: number | string | null, t: TaxType) => {
        directSalesOrderContents[index] = {
          ...directSalesOrderContents[index],
          taxType: t,
          taxTypeId: +id,
          taxPercentage: t?.percentage,
        };
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [setCalculateTotal, directSalesOrderContents, setDirectSalesOrderContents],
  );

  const handleSaveModal = React.useCallback(
    listItem => {
      if (listItem && listItem.length > 0) {
        const contents = listItem.map((item: Item) => {
          const content = new DirectSalesOrderContent();
          content.item = item;
          content.itemId = item?.id;
          content.primaryUnitOfMeasure = item?.product?.unitOfMeasure;
          content.primaryUnitOfMeasureId = item?.product?.unitOfMeasureId;
          content.taxPercentage = item?.product?.taxType?.percentage;
          content.factor = 1;
          content.unitOfMeasure = item?.product?.unitOfMeasure;
          content.unitOfMeasureId = item?.product?.unitOfMeasure?.id;
          content.salePrice = 1 * item.salePrice ?? 0;
          content.taxPercentage = item?.product?.taxType?.percentage;
          content.taxType = item?.product?.taxType;
          content.primaryPrice = item?.salePrice;
          return content;
        });
        setDirectSalesOrderContents([...directSalesOrderContents, ...contents]);
      }
      setVisible(false);
    },
    [directSalesOrderContents, setDirectSalesOrderContents, setVisible],
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        directSalesOrderContents.splice(index, 1);
        setDirectSalesOrderContents([...directSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [directSalesOrderContents, setDirectSalesOrderContents, setCalculateTotal],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: DirectSalesOrderContent) => content.itemId,
          );
          const remainContents = directSalesOrderContents.filter(
            (content: DirectSalesOrderContent) => {
              if (selectedStoreIds.includes(content.itemId)) {
                return false;
              }
              return true;
            },
          );
          setDirectSalesOrderContents([...remainContents]);
          setSelectedContents([]);
          if (setCalculateTotal) {
            setCalculateTotal(true);
          }
        }
      },
    });
  }, [
    directSalesOrderContents,
    selectedContents,
    setDirectSalesOrderContents,
    translate,
    setCalculateTotal,
  ]);

  const defaultVATList = React.useMemo(() => {
    return (content: DirectSalesOrderContent) => {
      const unit = content.taxType;
      if (unit) {
        return [unit];
      }
      return [];
    };
  }, []);

  const columns: ColumnProps<DirectSalesOrderContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<DirectSalesOrderContent>(pagination),
      },
      {
        title: translate('directSalesOrderContents.items.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderContents.items.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderContents.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasure),
        dataIndex: nameof(dataSource[0].unitOfMeasure),
        align: 'center',
        width: 120,
        ellipsis: true,
        render(
          unitOfMeasure: UnitOfMeasure,
          content: DirectSalesOrderContent,
          index: number,
        ) {
          const defaultFilter = new UnitOfMeasureFilter();
          defaultFilter.productId.equal = content.item?.product?.id;

          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                DirectSalesOrderContent
              >(content.errors, nameof(content.unitOfMeasure))}
              help={content.errors?.unitOfMeasure}
            >
              <SelectAutoComplete
                value={content.unitOfMeasure?.id}
                onChange={handleChangeUOMInContent(unitOfMeasure, index)}
                getList={directSalesOrderRepository.singleListUnitOfMeasure}
                list={defaultUOMList(content)}
                modelFilter={defaultFilter}
                setModelFilter={setUnitOfMeasureFilter}
                searchField={nameof(unitOfMeasureFilter.name)}
                searchType={nameof(unitOfMeasureFilter.name.contain)}
                placeholder={translate('directSalesOrderContents.placeholder.unitOfMeasure')}
                allowClear={false}
                disabled={
                  model.requestStateId === 2 || model.requestStateId === 3
                }
              />
            </FormItem>
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
        ellipsis: true,
        render(
          quantity: any,
          DirectSalesOrderContent: DirectSalesOrderContent,
          index,
        ) {
          return (
            <>
              <FormItem
                validateStatus={formService.getValidationStatus<
                  DirectSalesOrderContent
                >(
                  DirectSalesOrderContent.errors,
                  nameof(DirectSalesOrderContent.quantity),
                )}
                help={DirectSalesOrderContent.errors?.quantity}
                className="input-quantity"
              >
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(quantity)}
                  defaultValue={quantity}
                  onChange={handleChangeQuantity(index)}
                  disabled={
                    !DirectSalesOrderContent?.unitOfMeasure?.id ? true : false
                  }
                />
              </FormItem>
            </>
          );
        },
      },
      {
        title: translate('directSalesOrderContents.requestedQuantity'),
        key: nameof(dataSource[0].requestedQuantity),
        dataIndex: nameof(dataSource[0].requestedQuantity),
        align: 'right',
        render(...[requestedQuantity]) {
          return formatNumber(requestedQuantity);
        },
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
        title: translate('directSalesOrderContents.primarySalePrice'),
        key: nameof(dataSource[0].primaryPrice),
        dataIndex: nameof(dataSource[0].primaryPrice),
        render(
          primaryPrice: any,
          content: DirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                DirectSalesOrderContent
              >(content.errors, nameof(content.primaryPrice))}
              help={content.errors?.primaryPrice}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(primaryPrice)}
                value={primaryPrice}
                onChange={handleChangePrimaryPrice(index)}
                min={0}
                disabled={
                  model.requestStateId === 1 &&
                    model?.editedPriceStatusId === 1 &&
                    content?.unitOfMeasure?.id
                    ? false
                    : true
                }
              />
            </FormItem>
          );
        },
        width: 200,
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderContents.salePrice'),
        key: nameof(dataSource[0].salePrice),
        dataIndex: nameof(dataSource[0].salePrice),
        // width: 200,
        align: 'right',
        render(...[salePrice]) {
          return formatNumber(salePrice);
        },
        ellipsis: true,
      },
      {
        title: translate('directSalesOrderContents.discountPercentage'),
        key: nameof(dataSource[0].discountPercentage),
        dataIndex: nameof(dataSource[0].discountPercentage),
        align: 'right',
        width: 100,
        render(
          discountPercentage: any,
          DirectSalesOrderContent: DirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                DirectSalesOrderContent
              >(
                DirectSalesOrderContent.errors,
                nameof(DirectSalesOrderContent.discountPercentage),
              )}
              help={DirectSalesOrderContent.errors?.discountPercentage}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(discountPercentage)}
                defaultValue={discountPercentage || 0}
                onChange={handleChangeDiscountPercentage(index)}
                disabled={
                  // (model.requestStateId === 2 || model.requestStateId === 3) &&
                  !DirectSalesOrderContent?.unitOfMeasure?.id ? true : false
                }
                max={100}
                min={0}
                maximumDecimalCount={2}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('directSalesOrderContents.taxPercentage'),
        key: nameof(dataSource[0].taxPercentage),
        dataIndex: nameof(dataSource[0].item),
        align: 'right',
        render(
          taxPercentage: any,
          content: DirectSalesOrderContent,
          index: number,
        ) {
          const defaultFilter = new TaxTypeFilter();
          return (
            <>
              {validAction('singleListTaxType') && (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrderContent
                  >(content.errors, nameof(content.taxType))}
                  help={content.errors?.taxType}
                >
                  <SelectAutoComplete
                    value={content.taxType?.id}
                    onChange={handleChangeTaxType(taxPercentage, index)}
                    getList={directSalesOrderRepository.singleListTaxType}
                    list={defaultVATList(content)}
                    modelFilter={defaultFilter}
                    setModelFilter={setTaxTypeFilter}
                    searchField={nameof(taxTypeFilter.name)}
                    searchType={nameof(taxTypeFilter.name.contain)}
                    placeholder={translate('directSalesOrderContents.placeholder.taxType')}
                    allowClear={false}
                    disabled={
                      model.requestStateId === 2 || model.requestStateId === 3
                    }
                  />
                </FormItem>
              )}
            </>
          );
        },
      },
      {
        title: translate('directSalesOrderContents.amount'),
        key: nameof(dataSource[0].amount),
        dataIndex: nameof(dataSource[0].amount),
        render(...[amount]) {
          return formatNumber(parseNumber((amount.toString())));
        },
        align: 'right',
      },
      {
        title: translate('directSalesOrders.isEditedPrice'),
        key: nameof(dataSource[0].editedPriceStatus),
        dataIndex: nameof(dataSource[0].editedPriceStatus),
        render(editedPriceStatus: Status) {
          return (
            <div className={editedPriceStatus?.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
        ellipsis: true,
        align: 'center',
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(
          ...params: [DirectSalesOrderContent, DirectSalesOrderContent, number]
        ) {
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
      defaultUOMList,
      defaultVATList,
      handleChangeDiscountPercentage,
      handleChangePrimaryPrice,
      handleChangeQuantity,
      handleChangeTaxType,
      handleChangeUOMInContent,
      handleDelete,
      model,
      pagination,
      taxTypeFilter.name,
      translate,
      unitOfMeasureFilter.name,
      validAction,
    ],
  );

  React.useEffect(() => {
    let newSalePrice = 0;
    if (changeEditPrice === true && directSalesOrderContents.length > 0) {
      directSalesOrderContents.forEach(
        (content: DirectSalesOrderContent, index: number) => {
          newSalePrice = content.item.salePrice * content.factor;
          const amount = calculateTotal(
            directSalesOrderContents[index].quantity,
            newSalePrice,
            directSalesOrderContents[index].discountPercentage,
          );
          directSalesOrderContents[index] = {
            ...directSalesOrderContents[index],
            salePrice: newSalePrice,
            amount,
          };
        },
      );
      setDirectSalesOrderContents([...directSalesOrderContents]);
      setChangeEditPrice(false);
      if (setCalculateTotal) {
        setCalculateTotal(true);
      }
    }
  }, [
    changeEditPrice,
    directSalesOrderContents,
    setCalculateTotal,
    setChangeEditPrice,
    setDirectSalesOrderContents,
    calculateTotal,
  ]);

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
                {validAction('listItem') && (
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
                      onClick={handleBulkDelete}
                      disabled={!selectedContents.length}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      />
      <FormItem
        validateStatus={formService.getValidationStatus<IndirectSalesOrder>(
          model.errors,
          nameof(model.id),
        )}
        help={model.errors?.id}
        className="direct-sales-order-content"
      ></FormItem>
      <ItemModal
        currentStore={currentStore}
        title={translate('directSalesOrderContents.master.item.title')}
        selectedList={listItem}
        initSelectedList={listItemSelected}
        setSelectedList={setListItemSelected}
        list={listItem}
        isOpen={visible}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        currentItem={currentItem}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        isChangeSelectedList={isChangeSelectedList}
        setIsChangeSelectedList={setIsChangeSelectedList}
        filter={filterItem}
        setFilter={setFilterItem}
        loadList={loadList}
        setloadList={setLoadList}
      />
    </>
  );
}
export default DirectSalesOrderContentTable;
