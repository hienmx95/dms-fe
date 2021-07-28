import { ModelFilter } from 'core/models';
import { Post } from 'models/Post';
import { AppUser } from 'models/AppUser';
import { FileModel } from 'models/ChatBox/FileModel';
import moment from 'moment';

import {
  Reducer, RefObject, useCallback,


  useEffect, useReducer,


  useRef, useState,
} from 'react';

export interface FilterAction extends ModelFilter{
  action: string;
  skip?: number;
  take?: number;
  data?: any;
  discussionId?: string;
}

export interface ListAction {
  action: string;
  data?: Post[];
  message?: Post;
}

function updateFilter<TFilter extends ModelFilter>(
  state: TFilter,
  filterAction: FilterAction,
): TFilter {
  switch (filterAction.action) {
    case 'RESET':
      return {
        ...filterAction.data,
        discussionId: { equal: filterAction.discussionId },
        orderType: 'DESC',
      };

    case 'LOAD_MORE':
      return {
        ...state,
        skip: filterAction.skip,
        take: filterAction.take,
      };

    case 'ORDER':
      return {
        ...state,
        orderType: filterAction.orderType,
        skip: 0,
        take: 10,
      };
  }
} // filter reducer

function updateList(state: Post[], listAction: ListAction) {
  switch (listAction.action) {
    case 'UPDATE':
      return [...listAction.data];
    case 'CONCAT':
      const listIDs = new Set(state.map(({ id }) => id));
      const combined = [
        ...state,
        ...listAction.data.filter(({ id }) => !listIDs.has(id)),
      ];
      return combined;
    case 'ADD_SINGLE':
      return [...state, listAction.message];
  }
}

export const sortList = [
         { orderType: 'DESC', title: 'Mới nhất' },
         { orderType: 'ASC', title: 'Cũ nhất' },
       ]; // sort enum list

