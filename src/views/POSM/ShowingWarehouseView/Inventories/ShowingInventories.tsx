import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_SHOWING_WAREHOUSE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { WAREHOUSE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingWarehouse } from 'models/posm/ShowingWarehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { showingWarehouseRepository } from '../ShowingWarehouseRepository';
import './ShowingInventories.scss';
import ShowingInventoryTable from './ShowingInventoryTable/ShowingInventoryTable';

const { Item: FormItem } = Form;

function ShowingInventories() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'showing-warehouse',
    API_SHOWING_WAREHOUSE_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(WAREHOUSE_ROUTE);

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

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  return (
    <div className="page detail-page showingWarehouse-detail">
      <Spin spinning={loading}>
        <Card
          className="short"
          title={
            <div className="d-flex justify-content-between ">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left" />
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('showingWarehouses.detail.title')
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
          <div className="title-detail">
            {translate('showingWarehouses.general.info')}
          </div>
          <Form>
            <Row>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.code))}
                  help={showingWarehouse.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.code')}
                    <span className="text-danger">*</span>{' '}
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
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingWarehouse
                  >(showingWarehouse.errors, nameof(showingWarehouse.name))}
                  help={showingWarehouse.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('showingWarehouses.name')}
                    <span className="text-danger">*</span>{' '}
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
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
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
                      <span className="text-danger">*</span>{' '}
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
                      disabled
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <div>
            {isDetail && (
              <div>
                <div className="title-detail pt-2 mb-2">
                  {translate('showingWarehouses.product.title')}
                </div>
                <ShowingInventoryTable
                  model={showingWarehouse}
                  setModel={setShowingWarehouse}
                  field={nameof(showingWarehouse.inventories)}
                  onChange={handleChangeSimpleField(
                    nameof(showingWarehouse.inventories),
                  )}
                />
              </div>
            )}
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default ShowingInventories;
