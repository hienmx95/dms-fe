import { notification, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { limitWord } from 'core/helpers/string';
import { Model } from 'core/models';
import { AlbumFilter } from 'models/AlbumFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';
import { storeImagesRepository } from 'views/MonitorView/StoreImagesMonitor/StoreImagesRepository';
import './ImageView.scss';

enum controlEnum {
  prev,
  next,
}

export interface ImagePreviewProps<T extends Model> extends ModalProps {
  item: T; // currentItem
  setItem?: Dispatch<SetStateAction<T>>; // setCurrentItem
  list: T[]; // list for carousel
  updateItem?: (item: T) => Promise<T>;
  index?: number; // currentIndex
  setIndex?: Dispatch<SetStateAction<number>>; // setCurrentIndex
  visible?: boolean; // visible image modal
  onClose?: (event) => void;
  contentMapper?: (item: T) => T[]; // map item to list item
}
export function ImagePreview<T extends Model>(props: ImagePreviewProps<T>) {
  const [translate] = useTranslation();
  const {
    item,
    visible,
    list,
    setItem,
    toggle,
    index,
    setIndex,
    updateItem,
  } = props;

  const [albumFilter, setAlbumFilter] = React.useState<AlbumFilter>(
    new AlbumFilter(),
  );

  const disabledPrev = React.useMemo(() => index === 0, [index]); // decide disable prev button

  const disabledNext = React.useMemo(() => index === list.length - 1, [
    index,
    list,
  ]); // decide disable next button

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  ); // handle Close modal
  const handleSave = React.useCallback(() => {
    updateItem(item).then(res => {
      if (res) {
        if (typeof setItem === 'function') {
          setItem(res as T);
          notification.success({
            message: translate('general.update.success'),
          }); // side effect toasted success
        }
      }
    });
  }, [item, setItem, updateItem, translate]); // handle Save modal

  const handleChangeAlbum = React.useCallback(
    (event, model) => {
      setItem({
        ...item,
        albumId: Number(event),
        album: model,
      });
    },
    [setItem, item],
  ); // handle Update currentItem's album

  const handleChangeControl = React.useCallback(
    (type: controlEnum) => {
      return () => {
        if (type === controlEnum.prev) {
          setIndex(index - 1); // setIndex is index - 1
          setItem(list[index - 1]); // setItem at the index - 1
        }
        if (type === controlEnum.next) {
          setIndex(index + 1);
          setItem(list[index + 1]); // setItem at the index - 1
        }
      };
    },
    [index, setIndex, list, setItem],
  ); // handleChange control

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
              <img className="image-store" src={item?.image?.url} alt="" />
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
            <FormItem className="mb-1">
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.customer')}
              </span>
              <span>{item?.store?.name}</span>
            </FormItem>
            <FormItem className="mb-1">
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.address')}
              </span>
              <span>
                <Tooltip title={item?.store?.address}>
                  {limitWord(item?.store?.address, 50)}
                </Tooltip>
              </span>
            </FormItem>
            <FormItem className="mb-1">
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.distance')}
              </span>
              <span>{item?.distance}</span>
            </FormItem>
            <FormItem className="mb-1">
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.saleEmployee')}
              </span>
              <span>{item?.creatorName}</span>
            </FormItem>
            <FormItem className="mb-1">
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.time')}
              </span>
              <span>{formatDateTime(item?.shootingAt)}</span>
            </FormItem>
            <FormItem>
              <span className="label-input ml-3">
                {translate('storeImagesMonitors.album')}
              </span>
              <SelectAutoComplete
                value={item?.album?.id}
                onChange={handleChangeAlbum}
                getList={storeImagesRepository.singleListAlbum}
                modelFilter={albumFilter}
                setModelFilter={setAlbumFilter}
                searchField={nameof(albumFilter.name)}
                searchType={nameof(albumFilter.name.contain)}
                placeholder={translate('storeImagesMonitors.placeholder.album')}
              />
            </FormItem>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
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

ImagePreview.defaultProp = {
  indexInList: 0,
};
