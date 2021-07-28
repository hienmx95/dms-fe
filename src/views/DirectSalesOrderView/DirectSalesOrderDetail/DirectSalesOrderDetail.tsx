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
import { API_DIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { DIRECT_SALES_ORDER_ROUTE } from 'config/route-consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { debounce } from 'core/helpers/debounce';
import { limitWord } from 'core/helpers/string';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderContent } from 'models/Direct/DirectSalesOrderContent';
import { EditPriceStatus } from 'models/EditPriceStatus';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { directSalesOrderRepository } from '../DirectSalesOrderRepository';
import DirectSalesOrderContentTable from './DirectSalesOrderContentTable/DirectSalesOrderContentTable';
import './DirectSalesOrderDetail.scss';
import DirectSalesOrderPromotionTable from './DirectSalesOrderPromotionTable/DirectSalesOrderPromotionTable';
import StoreModal from './StoreModal/StoreModal';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function DirectSalesOrderDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'direct-sales-order',
    API_DIRECT_SALES_ORDER_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(DIRECT_SALES_ORDER_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const time = moment();
  const [
    directSalesOrder,
    setDirectSalesOrder,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    DirectSalesOrder,
    directSalesOrderRepository.get,
    directSalesOrderRepository.save,
  );

  const [
    handleChangeSimpleField,
    ,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<DirectSalesOrder>(
    directSalesOrder,
    setDirectSalesOrder,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [editPriceStatusList] = crudService.useEnumList<EditPriceStatus>(
    directSalesOrderRepository.singleListEditPriceStatus,
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [, , , listStore2] = crudService.useContentModal(
    directSalesOrderRepository.listStore,
    directSalesOrderRepository.countStore,
    StoreFilter,
  );

  const [listBuyerStore, setListBuyerStore] = React.useState<Store[]>([]);
  const [visibleBuyerStore, setVisibleBuyerStore] = React.useState<boolean>(
    false,
  );

  const [calculateTotal, setCalculateTotal] = React.useState<boolean>(true);
  const [changeEditPrice, setChangeEditPrice] = React.useState<boolean>(false);
  const [resetFilter, setResetFilter] = React.useState<boolean>(false);
  const [currentStore, setCurrentStore] = React.useState<Store>(new Store());

  React.useEffect(() => {
    if (calculateTotal) {
      let newSubTotal = 0;
      let generalDiscountAmount =
        directSalesOrder.generalDiscountAmount !== undefined
          ? directSalesOrder.generalDiscountAmount
          : 0;
      let generalVAT = 0;
      if (
        directSalesOrder.directSalesOrderContents &&
        directSalesOrder.directSalesOrderContents.length >= 0
      ) {
        directSalesOrder.directSalesOrderContents.forEach(
          (directSalesOrderContent: DirectSalesOrderContent) => {
            newSubTotal += directSalesOrderContent.amount;
          },
        );
        directSalesOrder.directSalesOrderContents.forEach(
          (directSalesOrderContent: DirectSalesOrderContent) => {
            /*
             * vat = SUM ([amount - (Chiet khau tong don X amount)/subtotal]x % VAt từng dòng)
             [(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent]
             SUM{[(Amount - SaleOrder_Discount*Amount/SubTotal)* VAT_Tax_Percent] [(1-n)]}
            */

            generalVAT +=
              (directSalesOrderContent.amount -
                (newSubTotal !== 0
                  ? (directSalesOrder.generalDiscountAmount *
                    directSalesOrderContent.amount) /
                  newSubTotal
                  : 0)) *
              (directSalesOrderContent.taxPercentage / 100);
          },
        );
        if (newSubTotal && directSalesOrder.generalDiscountPercentage) {
          generalDiscountAmount =
            (newSubTotal * directSalesOrder.generalDiscountPercentage) / 100;
        }

        let newTotal = newSubTotal - generalDiscountAmount + generalVAT;
        if (directSalesOrder.generalDiscountPercentage === 100) {
          generalVAT = 0;
          newTotal = 0;
        }

        setDirectSalesOrder({
          ...directSalesOrder,
          subTotal: newSubTotal,
          totalTaxAmount: Math.floor(generalVAT),
          total: Math.round(newTotal),
          generalDiscountAmount,
        });
      }

      setCalculateTotal(false);
    }
  }, [calculateTotal, directSalesOrder, setDirectSalesOrder]);

  React.useEffect(() => {
    if (
      directSalesOrder &&
      (!directSalesOrder.requestStateId ||
        directSalesOrder.requestStateId === null)
    ) {
      setDirectSalesOrder({
        ...directSalesOrder,
        requestStateId: 1,
      });
    }
  }, [setDirectSalesOrder, directSalesOrder]);

  const handleOpenBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(true);
    setResetFilter(true);
  }, [setVisibleBuyerStore]);

  const handleCloseBuyerStore = React.useCallback(() => {
    setVisibleBuyerStore(false);
    setListBuyerStore([currentStore]);
  }, [currentStore, setVisibleBuyerStore, setListBuyerStore]);

  const handleSavePopupBuyerStore = React.useCallback(
    event => {
      setVisibleBuyerStore(false);
      const errors = directSalesOrder.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.buyerStore = null;
      }

      setDirectSalesOrder({
        ...directSalesOrder,
        buyerStoreId: event[0].id,
        buyerStore: event[0],
        deliveryAddress: event[0].deliveryAddress,
        phoneNumber: event[0].telephone,
        sellerStoreId: event[0].parentStoreId,
        sellerStore: event[0].parentStore,
        errors,
      });
      setCurrentStore(event[0]);
      setListBuyerStore(event);
    },
    [
      setVisibleBuyerStore,
      setListBuyerStore,
      setDirectSalesOrder,
      directSalesOrder,
      setCurrentStore,
    ],
  );

  const handleChangeSaleEmployee = React.useCallback(
    (saleEmployeeId: any, saleEmployee) => {
      storeFilter.saleEmployeeId.equal = saleEmployeeId;
      setStoreFilter({ ...storeFilter });
      setDirectSalesOrder({
        ...directSalesOrder,
        saleEmployeeId,
        saleEmployee,
      });
    },
    [directSalesOrder, setDirectSalesOrder, storeFilter],
  );

  const handleChangeGeneralDiscountPercentage = React.useCallback(
    debounce(event => {
      let percent = event ? event : 0;
      if (percent > 100) {
        percent = 100;
      }
      let discountAmount = Math.floor(
        (percent / 100) * directSalesOrder?.subTotal,
      );

      if (percent === 0) {
        discountAmount = 0;
      }
      setDirectSalesOrder({
        ...directSalesOrder,
        generalDiscountAmount:
          typeof event !== 'undefined'
            ? discountAmount
            : directSalesOrder?.generalDiscountAmount,
        generalDiscountPercentage: percent,
      });
      setCalculateTotal(true);
    }),
    [directSalesOrder, setDirectSalesOrder],
  );

  const handleChangeGeneralDiscountAmount = React.useCallback(
    debounce(event => {
      setDirectSalesOrder({
        ...directSalesOrder,
        generalDiscountAmount: event === undefined ? 0 : event,
        generalDiscountPercentage: undefined,
      });
      setCalculateTotal(true);
    }),
    [directSalesOrder, setDirectSalesOrder],
  );

  const handleChangeChangeEditPrice = React.useCallback(
    (editedPriceStatusId, editedPriceStatus) => {
      if (editedPriceStatusId === 0) {
        setChangeEditPrice(true);
        if (
          directSalesOrder.directSalesOrderContents &&
          directSalesOrder.directSalesOrderContents.length > 0
        ) {
          directSalesOrder.directSalesOrderContents.forEach(
            (directSalesOrderContent: DirectSalesOrderContent) => {
              directSalesOrderContent.errors = null;
            },
          );
        }
      } else {
        setChangeEditPrice(false);
      }
      setDirectSalesOrder({
        ...directSalesOrder,
        editedPriceStatusId,
        editedPriceStatus,
      });
    },
    [directSalesOrder, setDirectSalesOrder],
  );

  React.useEffect(() => {
    if (
      !directSalesOrder.orderDate ||
      directSalesOrder.orderDate === null ||
      directSalesOrder.orderDate === undefined
    ) {
      setDirectSalesOrder({
        ...directSalesOrder,
        orderDate: time,
      });
    }
  }, [directSalesOrder, setDirectSalesOrder, time]);

  return (
    <div className="page detail-page detail-page-direct-order">
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
                    ? translate('directSalesOrders.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
                {directSalesOrder.requestStateId &&
                  directSalesOrder.requestStateId === 1 && (
                    <div className="new-state ml-4">
                      {translate(generalLanguageKeys.state.new)}
                    </div>
                  )}
                {directSalesOrder.requestStateId &&
                  directSalesOrder.requestStateId === 2 && (
                    <div className="pending-state ml-4">
                      {translate(generalLanguageKeys.state.pending)}
                    </div>
                  )}
                {directSalesOrder.requestStateId &&
                  directSalesOrder.requestStateId === 3 && (
                    <div className="approved-state ml-4">
                      {translate(generalLanguageKeys.state.approved)}
                    </div>
                  )}
                {directSalesOrder.requestStateId &&
                  directSalesOrder.requestStateId === 4 && (
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
                {(directSalesOrder.requestStateId === 1 ||
                  !directSalesOrder.requestStateId ||
                  directSalesOrder.requestStateId === 4) && (
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
                    </>
                  )}
                {directSalesOrder.requestStateId === 2 && (
                  <>
                    <button
                      className="btn btn-sm btn-reject float-right ml-2"
                    // onClick={handleGoBack}
                    >
                      <i className="fa mr-2 fa-ban"></i>
                      {translate(generalLanguageKeys.actions.reject)}
                    </button>
                    <button
                      className="btn btn-sm btn-approve float-right ml-2"
                    // onClick={handleGoBack}
                    >
                      <i className="fa mr-2 fa-check"></i>
                      {translate(generalLanguageKeys.actions.approve)}
                    </button>
                  </>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <div className="title-detail">
              <span className="title-default">
                {translate('directSalesOrders.general.title')}
              </span>
            </div>
            <Row>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(directSalesOrder.errors, nameof(directSalesOrder.code))}
                  help={directSalesOrder.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.code')}
                  </span>
                  <input
                    type="text"
                    defaultValue={directSalesOrder.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.code),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.code',
                    )}
                    disabled
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.storeAddress),
                  )}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.storeAddress')}
                  </span>
                  <input
                    type="text"
                    defaultValue={limitWord(
                      directSalesOrder?.buyerStore?.address,
                      40,
                    )}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.buyerStore.address),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.storeAddress',
                    )}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.phoneNumber),
                  )}
                  help={directSalesOrder.errors?.phoneNumber}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.phoneNumber')}
                  </span>
                  <input
                    type="text"
                    defaultValue={directSalesOrder.phoneNumber}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.phoneNumber),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.phoneNumber',
                    )}
                    disabled={
                      directSalesOrder.requestStateId === 2 ||
                      directSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.editedPriceStatus),
                  )}
                  help={directSalesOrder.errors?.editedPriceStatus}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.isEditedPrice')}
                  </span>
                  <Switch
                    checked={
                      // typeof directSalesOrder.status?.id === 'number' &&
                      directSalesOrder.editedPriceStatusId ===
                      editPriceStatusList[1]?.id
                    }
                    list={editPriceStatusList}
                    onChange={handleChangeChangeEditPrice}
                  />
                </FormItem>
              </Col>

              <Col lg={8}>
                {validAction('singleListAppUser') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.saleEmployee),
                    )}
                    help={directSalesOrder.errors?.saleEmployee}
                  >
                    <span className="label-input ml-3">
                      {translate('directSalesOrders.saleEmployee')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={directSalesOrder.saleEmployee?.id}
                      onChange={handleChangeSaleEmployee}
                      getList={directSalesOrderRepository.singleListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      placeholder={translate(
                        'directSalesOrders.placeholder.saleEmployee',
                      )}
                      disabled={
                        directSalesOrder.requestStateId === 2 ||
                        directSalesOrder.requestStateId === 3
                      }
                    />
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.deliveryAddress),
                  )}
                  help={directSalesOrder.errors?.deliveryAddress}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.deliveryAddress')}
                  </span>
                  <input
                    type="text"
                    defaultValue={directSalesOrder.deliveryAddress}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.deliveryAddress),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.deliveryAddress',
                    )}
                    disabled={
                      directSalesOrder.requestStateId === 2 ||
                      directSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.orderDate),
                  )}
                  help={directSalesOrder.errors?.orderDate}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.orderDate')}
                    <span className="text-danger">*</span>
                  </span>
                  <DatePicker
                    value={
                      typeof directSalesOrder.orderDate === 'object'
                        ? directSalesOrder.orderDate
                        : time
                    }
                    onChange={handleUpdateDateField(
                      nameof(directSalesOrder.orderDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'directSalesOrders.placeholder.orderDate',
                    )}
                    disabled={
                      directSalesOrder.requestStateId === 2 ||
                      directSalesOrder.requestStateId === 3
                    }
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(directSalesOrder.errors, nameof(directSalesOrder.note))}
                  help={directSalesOrder.errors?.note}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.note')}
                  </span>
                  <input
                    type="text"
                    defaultValue={directSalesOrder.note}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.note),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.note',
                    )}
                    disabled={
                      directSalesOrder.requestStateId === 2 ||
                      directSalesOrder.requestStateId === 3
                    }
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                {validAction('listStore') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.buyerStore),
                    )}
                    help={directSalesOrder.errors?.buyerStore}
                  >
                    <span className="label-input ml-3">
                      {translate('directSalesOrders.buyerStore')}
                      <span className="text-danger">*</span>
                    </span>
                    <div className="input-store ant-form-item">
                      <span onClick={handleOpenBuyerStore}>
                        <Tooltip
                          placement="topLeft"
                          title={directSalesOrder?.buyerStore?.name}
                        >
                          {window.innerWidth >= 1920 &&
                            directSalesOrder.buyerStore?.name &&
                            limitWord(directSalesOrder.buyerStore?.name, 30)}
                          {window.innerWidth < 1920 &&
                            directSalesOrder.buyerStore?.name &&
                            limitWord(directSalesOrder.buyerStore?.name, 20)}
                        </Tooltip>

                        {!directSalesOrder.buyerStore?.name && (
                          <span className="placeholder">
                            {translate(
                              'directSalesOrders.placeholder.buyerStore',
                            )}
                          </span>
                        )}
                        <i className="fa fa-list-alt" aria-hidden="true" />
                      </span>
                    </div>
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.buyerStore.taxCode),
                  )}
                  help={directSalesOrder.errors?.taxCode}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.taxCode')}
                  </span>
                  <input
                    type="text"
                    defaultValue={directSalesOrder?.buyerStore?.taxCode}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(directSalesOrder.buyerStore.taxCode),
                    )}
                    placeholder={translate(
                      'directSalesOrders.placeholder.taxCode',
                    )}
                    disabled
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    DirectSalesOrder
                  >(
                    directSalesOrder.errors,
                    nameof(directSalesOrder.deliveryDate),
                  )}
                  help={directSalesOrder.errors?.deliveryDate}
                >
                  <span className="label-input ml-3">
                    {translate('directSalesOrders.deliveryDate')}
                  </span>
                  <DatePicker
                    value={formatInputDate(directSalesOrder.deliveryDate)}
                    onChange={handleUpdateDateField(
                      nameof(directSalesOrder.deliveryDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'directSalesOrders.placeholder.deliveryDate',
                    )}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <Tabs defaultActiveKey="1" className="mr-3 tab">
            <TabPane
              key="directSalesOrderContents"
              tab={translate(
                'directSalesOrders.tabs.directSalesOrderContents.title',
              )}
            >
              <DirectSalesOrderContentTable
                model={directSalesOrder}
                setModel={setDirectSalesOrder}
                field={nameof(directSalesOrder.directSalesOrderContents)}
                onChange={handleChangeSimpleField(
                  nameof(directSalesOrder.directSalesOrderContents),
                )}
                setCalculateTotal={setCalculateTotal}
                changeEditPrice={changeEditPrice}
                setChangeEditPrice={setChangeEditPrice}
                currentStore={currentStore}
              />
            </TabPane>

            <TabPane
              key="directSalesOrderPromotions"
              tab={translate(
                'directSalesOrders.tabs.directSalesOrderPromotions.title',
              )}
            >
              <DirectSalesOrderPromotionTable
                model={directSalesOrder}
                setModel={setDirectSalesOrder}
                field={nameof(directSalesOrder.directSalesOrderPromotions)}
                onChange={handleChangeSimpleField(
                  nameof(directSalesOrder.directSalesOrderPromotions),
                )}
                currentStore={currentStore}
              />
            </TabPane>
          </Tabs>
          <div className="info-title ml-3 mb-3 mt-3">
            <span className="title-default">
              {translate('directSalesOrders.payment.title')}
            </span>
          </div>
          <div className="payment">
            <Row>
              <Col lg={16}></Col>
              <Col lg={8}>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.subTotal),
                    )}
                    help={directSalesOrder.errors?.subTotal}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('directSalesOrders.subTotal')}
                    </span>
                    <InputNumber
                      value={directSalesOrder.subTotal}
                      className="form-control form-control-sm sub-total"
                      disabled
                      minimumDecimalCount={3}
                      maximumDecimalCount={3}
                    />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.generalDiscountPercentage),
                    )}
                    help={directSalesOrder.errors?.generalDiscountPercentage}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('directSalesOrders.generalDiscountPercentage')}
                    </span>
                    <InputNumber
                      type="text"
                      value={directSalesOrder.generalDiscountPercentage}
                      className="form-control form-control-sm input-discount"
                      onChange={handleChangeGeneralDiscountPercentage}
                      disabled={
                        directSalesOrder.requestStateId === 2 ||
                        directSalesOrder.requestStateId === 3
                        // || directSalesOrder.generalDiscountPercentage === undefined
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
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.generalDiscountAmount),
                    )}
                    help={directSalesOrder.errors?.generalDiscountAmount}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate(
                        'directSalesOrders.newGeneralDiscountPercentage',
                      )}
                    </span>
                    <InputNumber
                      value={directSalesOrder?.generalDiscountAmount}
                      className="form-control form-control-sm input-discount-amount"
                      onChange={handleChangeGeneralDiscountAmount}
                      disabled={
                        directSalesOrder.requestStateId === 2 ||
                        directSalesOrder.requestStateId === 3
                        // || directSalesOrder.generalDiscountPercentage !== undefined
                      }
                      allowNegative={false}
                      min={0}
                      max={directSalesOrder?.subTotal}
                    />
                  </FormItem>
                </Row>
                <Row>
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(
                      directSalesOrder.errors,
                      nameof(directSalesOrder.totalTaxAmount),
                    )}
                    help={directSalesOrder.errors?.totalTaxAmount}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('directSalesOrders.totalTaxAmount')}
                    </span>
                    <InputNumber
                      value={directSalesOrder.totalTaxAmount || 0}
                      className="form-control form-control-sm"
                      disabled
                      min={0}
                    />
                  </FormItem>

                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      DirectSalesOrder
                    >(directSalesOrder.errors, nameof(directSalesOrder.total))}
                    help={directSalesOrder.errors?.total}
                  >
                    <span className="label-input title-label ml-3 mr-3">
                      {translate('directSalesOrders.newTotal')}
                    </span>
                    <InputNumber
                      value={directSalesOrder.total || 0}
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
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary ml-2 mr-2"
              onClick={handleGoBack}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </Card>
        {
          visibleBuyerStore &&
          <StoreModal
            title={translate('directSalesOrders.select.store')}
            selectedList={listBuyerStore}
            setSelectedList={setListBuyerStore}
            list={listStore2}
            isOpen={visibleBuyerStore}
            toggle={handleCloseBuyerStore}
            onClose={handleCloseBuyerStore}
            getList={directSalesOrderRepository.listBuyerStore}
            count={directSalesOrderRepository.countBuyerStore}
            onSave={handleSavePopupBuyerStore}
            setResetFilter={setResetFilter}
            resetFilter={resetFilter}
            saleEmployeeId={directSalesOrder?.saleEmployeeId}
          />
        }

      </Spin>
    </div>
  );
}

export default DirectSalesOrderDetail;
