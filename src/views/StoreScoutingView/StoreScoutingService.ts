import { swapPosition } from 'core/helpers/array';
import { Model } from 'core/models';
import { notification } from 'helpers';
import queryString from 'query-string';
import {
    Reducer, useCallback,
    useEffect,
    useReducer, useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

export interface ImagePreviewModalState<T extends Model> {
  visible?: boolean;
  selectedItem?: T;
  selectedList?: T[];
}

export interface ImagePreviewModalAction<T extends Model> {
  type?: ImagePreviewModalActionEnum;
  data?: ImagePreviewModalState<T>;
  visible?: boolean;
  selectedItem?: T;
  selectedList?: T[];
}

export enum ImagePreviewModalActionEnum {
  SET_LIST, // when update any item in list, we should update list
  OPEN_MODAL,
  CLOSE_MODAL,
}

export class StoreScoutingService {

  public useImagePreview<T extends Model>(
    getDetail?: () => Promise<T[]>,
  ) {
    const [translate] = useTranslation();
    const [{ visible, selectedItem, selectedList }, dispatch] = useReducer<
      Reducer<ImagePreviewModalState<T>, ImagePreviewModalAction<T>>
    >(storeImagePreviewReducer, {
      visible: false,
    });
    const ref = useRef<boolean>(true);
    const { search } = useLocation();

    const handleOpenImagePreview = useCallback(
      (model?: T, list?: T[], index?: number) => {
        if (
          typeof model !== 'undefined' &&
          typeof list !== 'undefined' &&
          typeof index !== 'undefined'
        ) {
          dispatch({
            type: ImagePreviewModalActionEnum.OPEN_MODAL,
            data: {
              selectedItem: model, // for update in preview
              selectedList: swapPosition(list, index, 0), // swap selectedItem to the first position
              visible: true,
            },
          });
        }
      },
      [],
    ); // setCurrentItem and list. Open preview when clicking on item

    const handleCloseImagePreview = useCallback(
      () => {
        dispatch({ type: ImagePreviewModalActionEnum.CLOSE_MODAL });
      },
      [],
    ); // close preview

    useEffect(() => {
      if (ref.current) {
        const parsedQuery = queryString.parse(search) as any;
        if (
          parsedQuery.isOpen &&
          typeof getDetail === 'function'
        ) {
          getDetail().then((res: T[]) => {
            if (res.length > 0) {
              dispatch({
                type: ImagePreviewModalActionEnum.OPEN_MODAL,
                data: {
                  selectedItem: res[0],
                  selectedList: res,
                  visible: true, // open modal
                },
              });
              return;
            }
            notification.info({
              message: translate('general.info.noData'),
            });
          });
        }
        ref.current = false;
      }
    }, [search, getDetail, translate]); // effect to open preview

    return {
      handleOpenImagePreview,
      handleCloseImagePreview,
      visible,
      selectedItem,
      selectedList,
      dispatch,
    };
  }
}

export function storeImagePreviewReducer<T extends Model>(
  state: ImagePreviewModalState<T>,
  action: ImagePreviewModalAction<T>,
): ImagePreviewModalState<T> {
  switch (action.type) {
    case ImagePreviewModalActionEnum.OPEN_MODAL: {
      return {
        ...state,
        ...action.data,
      };
    }
    case ImagePreviewModalActionEnum.CLOSE_MODAL: {
      return {
        ...state,
        visible: false,
      };
    }
    case ImagePreviewModalActionEnum.SET_LIST: {
      return {
        ...state,
        selectedList: action.selectedList,
      };
    }
  }
}

export const storeScoutingService: StoreScoutingService = new StoreScoutingService();
