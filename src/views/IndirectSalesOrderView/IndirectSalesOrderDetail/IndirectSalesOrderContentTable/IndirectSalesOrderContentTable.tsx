import { Modal, Popconfirm } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber, parseNumber } from 'helpers/number-format';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { IndirectSalesOrderContentFilter } from 'models/IndirectSalesOrderContentFilter';
import { Item } from 'models/Item';
import { Store } from 'models/Store';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import { indirectSalesOrderService } from 'views/IndirectSalesOrderView/IndirectSalesOrderService';
import ItemModal from 'views/IndirectSalesOrderView/IndirectSalesOrderDetail/ItemModal/ItemModal';
import './IndirectSalesOrderContentTable.scss';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { Status } from 'models/Status';

const { Item: FormItem } = Form;

export interface IndirectSalesOrderContentTableProps
  extends ContentTableProps<IndirectSalesOrder, IndirectSalesOrderContent> {
  filter?: UnitOfMeasureFilter;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  setCalculateTotal?: Dispatch<SetStateAction<boolean>>;
  changeEditPrice?: boolean;
  setChangeEditPrice?: Dispatch<SetStateAction<boolean>>;
  currentStore: Store;
}

function IndirectSalesOrderContentTable(
  props: IndirectSalesOrderContentTableProps,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order',
    API_INDIRECT_SALES_ORDER_ROUTE,
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
    indirectSalesOrderContents,
    setIndirectSalesOrderContents,
    ,
    ,
  ] = crudService.useContentTable<
    IndirectSalesOrder,
    IndirectSalesOrderContent
  >(model, setModel, nameof(model.indirectSalesOrderContents));

  const [
    indirectSalesOrderContentFilter,
    setIndirectSalesOrderContentFilter,
  ] = React.useState<IndirectSalesOrderContentFilter>(
    new IndirectSalesOrderContentFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    indirectSalesOrderContents,
    indirectSalesOrderContentFilter,
    setIndirectSalesOrderContentFilter,
  );

  const [selectedContents, setSelectedContents] = React.useState<
    IndirectSalesOrderContent[]
  >([]);

  const rowSelection: TableRowSelection<IndirectSalesOrderContent> = crudService.useContentModalList<
    IndirectSalesOrderContent
  >(selectedContents, setSelectedContents);

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [taxTypeFilter, setTaxTypeFilter] = React.useState<TaxTypeFilter>(
    new TaxTypeFilter(),
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    filterItem,
    setFilterItem,
    handleCloseModal,
    handleOpenModal,
    loadList,
    setLoadList,
  } = indirectSalesOrderService.useItemModal(currentStore, setVisible, model);

  const calculateTotal = React.useMemo(() => {
    return (quantity: number, salePrice: number, disCount: number) => {
      return Number.parseFloat(
        (quantity * salePrice * ((100 - disCount) / 100)).toFixed(3),
      );
    };
  }, []);

  const defaultUOMList = React.useMemo(() => {
    return (content: IndirectSalesOrderContent) => {
      const unit = content.unitOfMeasure;
      if (unit) {
        return [unit];
      }
      return [];
    };
  }, []);

  const defaultVATList = React.useMemo(() => {
    return (content: IndirectSalesOrderContent) => {
      const unit = content.taxType;
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
          indirectSalesOrderContents[index]?.item?.salePrice * t?.factor;
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          newSalePrice,
          indirectSalesOrderContents[index].discountPercentage,
        );
        const requestedQuantitys = Number(
          indirectSalesOrderContents[index].quantity * t?.factor,
        );

        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
          salePrice: newSalePrice,
          amount: total,
          factor: t?.factor,
          requestedQuantity: requestedQuantitys,
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      setCalculateTotal,
      indirectSalesOrderContents,
      calculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeTaxType = React.useCallback(
    (...[, index]) => {
      return (id: number | string | null, t: TaxType) => {
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          taxType: t,
          taxTypeId: +id,
          taxPercentage: t?.percentage,
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      setCalculateTotal,
      indirectSalesOrderContents,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeQuantity = React.useCallback(
    index => {
      return event => {
        if (
          indirectSalesOrderContents[index] &&
          indirectSalesOrderContents[index].unitOfMeasure
        ) {
          let requestedQuantity = 0;
          let total = calculateTotal(
            Number(event),
            indirectSalesOrderContents[index].salePrice,
            indirectSalesOrderContents[index].discountPercentage,
          );
          if (event === undefined || event === null) {
            requestedQuantity = 0;
            total = 0;
          } else if (indirectSalesOrderContents[index].factor) {
            requestedQuantity = Number(
              Number(event) * indirectSalesOrderContents[index].factor,
            );
          }

          indirectSalesOrderContents[index] = {
            ...indirectSalesOrderContents[index],
            quantity: Number(event),
            requestedQuantity,
            amount: total,
          };
        }
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangeDiscountPercentage = React.useCallback(
    index => {
      return event => {
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          indirectSalesOrderContents[index].salePrice,
          Number(event),
        );
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          discountPercentage: Number(event),
          amount: Number(total),
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );

  const handleChangePrimaryPrice = React.useCallback(
    index => {
      return event => {
        const primaryPrice = Number(event);
        indirectSalesOrderContents[index].salePrice =
          primaryPrice * indirectSalesOrderContents[index].factor;
        const lowerBlock =
          indirectSalesOrderContents[index].item.salePrice * 0.9;
        const blockOn = indirectSalesOrderContents[index].item.salePrice * 1.1;
        const total = calculateTotal(
          indirectSalesOrderContents[index].quantity,
          indirectSalesOrderContents[index].salePrice,
          indirectSalesOrderContents[index].discountPercentage,
        );
        let errors: any = indirectSalesOrderContents[index].errors;
        if (Number(event) < lowerBlock || Number(event) > blockOn) {
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.primaryPrice = 'Gi?? n???m ngo??i kho???ng cho ph??p';
          } else {
            errors = {};
            errors.primaryPrice = 'Gi?? n???m ngo??i kho???ng cho ph??p';
          }
        } else {
          if (typeof errors !== 'undefined' && errors !== null) {
            errors.primaryPrice = null;
          } else {
            errors = {};
            errors.primaryPrice = null;
          }
        }
        indirectSalesOrderContents[index] = {
          ...indirectSalesOrderContents[index],
          primaryPrice: Number(event),
          salePrice: indirectSalesOrderContents[index].salePrice,
          amount: Number(total),
          errors,
        };
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      calculateTotal,
      indirectSalesOrderContents,
      setCalculateTotal,
      setIndirectSalesOrderContents,
    ],
  );
  const handleSaveModal = React.useCallback(
    listItem => {
      if (listItem && listItem.length > 0) {
        const contents = listItem.map((item: Item) => {
          const content = new IndirectSalesOrderContent();
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
        setIndirectSalesOrderContents([
          ...indirectSalesOrderContents,
          ...contents,
        ]);
      }
      setVisible(false);
    },
    [indirectSalesOrderContents, setIndirectSalesOrderContents, setVisible],
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        indirectSalesOrderContents.splice(index, 1);
        setIndirectSalesOrderContents([...indirectSalesOrderContents]);
        if (setCalculateTotal) {
          setCalculateTotal(true);
        }
      };
    },
    [
      indirectSalesOrderContents,
      setIndirectSalesOrderContents,
      setCalculateTotal,
    ],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: IndirectSalesOrderContent) => content.itemId,
          );
          const remainContents = indirectSalesOrderContents.filter(
            (content: IndirectSalesOrderContent) => {
              if (selectedStoreIds.includes(content.itemId)) {
                return false;
              }
              return true;
            },
          );
          setIndirectSalesOrderContents([...remainContents]);
          setSelectedContents([]);
          if (setCalculateTotal) {
            setCalculateTotal(true);
          }
        }
      },
    });
  }, [
    indirectSalesOrderContents,
    selectedContents,
    setIndirectSalesOrderContents,
    translate,
    setCalculateTotal,
  ]);

  const columns: ColumnProps<IndirectSalesOrderContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<IndirectSalesOrderContent>(pagination),
      },
      {
        title: translate('indirectSalesOrderContents.items.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.items.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasure),
        dataIndex: nameof(dataSource[0].unitOfMeasure),
        align: 'center',
        width: 120,
        ellipsis: true,
        render(
          unitOfMeasure: UnitOfMeasure,
          content: IndirectSalesOrderContent,
          index: number,
        ) {
          const defaultFilter = new UnitOfMeasureFilter();
          defaultFilter.productId.equal = content.item?.product?.id;

          return (
            <>
              {validAction('singleListUnitOfMeasure') && (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrderContent
                  >(content.errors, nameof(content.unitOfMeasure))}
                  help={content.errors?.unitOfMeasure}
                >
                  <SelectAutoComplete
                    value={content.unitOfMeasure?.id}
                    onChange={handleChangeUOMInContent(unitOfMeasure, index)}
                    getList={
                      indirectSalesOrderRepository.singleListUnitOfMeasure
                    }
                    list={defaultUOMList(content)}
                    modelFilter={defaultFilter}
                    setModelFilter={setUnitOfMeasureFilter}
                    searchField={nameof(unitOfMeasureFilter.name)}
                    searchType={nameof(unitOfMeasureFilter.name.contain)}
                    placeholder={translate(
                      'indirectSalesOrderContents.placeholder.unitOfMeasure',
                    )}
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
        title: () => (
          <div className="mr-2">
            {translate('indirectSalesOrderContents.quantity')}
          </div>
        ),
        key: nameof(dataSource[0].quantity),
        dataIndex: nameof(dataSource[0].quantity),
        align: 'right',
        ellipsis: true,
        render(
          quantity: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index,
        ) {
          return (
            <>
              <FormItem
                validateStatus={formService.getValidationStatus<
                  IndirectSalesOrderContent
                >(
                  indirectSalesOrderContent.errors,
                  nameof(indirectSalesOrderContent.quantity),
                )}
                help={indirectSalesOrderContent.errors?.quantity}
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
                    !indirectSalesOrderContent?.unitOfMeasure?.id ||
                    model.requestStateId === 2 ||
                    model.requestStateId === 3
                  }
                />
              </FormItem>
            </>
          );
        },
      },
      {
        title: translate('indirectSalesOrderContents.requestedQuantity'),
        key: nameof(dataSource[0].requestedQuantity),
        dataIndex: nameof(dataSource[0].requestedQuantity),
        align: 'right',
        render(...[requestedQuantity]) {
          return formatNumber(requestedQuantity);
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.primaryUnitOfMeasure'),
        key: nameof(dataSource[0].primaryUnitOfMeasure),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.product?.unitOfMeasure?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.primarySalePrice'),
        key: nameof(dataSource[0].primaryPrice),
        dataIndex: nameof(dataSource[0].primaryPrice),
        render(
          primaryPrice: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(
                indirectSalesOrderContent.errors,
                nameof(indirectSalesOrderContent.primaryPrice),
              )}
              help={indirectSalesOrderContent.errors?.primaryPrice}
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
                  indirectSalesOrderContent?.unitOfMeasure?.id
                    ? false
                    : true
                }
              />
            </FormItem>
          );
        },
        ellipsis: true,
        width: 200,
      },
      {
        title: translate('indirectSalesOrderContents.salePrice'),
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
        title: translate('indirectSalesOrderContents.discountPercentage'),
        key: nameof(dataSource[0].discountPercentage),
        dataIndex: nameof(dataSource[0].discountPercentage),
        align: 'right',
        width: 100,
        render(
          discountPercentage: any,
          indirectSalesOrderContent: IndirectSalesOrderContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                IndirectSalesOrderContent
              >(
                indirectSalesOrderContent.errors,
                nameof(indirectSalesOrderContent.discountPercentage),
              )}
              help={indirectSalesOrderContent.errors?.discountPercentage}
            >
              <InputNumber
                allowNegative={false}
                className="form-control form-control-sm"
                name={nameof(discountPercentage)}
                defaultValue={discountPercentage || 0}
                onChange={handleChangeDiscountPercentage(index)}
                disabled={
                  // (model.requestStateId === 2 || model.requestStateId === 3) &&
                  !indirectSalesOrderContent?.unitOfMeasure?.id ||
                  model.requestStateId === 2 ||
                  model.requestStateId === 3
                }
                max={100}
                min={0}
                maximumDecimalCount={2}
              />
            </FormItem>
          );
        },
        ellipsis: true,
      },

      {
        title: translate('indirectSalesOrderContents.taxPercentage'),
        key: nameof(dataSource[0].taxPercentage),
        dataIndex: nameof(dataSource[0].item),
        render(
          taxPercentage: any,
          content: IndirectSalesOrderContent,
          index: number,
        ) {
          const defaultFilter = new TaxTypeFilter();
          return (
            <>
              {validAction('singleListTaxType') && (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrderContent
                  >(content.errors, nameof(content.taxType))}
                  help={content.errors?.taxType}
                >
                  <SelectAutoComplete
                    value={content.taxType?.id}
                    onChange={handleChangeTaxType(taxPercentage, index)}
                    getList={indirectSalesOrderRepository.singleListTaxType}
                    list={defaultVATList(content)}
                    modelFilter={defaultFilter}
                    setModelFilter={setTaxTypeFilter}
                    searchField={nameof(taxTypeFilter.name)}
                    searchType={nameof(taxTypeFilter.name.contain)}
                    placeholder={translate(
                      'indirectSalesOrderContents.placeholder.taxType',
                    )}
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
        align: 'right',
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrderContents.amount'),
        key: nameof(dataSource[0].amount),
        dataIndex: nameof(dataSource[0].amount),
        render(...[amount]) {
          return formatNumber(parseNumber(amount.toString()));
        },
        align: 'right',
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrders.isEditedPrice'),
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
          ...params: [
            IndirectSalesOrderContent,
            IndirectSalesOrderContent,
            number,
          ]
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
      handleChangeTaxType,
      handleChangeQuantity,
      handleChangePrimaryPrice,
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
    if (changeEditPrice === true && indirectSalesOrderContents.length > 0) {
      indirectSalesOrderContents.forEach(
        (content: IndirectSalesOrderContent, index: number) => {
          newSalePrice = content.item.salePrice;
          indirectSalesOrderContents[index].salePrice =
            newSalePrice * indirectSalesOrderContents[index].factor;
          const amount = calculateTotal(
            indirectSalesOrderContents[index].quantity,
            indirectSalesOrderContents[index].salePrice,
            indirectSalesOrderContents[index].discountPercentage,
          );
          indirectSalesOrderContents[index] = {
            ...indirectSalesOrderContents[index],
            primaryPrice: newSalePrice,
            amount,
          };
        },
      );
      setIndirectSalesOrderContents([...indirectSalesOrderContents]);
      setChangeEditPrice(false);
      if (setCalculateTotal) {
        setCalculateTotal(true);
      }
    }
  }, [
    changeEditPrice,
    indirectSalesOrderContents,
    setCalculateTotal,
    setChangeEditPrice,
    setIndirectSalesOrderContents,
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
        className="indirect-sales-order-content"
      ></FormItem>
      <ItemModal
        title={translate('indirectSalesOrderContents.master.item.title')}
        isOpen={visible}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        filter={filterItem}
        setFilter={setFilterItem}
        loadList={loadList}
        setloadList={setLoadList}
      />
    </>
  );
}
export default IndirectSalesOrderContentTable;
