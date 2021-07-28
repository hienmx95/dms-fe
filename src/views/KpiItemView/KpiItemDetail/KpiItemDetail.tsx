import { Col, Input, Popconfirm, Row, Table } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_KPI_ITEM_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { KPI_ITEM_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiItem } from 'models/kpi/KpiItem';
import { KpiItemContent } from 'models/kpi/KpiItemContent';
import { KpiPeriod } from 'models/kpi/KpiPeriod';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import { KpiType } from 'models/kpi/KpiType';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { notification } from '../../../helpers/notification';
import { kpiItemRepository } from '../KpiItemRepository';
import { kpiItemService } from '../KpiItemService';
import AppUserModal from './AppUserModal/AppUserModal';
import KpiItemContentTable from './KpiItemContentTable/KpiItemContentTable';
import './KpiItemDetail.scss';

const { Item: FormItem } = Form;

function KpiItemDetail() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { validAction } = crudService.useAction('kpi-item', API_KPI_ITEM_ROUTE);

  // Service goback
  const [handleGoBack] = routerService.useGoBack(KPI_ITEM_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [kpiItem, setKpiItem, loading, , isDetail] = crudService.useDetail(
    KpiItem,
    kpiItemRepository.get,
    kpiItemRepository.save,
  );

  const [, handleChangeObjectField] = crudService.useChangeHandlers<KpiItem>(
    kpiItem,
    setKpiItem,
  );

  const [statusList] = crudService.useEnumList<Status>(
    kpiItemRepository.singleListStatus,
  );

  const [kpiPeriodFilter, setKpiPeriodFilter] = React.useState<KpiPeriodFilter>(
    new KpiPeriodFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );

  const [kpiItemTypeFilter, setKpiItemTypeFilter] = React.useState<
    StatusFilter
  >(new StatusFilter());

  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [currentKpiYear, setCurrentKpiYear] = React.useState<any>(null);
  const [, setCurrentKpiPeriod] = React.useState<any>(null);
  const [visible, setVisible] = React.useState<boolean>(true);
  const [filterAppUser, setFilterAppUser] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const {
    filter,
    setFilter,
    isOpen,
    handleSaveModal,
    handleCloseModal,
    handleOpenModal,
    handleDeleteSelectedUser,
    loadList,
    setLoadList,
  } = kpiItemService.useAppUserModal(
    kpiItem,
    setKpiItem,
    listAppUser,
    setListAppUser,
    setVisible,
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(listAppUser, filterAppUser, setFilterAppUser);
  React.useEffect(() => {
    if (isDetail === false) {
      kpiItemRepository.getDraft().then((item: KpiItem) => {
        setKpiItem({ ...item });
        setCurrentKpiYear(item.kpiYear);
        setCurrentKpiPeriod(item.kpiPeriod);
      });
    }
  }, [isDetail, setKpiItem]);

  const handleChangeOrganization = React.useCallback(
    (organizationId: number, organization: Organization) => {
      setKpiItem(
        KpiItem.clone<KpiItem>({
          ...kpiItem,
          organizationId,
          organization,
          errors: {
            ...kpiItem.errors,
            organization: null,
            organizationId: null,
          },
        }),
      );
      setListAppUser([]);
    },
    [kpiItem, setKpiItem],
  );
  const handleChangeKpiPeriod = React.useCallback(
    (kpiPeriodId: number, kpiPeriod: KpiPeriod) => {
      setKpiItem(
        KpiItem.clone<KpiItem>({
          ...kpiItem,
          kpiPeriodId,
          kpiPeriod,
          errors: {
            ...kpiItem.errors,
            kpiPeriodId: null,
            kpiPeriod: null,
          },
        }),
      );
      setCurrentKpiPeriod(kpiPeriod);
      setListAppUser([]);
    },
    [kpiItem, setKpiItem],
  );
  const handleChangeKpiYear = React.useCallback(
    (kpiYearId: number, kpiYear: KpiYear) => {
      setKpiItem(
        KpiItem.clone<KpiItem>({
          ...kpiItem,
          kpiYearId,
          kpiYear,
          errors: {
            ...kpiItem.errors,
            kpiYearId: null,
            kpiYear: null,
          },
        }),
      );
      setCurrentKpiYear(kpiYear);
      setListAppUser([]);
    },
    [kpiItem, setKpiItem],
  );
  const handleChangeKpiItemType = React.useCallback(
    (kpiItemTypeId: number, kpiItemType: KpiType) => {
      kpiItem.kpiItemContents = [];

      setKpiItem(
        KpiItem.clone<KpiItem>({
          ...kpiItem,
          kpiItemTypeId,
          kpiItemType,
          errors: {
            ...kpiItem.errors,
            kpiItemTypeId: null,
            kpiItemType: null,
          },
        }),
      );

      setListAppUser([]);
    },
    [kpiItem, setKpiItem],
  );
  const handleSave = React.useCallback(() => {
    if (kpiItem.kpiItemContents?.length > 0) {
      const contents = kpiItem?.kpiItemContents.map((item: KpiItemContent) =>
        tranformContent(item),
      );
      setKpiItem({ ...kpiItem, kpiItemContents: contents });
    }
    kpiItemRepository
      .save(kpiItem)
      .then(() => {
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
        history.goBack();
      })
      .catch((error: AxiosError<KpiItem>) => {
        if (error.response && error.response.status === 400) {
          setKpiItem(error.response?.data);
        }
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [history, kpiItem, setKpiItem, translate]);

  const columnAppUsers: ColumnProps<AppUser>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        ellipsis: true,
      },
      {
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
      },
      {
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        ellipsis: true,
      },
      {
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
      },
      {
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: 50,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="button-action-table">
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={handleDeleteSelectedUser(index)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-sm btn-link">
                  <i className="tio-delete_outlined" />
                </button>
              </Popconfirm>
            </div>
          );
        },
      },
    ],
    [dataSource, handleDeleteSelectedUser, pagination, translate],
  );

  return (
    <div className="page detail-page">
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
                {validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary float-right ml-2"
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
          <Form>
            <div className="title-detail">
              {translate('kpiItems.detail.general')}
            </div>
            <Row>
              <Col span={10}>
                {validAction('singleKpiItemType') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiItem>(
                      kpiItem.errors,
                      nameof(kpiItem.kpiItemType),
                    )}
                    help={kpiItem.errors?.kpiItemType}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiItems.kpiItemType')}
                      <span className="text-danger">*</span>
                    </span>

                    <SelectAutoComplete
                      value={kpiItem.kpiItemType?.id}
                      onChange={handleChangeKpiItemType}
                      getList={kpiItemRepository.singleKpiItemType}
                      modelFilter={kpiItemTypeFilter}
                      setModelFilter={setKpiItemTypeFilter}
                      searchField={nameof(kpiItemTypeFilter.name)}
                      searchType={nameof(kpiItemTypeFilter.name.contain)}
                      placeholder={translate(
                        'kpiItems.placeholder.kpiItemType',
                      )}
                      disabled={isDetail ? true : false}
                    />
                  </FormItem>
                )}
                {validAction('singleListOrganization') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiItem>(
                      kpiItem.errors,
                      nameof(kpiItem.organization),
                    )}
                    help={kpiItem.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiItems.organization')}
                      {!isDetail && <span className="text-danger">*</span>}
                    </span>
                    <TreeSelectDropdown
                      defaultValue={
                        kpiItem.organization
                          ? translate('kpiItems.placeholder.organization')
                          : kpiItem.organizationId
                      }
                      value={
                        kpiItem.organizationId === 0
                          ? null
                          : kpiItem.organizationId
                      }
                      mode="single"
                      onChange={handleChangeOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={kpiItemRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'kpiItems.placeholder.organization',
                      )}
                      disabled={isDetail ? true : false}
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<KpiItem>(
                    kpiItem.errors,
                    nameof(kpiItem.kpiPeriod),
                  )}
                  help={kpiItem.errors?.kpiPeriod}
                >
                  <span className="label-input ml-3">
                    {translate('kpiItems.kpiPeriod')}
                    {!isDetail && <span className="text-danger">*</span>}
                  </span>
                  {validAction('singleListKpiPeriod') && (
                    <SelectAutoComplete
                      value={kpiItem.kpiPeriod?.id}
                      onChange={handleChangeKpiPeriod}
                      getList={kpiItemRepository.singleListKpiPeriod}
                      modelFilter={kpiPeriodFilter}
                      setModelFilter={setKpiPeriodFilter}
                      searchField={nameof(kpiPeriodFilter.name)}
                      searchType={nameof(kpiPeriodFilter.name.contain)}
                      placeholder={translate('kpiItems.placeholder.kpiPeriod')}
                      disabled={isDetail ? true : false}
                    />
                  )}
                </FormItem>
                {!isDetail && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiItem>(
                      kpiItem.errors,
                      nameof(kpiItem.kpiYear),
                    )}
                    help={kpiItem.errors?.kpiYear}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiItems.kpiYear')}
                      {!isDetail && <span className="text-danger">*</span>}
                    </span>
                    {validAction('singleListKpiYear') && (
                      <SelectAutoComplete
                        value={kpiItem.kpiYear?.id}
                        onChange={handleChangeKpiYear}
                        getList={kpiItemRepository.singleListKpiYear}
                        modelFilter={kpiYearFilter}
                        setModelFilter={setKpiYearFilter}
                        searchField={nameof(kpiYearFilter.name)}
                        searchType={nameof(kpiYearFilter.name.contain)}
                        placeholder={translate('kpiItems.placeholder.kpiYear')}
                      />
                    )}
                  </FormItem>
                )}
                {validAction('singleListStatus') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiItem>(
                      kpiItem.errors,
                      nameof(kpiItem.status),
                    )}
                    help={kpiItem.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiItems.status')}
                    </span>
                    <Switch
                      checked={kpiItem.statusId === 1 ? true : false}
                      list={statusList}
                      onChange={handleChangeObjectField(nameof(kpiItem.status))}
                    />
                  </FormItem>
                )}
              </Col>
              {isDetail && (
                <>
                  <Col span={2} />
                  <Col span={11}>
                    {validAction('singleListAppUser') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          KpiItem
                        >(kpiItem.errors, nameof(kpiItem.employee))}
                        help={kpiItem.errors?.employee}
                      >
                        <span className="label-input ml-3">
                          {translate('kpiItems.saleEmployee')}
                        </span>
                        <Input
                          type="text"
                          value={kpiItem?.employee?.displayName}
                          className="form-control form-control-sm"
                          onChange={handleChangeObjectField(
                            nameof(kpiItem.employee),
                          )}
                          disabled
                        />
                      </FormItem>
                    )}
                    {validAction('singleListKpiYear') && (
                      <FormItem
                        validateStatus={formService.getValidationStatus<
                          KpiItem
                        >(kpiItem.errors, nameof(kpiItem.kpiYear))}
                        help={kpiItem.errors?.kpiYear}
                      >
                        <span className="label-input ml-3">
                          {translate('kpiItems.kpiYear')}
                          {!isDetail && <span className="text-danger">*</span>}
                        </span>

                        <SelectAutoComplete
                          value={kpiItem.kpiYear?.id}
                          onChange={handleChangeObjectField(
                            nameof(kpiItem.kpiYear),
                          )}
                          getList={kpiItemRepository.singleListKpiYear}
                          modelFilter={kpiYearFilter}
                          setModelFilter={setKpiYearFilter}
                          searchField={nameof(kpiYearFilter.name)}
                          searchType={nameof(kpiYearFilter.name.contain)}
                          placeholder={translate(
                            'kpiItems.placeholder.kpiYear',
                          )}
                          disabled={true}
                        />
                      </FormItem>
                    )}
                  </Col>
                </>
              )}

              {!isDetail && (
                <>
                  <Col span={1} />
                  <Col lg={12}>
                    <div className="header-title-table d-flex justify-content-between mb-3">
                      <div className="mt-3">
                        {translate('kpiItems.detail.employee')}
                        <span className="text-danger">*</span>
                      </div>
                      {validAction('listAppUser') && (
                        <button
                          onClick={handleOpenModal}
                          className="btn btn-sm btn-primary mr-2 mt-3"
                          disabled={
                            !kpiItem.organization ||
                            !kpiItem.kpiPeriod ||
                            !kpiItem.kpiYear ||
                            !kpiItem.kpiItemType
                          }
                        >
                          <i className="fa mr-2 fa-plus" />
                          {translate('kpiItems.addAppUser')}
                        </button>
                      )}
                    </div>

                    {/* HIển thị danh sách user đã chọn */}
                    <div className="table-app-user">
                      <Table
                        className="content-app-user"
                        key={listAppUser[0]?.id}
                        dataSource={listAppUser}
                        columns={columnAppUsers}
                        size="small"
                        tableLayout="fixed"
                        loading={loading}
                        rowKey={nameof(listAppUser[0].id)}
                        pagination={pagination}
                        onChange={handleTableChange}
                      />
                      {!kpiItem?.employeeIds && (
                        <FormItem
                          validateStatus={formService.getValidationStatus<
                            KpiItem
                          >(kpiItem.errors, nameof(kpiItem.employeeIds))}
                          help={kpiItem.errors?.employeeIds}
                          className="validate-employee"
                        />
                      )}
                    </div>

                    <AppUserModal
                      title={translate('kpiGenerals.master.appUser.title')}
                      filter={filter}
                      setFilter={setFilter}
                      selectedList={listAppUser}
                      setSelectedList={setListAppUser}
                      isOpen={isOpen}
                      onClose={handleCloseModal}
                      onSave={handleSaveModal}
                      currentKpiYear={currentKpiYear}
                      loadList={loadList}
                      setloadList={setLoadList}
                      visible={visible}
                      setVisible={setVisible}
                    />
                  </Col>
                  <Col span={1} />
                </>
              )}
            </Row>
          </Form>
        </Card>
        <Card className="mt-3">
          <div className="title-detail pt-2 mb-2">
            {translate('kpiItems.detail.kpiItem')}
          </div>
          <KpiItemContentTable
            model={kpiItem}
            setModel={setKpiItem}
            field={nameof(kpiItem.kpiItemContents)}
          />
          {!kpiItem?.kpiItemContents && (
            <>
              <FormItem
                validateStatus={formService.getValidationStatus<KpiItem>(
                  kpiItem.errors,
                  nameof(kpiItem.kpiItemContents),
                )}
                help={kpiItem.errors?.kpiItemContents}
                className="validate-item"
              />
            </>
          )}
          <FormItem
            validateStatus={formService.getValidationStatus<KpiItem>(
              kpiItem.errors,
              nameof(kpiItem.id),
            )}
            help={kpiItem.errors?.id}
            className="validate-item"
          />
          <div className="d-flex justify-content-end mt-4">
            {validAction('update') && (
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
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

function tranformContent(content: KpiItemContent) {
  const mapping = {};
  Object.keys(content).forEach(key => {
    switch (key) {
      case 'indirectQuantity': {
        mapping['1'] = content.indirectQuantity;
        return;
      }
      case 'indirectRevenue': {
        mapping['2'] = content.indirectRevenue;
        return;
      }
      case 'indirectAmount': {
        mapping['3'] = content.indirectAmount;
        return;
      }
      case 'indirectStore': {
        mapping['4'] = content.indirectStore;
        return;
      }
      case 'directQuantity': {
        mapping['5'] = content.directQuantity;
        return;
      }
      case 'directRevenue': {
        mapping['6'] = content.directRevenue;
        return;
      }
      case 'directAmount': {
        mapping['7'] = content.directAmount;
        return;
      }

      case 'directStore': {
        mapping['8'] = content.directStore;
        return;
      }
    }
  });
  content.kpiItemContentKpiCriteriaItemMappings = mapping;
  return content;
}

export default KpiItemDetail;