export default function useChatBox<TFilter extends ModelFilter>(
  discussionId: string,
  userInfo: AppUser,
  getMessages: (TModelFilter?: TFilter) => Promise<Post[]>,
  countMessages: (TModelFilter?: TFilter) => Promise<number>,
  postMessage: (Message: Post) => Promise<Post>,
  deleteMessage: (Message: Post) => Promise<boolean>,
  attachFile: (File: File) => Promise<FileModel>,
  filterClass?: new () => TFilter,
) {
  const [sortType, setSortType] = useState<any>({
    type: 'DESC',
    title: 'Mới nhất',
  });


  const [list, dispatchList] = useReducer(updateList, []);

  const [countMessage, setCountMessage] = useState<number>();

  const [filter, dispatchFilter] = useReducer<
    Reducer<TFilter, FilterAction>
  >(updateFilter, {
    ...new filterClass(),
    discussionId: {
      equal: discussionId,
    },
    orderType: 'DESC',
  });

  const [hasMore, setHasMore] = useState<boolean>(true);

  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>();

  const contentEditableRef: React.LegacyRef<HTMLDivElement> = useRef<
    HTMLDivElement
  >();

  const firstLoad = useRef<boolean>(true);
  useEffect(() => {
    if (firstLoad.current && discussionId) {
      firstLoad.current = false;
      dispatchFilter({
        action: 'RESET',
        data: new filterClass(),
        discussionId,
      });
    }
  }, [discussionId, filterClass]); // preLoad


  useEffect(() => {
    if (getMessages && countMessages && !firstLoad.current) {

      if (typeof filter.orderType === 'undefined') {
        filter.orderType = 'DESC';
      }
      Promise.all([getMessages(filter), countMessages(filter)]).then(
        ([list, total]: [Post[], number]) => {
          if (list && total) {
            if (filter.skip > 0) {
              dispatchList({
                action: 'CONCAT',
                data: list.reverse(),
              });
            } else {
              dispatchList({
                action: 'UPDATE',
                data: list.reverse(),
              });
            }
            setCountMessage(total);
          }
        },
      );
    }
  }, [getMessages, filter, countMessages]);

  const handleMouseLeave = useCallback(() => {
    if (list && list.length > 0) {
      const existPopup = list.filter(currentItem => {
        return currentItem.isPopup;
      });
      if (existPopup.length > 0) {
        const newListMessages = list.map(currentItem => {
          currentItem.isPopup = false;
          return currentItem;
        });
        dispatchList({
          action: 'UPDATE',
          data: newListMessages,
        });
      } else return;
    }
  }, [list]);

  const handleMenuClick = useCallback((e: any) => {
    const sortType = sortList.filter(current => current.orderType === e.key)[0];
    setSortType(sortType);
    dispatchFilter({
      action: 'ORDER',
      orderType: sortType.orderType,
    });
  }, []);

  const handleSend = useCallback(() => {
    postMessage({
      ...new Post(),
      discussionId,
      content: contentEditableRef.current.innerHTML,
      creatorId: userInfo.id,
      // creator: userInfo,
      createdAt: moment(),
    }).then((res: Post) => {
      dispatchList({
        action: 'ADD_SINGLE',
        message: res,
      });
      contentEditableRef.current.innerHTML = '';
    });
  }, [userInfo, discussionId, postMessage]);

  const popupConfirm = useCallback(
    (message: Post) => () => {
      const newListMessages = list.map(currentItem => {
        if (currentItem.id === message.id) currentItem.isPopup = true;
        return currentItem;
      });
      dispatchList({
        action: 'UPDATE',
        data: newListMessages,
      });
    },
    [list],
  );

  const handleOk = useCallback(
    (message: Post) => () => {
      deleteMessage(message).then((res: boolean) => {
        if (res) {
          const newListMessages = list.filter(currentItem => {
            return currentItem.id !== message.id;
          });
          dispatchList({
            action: 'UPDATE',
            data: newListMessages,
          });
        }
      });
    },
    [deleteMessage, list],
  );

  const handleCancel = useCallback(
    () => () => {
      const newListMessages = list.map(currentItem => {
        currentItem.isPopup = false;
        return currentItem;
      });
      dispatchList({
        action: 'UPDATE',
        data: newListMessages,
      });
    },
    [list],
  );

  const handleInfiniteLoad = useCallback(() => {
    if (countMessage > list.length) {
      dispatchFilter({
        action: 'LOAD_MORE',
        skip: filter.skip + 10,
        take: filter.take,
      });
    } else {
      setHasMore(false);
    }
  }, [countMessage, list, filter]);

  const setEndContentEditable = useCallback(() => {
    let range;
    let selection;
    if (document.createRange) {
      range = document.createRange();
      range.setStart(
        contentEditableRef.current,
        contentEditableRef.current.childNodes.length,
      );
      range.collapse(true);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  const handleAttachFile = useCallback(
    (selectorFiles: FileList) => {
      if (typeof attachFile === 'function') {
        const fileValue = selectorFiles[0];
        inputRef.current.value = null;
        attachFile(fileValue).then((res: FileModel) => {
          if (res) {
            let hrefItem;
            const fileType = fileValue.type.split('/')[0];
            if (fileType === 'image') {
              hrefItem = `<image src="${res.path}" alt="IMG">`;
            } else {
              hrefItem = `<a href="${res.path}">${res.name}</a>`;
            }
            contentEditableRef.current.innerHTML += hrefItem;
            setEndContentEditable();
          }
        });
      }
    },
    [attachFile, setEndContentEditable],
  );

  const handleClickViewImg = useCallback(
    (message: Post) => () => {
      const contentImg = message?.content.split(' ');
      if (contentImg[0] === '<img') {
        const linkImage = contentImg[1].split('"');
        const url = document.URL;
        const urlTmp = url.split('/dms/');
        window.open(urlTmp[0] + linkImage[1]);
      }
    }, []);

  return {
    sortType,
    setSortType,
    list,
    hasMore,
    dispatchList,
    handleMouseLeave,
    setEndContentEditable,
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
  };
}
