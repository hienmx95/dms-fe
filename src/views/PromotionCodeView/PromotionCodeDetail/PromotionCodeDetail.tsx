import { Col, Input, Radio, Row } from 'antd';
import Card from 'antd/lib/card';
import DatePicker from 'antd/lib/date-picker';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import InputNumber from 'components/InputNumber/InputNumber';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { STANDARD_DATE_FORMAT_INVERSE } from 'core/config';
import { formatInputDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeOrganizationMapping } from 'models/PromotionCodeOrganizationMapping';
import { PromotionDiscountType } from 'models/PromotionDiscountType';
import { PromotionProductAppliedType } from 'models/PromotionProductAppliedType';
import { PromotionType } from 'models/PromotionType';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { promotionCodeRepository } from 'views/PromotionCodeView/PromotionCodeRepository';
import './PromotionCodeDetail.scss';
import PromotionProductMappingTable from './PromotionType/PromotionProductMappingTable';
import PromotionStoreMappingTable from './PromotionType/PromotionStoreMappingTable';
import PromotionTypeOrganizationMapping from './PromotionType/PromotionTypeOrganizationMapping';



const { Item: FormItem } = Form;

function PromotionCodeDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    promotionCode,
    setPromotionCode,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    PromotionCode,
    promotionCodeRepository.get,
    promotionCodeRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleChangeDateField,
  ] = crudService.useChangeHandlers<PromotionCode>(
    promotionCode,
    setPromotionCode,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [promotionDiscountTypeList] = crudService.useEnumList<
    PromotionDiscountType
  >(promotionCodeRepository.singleListPromotionDiscountType);

  const [promotionProductAppliedTypeList] = crudService.useEnumList<
    PromotionProductAppliedType
  >(promotionCodeRepository.singleListPromotionProductAppliedType);

  const [promotionTypeList] = crudService.useEnumList<PromotionType>(
    promotionCodeRepository.singleListPromotionType,
  );

  const [statusList] = crudService.useEnumList<Status>(
    promotionCodeRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  // const [
  //   promotionProductAppliedTypeFilter,
  //   setPromotionProductAppliedTypeFilter,
  // ] = React.useState<PromotionProductAppliedTypeFilter>(
  //   new PromotionProductAppliedTypeFilter(),
  // );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  // const defaultOrganizationList: Organization[] = crudService.useDefaultList<
  //   Organization
  // >(promotionCode.organization);

  const [valueType1, setValueType1] = React.useState<number>();
  const [valueType2, setValueType2] = React.useState<number>();
  const [listPromotionCodeOrganizationMappings, setListPromotionCodeOrganizationMappings] = React.useState<PromotionCodeOrganizationMapping[]>([]);

  React.useEffect(() => {
    if (promotionCode && promotionCode?.value) {
      if (promotionCode?.promotionDiscountTypeId === 2) {
        setValueType1(promotionCode?.value);
      }
      if (promotionCode?.promotionDiscountTypeId === 1) {
        setValueType2(promotionCode?.value);
      }
    }
    if (promotionCode && promotionCode?.organization) {
      const orgFilter = new OrganizationFilter();
      orgFilter.path.startWith = promotionCode?.organization?.path.toString();
      promotionCodeRepository.singleListOrganization(orgFilter).then(res => {
        setListPromotionCodeOrganizationMappings(res);

      });
    }
  }, [setValueType1, setValueType2, promotionCode]);


  const handleChangeDiscountType = React.useCallback(
    event => {
      const promotionDiscountTypeId: number = event.target.value;
      setPromotionCode({
        ...promotionCode,
        promotionDiscountTypeId,
        value: undefined,
        maxValue: undefined,
      });
      setValueType1(undefined);
      setValueType2(undefined);
    },
    [promotionCode, setPromotionCode],
  );

  const handleChangePromotionType = React.useCallback(
    event => {
      const promotionTypeId: number = event.target.value;
      setPromotionCode({
        ...promotionCode,
        promotionTypeId,
        promotionCodeStoreMappings: [],
      });
    },
    [promotionCode, setPromotionCode],
  );

  const handleChangePromotionProductApplied = React.useCallback((event) => {
    const promotionProductAppliedTypeId: number = event.target.value;
    setPromotionCode({
      ...promotionCode,
      promotionProductAppliedTypeId,
      promotionCodeProductMappings: [],
    });
  }, [setPromotionCode, promotionCode]);

  const handleChangeValue = React.useCallback((event) => {
    if (promotionCode?.promotionDiscountTypeId === 2) {
      setValueType1(event);
      setValueType2(undefined);
    }
    if (promotionCode?.promotionDiscountTypeId === 1) {
      setValueType2(event);
      setValueType1(undefined);
    }
    setPromotionCode({
      ...promotionCode,
      value: event,
    });
  }, [setValueType2, setValueType1, promotionCode, setPromotionCode]);

  const handleChangeOrganization = React.useCallback((organizationId, organization) => {
    const orgFilter = new OrganizationFilter();
    orgFilter.path.startWith = organization?.path;
    promotionCodeRepository.singleListOrganization(orgFilter).then(res => {
      setListPromotionCodeOrganizationMappings(res);

    });
    setPromotionCode({
      ...promotionCode,
      organizationId,
      organization,
    });
  }, [setPromotionCode, promotionCode, setListPromotionCodeOrganizationMappings]);

  return (
    <div className="page detail-page promotion-code-detail">
      <Spin spinning={loading}>
        <Card
          className="short header-detail"
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('promotionCodes.detail.title')
                : translate(generalLanguageKeys.actions.create)}
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
            </>
          }
        ></Card>
        <Form>
          <div className="flex-container flex-row">
            <div className="flex-item mr-3">
              <Card title={
                <div className="ml-3">{translate('promotionCodes.general.title')}</div>
              } className="pb-3 card-general">
                <Row>
                  <Col lg={8}>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.code')} <span className="text-danger">*</span></>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.code))}
                      help={promotionCode.errors?.code}
                      labelAlign="left"
                    >
                      <Input
                        value={promotionCode.code}
                        onChange={handleChangeSimpleField(
                          nameof(promotionCode.code),
                        )}
                        placeholder={translate('promotionCodes.placeholder.code')}
                        disabled={promotionCode.used}
                      />
                    </FormItem>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.organization')} <span className="text-danger">*</span></>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(
                        promotionCode.errors,
                        nameof(promotionCode.organizationId),
                      )}
                      help={promotionCode.errors?.organizationId}
                    >
                      <TreeSelectDropdown
                        defaultValue={promotionCode.organization?.id}
                        value={promotionCode.organization?.id}
                        mode="single"
                        onChange={handleChangeOrganization}
                        modelFilter={organizationFilter}
                        setModelFilter={setOrganizationFilter}
                        getList={promotionCodeRepository.singleListOrganization}
                        searchField={nameof(organizationFilter.id)}
                        placeholder={translate('promotionCodes.placeholder.organization')}
                        disabled={promotionCode.used}
                      />
                    </FormItem>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.startDate')} <span className="text-danger">*</span></>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.startDate))}
                      help={promotionCode.errors?.startDate}
                    >
                      <DatePicker
                        value={formatInputDate(promotionCode.startDate)}
                        onChange={handleChangeDateField(
                          nameof(promotionCode.startDate),
                        )}
                        placeholder={translate('promotionCodes.placeholder.startDate')}
                        className="w-100"
                        format={STANDARD_DATE_FORMAT_INVERSE}
                        disabled={promotionCode.used}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8}>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.name')} <span className="text-danger">*</span></>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.name))}
                      help={promotionCode.errors?.name}
                      labelAlign="left"
                    >
                      <Input
                        value={promotionCode.name}
                        onChange={handleChangeSimpleField(
                          nameof(promotionCode.name),
                        )}
                        placeholder={translate('promotionCodes.placeholder.name')}
                      />
                    </FormItem>

                    <FormItem
                      label={
                        <>{translate('promotionCodes.quantity')} </>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.quantity))}
                      help={promotionCode.errors?.quantity}
                    >
                      <InputNumber
                        className="form-control form-control-sm"
                        value={promotionCode.quantity}
                        onChange={handleChangeSimpleField(
                          nameof(promotionCode.quantity),
                        )}
                        min={0}
                        disabled={promotionCode.used}
                        placeholder={translate('promotionCodes.placeholder.quantity')}
                      />
                    </FormItem>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.endDate')}</>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.endDate))}
                      help={promotionCode.errors?.endDate}
                    >
                      <DatePicker
                        value={formatInputDate(promotionCode.endDate)}
                        onChange={handleChangeDateField(
                          nameof(promotionCode.endDate),
                        )}
                        placeholder={translate('promotionCodes.placeholder.endDate')}
                        className="w-100"
                        format={STANDARD_DATE_FORMAT_INVERSE}
                        disabled={promotionCode.used}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={8}>
                    <FormItem
                      label={
                        <>{translate('promotionCodes.status')}</>
                      }
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(promotionCode.errors, nameof(promotionCode.status))}
                      help={promotionCode.errors?.status}
                    >
                      <SwitchStatus
                        checked={promotionCode.statusId === statusList[1]?.id}
                        list={statusList}
                        onChange={handleChangeObjectField(
                          nameof(promotionCode.status),
                        )}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Row className="mt-3">
                    <span className="label-input ml-2">
                      {translate('promotionCodes.promotionDiscountType')}
                      <span className="text-danger">*</span>
                    </span>
                  </Row>

                  <Col lg={6} className="pb-3">
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        PromotionCode
                      >(
                        promotionCode.errors,
                        nameof(promotionCode.promotionDiscountType),
                      )}
                      help={promotionCode.errors?.promotionDiscountType}
                      className="promotion-discount-type"
                    >
                      <Radio.Group
                        onChange={handleChangeDiscountType}
                        defaultValue={promotionCode.promotionDiscountTypeId}
                        className="ml-3"
                        disabled={promotionCode.used}
                      >
                        <Radio
                          className="mt-4"
                          value={promotionDiscountTypeList[1]?.id}
                          checked={
                            promotionCode.promotionDiscountTypeId === 2
                              ? true
                              : false
                          }
                        >
                          {promotionDiscountTypeList[1]?.name}
                        </Radio>
                        <Radio
                          className="mt-3"
                          value={promotionDiscountTypeList[0]?.id}
                          checked={
                            promotionCode.promotionDiscountTypeId === 1
                              ? true
                              : false
                          }
                        >
                          {promotionDiscountTypeList[0]?.name}
                        </Radio>

                      </Radio.Group>
                    </FormItem>
                  </Col>
                  <Col lg={12} className="col-value">
                    <div className="mt-3 d-flex align-items-center">
                      <InputNumber
                        className="form-control form-control-sm mr-2"
                        value={valueType1}
                        onChange={handleChangeValue}
                        disabled={
                          !promotionCode.promotionDiscountTypeId ||
                          promotionCode.promotionDiscountTypeId === 1 ||
                          promotionCode.used
                        }
                        placeholder={translate('promotionCodes.placeholder.value')}
                        min={0}
                      />
                      VND
                    </div>

                    <div className="d-flex">
                      <div className="d-flex mt-2">
                        <InputNumber
                          className="form-control form-control-sm input-first"
                          value={valueType2}
                          onChange={handleChangeValue}
                          disabled={
                            !promotionCode.promotionDiscountTypeId ||
                            promotionCode.promotionDiscountTypeId === 2 ||
                            promotionCode.used
                          }
                          placeholder={translate('promotionCodes.placeholder.percent')}
                          allowNegative={false}
                          min={0}
                          max={100}
                          maximumDecimalCount={2}
                        />
                      </div>
                      <div className="d-flex mt-2 ml-3 align-items-center flex-grow-1">
                        <InputNumber
                          className="form-control form-control-sm mr-2"
                          value={promotionCode.maxValue}
                          onChange={handleChangeSimpleField(
                            nameof(promotionCode.maxValue),
                          )}
                          disabled={
                            !promotionCode.promotionDiscountTypeId ||
                            promotionCode.promotionDiscountTypeId === 2 ||
                            promotionCode.used
                          }
                          placeholder={translate('promotionCodes.placeholder.maxValue')}
                          min={0}
                        />
                        VND
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="flex-item">
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
                    onChange={handleChangePromotionType}
                    defaultValue={promotionCode.promotionTypeId}
                    className="ml-3"
                    disabled={promotionCode.used}
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
                    <PromotionTypeOrganizationMapping disabled={promotionCode && promotionCode?.used ? true : false} model={promotionCode} setModel={setPromotionCode} listDefault={listPromotionCodeOrganizationMappings} />
                  )
                }
                {
                  promotionCode?.promotionTypeId === 3 && (
                    <PromotionStoreMappingTable model={promotionCode} setModel={setPromotionCode} />
                  )
                }
              </Card>
              <Card className="card-bottom mt-3" title={
                <div className="ml-3">{translate('promotionCodes.product.title')}</div>
              }>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    PromotionCode
                  >(promotionCode.errors, nameof(promotionCode.promotionProductAppliedType))}
                  help={promotionCode.errors?.promotionProductAppliedType}

                >
                  <Radio.Group
                    onChange={handleChangePromotionProductApplied}
                    defaultValue={promotionCode.promotionProductAppliedTypeId}
                    className="ml-3"
                    disabled={promotionCode.used}
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
                    <PromotionProductMappingTable model={promotionCode} setModel={setPromotionCode} />
                  )
                }
              </Card>
            </div>
          </div>
        </Form>
      </Spin>
    </div>
  );
}

export default PromotionCodeDetail;
