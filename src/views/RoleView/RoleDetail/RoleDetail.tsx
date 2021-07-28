import { Input } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import InputNumber from 'components/InputNumber/InputNumber';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { ROLE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import './RoleDetail.scss';

const { Item: FormItem } = Form;

function RoleDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack(ROLE_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    role,
    setRole,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Role, roleRepository.get, roleRepository.save);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Role>(role, setRole);

  const [statusList] = crudService.useEnumList<Status>(
    roleRepository.singleListStatus,
  );
  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('roles.detail.title')
                : translate(generalLanguageKeys.actions.create)}
            </>
          }
        >
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
          <Form {...defaultDetailFormLayout}>
            <FormItem
              label={translate('roles.id')}
              validateStatus={formService.getValidationStatus<Role>(
                role.errors,
                nameof(role.id),
              )}
              help={role.errors?.id}
            >
              <InputNumber
                defaultValue={role.id}
                className="w-100"
                onChange={handleChangeSimpleField(nameof(role.id))}
              />
            </FormItem>

            <FormItem
              label={translate('roles.name')}
              validateStatus={formService.getValidationStatus<Role>(
                role.errors,
                nameof(role.name),
              )}
              help={role.errors?.name}
            >
              <Input
                type="text"
                value={role.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(role.name))}
              />
            </FormItem>

            <Select
              value={role.status?.id}
              onChange={handleChangeObjectField(nameof(role.status))}
              list={statusList}
            />
          </Form>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
        <Card className="mt-2">
          <Tabs defaultActiveKey="1"></Tabs>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default RoleDetail;
