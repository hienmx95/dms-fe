import { DateFilter, Filter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { notification } from 'helpers';
import { Moment } from 'moment';
import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
  useEffect,
  useReducer,
  Reducer,
} from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'core/helpers/debounce';
import { DEFAULT_TAKE, INFINITE_SCROLL_TAKE } from 'core/config/consts';
import { useHistory, useLocation } from 'react-router';
import { swapPosition } from 'core/helpers/array';
import queryString from 'query-string';
import moment from 'moment';
import { AxiosError } from 'axios';

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

export class MonitorService {
  public useMasterList<T extends Model, TFilter extends ModelFilter>(
    modelFilterClass: new () => TFilter,
    count: (filter: TFilter) => Promise<number>,
    getList: (filter: TFilter) => Promise<T[]>,
    isDefault?: boolean, // decide each time skip 10 or 20
    requireField1?: string,
  ): [
    /* return filter, setFilter, rawList, loading list, total list, handleFilter, isReset, setIsReset, handleReset, handleDefaultSearch */
    TFilter,
    Dispatch<SetStateAction<TFilter>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    number,
    <TF extends Filter>(field: string) => (f: TF) => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    () => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    DateFilter,
    Dispatch<SetStateAction<DateFilter>>,
  ] {
    const [filter, setFilter] = crudService.useQuery<TFilter>(modelFilterClass);
    const [list, setList] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [total, setTotal] = React.useState<number>(0);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    const [resetSelect, setResetSelect] = React.useState<boolean>(false);
    const [preLoadImage, setPreLoadImage] = React.useState<boolean>(false); // storeImageMonitor only
    const ref = useRef<number>(0);

    const [dateFilter, setDateFilter] = React.useState<DateFilter>(
      new DateFilter(),
    );
    React.useEffect(() => {
      let scrollFilter = {
        ...filter,
        take: isDefault ? DEFAULT_TAKE : INFINITE_SCROLL_TAKE,
      };
      if (ref.current === 0) {
        scrollFilter = { ...scrollFilter, skip: 0 };
        ref.current = ref.current + 1; // decide next load is not the first load
      } // if the first load has skip > 0, set it to 0 and return
      if (typeof requireField1 !== 'undefined') {
        if (typeof filter[requireField1].lessEqual === 'undefined') {
          // return;
          const date: Date = moment()
            .startOf('day')
            .toDate();
          scrollFilter = {
            ...scrollFilter,
            [requireField1]: {
              greaterEqual: moment(date.getTime()),
              lessEqual: moment(date.getTime() + 86399999),
            },
          };
          setFilter({ ...scrollFilter });
          setDateFilter({ ...scrollFilter[requireField1] });
        }
      }

      if (loadList) {
        setLoading(true);
        Promise.all([getList(scrollFilter), count(scrollFilter)])
          .then(data => {
            const newList = data[0].map(item => ({ ...item, key: uuidv4() }));
            setList([...newList]);
            setTotal(data[1]);
          })
          .catch((error: AxiosError<any>) => {
            if (error && error.response && error.response.data) {
              notification.error({
                message: error?.response?.data?.message,
              });
            }
          })
          .finally(() => {
            setLoading(false);
            setResetSelect(true);
          });
        setLoadList(false); // setLoadList === false not only in finally prevent bug double load
      }
    }, [
      count,
      filter,
      getList,
      list,
      loadList,
      setFilter,
      isDefault,
      requireField1,
    ]);

    const handleFilter = React.useCallback(
      <TF extends Filter>(field: string) => {
        return (f: TF) => {
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
              skip: 0,
              take: isDefault ? DEFAULT_TAKE : INFINITE_SCROLL_TAKE,
            }),
          );
          setLoadList(true);
          setPreLoadImage(true); // reset imagePreviewList
        };
      },
      [filter, setFilter, isDefault],
    );

    const handleDefaultSearch = React.useCallback(() => {
      setFilter(
        ModelFilter.clone<TFilter>({
          ...filter,
          skip: 0,
          take: isDefault ? DEFAULT_TAKE : INFINITE_SCROLL_TAKE,
        }),
      );
      setLoadList(true);
      setPreLoadImage(true); // reset imagePreviewList
    }, [filter, setFilter, isDefault]);

    const handleReset = React.useCallback(() => {
      setFilter(
        ModelFilter.clone<TFilter>({
          ...new modelFilterClass(),
          skip: 0,
          take: isDefault ? DEFAULT_TAKE : INFINITE_SCROLL_TAKE,
        }),
      );
      setDateFilter(new DateFilter());
      setLoadList(true);
      setIsReset(true);
      setPreLoadImage(true); // reset imagePreviewList
    }, [modelFilterClass, setFilter, isDefault, setDateFilter]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
      setPreLoadImage(true); // reset imagePreviewList
    }, []);

    /* return filter, setFilter, rawList, loading list, total list, handleFilter, isReset, setIsReset, handleReset, handleSearch, handleDefaultSearch */
    return [
      filter,
      setFilter,
      list,
      setList,
      setLoadList,
      loading,
      setLoading,
      total,
      handleFilter,
      isReset,
      setIsReset,
      handleReset,
      handleSearch,
      handleDefaultSearch,
      resetSelect,
      setResetSelect,
      loadList,
      preLoadImage,
      setPreLoadImage,
      dateFilter,
      setDateFilter,
    ];
  }

  public useMasterDataSource<T extends Model, TDataTable extends Model>(
    list: T[],
    transformMethod: (item: T) => TDataTable[],
  ): [
    TDataTable[],
    (
      value: any,
      record: TDataTable,
      colIndex: number,
      colNumber?: number,
    ) => any,
  ] {
    const [dataSource, setDataSource] = React.useState<TDataTable[]>([]);

    React.useEffect(() => {
      let tableData = [];
      tableData =
        list && list.length
          ? list.map((itemList: T) => transformMethod(itemList))
          : [];
      let index = 0;
      const dataList =
        tableData.length > 0
          ? tableData.flat(1).map(data => {
              if (!data.title) {
                index = index + 1;
              }
              return { ...data, indexInTable: index };
            })
          : [];
      setDataSource([...dataList]);
    }, [list, setDataSource, transformMethod]);

    const renderCell = React.useCallback(
      (
        value: any,
        record: TDataTable,
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
            children: value,
            props: {
              rowSpan: 1,
              colSpan,
            },
          };
        }
        return {
          children: value,
          props: {
            rowSpan: record.rowSpan ? record.rowSpan : 0,
            colSpan: 1,
          },
        };
      },
      [],
    );

    /* return dataSource */
    return [dataSource, renderCell];
  }

  public useMasterPreview<TDetail extends Model, TDataTable extends Model>(
    getDetail?: (id: number, date: Moment) => Promise<TDetail[]>,
    transformMethod?: (item: TDetail) => TDataTable[],
  ): [
    boolean,
    (id: number, date: Moment) => void,
    () => void,
    TDetail[] | TDataTable[],
    boolean,
  ] {
    const [translate] = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
    const [previewList, setPreviewList] = React.useState<
      TDataTable[] | TDetail[]
    >([]);

    const handleOpenPreview = React.useCallback(
      (id: number, date: Moment) => {
        setPreviewLoading(true);
        getDetail(id, date)
          .then((list: TDetail[]) => {
            let dataTable = [];
            if (typeof transformMethod === 'function') {
              let index = 0;
              dataTable =
                list?.length > 0
                  ? list
                      .map(item => transformMethod(item))
                      .flat(1)
                      .map(item => {
                        if (!item.title) {
                          index = index + 1;
                        }
                        return { ...item, indexInTable: index };
                      })
                  : [];
            }
            setPreviewList([...dataTable]);
            if (!list.length) {
              setTimeout(() => {
                notification.info({
                  message: translate('general.info.noData'),
                });
              }, 0);
            }
          })
          .finally(() => {
            setPreviewLoading(false);
          });
        setIsOpen(true);
      },
      [getDetail, transformMethod, translate],
    );

    const handleClosePreview = React.useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    /* isOpen, handleOpenPreview, handleClosePreview, previewList, previewLoading */
    return [
      isOpen,
      handleOpenPreview,
      handleClosePreview,
      previewList,
      previewLoading,
    ];
  }

  public useTableScroll<T extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    list: T[],
    setList: Dispatch<SetStateAction<T[]>>,
    total: number,
    getList: (filter: TFilter) => Promise<T[]>,
  ): [(event: any) => void] {
    const [translate] = useTranslation();
    const tableScrollListener = React.useCallback(
      debounce(event => {
        const target = event.target as HTMLTableElement;
        const scrollHeight = target.scrollHeight;
        const currentScroll = target.scrollTop;
        const clientHeight = target.clientHeight;
        if (currentScroll + clientHeight >= scrollHeight) {
          if (filter.skip + 10 <= total) {
            setFilter({ ...filter, skip: filter.skip + 10 });
            setLoading(true);
            getList(filter)
              .then((newList: T[]) => {
                setList([...list, ...newList]);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setTimeout(() => {
              notification.info({
                message: translate('general.info.reachEnd'),
                description: translate('general.info.reachEnd'),
              });
            }, 0);
          }
        }
      }),
      [filter, getList, list, setFilter, setList, setLoading, total, translate],
    );
    /* return listener for body table */
    return [tableScrollListener];
  }

  public useImagePreview<T extends Model>(
    getDetail?: (
      storeId: number,
      saleEmployeeId: number,
      date: Moment,
    ) => Promise<T[]>,
  ) {
    const history = useHistory();
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
      (route: string) => {
        return () => {
          dispatch({ type: ImagePreviewModalActionEnum.CLOSE_MODAL });
          history.push(route); // reset url search
          window.location.reload(); // reload location
        };
      },
      [history],
    ); // close preview

    useEffect(() => {
      if (ref.current) {
        const parsedQuery = queryString.parse(search) as any;
        if (
          parsedQuery.isOpen &&
          parsedQuery.storeId &&
          parsedQuery.saleEmployeeId &&
          parsedQuery.date &&
          typeof getDetail === 'function'
        ) {
          getDetail(
            parsedQuery.storeId,
            parsedQuery.saleEmployeeId,
            moment(parsedQuery.date),
          ).then((res: T[]) => {
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

export const monitorService: MonitorService = new MonitorService();
