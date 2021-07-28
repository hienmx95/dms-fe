import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_SHOWING_WAREHOUSE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { SHOWING_WAREHOUSE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { DistrictFilter } from 'models/DistrictFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingWarehouse } from 'models/posm/ShowingWarehouse';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { showingWarehouseRepository } from '../ShowingWarehouseRepository';
import './ShowingWarehouseDetail.scss';

const { Item: FormItem } = Form;

function WarehouseDetail() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'showing-warehouse',
    API_SHOWING_WAREHOUSE_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(SHOWING_WAREHOUSE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    showingWarehouse,
    setShowingWarehouse,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    ShowingWarehouse,
    showingWarehouseRepository.get,
    showingWarehouseRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<ShowingWarehouse>(
    showingWarehouse,
    setShowingWarehouse,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    showingWarehouseRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  const handleChangeProvince = React.useCallback(
    (event, item) => {
      const provinceId = event;
      const province = item;
      if (districtFilter.provinceId.equal !== provinceId) {
        const districtId = undefined;
        const district = undefined;
        const wardId = undefined;
        const ward = undefined;
        setShowingWarehouse({
          ...showingWarehouse,
          province,
          provinceId,
          districtId,
          district,
          wardId,
          ward,
        });
      }
      districtFilter.provinceId.equal = provinceId;
      setDistrictFilter({ ...districtFilter });
    },
    [setShowingWarehouse, showingWarehouse, districtFilter, setDistrictFilter],
  );

  if (showingWarehouse?.id && showingWarehouse?.provinceId) {
    districtFilter.provinceId.equal = showingWarehouse.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setShowingWarehouse({
          ...showingWarehouse,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;
      setWardFilter({ ...wardFilter });
    },
    [setShowingWarehouse, showingWarehouse, wardFilter],
  );

  if (showingWarehouse.id && showingWarehouse.districtId) {
    wardFilter.districtId.equal = showingWarehouse.districtId;
  }

  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
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
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.code))}
                  help={showingWarehouse.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={showingWarehouse.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(showingWarehouse.code),
                    )}
                    placeholder={translate(
                      'showingWarehouses.placeholder.code',
                    )}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.name))}
                  help={showingWarehouse.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={showingWarehouse.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(showingWarehouse.name),
                    )}
                    placeholder={translate(
                      'showingWarehouses.placeholder.name',
                    )}
                  />
                </FormItem>
                {validAction('singleListOrganization') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingWarehouse
                    >(
                      showingWarehouse.errors,
                      nameof(showingWarehouse.organization),
                    )}
                    help={showingWarehouse.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('showingWarehouses.organization')}
                      <span className="text-danger">*</span>
                    </span>
                    <TreeSelectDropdown
                      defaultValue={
                        isDetail ? showingWarehouse.organization?.id : null
                      }
                      value={showingWarehouse.organization?.id}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(showingWarehouse.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={
                        showingWarehouseRepository.singleListOrganization
                      }
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'showingWarehouses.placeholder.organization',
                      )}
                    />
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.status))}
                  help={showingWarehouse.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.status')}
                  </span>
                  <SwitchStatus
                    checked={
                      // typeof store.status?.id === 'number' &&
                      showingWarehouse.statusId === statusList[1]?.id
                        ? true
                        : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(showingWarehouse.status),
                    )}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.address))}
                  help={showingWarehouse.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.address')}
                  </span>
                  <Input
                    type="text"
                    value={showingWarehouse.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(showingWarehouse.address),
                    )}
                    placeholder={translate(
                      'showingWarehouses.placeholder.address',
                    )}
                  />
                </FormItem>
                {validAction('singleListProvince') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingWarehouse
                    >(
                      showingWarehouse.errors,
                      nameof(showingWarehouse.province),
                    )}
                    help={showingWarehouse.errors?.province}
                  >
                    <span className="label-input ml-3">
                      {translate('showingWarehouses.province')}
                    </span>
                    <SelectAutoComplete
                      value={showingWarehouse.province?.id}
                      onChange={handleChangeProvince}
                      getList={showingWarehouseRepository.singleListProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate(
                        'showingWarehouses.placeholder.province',
                      )}
                    />
                  </FormItem>
                )}
                {validAction('singleListDistrict') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingWarehouse
                    >(
                      showingWarehouse.errors,
                      nameof(showingWarehouse.district),
                    )}
                    help={showingWarehouse.errors?.district}
                  >
                    <span className="label-input ml-3">
                      {translate('showingWarehouses.district')}
                    </span>
                    <SelectAutoComplete
                      value={showingWarehouse.district?.id}
                      onChange={handleChangeDistrict}
                      getList={showingWarehouseRepository.singleListDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      placeholder={translate(
                        'showingWarehouses.placeholder.district',
                      )}
                      disabled={
                        showingWarehouse.provinceId !== undefined &&
                        showingWarehouse.provinceId !== null
                          ? false
                          : true
                      }
                    />
                  </FormItem>
                )}
                {validAction('singleListWard') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingWarehouse
                    >(showingWarehouse.errors, nameof(showingWarehouse.ward))}
                    help={showingWarehouse.errors?.ward}
                  >
                    <span className="label-input ml-3">
                      {translate('showingWarehouses.ward')}
                    </span>
                    <SelectAutoComplete
                      value={showingWarehouse.ward?.id}
                      onChange={handleChangeObjectField(
                        nameof(showingWarehouse.ward),
                      )}
                      getList={showingWarehouseRepository.singleListWard}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      placeholder={translate(
                        'showingWarehouses.placeholder.ward',
                      )}
                      disabled={
                        showingWarehouse.districtId !== undefined &&
                        showingWarehouse.districtId !== null
                          ? false
                          : true
                      }
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default WarehouseDetail;
