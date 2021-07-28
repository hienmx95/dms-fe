import { Card, Col, Form, Input, Row, Spin, Table, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { ColumnProps } from 'antd/lib/table';
import Tabs from 'antd/lib/tabs';
import { AxiosError } from 'axios';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import Switch from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService, routerService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { KpiGeneral } from 'models/kpi/KpiGeneral';
import { KpiGeneralContent } from 'models/kpi/KpiGeneralContent';
import { KpiYear } from 'models/kpi/KpiYear';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import AppUserModal from 'views/KpiGeneralView/KpiGeneralDetail/AppUserModal/AppUserModal';
import { notification } from '../../../helpers/notification';
import { kpiGeneralRepository } from '../KpiGeneralRepository';
import { kpiGenralService } from '../KpiGeneralService';
import KpiGeneralContentTable from './KpiGeneralContentTable/KpiGeneralContentTable';
import './KpiGeneralDetail.scss';
import { AppUserFilter } from 'models/AppUserFilter';
import { API_KPI_GENERAL_ROUTE } from 'config/api-consts';
import { KPI_GENERAL_ROUTE } from 'config/route-consts';

const { TabPane } = Tabs;

function KpiGeneralDetail() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { validAction } = crudService.useAction(
    'kpi-general',
    API_KPI_GENERAL_ROUTE,
  );
  // Service goback
  const [handleGoBack] = routerService.useGoBack(KPI_GENERAL_ROUTE);

  // Hooks, useDetail, useChangeHandler
  const [
    kpiGeneral,
    setKpiGeneral,
    loading,
    ,
    isDetail,
  ] = crudService.useDetail(
    KpiGeneral,
    kpiGeneralRepository.get,
    kpiGeneralRepository.save,
  );

  const [, handleChangeObjectField] = crudService.useChangeHandlers<KpiGeneral>(
    kpiGeneral,
    setKpiGeneral,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [kpiYearFilter, setKpiYearFilter] = React.useState<KpiYearFilter>(
    new KpiYearFilter(),
  );

  const [statusList] = crudService.useEnumList<Status>(
    kpiGeneralRepository.singleListStatus,
  );

  // Default modal

  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [currentOrg, setCurrentOrg] = React.useState<any>(null);

  const [currentKpiYear, setCurrentKpiYear] = React.useState<any>(null);

  const [visible, setVisible] = React.useState<boolean>(true);

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
  } = kpiGenralService.useAppUserModal(
    kpiGeneral,
    setKpiGeneral,
    listAppUser,
    setListAppUser,
    currentOrg,
    currentKpiYear,
    setVisible,
  );

  const [filterAppUser, setFilterAppUser] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(listAppUser, filterAppUser, setFilterAppUser);

  const [changeKpiYear, setChangeKpiYear] = React.useState<boolean>(true);

  const handleSave = React.useCallback(() => {
    if (kpiGeneral.kpiGeneralContents?.length > 0) {
      const contents = kpiGeneral?.kpiGeneralContents.map(
        (item: KpiGeneralContent) => tranformContent(item),
      );
      setKpiGeneral({ ...kpiGeneral, kpiGeneralContents: contents });
    }
    kpiGeneralRepository
      .save(kpiGeneral)
      .then(() => {
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
        history.goBack();
      })
      .catch((error: AxiosError<KpiGeneral>) => {
        if (error.response && error.response.status === 400) {
          setKpiGeneral(error.response?.data);
        }
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [history, kpiGeneral, setKpiGeneral, translate]);

  React.useEffect(() => {
    if (isDetail === false && changeKpiYear) {
      if (
        typeof kpiGeneral.kpiYearId === 'undefined' ||
        kpiGeneral.kpiYearId === null
      ) {
        kpiGeneral.kpiYearId = Number(moment().format('YYYY'));
      }
      kpiGeneralRepository
        .getDraft(kpiGeneral)
        .then((item: KpiGeneral) => {
          setKpiGeneral({ ...item });
          setCurrentKpiYear(item.kpiYear);
        });
      setChangeKpiYear(false);

    }
  }, [isDetail, kpiGeneral, setKpiGeneral, changeKpiYear]);

  const handleChangeOrganization = React.useCallback(
    (organizationId: number, organization: Organization) => {
      setCurrentOrg(organization);
      const errors = kpiGeneral.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.organization = null;
      }
      setKpiGeneral({
        ...kpiGeneral,
        organizationId,
        organization,
        errors,
      });
      setListAppUser([]);
    },
    [kpiGeneral, setKpiGeneral],
  );

  const handleChangeKpiYear = React.useCallback(
    (kpiYearId: number, kpiYear: KpiYear) => {
      setCurrentKpiYear(kpiYear);
      const errors = kpiGeneral.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.kpiYear = null;
      }
      setChangeKpiYear(true);
      setKpiGeneral({
        ...kpiGeneral,
        kpiYearId,
        kpiYear,
        kpiGeneralContents: [],
        errors,
      });
      setListAppUser([]);
    },
    [kpiGeneral, setKpiGeneral],
  );

  const columnAppUsers: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },

      {
        title: translate('kpiGenerals.appUser.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        ellipsis: true,
      },
      {
        title: translate('kpiGenerals.appUser.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
      },
      {
        title: translate('kpiGenerals.appUser.email'),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        ellipsis: true,
      },
      {
        title: translate('kpiGenerals.appUser.phone'),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('update') && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDeleteSelectedUser(index)}
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
  }, [
    dataSource,
    handleDeleteSelectedUser,
    pagination,
    translate,
    validAction,
  ]);

  return (
    <div className="page detail-page detail-page-general-kpi">
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
          <div className="title-detail pt-2">
            {translate('kpiGenerals.general.title')}
          </div>
          <Form>
            <Row>
              <Col lg={10}>
                {validAction('singleListOrganization') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiGeneral>(
                      kpiGeneral.errors,
                      nameof(kpiGeneral.organization),
                    )}
                    help={kpiGeneral.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiGenerals.organization')}
                      <span className="text-danger"> *</span>
                    </span>

                    <TreeSelectDropdown
                      defaultValue={
                        kpiGeneral.organization
                          ? translate('kpiGenerals.placeholder.organization')
                          : kpiGeneral.organizationId
                      }
                      value={
                        kpiGeneral.organizationId === 0
                          ? null
                          : kpiGeneral.organizationId
                      }
                      mode="single"
                      onChange={handleChangeOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={kpiGeneralRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'kpiGenerals.placeholder.organization',
                      )}
                      disabled={isDetail}
                    />
                  </FormItem>
                )}

                {validAction('singleListKpiYear') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiGeneral>(
                      kpiGeneral.errors,
                      nameof(kpiGeneral.kpiYear),
                    )}
                    help={kpiGeneral.errors?.kpiYear}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiGenerals.kpiYear')}
                      <span className="text-danger"> *</span>
                    </span>

                    <SelectAutoComplete
                      value={kpiGeneral.kpiYear?.id}
                      onChange={handleChangeKpiYear}
                      getList={kpiGeneralRepository.singleListKpiYear}
                      modelFilter={kpiYearFilter}
                      setModelFilter={setKpiYearFilter}
                      searchField={nameof(kpiYearFilter.name)}
                      searchType={nameof(kpiYearFilter.name.contain)}
                      placeholder={translate('kpiGenerals.placeholder.kpiYear')}
                      disabled={isDetail}
                    />
                  </FormItem>
                )}
                {/* Chu kỳ */}

                <FormItem
                  validateStatus={formService.getValidationStatus<KpiGeneral>(
                    kpiGeneral.errors,
                    nameof(kpiGeneral.status),
                  )}
                  help={kpiGeneral.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('kpiGenerals.status')}
                  </span>
                  <Switch
                    checked={
                      kpiGeneral.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(kpiGeneral.status),
                    )}
                  />
                </FormItem>
              </Col>

              {/* Mở modal chọn user */}
              {!isDetail && (
                <Col lg={14}>
                  <div className="header-title-table">
                    <div className="mb-3 title-org">
                      {translate('kpiGenerals.listAppUser')}
                      <span className="text-danger"> *</span>
                    </div>
                    {validAction('listAppUser') && (
                      <button
                        onClick={handleOpenModal}
                        className="btn btn-sm btn-primary mr-2"
                        disabled={!currentOrg || !currentKpiYear}
                      >
                        <i className="fa mr-2 fa-plus" />
                        {translate('kpiGenerals.actions.addAppUser')}
                      </button>
                    )}
                  </div>

                  {/* HIển thị danh sách user đã chọn */}
                  <div className="table-app-user">
                    <Table
                      className="content-app-user table-errors"
                      key={listAppUser[0]?.id}
                      dataSource={listAppUser}
                      columns={columnAppUsers}
                      bordered
                      size="small"
                      tableLayout="fixed"
                      loading={loading}
                      rowKey={nameof(listAppUser[0].id)}
                      pagination={pagination}
                      onChange={handleTableChange}
                    />
                    <FormItem
                      validateStatus={formService.getValidationStatus<
                        KpiGeneral
                      >(kpiGeneral.errors, nameof(kpiGeneral.employeeIds))}
                      help={kpiGeneral.errors?.employeeIds}
                    ></FormItem>
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
              )}

              {isDetail && (
                <Col lg={10}>
                  <FormItem
                    validateStatus={formService.getValidationStatus<KpiGeneral>(
                      kpiGeneral.errors,
                      nameof(kpiGeneral.employee),
                    )}
                    help={kpiGeneral.errors?.employee}
                  >
                    <span className="label-input ml-3">
                      {translate('kpiGenerals.employee')}
                    </span>
                    <Input
                      type="text"
                      value={kpiGeneral?.employee?.displayName}
                      className="form-control form-control-sm"
                      disabled
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
        </Card>

        <Card className="mt-3">
          <div className="title-detail pt-2 ml-3">
            <span className="title-default">
              {translate('kpiGenerals.targets')}
            </span>
          </div>
          <Tabs defaultActiveKey="1" className="mr-3 ml-3">
            <TabPane
              key="1"
              tab={
                <>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="tio mr-2 tio-layers" />
                    {translate('kpiGenerals.tabs.all')}
                  </button>
                </>
              }
            >
              <KpiGeneralContentTable
                mode={1}
                model={kpiGeneral}
                setModel={setKpiGeneral}
              />
            </TabPane>
            {kpiGeneral?.kpiYear?.code === moment().format('YYYY') && (
              <TabPane
                key="2"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.monthCurrent')}
                    </button>
                  </>
                }
              >
                <KpiGeneralContentTable
                  mode={2}
                  model={kpiGeneral}
                  setModel={setKpiGeneral}
                />
              </TabPane>
            )}
            {kpiGeneral?.kpiYear?.code === moment().format('YYYY') && (
              <TabPane
                key="3"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.preciousCurrent')}
                    </button>
                  </>
                }
              >
                <KpiGeneralContentTable
                  mode={3}
                  model={kpiGeneral}
                  setModel={setKpiGeneral}
                />
              </TabPane>
            )}
            {kpiGeneral?.kpiYear?.code === moment().format('YYYY') && (
              <TabPane
                key="4"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.yearCurrent')}
                    </button>
                  </>
                }
              >
                <KpiGeneralContentTable
                  mode={4}
                  model={kpiGeneral}
                  setModel={setKpiGeneral}
                />
              </TabPane>
            )}
          </Tabs>
          <FormItem
            className="table-errors"
            validateStatus={formService.getValidationStatus<KpiGeneral>(
              kpiGeneral.errors,
              nameof(kpiGeneral.id),
            )}
            help={kpiGeneral.errors?.id}
          />
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary ml-2 mr-2"
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

