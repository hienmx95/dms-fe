import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_WAREHOUSE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { WAREHOUSE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { DistrictFilter } from 'models/DistrictFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { WardFilter } from 'models/WardFilter';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { warehouseRepository } from 'views/WarehouseView/WarehouseRepository';
import './WarehouseDetail.scss';

const { Item: FormItem } = Form;

function WarehouseDetail() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'warehouse',
    API_WAREHOUSE_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(WAREHOUSE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    warehouse,
    setWarehouse,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Warehouse,
    warehouseRepository.get,
    warehouseRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Warehouse>(warehouse, setWarehouse);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    warehouseRepository.singleListStatus,
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
        setWarehouse({
          ...warehouse,
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
    [setWarehouse, warehouse, districtFilter, setDistrictFilter],
  );

  if (warehouse.id && warehouse.provinceId) {
    districtFilter.provinceId.equal = warehouse.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setWarehouse({
          ...warehouse,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;
      setWardFilter({ ...wardFilter });
    },
    [setWarehouse, warehouse, wardFilter],
  );

  if (warehouse.id && warehouse.districtId) {
    wardFilter.districtId.equal = warehouse.districtId;
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
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.code),
                  )}
                  help={warehouse.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={warehouse.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.code))}
                    placeholder={translate('warehouses.placeholder.code')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.name),
                  )}
                  help={warehouse.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={warehouse.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.name))}
                    placeholder={translate('warehouses.placeholder.name')}
                  />
                </FormItem>
                {validAction('singleListOrganization') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Warehouse>(
                      warehouse.errors,
                      nameof(warehouse.organization),
                    )}
                    help={warehouse.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('warehouses.organization')}
                      <span className="text-danger">*</span>
                    </span>
                    <TreeSelectDropdown
                      defaultValue={
                        isDetail ? warehouse.organization?.id : null
                      }
                      value={warehouse.organization?.id}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(warehouse.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={warehouseRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'warehouses.placeholder.organization',
                      )}
                    />
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.status),
                  )}
                  help={warehouse.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.status')}
                  </span>
                  <SwitchStatus
                    checked={
                      // typeof store.status?.id === 'number' &&
                      warehouse.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(warehouse.status))}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.address),
                  )}
                  help={warehouse.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.address')}
                  </span>
                  <Input
                    type="text"
                    value={warehouse.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(warehouse.address),
                    )}
                    placeholder={translate('warehouses.placeholder.address')}
                  />
                </FormItem>
                {validAction('singleListProvince') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Warehouse>(
                      warehouse.errors,
                      nameof(warehouse.province),
                    )}
                    help={warehouse.errors?.province}
                  >
                    <span className="label-input ml-3">
                      {translate('warehouses.province')}
                    </span>
                    <SelectAutoComplete
                      value={warehouse.province?.id}
                      onChange={handleChangeProvince}
                      getList={warehouseRepository.singleListProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate('warehouses.placeholder.province')}
                    />
                  </FormItem>
                )}
                {validAction('singleListDistrict') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Warehouse>(
                      warehouse.errors,
                      nameof(warehouse.district),
                    )}
                    help={warehouse.errors?.district}
                  >
                    <span className="label-input ml-3">
                      {translate('warehouses.district')}
                    </span>
                    <SelectAutoComplete
                      value={warehouse.district?.id}
                      onChange={handleChangeDistrict}
                      getList={warehouseRepository.singleListDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      placeholder={translate('warehouses.placeholder.district')}
                      disabled={
                        warehouse.provinceId !== undefined &&
                        warehouse.provinceId !== null
                          ? false
                          : true
                      }
                    />
                  </FormItem>
                )}
                {validAction('singleListWard') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Warehouse>(
                      warehouse.errors,
                      nameof(warehouse.ward),
                    )}
                    help={warehouse.errors?.ward}
                  >
                    <span className="label-input ml-3">
                      {translate('warehouses.ward')}
                    </span>
                    <SelectAutoComplete
                      value={warehouse.ward?.id}
                      onChange={handleChangeObjectField(nameof(warehouse.ward))}
                      getList={warehouseRepository.singleListWard}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      placeholder={translate('warehouses.placeholder.ward')}
                      disabled={
                        warehouse.districtId !== undefined &&
                        warehouse.districtId !== null
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
