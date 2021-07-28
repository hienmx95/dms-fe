import { Input } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import Map from 'components/GoogleAutoCompleteMap/GoogleAutoCompleteMap';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_STORE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { STORE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { DistrictFilter } from 'models/DistrictFilter';
import { Image } from 'models/Image';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreImageMapping } from 'models/StoreImageMapping';
import { StoreScouting } from 'models/StoreScouting';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { storeRepository } from 'views/StoreView/StoreRepository';
import StoreBrandRankingContentTable from './StoreBrandRankingContentTable/StoreBrandRankingContentTable';
import './StoreDetail.scss';

const { Item: FormItem } = Form;

function StoreDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('store', API_STORE_ROUTE);

  // Service goback
  const [handleGoBack] = routerService.useGoBack(STORE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    store,
    setStore,
    loading,
    ,
    isDetail,
    handleSave,
    handleApprove,
  ] = crudService.useDetail(
    Store,
    storeRepository.get,
    storeRepository.save,
    storeRepository.approve,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Store>(store, setStore);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    storeRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StatusFilter
  >(new StatusFilter());

  const [storeId, setStoreId] = React.useState<number>(undefined);
  const [storeImageMappings, setStoreImageMappings] = React.useState<Image[]>(
    [],
  );

  const [resetDistrict, setResetDistrict] = React.useState<boolean>(false);

  const [resetWard, setResetWard] = React.useState<boolean>(false);

  const [resetStoreStatus, setResetStoreStatus] = React.useState<boolean>(true);

  const [resetStore, setResetStore] = React.useState<boolean>(true);

  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setStoreImageMappings(items);
      const storeImageMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          storeImageMappings.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      setStore({
        ...store,
        storeImageMappings,
      });
    },
    [setStore, store],
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
        setStore({
          ...store,
          province,
          provinceId,
          districtId,
          district,
          wardId,
          ward,
        });
        setResetDistrict(true); // reset district
        setResetWard(true); // reset ward
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [setStore, store, districtFilter.provinceId],
  );

  if (store.id && store.provinceId) {
    districtFilter.provinceId.equal = store.provinceId;
  }
  const handleChangeDistrict = React.useCallback(
    (event, item) => {
      const districtId = event;
      const district = item;
      if (wardFilter.districtId.equal !== districtId) {
        const wardId = undefined;
        const ward = undefined;
        setStore({
          ...store,
          district,
          districtId,
          ward,
          wardId,
        });
        setResetWard(true); // reset ward
      }
      wardFilter.districtId.equal = districtId;
    },
    [setStore, store, wardFilter.districtId],
  );

  if (store.id && store.districtId) {
    wardFilter.districtId.equal = store.districtId;
  }

  React.useEffect(() => {
    const url = document.URL;
    if (resetStore && url.includes('?storeScoutingId=')) {
      const temp = url.split('storeScoutingId=');
      setStoreId(Number(temp[1]));
      if (storeId !== undefined) {
        storeRepository
          .getDraft(storeId)
          .then((storeScouting: StoreScouting) => {
            setStore(storeScouting);
            setResetStore(false);
          });
      }
    } else {
      setStoreId(undefined);
    }

    if (isDetail === false && resetStoreStatus) {
      setStore({
        ...store,
        storeStatus: {
          id: 3,
        },
        storeStatusId: 3,
      });
      setResetStoreStatus(false);
    }
  }, [setStore, storeId, store, isDetail, resetStoreStatus, resetStore]);

  React.useEffect(() => {
    const images = [];
    if (store.storeImageMappings && store.storeImageMappings.length > 0) {
      store.storeImageMappings.map((storeImageMapping: StoreImageMapping) => {
        return images.push(storeImageMapping.image);
      });
      setStoreImageMappings(images);
    }
  }, [store.storeImageMappings]);

  const handleChangePlace = React.useCallback(
    (isAddress: boolean) => {
      return (address: string, latitude: number, longitude: number) => {
        if (isAddress) {
          setStore({ ...store, address, latitude, longitude });
          return;
        }
        setStore({
          ...store,
          deliveryLatitude: latitude,
          deliveryLongitude: longitude,
        });
      };
    },
    [setStore, store],
  );
  return (
    <div className="page detail-page store-detail">
      <Spin spinning={loading}>
        <Card
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

                {isDetail && store.storeStatusId === 2 && (
                  <button
                    className="btn btn-sm btn-approve float-right mr-2"
                    onClick={handleApprove}
                  >
                    <i className="fa mr-2 fa-check"></i>
                    {translate(generalLanguageKeys.actions.approve)}
                  </button>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <div className="info-title ml-3">
              {translate('stores.general.info')}
            </div>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.code),
                  )}
                  help={store.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('stores.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={store.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.code))}
                    disabled
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.codeDraft),
                  )}
                  help={store.errors?.codeDraft}
                >
                  <span className="label-input ml-3">
                    {translate('stores.codeDraft')}
                  </span>
                  <Input
                    type="text"
                    value={store.codeDraft}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.codeDraft))}
                    placeholder={translate('stores.placeholder.codeDraft')}
                  />
                </FormItem>
                {validAction('singleListOrganization') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.organizationId),
                    )}
                    help={store.errors?.organizationId}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.organization')}
                      <span className="text-danger">*</span>
                    </span>
                    <TreeSelectDropdown
                      defaultValue={store.organization?.id}
                      value={store.organization?.id}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(store.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={storeRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate('stores.placeholder.organization')}
                    />
                  </FormItem>
                )}
                {validAction('singleListStoreType') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.storeTypeId),
                    )}
                    help={store.errors?.storeTypeId}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.storeType')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={store.storeType?.id}
                      onChange={handleChangeObjectField(
                        nameof(store.storeType),
                      )}
                      getList={storeRepository.singleListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      placeholder={translate('stores.placeholder.storeType')}
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.legalEntity),
                  )}
                  help={store.errors?.legalEntity}
                >
                  <span className="label-input ml-3">
                    {translate('stores.legalEntity')}
                  </span>
                  <Input
                    type="text"
                    value={store.legalEntity}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(store.legalEntity),
                    )}
                    placeholder={translate('stores.placeholder.legalEntity')}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.name),
                  )}
                  help={store.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('stores.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={store.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.name))}
                    placeholder={translate('stores.placeholder.name')}
                  />
                </FormItem>
                {validAction('singleListParentStore') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.parentStore),
                    )}
                    help={store.errors?.parentStore}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.parentStore')}
                    </span>
                    <SelectAutoComplete
                      value={store.parentStore?.id}
                      onChange={handleChangeObjectField(
                        nameof(store.parentStore),
                      )}
                      getList={storeRepository.singleListParentStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      placeholder={translate('stores.placeholder.parentStore')}
                    />
                  </FormItem>
                )}
                {validAction('singleListStoreGrouping') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.storeGrouping),
                    )}
                    help={store.errors?.storeGrouping}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.storeGrouping')}
                    </span>
                    <SelectAutoComplete
                      value={store.storeGrouping?.id}
                      onChange={handleChangeObjectField(
                        nameof(store.storeGrouping),
                      )}
                      getList={storeRepository.singleListStoreGrouping}
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      placeholder={translate(
                        'stores.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                )}

                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.taxCode),
                  )}
                  help={store.errors?.taxCode}
                >
                  <span className="label-input ml-3">
                    {translate('stores.taxCode')}
                    {/* <span className="text-danger">*</span> */}
                  </span>
                  <Input
                    type="text"
                    value={store.taxCode}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.taxCode))}
                    placeholder={translate('stores.placeholder.taxCode')}
                  />
                </FormItem>
              </Col>
              <Col lg={2} />
              {validAction('singleListAppUser') && (
                <Col lg={11}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.appUser),
                    )}
                    help={store.errors?.appUser}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.appUser')}
                    </span>
                    <SelectAutoComplete
                      value={store.appUser?.id}
                      onChange={handleChangeObjectField(nameof(store.appUser))}
                      getList={storeRepository.singleListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      placeholder={translate('stores.placeholder.appUser')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              <Col lg={11}></Col>
            </Row>
            <Row>
              <Col lg={11}>
                {validAction('singleListProvince') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.province),
                    )}
                    help={store.errors?.province}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.province')}
                    </span>
                    <SelectAutoComplete
                      value={store.province?.id}
                      onChange={handleChangeProvince}
                      getList={storeRepository.singleListProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate('stores.placeholder.province')}
                    />
                  </FormItem>
                )}
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                {validAction('singleListDistrict') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.district),
                    )}
                    help={store.errors?.district}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.district')}
                    </span>
                    <SelectAutoComplete
                      value={store.district?.id}
                      onChange={handleChangeDistrict}
                      getList={storeRepository.singleListDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      placeholder={translate('stores.placeholder.district')}
                      disabled={
                        store.provinceId !== undefined &&
                        store.provinceId !== null
                          ? false
                          : true
                      }
                      isReset={resetDistrict}
                      setIsReset={setResetDistrict}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                {validAction('singleListWard') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.ward),
                    )}
                    help={store.errors?.ward}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.ward')}
                    </span>
                    <SelectAutoComplete
                      value={store.ward?.id}
                      onChange={handleChangeObjectField(nameof(store.ward))}
                      getList={storeRepository.singleListWard}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      placeholder={translate('stores.placeholder.ward')}
                      disabled={
                        store.districtId !== undefined &&
                        store.districtId !== null
                          ? false
                          : true
                      }
                      isReset={resetWard}
                      setIsReset={setResetWard}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <div className={'store-address'}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.address),
                    )}
                    help={store.errors?.address}
                  >
                    <span className="label-input label-address ml-3">
                      {translate('stores.address1')}
                      <span className="text-danger">*</span>
                    </span>
                    <div className="store-address-input">
                      <div className="mb-4">
                        <Input
                          type="text"
                          value={store.address}
                          className="form-control form-control-sm input-map"
                          onChange={handleChangeSimpleField(
                            nameof(store.address),
                          )}
                          placeholder={translate('stores.placeholder.address')}
                        />
                      </div>
                      <div
                        style={{ height: 300 }}
                        className="mb-5 google-map mt-4"
                      >
                        <Map
                          lat={store.latitude ? store.latitude : 21.027763}
                          lng={store.longitude ? store.longitude : 105.83416}
                          defaultZoom={10}
                          defaultAddress={store.address}
                          model={store}
                          setModel={setStore}
                          isAddress={true}
                          placeholder={translate('stores.placeholder.address')}
                          onPlacesChanged={handleChangePlace(true)}
                        />
                      </div>
                    </div>
                  </FormItem>
                </div>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('stores.location')}
                  </span>
                  <Row>
                    <Col span={12} className="pr-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.latitude')}
                      </span>
                      <InputNumber
                        value={store.latitude}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(store.latitude),
                        )}
                        allowNegative={true}
                        maximumDecimalCount={10}
                      />
                    </Col>
                    <Col span={12} className="pl-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.longitude')}
                      </span>
                      <InputNumber
                        value={store.longitude}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(store.longitude),
                        )}
                        allowNegative={true}
                        maximumDecimalCount={10}
                      />
                    </Col>
                  </Row>
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.telephone),
                  )}
                  help={store.errors?.telephone}
                >
                  <span className="label-input ml-3">
                    {translate('stores.telephone')}
                  </span>
                  <Input
                    type="text"
                    value={store.telephone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.telephone))}
                    placeholder={translate('stores.placeholder.phone')}
                  />
                </FormItem>
                {validAction('saveImage') && (
                  <FormItem>
                    <span className="label-input ml-3 mb-5 pb-4">
                      {translate('stores.images')}
                    </span>

                    <ImageUpload
                      defaultItems={storeImageMappings}
                      limit={15}
                      aspectRatio={1}
                      onUpload={storeRepository.uploadImage}
                      onChange={handleChangeImages}
                    />
                  </FormItem>
                )}
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                <div className={'store-address'}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.deliveryAddress),
                    )}
                    help={store.errors?.deliveryAddress}
                  >
                    <span className="label-input label-address ml-3">
                      {translate('stores.address2')}
                    </span>
                    <div className="store-address-input">
                      <div className="mb-4">
                        <Input
                          type="text"
                          value={store.deliveryAddress}
                          className="form-control form-control-sm input-map"
                          onChange={handleChangeSimpleField(
                            nameof(store.deliveryAddress),
                          )}
                          placeholder={translate(
                            'stores.placeholder.deliveryAddress',
                          )}
                        />
                      </div>
                      <div
                        style={{ height: 300 }}
                        className="mb-5 google-map mt-4"
                      >
                        <Map
                          lat={
                            store.deliveryLatitude
                              ? store.deliveryLatitude
                              : 21.027763
                          }
                          lng={
                            store.deliveryLongitude
                              ? store.deliveryLongitude
                              : 105.83416
                          }
                          defaultZoom={10}
                          defaultAddress={store.deliveryAddress}
                          inputClassName={
                            'form-control form-control-sm mb-4 input-map'
                          }
                          model={store}
                          setModel={setStore}
                          isAddress={false}
                          placeholder={translate('stores.placeholder.address2')}
                          onPlacesChanged={handleChangePlace(false)}
                        />
                      </div>
                    </div>
                  </FormItem>
                </div>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('stores.location')}
                  </span>
                  <Row>
                    <Col span={12} className="pr-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.latitude')}
                      </span>
                      <InputNumber
                        value={store.deliveryLatitude}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(store.deliveryLatitude),
                        )}
                        allowNegative={true}
                        maximumDecimalCount={10}
                      />
                    </Col>
                    <Col span={12} className="pl-2 d-flex">
                      <span className="label-input ml-3">
                        {translate('stores.longitude')}
                      </span>
                      <InputNumber
                        value={store.deliveryLongitude}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(store.deliveryLongitude),
                        )}
                        allowNegative={true}
                        maximumDecimalCount={10}
                      />
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <div className="info-title ml-3 mt-4">
              {translate('stores.owner.info')}
            </div>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerName),
                  )}
                  help={store.errors?.ownerName}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerName')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={store.ownerName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerName))}
                    placeholder={translate('stores.placeholder.ownerName')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerEmail),
                  )}
                  help={store.errors?.ownerEmail}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerEmail')}
                  </span>
                  <Input
                    type="text"
                    value={store.ownerEmail}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerEmail))}
                    placeholder={translate('stores.placeholder.ownerEmail')}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.ownerPhone),
                  )}
                  help={store.errors?.ownerPhone}
                >
                  <span className="label-input ml-3">
                    {translate('stores.ownerPhone')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={store.ownerPhone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(store.ownerPhone))}
                    placeholder={translate('stores.placeholder.ownerPhone')}
                  />
                </FormItem>
              </Col>
            </Row>
            <div className="info-title ml-3 mt-4">
              {translate('stores.brandRanking')}
            </div>

            <Row>
              <Col>
                <StoreBrandRankingContentTable
                  model={store}
                  setModel={setStore}
                  field={nameof(store.brandInStores)}
                  // filter={storeFilter}
                  // setFilter={setStoreFilter}
                />
              </Col>
            </Row>

            <div className="info-title ml-3 mt-4">
              {translate('stores.status')}
            </div>
            <Row>
              <Col lg={11}>
                {validAction('singleListStoreStatus') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Store>(
                      store.errors,
                      nameof(store.storeStatus),
                    )}
                    help={store.errors?.storeStatus}
                  >
                    <span className="label-input ml-3">
                      {translate('stores.storeStatus')}
                      <span className="text-danger">*</span>
                    </span>
                    <SelectAutoComplete
                      value={store.storeStatus?.id}
                      onChange={handleChangeObjectField(
                        nameof(store.storeStatus),
                      )}
                      getList={storeRepository.singleListStoreStatus}
                      modelFilter={storeStatusFilter}
                      setModelFilter={setStoreStatusFilter}
                      searchField={nameof(storeStatusFilter.name)}
                      searchType={nameof(storeStatusFilter.name.contain)}
                      placeholder={translate('stores.placeholder.storeStatus')}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>

            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Store>(
                    store.errors,
                    nameof(store.status),
                  )}
                  help={store.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('stores.status')}
                  </span>
                  <Switch
                    checked={
                      store.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(store.status))}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            {isDetail && store.storeStatusId === 2 && (
              <button
                className="btn btn-sm btn-approve float-right mr-2"
                onClick={handleApprove}
              >
                <i className="fa mr-2 fa-check"></i>
                {translate(generalLanguageKeys.actions.approve)}
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
            {!isDetail && validAction('create') && (
              <button
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-primary ml-2 mr-2"
              onClick={handleGoBack}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default StoreDetail;
