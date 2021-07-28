import { Input } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { API_SUPPLIER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { SUPPLIER_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { DistrictFilter } from 'models/DistrictFilter';
import { NationFilter } from 'models/NationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { Supplier } from 'models/Supplier';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { supplierRepository } from 'views/SupplierView/SupplierRepository';
import './SupplierDetail.scss';

const { Item: FormItem } = Form;

function SupplierDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(SUPPLIER_ROUTE);
  const { validAction } = crudService.useAction(
    'supplier',
    API_SUPPLIER_ROUTE,
    'mdm',
  );
  // Hooks, useDetail, useChangeHandler
  const [
    supplier,
    setSupplier,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Supplier,
    supplierRepository.get,
    supplierRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Supplier>(supplier, setSupplier);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    supplierRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  const [nationFilter, setNationFilter] = React.useState<NationFilter>(
    new NationFilter(),
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
        setSupplier({
          ...supplier,
          province,
          provinceId,
          districtId,
          district,
          wardId,
          ward,
        });
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [setSupplier, supplier, districtFilter.provinceId],
  );
  if (supplier.id && supplier.provinceId) {
    districtFilter.provinceId.equal = supplier.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setSupplier({
          ...supplier,
          district,
          districtId,
          ward,
          wardId,
        });
      }
      wardFilter.districtId.equal = districtId;
    },
    [setSupplier, supplier, wardFilter.districtId],
  );

  if (supplier.id && supplier.districtId) {
    wardFilter.districtId.equal = supplier.districtId;
  }

  return (
    <div className="page detail-page supplier-detail">
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
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.code),
                  )}
                  help={supplier.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={supplier.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.code))}
                    placeholder={translate('suppliers.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.name),
                  )}
                  help={supplier.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={supplier.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.name))}
                    placeholder={translate('suppliers.placeholder.name')}
                    // pattern=".{0,255}"
                    maxLength={255}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.description),
                  )}
                  help={supplier.errors?.description}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.description')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.description}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(supplier.description),
                    )}
                    placeholder={translate('suppliers.placeholder.description')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.status),
                  )}
                  help={supplier.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.status')}
                  </span>
                  <Switch
                    checked={
                      // typeof supplier.status?.id === 'number' &&
                      supplier.statusId === statusList[1]?.id
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(supplier.status))}
                  />
                </FormItem>
                {validAction('singleListNation') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Supplier>(
                      supplier.errors,
                      nameof(supplier.nation),
                    )}
                    help={supplier.errors?.nation}
                  >
                    <span className="label-input ml-3">
                      {translate('suppliers.nation')}
                    </span>
                    <SelectAutoComplete
                      value={supplier?.nation?.id}
                      onChange={handleChangeObjectField(
                        nameof(supplier.nation),
                      )}
                      getList={supplierRepository.singleListNation}
                      modelFilter={nationFilter}
                      setModelFilter={setNationFilter}
                      searchField={nameof(nationFilter.name)}
                      searchType={nameof(nationFilter.name.contain)}
                      placeholder={translate('suppliers.placeholder.nation')}
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.address),
                  )}
                  help={supplier.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.address')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.address))}
                    placeholder={translate('suppliers.placeholder.address')}
                  />
                </FormItem>
                {supplier.nation && supplier.nation.code === 'VNM' && (
                  <>
                    {' '}
                    {validAction('singleListProvince') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          Supplier
                        >(supplier.errors, nameof(supplier.province))}
                        help={supplier.errors?.province}
                      >
                        <span className="label-input ml-3">
                          {translate('suppliers.province')}
                        </span>
                        <SelectAutoComplete
                          value={supplier?.province?.id}
                          onChange={handleChangeProvince}
                          getList={supplierRepository.singleListProvince}
                          modelFilter={provinceFilter}
                          setModelFilter={setProvinceFilter}
                          searchField={nameof(provinceFilter.name)}
                          searchType={nameof(provinceFilter.name.contain)}
                          placeholder={translate(
                            'suppliers.placeholder.province',
                          )}
                        />
                      </FormItem>
                    )}
                    {validAction('singleListDistrict') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          Supplier
                        >(supplier.errors, nameof(supplier.district))}
                        help={supplier.errors?.district}
                      >
                        <span className="label-input ml-3">
                          {translate('suppliers.district')}
                        </span>
                        <SelectAutoComplete
                          value={supplier.district?.id}
                          onChange={handleChangeDistrict}
                          getList={supplierRepository.singleListDistrict}
                          modelFilter={districtFilter}
                          setModelFilter={setDistrictFilter}
                          searchField={nameof(districtFilter.name)}
                          searchType={nameof(districtFilter.name.contain)}
                          placeholder={translate(
                            'suppliers.placeholder.district',
                          )}
                          disabled={
                            supplier.provinceId !== undefined ? false : true
                          }
                        />
                      </FormItem>
                    )}
                    {validAction('singleListWard') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          Supplier
                        >(supplier.errors, nameof(supplier.ward))}
                        help={supplier.errors?.ward}
                      >
                        <span className="label-input ml-3">
                          {translate('suppliers.ward')}
                        </span>
                        <SelectAutoComplete
                          value={supplier.ward?.id}
                          onChange={handleChangeObjectField(
                            nameof(supplier.ward),
                          )}
                          getList={supplierRepository.singleListWard}
                          modelFilter={wardFilter}
                          setModelFilter={setWardFilter}
                          searchField={nameof(wardFilter.name)}
                          searchType={nameof(wardFilter.name.contain)}
                          placeholder={translate('suppliers.placeholder.ward')}
                          disabled={
                            supplier.districtId !== undefined ? false : true
                          }
                        />
                      </FormItem>
                    )}
                  </>
                )}
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.ownerName),
                  )}
                  help={supplier.errors?.ownerName}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.ownerName')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.ownerName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(supplier.ownerName),
                    )}
                    placeholder={translate('suppliers.placeholder.ownerName')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.phone),
                  )}
                  help={supplier.errors?.phone}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.phone')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.phone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.phone))}
                    placeholder={translate('suppliers.placeholder.phone')}
                    onDoubleClick={handleChangeSimpleField(
                      nameof(supplier.phone),
                    )}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.email),
                  )}
                  help={supplier.errors?.email}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.email')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.email}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.email))}
                    placeholder={translate('suppliers.placeholder.email')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Supplier>(
                    supplier.errors,
                    nameof(supplier.taxCode),
                  )}
                  help={supplier.errors?.taxCode}
                >
                  <span className="label-input ml-3">
                    {translate('suppliers.taxCode')}
                  </span>
                  <Input
                    type="text"
                    value={supplier.taxCode}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(supplier.taxCode))}
                    placeholder={translate('suppliers.placeholder.taxCode')}
                  />
                </FormItem>
                {validAction('singleListPersonInCharge') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Supplier>(
                      supplier.errors,
                      nameof(supplier.personInCharge),
                    )}
                    help={supplier.errors?.personInCharge}
                  >
                    <span className="label-input ml-3">
                      {translate('suppliers.personInCharge')}
                    </span>
                    <SelectAutoComplete
                      value={supplier.personInCharge?.id}
                      onChange={handleChangeObjectField(
                        nameof(supplier.personInCharge),
                      )}
                      getList={supplierRepository.singleListPersonInCharge}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      placeholder={translate(
                        'suppliers.placeholder.personInCharge',
                      )}
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

export default SupplierDetail;
