import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService, routerService } from 'core/services';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { organizationRepository } from '../OrganizationRepository';

const { Item: FormItem } = Form;

function OrganizationTreeDetail() {
  const [translate] = useTranslation();

  const res = window.location.href.split('=');
  let idOrg: number = null;
  if (res && res.length > 1) {
    idOrg = Number(res[1]);
  }

  // Service goback
  const [handleGoBack] = routerService.useGoBack();
  // Hooks, useDetail, useChangeHandler
  const [
    organization,
    setOrganization,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Organization,
    organizationRepository.get,
    organizationRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Organization>(
    organization,
    setOrganization,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    organizationRepository.singleListStatus,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  React.useEffect(() => {
    let parentId: number = null;
    if (organization.parentId === undefined) {
      if (idOrg && idOrg !== null) {
        parentId = idOrg;
        setOrganization({
          ...organization,
          parentId,
        });
        handleChangeSimpleField(nameof(organization.parentId));
      }
    }
  }, [
    setOrganization,
    idOrg,
    handleChangeSimpleField,
    organization.parentId,
    organization,
  ]);

  return (
    <div className="page detail-page organization-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button className="btn btn-link btn-back" onClick={handleGoBack}>
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
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.code),
                  )}
                  help={organization.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={organization.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(organization.code),
                    )}
                    placeholder={translate('organizations.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.name),
                  )}
                  help={organization.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={organization.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(organization.name),
                    )}
                    placeholder={translate('organizations.placeholder.name')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.status),
                  )}
                  help={organization.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.status')}
                  </span>
                  <SwitchStatus
                    checked={organization.statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(organization.status),
                    )}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.organization),
                  )}
                  help={organization.errors?.organization}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.organization')}
                    {/* <span className="text-danger">*</span> */}
                  </span>
                  <TreeSelectDropdown
                    defaultValue={isDetail ? organization.parent?.id : idOrg}
                    value={organization.parent?.id || idOrg}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(organization.parent),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={organizationRepository.singleListOrganization}
                    searchField={nameof(organizationFilter.id)}
                    placeholder={translate('organizations.placeholder.organization')}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.address),
                  )}
                  help={organization.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.address')}
                  </span>
                  <input
                    type="text"
                    defaultValue={organization.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(organization.address),
                    )}
                    placeholder={translate('organizations.placeholder.address')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.email),
                  )}
                  help={organization.errors?.email}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.email')}
                  </span>
                  <input
                    type="text"
                    defaultValue={organization.email}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(organization.email),
                    )}
                    placeholder={translate('organizations.placeholder.email')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Organization>(
                    organization.errors,
                    nameof(organization.phone),
                  )}
                  help={organization.errors?.phone}
                >
                  <span className="label-input ml-3">
                    {translate('organizations.phone')}
                  </span>
                  <input
                    type="text"
                    defaultValue={organization.phone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(organization.phone),
                    )}
                    placeholder={translate('organizations.placeholder.phone')}
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

export default OrganizationTreeDetail;
