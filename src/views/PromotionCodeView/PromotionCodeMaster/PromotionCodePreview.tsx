import { Radio } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Spin from 'antd/lib/spin';
import SwitchStatus from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { PROMOTION_CODE_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { crudService, formService, routerService } from 'core/services';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeOrganizationMapping } from 'models/PromotionCodeOrganizationMapping';
import { PromotionProductAppliedType } from 'models/PromotionProductAppliedType';
import { PromotionType } from 'models/PromotionType';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import '../PromotionCodeDetail/PromotionCodeDetail.scss';
import PromotionCodeHistoriesTable from '../PromotionCodeDetail/PromotionType/PromotionCodeHistoriesTable';
import PromotionProductMappingTable from '../PromotionCodeDetail/PromotionType/PromotionProductMappingTable';
import PromotionCodeStoreMappingTable from '../PromotionCodeDetail/PromotionType/PromotionStoreMappingTable';
import PromotionTypeOrganizationMapping from '../PromotionCodeDetail/PromotionType/PromotionTypeOrganizationMapping';
import { promotionCodeRepository } from '../PromotionCodeRepository';

const { Item: FormItem } = Form;

function PromotionCodePreview() {
  const [translate] = useTranslation();
  const [handleGoBack] = routerService.useGoBack(PROMOTION_CODE_ROUTE);
  const [
    promotionCode,
    setPromotionCode,
    loading,
    ,
    isDetail,
  ] = crudService.useDetail(
    PromotionCode,
    promotionCodeRepository.get,
    promotionCodeRepository.save,
  );
  const [
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<PromotionCode>(
    promotionCode,
    setPromotionCode,
  );
  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    promotionCodeRepository.singleListStatus,
  );

  const [promotionTypeList] = crudService.useEnumList<PromotionType>(
    promotionCodeRepository.singleListPromotionType,
  );

  const [promotionProductAppliedTypeList] = crudService.useEnumList<
    PromotionProductAppliedType
  >(promotionCodeRepository.singleListPromotionProductAppliedType);


  const [listPromotionCodeOrganizationMappings, setListPromotionCodeOrganizationMappings] = React.useState<PromotionCodeOrganizationMapping[]>([]);
  React.useEffect(() => {

    if (promotionCode && promotionCode?.organization) {
      const orgFilter = new OrganizationFilter();
      orgFilter.path.startWith = promotionCode?.organization?.path.toString();
      promotionCodeRepository.singleListOrganization2(orgFilter).then(res => {
        setListPromotionCodeOrganizationMappings(res);
      });
    }
  }, [promotionCode]);

  return (
    <div className="page detail-page promotion-code-detail promotion-code-preview">
      <Spin spinning={loading}>
        <Card
          className="short"
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
              </div>
            </div>
          }
        >
          <Form>
            <div className="title-detail mt-2">
              {translate('promotionCodes.detail.title')}
            </div>
            <Row>
              <Col lg={2}></Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.code))}
                  help={promotionCode.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.code')}
                  </span>
                  {promotionCode?.code}
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.organizationId))}
                  help={promotionCode.errors?.organizationId}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.organization')}
                  </span>
                  {promotionCode?.organization?.name}
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(
                    promotionCode.errors,
                    nameof(promotionCode.startDate),
                  )}
                  help={promotionCode.errors?.startDate}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.startDate')}
                  </span>
                  {formatDate(promotionCode?.startDate)}
                  <span className="pr-2 pl-2"> đến </span>
                  {formatDate(promotionCode?.endDate)}
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(
                    promotionCode.errors,
                    nameof(promotionCode.promotionDiscountType),
                  )}
                  help={promotionCode.errors?.promotionDiscountType}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.promotionDiscountType')}
                  </span>
                  {promotionCode?.promotionDiscountType?.name} -
                  {
                    promotionCode.promotionDiscountTypeId === 1 && promotionCode.value && <span className="pr-2 pl-2">{promotionCode?.value}%  - {promotionCode?.maxValue}</span>
                  }
                  {
                    promotionCode.promotionDiscountTypeId === 2 && promotionCode.value && <span className="pr-2 pl-2">{promotionCode?.value}</span>
                  }

                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={8}>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.name))}
                  help={promotionCode.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.name')}
                  </span>
                  {promotionCode?.name}
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.quantity))}
                  help={promotionCode.errors?.quantity}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.quantity')}
                  </span>
                  {formatNumber(promotionCode?.quantity)}
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.salesOrderApplied))}
                  help={promotionCode.errors?.salesOrderApplied}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.salesOrderApplied')}
                  </span>
                  {formatNumber(promotionCode?.salesOrderApplied)}
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(
                    promotionCode.errors,
                    nameof(promotionCode.status),
                  )}
                  help={promotionCode.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('promotionCodes.status')}
                  </span>
                  <SwitchStatus
                    checked={promotionCode.statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(promotionCode.status),
                    )}
                    disabled
                  />
                </FormItem>
              </Col>
            </Row>

          </Form>
        </Card>
        <div className="flex-container flex-row">
          <div className="flex-item mr-3">
            <Card
              className="card-top"
              title={
                <div className="ml-3">{translate('promotionCodes.store.title')}</div>
              }
            >
              <FormItem
                validateStatus={formService.getValidationStatus<
                  PromotionCode
                >(promotionCode.errors, nameof(promotionCode.promotionType))}
                help={promotionCode.errors?.promotionType}
              >
                <Radio.Group
                  defaultValue={promotionCode.promotionTypeId}
                  className="ml-3"
                  disabled
                >
                  <Radio
                    className="mt-3"
                    value={promotionTypeList[0]?.id}
                    checked={promotionCode.promotionTypeId === 1}
                  >
                    {promotionTypeList[0]?.name}
                  </Radio>
                  <Radio
                    className="mt-4"
                    value={promotionTypeList[1]?.id}
                    checked={promotionCode.promotionTypeId === 2}
                  >
                    {promotionTypeList[1]?.name}
                  </Radio>
                  <Radio
                    className="mt-4"
                    value={promotionTypeList[2]?.id}
                    checked={promotionCode.promotionTypeId === 3}
                  >
                    {promotionTypeList[2]?.name}
                  </Radio>
                </Radio.Group>
              </FormItem>
              {
                promotionCode?.promotionTypeId === 2 && (
                  <PromotionTypeOrganizationMapping disabled={true} model={promotionCode} setModel={setPromotionCode} isPreview={true} listDefault={listPromotionCodeOrganizationMappings} />
                )
              }
              {
                promotionCode?.promotionTypeId === 3 && (
                  <PromotionCodeStoreMappingTable model={promotionCode} setModel={setPromotionCode} isPreview={true} />
                )
              }
            </Card>
          </div>
          <div className="flex-item">
            <Card className="card-bottom" title={
              <div className="ml-3">{translate('promotionCodes.product.title')}</div>
            }>
              <FormItem
                validateStatus={formService.getValidationStatus<
                  PromotionCode
                >(promotionCode.errors, nameof(promotionCode.promotionProductAppliedType))}
                help={promotionCode.errors?.promotionProductAppliedType}
              >
                <Radio.Group
                  defaultValue={promotionCode.promotionProductAppliedTypeId}
                  className="ml-3"
                  disabled
                >
                  <Radio
                    className="mt-3"
                    value={promotionProductAppliedTypeList[0]?.id}
                    checked={promotionCode.promotionProductAppliedTypeId === 1}
                  >
                    {promotionProductAppliedTypeList[0]?.name}
                  </Radio>
                  <Radio
                    className="mt-4"
                    value={promotionProductAppliedTypeList[1]?.id}
                    checked={promotionCode.promotionProductAppliedTypeId === 2}
                  >
                    {promotionProductAppliedTypeList[1]?.name}
                  </Radio>
                </Radio.Group>
              </FormItem>
              {
                promotionCode?.promotionProductAppliedTypeId === 2 && (
                  <PromotionProductMappingTable model={promotionCode} setModel={setPromotionCode} isPreview={true} />
                )
              }
            </Card>
          </div>
        </div>
        <div className="flex-container">
          <Card className="mt-3" title={
            <div className="ml-3">{translate('promotionCodes.historiesTable.title')}</div>
          }>
            <PromotionCodeHistoriesTable model={promotionCode} setModel={setPromotionCode} />
          </Card>
        </div>
      </Spin>
    </div>
  );
}


export default PromotionCodePreview;
