import { Dropdown } from 'antd';
import Menu from 'antd/lib/menu';
import classNames from 'classnames';
import { INF_CONTAINER_HEIGHT } from 'core/config';
import { Model, ModelFilter } from 'core/models';
import { AppUser } from 'models/AppUser';
import { FileModel } from 'models/ChatBox/FileModel';
import { Post } from 'models/Post';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './ChatBox.scss';
import ContentEditable from './ContentEditable';
import useChatBox from './ChatBoxHook';
import { sortList } from './ChatBoxHook';
import { v4 as uuidv4 } from 'uuid';
import Spin from 'antd/lib/spin';
import Avatar, { ConfigProvider } from 'react-avatar';
import { generalLanguageKeys } from 'config/consts';
import { useTranslation } from 'react-i18next';

export interface ChatBoxProps<TFilter extends ModelFilter> {
  userInfo: AppUser;
  discussionId: string;
  classFilter: new () => TFilter;
  getMessages?: (TModelFilter?: TFilter) => Promise<Post[]>;
  countMessages?: (TModelFilter?: TFilter) => Promise<number>;
  postMessage?: (Message: Post) => Promise<Post>;
  deleteMessage?: (Message: Post) => Promise<boolean>;
  suggestList?: (filter: TFilter) => Promise<Model[]>;
  attachFile?: (File: File) => Promise<FileModel>;
}

const loading = (
  <div className="chat-box__loading" key={0}>
    <Spin size="small" />
  </div>
);

function ChatBox(props: ChatBoxProps<ModelFilter>) {

  const [translate] = useTranslation();
  const {
    userInfo,
    discussionId,
    classFilter,
    getMessages,
    countMessages,
    postMessage,
    deleteMessage,
    attachFile,
    suggestList,
  } = props;

  const {
    sortType,
    list,
    hasMore,
    handleMouseLeave,
    handleInfiniteLoad,
    handleCancel,
    handleMenuClick,
    handleOk,
    popupConfirm,
    handleSend,
    handleAttachFile,
    contentEditableRef,
    inputRef,
    handleClickViewImg,
  } = useChatBox(
    discussionId,
    userInfo,
    getMessages,
    countMessages,
    postMessage,
    deleteMessage,
    attachFile,
    classFilter,
  );


  const menuSort = React.useMemo(() => {
    return (
      <Menu onClick={handleMenuClick} selectedKeys={[sortType.orderType]}>
        {sortList.map(item => {
          return (
            <Menu.Item key={item.orderType}>{item.title.toUpperCase()}</Menu.Item>
          );
        })}
      </Menu>
    );
  }, [handleMenuClick, sortType]);

  return (
    <div className="chat-box__container">
      <div className="chat-box__header">
        <div className="chat-box__title">
          <span>{'Bình luận'}</span>
        </div>
        <div className="chat-box__sort">
          <span>SORT:</span>
          <Dropdown overlay={menuSort} trigger={['click']}>
            <div className="sort__options">
              <span className="sort__page">
                {sortType?.title.toUpperCase()}
              </span>
              <i className="sort__icon tio-chevron_down"></i>
            </div>
          </Dropdown>
        </div>
      </div>
      <div
        className="chat-box__body infinite-container"
        style={{ height: INF_CONTAINER_HEIGHT, overflow: 'auto' }}
      >
        <InfiniteScroll
          initialLoad={false}
          loadMore={handleInfiniteLoad}
          isReverse={true}
          hasMore={hasMore && !loading}
          loader={loading}
          useWindow={false}
          threshold={20}
        >
          {list.length > 0 &&
            list.map(currentItem => (
              <div
                key={uuidv4()}
                onMouseLeave={handleMouseLeave}
                className={classNames(
                  'chat-box__content d-flex mb-4 p-2',
                  currentItem.creatorId === userInfo?.id
                    ? 'reverse-row'
                    : 'justify-content-start',
                )}
              >
                {
                  currentItem.creator?.avatar &&
                  <div className="img-cont-msg"> <img
                    src={currentItem.creator?.avatar}
                    className="rounded-circle user_img_msg"
                    alt="IMG"
                  />
                  </div>

                }
                {!currentItem.creator?.avatar &&
                  <div className="img-cont-not-img">
                    <ConfigProvider colors={['red', 'green', 'blue']}>
                      <Avatar
                        maxInitials={1}
                        round={true}
                        size="22"
                        name={currentItem?.creator?.displayName}
                      />
                    </ConfigProvider>
                  </div>

                }
                {currentItem.isOwner}
                <div
                  className={classNames(
                    'msg-container',
                    currentItem.creatorId === userInfo?.id
                      ? 'msg-container--owner'
                      : 'msg-container--not-owner',
                  )}
                >
                  <div
                    onClick={handleClickViewImg(currentItem)}
                    dangerouslySetInnerHTML={{ __html: currentItem.content }}
                  />
                  <span className="msg-time">
                    {currentItem.createdAt.format('ll')}
                  </span>
                </div>
                <div className="msg-icon">
                  {currentItem.isPopup ? (
                    <div className="confirm-box">
                      <span
                        className="confirm-box__delete-button"
                        onClick={handleOk(currentItem)}
                      >
                        Xóa
                      </span>
                      <span
                        className="confirm-box__cancel-button"
                        onClick={handleCancel()}
                      >
                        Hủy
                      </span>
                    </div>
                  ) : (
                      <i
                        className="error-text tio-remove_from_trash"
                        onClick={popupConfirm(currentItem)}
                      ></i>
                    )}
                </div>
              </div>
            ))}
        </InfiniteScroll>
      </div>
      <div className="chat-box__footer">
        <ContentEditable
          ref={contentEditableRef}
          suggestList={suggestList}
          sendValue={handleSend}
        />
        <div className="chat-box__action">
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={e => handleAttachFile(e.target.files)}
          />
          <i
            className="tio-attachment_diagonal"
            onClick={() => {
              inputRef.current.click();
            }}
          ></i>
          <button
            className="btn btn-sm btn-primary float-right mr-2 d-flex"
            onClick={handleSend}
          >
            <i className="fa mr-2 fa-paper-plane"></i>
            {translate(generalLanguageKeys.actions.send)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
