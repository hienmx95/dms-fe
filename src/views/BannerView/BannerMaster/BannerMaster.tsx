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
import { API_BANNER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatDate } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Banner } from 'models/Banner';
import { BannerFilter } from 'models/BannerFilter';
import { Image } from 'models/Image';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { Moment } from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import BannerDetail from 'views/BannerView/BannerDetail/BannerDetail';
import { bannerRepository } from 'views/BannerView/BannerRepository';
import BannerPreview from './BannerPreview';

const { Item: FormItem } = Form;

function BannerMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('banner', API_BANNER_ROUTE);

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    setLoadList,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<Banner, BannerFilter>(
    Banner,
    BannerFilter,
    bannerRepository.count,
    bannerRepository.list,
    bannerRepository.get,
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
  const [rowSelection, hasSelected] = tableService.useRowSelection<Banner>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );

  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const [handleExport] = crudService.useExport(bannerRepository.export, filter);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Banner>(
    bannerRepository.delete,
    setLoading,
    list,
    setList,
    handleSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    bannerRepository.bulkDelete,
    setLoading,
    handleSearch,
  );
  const handleGoDetail = React.useCallback(
    (banner: Banner) => {
      setCurrentItem(banner);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );
  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);
  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleResetFilter = React.useCallback(() => {
    handleReset();
  }, [handleReset]);

  const columns: ColumnProps<Banner>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Banner>(pagination),
        },
        {
          title: translate('banners.image'),
          key: nameof(list[0].images),
          dataIndex: nameof(list[0].images),
          render(images: Image[]) {
            return <img src={images[0]?.url} width="40" height="40" alt="" />;
          },
        },
        {
          title: translate('banners.title'),
          key: nameof(list[0].title),
          dataIndex: nameof(list[0].title),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
            nameof(list[0].title),
            sorter,
          ),
          ellipsis: true,
        },
        {
          title: translate('banners.priority'),
          key: nameof(list[0].priority),
          dataIndex: nameof(list[0].priority),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
            nameof(list[0].priority),
            sorter,
          ),
          width: 200,
        },
        {
          title: translate('banners.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
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
          title: translate('banners.creator'),
          key: nameof(list[0].creator),
          dataIndex: nameof(list[0].creator),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
            nameof(list[0].creator),
            sorter,
          ),
          render(creator: AppUser) {
            return creator?.displayName;
          },
          ellipsis: true,
        },
        {
          title: translate('banners.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization?.name;
          },
          ellipsis: true,
        },

        {
          title: translate('banners.createAt'),
          key: nameof(list[0].createdAt),
          width: 110,
          dataIndex: nameof(list[0].createdAt),
          sorter: true,
          sortOrder: getOrderTypeForTable<Banner>(
            nameof(list[0].createdAt),
            sorter,
          ),
          render(createdAt: Moment) {
            return formatDate(createdAt);
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, banner: Banner) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
                {validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoDetail(banner)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}

                {validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(banner)}
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
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('banners.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('banners.title')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.title.contain)}
                    filter={filter.title}
                    onChange={handleFilter(nameof(filter.title))}
                    className="w-100"
                    placeholder={translate('banners.placeholder.title')}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('banners.creatAt')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filter={filter.createdAt}
                    filterType={nameof(filter.createdAt.greaterEqual)}
                    onChange={handleFilter(nameof(filter.createdAt))}
                    className="w-100"
                    placeholder={translate('banners.placeholder.createAt')}
                  />
                </FormItem>
              </Col>
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('banners.creator')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.creatorId}
                      filterType={nameof(filter.creatorId.equal)}
                      value={filter.creatorId.equal}
                      onChange={handleFilter(nameof(filter.creatorId))}
                      getList={bannerRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('banners.placeholder.creator')}
                    />
                  </FormItem>
                </Col>
              )}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('appUsers.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={bannerRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
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
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleCreate}
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
      {visible === true && (
        <BannerDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListBanner={bannerRepository.list}
          setListBanner={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
      <BannerPreview
        preViewModel={previewModel}
        previewLoading={previewLoading}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
      />
    </div>
  );
}

export default BannerMaster;
