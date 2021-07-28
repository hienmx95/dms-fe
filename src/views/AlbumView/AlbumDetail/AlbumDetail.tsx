import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Album } from 'models/Album';
import { AlbumFilter } from 'models/AlbumFilter';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { albumRepository } from 'views/AlbumView/AlbumRepository';
import './AlbumDetail.scss';
import { API_ALBUM_ROUTE } from 'config/api-consts';
import { Input } from 'antd';

const { Item: FormItem } = Form;
export interface AlbumDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListAlbum?: (filter: TFilter) => Promise<T[]>;
  setListAlbum?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}


function AlbumDetail<T extends Model, TFilter extends ModelFilter>(props: AlbumDetailProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListAlbum,
    setListAlbum,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('album', API_ALBUM_ROUTE);

  const [album, setAlbum, , , handleSave] = crudService.usePopupDetail(
    Album,
    AlbumFilter,
    isDetail,
    currentItem,
    setVisible,
    albumRepository.get,
    albumRepository.save,
    getListAlbum,
    setListAlbum,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Album>(album, setAlbum);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  const [statusList] = crudService.useEnumList<Status>(
    albumRepository.singleListStatus,
  );


  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );


  return (
    <>
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader>
          {isDetail === false
            ? translate('albums.detail.addNode')
            : translate('albums.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody className="ml-2">
          <Form>
            <FormItem
              validateStatus={formService.getValidationStatus<Album>(
                album.errors,
                nameof(album.name),
              )}
              help={album.errors?.name}
            >
              <span className="label-input mr-3">
                {translate('albums.name')}
                <span className="text-danger">*</span>
              </span>
              <Input
                type="text"
                value={album.name}
                onChange={handleChangeSimpleField(nameof(album.name))}
                placeholder={translate('albums.placeholder.name')}
                className="form-control form-control-sm"
              />
            </FormItem>
            {validAction('singleListStatus') &&
              <FormItem className="mb-3">
                <span className="label-input mr-3">
                  {translate('albums.status')}
                </span>
                <Switch
                  checked={
                    album.statusId === statusList[1]?.id
                  }
                  list={statusList}
                  onChange={handleChangeObjectField(nameof(album.status))}
                />
              </FormItem>
            }
            <div className="d-flex justify-content-end mt-4 ">
              {isDetail && validAction('update') &&
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
              {!isDetail && validAction('create') &&
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AlbumDetail;
