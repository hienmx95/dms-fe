import { Col, Row, Table, Tooltip } from 'antd';
import Spin from 'antd/lib/spin';
import { PaginationProps } from 'antd/lib/pagination';
import { ColumnProps, SorterResult } from 'antd/lib/table';
import classNames from 'classnames';
import { DEFAULT_TAKE, INF_CONTAINER_HEIGHT } from 'core/config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { limitWord } from 'core/helpers/string';
import { Model } from 'core/models';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import InfiniteScroll from 'react-infinite-scroller';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import './ImageView.scss';

export type ImageViewType =
  | 'default'
  | 'thumb'
  | 'thumb-detail'
  | 'list-detail';
export interface ImageViewProps<T extends Model> {
  list: T[];
  className?: string;
  colSpan?: number;
  type?: ImageViewType;
  loading?: boolean;
  total?: number;
  onChange?: (id: number) => () => void;
  onTableChange?: (
    pagination: PaginationProps,
    filters: Record<string, any>,
    newSorter: SorterResult<Model>,
  ) => void;
  columns?: ColumnProps<T>[];
  onLoad?: () => void; // load more image
  hasMore?: boolean; // conditions to load more;
  infiniteContainerRef?: React.MutableRefObject<HTMLDivElement>; // infinite container ref
  displayLoadMore?: boolean;
  loadingImage?: boolean;
  onOpenPreview?: (model?: T, list?: T[], index?: number) => void;
  hasMask?: boolean;
}

function ImageView<T extends Model>(props: ImageViewProps<T>) {
  const {
    className,
    list,
    colSpan,
    type,
    loading,
    onTableChange,
    columns,
    onLoad,
    hasMore,
    infiniteContainerRef,
    displayLoadMore,
    onOpenPreview,
    loadingImage,
    hasMask,
  } = props;

  const loadMoreButton = React.useMemo(
    () => (
      <>
        {displayLoadMore && (
          <div className="d-flex justify-content-start">
            <button className="btn btn-sm btn-primary" onClick={onLoad}>
              Load thêm dữ liệu
            </button>
          </div>
        )}
      </>
    ),
    [displayLoadMore, onLoad],
  ); // render loadMore button

  const renderView = React.useMemo(() => {
    return () => {
      /* render view beyond view type */
      switch (type) {
        case 'thumb': {
          return (
            <div className={classNames('thumb-image-view', className)}>
              {list.length > 0 &&
                list.map((item, index) => (
                  <div key={item.id ? item.id : uuidv4()}>
                    <Col span={colSpan}>
                      <ImageThumb
                        item={item}
                        list={list}
                        index={index}
                        onOpenPreview={onOpenPreview}
                        hasMask={hasMask}
                      />
                      {loadMoreButton}
                    </Col>
                  </div>
                ))}
              {loadingImage && (
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <Spin spinning={loadingImage} size="small" />
                </div>
              )}
            </div>
          );
        }
        case 'thumb-detail': {
          return (
            <div className={classNames('thumb-detail-image-view', className)}>
              {list.length > 0 &&
                list.map((item, index) => (
                  <div key={item.id ? item.id : uuidv4()}>
                    <Col span={colSpan}>
                      <ImageThumb
                        item={item}
                        list={list}
                        index={index}
                        onOpenPreview={onOpenPreview}
                      />
                      {loadMoreButton}
                    </Col>
                  </div>
                ))}
              {loadingImage && (
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <Spin spinning={loadingImage} size="small" />
                </div>
              )}
            </div>
          );
        }
        case 'list-detail': {
          return (
            <div className={classNames('list-detail-image-view', className)}>
              {/* render table */}
              <Table
                dataSource={list}
                columns={columns}
                loading={loading}
                pagination={false}
                onChange={onTableChange}
                rowKey={nameof(list[0].key)}
                footer={() => <>{loadMoreButton}</>}
              />
            </div>
          );
        }
        default: {
          return (
            <div className={classNames('thumb-detail-image-view', className)}>
              {list.length > 0 &&
                list.map((item, index) => (
                  <div key={item.id ? item.id : uuidv4()}>
                    <Col span={colSpan}>
                      <ImageThumb
                        item={item}
                        list={list}
                        index={index}
                        onOpenPreview={onOpenPreview}
                      />
                    </Col>
                  </div>
                ))}
            </div>
          );
        }
      }
    };
  }, [
    className,
    colSpan,
    columns,
    list,
    loadMoreButton,
    loading,
    onTableChange,
    type,
    onOpenPreview,
    loadingImage,
    hasMask,
  ]);

  return (
    <div className={classNames('image-view', className)}>
      <Row>
        {onLoad ? (
          <div
            className="infinite-container"
            style={{ height: INF_CONTAINER_HEIGHT, overflow: 'auto' }}
          >
            <InfiniteScroll
              initialLoad={false}
              loadMore={onLoad}
              hasMore={!loading && hasMore}
              threshold={20}
              useWindow={false}
            >
              <ScrollContainer
                className="scroll-container"
                vertical={true}
                horizontal={true}
                hideScrollbars={false}
              >
                <div className="d-flex" ref={infiniteContainerRef}>
                  {renderView()}
                </div>
              </ScrollContainer>
            </InfiniteScroll>
          </div>
        ) : (
            renderView()
          )}
      </Row>
    </div>
  );
}

ImageView.defaultProps = {
  list: [],
  colSpan: 12,
  type: 'default',
  loading: false,
  columns: [],
  pagination: {
    current: 1,
    pageSize: DEFAULT_TAKE,
  },
  hasMask: true,
};

export interface ImageThumbProps<T extends Model> {
  item: T;
  list: T[];
  index: number;
  onOpenPreview?: (model?: T, list?: T[], index?: number) => void;
  hasMask?: boolean;
}

function ImageThumb<T extends Model>(props: ImageThumbProps<T>) {
  const { item, list, index, onOpenPreview, hasMask } = props;

  return (
    <div
      className="image-thumb p-1"
      onClick={() => onOpenPreview(item, list, index)}
    >
      {item && (
        <div
          className="image-thumb-wrap p-1"
          style={{
            width: '100%',
            height: 170,
            background: `#e8e8e8 center / auto 100% no-repeat url('${item?.image?.url}')`,
          }}
        ></div>
      )}
      {hasMask && (
        <div className="preview-mask">
          <div className="preview-mask-wrap p-2">
            {/* storename */}
            <div>
              <span className="p-1">
                <i className="tio-globe" />:
          </span>
              {item?.store?.name}
            </div>
            {/* address */}
            <div>
              <span className="p-1">
                <i className="tio-home_vs_2_outlined" />:
          </span>
              {window.innerWidth < 1920 ? (
                <Tooltip title={item?.store?.address}>
                  {limitWord(item?.store?.address, 15)}
                </Tooltip>
              ) : (
                  <Tooltip title={item?.store?.address}>
                    {limitWord(item?.store?.address, 30)}
                  </Tooltip>
                )}
            </div>
            {/* ownerName */}
            <div>
              <span className="p-1">
                <i className="tio-shop" />:
          </span>
              {item?.creatorName}
            </div>
            {/* shootingAt */}
            <div>
              <span className="p-1">
                <i className="tio-camera_enhance" />:
          </span>
              {formatDateTime(item?.shootingAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ImageThumb.defaultProps = {
  hasMask: true,
};

export default ImageView;
