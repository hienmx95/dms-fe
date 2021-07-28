import { Card, Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImagePreviewModal from 'components/ImageView/ImagePreviewModal';
import ImageView, { ImageViewType } from 'components/ImageView/ImageView';
import { API_ALBUMN_MONITOR_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { ALBUM_MONITOR } from 'config/route-consts';
import { INFINITE_SCROLL_TAKE } from 'core/config';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import { Album } from 'models/Album';
import { AlbumFilter } from 'models/AlbumFilter';
import { AppUserFilter } from 'models/AppUserFilter';
import {
  AlbumnMonitor,
  AlbumnMonitorFilter,
  AlbumTableData,
} from 'models/monitor/AlbumMonitor';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreFilter } from 'models/StoreFilter';
import { StoreImageMapping } from 'models/StoreImageMapping';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { albumRepository } from 'views/MonitorView/AlbumMonitor/AlbumRepository';
import { monitorService } from '../MonitorService';
import AlbumTree from './AlbumTree';
import SwitchTypeButton from './SwitchTypeButton';
function AlbumMonitorView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'monitor-store-album',
    API_ALBUMN_MONITOR_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadlist,
    loading,
    setLoading,
    total,
    ,
    isReset,
    setIsReset,
    handleReset,
    ,
    handleDefaultSearch,
  ] = monitorService.useMasterList<StoreImageMapping, AlbumnMonitorFilter>(
    AlbumnMonitorFilter,
    albumRepository.count,
    albumRepository.list,
  );

  const [dataSource] = monitorService.useMasterDataSource<
    StoreImageMapping,
    AlbumTableData
  >(list, transformMethod);

  const [listAlbum, setListAlbum] = React.useState<Album[]>([]);
  const [currentItem, setCurrentItem] = React.useState<Album>({
    ...new Album(),
    id: filter.albumId.equal,
  });

  React.useEffect(() => {
    albumRepository.filterListAlbum(new AlbumFilter()).then((list: Album[]) => {
      setListAlbum([...list]);
    });
  }, [setListAlbum]); // update effect for active album

  const [
    hasMore,
    setHasMore,
    handleInfiniteOnLoad, // handle load
    ,
    handleFilterScroll, // handleFilter for advancedFilter
    ,
    ,
    ref,
    displayLoadMore,
    handleIndepentFilter,
    handleResetScroll,
  ] = crudService.useTableScroll(
    list,
    setList,
    filter,
    setFilter,
    setLoading,
    albumRepository.list,
    total,
    handleDefaultSearch,
    loading,
  ); // service for infinite scroll

  const {
    handleOpenImagePreview,
    handleCloseImagePreview,
    visible,
    selectedItem,
    selectedList,
    dispatch,
  } = monitorService.useImagePreview();

  const [imageViewType, setImageViewType] = React.useState<ImageViewType>(
    'thumb',
  ); // view type. Eg: grid or table

  const [activeIndex, setActiveIndex] = React.useState<number>(1);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>({
    ...new AppUserFilter(),
    organizationId: filter.organizationId,
  });

  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  React.useEffect(() => {
    const date: Date = moment().startOf('day').toDate();
    if (typeof filter.checkIn.greaterEqual === 'undefined') {
      filter.checkIn.greaterEqual = moment(date.getTime());
    }
    if (typeof filter.checkIn.lessEqual === 'undefined') {
      filter.checkIn.lessEqual = moment(date.getTime() + 86399999);
    }
    setFilter({ ...filter });
  }, [setFilter, filter]);

  const handleChangeImageViewType = React.useCallback(
    (type: ImageViewType, index: number) => {
      return () => {
        setImageViewType(type);
        setActiveIndex(index);
      };
    },
    [setImageViewType],
  ); // change image view externally, from grid to table, back and forth

  const handleClickTreeNode = React.useCallback(
    (node: Album) => {
      // set currentItem
      setCurrentItem(node);
      setHasMore(true);
      setFilter({
        ...filter,
        albumId: { equal: node?.id },
        skip: 0,
        take: INFINITE_SCROLL_TAKE,
      });
      setTimeout(() => {
        setLoadlist(true);
      }, 0);
    },
    [filter, setFilter, setLoadlist, setHasMore],
  ); // change album

  const columns: ColumnProps<AlbumTableData>[] = React.useMemo(
    () => {
      return [
        {
          title: translate('albumMonitors.imageName'),
          key: nameof(dataSource[0].imageName),
          dataIndex: nameof(dataSource[0].imageName),
          ellipsis: true,
          render(...[displayName, record]) {
            return (
              <div className="d-flex align-items-center p-2">
                <span
                  style={{
                    width: 30,
                    height: 30,
                    margin: 'auto',
                    border: '1px solid #e8e8e8',
                    background: `top / cover no-repeat url('${record?.image.url}')`,
                    marginRight: 10,
                  }}
                ></span>
                <span>{displayName}</span>
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-left d-flex align-items-center p-2">
              {translate('albumMonitors.shootingAt')}
            </div>
          ),
          key: nameof(dataSource[0].shootingAt),
          dataIndex: nameof(dataSource[0].shootingAt),
          ellipsis: true,
          render(...[shootingAt]) {
            return (
              <div className="text-left d-flex align-items-center p-2">
                {formatDateTime(shootingAt)}
              </div>
            );
          },
        },
        {
          title: (
            <div className="text-left">
              {translate('albumMonitors.creatorName')}
            </div>
          ),
          key: nameof(dataSource[0].creatorName),
          dataIndex: nameof(dataSource[0].creatorName),
          ellipsis: true,
          render(...[creatorName]) {
            return (
              <div className="text-left d-flex align-items-center p-2">
                {creatorName}
              </div>
            );
          },
        },
      ];
    },

    // tslint:disable-next-line:max-line-length
    [dataSource, translate],
  );
  return (
    <div className="page master-page monitor-master album-monitor-master">
      <Card
        title={translate('albumMonitors.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {/* organization filter */}
              {validAction('filterListOrganization') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('albumMonitors.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleIndepentFilter(
                        nameof(filter.organizationId),
                        nameof(filter.appUserId),
                        appUserFilter,
                        setAppUserFilter,
                      )}
                      getList={albumRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
              {/* username filter */}
              {validAction('filterListAppUser') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('albumMonitors.username')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(nameof(filter.appUserId))}
                      getList={albumRepository.filterListAppUser}
                      modelFilter={appUserFilter}
                      setModelFilter={setAppUserFilter}
                      searchField={nameof(appUserFilter.displayName)}
                      searchType={nameof(appUserFilter.displayName.contain)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                      list={[]}
                    />
                  </FormItem>
                </Col>
              )}
              {/* DateTime filter */}
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('albumMonitors.date')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filterType={nameof(filter.checkIn.range)}
                    filter={filter.checkIn}
                    onChange={handleFilterScroll(nameof(filter.checkIn))}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('albumMonitors.placeholder.startDate'),
                      translate('albumMonitors.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {/* store filter */}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('albumMonitors.store')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(nameof(filter.storeId))}
                      getList={albumRepository.filterListStore}
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
                  onClick={() => handleResetScroll(handleReset)}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Row style={{ padding: '0 10px' }}>
          <Col span={8}>
            <Row>
              {/* tree view */}
              <AlbumTree
                tree={listAlbum}
                currentItem={currentItem}
                onActive={handleClickTreeNode}
                nodePadding={10}
              />
            </Row>
          </Col>
          <Col span={16} style={{ padding: '0 10px' }}>
            <Row>
              <Col span={24}>
                <div className="d-flex justify-content-end">
                  {/* button thumb */}
                  <SwitchTypeButton
                    isActive={activeIndex === 1}
                    index={1}
                    onChange={handleChangeImageViewType}
                    iconClass={'tio-folder_photo'}
                    type={'thumb'}
                  />
                  {/* button detail */}
                  <SwitchTypeButton
                    isActive={activeIndex === 2}
                    index={2}
                    onChange={handleChangeImageViewType}
                    iconClass={'tio-format_bullets'}
                    type={'list-detail'}
                  />
                </div>
              </Col>
              {/* image view */}
              <Col span={24}>
                <ImageView
                  colSpan={6}
                  type={imageViewType}
                  list={dataSource}
                  onOpenPreview={handleOpenImagePreview}
                  total={total}
                  loading={loading}
                  columns={columns}
                  hasMore={!loading && hasMore}
                  onLoad={handleInfiniteOnLoad}
                  infiniteContainerRef={ref}
                  displayLoadMore={displayLoadMore}
                />
                <ImagePreviewModal
                  visible={visible}
                  selectedItem={selectedItem}
                  selectedList={selectedList}
                  onClose={handleCloseImagePreview(ALBUM_MONITOR)}
                  updateItem={albumRepository.updateAlbum} // need to use albumRepository
                  singleListAlbum={albumRepository.filterListAlbum} // need to use albumRepository
                  dispatch={dispatch}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

const transformMethod = (item: AlbumnMonitor) => {
  const {
    imageId,
    storeId,
    albumId,
    shootingAt,
    image,
    album,
    store,
    saleEmployee,
    distance,
  } = item;
  const dataItem = {
    ...new AlbumTableData(),
    imageId,
    albumId,
    storeId,
    shootingAt,
    image,
    album,
    store,
    distance,
    imageName: image?.name,
    albumName: album?.name,
    creatorName: saleEmployee?.displayName,
  };
  return [dataItem];
};

export default AlbumMonitorView;
