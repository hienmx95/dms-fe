import { Modal, Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_STORE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { STORE_DETAIL_ROUTE, STORE_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { DistrictFilter } from 'models/DistrictFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { AppUserFilter } from 'models/AppUserFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreStatus } from 'models/StoreStatus';
import { StoreStatusFilter } from 'models/StoreStatusFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { WardFilter } from 'models/WardFilter';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import StorePreview from 'views/StoreView/StoreMaster/StorePreview';
import { storeRepository } from 'views/StoreView/StoreRepository';
import { storeNewRepository } from '../StoreNewRepository';
import AddAccountModal from './Modal/AddAccountModal';
import InactiveModal from './Modal/InactiveModal';
import './StoreMaster.scss';

const { Item: FormItem } = Form;

function StoreMaster() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const { validAction } = crudService.useAction('store', API_STORE_ROUTE);

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
    ,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<Store, StoreFilter>(
    Store,
    StoreFilter,
    storeRepository.count,
    storeRepository.list,
    storeRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    STORE_DETAIL_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */
  const [rowSelection, hasSelected] = tableService.useRowSelection<Store>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [previewModel, setPreviewModel] = React.useState<Store>(new Store());
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
  ] = crudService.useImport(storeRepository.import, setLoading);

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(storeRepository.export, filter);

  const [handleExportTemplate] = crudService.useExport(
    storeRepository.exportTemplate,
    filter,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const [wardFilter, setWardFilter] = React.useState<WardFilter>(
    new WardFilter(),
  );

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [storeStatusFilter, setStoreStatusFilter] = React.useState<
    StoreStatusFilter
  >(new StoreStatusFilter());

  const [storeActive, setStoreActive] = React.useState<Store>(new Store());

  // for create store user
  const [visibleInactive, setVisibleInactive] = React.useState<boolean>(false);
  const [visibleAccount, setVisibleAccount] = React.useState<boolean>(false);

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [resetDistrict, setResetDistrict] = React.useState<boolean>(false);
  const [resetWard, setResetWard] = React.useState<boolean>(false);

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Store>(
    storeRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    storeRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const handleOpenPreview = React.useCallback(
    (id: number) => {
      history.push(path.join(STORE_ROUTE + search + '#' + id));
      storeRepository.get(id).then((store: Store) => {
        setPreviewModel(store);
        setPreviewVisible(true);
      });
    },
    [history, search],
  );

  const handleClosePreview = React.useCallback(() => {
    const temp = search.split('#');
    setPreviewVisible(false);
    history.push(path.join(STORE_ROUTE + temp[0]));
  }, [history, search]);

  crudService.usePopupQuery(handleOpenPreview);

  // create store account feature ---------------------------------------------------------------------------------------------------------------

  const handleGoModalPassword = React.useCallback(
    (store: Store) => {
      const accountStore = {
        id: store?.storeUserId,
      };
      Modal.confirm({
        title: translate('stores.resetPass.title'),
        content: translate('stores.resetPass.content'),
        onOk() {
          setLoading(true);
          storeNewRepository
            .resetPassword(accountStore)
            .then(res => {
              if (res) {
                handleSearch();
              }
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    },
    [handleSearch, setLoading, translate],
  );

  const handleGoModalInactive = React.useCallback(
    (store: Store) => {
      setStoreActive(store);
      setVisibleInactive(true);
    },
    [setStoreActive, setVisibleInactive],
  );

  const handleAddAccountStore = React.useCallback(
    store => {
      const accountStore = {
        store,
        storeId: store?.id,
      };
      storeNewRepository.createDraft(accountStore).then(res => {
        setStoreActive(res);
        setVisibleAccount(true);
      });
    },
    [setStoreActive, setVisibleAccount],
  );

  const handleCloseAccount = React.useCallback(() => {
    setVisibleAccount(false);
  }, [setVisibleAccount]);

  const handleSaveAddAccount = React.useCallback(
    (model: Store) => {
      storeRepository.createStoreUser(model).then(res => {
        if (res) {
          setVisibleAccount(false);
          handleSearch();
        }
      });
    },
    [setVisibleAccount, handleSearch],
  );

  const handleSavePopupInActive = React.useCallback(
    currentItem => {
      if (currentItem.storeUser.statusId === 1) {
        currentItem.storeUser.statusId = 0;
      } else {
        currentItem.storeUser.statusId = 1;
      }
      currentItem.storeUser.status = undefined;
      storeNewRepository
        .lockStoreUser(currentItem.storeUser)
        .then(res => {
          if (res) {
            setVisibleInactive(false);
            handleSearch();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [handleSearch, setLoading],
  );

  const handlePopupCancelInactive = React.useCallback(() => {
    setVisibleInactive(false);
  }, [setVisibleInactive]);

  const columnWidth: any = {
    index: 75,
    id: 100,
    name: 300,
    category: 200,
    merchant: 200,
    status: 100,
    type: 150,
    actions: 150,
  };
  columnWidth.total =
    generalColumnWidths.index +
    generalColumnWidths.default * 7 +
    generalColumnWidths.actions * 2;
  const columns: ColumnProps<Store>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Store>(pagination),
          fixed: 'left',
        },
        {
          title: translate('stores.code'),
          key: nameof(list[0].code),
          width: generalColumnWidths.default,
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(nameof(list[0].code), sorter),
          fixed: 'left',
        },
        {
          title: translate('stores.codeDraft'),
          key: nameof(list[0].codeDraft),
          width: generalColumnWidths.default,
          dataIndex: nameof(list[0].codeDraft),
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(
            nameof(list[0].codeDraft),
            sorter,
          ),
          fixed: 'left',
        },
        {
          title: translate('stores.name'),
          key: nameof(list[0].name),
          width: generalColumnWidths.default,
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<Store>(nameof(list[0].name), sorter),
        },
        {
          title: translate('stores.address1'),
          key: nameof(list[0].address),
          dataIndex: nameof(list[0].address),
          width: generalColumnWidths.default,
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(
            nameof(list[0].address),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('stores.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          width: generalColumnWidths.default,
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization?.name;
          },
        },
        {
          title: translate('stores.storeGrouping'),
          key: nameof(list[0].storeGrouping),
          dataIndex: nameof(list[0].storeGrouping),
          width: generalColumnWidths.default,
          sorter: true,
          sortOrder: getOrderTypeForTable<StoreGrouping>(
            nameof(list[0].storeGrouping),
            sorter,
          ),
          render(storeGrouping: StoreGrouping) {
            return storeGrouping?.name;
          },
        },
        {
          title: translate('stores.storeType'),
          key: nameof(list[0].storeType),
          dataIndex: nameof(list[0].storeType),
          width: generalColumnWidths.default,
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(
            nameof(list[0].storeType),
            sorter,
          ),
          render(storeType: StoreType) {
            return storeType?.name;
          },
        },
        {
          title: translate('stores.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          width: generalColumnWidths.default,
          sorter: true,
          sortOrder: getOrderTypeForTable<Store>(
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
          title: translate('stores.storeStatus'),
          key: nameof(list[0].storeStatus),
          dataIndex: nameof(list[0].storeStatus),
          align: 'center',
          ellipsis: true,
          width: generalColumnWidths.actions,
          render(storeStatus: StoreStatus) {
            return (
              <>
                {storeStatus && storeStatus.id === 1 && (
                  <div className="new-state">{storeStatus?.name}</div>
                )}
                {storeStatus && storeStatus.id === 2 && (
                  <div className="pending-state">{storeStatus?.name}</div>
                )}
                {storeStatus && storeStatus.id === 3 && (
                  <div className="approved-state">{storeStatus?.name}</div>
                )}
              </>
            );
          },
        },
        // {
        //   title: translate(generalLanguageKeys.actions.label),
        //   key: nameof(generalLanguageKeys.columns.actions),
        //   dataIndex: nameof(list[0].id),
        //   width: generalColumnWidths.actions,
        //   align: 'center',
        //   fixed: 'right',
        //   render(id: number, store: Store) {
        //     return (
        //       <div className="d-flex justify-content-center button-action-table">
        //         {validAction('get') && (
        //           <Tooltip title={translate(generalLanguageKeys.actions.view)}>
        //             <button
        //               className="btn btn-sm btn-link"
        //               onClick={() => handleOpenPreview(id)}
        //             >
        //               <i className="tio-visible_outlined" />
        //             </button>
        //           </Tooltip>
        //         )}
        //         {validAction('update') && (
        //           <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
        //             <button
        //               className="btn btn-sm btn-link"
        //               onClick={handleGoDetail(id)}
        //             >
        //               <i className="tio-edit" />
        //             </button>
        //           </Tooltip>
        //         )}
        //         {!store.used && validAction('delete') && (
        //           <Tooltip
        //             title={translate(generalLanguageKeys.actions.delete)}
        //           >
        //             <button
        //               className="btn btn-sm btn-link"
        //               onClick={handleDelete(store)}
        //             >
        //               <i className="tio-delete_outlined" />
        //             </button>
        //           </Tooltip>
        //         )}
        //       </div>
        //     );
        //   },
        // },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          fixed: 'right',
          render(id: number, store: Store) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleOpenPreview(id)}
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

                {!store.storeUserId && store.statusId === 1 && (
                  <Tooltip title={translate('stores.tooltip.addAccount')}>
                    <button
                      className="btn btn-sm btn-link "
                      onClick={() => handleAddAccountStore(store)}
                    >
                      <i className="tio-user_outlined" />
                    </button>
                  </Tooltip>
                )}

                {validAction('resetPassword') &&
                  (store.storeUserId ?? false) &&
                  store.statusId === 1 && (
                    <Tooltip title={translate('stores.tooltip.changePassword')}>
                      <button
                        className="btn btn-sm btn-link "
                        onClick={() => handleGoModalPassword(store)}
                      >
                        <i className="tio-key" />
                      </button>
                    </Tooltip>
                  )}
                {(store.storeUserId ?? false) && store.statusId === 1 && (
                  <Tooltip
                    title={
                      store.storeUser?.statusId === 1
                        ? translate('stores.tooltip.inactive')
                        : translate('stores.tooltip.active')
                    }
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoModalInactive(store)}
                    >
                      <i
                        className={
                          store.storeUser?.statusId === 1
                            ? 'fa fa-unlock'
                            : 'tio-lock_outlined'
                        }
                      />
                    </button>
                  </Tooltip>
                )}

                {!store.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(store)}
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
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
      validAction,
      handleAddAccountStore,
      handleGoModalInactive,
      handleGoModalPassword,
    ],
  );

  const handleFilterProvince = React.useCallback(
    event => {
      const provinceId = event.equal;
      if (districtFilter.provinceId.equal !== provinceId) {
        filter.provinceId.equal = provinceId;
        filter.districtId.equal = undefined;
        filter.wardId.equal = undefined;
        setResetDistrict(true);
        setResetWard(true);
        setFilter(filter);
        handleSearch();
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [districtFilter.provinceId.equal, filter, handleSearch, setFilter],
  );

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

  const handleResetFilter = React.useCallback(() => {
    handleReset();
    setResetDistrict(true);
    setResetWard(true);
  }, [handleReset]);
  return (
    <div className="page master-page">
      <Card title={translate('stores.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('stores.code')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('stores.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('stores.codeDraft')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.codeDraft.contain)}
                    filter={filter.codeDraft}
                    onChange={handleFilter(nameof(filter.codeDraft))}
                    className="w-100"
                    placeholder={translate('stores.placeholder.codeDraft')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('stores.name')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('stores.placeholder.name')}
                  />
                </FormItem>
              </Col>

              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.organization')}
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={storeRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              {validAction('filterListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.storeType')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilter(nameof(filter.storeTypeId))}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      getList={storeRepository.filterListStoreType}
                      searchField={nameof(storeTypeFilter.name)}
                      searchType={nameof(storeTypeFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.appUser')}
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilter(nameof(filter.appUserId))}
                      getList={storeRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.storeGrouping')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeGroupingId}
                      filterType={nameof(filter.storeGroupingId.equal)}
                      value={filter.storeGroupingId.equal}
                      onChange={handleFilter(nameof(filter.storeGroupingId))}
                      modelFilter={storeGroupingFilter}
                      setModelFilter={setStoreGroupingFilter}
                      getList={storeRepository.filterListStoreGrouping}
                      searchField={nameof(storeGroupingFilter.name)}
                      searchType={nameof(storeGroupingFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('stores.address1')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.address.contain)}
                    filter={filter.address}
                    onChange={handleFilter(nameof(filter.address))}
                    className="w-100"
                    placeholder={translate('stores.placeholder.address1')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validAction('filterListProvince') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.province')}
                  >
                    <AdvancedIdFilter
                      filter={filter.provinceId}
                      filterType={nameof(filter.provinceId.equal)}
                      value={filter.provinceId.equal}
                      onChange={handleFilterProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      getList={storeRepository.filterListProvince}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListDistrict') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.district')}
                  >
                    <AdvancedIdFilter
                      filter={filter.districtId}
                      filterType={nameof(filter.districtId.equal)}
                      value={filter.districtId.equal}
                      onChange={handleFilterDistrict}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      getList={storeRepository.filterListDistrict}
                      searchField={nameof(districtFilter.name)}
                      searchType={nameof(districtFilter.name.contain)}
                      isReset={resetDistrict}
                      setIsReset={setResetDistrict}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        filter.provinceId.equal === undefined ? true : false
                      }
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListWard') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.ward')}
                  >
                    <AdvancedIdFilter
                      filter={filter.wardId}
                      filterType={nameof(filter.wardId.equal)}
                      value={filter.wardId.equal}
                      onChange={handleFilter(nameof(filter.wardId))}
                      modelFilter={wardFilter}
                      setModelFilter={setWardFilter}
                      getList={storeRepository.filterListWard}
                      searchField={nameof(wardFilter.name)}
                      searchType={nameof(wardFilter.name.contain)}
                      isReset={resetWard}
                      setIsReset={setResetWard}
                      placeholder={translate('general.placeholder.title')}
                      disabled={
                        filter.districtId.equal === undefined ? true : false
                      }
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.status')}
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={storeRepository.filterListStatus}
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
            <Row>
              {validAction('filterListStoreStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.storeStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeStatusId}
                      filterType={nameof(filter.storeStatusId.equal)}
                      value={filter.storeStatusId.equal}
                      onChange={handleFilter(nameof(filter.storeStatusId))}
                      getList={storeRepository.filterListStoreStatus}
                      modelFilter={storeStatusFilter}
                      setModelFilter={setStoreStatusFilter}
                      searchField={nameof(storeStatusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListStoreUserStatus') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    labelAlign="left"
                    className="mb-1"
                    label={translate('stores.storeUserStatus')}
                  >
                    <AdvancedIdFilter
                      filter={filter.storeUserStatusId}
                      filterType={nameof(filter.storeUserStatusId.equal)}
                      value={filter.storeUserStatusId.equal}
                      onChange={handleFilter(nameof(filter.storeUserStatusId))}
                      getList={storeRepository.filterListStoreUserStatus}
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
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          scroll={{ x: columnWidth.total }}
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
        {validAction('import') && (
          <input
            ref={ref}
            type="file"
            className="hidden"
            id="master-import"
            onChange={handleImport}
            onClick={handleClick}
          />
        )}

        <StorePreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />

        {visibleAccount && (
          <AddAccountModal
            isOpen={visibleAccount}
            model={storeActive}
            onClose={handleCloseAccount}
            setModel={setStoreActive}
            onSave={handleSaveAddAccount}
          />
        )}

        {visibleInactive === true && (
          <InactiveModal
            visible={visibleInactive}
            currentItem={storeActive}
            onSave={handleSavePopupInActive}
            onClose={handlePopupCancelInactive}
          />
        )}
      </Card>
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

export default StoreMaster;
