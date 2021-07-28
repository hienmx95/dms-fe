import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import ChatBox from 'components/ChatBox/ChatBox';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { E_ROUTE_OWNER_ROUTE } from 'config/route-consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERoute } from 'models/ERoute';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import { PostFilter } from 'models/PostFilter';
import { Status } from 'models/Status';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import { eRouteOwnerRepository } from '../ERouteOwnerRepository';
import ERouteContentTable from './ERouteContentTable/ERouteContentTable';
import './ERouteOwnerDetail.scss';
const { Item: FormItem } = Form;

function ERouteOwnerDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('e-route', API_E_ROUTE_ROUTE);

  // Service goback
  const [handleGoBack] = routerService.useGoBack(E_ROUTE_OWNER_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    eRoute,
    setERoute,
    loading,
    ,
    isDetail,
    handleSave,
    handleSend,
    handleApprove,
    handleReject,
  ] = crudService.useDetail(
    ERoute,
    eRouteOwnerRepository.get,
    eRouteOwnerRepository.save,
    eRouteOwnerRepository.send,
    eRouteOwnerRepository.approve,
    eRouteOwnerRepository.reject,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<ERoute>(eRoute, setERoute);

  const [statusList] = crudService.useEnumList<Status>(
    eRouteOwnerRepository.singleListStatus,
  );

  const [eRouteTypeList] = crudService.useEnumList<ERouteType>(
    eRouteOwnerRepository.singleListErouteType,
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());

  const [user] = useGlobal<AppUser>('user');
  const time = moment();

  React.useEffect(() => {
    if (
      !eRoute.startDate ||
      eRoute.startDate === null ||
      eRoute.startDate === undefined
    ) {
      setERoute({
        ...eRoute,
        startDate: time,
      });
    }
  }, [eRoute, setERoute, time]);

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
                {eRoute?.requestStateId === 1 && (
                  <span className="new-state ml-4">
                    {translate(generalLanguageKeys.state.new)}
                  </span>
                )}
                {eRoute?.requestStateId === 2 && (
                  <span className="pending-state ml-4">
                    {translate(generalLanguageKeys.state.pending)}
                  </span>
                )}
                {eRoute?.requestStateId === 3 && (
                  <span className="approved-state ml-4">
                    {translate(generalLanguageKeys.state.approved)}
                  </span>
                )}
                {eRoute?.requestStateId === 4 && (
                  <span className="rejected-state ml-4">
                    {translate(generalLanguageKeys.state.rejected)}
                  </span>
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
                  eRoute?.requestStateId === 3 && isDetail && validAction('update') && (
                    <button
                      className="btn btn-sm btn-primary float-right"
                      onClick={handleSave}
                    >
                      <i className="fa mr-2 fa-save" />
                      {translate(generalLanguageKeys.actions.save)}
                    </button>
                  )
                }
                {(eRoute.requestStateId === 1 ||
                  !eRoute.requestStateId ||
                  eRoute.requestStateId === 4) && (
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
                {eRoute.requestStateId === 2 && (
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
          <div className="title-detail pt-2">
            {translate('eRoutes.detail.title')}
          </div>
          <Form>
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.code),
                  )}
                  help={eRoute.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={eRoute.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.code))}
                    placeholder={translate('eRoutes.placeholder.code')}
                    disabled={
                      eRoute.requestStateId === 2 ||
                      eRoute.requestStateId === 3
                    }
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.saleEmployee),
                  )}
                  help={eRoute.errors?.saleEmployee}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.saleEmployee')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={eRoute.saleEmployee?.id}
                    onChange={handleChangeObjectField(
                      nameof(eRoute.saleEmployee),
                    )}
                    getList={eRouteOwnerRepository.singleListAppUser}
                    modelFilter={appUserFilter}
                    setModelFilter={setAppUserFilter}
                    searchField={nameof(appUserFilter.displayName)}
                    searchType={nameof(appUserFilter.displayName.contain)}
                    placeholder={translate('eRoutes.placeholder.saleEmployee')}
                    disabled={
                      eRoute.requestStateId === 2 ||
                      eRoute.requestStateId === 3
                    }
                  />
                </FormItem>
                {eRoute.errors?.organization !== undefined && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<ERoute>(
                      eRoute.errors,
                      nameof(eRoute.organization),
                    )}
                    help={eRoute.errors?.organization}
                  ></FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.startDate),
                  )}
                  help={eRoute.errors?.startDate}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.startDate')}
                    <span className="text-danger">*</span>
                  </span>
                  <DatePicker
                    value={formatInputDate(eRoute.startDate)}
                    onChange={handleUpdateDateField(nameof(eRoute.startDate))}
                    className="w-100"
                    placeholder={translate('eRoutes.placeholder.startDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                    disabled={
                      eRoute.requestStateId === 2 ||
                      eRoute.requestStateId === 3
                    }
                  />
                </FormItem>
                {validAction('singleListStatus') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<ERoute>(
                      eRoute.errors,
                      nameof(eRoute.status),
                    )}
                    help={eRoute.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('eRoutes.status')}
                    </span>
                    <Switch
                      checked={
                        eRoute.statusId === statusList[1]?.id ? true : false
                      }
                      list={statusList}
                      onChange={handleChangeObjectField(nameof(eRoute.status))}
                      disabled={
                        eRoute.requestStateId === 2
                      }
                    />
                  </FormItem>
                )}
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.name),
                  )}
                  help={eRoute.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={eRoute.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.name))}
                    placeholder={translate('eRoutes.placeholder.name')}
                    disabled={
                      eRoute.requestStateId === 2 ||
                      eRoute.requestStateId === 3
                    }
                  />
                </FormItem>
                {validAction('singleListErouteType') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<ERoute>(
                      eRoute.errors,
                      nameof(eRoute.eRouteType),
                    )}
                    help={eRoute.errors?.eRouteType}
                  >
                    <span className="label-input ml-3">
                      {translate('eRoutes.eRouteType')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={eRoute.eRouteType?.id}
                      onChange={handleChangeObjectField(
                        nameof(eRoute.eRouteType),
                      )}
                      getList={eRouteOwnerRepository.singleListErouteType}
                      list={eRouteTypeList}
                      modelFilter={eRouteTypeFilter}
                      setModelFilter={setERouteTypeFilter}
                      searchField={nameof(eRouteTypeFilter.id)}
                      searchType={nameof(eRouteTypeFilter.name.contain)}
                      placeholder={translate('eRoutes.placeholder.eRouteType')}
                      disabled={
                        eRoute.requestStateId === 2 ||
                        eRoute.requestStateId === 3
                      }
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.endDate),
                  )}
                  help={eRoute.errors?.endDate}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.endDate')}
                    {eRoute?.eRouteType?.id === 2 && (
                      <span className="text-danger">*</span>
                    )}
                  </span>
                  <DatePicker
                    value={formatInputDate(eRoute.endDate)}
                    onChange={handleUpdateDateField(nameof(eRoute.endDate))}
                    className="w-100"
                    placeholder={translate('eRoutes.placeholder.endDate')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                    disabled={
                      eRoute.requestStateId === 2 ||
                      eRoute.requestStateId === 3
                    }
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ERoute>(
                    eRoute.errors,
                    nameof(eRoute.creator),
                  )}
                  help={eRoute.errors?.creator}
                >
                  <span className="label-input ml-3">
                    {translate('eRoutes.creator')}
                  </span>
                  <Input
                    type="text"
                    value={user?.displayName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(eRoute.creator))}
                    disabled={true}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <div className="title-detail pt-2 mb-2">
            {translate('eRoutes.title.store')}
          </div>
          <ERouteContentTable
            eRoute={eRoute}
            setERoute={setERoute}
            isDetail={isDetail}
          />

          <div className="mt-1">
            <button
              className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
              onClick={handleGoBack}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
            {
              eRoute.requestStateId === 3 && isDetail && validAction('update') && (
                <button
                  className="btn btn-sm btn-primary float-right"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )
            }
            {(eRoute.requestStateId === 1 ||
              !eRoute.requestStateId ||
              eRoute.requestStateId === 4) && (
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
            {eRoute.requestStateId === 2 && (
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
        </Card>
        {
          isDetail && (
            <div className="sale-order-chat-box mt-3">
              <ChatBox
                userInfo={user as AppUser || AppUser}
                discussionId={eRoute.rowId}
                getMessages={eRouteOwnerRepository.listPost}
                classFilter={PostFilter}
                postMessage={eRouteOwnerRepository.createPost}
                countMessages={eRouteOwnerRepository.countPost}
                deleteMessage={eRouteOwnerRepository.deletePost}
                attachFile={eRouteOwnerRepository.saveFile}
                suggestList={eRouteOwnerRepository.singleListAppUser}
              />
            </div>

          )
        }
      </Spin>
    </div>
  );
}
export default ERouteOwnerDetail;
