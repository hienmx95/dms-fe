import { Input, Col, DatePicker, Row, Tabs } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { SHOWING_ORDER_ROUTE } from 'config/route-consts';
import {
  DEFAULT_DATETIME_VALUE,
  STANDARD_DATE_FORMAT_INVERSE,
} from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingOrder } from 'models/posm/ShowingOrder';
// import { Status } from 'models/Status';
// import { Store } from 'models/Store';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { showingOrderRepository } from '../ShowingOrderRepository';
import ShowingOrderContentTable from './ShowingOrderContentTable/ShowingOrderContentTable';
import ShowingListStoreTable from './ShowingListStoreTable/ShowingListStoreTable';
import './ShowingOrderDetail.scss';
import { formatNumber } from 'helpers/number-format';

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

function ShowingOrderDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'showing-order',
    API_SHOWING_ORDER_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(SHOWING_ORDER_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    showingOrder,
    setShowingOrder,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    ShowingOrder,
    showingOrderRepository.get,
    showingOrderRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<ShowingOrder>(
    showingOrder,
    setShowingOrder,
  );

  // const [listStore, setListStore] = React.useState<Store[]>([]);

  // const [currentOrg, setCurrentOrg] = React.useState<any>(null);

  const [calculateTotal, setCalculateTotal] = React.useState<boolean>(true);

  // const [statusList] = crudService.useEnumList<Status>(
  //   showingOrderRepository.singleListStatus,
  // );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const handleKeyPress = React.useCallback(event => {
    if (event?.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  }, []);

  React.useEffect(() => {
    if (calculateTotal) {
      let total = 0;
      if (
        showingOrder?.showingOrderContents &&
        showingOrder?.showingOrderContents.length >= 0
      ) {
        showingOrder?.showingOrderContents.forEach(content => {
          total += content.amount ? content.amount : 0;
        });
        setShowingOrder({
          ...showingOrder,
          total,
        });
      }
      setCalculateTotal(false);
    }
  }, [calculateTotal, setShowingOrder, showingOrder]);

  // const handleChangeOrganization = React.useCallback(
  //   (organizationId: number, organization: Organization) => {
  //     setCurrentOrg(organization);
  //     const errors = showingOrder.errors;
  //     if (typeof errors !== 'undefined' && errors !== null) {
  //       errors.organization = null;
  //     }
  //     filterStore.organizationId.equal = organizationId;
  //     setFilterStore({ ...filterStore });
  //     setShowingOrder({
  //       ...showingOrder,
  //       organizationId,
  //       organization,
  //       errors,
  //     });
  //     setListStore([]);
  //   },
  //   [filterStore, setFilterStore, setShowingOrder, showingOrder],
  // );

  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
          className="short"
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('general.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {isDetail && validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
                {!isDetail && validAction('create') && (
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <div className="title-detail">
                {translate('showingOrders.general.info')}
              </div>
              <Col lg={12}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingOrder>(
                    showingOrder.errors,
                    nameof(showingOrder.organization),
                  )}
                  help={showingOrder.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('stores.organization')}
                    <span className="text-danger"> *</span>
                  </span>
                  <TreeSelectDropdown
                    defaultValue={
                      showingOrder.organization
                        ? translate('kpiGenerals.placeholder.organization')
                        : showingOrder.organizationId
                    }
                    value={
                      showingOrder.organizationId === 0
                        ? null
                        : showingOrder.organizationId
                    }
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(showingOrder.organization),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={showingOrderRepository.singleListOrganization}
                    searchField={nameof(organizationFilter.id)}
                    placeholder={translate(
                      'kpiGenerals.placeholder.organization',
                    )}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingOrder>(
                    showingOrder.errors,
                    'description',
                  )}
                  help={
                    showingOrder.description === null ||
                    showingOrder.description === ''
                      ? showingOrder.errors?.description
                      : ''
                  }
                >
                  <span className="label-input ml-3">
                    {translate('surveys.description')}
                  </span>
                  <Input
                    value={showingOrder.description}
                    onChange={handleChangeSimpleField(
                      nameof(showingOrder.description),
                    )}
                    placeholder={translate('surveys.placeholder.description')}
                    className="form-control form-control-sm"
                    onPressEnter={handleKeyPress}
                  />
                </FormItem>

                {/* {validAction('singleListStatus') && (
                  <FormItem className="mb-3">
                    <span className="label-input ml-3 mr-3">
                      {translate('showingOrders.status')}
                    </span>
                    <Switch
                      checked={showingOrder.statusId === 1 ? true : false}
                      list={statusList}
                      onChange={handleChangeObjectField(
                        nameof(showingOrder.status),
                      )}
                    />
                  </FormItem>
                )} */}
              </Col>

              <Col lg={12}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingOrder>(
                    showingOrder.errors,
                    nameof(showingOrder.date),
                  )}
                  help={showingOrder.errors?.date}
                >
                  <span className="label-input ml-3">
                    {translate('showingOrders.date')}
                    <span className="text-danger"> *</span>
                  </span>
                  <DatePicker
                    value={
                      showingOrder.date &&
                      (showingOrder.date.toString().substring(0, 19) ===
                      DEFAULT_DATETIME_VALUE
                        ? undefined
                        : formatInputDate(showingOrder.date))
                    }
                    className={'w-100 advanced-date-filter'}
                    placeholder={translate('showingOrders.date')}
                    onChange={handleUpdateDateField(nameof(showingOrder.date))}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="mt-3">
          <Tabs>
            {!isDetail && (
              <TabPane key="store" tab={translate('showingOrders.listStore')}>
                {/* Mở modal chọn user */}
                <ShowingListStoreTable
                  isDetail={isDetail}
                  model={showingOrder}
                  setModel={setShowingOrder}
                  field={nameof(showingOrder.stores)}
                />
              </TabPane>
            )}

            <TabPane key="order" tab={translate('showingOrderContents.title')}>
              <ShowingOrderContentTable
                model={showingOrder}
                setModel={setShowingOrder}
                field={nameof(showingOrder.showingOrderContents)}
                setCalculateTotal={setCalculateTotal}
                isDetail={isDetail}
              />

              <div
                className="d-flex justify-content-end"
                style={{
                  alignItems: 'baseline',
                  marginTop: 10,
                  marginRight: 30,
                }}
              >
                <span
                  className="title"
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    fontWeight: 500,
                  }}
                >
                  {translate('showingOrders.total')}
                </span>{' '}
                <span
                  style={{ fontSize: 20, color: '#a32f4a', fontWeight: 500 }}
                >
                  {formatNumber(showingOrder?.total)}
                </span>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    </div>
  );
}

export default ShowingOrderDetail;
