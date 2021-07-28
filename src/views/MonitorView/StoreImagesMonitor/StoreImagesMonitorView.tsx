import { Card, Col, Form, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImagePreviewModal from 'components/ImageView/ImagePreviewModal';
import ImageView from 'components/ImageView/ImageView';
import { API_STORE_IMAGES_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { STORE_IMAGES_MONITOR } from 'config/route-consts';
import { INFINITE_SCROLL_TAKE, INF_CONTAINER_HEIGHT } from 'core/config';
import { DateFilter } from 'core/filters';
import { formatDate } from 'core/helpers/date-time';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { notification } from 'helpers';
import { AppUserFilter } from 'models/AppUserFilter';
import {
  StoreChecking,
  StoreImagesMonitor,
  StoreImagesMonitorFilter,
} from 'models/monitor/StoreImagesMonitor';
import { StoreImagesTableData } from 'models/monitor/StoreImagesTableData';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreFilter } from 'models/StoreFilter';
import { StoreImageMapping } from 'models/StoreImageMapping';
import moment, { Moment } from 'moment';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { useCallback } from 'reactn';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import '../Monitor.scss';
import { monitorService } from '../MonitorService';
import { storeImagesRepository } from './StoreImagesRepository';

const { Item: FormItem } = Form;

function StoreImagesMonitorView() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'monitor-store-image',
    API_STORE_IMAGES_ROUTE,
  );
  const [
    filter,
    setFilter,
    list,
    setList,
    setLoadList,
    loading,
    setLoading,
    total,
    ,
    isReset,
    setIsReset,
    handleReset,
    ,
    ,
    ,
    ,
    ,
    preLoadImage,
    setPreLoadImage,
    dateFilter,
    setDateFilter,
  ] = monitorService.useMasterList<
    StoreImagesMonitor,
    StoreImagesMonitorFilter
  >(
    StoreImagesMonitorFilter,
    storeImagesRepository.count,
    storeImagesRepository.list,
    true,
    'checkIn',
  );

  const [
    hasMore,
    ,
    handleInfiniteOnLoad,
    handleSearch,
    handleFilterScroll,
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
    storeImagesRepository.list,
    total,
    setLoadList,
    loading,
  );

  const handlePreLoadImage = () => setPreLoadImage(true); // preLoad image as callback of handleSearch, handleFilterScroll, handleResetScroll

  const {
    previewList,
    handleOpenPreview,
    previewListFilter,
    setPreviewListFilter,
    previewLoading,
    setPreviewLoading,
    reloadImage,
    setReloadImage,
    hasMoreImage,
    setHasMoreImage,
    imageContainerRef,
  } = usePreview<StoreImageMapping, StoreImagesTableData>(
    storeImagesRepository.get,
    imageDataMapper,
    preLoadImage,
    setPreLoadImage,
  ); // source for image infinityLoad

  const {
    list: imageList,
    handleInfiniteOnLoad: handleImageInfiniteOnLoad,
    displayLoadMore: displayLoadMoreImage,
  } = crudService.useLocalTableScroll(
    previewListFilter,
    setPreviewListFilter,
    previewList,
    previewLoading,
    setPreviewLoading,
    reloadImage,
    setReloadImage,
    hasMoreImage,
    setHasMoreImage,
    imageContainerRef,
  );

  const {
    handleOpenImagePreview,
    handleCloseImagePreview,
    visible,
    selectedItem,
    selectedList,
    dispatch,
  } = monitorService.useImagePreview(storeImagesRepository.get);

  const [dataSource] = monitorService.useMasterDataSource<
    StoreImagesMonitor,
    StoreImagesTableData
  >(list, transformObjecToList);

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

  const [dates, setDates] = React.useState<boolean>(true);

  const [handleExport] = crudService.useExport(
    storeImagesRepository.export,
    filter,
  );

  React.useEffect(() => {
    if (filter.checkIn.lessEqual && dates) {
      setDateFilter({ ...filter.checkIn });
      const days = filter.checkIn.lessEqual.diff(
        filter.checkIn.greaterEqual,
        'days',
      );
      setDates(false);

      if (days > 31) {
        Modal.confirm({
          title: translate('general.filter.date'),
          content: translate('general.filter.dateContent'),
          cancelText: translate('general.actions.cancel'),
          okText: translate('general.actions.ok'),
          onOk() {
            handleExport();
          },
        });
      }
    }
  }, [setFilter, filter, dates, handleExport, translate, setDateFilter]);

  const columns: ColumnProps<StoreImagesTableData>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: 100,
          render(...[, record]) {
            if (record.title) {
              return renderCell(record.title, record, 0, 6);
            }
            return (
              <div className="text-center table-row">{record.indexInTable}</div>
            );
          },
        },
        {
          title: translate('storeImagesMonitors.username'),
          key: nameof(dataSource[0].username),
          dataIndex: nameof(dataSource[0].username),
          render(...[username, record]) {
            return renderCell(username, record, 1);
          },
        },
        {
          title: translate('storeImagesMonitors.displayName'),
          key: nameof(dataSource[0].displayName),
          dataIndex: nameof(dataSource[0].displayName),
          render(...[displayName, record]) {
            return renderCell(displayName, record, 2);
          },
        },
        {
          title: (
            <div className="text-center table-row">
              {translate('storeImagesMonitors.date')}
            </div>
          ),
          key: nameof(dataSource[0].date),
          dataIndex: nameof(dataSource[0].date),
          render(...[date, record]) {
            if (record.title) {
              return renderCell(date, record, 4);
            }
            return (
              <div className="text-left table-row">{formatDate(date)}</div>
            );
          },
        },
        {
          title: (
            <div className="text-center">
              {translate('storeImagesMonitors.store')}
            </div>
          ),
          key: nameof(dataSource[0].storeName),
          dataIndex: nameof(dataSource[0].storeName),
          render(...[storeName, record]) {
            if (record.title) {
              return renderCell(storeName, record, 4);
            }
            return <div className="text-left table-row">{storeName}</div>;
          },
        },
        {
          title: (
            <div className="text-right">
              {translate('storeImagesMonitors.imageCounter')}
            </div>
          ),
          key: nameof(dataSource[0].imageCounter),
          dataIndex: nameof(dataSource[0].imageCounter),
          ellipsis: true,
          render(...[imageCounter, record]) {
            if (record.title) {
              return renderCell(imageCounter, record, 8);
            }
            return (
              <div
                className="text-right text-highlight table-row"
                onClick={handleOpenPreview(
                  record.storeId,
                  record.saleEmployeeId,
                  record.date as moment.Moment,
                )}
                style={{ cursor: 'pointer' }}
              >
                {imageCounter}
              </div>
            );
          },
        },
      ];
    },

    // tslint:disable-next-line:max-line-length
    [dataSource, handleOpenPreview, translate],
  );

  const handleDateFilter = React.useCallback(
    (field: string, callback) => {
      return (f: DateFilter) => {
        if (field.trim() === 'checkIn') {
          filter.checkIn.lessEqual = f.lessEqual;
          filter.checkIn.greaterEqual = undefined;
          filter.checkIn.greaterEqual = f.greaterEqual;
          if (f.lessEqual && f.greaterEqual) {
            const days = f.lessEqual.diff(f.greaterEqual, 'days');
            if (days > 31) {
              Modal.confirm({
                title: translate('general.filter.date'),
                content: translate('general.filter.dateContent'),
                cancelText: translate('general.actions.cancel'),
                okText: translate('general.actions.ok'),
                onOk() {
                  // setLoading(true);
                  setFilter({ ...filter });
                  handleExport();
                },
              });
            } else {
              setFilter({ ...filter });
              if (typeof callback === 'function') {
                handleSearch(callback);
              }
            }
          } else {
            setFilter({ ...filter });
            if (typeof callback === 'function') {
              handleSearch(callback);
            }
          }
        }
        setDateFilter({ ...f });
      };
    },
    [filter, setFilter, handleExport, setDateFilter, translate, handleSearch],
  );

  const hanleDefaultSearch = React.useCallback(
    handlePreLoadImage => {
      if (dateFilter.lessEqual && dateFilter.greaterEqual) {
        const days = dateFilter.lessEqual.diff(dateFilter.greaterEqual, 'days');

        if (days > 31) {
          Modal.confirm({
            title: translate('general.filter.date'),
            content: translate('general.filter.dateContent'),
            cancelText: translate('general.actions.cancel'),
            okText: translate('general.actions.ok'),
            onOk() {
              handleExport();
            },
          });
        }
      }
      handleSearch(handlePreLoadImage);
    },
    [handleSearch, dateFilter, translate, handleExport],
  );

  return (
    <div className="page master-page monitor-master monitor-images-master">
      <Card
        title={translate('storeImagesMonitors.master.title')}
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
                    label={translate('storeImagesMonitors.organization')}
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
                        handlePreLoadImage,
                      )}
                      getList={storeImagesRepository.filterListOrganization}
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
                    label={translate('storeImagesMonitors.username')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.appUserId}
                      filterType={nameof(filter.appUserId.equal)}
                      value={filter.appUserId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.appUserId),
                        handlePreLoadImage,
                      )}
                      getList={storeImagesRepository.filterListAppUser}
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
                  label={translate('storeImagesMonitors.date')}
                  labelAlign="left"
                >
                  <AdvancedDateFilter
                    filterType={nameof(dateFilter.range)}
                    filter={dateFilter}
                    onChange={handleDateFilter(
                      nameof(filter.checkIn),
                      handlePreLoadImage,
                    )}
                    className="w-100 mr-1"
                    placeholder={[
                      translate('storeImagesMonitors.placeholder.startDate'),
                      translate('storeImagesMonitors.placeholder.endDate'),
                    ]}
                  />
                </FormItem>
              </Col>
              {/* store filter */}
              {validAction('filterListStore') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('storeImagesMonitors.store')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeId}
                      filterType={nameof(filter.storeId.equal)}
                      value={filter.storeId.equal}
                      onChange={handleFilterScroll(
                        nameof(filter.storeId),
                        handlePreLoadImage,
                      )}
                      getList={storeImagesRepository.filterListStore}
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
                  onClick={() => hanleDefaultSearch(handlePreLoadImage)}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    handleResetScroll(handleReset, handlePreLoadImage)
                  }
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <div className="d-flex justify-content-between p-3">
          <div className="flex-shrink-1 d-flex align-items-center">
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
        </div>
        <Row>
          <Col span={12}>
            {/* scroll inifite table */}
            <div
              className="infinite-container"
              style={{ height: INF_CONTAINER_HEIGHT, overflow: 'auto' }}
            >
              <InfiniteScroll
                initialLoad={false}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                threshold={20}
                useWindow={false}
              >
                <div className="d-flex" ref={ref}>
                  <Table
                    className="store-images-table table-merge"
                    dataSource={dataSource}
                    bordered={false}
                    pagination={false}
                    columns={columns}
                    size="small"
                    tableLayout="fixed"
                    loading={loading}
                    footer={() => (
                      <>
                        {displayLoadMore && (
                          <div className="d-flex justify-content-start">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={handleInfiniteOnLoad}
                            >
                              Load thêm dữ liệu
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </InfiniteScroll>
            </div>
          </Col>
          <Col span={12}>
            <ImageView
              list={imageList}
              loading={loading}
              onLoad={handleImageInfiniteOnLoad}
              displayLoadMore={displayLoadMoreImage}
              infiniteContainerRef={imageContainerRef}
              hasMore={hasMoreImage && !previewLoading}
              loadingImage={previewLoading}
              onOpenPreview={handleOpenImagePreview}
              className="store-images-grid"
              type="thumb"
              colSpan={8}
            />
            <ImagePreviewModal
              visible={visible}
              selectedItem={selectedItem}
              selectedList={selectedList}
              onClose={handleCloseImagePreview(STORE_IMAGES_MONITOR)}
              updateItem={storeImagesRepository.updateAlbum}
              singleListAlbum={storeImagesRepository.singleListAlbum}
              dispatch={dispatch}
              dataMapper={imageDataMapper}
            />
          </Col>
          <Col span={2} />
        </Row>
      </Card>
    </div>
  );
}

const transformObjecToList = (storeChecker: StoreImagesMonitor) => {
  // each storeChecking map for a list
  const datalist = [];
  // fist record is title record
  datalist[0] = {
    ...new StoreImagesTableData(),
    title: storeChecker.organizationName,
    key: uuidv4(),
    rowSpan: 1,
  };
  storeChecker.saleEmployees?.forEach((epmloyee: StoreImagesMonitor) => {
    epmloyee.storeCheckings?.forEach(
      (storeChecking: StoreChecking, index: number, array) => {
        let tableItem = new StoreImagesTableData();
        const {
          id,
          imageCounter,
          storeName,
          date,
          store,
          storeId,
        } = storeChecking;
        const { username, displayName, saleEmployeeId } = epmloyee;
        if (index === 0) {
          tableItem.rowSpan = array.length;
        } else {
          tableItem.rowSpan = 0;
        }
        tableItem = {
          ...tableItem,
          imageCounter,
          storeCheckingId: id,
          date,
          storeName,
          username,
          displayName,
          saleEmployeeId,
          store,
          storeId,
          key: uuidv4(),
        };
        datalist.push(tableItem);
      },
    );
  });
  return datalist;
};

const renderCell = (
  value: any,
  record: StoreImagesTableData,
  colIndex: number,
  colNumber?: number,
) => {
  // check if record has title or not
  if (record.title) {
    let colSpan = 0;
    // if colIndex = 0; set colSpan = number of column
    if (colIndex === 0) {
      colSpan = colNumber ? colNumber : 1;
    }
    return {
      children: <div className="table-title-row table-row">{value}</div>,
      props: {
        rowSpan: 1,
        colSpan,
      },
    };
  }
  return {
    children: <div className="table-row">{value}</div>,
    props: {
      rowSpan: record.rowSpan ? record.rowSpan : 0,
      colSpan: 1,
    },
  };
};

function imageDataMapper(model: StoreImageMapping): StoreImagesTableData {
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
  } = model;

  const dataItem = {
    ...new StoreImagesTableData(),
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
    saleEmployee,
  };
  return dataItem;
}

function usePreview<TDetail extends Model, TDataTable extends Model>(
  getDetail?: (
    storeId: number,
    saleEmployeeId: number,
    date: Moment,
  ) => Promise<TDetail[]>,
  mapper?: (item: TDetail) => TDataTable,
  preLoadImage?: boolean,
  setPreLoadImage?: Dispatch<SetStateAction<boolean>>,
) {
  const [translate] = useTranslation();
  const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
  const [previewList, setPreviewList] = React.useState<
    TDataTable[] | TDetail[]
  >([]);
  const [previewListFilter, setPreviewListFilter] = React.useState<any>({
    skip: 0,
    take: INFINITE_SCROLL_TAKE,
  });
  const [reloadImage, setReloadImage] = React.useState<boolean>(false);
  const [hasMoreImage, setHasMoreImage] = React.useState<boolean>(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    imageContainerRef.current.scrollIntoView({ behavior: 'auto' });
  }; // scroll to Top when handleFilter, handleSearch

  const resetFilterImagePreview = useCallback(() => {
    setPreviewListFilter({ skip: 0, take: INFINITE_SCROLL_TAKE }); // reset filter
    setHasMoreImage(true); // allow to reload imagePreview
    setReloadImage(true); // trigger reload imagePreview from filter zone, including search button, filter
    scrollToTop(); // scroll to top
  }, []);

  React.useEffect(() => {
    if (preLoadImage) {
      setPreviewList([]);
      resetFilterImagePreview();
      setPreLoadImage(false);
    }
  }, [preLoadImage, setPreLoadImage, resetFilterImagePreview]); // pass loading list externally to reset previewList when filter

  const handleOpenPreview = React.useCallback(
    (storeId: number, saleEmployeeId: number, date: Moment) => {
      return () => {
        setPreviewLoading(true);
        getDetail(storeId, saleEmployeeId, date)
          .then((list: TDetail[]) => {
            setPreviewList(
              typeof mapper === 'function' ? list.map(mapper) : list,
            );
            resetFilterImagePreview();
            if (!list.length) {
              notification.info({
                message: translate('general.info.noData'),
              });
            }
          })
          .finally(() => setPreviewLoading(false));
      };
    },
    [getDetail, translate, mapper, resetFilterImagePreview],
  );

  return {
    imageContainerRef,
    hasMoreImage,
    setHasMoreImage,
    reloadImage,
    setReloadImage,
    previewList,
    setPreviewList,
    previewListFilter,
    setPreviewListFilter,
    handleOpenPreview,
    previewLoading,
    setPreviewLoading,
  };
}
export default StoreImagesMonitorView;
