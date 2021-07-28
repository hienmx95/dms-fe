import { Card, Spin, Tabs, DatePicker, Input } from 'antd';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService, routerService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PriceList, SalesOrderTypeFilter } from 'models/priceList/PriceList';
import { Status } from 'models/Status';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import PriceListStoreMappingTab from './PriceListMappingTabs/PriceListStoreMappingTab/PriceListStoreMappingTab';
import PriceListItemMappingTab from './PriceListMappingTabs/PriceListItemMappingTab/PriceListItemMappingTab';
import { formatInputDate } from 'core/helpers/date-time';
import { useCallback, useGlobal } from 'reactn';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { Moment } from 'moment';
import { SALEPRICE_ROUTE } from 'config/route-consts';
import ChatBox from 'components/ChatBox/ChatBox';
import { AppUser } from 'models/AppUser';
import { PostFilter } from 'models/PostFilter';
import { priceListOwnerRepository } from '../PriceListOwnerRepository';
import { API_PRICELIST_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

export default function PriceListOwnerDetail() {
  const [translate] = useTranslation();
  const [user] = useGlobal<AppUser>('user');
  // Service goback
  const [handleGoBack] = routerService.useGoBack(SALEPRICE_ROUTE);
  const { validAction } = crudService.useAction(
    'price-list',
    API_PRICELIST_ROUTE,
  );
  const [
    priceList,
    setPriceList,
    loading,
    ,
    isDetail,
    handleSave,
    handleSend,
    handleApprove,
    handleReject,
  ] = crudService.useDetail(
    PriceList,
    priceListOwnerRepository.get,
    priceListOwnerRepository.save,
    priceListOwnerRepository.send,
    priceListOwnerRepository.approve,
    priceListOwnerRepository.reject,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<PriceList>(priceList, setPriceList);

  const {
    organizationFilter,
    setOrganizationFilter,
    salesOrderTypeFilter,
    setSalesOrderTypeFilter,
  } = usePriceListFilter();

  const [statusList] = crudService.useEnumList<Status>(
    priceListOwnerRepository.singleListStatus,
  );

  const handleChangeDate = useCallback(
    (field: string) => {
      return (date: Moment) => {
        setPriceList({
          ...priceList,
          [field]: date,
        });
      };
    },
    [priceList, setPriceList],
  );

  const handleChangeEndDate = useCallback(
    (date: Moment) => {
      setPriceList({
        ...priceList,
        endDate: date.endOf('day'),
      });
    },
    [priceList, setPriceList],
  );

  return (
    <>
      <div className="page detail-page price-list-detail">
        <Spin spinning={loading}>
          <Card
            className={'short pb-3'}
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
                      ? translate('appUsers.detail.title')
                      : translate(generalLanguageKeys.actions.create)}
                  </div>
                  {
                    priceList?.requestStateId === 1 && (
                      <div className="new-state ml-4">
                        {translate(generalLanguageKeys.state.new)}
                      </div>
                    )}
                  {
                    priceList?.requestStateId === 2 && (
                      <div className="pending-state ml-4">
                        {translate(generalLanguageKeys.state.pending)}
                      </div>
                    )}
                  {
                    priceList?.requestStateId === 3 && (
                      <div className="approved-state ml-4">
                        {translate(generalLanguageKeys.state.approved)}
                      </div>
                    )}
                  {
                    priceList?.requestStateId === 4 && (
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
                  {
                    priceList?.requestStateId === 3 && isDetail && validAction('update') && (
                      <button
                        className="btn btn-sm btn-primary float-right"
                        onClick={handleSave}
                      >
                        <i className="fa mr-2 fa-save" />
                        {translate(generalLanguageKeys.actions.save)}
                      </button>
                    )
                  }
                  {(priceList.requestStateId === 1 ||
                    !priceList.requestStateId ||
                    priceList.requestStateId === 4) && (
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
                  {priceList.requestStateId === 2 && (
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
            <div className="title-detail">{translate('products.general')}</div>

            <Form>
              <Row>
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.code),
                    )}
                    help={priceList.errors?.code}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.code')}
                      <span className="text-danger">*</span>
                    </span>
                    <Input
                      type="text"
                      value={priceList.code}
                      className="form-control form-control-sm"
                      onChange={handleChangeSimpleField(nameof(priceList.code))}
                      placeholder={translate('priceLists.placeholder.code')}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={2} />
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.organization),
                    )}
                    help={priceList.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.organization')}
                      <span className="text-danger">*</span>
                    </span>
                    <TreeSelectDropdown
                      defaultValue={priceList.organization?.id}
                      value={priceList.organization?.id}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(priceList.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={priceListOwnerRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.name),
                    )}
                    help={priceList.errors?.name}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.name')}
                      <span className="text-danger">*</span>
                    </span>
                    <Input
                      type="text"
                      value={priceList.name}
                      className="form-control form-control-sm"
                      onChange={handleChangeSimpleField(nameof(priceList.name))}
                      placeholder={translate('priceLists.placeholder.name')}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={2} />
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.salesOrderType),
                    )}
                    help={priceList.errors?.salesOrderType}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.salesOrderType')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={priceList.salesOrderType?.id}
                      onChange={handleChangeObjectField(
                        nameof(priceList.salesOrderType),
                      )}
                      getList={priceListOwnerRepository.singleListSalesOrderType}
                      modelFilter={salesOrderTypeFilter}
                      setModelFilter={setSalesOrderTypeFilter}
                      searchField={nameof(salesOrderTypeFilter.name)}
                      searchType={nameof(salesOrderTypeFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.startDate),
                    )}
                    help={priceList.errors?.startDate}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.startDate')}
                    </span>
                    <DatePicker
                      value={formatInputDate(priceList.startDate)}
                      className={'w-100 advanced-date-filter'}
                      placeholder={translate('priceLists.startDate')}
                      onChange={handleChangeDate(nameof(priceList.startDate))}
                      format={STANDARD_DATE_FORMAT_INVERSE}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
                <Col lg={2} />
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.endDate),
                    )}
                    help={priceList.errors?.endDate}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.endDate')}
                    </span>
                    <DatePicker
                      value={formatInputDate(priceList.endDate)}
                      className={'w-100 advanced-date-filter'}
                      placeholder={translate('priceLists.endDate')}
                      onChange={handleChangeEndDate}
                      format={STANDARD_DATE_FORMAT_INVERSE}
                      disabled={
                        priceList.requestStateId === 2 ||
                        priceList.requestStateId === 3
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<PriceList>(
                      priceList.errors,
                      nameof(priceList.status),
                    )}
                    help={priceList.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('priceLists.status')}
                    </span>
                    <Switch
                      checked={
                        priceList.statusId === statusList[1]?.id ? true : false
                      }
                      list={statusList}
                      onChange={handleChangeObjectField(
                        nameof(priceList.status),
                      )}
                      disabled={
                        priceList.requestStateId === 2
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          {/* Mapping tab */}
          <Card className="mt-3">
            <Tabs defaultActiveKey="1" className="mr-3 tab">
              {/* StoreMappings tab */}
              <TabPane
                key="storeMappings"
                tab={translate('priceLists.tabs.storeMappings.title')}
              >
                <PriceListStoreMappingTab
                  model={priceList}
                  setModel={setPriceList}
                />
              </TabPane>
              {/* ItemMappings tab */}
              <TabPane
                key="itemMappings"
                tab={translate('priceLists.tabs.itemMappings.title')}
              >
                <PriceListItemMappingTab
                  model={priceList}
                  setModel={setPriceList}
                  isDetail={isDetail}
                />
              </TabPane>
            </Tabs>
          </Card>
          {
            isDetail && (
              <div className="sale-order-chat-box mt-3">
                <ChatBox
                  userInfo={user as AppUser || AppUser}
                  discussionId={priceList.rowId}
                  getMessages={priceListOwnerRepository.listPost}
                  classFilter={PostFilter}
                  postMessage={priceListOwnerRepository.createPost}
                  countMessages={priceListOwnerRepository.countPost}
                  deleteMessage={priceListOwnerRepository.deletePost}
                  attachFile={priceListOwnerRepository.saveFile}
                  suggestList={priceListOwnerRepository.singleListAppUser}
                />
              </div>

            )
          }
        </Spin>
      </div>
    </>
  );
}

function usePriceListFilter() {
  const [organizationFilter, setOrganizationFilter] = useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [salesOrderTypeFilter, setSalesOrderTypeFilter] = useState<
    SalesOrderTypeFilter
  >(new SalesOrderTypeFilter());

  return {
    organizationFilter,
    setOrganizationFilter,
    salesOrderTypeFilter,
    setSalesOrderTypeFilter,
  };
}
