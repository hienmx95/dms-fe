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
import { priceListRepository } from '../PriceListRepository';
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

const { Item: FormItem } = Form;
const { TabPane } = Tabs;

export default function PriceListDetail() {
  const [translate] = useTranslation();
  const [user] = useGlobal<AppUser>('user');
  // Service goback
  const [handleGoBack] = routerService.useGoBack(SALEPRICE_ROUTE);
  const [
    priceList,
    setPriceList,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    PriceList,
    priceListRepository.get,
    priceListRepository.save,
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
    priceListRepository.singleListStatus,
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
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                    onClick={handleGoBack}
                  >
                    <i className="fa mr-2 fa-times-circle" />
                    {translate(generalLanguageKeys.actions.cancel)}
                  </button>
                  {/* {!isDetail && validAction('create') &&  */}
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                  {/* }{isDetail && validAction('update') &&  */}
                  {/* <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button> */}
                  {/* } */}
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
                      getList={priceListRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate('general.placeholder.title')}
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
                      getList={priceListRepository.singleListSalesOrderType}
                      modelFilter={salesOrderTypeFilter}
                      setModelFilter={setSalesOrderTypeFilter}
                      searchField={nameof(salesOrderTypeFilter.name)}
                      searchType={nameof(salesOrderTypeFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
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
                      onChange={handleChangeDate(nameof(priceList.endDate))}
                      format={STANDARD_DATE_FORMAT_INVERSE}
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
                  getMessages={priceListRepository.listPost}
                  classFilter={PostFilter}
                  postMessage={priceListRepository.createPost}
                  countMessages={priceListRepository.countPost}
                  deleteMessage={priceListRepository.deletePost}
                  attachFile={priceListRepository.saveFile}
                  suggestList={priceListRepository.singleListAppUser}
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
