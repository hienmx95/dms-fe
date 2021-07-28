import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_PROMOTION_CODE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import {
  PROMOTION_CODE_DETAIL_ROUTE,
  PROMOTION_CODE_PREVIEW_ROUTE,
} from 'config/route-consts';
import { DateFilter } from 'core/filters';
import { formatDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeFilter } from 'models/PromotionCodeFilter';
import { PromotionDiscountType } from 'models/PromotionDiscountType';
import { PromotionDiscountTypeFilter } from 'models/PromotionDiscountTypeFilter';
import { PromotionProductAppliedType } from 'models/PromotionProductAppliedType';
import { PromotionProductAppliedTypeFilter } from 'models/PromotionProductAppliedTypeFilter';
import { PromotionType } from 'models/PromotionType';
import { PromotionTypeFilter } from 'models/PromotionTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { promotionCodeRepository } from 'views/PromotionCodeView/PromotionCodeRepository';
import './PromotionCodeMaster.scss';

const { Item: FormItem } = Form;

function PromotionCodeMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const { validAction } = crudService.useAction(
    'promotion-code',
    API_PROMOTION_CODE_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    ,
    ,
    ,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<PromotionCode, PromotionCodeFilter>(
    PromotionCode,
    PromotionCodeFilter,
    promotionCodeRepository.count,
    promotionCodeRepository.list,
    promotionCodeRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    PROMOTION_CODE_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );


  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [
    promotionDiscountTypeFilter,
    setPromotionDiscountTypeFilter,
  ] = React.useState<PromotionDiscountTypeFilter>(
    new PromotionDiscountTypeFilter(),
  );

  const [
    promotionProductAppliedTypeFilter,
    setPromotionProductAppliedTypeFilter,
  ] = React.useState<PromotionProductAppliedTypeFilter>(
    new PromotionProductAppliedTypeFilter(),
  );

  const [promotionTypeFilter, setPromotionTypeFilter] = React.useState<
    PromotionTypeFilter
  >(new PromotionTypeFilter());

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<PromotionCode>(
    promotionCodeRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );

  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const handleGoPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(PROMOTION_CODE_PREVIEW_ROUTE, `${id}`));
    },
    [history],
  );

  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setDateFilter(new DateFilter());
  }, [handleReset]);

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'startDate') {
          filter.startDate.lessEqual = f.lessEqual;
          filter.startDate.greaterEqual = undefined;
          filter.endDate.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const columns: ColumnProps<PromotionCode>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<PromotionCode>(pagination),
        },
        {
          title: translate('promotionCodes.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('promotionCodes.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].name),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('promotionCodes.promotionDiscountType'),
          key: nameof(list[0].promotionDiscountType),
          dataIndex: nameof(list[0].promotionDiscountType),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].promotionDiscountType),
            sorter,
          ),
          render(promotionDiscountType: PromotionDiscountType) {
            return promotionDiscountType?.name;
          },
        },
        {
          title: translate('promotionCodes.time'),
          key: nameof(list[0].startDate),
          dataIndex: nameof(list[0].startDate),
          render(...[startDate, content]) {
            return (
              <>{startDate && formatDate(startDate)} {content?.endDate && (<>đến {formatDate(content?.endDate)}</>)}</>
            );
          },
        },
        {
          title: translate('promotionCodes.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('promotionCodes.promotionType'),
          key: nameof(list[0].promotionType),
          dataIndex: nameof(list[0].promotionType),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].promotionType),
            sorter,
          ),
          render(promotionType: PromotionType) {
            return promotionType?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('promotionCodes.promotionProductAppliedType'),
          key: nameof(list[0].promotionProductAppliedType),
          dataIndex: nameof(list[0].promotionProductAppliedType),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].promotionProductAppliedType),
            sorter,
          ),
          render(promotionProductAppliedType: PromotionProductAppliedType) {
            return promotionProductAppliedType?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('promotionCodes.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<PromotionCode>(
            nameof(list[0].status),
            sorter,
          ),
          align: 'center',
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, promotionCode: PromotionCode) {
            return (
              <div className="d-flex justify-content-center">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}

                {validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
                {!promotionCode.used && validAction('delete') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(promotionCode)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleGoPreview,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card
        title={translate('promotionCodes.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('promotionCodes.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('promotionCodes.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('promotionCodes.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('promotionCodes.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('promotionCodes.time')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.startDate))}
                    placeholder={[
                      translate('eRoutes.placeholder.startDate'),
                      translate('eRoutes.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {validAction('filterListPromotionDiscountType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.promotionDiscountType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.promotionDiscountTypeId}
                      filterType={nameof(filter.promotionDiscountTypeId.equal)}
                      value={filter.promotionDiscountTypeId.equal}
                      onChange={handleFilter(
                        nameof(filter.promotionDiscountTypeId),
                      )}
                      modelFilter={promotionDiscountTypeFilter}
                      setModelFilter={setPromotionDiscountTypeFilter}
                      getList={
                        promotionCodeRepository.filterListPromotionDiscountType
                      }
                      searchField={nameof(promotionDiscountTypeFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('singleListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={promotionCodeRepository.filterListOrganization}
                      searchField={nameof(organizationFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}

              {validAction('singleListPromotionProductAppliedType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.promotionProductAppliedType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.promotionProductAppliedTypeId}
                      filterType={nameof(
                        filter.promotionProductAppliedTypeId.equal,
                      )}
                      value={filter.promotionProductAppliedTypeId.equal}
                      onChange={handleFilter(
                        nameof(filter.promotionProductAppliedTypeId),
                      )}
                      modelFilter={promotionProductAppliedTypeFilter}
                      setModelFilter={setPromotionProductAppliedTypeFilter}
                      getList={
                        promotionCodeRepository.singleListPromotionProductAppliedType
                      }
                      searchField={nameof(promotionProductAppliedTypeFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}

              {validAction('singleListPromotionType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.promotionType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.promotionTypeId}
                      filterType={nameof(filter.promotionTypeId.equal)}
                      value={filter.promotionTypeId.equal}
                      onChange={handleFilter(nameof(filter.promotionTypeId))}
                      modelFilter={promotionTypeFilter}
                      setModelFilter={setPromotionTypeFilter}
                      getList={promotionCodeRepository.singleListPromotionType}
                      searchField={nameof(promotionTypeFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}

              {validAction('singleListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('promotionCodes.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      getList={promotionCodeRepository.singleListStatus}
                      searchField={nameof(statusFilter.name)}
                      placeholder={translate('general.placeholder.title')}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleResetFilter}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}

          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey={nameof(list[0].id)}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  )}

                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
      </Card>

    </div>
  );
}

export default PromotionCodeMaster;
