import { Card, Col, Form, Input, Row, Spin } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService, formService } from 'core/services';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import '.././RoleDetail.scss';
import PermissionRoleTable from './PermissionRoleTable';
import './PermissionRoleDetail.scss';
import { StatusFilter } from 'models/StatusFilter';
import { API_ROLE_ROUTE } from 'config/api-consts';
import { ROLE_ROUTE } from 'config/route-consts';

function PermissionRoleDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(ROLE_ROUTE);

  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    role,
    setRole,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Role, roleRepository.get, roleRepository.save);

  const [statusList, setStatusList] = React.useState<Status[]>([]);
  React.useEffect(() => {
    const filter = new StatusFilter();
    roleRepository.singleListStatus(filter).then((list: Status[]) => {
      setStatusList(list);
    });
  }, [setStatusList]);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Role>(role, setRole);

  return (
    <div className="page detail-page role-detail">
      <Spin spinning={loading}>
        <Card
          className={isDetail ? 'short' : ''}
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
                {validAction('update') &&
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                }
              </div>
            </div>
          }
        >
          <div className="title-detail">{translate('roles.general.info')}</div>

          <Form>
            <Row>
              <Col lg={2} />
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Role>(
                    role.errors,
                    nameof(role.code),
                  )}
                  help={role.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('roles.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={role.code}
                    onChange={handleChangeSimpleField(nameof(role.code))}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Role>(
                    role.errors,
                    nameof(role.name),
                  )}
                  help={role.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('roles.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={role.name}
                    onChange={handleChangeSimpleField(nameof(role.name))}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                {validAction('singleListStatus') &&
                  <FormItem>
                    <span className="label-input ml-3">
                      {translate('roles.status')}
                    </span>
                    <Switch
                      checked={role.statusId === statusList[1]?.id ? true : false}
                      list={statusList}
                      onChange={handleChangeObjectField(nameof(role.status))}
                    />
                  </FormItem>
                }
              </Col>
            </Row>
          </Form>
        </Card>
        {isDetail && (
          <Card className="mt-3">
            <div className="title-detail pt-2 mb-2">
              {translate('roles.general.permission')}
            </div>
            <PermissionRoleTable
              role={role}
              setRole={setRole}
              statusList={statusList}
            />
            <div className="d-flex justify-content-end mt-4">
              {validAction('update') &&
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
              <button
                className="btn btn-sm btn-outline-primary mr-2"
                onClick={handleGoBack}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
}

export default PermissionRoleDetail;
