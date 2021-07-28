import { Col, DatePicker, Row, Switch } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalLanguageKeys } from 'config/consts';
import { E_ROUTE_CHANGE_REQUEST_ROUTE } from 'config/route-consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { ERouteChangeRequest } from 'models/ERouteChangeRequest';
import { ERouteType } from 'models/ERouteType';
import { ERouteTypeFilter } from 'models/ERouteTypeFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';
import { eRouteChangeRequestRepository } from 'views/ERouteChangeRequestView/ERouteChangeRequestRepository';
import { notification } from '../../../helpers/notification';
import ERouteChangeRequestContentTable from './ERouteChangeRequestContentTable/ERouteChangeRequestContentTable';
import './ERouteChangeRequestDetail.scss';

const { Item: FormItem } = Form;

function ERouteChangeRequestDetail() {
  const [translate] = useTranslation();
  // Service goback
  const [handleGoBack] = routerService.useGoBack();
  const history = useHistory();

  // Hooks, useDetail, useChangeHandler
  const [
    eRouteChangeRequest,
    setERouteChangeRequest,
    loading,
    ,
    isDetail,
    ,
  ] = crudService.useDetail(
    ERouteChangeRequest,
    eRouteChangeRequestRepository.get,
    eRouteChangeRequestRepository.save,
  );
  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<ERouteChangeRequest>(
    eRouteChangeRequest,
    setERouteChangeRequest,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [eRouteTypeList] = crudService.useEnumList<ERouteType>(
    eRouteChangeRequestRepository.singleListErouteType,
  );
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [eRouteTypeFilter, setERouteTypeFilter] = React.useState<
    ERouteTypeFilter
  >(new ERouteTypeFilter());

  const [eRouteId, setERouteId] = React.useState<number>(undefined);

  React.useEffect(() => {
    const url = document.URL;
    if (url.includes('?eRouteId')) {
      const temp = url.split('eRouteId=');
      setERouteId(Number(temp[1]));
      if (eRouteId !== undefined) {
        eRouteChangeRequestRepository
          .getDraft(eRouteId)
          .then((eRouteChangeRequest: ERouteChangeRequest) => {
            setERouteChangeRequest(eRouteChangeRequest);
          });
      }
    } else {
      setERouteId(undefined);
    }
  }, [eRouteId, setERouteChangeRequest]);

  const handleSave = React.useCallback(() => {
    const url = document.URL;
    if (url.includes('?eRouteId')) {
      eRouteChangeRequestRepository
        .create(eRouteChangeRequest)
        .then(() => {
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.push(path.join(E_ROUTE_CHANGE_REQUEST_ROUTE));
        })
        .catch((error: Error) => {
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    } else {
      eRouteChangeRequestRepository
        .update(eRouteChangeRequest)
        .then(() => {
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          handleGoBack();
        })
        .catch((error: Error) => {
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }
  }, [eRouteChangeRequest, handleGoBack, history, translate]);
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
                {/* {eRouteChangeRequest.requestStateId && eRouteChangeRequest.requestStateId === 1 && (
           <span className="new-state ml-4">
             {translate(generalLanguageKeys.state.new)}
           </span>
         )}
         {eRouteChangeRequest.requestStateId && eRouteChangeRequest.requestStateId === 2 && (
           <span className="pending-state ml-4">
             {translate(generalLanguageKeys.state.pending)}
           </span>
         )}
         {eRouteChangeRequest.requestStateId && eRouteChangeRequest.requestStateId === 3 && (
           <span className="approved-state ml-4">
             {translate(generalLanguageKeys.state.approved)}
           </span>
         )}
         {eRouteChangeRequest.requestStateId && eRouteChangeRequest.requestStateId === 4 && (
           <span className="rejected-state ml-4">
             {translate(generalLanguageKeys.state.rejected)}
           </span>
         )} */}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                <button
                  className="btn btn-sm btn-primary float-right ml-2"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
                {/* <button
            className="btn btn-sm btn-outline-primary float-right ml-2"
            // onClick={handleGoBack}
          >
            <i className="fa mr-2 fa-times-circle"></i>
            {translate(generalLanguageKeys.actions.reject)}
          </button>
          <button
            className="btn btn-sm btn-primary float-right"
            // onClick={handleGoBack}
          >
            <i className="fa mr-2 fa-paper-plane"></i>
            {translate(generalLanguageKeys.actions.approve)}
          </button> */}
              </div>
            </div>
          }
        >
          <Form>
            <div className="title-detail pt-2">
              {translate('eRouteChangeRequests.detail.title')}
            </div>
            <Row>
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.code),
                  )}
                  help={eRouteChangeRequest.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={eRouteChangeRequest?.eRoute?.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(eRouteChangeRequest.code),
                    )}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.code',
                    )}
                    disabled={true}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.saleEmployee),
                  )}
                  help={eRouteChangeRequest.errors?.saleEmployee}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.saleEmployee')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={eRouteChangeRequest?.eRoute?.saleEmployee?.id}
                    onChange={handleChangeObjectField(
                      nameof(eRouteChangeRequest.saleEmployee),
                    )}
                    getList={eRouteChangeRequestRepository.singleListAppUser}
                    modelFilter={appUserFilter}
                    setModelFilter={setAppUserFilter}
                    searchField={nameof(appUserFilter.id)}
                    searchType={nameof(appUserFilter.displayName.contain)}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.saleEmployee',
                    )}
                    disabled={true}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.startDate),
                  )}
                  help={eRouteChangeRequest.errors?.startDate}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.startDate')}
                    <span className="text-danger">*</span>
                  </span>
                  <DatePicker
                    value={
                      typeof eRouteChangeRequest?.eRoute?.startDate === 'object'
                        ? eRouteChangeRequest?.eRoute?.startDate
                        : null
                    }
                    onChange={handleChangeDateField(
                      nameof(eRouteChangeRequest.startDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.startDate',
                    )}
                    disabled={true}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.status),
                  )}
                  help={eRouteChangeRequest.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.status')}
                  </span>
                  <Switch
                    checked={
                      eRouteChangeRequest.eRoute?.statusId === 1 ? true : false
                    }
                    onChange={handleChangeObjectField(
                      nameof(eRouteChangeRequest.status),
                    )}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.name),
                  )}
                  help={eRouteChangeRequest.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={eRouteChangeRequest?.eRoute?.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeObjectField(
                      nameof(eRouteChangeRequest.name),
                    )}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.name',
                    )}
                    disabled={true}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.type),
                  )}
                  help={eRouteChangeRequest.errors?.type}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.eRouteType')}
                  </span>
                  <SelectAutoComplete
                    value={eRouteChangeRequest.eRoute?.eRouteType?.id}
                    onChange={handleChangeObjectField(
                      nameof(eRouteChangeRequest.eRouteType),
                    )}
                    getList={eRouteChangeRequestRepository.singleListErouteType}
                    list={eRouteTypeList}
                    modelFilter={eRouteTypeFilter}
                    setModelFilter={setERouteTypeFilter}
                    searchField={nameof(eRouteTypeFilter.id)}
                    searchType={nameof(eRouteTypeFilter.name.contain)}
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.eRouteType',
                    )}
                    disabled={true}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.endDate),
                  )}
                  help={eRouteChangeRequest.errors?.endDate}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.endDate')}
                    {eRouteChangeRequest?.eRoute?.eRouteType?.id === 2 && (
                      <span className="text-danger">*</span>
                    )}
                  </span>
                  <DatePicker
                    value={
                      typeof eRouteChangeRequest?.eRoute?.endDate === 'object'
                        ? eRouteChangeRequest?.eRoute?.endDate
                        : null
                    }
                    onChange={handleChangeDateField(
                      nameof(eRouteChangeRequest.endDate),
                    )}
                    className="w-100"
                    placeholder={translate(
                      'eRouteChangeRequests.placeholder.endDate',
                    )}
                    disabled={true}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ERouteChangeRequest
                  >(
                    eRouteChangeRequest.errors,
                    nameof(eRouteChangeRequest.creator),
                  )}
                  help={eRouteChangeRequest.errors?.creator}
                >
                  <span className="label-input ml-3">
                    {translate('eRouteChangeRequests.creator')}
                  </span>
                  <input
                    type="text"
                    value={eRouteChangeRequest.eRoute?.creator?.displayName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(eRouteChangeRequest.creator),
                    )}
                    disabled={true}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <div className="title-detail pt-2 mb-2">
            {translate('eRouteChangeRequests.title.store')}
          </div>
          <ERouteChangeRequestContentTable
            model={eRouteChangeRequest}
            setModel={setERouteChangeRequest}
          />
          <button
            className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
            onClick={handleGoBack}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
          <button
            className="btn btn-sm btn-primary float-right"
            onClick={handleSave}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
        </Card>
      </Spin>
    </div>
  );
}

export default ERouteChangeRequestDetail;
