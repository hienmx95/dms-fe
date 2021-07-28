import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_STORE_ROUTE, API_STORE_SCOUTING_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { STORE_DETAIL_ROUTE, STORE_SCOUTING_ROUTE } from 'config/route-consts';
import { DEFAULT_TAKE } from 'core/config';
import { formatDate } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { notification } from 'helpers/notification';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { DistrictFilter } from 'models/DistrictFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Post } from 'models/Post';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StoreScouting } from 'models/StoreScouting';
import { StoreScoutingFilter } from 'models/StoreScoutingFilter';
import { StoreScoutingStatus } from 'models/StoreScoutingStatus';
import { StoreScoutingStatusFilter } from 'models/StoreScoutingStatusFilter';
import { WardFilter } from 'models/WardFilter';
import { Moment } from 'moment';
import path from 'path';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { storeScoutingRepository } from 'views/StoreScoutingView/StoreScoutingRepository';
import StoreScoutingDetail from '../StoreScoutingDetail/StoreScoutingDetail';
import './StoreScoutingMaster.scss';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import { DateFilter } from 'core/filters';
import { Organization } from 'models/Organization';
import { StoreScoutingType } from 'models/StoreScoutingType';
import { StoreScoutingTypeFilter } from 'models/StoreScoutingTypeFilter';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';

const { Item: FormItem } = Form;

function StoreScoutingMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const { validAction } = crudService.useAction(
    'store-scouting',
    API_STORE_SCOUTING_ROUTE,
  );
  const { validAction: validActionStore } = crudService.useAction(
    'store',
    API_STORE_ROUTE,
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
    previewModel,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<StoreScouting, StoreScoutingFilter>(
    StoreScouting,
    StoreScoutingFilter,
    storeScoutingRepository.count,
    storeScoutingRepository.list,
    storeScoutingRepository.get,
  );

  const [handleExport] = crudService.useExport(
    storeScoutingRepository.export,
    filter,
  );

  const [handleDelete] = tableService.useDeleteHandler<StoreScouting>(
    storeScoutingRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  /**
   * If import
   */
  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(storeScoutingRepository.import, setLoading);

  const [creatorFilter, setCreatorFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [
    storeScoutingStatusFilter,
    setStoreScoutingStatusFilter,
  ] = React.useState<StoreScoutingStatusFilter>(
    new StoreScoutingStatusFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );
  const [dateFilter, setDateFilter] = React.useState<DateFilter>(
    new DateFilter(),
  );
  const [storeScoutingTypeFilter, setStoreScoutingTypeFilter] = React.useState<
    StoreScoutingTypeFilter
  >(new StoreScoutingTypeFilter());

  const [storeScouting, setStoreScouting] = React.useState<StoreScouting>(
    new StoreScouting(),
  );
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [posts, setPosts] = React.useState<Post[]>([]);

  const [handleExportTemplate] = crudService.useExport(
    storeScoutingRepository.exportTemplate,
    filter,
  );

  const handleGoStore = React.useCallback(
    (storeId: number) => {
      return () => {
        history.push(
          path.join(STORE_DETAIL_ROUTE + '/create?storeScoutingId=' + storeId),
        );
      };
    },
    [history],
  );
  const handleOpen = React.useCallback(
    (id: number) => {
      setIsOpen(true);
      history.push(path.join(STORE_SCOUTING_ROUTE + search + '#' + id));
      storeScoutingRepository.get(id).then((item: StoreScouting) => {
        setStoreScouting({ ...item });
        return item.rowId;
      });
      // .((rowId: number) => {
      //   const filter = {
      //     ...new PostFilter(),
      //     discussionId: { equal: rowId },
      //   };
      //   storeProblemsRepository.listPost(filter).then((listPost: Post[]) => {
      //     setPosts([...listPost]);
      //     setIsOpen(true);
      //   });
      // });
    },
    [history, search],
  );

  const handleCancelPopup = React.useCallback(() => {
    const temp = search.split('#');
    history.push(path.join(STORE_SCOUTING_ROUTE + temp[0]));
    setIsOpen(false);
    const newStoreScouting = new StoreScouting();
    setStoreScouting(newStoreScouting);
  }, [history, search]);

  const handleReject = React.useCallback(
    (storeScouting: StoreScouting) => {
      storeScouting.link = document.URL;
      storeScoutingRepository
        .reject(storeScouting)
        .then(() => {
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.push(path.join(STORE_SCOUTING_ROUTE));
          setIsOpen(false);
          handleSearch();
        })
        .catch((error: Error) => {
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    },
    [translate, history, handleSearch],
  );
  crudService.usePopupQuery(handleOpen);

  const handleFilterProvince = React.useCallback(
    event => {
      const provinceId = event.equal;
      if (districtFilter.provinceId.equal !== provinceId) {
        filter.provinceId.equal = provinceId;
        filter.districtId.equal = undefined;
        filter.wardId.equal = undefined;
        setFilter(filter);
        handleSearch();
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [districtFilter.provinceId.equal, filter, handleSearch, setFilter],
  );

  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setDateFilter(new DateFilter());
  }, [handleReset]);

  const handleFilterDistrict = React.useCallback(
    event => {
      const districtId = event.equal;
      if (wardFilter.districtId.equal !== districtId) {
        filter.districtId.equal = districtId;
        filter.wardId = undefined;
        setFilter(filter);
        handleSearch();
      }
      wardFilter.districtId.equal = districtId;
    },
    [filter, handleSearch, setFilter, wardFilter.districtId.equal],
  );

  /* this filter for controlling dependent advancedIdFilter */
  const handleControlFilter = useCallback(
    (field: string) => {
      return f => {
        setFilter({ ...filter, [field]: f, skip: 0, take: DEFAULT_TAKE });
        setCreatorFilter({ ...creatorFilter, [field]: f });
        handleSearch();
      };
    },
    [creatorFilter, filter, handleSearch, setFilter],
  );

  const handleDateFilter = React.useCallback(
    (field: string) => {
      return (f: DateFilter) => {
        if (field.trim() === 'createdAt') {
          filter.createdAt.lessEqual = f.lessEqual;
          filter.createdAt.greaterEqual = undefined;
          filter.createdAt.greaterEqual = f.greaterEqual;
          setFilter({ ...filter });
          handleSearch();
        }
      };
    },
    [filter, handleSearch, setFilter],
  );

  const columns: ColumnProps<StoreScouting>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<StoreScouting>(pagination),
      },
      {
        title: translate('storeScoutings.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        width: 100,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].code),
          sorter,
        ),
      },
      {
        title: translate('storeScoutings.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].name),
          sorter,
        ),
      },
      {
        title: translate('storeScoutings.address'),
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        ellipsis: true,
        width: 300,
        sorter: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].address),
          sorter,
        ),
      },
      {
        title: translate('storeScoutings.storeScoutingType'),
        key: nameof(list[0].storeScoutingType),
        dataIndex: nameof(list[0].storeScoutingType),
        ellipsis: true,
        width: 200,
        sorter: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].storeScoutingType),
          sorter,
        ),
        render(storeScoutingType: StoreScoutingType) {
          return storeScoutingType?.name;
        },
      },
      {
        title: translate('storeScoutings.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].organization),
          sorter,
        ),
        render(organization: Organization) {
          return organization?.name;
        },
      },
      {
        title: translate('storeScoutings.creator'),
        key: nameof(list[0].creator),
        dataIndex: nameof(list[0].creator),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].creator),
          sorter,
        ),
        render(creator: AppUser) {
          return creator?.displayName;
        },
      },
      {
        title: translate('storeScoutings.createdAt'),
        key: nameof(list[0].createdAt),
        dataIndex: nameof(list[0].createdAt),
        sorter: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].createdAt),
          sorter,
        ),
        render(createdAt: Moment) {
          return formatDate(createdAt);
        },
      },

      {
        title: translate('storeScoutings.storeScoutingStatus'),
        key: nameof(list[0].storeScoutingStatus),
        dataIndex: nameof(list[0].storeScoutingStatus),
        sorter: true,
        sortOrder: getOrderTypeForTable<StoreScouting>(
          nameof(list[0].storeScoutingStatus),
          sorter,
        ),
        render(storeScoutingStatus: StoreScoutingStatus) {
          return storeScoutingStatus?.name;
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, storeScouting: StoreScouting) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => handleOpen(storeScouting.id)}
                >
                  <i className="tio-visible_outlined" />
                </button>
              </Tooltip>
              {storeScouting.storeScoutingStatusId === 0 &&
                validActionStore('getDraft') && (
                  <Tooltip title={translate('storeScoutings.createStore')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoStore(id)}
                    >
                      <i className="tio-home_vs_1_outlined" />
                    </button>
                  </Tooltip>
                )}
              {storeScouting.storeScoutingStatusId === 0 &&
                validAction('reject') && (
                  <Tooltip title={translate('storeScoutings.reject')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleOpen(storeScouting.id)}
                    >
                      <i className="tio-refresh" />
                    </button>
                  </Tooltip>
                )}

              {validAction('delete') &&
                storeScouting.storeScoutingStatusId === 2 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(storeScouting)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
              {validAction('delete') &&
                storeScouting.storeScoutingStatusId === 0 && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(storeScouting)}
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
    handleGoStore,
    handleOpen,
    list,
    pagination,
    sorter,
    translate,
    validAction,
    validActionStore,
  ]);

  return (
    <div className="page master-page">
      <Card title={translate('storeScoutings.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeScoutings.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('storeScoutings.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeScoutings.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('storeScoutings.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeScoutings.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.address.contain)}
                    filter={filter.address}
                    onChange={handleFilter(nameof(filter.address))}
                    placeholder={translate(
                      'storeScoutings.placeholder.address',
                    )}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('filterListStoreScoutingType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.storeScoutingType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeScoutingTypeId}
                      filterType={nameof(filter.storeScoutingTypeId.equal)}
                      value={filter.storeScoutingTypeId.equal}
                      onChange={handleFilter(
                        nameof(filter.storeScoutingTypeId),
                      )}
                      modelFilter={storeScoutingTypeFilter}
                      setModelFilter={setStoreScoutingTypeFilter}
                      getList={
                        storeScoutingRepository.filterListStoreScoutingType
                      }
                      searchField={nameof(storeScoutingTypeFilter.name)}
                      searchType={nameof(storeScoutingTypeFilter.name.contain)}
                      placeholder={translate(
                        'storeScoutings.placeholder.storeScoutingType',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleControlFilter(
                        nameof(filter.organizationId),
                      )}
                      getList={storeScoutingRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.creator')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      modelFilter={creatorFilter}
                      setModelFilter={setCreatorFilter}
                      getList={storeScoutingRepository.filterListAppUser}
                      searchField={nameof(creatorFilter.displayName)}
                      searchType={nameof(creatorFilter.displayName.contain)}
                      placeholder={translate(
                        'storeScoutings.placeholder.creator',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListProvince') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.province')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.provinceId}
                      filterType={nameof(filter.provinceId.equal)}
                      value={filter.provinceId.equal}
                      onChange={handleFilterProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      getList={storeScoutingRepository.filterListProvince}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate(
                        'storeScoutings.placeholder.province',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListDistrict') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.district')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.districtId}
                      filterType={nameof(filter.districtId.equal)}
                      value={filter.districtId.equal}
                      onChange={handleFilterDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      getList={storeScoutingRepository.filterListDistrict}
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      placeholder={translate(
                        'storeScoutings.placeholder.district',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListWard') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.ward')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.wardId}
                      filterType={nameof(filter.wardId.equal)}
                      value={filter.wardId.equal}
                      onChange={handleFilter(nameof(filter.wardId))}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      getList={storeScoutingRepository.filterListWard}
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      placeholder={translate('storeScoutings.placeholder.ward')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeScoutings.createdAt')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={dateFilter}
                    filterType={nameof(dateFilter.range)}
                    onChange={handleDateFilter(nameof(filter.createdAt))}
                    placeholder={[
                      translate('general.placeholder.startDate'),
                      translate('general.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStoreScoutingStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('storeScoutings.storeScoutingStatus')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeScoutingStatusId}
                      filterType={nameof(filter.storeScoutingStatusId.equal)}
                      value={filter.storeScoutingStatusId.equal}
                      onChange={handleFilter(
                        nameof(filter.storeScoutingStatusId),
                      )}
                      modelFilter={storeScoutingStatusFilter}
                      setModelFilter={setStoreScoutingStatusFilter}
                      getList={
                        storeScoutingRepository.filterListStoreScoutingStatus
                      }
                      searchField={nameof(storeScoutingStatusFilter.name)}
                      searchType={nameof(
                        storeScoutingStatusFilter.name.contain,
                      )}
                      placeholder={translate('general.placeholder.title')}
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
                  <i className="fa fa-search mr-2" />
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
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          onChange={handleTableChange}
          className="table-none-row-selection "
          title={() => (
            <>
              <div className="d-flex justify-content-between mr-2">
                <div className="d-flex justify-content-start">
                  {validAction('import') && (
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
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
                  {validAction('exportTemplate') && (
                    <button
                      className="btn btn-sm btn-export-template mr-2"
                      onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
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
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />
      </Card>
      <StoreScoutingDetail
        isOpen={isOpen}
        onClose={handleCancelPopup}
        storeScouting={storeScouting}
        setStoreScouting={setStoreScouting}
        onReject={() => handleReject(storeScouting)}
        posts={posts}
        setPosts={setPosts}
        createPost={storeScoutingRepository.createPost}
        listPost={storeScoutingRepository.listPost}
        createComment={storeScoutingRepository.createComment}
      />
      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </div>
  );
}

export default StoreScoutingMaster;
