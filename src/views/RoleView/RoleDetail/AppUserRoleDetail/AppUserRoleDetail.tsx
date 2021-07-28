import React from 'react';
import { useTranslation } from 'react-i18next';
import { routerService, crudService } from 'core/services';
import { Role } from 'models/Role';
import { roleRepository } from 'views/RoleView/RoleRepository';
import { Spin, Card, Form, Col, Row, Input } from 'antd';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import FormItem from 'antd/lib/form/FormItem';
import { Status } from 'models/Status';
import AppUserRoleMappingTable from './AppUserRoleMappingTable';
import '.././RoleDetail.scss';
import { notification } from 'helpers/notification';
import { useHistory } from 'react-router';
import { StatusFilter } from 'models/StatusFilter';
import { API_ROLE_ROUTE } from 'config/api-consts';
import { ROLE_ROUTE } from 'config/route-consts';

function AppUserRoleDetail() {
  const [translate] = useTranslation();
  const history = useHistory();
  // Service goback
  const [handleGoBack] = routerService.useGoBack(ROLE_ROUTE);
  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [role, setRole, loading, , isDetail] = crudService.useDetail(
    Role,
    roleRepository.get,
    roleRepository.save,
  );

  const handleSave = React.useCallback(() => {
    roleRepository
      .assignAppUser(role)
      .then((t: Role) => {
        setRole(t);
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
        history.goBack();
      })
      .catch((error: Error) => {
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [role, setRole, translate, history]);

  const [statusList, setStatusList] = React.useState<Status[]>([]);
  React.useEffect(() => {
    const filter = new StatusFilter();
    roleRepository.singleListStatus(filter).then((list: Status[]) => {
      setStatusList(list);
    });
  }, [setStatusList]);

  return (
    <div className="page detail-page role-detail">
      <Spin spinning={loading}>
        <Card
          className="short"
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
                {validAction('assign-app-user') &&
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
          <div className="title-detail">
            {translate('roles.general.info')}
          </div>
          <Form>
            <Row>
              <Col lg={2} />
              <Col lg={11}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('roles.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    readOnly
                    value={role.code}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('roles.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    readOnly
                    value={role.name}
                    className="form-control form-control-sm"
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('roles.status')}
                  </span>
                  <Switch
                    checked={role.statusId === statusList[1]?.id ? true : false}
                    list={statusList}
                    disabled={true}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="mt-3">
          <div className="title-detail pt-2 mb-2">
            {translate('roles.general.appUser')}
          </div>
          <AppUserRoleMappingTable role={role} setRole={setRole} />
          <div className="d-flex justify-content-end mt-4">
            {validAction('assign-app-user') &&
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
      </Spin>
    </div>
  );
}

export default AppUserRoleDetail;
