import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SURVEY_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { SURVEY_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Survey } from 'models/Survey';
import { SurveyFilter } from 'models/SurveyFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { surveyRepository } from 'views/SurveyView/SurveyRepository';
import SurveyDetail from '../SurveyDetail/SurveyDetail';
import SurveyPreview from '../SurveyMasterPreview/SurveyMasterPreview';
import './SurveyMaster.scss';

const { Item: FormItem } = Form;

function SurveyMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { validAction } = crudService.useAction('survey', API_SURVEY_ROUTE);
  const { search } = useLocation();

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
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
    setLoadList,
  ] = crudService.useMaster<Survey, SurveyFilter>(
    Survey,
    SurveyFilter,
    surveyRepository.count,
    surveyRepository.list,
    surveyRepository.get,
  );

  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<Survey>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<Survey>(new Survey());

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const handleGoDetail = React.useCallback(
    (survey: Survey) => {
      setCurrentItem(survey);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const handleGoCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);

  const handlePopupCancel = React.useCallback(() => {
    const temp = search.split('#');
    history.push(path.join(SURVEY_ROUTE + temp[0]));
    setVisible(false);
  }, [history, search]);

  const handleOpenPopup = React.useCallback(
    (id: number) => {
      history.push(path.join(SURVEY_ROUTE + search + '#' + id));
      surveyRepository.get(id).then((survey: Survey) => {
        setPreviewModel(survey);
        setPreviewVisible(true);
      });
    },
    [history, search],
  );

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(SURVEY_ROUTE + temp[0]));
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPopup);

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  // const [rowSelection] = tableService.useRowSelection<Survey>();

  /**
   * If import
   */
  const [handleImport] = crudService.useImport(
    surveyRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  // const [handleExport] = crudService.useExport(surveyRepository.export, filter);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Survey>(
    surveyRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const columns: ColumnProps<Survey>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Survey>(pagination),
      },
      {
        title: translate('surveys.title'),
        key: nameof(list[0].title),
        dataIndex: nameof(list[0].title),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(nameof(list[0].title), sorter),
        ellipsis: true,
      },
      {
        title: translate('surveys.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(nameof(list[0].status), sorter),
        align: 'center',
        render(status: Status) {
          return (
            <div className={status?.id === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: translate('surveys.appUser'),
        key: nameof(list[0].creator),
        dataIndex: nameof(list[0].creator),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(
          nameof(list[0].creator),
          sorter,
        ),
        align: 'center',
        render(creator: AppUser) {
          return creator?.username;
        },
      },
      {
        title: translate('surveys.createdAt'),
        key: nameof(list[0].createdAt),
        dataIndex: nameof(list[0].createdAt),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(
          nameof(list[0].createdAt),
          sorter,
        ),
        render(...[createdAt]) {
          return formatDate(createdAt);
        },
        align: 'center',
      },
      {
        title: translate('surveys.startAt'),
        key: nameof(list[0].startAt),
        dataIndex: nameof(list[0].startAt),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(
          nameof(list[0].startAt),
          sorter,
        ),
        render(...[startAt]) {
          return formatDate(startAt);
        },
        align: 'center',
      },
      {
        title: translate('surveys.endAt'),
        key: nameof(list[0].endAt),
        dataIndex: nameof(list[0].endAt),
        sorter: true,
        sortOrder: getOrderTypeForTable<Survey>(nameof(list[0].endAt), sorter),
        render(...[endAt]) {
          return endAt ? formatDate(endAt) : null;
        },
        align: 'center',
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, survey: Survey) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('get') && (
                <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleOpenPopup(id)}
                  >
                    <i className="tio-visible_outlined" />
                  </button>
                </Tooltip>
              )}
              {validAction('update') && (
                <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleGoDetail(survey)}
                  >
                    <i className="tio-edit" />
                  </button>
                </Tooltip>
              )}
              {!survey.used && validAction('delete') && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(survey)}
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
    handleDelete,
    handleGoDetail,
    handleOpenPopup,
    list,
    pagination,
    sorter,
    translate,
    validAction,
  ]);

  return (
    <div className="page master-page">
      <Card title={translate('surveys.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('surveys.title')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.title.contain)}
                    filter={filter.title}
                    onChange={handleFilter(nameof(filter.title))}
                    placeholder={translate('surveys.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('surveys.description')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.description.contain)}
                    filter={filter.description}
                    onChange={handleFilter(nameof(filter.description))}
                    placeholder={translate('surveys.placeholder.description')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('surveys.appUser')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.creatorId}
                      filterType={nameof(filter.creatorId.equal)}
                      value={filter.creatorId.equal}
                      onChange={handleFilter(nameof(filter.creatorId))}
                      getList={surveyRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('surveys.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={surveyRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
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
                  <i className="fa fa-search mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleReset}
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
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          onChange={handleTableChange}
          className="table-none-row-selection"
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
        <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
        />
        <SurveyPreview
          key={previewModel?.id}
          survey={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
          loading={loading}
        />
      </Card>
      {visible === true && (
        <SurveyDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getList={surveyRepository.list}
          setList={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default SurveyMaster;