function tranformContent(content: KpiGeneralContent) {
  // jan -> 101, feb -> 102
  const mapping = {};
  Object.keys(content).forEach(key => {
    switch (key) {
      case 'jan': {
        mapping['101'] = content.jan;
        return;
      }
      case 'feb': {
        mapping['102'] = content.feb;
        return;
      }
      case 'mar': {
        mapping['103'] = content.mar;
        return;
      }
      case 'apr': {
        mapping['104'] = content.apr;
        return;
      }
      case 'may': {
        mapping['105'] = content.may;
        return;
      }
      case 'jun': {
        mapping['106'] = content.jun;
        return;
      }
      case 'jul': {
        mapping['107'] = content.jul;
        return;
      }
      case 'aug': {
        mapping['108'] = content.aug;
        return;
      }
      case 'sep': {
        mapping['109'] = content.sep;
        return;
      }
      case 'oct': {
        mapping['110'] = content.oct;
        return;
      }
      case 'nov': {
        mapping['111'] = content.nov;
        return;
      }
      case 'dec': {
        mapping['112'] = content.dec;
        return;
      }
      case 'q1': {
        mapping['201'] = content.q1;
        return;
      }
      case 'q2': {
        mapping['202'] = content.q2;
        return;
      }
      case 'q3': {
        mapping['203'] = content.q3;
        return;
      }
      case 'q4': {
        mapping['204'] = content.q4;
        return;
      }
      case 'year': {
        mapping['401'] = content.year;
        return;
      }
    }
  });
  content.kpiGeneralContentKpiPeriodMappings = mapping;
  return content;
}

export default KpiGeneralDetail;
