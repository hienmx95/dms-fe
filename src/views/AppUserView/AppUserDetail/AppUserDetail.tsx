import { Col, Input, Radio, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { APP_USER_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { Image } from 'models/Image';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PositionFilter } from 'models/PositionFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Sex } from 'models/Sex';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import './AppUserDetail.scss';

const { Item: FormItem } = Form;

function AppUserDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(APP_USER_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    appUser,
    setAppUser,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    AppUser,
    appUserRepository.get,
    appUserRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<AppUser>(appUser, setAppUser);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [userStatusList] = crudService.useEnumList<Status>(
    appUserRepository.singleListStatus,
  );

  const [userSexList] = crudService.useEnumList<Sex>(
    appUserRepository.singleListSex,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );
  const [positionFilter, setPositionFilter] = React.useState<PositionFilter>(
    new PositionFilter(),
  );

  const handleChangeSex = React.useCallback(
    event => {
      const sexId: number = event.target.value;
      setAppUser({
        ...appUser,
        sexId,
      });
    },
    [appUser, setAppUser],
  );

  const [avatar, setAvatar] = React.useState<string>(
    appUser.url ? appUser.url : undefined,
  );

  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      // each user has only one avatar
      if (items.length > 0) {
        const base64 = items[0].originUrl;
        setAppUser({
          ...appUser,
          avatar: base64,
        });
      }
      if (items.length === 0) {
        setAppUser({
          ...appUser,
          avatar: '',
        });
      }
    },
    [setAppUser, appUser],
  );

  React.useEffect(() => {
    if (appUser) {
      setAvatar(appUser.avatar);
    }
  }, [appUser, appUser.avatar]);

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
                    ? translate('appUsers.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2"
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
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem>
                  <span className="label-input ml-3 mb-5">
                    {translate('appUsers.avatar')}
                  </span>
                  <ImageUpload
                    defaultUrl={avatar}
                    limit={1}
                    aspectRatio={1}
                    onChange={handleChangeImages}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.username),
                  )}
                  help={appUser.errors?.username}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.username')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={appUser.username}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.username))}
                    placeholder={translate('appUsers.placeholder.username')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.displayName),
                  )}
                  help={appUser.errors?.displayName}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.displayName')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={appUser.displayName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(appUser.displayName),
                    )}
                    placeholder={translate('appUsers.placeholder.displayName')}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.status),
                  )}
                  help={appUser.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('stores.status')}
                  </span>
                  <Switch
                    checked={
                      // typeof store.status?.id === 'number' &&
                      appUser.statusId === userStatusList[1]?.id ? true : false
                    }
                    list={userStatusList}
                    onChange={handleChangeObjectField(nameof(appUser.status))}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.sex),
                  )}
                  help={appUser.errors?.sex}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.sex')}
                  </span>
                  <Radio.Group
                    onChange={handleChangeSex}
                    defaultValue={appUser.sexId}
                  >
                    <Radio
                      value={userSexList[0]?.id}
                      checked={appUser.sexId === 1 ? true : false}
                    >
                      {userSexList[0]?.name}
                    </Radio>
                    <Radio
                      value={userSexList[1]?.id}
                      checked={appUser.sexId === 2 ? true : false}
                    >
                      {userSexList[1]?.name}
                    </Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.email),
                  )}
                  help={appUser.errors?.email}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.email')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={appUser.email}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.email))}
                    placeholder={translate('appUsers.placeholder.email')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.phone),
                  )}
                  help={appUser.errors?.phone}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.phone')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={appUser.phone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.phone))}
                    placeholder={translate('appUsers.placeholder.phone')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.organization),
                  )}
                  help={appUser.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('stores.organization')}
                  </span>
                  <SelectAutoComplete
                    value={appUser.organization?.id}
                    onChange={handleChangeObjectField(
                      nameof(appUser.organization),
                    )}
                    getList={appUserRepository.singleListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    searchField={nameof(organizationFilter.name)}
                    searchType={nameof(organizationFilter.name.contain)}
                    placeholder={translate('stores.placeholder.organization')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.address),
                  )}
                  help={appUser.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.address')}
                  </span>
                  <Input
                    type="text"
                    value={appUser.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.address))}
                    placeholder={translate('appUsers.placeholder.address')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.province),
                  )}
                  help={appUser.errors?.province}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.province')}
                  </span>
                  <SelectAutoComplete
                    value={appUser.province?.id}
                    onChange={handleChangeObjectField(nameof(appUser.province))}
                    getList={appUserRepository.singleListProvince}
                    modelFilter={provinceFilter}
                    setModelFilter={setProvinceFilter}
                    searchField={nameof(provinceFilter.name)}
                    searchType={nameof(provinceFilter.name.contain)}
                    placeholder={translate('appUsers.placeholder.province')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.position),
                  )}
                  help={appUser.errors?.position}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.position')}
                  </span>
                  <SelectAutoComplete
                    value={appUser.position?.id}
                    onChange={handleChangeObjectField(nameof(appUser.position))}
                    getList={appUserRepository.singleListPosition}
                    modelFilter={positionFilter}
                    setModelFilter={setPositionFilter}
                    searchField={nameof(positionFilter.name)}
                    searchType={nameof(positionFilter.name.contain)}
                    placeholder={translate('appUsers.placeholder.position')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default AppUserDetail;
