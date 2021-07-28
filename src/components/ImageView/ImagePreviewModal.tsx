import { notification, Spin, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { Model } from 'core/models';
import { Album } from 'models/Album';
import { AlbumFilter } from 'models/AlbumFilter';
import React, {
  Dispatch,
  Reducer,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';
import {
  ImagePreviewModalAction,
  ImagePreviewModalActionEnum,
} from 'views/MonitorView/MonitorService';

export interface ImagePreviewModalProp<T extends Model> extends ModalProps {
  updateItem?: (item: T) => Promise<T>;
  singleListAlbum?: (filter: AlbumFilter) => Promise<Album[]>;
  dispatch?: Dispatch<ImagePreviewModalAction<T>>; // update list after update item
  visible?: boolean;
  onClose?: () => void;
  selectedItem?: T;
  selectedList?: T[];
  showInfo?: boolean;
  dataMapper?: (item: T) => T;
}

export interface ImagePreviewState<T extends Model> {
  list?: T[];
  currentItem?: T;
  index?: number;
  loading?: boolean;
}

export interface ImagePreviewAction<T extends Model> {
  type?: ImagePreviewActionType;
  data?: ImagePreviewState<T>;
  list?: T[];
  currentItem?: T;
  index?: number;
  loading?: boolean;
}

export enum ImagePreviewActionType {
  START_FETCH,
  END_FETCH,
  SET_LIST,
  SET_ITEM,
  CHANGE_ITEM,
}

enum controlEnum {
  prev,
  next,
}

export function ImagePreviewReducer<T extends Model>(
  state: ImagePreviewState<T>,
  action: ImagePreviewAction<T>,
): ImagePreviewState<T> {
  switch (action.type) {
    case ImagePreviewActionType.START_FETCH: {
      return {
        ...state,
        loading: true,
      };
    }
    case ImagePreviewActionType.END_FETCH: {
      return {
        ...state,
        loading: true,
      };
    }
    case ImagePreviewActionType.SET_LIST: {
      return {
        ...state,
        list: action.list,
      };
    }
    case ImagePreviewActionType.SET_ITEM: {
      return {
        ...state,
        currentItem: action.currentItem,
        index: action.index,
      };
    }
  }
}
export default function ImagePreviewModal<T extends Model>(
  props: ImagePreviewModalProp<T>,
) {
  const {
    dispatch,
    getDetail,
    singleListAlbum,
    saleEmployeeId,
    storeId,
    date,
    updateItem,
    visible,
    toggle,
    selectedItem,
    selectedList,
    showInfo,
    dataMapper,
  } = props;

  const [translate] = useTranslation();

  const [state, setState] = useReducer<
    Reducer<ImagePreviewState<T>, ImagePreviewAction<T>>
  >(ImagePreviewReducer, {
    list: [],
    currentItem: null,
    index: 0,
    loading: false,
  });

  const [albumFilter, setAlbumFilter] = React.useState<AlbumFilter>(
    new AlbumFilter(),
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const [preLoadALbum, setPreLoadAlbum] = React.useState<boolean>(true);

  const { index, list, currentItem } = state;

  useEffect(() => {
    if (selectedList?.length > 0) {
      setState({
        type: ImagePreviewActionType.SET_LIST,
        list: selectedList,
      });
      if (selectedItem) {
        setState({
          type: ImagePreviewActionType.SET_ITEM,
          currentItem: selectedItem,
          index: 0,
        });
        return;
      }
      setState({
        type: ImagePreviewActionType.SET_ITEM,
        currentItem: selectedList[0],
        index: 0,
      });
    }
  }, [
    date,
    dispatch,
    getDetail,
    saleEmployeeId,
    selectedItem,
    selectedList,
    storeId,
  ]);

  const disabledPrev = useMemo(() => index === 0, [index]); // decide disable prev button

  const disabledNext = useMemo(() => index === list.length - 1, [index, list]); // decide disable next button

  const handleChangeControl = React.useCallback(
    (type: controlEnum) => {
      return () => {
        setLoading(true);
        if (type === controlEnum.prev) {
          setState({
            type: ImagePreviewActionType.SET_ITEM,
            currentItem: list[index - 1], // setItem at the index - 1
            index: index - 1, // setIndex is index - 1
          });
        }
        if (type === controlEnum.next) {
          setState({
            type: ImagePreviewActionType.SET_ITEM,
            currentItem: list[index + 1], // setItem at the index + 1
            index: index + 1, // setIndex is index + 1
          });
        }
        setPreLoadAlbum(true); // preLoad albumn of new item
        setTimeout(() => {
          setLoading(false);
        }, 200);
      };
    },
    [index, list],
  ); // handleChange control

  const handleCancel = React.useCallback(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, [props]); // handle Close modal

  const handleChangeAlbum = React.useCallback(
    (event, model) => {
      setState({
        type: ImagePreviewActionType.SET_ITEM,
        currentItem: { ...currentItem, album: model, albumId: Number(event) },
        index,
      });
    },
    [currentItem, index],
  ); // handle Update currentItem's album

  const handleUpdateItem = React.useCallback(() => {
    updateItem(currentItem).then(res => {
      if (res) {
        setState({
          type: ImagePreviewActionType.SET_ITEM,
          currentItem: typeof dataMapper === 'function' ? dataMapper(res) : res, // map data from BE to DTO
          index,
        });
        list[index] = typeof dataMapper === 'function' ? dataMapper(res) : res; // update list at the index
        dispatch({
          type: ImagePreviewModalActionEnum.SET_LIST,
          selectedList: list,
        }); // then dispatch
        notification.success({
          message: translate('general.update.success'),
        }); // side effect toasted success
      }
    });
  }, [currentItem, index, translate, updateItem, dispatch, list, dataMapper]); // handle Save modal

  return (
    <>
      <ModalContent
        size="m"
        isOpen={visible}
        toggle={toggle}
        unmountOnClose={true}
        className="form-modal-detail"
      >
        <ModalBody>
          <div className="album-image-preview">
            <FormItem className="mb-1">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center w-100"
                  style={{ minHeight: 600 }}
                >
                  <Spin spinning={loading} />
                </div>
              ) : (
                <div style={{ minHeight: 600 }}>
                  <img
                    className="image-store"
                    src={currentItem?.image?.url}
                    alt=""
                  />
                </div>
              )}
              <button
                className="prev-control"
                onClick={handleChangeControl(controlEnum.prev)}
                disabled={disabledPrev}
              >
                <i className="tio-chevron_left" />
              </button>
              <button
                className="next-control"
                onClick={handleChangeControl(controlEnum.next)}
                disabled={disabledNext}
              >
                <i className="tio-chevron_right" />
              </button>
            </FormItem>
            {showInfo && (
              <>
                <FormItem className="mb-1">
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.customer')}
                  </span>
                  <span>{currentItem?.store?.name}</span>
                </FormItem>
                <FormItem className="mb-1">
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.address')}
                  </span>
                  <span>
                    <Tooltip title={currentItem?.store?.address}>
                      {currentItem?.store?.address}
                    </Tooltip>
                  </span>
                </FormItem>
                <FormItem className="mb-1">
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.distance')}
                  </span>
                  <span>
                    {translate('general.distance')} {currentItem?.distance}(m)
                  </span>
                </FormItem>
                <FormItem className="mb-1">
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.saleEmployee')}
                  </span>
                  <span>{currentItem?.creatorName}</span>
                </FormItem>
                <FormItem className="mb-1">
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.time')}
                  </span>
                  <span>{formatDateTime(currentItem?.shootingAt)}</span>
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('storeImagesMonitors.album')}
                  </span>
                  <SelectAutoComplete
                    value={currentItem?.albumId}
                    onChange={handleChangeAlbum}
                    getList={singleListAlbum}
                    modelFilter={albumFilter}
                    setModelFilter={setAlbumFilter}
                    searchField={nameof(albumFilter.name)}
                    searchType={nameof(albumFilter.name.contain)}
                    placeholder={translate(
                      'storeImagesMonitors.placeholder.album',
                    )}
                    preLoad={preLoadALbum}
                    setPreLoad={setPreLoadAlbum}
                  />
                </FormItem>
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            {showInfo && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleUpdateItem}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleCancel}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </>
  );
}

ImagePreviewModal.defaultProps = {
  showInfo: true,
};
