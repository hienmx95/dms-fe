import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { debounce } from 'core/helpers/debounce';
import { limitWord } from 'core/helpers/string';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { EditPriceStatus } from 'models/EditPriceStatus';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import IndirectSalesOrderContentTable from 'views/IndirectSalesOrderView/IndirectSalesOrderDetail/IndirectSalesOrderContentTable/IndirectSalesOrderContentTable';
import IndirectSalesOrderPromotionTable from 'views/IndirectSalesOrderView/IndirectSalesOrderDetail/IndirectSalesOrderPromotionTable/IndirectSalesOrderPromotionTable';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import './IndirectSalesOrderDetail.scss';
import StoreModal from './StoreModal/StoreModal';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function IndirectSalesOrderDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'indirect-sales-order',
    API_INDIRECT_SALES_ORDER_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const time = moment();
  const [
    indirectSalesOrder,
    setIndirectSalesOrder,
    loading,
    ,
    isDetail,
    handleSave,
    handleSend,
    handleApprove,
    handleReject,
  ] = crudService.useDetail(
    IndirectSalesOrder,
    indirectSalesOrderRepository.get,
    indirectSalesOrderRepository.save,
    indirectSalesOrderRepository.send,
    indirectSalesOrderRepository.approve,
    indirectSalesOrderRepository.reject,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<IndirectSalesOrder>(
    indirectSalesOrder,
    setIndirectSalesOrder,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [editPriceStatusList] = crudService.useEnumList<EditPriceStatus>(
    indirectSalesOrderRepository.singleListEditPriceStatus,
  );

  // const [indirectSalesOrderStatusList] = crudService.useEnumList<IndirectSalesOrderStatus>(indirectSalesOrderRepository.singleListIndirectSalesOrderStatus);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [, , , listStore2] = crudService.useContentModal(
    indirectSalesOrderRepository.listStore,
    indirectSalesOrderRepository.countStore,
    StoreFilter,
  );

  const [listBuyerStore, setListBuyerStore] = React.useState<Store[]>([]);
  const [listResellerStore, setListResellerStore] = React.useState<Store[]>([]);
  const [visibleBuyerStore, setVisibleBuyerStore] = React.useState<boolean>(
    false,
  );
  const [visibleResellerStore, setVisibleResellerStore] = React.useState<
    boolean
  >(false);
  const [calculateTotal, setCalculateTotal] = React.useState<boolean>(true);
  const [changeEditPrice, setChangeEditPrice] = React.useState<boolean>(false);
  const [resetFilter, setResetFilter] = React.useState<boolean>(false);
  const [currentBuyerStore, setCurrentBuyerStore] = React.useState<Store>(
    new Store(),
  );
  const [currentResellerStore, setCurrentResellerStore] = React.useState<Store>(
    new Store(),
  );

  React.useEffect(() => {
    if (calculateTotal) {
      let newSubTotal = 0;
      let generalDiscountAmount =
        indirectSalesOrder.generalDiscountAmount !== undefined
          ? indirectSalesOrder.generalDiscountAmount
          : 0;
      let generalVAT = 0;
      if (
        indirectSalesOrder.indirectSalesOrderContents &&
        indirectSalesOrder.indirectSalesOrderContents.length >= 0
      ) {
        indirectSalesOrder.indirectSalesOrderContents.forEach(
          (indirectSalesOrderContent: IndirectSalesOrderContent) => {
            newSubTotal += indirectSalesOrderContent.amount;
          },
        );
        indirectSalesOrder.indirectSalesOrderContents.forEach(
          (indirectSalesOrderContent: IndirectSalesOrderContent) => {
            /*
             * vat = SUM ([amount - (Chiet khau tong don X amount)/subtotal]x % VAt từng dòng)
             [(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent]
             SUM{[(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent] [(1-n)]}
            */

            generalVAT +=
              (indirectSalesOrderContent.amount -
                (newSubTotal !== 0
                  ? (indirectSalesOrder.generalDiscountAmount *
                    indirectSalesOrderContent.amount) /
                  newSubTotal
                  : 0)) *
              (indirectSalesOrderContent.taxPercentage / 100);
          },
        );
        if (newSubTotal && indirectSalesOrder.generalDiscountPercentage) {
          generalDiscountAmount =
            (newSubTotal * indirectSalesOrder.generalDiscountPercentage) / 100;
        }

        let newTotal = newSubTotal - generalDiscountAmount + generalVAT;
        if (indirectSalesOrder.generalDiscountPercentage === 100) {
          generalVAT = 0;
          newTotal = 0;
        }

        setIndirectSalesOrder({
          ...indirectSalesOrder,
          subTotal: newSubTotal,
          totalTaxAmount: Math.floor(generalVAT),
          total: Math.round(newTotal),
          generalDiscountAmount,
        });
      }

      setCalculateTotal(false);
    }
  }, [calculateTotal, indirectSalesOrder, setIndirectSalesOrder]);

  React.useEffect(() => {
    if (
      indirectSalesOrder &&
      (!indirectSalesOrder.requestStateId ||
        indirectSalesOrder.requestStateId === null)
    ) {
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        requestStateId: 1,
      });
    }
  }, [setIndirectSalesOrder, indirectSalesOrder]);

  const handleOpenBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(true);
    setResetFilter(true);
  }, [setVisibleBuyerStore]);

  const handleCloseBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(false);
    setResetFilter(true);
    setListBuyerStore([currentBuyerStore]);
  }, [setVisibleBuyerStore, currentBuyerStore]);

  const handleSavePopupBuyerStore = React.useCallback(
    event => {
      setVisibleBuyerStore(false);
      const errors = indirectSalesOrder.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.buyerStore = null;
      }

      setIndirectSalesOrder({
        ...indirectSalesOrder,
        buyerStoreId: event[0].id,
        buyerStore: event[0],
        deliveryAddress: event[0].deliveryAddress,
        phoneNumber: event[0].telephone,
        sellerStoreId: event[0].parentStoreId,
        sellerStore: event[0].parentStore,
        errors,
      });
      setCurrentBuyerStore(event[0]);
      setCurrentResellerStore(event[0].parentStore);
      setListBuyerStore(event);
      setListResellerStore([event[0].parentStore]);
    },
    [
      setVisibleBuyerStore,
      setListBuyerStore,
      setIndirectSalesOrder,
      indirectSalesOrder,
      setCurrentBuyerStore,
    ],
  );
  const handleOpenResellerStore = React.useCallback(() => {
    setVisibleResellerStore(true);
    setResetFilter(true);
  }, [setVisibleResellerStore]);

  const handleCloseResellerStore = React.useCallback(() => {
    setVisibleResellerStore(false);
    setResetFilter(true);
    setListResellerStore([currentResellerStore]);
  }, [setVisibleResellerStore, currentResellerStore]);

  const handleSavePopupResellerStore = React.useCallback(
    event => {
      setVisibleResellerStore(false);
      const errors = indirectSalesOrder.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.sellerStore = null;
      }
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        sellerStoreId: event[0].id,
        sellerStore: event[0],
        errors,
      });
      setListResellerStore(event);
      setCurrentResellerStore(event[0]);
    },
    [
      setVisibleResellerStore,
      setListResellerStore,
      setIndirectSalesOrder,
      indirectSalesOrder,
      setCurrentResellerStore,
    ],
  );

  const handleChangeGeneralDiscountPercentage = React.useCallback(
    debounce(event => {
      let percent = event ? event : 0;
      if (percent > 100) {
        percent = 100;
      }
      let discountAmount = Math.floor(
        (percent / 100) * indirectSalesOrder?.subTotal,
      );

      if (percent === 0) {
        discountAmount = 0;
      }
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        generalDiscountAmount:
          typeof event !== 'undefined'
            ? discountAmount
            : indirectSalesOrder?.generalDiscountAmount,
        generalDiscountPercentage: percent,
      });
      setCalculateTotal(true);
    }),
    [indirectSalesOrder, setIndirectSalesOrder],
  );

  const handleChangeGeneralDiscountAmount = React.useCallback(
    debounce(event => {
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        generalDiscountAmount: event === undefined ? 0 : event,
        generalDiscountPercentage: undefined,
      });
      setCalculateTotal(true);
    }),
    [indirectSalesOrder, setIndirectSalesOrder],
  );

  const handleChangeChangeEditPrice = React.useCallback(
    (editedPriceStatusId, editedPriceStatus) => {
      if (editedPriceStatusId === 0) {
        setChangeEditPrice(true);
        if (
          indirectSalesOrder.indirectSalesOrderContents &&
          indirectSalesOrder.indirectSalesOrderContents.length > 0
        ) {
          indirectSalesOrder.indirectSalesOrderContents.forEach(
            (indirectSalesOrderContent: IndirectSalesOrderContent) => {
              indirectSalesOrderContent.errors = null;
            },
          );
        }
      } else {
        setChangeEditPrice(false);
      }
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        editedPriceStatusId,
        editedPriceStatus,
      });
    },
    [indirectSalesOrder, setIndirectSalesOrder],
  );

  React.useEffect(() => {
    if (
      !indirectSalesOrder.orderDate ||
      indirectSalesOrder.orderDate === null ||
      indirectSalesOrder.orderDate === undefined
    ) {
      setIndirectSalesOrder({
        ...indirectSalesOrder,
        orderDate: time,
      });
    }
  }, [indirectSalesOrder, setIndirectSalesOrder, time]);

  return (
    <div className="page detail-page detail-page-indirect-order">
      <Spin spinning={loading}>
        <Card
          className="short"
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link mr-2 btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left" />
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('indirectSalesOrders.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
                {indirectSalesOrder.requestStateId &&
                  indirectSalesOrder.requestStateId === 1 && (
                    <div className="new-state ml-4">
                      {translate(generalLanguageKeys.state.new)}
                    </div>
                  )}
                {indirectSalesOrder.requestStateId &&
                  indirectSalesOrder.requestStateId === 2 && (
                    <div className="pending-state ml-4">
                      {translate(generalLanguageKeys.state.pending)}
                    </div>
                  )}
                {indirectSalesOrder.requestStateId &&
                  indirectSalesOrder.requestStateId === 3 && (
                    <div className="approved-state ml-4">
                      {translate(generalLanguageKeys.state.approved)}
                    </div>
                  )}
                {indirectSalesOrder.requestStateId &&
                  indirectSalesOrder.requestStateId === 4 && (
                    <div className="rejected-state ml-4">
                      {translate(generalLanguageKeys.state.rejected)}
                    </div>
                  )}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {(indirectSalesOrder.requestStateId === 1 ||
                  !indirectSalesOrder.requestStateId ||
                  indirectSalesOrder.requestStateId === 4) && (
                    <>
                      {!isDetail && validAction('create') && (
                        <button
                          className="btn btn-sm btn-primary float-right"
                          onClick={handleSave}
                        >
                          <i className="fa mr-2 fa-save" />
                          {translate(generalLanguageKeys.actions.save)}
                        </button>
                      )}

                      {isDetail && validAction('update') && (
                        <button
                          className="btn btn-sm btn-primary float-right"
                          onClick={handleSave}
                        >
                          <i className="fa mr-2 fa-save" />
                          {translate(generalLanguageKeys.actions.save)}
                        </button>
                      )}
                      {validAction('send') && (
                        <button
                          className="btn btn-sm btn-primary float-right mr-2"
                          onClick={handleSend}
                        >
                          <i className="fa mr-2 fa-paper-plane"></i>
                          {translate(generalLanguageKeys.actions.send)}
                        </button>
                      )}
                    </>
                  )}
                {indirectSalesOrder.requestStateId === 2 && (
                  <>
                    {isDetail && validAction('reject') && (
                      <button
                        className="btn btn-sm btn-reject float-right ml-2"
                        onClick={handleReject}
                      >
                        <i className="fa mr-2 fa-ban"></i>
                        {translate(generalLanguageKeys.actions.reject)}
                      </button>
                    )}
                    {isDetail && validAction('approve') && (
                      <button
                        className="btn btn-sm btn-approve float-right ml-2"
                        onClick={handleApprove}
                      >
                        <i className="fa mr-2 fa-check"></i>
                        {translate(generalLanguageKeys.actions.approve)}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <div className="title-detail">
              <span className="title-default">
                {translate('indirectSalesOrders.general.title')}
              </span>
            </div>
            <Row>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(indirectSalesOrder.errors, nameof(indirectSalesOrder.code))}
                  help={indirectSalesOrder.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.code')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.code),
                    )}
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.code',
                    )}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.phoneNumber),
                  )}
                  help={indirectSalesOrder.errors?.phoneNumber}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.phoneNumber')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.phoneNumber}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.phoneNumber),
                    )}
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.phoneNumber',
                    )}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.orderDate),
                  )}
                  help={indirectSalesOrder.errors?.orderDate}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.orderDate')}
                    <span className="text-danger">*</span>
                  </span>
                  <DatePicker
                    value={
                      typeof indirectSalesOrder.orderDate === 'object'
                        ? indirectSalesOrder.orderDate
                        : time
                    }
                    onChange={handleUpdateDateField(
                      nameof(indirectSalesOrder.orderDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.orderDate',
                    )}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.editedPriceStatus),
                  )}
                  help={indirectSalesOrder.errors?.editedPriceStatus}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.isEditedPrice')}
                  </span>
                  <Switch
                    checked={
                      indirectSalesOrder.editedPriceStatusId ===
                      editPriceStatusList[1]?.id
                    }
                    list={editPriceStatusList}
                    onChange={handleChangeChangeEditPrice}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                {validAction('singleListAppUser') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.saleEmployee),
                    )}
                    help={indirectSalesOrder.errors?.saleEmployee}
                  >
                    <span className="label-input ml-3">
                      {translate('indirectSalesOrders.saleEmployee')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={indirectSalesOrder.saleEmployee?.id}
                      onChange={handleChangeObjectField(
                        nameof(indirectSalesOrder.saleEmployee),
                      )}
                      getList={indirectSalesOrderRepository.singleListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      placeholder={translate(
                        'indirectSalesOrders.placeholder.saleEmployee',
                      )}
                      disabled={
                        indirectSalesOrder.requestStateId === 2 ||
                        indirectSalesOrder.requestStateId === 3
                      }
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.deliveryAddress),
                  )}
                  help={indirectSalesOrder.errors?.deliveryAddress}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.deliveryAddress')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.deliveryAddress}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.deliveryAddress),
                    )}
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.deliveryAddress',
                    )}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(
                    indirectSalesOrder.errors,
                    nameof(indirectSalesOrder.deliveryDate),
                  )}
                  help={indirectSalesOrder.errors?.deliveryDate}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.deliveryDate')}
                  </span>
                  <DatePicker
                    value={formatInputDate(indirectSalesOrder.deliveryDate)}
                    onChange={handleUpdateDateField(
                      nameof(indirectSalesOrder.deliveryDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.deliveryDate',
                    )}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                {validAction('listStore') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.buyerStore),
                    )}
                    help={indirectSalesOrder.errors?.buyerStore}
                  >
                    <span className="label-input ml-3">
                      {translate('indirectSalesOrders.buyerStore')}
                      <span className="text-danger">*</span>
                    </span>
                    {indirectSalesOrder?.requestStateId === 1 && (
                      <div className="input-store ant-form-item">
                        <span onClick={handleOpenBuyerStore}>
                          <Tooltip
                            placement="topLeft"
                            title={indirectSalesOrder?.buyerStore?.name}
                          >
                            {window.innerWidth >= 1920 &&
                              indirectSalesOrder.buyerStore?.name &&
                              limitWord(
                                indirectSalesOrder.buyerStore?.name,
                                30,
                              )}
                            {window.innerWidth < 1920 &&
                              indirectSalesOrder.buyerStore?.name &&
                              limitWord(
                                indirectSalesOrder.buyerStore?.name,
                                20,
                              )}
                          </Tooltip>

                          {!indirectSalesOrder.buyerStore?.name && (
                            <span className="placeholder">
                              {translate(
                                'indirectSalesOrders.placeholder.buyerStore',
                              )}
                            </span>
                          )}
                          <i className="fa fa-list-alt" aria-hidden="true" />
                        </span>
                      </div>
                    )}
                    {(indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3) && (
                        <div className="search-container">
                          <input
                            className="form-control search-box"
                            placeholder={translate(
                              'indirectSalesOrders.placeholder.buyerStore',
                            )}
                            defaultValue={indirectSalesOrder.buyerStore?.name}
                            disabled
                          />
                          <i
                            className="fa fa-list-alt search-icon"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                  </FormItem>
                )}

                {validAction('listStore') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.sellerStore),
                    )}
                    help={indirectSalesOrder.errors?.sellerStore}
                  >
                    <span className="label-input ml-3">
                      {translate('indirectSalesOrders.sellerStore')}
                      <span className="text-danger">*</span>
                    </span>
                    {indirectSalesOrder?.requestStateId === 1 && (
                      <div className="input-store ant-form-item">
                        <span onClick={handleOpenResellerStore}>
                          <Tooltip
                            placement="topLeft"
                            title={indirectSalesOrder?.sellerStore?.name}
                          >
                            {window.innerWidth >= 1920 &&
                              indirectSalesOrder.sellerStore?.name &&
                              limitWord(
                                indirectSalesOrder.sellerStore?.name,
                                30,
                              )}
                            {window.innerWidth < 1920 &&
                              indirectSalesOrder.sellerStore?.name &&
                              limitWord(
                                indirectSalesOrder.sellerStore?.name,
                                20,
                              )}
                          </Tooltip>

                          {!indirectSalesOrder.sellerStore?.name && (
                            <span className="placeholder">
                              {translate(
                                'indirectSalesOrders.placeholder.sellerStore',
                              )}
                            </span>
                          )}
                          <i className="fa fa-list-alt" aria-hidden="true" />
                        </span>
                      </div>
                    )}
                    {(indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3) && (
                        <div className="search-container">
                          <input
                            className="form-control search-box"
                            placeholder={translate(
                              'indirectSalesOrders.placeholder.sellerStore',
                            )}
                            defaultValue={indirectSalesOrder.sellerStore?.name}
                            disabled
                          />
                          <i
                            className="fa fa-list-alt search-icon"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    IndirectSalesOrder
                  >(indirectSalesOrder.errors, nameof(indirectSalesOrder.note))}
                  help={indirectSalesOrder.errors?.note}
                >
                  <span className="label-input ml-3">
                    {translate('indirectSalesOrders.note')}
                  </span>
                  <input
                    type="text"
                    defaultValue={indirectSalesOrder.note}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(indirectSalesOrder.note),
                    )}
                    placeholder={translate(
                      'indirectSalesOrders.placeholder.note',
                    )}
                    disabled={
                      indirectSalesOrder.requestStateId === 2 ||
                      indirectSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <Tabs defaultActiveKey="1" className="mr-3 tab">
            <TabPane
              key="indirectSalesOrderContents"
              tab={translate(
                'indirectSalesOrders.tabs.indirectSalesOrderContents.title',
              )}
            >
              <IndirectSalesOrderContentTable
                model={indirectSalesOrder}
                setModel={setIndirectSalesOrder}
                field={nameof(indirectSalesOrder.indirectSalesOrderContents)}
                onChange={handleChangeSimpleField(
                  nameof(indirectSalesOrder.indirectSalesOrderContents),
                )}
                setCalculateTotal={setCalculateTotal}
                changeEditPrice={changeEditPrice}
                setChangeEditPrice={setChangeEditPrice}
                currentStore={currentBuyerStore}
              />
            </TabPane>

            <TabPane
              key="indirectSalesOrderPromotions"
              tab={translate(
                'indirectSalesOrders.tabs.indirectSalesOrderPromotions.title',
              )}
            >
              <IndirectSalesOrderPromotionTable
                model={indirectSalesOrder}
                setModel={setIndirectSalesOrder}
                field={nameof(indirectSalesOrder.indirectSalesOrderPromotions)}
                onChange={handleChangeSimpleField(
                  nameof(indirectSalesOrder.indirectSalesOrderPromotions),
                )}
                currentStore={currentResellerStore}
              />
            </TabPane>
          </Tabs>
          <div className="info-title ml-3 mb-3 mt-3">
            <span className="title-default">
              {translate('indirectSalesOrders.payment.title')}
            </span>
          </div>
          <div className="payment">
            <Row>
              <Col lg={16}></Col>
              <Col lg={8}>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.subTotal),
                    )}
                    help={indirectSalesOrder.errors?.subTotal}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('indirectSalesOrders.subTotal')}
                    </span>
                    <InputNumber
                      value={indirectSalesOrder.subTotal}
                      className="form-control form-control-sm sub-total"
                      minimumDecimalCount={3}
                      maximumDecimalCount={3}
                      disabled
                    />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.generalDiscountPercentage),
                    )}
                    help={indirectSalesOrder.errors?.generalDiscountPercentage}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate(
                        'indirectSalesOrders.generalDiscountPercentage',
                      )}
                    </span>
                    <InputNumber
                      type="text"
                      value={indirectSalesOrder.generalDiscountPercentage}
                      className="form-control form-control-sm input-discount"
                      onChange={handleChangeGeneralDiscountPercentage}
                      disabled={
                        indirectSalesOrder.requestStateId === 2 ||
                        indirectSalesOrder.requestStateId === 3
                        // || indirectSalesOrder.generalDiscountPercentage === undefined
                      }
                      allowNegative={false}
                      min={0}
                      max={100}
                      maximumDecimalCount={2}
                    />

                    <span className="ml-4">%</span>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.generalDiscountAmount),
                    )}
                    help={indirectSalesOrder.errors?.generalDiscountAmount}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate(
                        'indirectSalesOrders.newGeneralDiscountPercentage',
                      )}
                    </span>
                    <InputNumber
                      value={indirectSalesOrder?.generalDiscountAmount}
                      className="form-control form-control-sm input-discount-amount"
                      onChange={handleChangeGeneralDiscountAmount}
                      disabled={
                        indirectSalesOrder.requestStateId === 2 ||
                        indirectSalesOrder.requestStateId === 3
                        // || indirectSalesOrder.generalDiscountPercentage !== undefined
                      }
                      allowNegative={false}
                      min={0}
                      max={indirectSalesOrder?.subTotal}
                    />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.totalTaxAmount),
                    )}
                    help={indirectSalesOrder.errors?.totalTaxAmount}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('indirectSalesOrders.totalTaxAmount')}
                    </span>
                    <InputNumber
                      value={indirectSalesOrder.totalTaxAmount || 0}
                      className="form-control form-control-sm"
                      disabled
                      min={0}
                    />
                  </FormItem>

                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      IndirectSalesOrder
                    >(
                      indirectSalesOrder.errors,
                      nameof(indirectSalesOrder.total),
                    )}
                    help={indirectSalesOrder.errors?.total}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('indirectSalesOrders.newTotal')}
                    </span>
                    <InputNumber
                      value={indirectSalesOrder.total || 0}
                      className="form-control form-control-sm"
                      disabled
                      min={0}
                    />
                  </FormItem>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <div>
              <button
                className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
              {(indirectSalesOrder.requestStateId === 1 ||
                !indirectSalesOrder.requestStateId ||
                indirectSalesOrder.requestStateId === 4) && (
                  <>
                    {!isDetail && validAction('create') && (
                      <button
                        className="btn btn-sm btn-primary float-right"
                        onClick={handleSave}
                      >
                        <i className="fa mr-2 fa-save" />
                        {translate(generalLanguageKeys.actions.save)}
                      </button>
                    )}

                    {isDetail && validAction('update') && (
                      <button
                        className="btn btn-sm btn-primary float-right"
                        onClick={handleSave}
                      >
                        <i className="fa mr-2 fa-save" />
                        {translate(generalLanguageKeys.actions.save)}
                      </button>
                    )}
                    {validAction('send') && (
                      <button
                        className="btn btn-sm btn-primary float-right mr-2"
                        onClick={handleSend}
                      >
                        <i className="fa mr-2 fa-paper-plane"></i>
                        {translate(generalLanguageKeys.actions.send)}
                      </button>
                    )}
                  </>
                )}
              {indirectSalesOrder.requestStateId === 2 && (
                <>
                  {isDetail && validAction('reject') && (
                    <button
                      className="btn btn-sm btn-reject float-right ml-2"
                      onClick={handleReject}
                    >
                      <i className="fa mr-2 fa-ban"></i>
                      {translate(generalLanguageKeys.actions.reject)}
                    </button>
                  )}
                  {isDetail && validAction('approve') && (
                    <button
                      className="btn btn-sm btn-approve float-right ml-2"
                      onClick={handleApprove}
                    >
                      <i className="fa mr-2 fa-check"></i>
                      {translate(generalLanguageKeys.actions.approve)}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
        {visibleBuyerStore && (
          <StoreModal
            title={translate('indirectSalesOrders.select.store')}
            selectedList={listBuyerStore}
            setSelectedList={setListBuyerStore}
            list={listStore2}
            isOpen={visibleBuyerStore}
            toggle={handleCloseBuyerStore}
            onClose={handleCloseBuyerStore}
            getList={indirectSalesOrderRepository.listBuyerStore}
            count={indirectSalesOrderRepository.countBuyerStore}
            onSave={handleSavePopupBuyerStore}
            setResetFilter={setResetFilter}
            resetFilter={resetFilter}
            saleEmployeeId={indirectSalesOrder?.saleEmployeeId}
          />
        )}
        {visibleResellerStore && (
          <StoreModal
            title={translate('indirectSalesOrders.select.store')}
            selectedList={listResellerStore}
            setSelectedList={setListResellerStore}
            list={listStore2}
            isOpen={visibleResellerStore}
            toggle={handleCloseResellerStore}
            onClose={handleCloseResellerStore}
            getList={indirectSalesOrderRepository.listStore}
            count={indirectSalesOrderRepository.countStore}
            onSave={handleSavePopupResellerStore}
            setResetFilter={setResetFilter}
            resetFilter={resetFilter}
          />
        )}
      </Spin>
    </div>
  );
}

export default IndirectSalesOrderDetail;
