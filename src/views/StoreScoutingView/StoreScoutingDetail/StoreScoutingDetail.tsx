import { Input } from 'antd';
import Card from 'antd/lib/card';
import FormItem from 'antd/lib/form/FormItem';
import ChatBox from 'components/ChatBox/ChatBox';
import Map from 'components/GoogleAutoCompleteMap/GoogleAutoCompleteMap';
import ImagePreviewModal from 'components/ImageView/ImagePreviewModal';
import ImageView from 'components/ImageView/ImageView';
import { API_STORE_SCOUTING_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { Comment } from 'models/Comment';
import { Image } from 'models/Image';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import { StoreScouting } from 'models/StoreScouting';
import { StoreScoutingImageMapping } from 'models/StoreScoutingImageMapping';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import { Modal, ModalBody, ModalProps } from 'reactstrap';
import { storeScoutingRepository } from '../StoreScoutingRepository';
import { storeScoutingService } from '../StoreScoutingService';
import './StoreScoutingDetail.scss';

export interface StoreScoutingRejectModalIProps extends ModalProps {
  storeScouting: StoreScouting;
  setStoreScouting: Dispatch<SetStateAction<StoreScouting>>;
  onReject: () => void;

  onClose: (event?) => void;
  posts?: Post[];
  setPosts?: Dispatch<SetStateAction<Post[]>>;
  createPost?: (model: Post) => Promise<Post>;
  listPost?: (filter: PostFilter) => Promise<Post[]>;
  createComment?: (model: Comment) => Promise<Comment>;
}

export default function StoreScoutingDetail(
  props: StoreScoutingRejectModalIProps,
) {
  const {
    onClose,
    storeScouting,
    setStoreScouting,
    onReject,
    setPosts,
    listPost,
    isOpen,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'store-scouting',
    API_STORE_SCOUTING_ROUTE,
  );

  const [loadPosts, setLoadPost] = React.useState<boolean>(false);

  const [storeScoutingImageMappings, setStoreScoutingImageMappings] = React.useState<
    Image[]
  >([]);

  const [user] = useGlobal<AppUser>('user');

  const [visibleChat, setVisibleChat] = React.useState<boolean>(false);

  const {
    handleOpenImagePreview,
    handleCloseImagePreview,
    visible,
    selectedItem,
    selectedList,
    dispatch,
  } = storeScoutingService.useImagePreview(storeScoutingRepository.get);

  React.useEffect(() => {
    const images = [];
    if (
      storeScouting.storeScoutingImageMappings &&
      storeScouting.storeScoutingImageMappings.length > 0
    ) {
      storeScouting.storeScoutingImageMappings.map(
        (storeScoutingImageMapping: StoreScoutingImageMapping) => {
          return images.push(storeScoutingImageMapping.image);
        },
      );
      setStoreScoutingImageMappings(images);
      // tslint:disable-next-line:no-unused-expression
    }
  }, [storeScouting.storeScoutingImageMappings]);

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );
  React.useEffect(() => {
    if (loadPosts) {
      const filter = {
        ...new PostFilter(),
        discussionId: { equal: storeScouting?.rowId },
      };
      listPost(filter)
        .then((list: Post[]) => {
          setPosts([...list]);
        })
        .finally(() => {
          setLoadPost(false);
        });
    }
  }, [storeScouting, listPost, loadPosts, setPosts]);

  const handleVisibleChat = React.useCallback(() => {
    setVisibleChat(!visibleChat);
  }, [setVisibleChat, visibleChat]);

  const handleReject = React.useCallback(() => {
    setVisibleChat(false);
    if (onReject) {
      onReject();
    }
  }, [onReject]);

  const handleClose = React.useCallback(() => {
    setVisibleChat(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleCancel}
      className="form-modal-detail modal-store"
      size="xl"
    >
      <div className="d-flex justify-content-between modal-header">
        <h5 className="d-flex align-items-center header-popup">
          {storeScouting?.code}
        </h5>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary btn-comment mr-2" onClick={handleVisibleChat}>
            {/* <i className=" mr-2 tio-archive" /> */}
            {translate(generalLanguageKeys.actions.chat)}
          </button>
          {storeScouting.storeScoutingStatusId === 0 && validAction('reject') && (
            <button className="btn btn-sm btn-reject mr-2" onClick={handleReject}>
              <i className=" mr-2 tio-archive" />
              {translate(generalLanguageKeys.actions.reject)}
            </button>
          )}
          <button className="btn btn-sm btn-outline-primary " onClick={handleClose}>
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.close)}
          </button>
        </div>
      </div>
      <ModalBody>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.code')}
          </span>
          <Input
            type="text"
            value={storeScouting.code}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.storeScoutingType')}
          </span>
          <Input
            type="text"
            value={storeScouting?.storeScoutingType?.name}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.name')}
          </span>
          <Input
            type="text"
            value={storeScouting.name}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.ownerPhone')}
          </span>
          <Input
            type="text"
            value={storeScouting.ownerPhone}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>

        <div className={'store-address'}>
          <FormItem className="mb-3">
            <span className="label-input ml-3">
              {translate('storeScoutings.address')}
            </span>
            <div className="store-address-input">
              <div className="mb-4">
                <Input
                  type="text"
                  value={storeScouting.address}
                  className="form-control form-control-sm input-map"
                  disabled={true}
                  placeholder={translate('stores.placeholder.address')}
                />
              </div>
              <div style={{ height: 250 }} className="mb-5 google-map">
                <Map
                  lat={
                    storeScouting.latitude ? storeScouting.latitude : 21.027763
                  }
                  lng={
                    storeScouting.longitude
                      ? storeScouting.longitude
                      : 105.83416
                  }
                  defaultZoom={10}
                  defaultAddress={storeScouting.address}
                  inputClassName={'form-control form-control-sm mb- input-map'}
                  inputMapClassName={'mt-4 map '}
                  model={storeScouting}
                  setModel={setStoreScouting}
                  isAddress={true}
                  disabled={true}
                />
              </div>
            </div>
          </FormItem>
        </div>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.province')}
          </span>
          <Input
            type="text"
            value={storeScouting?.province?.name}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.district')}
          </span>
          <Input
            type="text"
            value={storeScouting?.district?.name}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.ward')}
          </span>
          <Input
            type="text"
            value={storeScouting.ward?.name}
            className="form-control form-control-sm"
            disabled={true}
          />
        </FormItem>
        {storeScouting.storeScoutingStatusId !== 0 && (
          <FormItem className="mb-1">
            <span className="label-input ml-3">
              {translate('storeScoutings.storeScoutingStatus')}
            </span>
            {storeScouting.storeScoutingStatusId === 1 && (
              <div className="open-state">
                {storeScouting.storeScoutingStatus?.name}
              </div>
            )}
            {storeScouting.storeScoutingStatusId === 2 && (
              <div className="reject-state">
                {storeScouting.storeScoutingStatus?.name}
              </div>
            )}
          </FormItem>
        )}
        {storeScouting.storeScoutingStatusId === 1 && (
          <FormItem className="mb-1">
            <span className="label-input ml-3">
              {translate('storeScoutings.store.code')}
            </span>
            <div className="display-code">{storeScouting?.store?.code}</div>
          </FormItem>
        )}

        <FormItem className="mb-1">
          <span className="label-input ml-3">
            {translate('storeScoutings.image')}
          </span>
          <div className="image-store">

            <ImageView
              list={storeScoutingImageMappings.map(item => ({ ...item, image: { url: item.url } }))}
              onOpenPreview={handleOpenImagePreview}
              className="store-images-grid"
              type="thumb"
              hasMask={false}
              colSpan={8}
            />
            <ImagePreviewModal
              visible={visible}
              selectedItem={selectedItem}
              selectedList={selectedList}
              onClose={handleCloseImagePreview}
              dispatch={dispatch}
              showInfo={false}
            />
          </div>

        </FormItem>
        {
          visibleChat &&
          <Card
            title={
              <div style={{ fontSize: 12 }}>
                {translate('general.actions.discuss')}
              </div>
            }
            className="card-chatbox"
          >
            <div className="sale-order-chat-box mt-3">
              <ChatBox
                userInfo={user as AppUser || AppUser}
                discussionId={storeScouting.rowId}
                getMessages={storeScoutingRepository.listPost}
                classFilter={PostFilter}
                postMessage={storeScoutingRepository.createPost}
                countMessages={storeScoutingRepository.countPost}
                deleteMessage={storeScoutingRepository.deletePost}
                attachFile={storeScoutingRepository.saveFile}
                suggestList={storeScoutingRepository.singleListAppUser}
              />
            </div>
          </Card>
        }
      </ModalBody>
    </Modal>
  );
}
