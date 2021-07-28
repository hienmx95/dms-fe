import { Card, Tooltip } from 'antd';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatDate } from 'core/helpers/date-time';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUserFilter } from 'models/AppUserFilter';
import {
  ProblemStatusFilter,
  ProblemTypeFilter,
  StoreProblemsMonitor,
} from 'models/monitor/StoreProblemsMonitor';
import { StoreProblemsMonitorFilter } from 'models/monitor/StoreProblemsMonitorFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Post } from 'models/Post';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import '../Monitor.scss';
import { monitorService } from '../MonitorService';
import StoreProblemHistoryModal from './StoreProblemHistoryModal';
import StoreProblemMonitorModal from './StoreProblemMonitorDetailModal';
import { storeProblemsRepository } from './StoreProblemsRepository';
import { crudService } from 'core/services';
import { useHistory, useLocation } from 'react-router';
import { STORE_PROBLEMS_MONITOR } from 'config/route-consts';
import { API_STORE_PROBLEMS_ROUTE } from 'config/api-consts';
import { DateFilter } from 'core/filters';

const { Item: FormItem } = Form;

function StoreProblemsMonitorView() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { validAction } = crudService.useAction(
    'monitor-store-problem',
    API_STORE_PROBLEMS_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    ,
    loading,
    setLoading,
    total,
    handleFilter,
    isReset,
    setIsReset,
    handleReset,
    handleSearch,
    handleDefaultSearch,
    resetSelect,
    setResetSelect,
  ] = monitorService.useMasterList<
    StoreProblemsMonitor,
    StoreProblemsMonitorFilter
  >(
    StoreProblemsMonitorFilter,
    storeProblemsRepository.count,
    storeProblemsRepository.list,
    true, // isDefault skip, take
  );

  const [
    model,
    setModel,
    handleClose,
    handleOpen,
    isOpen,
    posts,
    setPosts,
    handlePopupQuery,
    idModal,
  ] = useDetailPopup(handleSearch, history);

  crudService.usePopupQuery(handlePopupQuery);

  const [handleExport] = crudService.useExport(
    storeProblemsRepository.export,
    filter,
  );

  const [
    problemModel,
    isHistoryOpen,
    handleOpenHistory,
    handleCloseHistory,
    loadList,
    setLoadList,
  ] = useHistoryPopup();

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [creatorFilter, setCreatorFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [problemStatusFilter, setProblemStatusFilter] = React.useState<
    ProblemStatusFilter
  >(new ProblemStatusFilter());

  const [problemTypeFilter, setProblemTypeFilter] = React.useState<
    ProblemTypeFilter
  >(new ProblemTypeFilter());
  const [noteAtFilter, setNoteAtFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [completeAtFilter, setCompleteAtFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [handleDelete] = tableService.useDeleteHandler<StoreProblemsMonitor>(
    storeProblemsRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  const [rowSelection, hasSelected] = tableService.useRowSelection<
    StoreProblemsMonitor
  >([], undefined, resetSelect, setResetSelect);

  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    storeProblemsRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setNoteAtFilter(new DateFilter());
    setCompleteAtFilter(new DateFilter());
  }, [handleReset]);

  const handleOrganizationFilter = React.useCallback(
    f => {
      const { skip, take } = OrganizationFilter.clone<OrganizationFilter>(
        new OrganizationFilter(),
      );
      const organizationId = f.equal;
      if (creatorFilter.organizationId.equal !== organizationId) {
        filter.organizationId.equal = organizationId;
        filter.appUserId = undefined;
        setFilter({
          ...filter,
          skip,
          take,
        });
        handleSearch();
      }
      creatorFilter.organizationId.equal = organizationId;
      setCreatorFilter(creatorFilter);
      setLoadList(true);
      handleSearch();
    },
    [
      creatorFilter,
      filter,
      handleSearch,
      setFilter,
      setLoadList,
      setCreatorFilter,
    ],
  );

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'noteAt') {
          filter.noteAt.lessEqual = f.lessEqual;
          filter.noteAt.greaterEqual = undefined;
          filter.noteAt.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
        if (field.trim() === 'completedAt') {
          filter.completedAt.lessEqual = f.lessEqual;
          filter.completedAt.greaterEqual = undefined;
          filter.completedAt.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const columns: ColumnProps<StoreProblemsMonitor>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<StoreProblemsMonitor>(pagination),
        },

        {
          title: translate('storeProblemMonitors.code'),
          key: nameof(list[0].code),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].code),
            sorter,
          ),
          dataIndex: nameof(list[0].code),
          render(...[code]) {
            return code;
          },
        },
        {
          title: translate('storeProblemMonitors.store'),
          key: nameof(list[0].store),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].store),
            sorter,
          ),
          dataIndex: nameof(list[0].store),
          render(...[store]) {
            return store.name;
          },
        },
        {
          title: translate('storeProblemMonitors.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].organization),
            sorter,
          ),
          render(...[organization]) {
            return organization?.name;
          },
        },
        {
          title: translate('storeProblemMonitors.problemType'),
          key: nameof(list[0].problemType),
          dataIndex: nameof(list[0].problemType),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].problemType),
            sorter,
          ),
          render(...[problemType]) {
            return problemType.name;
          },
        },
        {
          title: translate('storeProblemMonitors.creator'),
          key: nameof(list[0].creator),
          dataIndex: nameof(list[0].creator),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].creator),
            sorter,
          ),
          render(...[creator]) {
            return creator.displayName;
          },
        },
        {
          title: translate('storeProblemMonitors.noteAt'),
          key: nameof(list[0].noteAt),
          dataIndex: nameof(list[0].noteAt),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].noteAt),
            sorter,
          ),
          render(...[noteAt]) {
            return <div className="table-row">{formatDate(noteAt)}</div>;
          },
        },
        {
          title: translate('storeProblemMonitors.completeAt'),
          key: nameof(list[0].completedAt),
          dataIndex: nameof(list[0].completedAt),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].completedAt),
            sorter,
          ),
          render(...[completedAt]) {
            return (
              <div className="table-row">
                {completedAt ? formatDate(completedAt) : ''}
              </div>
            );
          },
        },
        {
          title: translate('storeProblemMonitors.problemStatus'),
          key: nameof(list[0].problemStatus),
          dataIndex: nameof(list[0].problemStatus),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreProblemsMonitor>(
            nameof(list[0].problemStatus),
            sorter,
          ),
          render(...[problemStatus]) {
            return (
              <div className="table-row">
                {problemStatus.id === 1 && (
                  <div className="new-state">{problemStatus?.name}</div>
                )}
                {problemStatus.id === 2 && (
                  <div className="pending-state">{problemStatus?.name}</div>
                )}
                {problemStatus.id === 3 && (
                  <div className="approved-state">{problemStatus?.name}</div>
                )}
                {problemStatus.id === 4 && (
                  <div className="rejected-state">{problemStatus?.name}</div>
                )}
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
          render(...[id, storeProblem]) {
            return (
              <div className="d-flex justify-content-center table-row button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate('storeProblemMonitors.detail')}>
                    <button
                      className="btn btn-sm"
                      onClick={handleOpen(id)}
                    >
                      <i className="tio-repeat" />
                    </button>
                  </Tooltip>
                )}
                {validAction('listProblemHistory') && (
                  <Tooltip title={translate('storeProblemMonitors.history')}>
                    <button
                      className="btn btn-sm"
                      onClick={handleOpenHistory(id)}
                    >
                      <i className="tio-history" />
                    </button>
                  </Tooltip>
                )}
                {validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm"
                      onClick={handleDelete(storeProblem)}
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
      handleOpen,
      handleOpenHistory,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page monitor-master">
      <Card
        title={translate('storeProblemMonitors.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {/* code filter */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeProblemMonitors.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'storeProblemMonitors.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>
              {/* store filter */}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeProblemMonitors.store')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilter(nameof(filter.storeId))}
                      getList={storeProblemsRepository.filterListStore}
                      modelFilter={storeFilter}
                      setModelFilter={setStoreFilter}
                      searchField={nameof(storeFilter.name)}
                      searchType={nameof(storeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {/* organization filter */}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeProblemMonitors.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleOrganizationFilter}
                      getList={storeProblemsRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {/* creator filter */}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeProblemMonitors.creator')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      getList={storeProblemsRepository.filterListAppUser}
                      modelFilter={creatorFilter}
                      setModelFilter={setCreatorFilter}
                      searchField={nameof(creatorFilter.displayName)}
                      searchType={nameof(creatorFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {/* problemType filter */}

              {validAction('filterListProblemType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeProblemMonitors.problemType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.problemTypeId}
                      filterType={nameof(filter.problemTypeId.equal)}
                      value={filter.problemTypeId.equal}
                      onChange={handleFilter(nameof(filter.problemTypeId))}
                      getList={storeProblemsRepository.filterListProblemType}
                      modelFilter={problemTypeFilter}
                      setModelFilter={setProblemTypeFilter}
                      searchField={nameof(problemTypeFilter.name)}
                      searchType={nameof(problemTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}

              {/* notAt filter */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeProblemMonitors.noteAt')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={noteAtFilter}
                    filterType={nameof(noteAtFilter.range)}
                    onChange={handleDateFilter(nameof(filter.noteAt))}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('general.placeholder.startDate'),
                      translate('general.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {/* completeAt filter */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeProblemMonitors.completeAt')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={completeAtFilter}
                    filterType={nameof(completeAtFilter.range)}
                    onChange={handleDateFilter(nameof(filter.completedAt))}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('general.placeholder.startDate'),
                      translate('general.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {/* problemStatus filter */}
              {validAction('filterListProblemStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeProblemMonitors.problemStatus')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.problemStatusId}
                      filterType={nameof(filter.problemStatusId.equal)}
                      value={filter.problemStatusId.equal}
                      onChange={handleFilter(nameof(filter.problemStatusId))}
                      getList={storeProblemsRepository.filterListProblemStatus}
                      modelFilter={problemStatusFilter}
                      setModelFilter={setProblemStatusFilter}
                      searchField={nameof(problemStatusFilter.name)}
                      searchType={nameof(problemStatusFilter.name.contain)}
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
        {/* table */}
        <Table
          dataSource={list}
          columns={columns}
          bordered={false}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(list[0].id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('bulkDelete') && (
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  )}
                  {validAction('export') && (
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExport}
                    >
                      <i className="tio-file_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.export)}
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
      <StoreProblemMonitorModal
        isOpen={isOpen}
        onClose={handleClose}
        currentItem={model}
        setCurrentItem={setModel}
        posts={posts}
        setPosts={setPosts}
        problemId={idModal}
      />
      <StoreProblemHistoryModal
        modelId={problemModel}
        onClose={handleCloseHistory}
        isOpen={isHistoryOpen}
        loadList={loadList}
        setLoadList={setLoadList}
      />
    </div>
  );
}

function useDetailPopup(
  loadList: () => void,
  history: any,
): [
    StoreProblemsMonitor,
    Dispatch<SetStateAction<StoreProblemsMonitor>>,
    () => void,
    (id: number) => () => void,
    boolean,
    Post[],
    Dispatch<SetStateAction<Post[]>>,
    (id: number) => void,
    number,
  ] {
  const { search } = useLocation();
  const [model, setModel] = React.useState<StoreProblemsMonitor>(
    new StoreProblemsMonitor(),
  );
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [idModal] = React.useState<number>(null);

  const handleOpen = React.useCallback(
    (id: number) => {
      return () => {
        history.push(STORE_PROBLEMS_MONITOR + search + '#' + id);
        storeProblemsRepository.get(id).then((item: StoreProblemsMonitor) => {
          setModel(item);
          setIsOpen(true);
          return item.rowId;
        });
        // .then((rowId: number) => {
        //   const filter = {
        //     ...new PostFilter(),
        //     discussionId: { equal: rowId },
        //   };
        //   storeProblemsRepository
        //     .listPost(filter)
        //     .then((listPost: Post[]) => {
        //       setPosts([...listPost]);
        //       setIsOpen(true);
        //       setIdModal(id);
        //     });
        // }); // temporarily comment it out
        setIsOpen(true);
      };
    },
    [history, search],
  );

  const handlePopupQuery = React.useCallback(
    (id: number) => {
      history.push(STORE_PROBLEMS_MONITOR + search + '#' + id);
      storeProblemsRepository.get(id).then((item: StoreProblemsMonitor) => {
        setModel(item);
        return item.rowId;
        // setIsOpen(true);
      });
      // .then((rowId: number) => {
      //   const filter = {
      //     ...new PostFilter(),
      //     discussionId: { equal: rowId },
      //   };
      //   storeProblemsRepository.listPost(filter).then((listPost: Post[]) => {
      //     setPosts([...listPost]);
      //     setIsOpen(true);
      //   });
      // }); // temporarily comment it out
      setIsOpen(true);
    },
    [history, search],
  );

  const handleClose = React.useCallback(() => {
    const temp = search.split('#');
    history.push(STORE_PROBLEMS_MONITOR + temp[0]);
    setIsOpen(false);
    setModel(new StoreProblemsMonitor());
    loadList();
  }, [history, loadList, search]);

  /* return model, setModel, handleClose, handleOpen, isOpen, posts */
  return [
    model,
    setModel,
    handleClose,
    handleOpen,
    isOpen,
    posts,
    setPosts,
    handlePopupQuery,
    idModal,
  ];
}

function useHistoryPopup(): [
  number,
  boolean,
  (id: number) => () => void,
  () => void,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [modelId, setModelId] = React.useState<number>(undefined);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loadList, setLoadList] = React.useState<boolean>(false);
  /* return modelId, isOpen, handleOpen, handleClose */
  const handleOpen = React.useCallback((id: number) => {
    return () => {
      setModelId(id);
      setLoadList(true);
      setIsOpen(true);
    };
  }, []);
  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setModelId(undefined);
  }, []);

  return [modelId, isOpen, handleOpen, handleClose, loadList, setLoadList];
}

export default StoreProblemsMonitorView;
