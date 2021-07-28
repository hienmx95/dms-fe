import Card from 'antd/lib/card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { systemConfigurationService } from './SystemConfigurationService';
import { systemConfigurationRepository } from './SystemConfigurationRepository';
import { SystemConfiguration } from 'models/SystemConfiguration';
import { Col, Input, Radio, Row } from 'antd';
import InputNumber from 'components/InputNumber/InputNumber';
import './SystemConfiguration.scss';
import { Switch } from 'antd';
import nameof from 'ts-nameof.macro';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { API_SYSTEM_CONFIGURATION_ROUTE } from 'config/api-consts';

function SystemConfigurationView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'system-configuration',
    API_SYSTEM_CONFIGURATION_ROUTE,
  );
  const {
    handleChangeSwitch,
    config,
    setConfig,
    handleChangeRadio1,
    handleChangeRadio2,
    handleSave,
    handleCancel,
  } = systemConfigurationService.useSystemConfig<SystemConfiguration>(
    SystemConfiguration,
    systemConfigurationRepository.get,
    systemConfigurationRepository.update,
  );

  const radioList = [
    { id: 0, name: 'systemConfigurations.low' },
    { id: 1, name: 'systemConfigurations.high' },
  ];
  const [handleChangeSimpleField] = crudService.useChangeHandlers(
    config,
    setConfig,
  );
  return (
    <div className="page master-page">
      <Card
        title={
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <div className="pt-1 pl-1">
                {translate('systemConfigurations.master.title')}
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
              {validAction('update') && (
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
        <Row className="align-content-center pb-2 pt-2">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate('systemConfigurations.checkingDistance')}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-1 " span={2}>
            <div className="d-flex align-center flex-end">
              <InputNumber
                className="form-control form-control-sm"
                value={config?.storE_CHECKING_DISTANCE}
                min={0}
                allowNegative={false}
                onChange={handleChangeSimpleField(
                  nameof(config.storE_CHECKING_DISTANCE),
                )}
              />
              <span className="pl-1 text">
                {translate('systemConfigurations.m')}
              </span>
            </div>
          </Col>
          <Col className="pl-1" span={1}></Col>
          <Col className="pl-3" span={8}>
            <div className="text">
              {translate('systemConfigurations.checkingMiniumTime')}
            </div>
          </Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center">
              <InputNumber
                className="form-control form-control-sm"
                value={config?.storE_CHECKING_MINIMUM_TIME}
                min={0}
                allowNegative={false}
                onChange={handleChangeSimpleField(
                  nameof(config.storE_CHECKING_MINIMUM_TIME),
                )}
              />
              <span className="pl-1 text">
                {translate('systemConfigurations.seconds')}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-2">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate(
                'systemConfigurations.checkingOfflineConstrainDistance',
              )}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-1 " span={2}>
            <div className="d-flex align-center flex-end">
              <Switch
                checked={config?.storE_CHECKING_OFFLINE_CONSTRAINT_DISTANCE}
                onChange={handleChangeSwitch(
                  nameof(config.storE_CHECKING_OFFLINE_CONSTRAINT_DISTANCE),
                )}
              />
            </div>
          </Col>
          <Col className="pl-1" span={1}></Col>
          <Col className="pl-3" span={8}>
            <div className="text">
              {translate('systemConfigurations.dashBoardReloadTime')}
            </div>
          </Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center">
              <InputNumber
                className="form-control form-control-sm"
                value={config?.dasH_BOARD_REFRESH_TIME}
                min={0}
                allowNegative={false}
                onChange={handleChangeSimpleField(
                  nameof(config.dasH_BOARD_REFRESH_TIME),
                )}
              />
              <span className="pl-1 text">
                {translate('systemConfigurations.seconds')}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-2">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate('systemConfigurations.useDirectSaleOrder')}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-1 " span={2}>
            <div className="d-flex align-center flex-end">
              <Switch
                checked={config?.usE_DIRECT_SALES_ORDER}
                onChange={handleChangeSwitch(
                  nameof(config.usE_DIRECT_SALES_ORDER),
                )}
              />
            </div>
          </Col>
          <Col className="pl-1" span={1}></Col>
          <Col className="pl-3" span={8}>
            <div className="text">
              {translate('systemConfigurations.amplitudePriceInDirect')}
            </div>
          </Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center">
              <InputNumber
                className="form-control form-control-sm"
                value={config?.amplitudE_PRICE_IN_DIRECT}
                min={0}
                allowNegative={false}
                onChange={handleChangeSimpleField(
                  nameof(config.amplitudE_PRICE_IN_DIRECT),
                )}
              />
              <span className="pl-1 text">
                {translate('systemConfigurations.percent')}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-2">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate('systemConfigurations.useInDirectSaleOrder')}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-1 " span={2}>
            <div className="d-flex align-center flex-end">
              <Switch
                checked={config?.usE_INDIRECT_SALES_ORDER}
                onChange={handleChangeSwitch(
                  nameof(config.usE_INDIRECT_SALES_ORDER),
                )}
              />
            </div>
          </Col>
          <Col className="pl-1" span={1}></Col>
          <Col className="pl-3" span={8}>
            <div className="text">
              {translate('systemConfigurations.amplitudePriceInInDirect')}
            </div>
          </Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center">
              <InputNumber
                className="form-control form-control-sm"
                value={config?.amplitudE_PRICE_IN_INDIRECT}
                min={0}
                allowNegative={false}
                onChange={handleChangeSimpleField(
                  nameof(config.amplitudE_PRICE_IN_INDIRECT),
                )}
              />
              <span className="pl-1 text">
                {translate('systemConfigurations.percent')}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-3">
          <Col span={1}></Col>
          <Col className="pl-1 " span={8}>
            <div className="text">
              {translate('systemConfigurations.allowEditKpiInPeriod')}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center flex-end">
              <Switch
                checked={config?.alloW_EDIT_KPI_IN_PERIOD}
                onChange={handleChangeSwitch(
                  nameof(config.alloW_EDIT_KPI_IN_PERIOD),
                )}
              />
            </div>
          </Col>
          <Col span={1}></Col>
          <Col className="pl-3" span={8}>
            <div className="text">
              {translate('systemConfigurations.youtubeId')}
            </div>
          </Col>
          <Col className="pl-1" span={2}>
            <div className="d-flex align-center">
              <Input
                className="form-control form-control-sm"
                value={config?.YOUTUBE_ID}
                onChange={handleChangeSimpleField(nameof(config.YOUTUBE_ID))}
              />
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-3">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate('systemConfigurations.priorityUsePriceList')}
            </div>
          </Col>
          <Col className="pl-1 ml-3" span={3}>
            <div className="d-flex flex-end">
              <Radio.Group
                className="d-flex "
                onChange={handleChangeRadio1}
                defaultValue={config?.prioritY_USE_PRICE_LIST}
              >
                <Radio
                  value={radioList[0]?.id}
                  checked={config?.prioritY_USE_PRICE_LIST === 0 ? true : false}
                >
                  {translate(radioList[0]?.name)}
                </Radio>
                <Radio
                  value={radioList[1]?.id}
                  checked={config?.prioritY_USE_PRICE_LIST === 1 ? true : false}
                >
                  {translate(radioList[1]?.name)}
                </Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
        <Row className="align-content-center pb-2 pt-3">
          <Col span={1}></Col>
          <Col className="pl-1" span={8}>
            <div className="text">
              {translate('systemConfigurations.priorityUsePromotion')}
            </div>
          </Col>
          <Col className="pl-1 ml-3 " span={3}>
            <div className="d-flex flex-end">
              <Radio.Group
                className="d-flex "
                onChange={handleChangeRadio2}
                defaultValue={config?.prioritY_USE_PROMOTION}
              >
                <Radio
                  value={radioList[0]?.id}
                  checked={config?.prioritY_USE_PROMOTION === 0 ? true : false}
                >
                  {translate(radioList[0]?.name)}
                </Radio>
                <Radio
                  value={radioList[1]?.id}
                  checked={config?.prioritY_USE_PROMOTION === 1 ? true : false}
                >
                  {translate(radioList[1]?.name)}
                </Radio>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default SystemConfigurationView;
