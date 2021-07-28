import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import InventoryTable from 'views/WarehouseView/Inventories/InventoryTable/InventoryTable';
import { warehouseRepository } from 'views/WarehouseView/WarehouseRepository';
import './Inventories.scss';
import { API_WAREHOUSE_ROUTE } from 'config/api-consts';
import { WAREHOUSE_ROUTE } from 'config/route-consts';

const { Item: FormItem } = Form;

function Inventories() {
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

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  return (
    <div className="page detail-page warehouse-detail">
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
                    ? translate('warehouses.detail.title')
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
            {translate('warehouses.general.info')}
          </div>
          <Form>
            <Row>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.code),
                  )}
                  help={warehouse.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.code')}
                    <span className="text-danger">*</span>{' '}
                  </span>
                  <Input
                    type="text"
                    value={warehouse.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.code))}
                    placeholder={translate('warehouses.placeholder.code')}
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Warehouse>(
                    warehouse.errors,
                    nameof(warehouse.name),
                  )}
                  help={warehouse.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('warehouses.name')}
                    <span className="text-danger">*</span>{' '}
                  </span>
                  <Input
                    type="text"
                    value={warehouse.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(warehouse.name))}
                    placeholder={translate('warehouses.placeholder.name')}
                    disabled
                  />
                </FormItem>
              </Col>
              <Col lg={8}>
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
                      <span className="text-danger">*</span>{' '}
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
                  {translate('warehouses.product.title')}
                </div>
                <InventoryTable
                  model={warehouse}
                  setModel={setWarehouse}
                  field={nameof(warehouse.inventories)}
                  onChange={handleChangeSimpleField(
                    nameof(warehouse.inventories),
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

export default Inventories;
