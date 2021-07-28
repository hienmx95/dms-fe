import { AxiosError, AxiosResponse } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE, STANDARD_DATE_TIME_FORMAT } from 'core/config';
import { Filter } from 'core/filters';
import { isDateTimeValue } from 'core/helpers/date-time';
import { flatten, unflatten } from 'core/helpers/json';
import { Model, ModelFilter } from 'core/models';
import { notification } from 'helpers';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import moment from 'moment';
import queryString from 'query-string';
import React, { Dispatch, SetStateAction } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';

export class ERouteOwnerService {
  public useStoreContentMaster(
    getList: (filter: StoreFilter) => Promise<Store[]>,
    count: (filter: StoreFilter) => Promise<number>,
    saleEmployeeId?: any,
  ): [
    StoreFilter,
    Dispatch<SetStateAction<StoreFilter>>,
    Store[],
    Dispatch<SetStateAction<Store[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<StoreFilter>(new StoreFilter());
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Store[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        filter.saleEmployeeId.equal = saleEmployeeId;
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
        setLoadList(false);
      }
    }, [count, filter, getList, loadList, saleEmployeeId]);
    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);
    const handleChangeFilter = React.useCallback(() => {
      filter.skip = 0;
      Promise.all([getList(filter), count(filter)])
        .then(([listItem, totalItem]) => {
          setList(listItem);
          setTotal(totalItem);
          handleSearch();
        })
        .finally(() => {
          setLoading(false);
        });
    }, [getList, filter, count, setList, setTotal, handleSearch, setLoading]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      handleChangeFilter,
      total,
    ];
  }

  public useQuery<TFilter extends ModelFilter>(
    modelClass,
  ): [TFilter, Dispatch<SetStateAction<TFilter>>] {
    const { search, pathname } = useLocation();
    const history = useHistory();
    const modelFilter: TFilter = React.useMemo(() => {
      const modelFilter: TFilter = new modelClass();
      const parsedQuery = queryString.parse(search) as any;
      const params = unflatten(parsedQuery);
      Object.entries(params).forEach(([key, value]) => {
        switch (key) {
          case nameof(modelFilter.skip):
            modelFilter.skip = parseInt(value as string, 10) || 0;
            break;

          case nameof(modelFilter.take):
            modelFilter.take = parseInt(value as string, 10) || DEFAULT_TAKE;
            break;

          case nameof(modelFilter.orderBy):
            modelFilter.orderBy = value as any;
            break;

          case nameof(modelFilter.orderType):
            modelFilter.orderType = value as any;
            break;

          case nameof(modelFilter.tab):
            modelFilter.tab = value as any;
            break;

          default:
            if (
              modelFilter.hasOwnProperty(key) &&
              typeof modelFilter[key] === 'object' &&
              modelFilter[key] !== null &&
              typeof value === 'object' &&
              value !== null
            ) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (isDateTimeValue(filterValue as any)) {
                  modelFilter[key][filterKey] = moment(
                    new Date(filterValue as string),
                  );
                } else {
                  modelFilter[key][filterKey] = filterValue;
                }
              });
            }
            break;
        }
      });
      return modelFilter;
    }, [modelClass, search]);

    const setModelFilter = React.useCallback(
      (modelFilter: TFilter) => {
        Object.entries(modelFilter).forEach(([filterKey, filterValue]) => {
          if (
            typeof modelFilter[filterKey] === 'object' &&
            typeof modelFilter[filterKey] !== undefined
          ) {
            Object.entries(filterValue).forEach(([fk]) => {
              if (
                typeof filterValue[fk] === 'object' &&
                typeof filterValue[fk] !== undefined
              ) {
                if (filterValue[fk]?._isAMomentObject) {
                  filterValue[fk] = filterValue[fk].format(
                    STANDARD_DATE_TIME_FORMAT,
                  );
                }
              }
            });
          }
        });
        history.replace({
          pathname,
          search: queryString.stringify(flatten(modelFilter)),
        });
      },
      [history, pathname],
    );

    return [modelFilter, setModelFilter];
  }
  public useMaster<T extends Model, TFilter extends ModelFilter>(
    modelClass: new () => T,
    modelFilterClass: new () => TFilter,
    getDetail: (id: number | string) => Promise<T>,
    countNew: (filter: TFilter) => Promise<number>,
    getListNew: (filter: TFilter) => Promise<T[]>,
    countPending: (filter: TFilter) => Promise<number>,
    getListPending: (filter: TFilter) => Promise<T[]>,
    countCompleted: (filter: TFilter) => Promise<number>,
    getListCompleted: (filter: TFilter) => Promise<T[]>,
    tabIndex: number,
    firstTime: boolean,
    setFirstTime: Dispatch<SetStateAction<boolean>>,
  ): [
    TFilter,
    Dispatch<SetStateAction<TFilter>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    boolean,
    T,
    (id: string | number) => () => void,
    () => void,
    <TF extends Filter>(field: string) => (f: TF) => void,
    () => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    number,
    number,
    number,
  ] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [filter, setFilter] = this.useQuery<TFilter>(modelFilterClass);
    const [listNew, setListNew] = React.useState<T[]>([]);
    const [listPending, setListPending] = React.useState<T[]>([]);
    const [listCompleted, setListCompleted] = React.useState<T[]>([]);
    const [totalNew, setTotalNew] = React.useState<number>(0);
    const [totalPending, setTotalPending] = React.useState<number>(0);
    const [totalCompleted, setTotalCompleted] = React.useState<number>(0);
    const [previewModel, setPreviewModel] = React.useState<T>(new modelClass());
    const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
    const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    const [resetSelect, setResetSelect] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        if (tabIndex === 2) {
          filter.orderBy = 'createdAt';
          filter.orderType = 'DESC';
          Promise.all([getListNew(filter), countNew(filter)])
            .then(([list, total]) => {
              setListNew(list);
              setTotalNew(total);
              setLoadList(false);
            })
            .finally(() => {
              setLoadList(false);
              setLoading(false);
              setResetSelect(true);
            });
        } else if (tabIndex === 3) {
          filter.orderBy = 'updatedAt';
          filter.orderType = 'DESC';
          Promise.all([getListPending(filter), countPending(filter)])
            .then(([list, total]) => {
              setListPending(list);
              setTotalPending(total);
              setLoadList(false);
            })
            .finally(() => {
              setLoadList(false);
              setLoading(false);
              setResetSelect(true);
            });
        } else if (tabIndex === 4) {
          filter.orderBy = 'updatedAt';
          filter.orderType = 'DESC';
          Promise.all([getListCompleted(filter), countCompleted(filter)])
            .then(([list, total]) => {
              setListCompleted(list);
              setTotalCompleted(total);
              setLoadList(false);
            })
            .finally(() => {
              setLoadList(false);
              setLoading(false);
              setResetSelect(true);
            });
        }
        if (firstTime === true) {
          countPending(filter).then(total => {
            setTotalPending(total);
          });
          countCompleted(filter).then(total => {
            setTotalCompleted(total);
          });
          setFirstTime(false);
        }
      }
    }, [
      countCompleted,
      countNew,
      countPending,
      filter,
      firstTime,
      getListCompleted,
      getListNew,
      getListPending,
      loadList,
      setFirstTime,
      tabIndex,
    ]);

    const handleOpenPreview = React.useCallback(
      (id: number | string) => {
        return () => {
          setPreviewModel(new modelClass());
          setPreviewLoading(true);
          setPreviewVisible(true);
          getDetail(id)
            .then((tDetail: T) => {
              setPreviewModel(tDetail);
            })
            .finally(() => {
              setPreviewLoading(false);
            });
        };
      },
      [getDetail, modelClass],
    );

    const handleClosePreview = React.useCallback(() => {
      setPreviewVisible(false);
      setPreviewModel(new modelClass());
    }, [modelClass]);

    const handleFilter = React.useCallback(
      <TF extends Filter>(field: string) => {
        return (f: TF) => {
          const { skip, take, tab } = ModelFilter.clone<TFilter>(
            new modelFilterClass(),
          );
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
              skip,
              take,
              tab,
            }),
          );
          setLoadList(true);
        };
      },
      [filter, modelFilterClass, setFilter],
    );

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, []);

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take, tab } = ModelFilter.clone<TFilter>(
        new modelFilterClass(),
      );
      setFilter(
        ModelFilter.clone<TFilter>({
          ...filter,
          skip,
          take,
          tab,
        }),
      );
      setLoadList(true);
    }, [filter, modelFilterClass, setFilter]);

    const handleReset = React.useCallback(() => {
      setFilter(ModelFilter.clone<TFilter>(new modelFilterClass()));
      setLoadList(true);
      setIsReset(true);
    }, [modelFilterClass, setFilter, setIsReset]);

    return [
      filter,
      setFilter,
      loading,
      setLoading,
      previewLoading,
      previewVisible,
      previewModel,
      handleOpenPreview,
      handleClosePreview,
      handleFilter,
      handleSearch,
      handleReset,
      isReset,
      setIsReset,
      handleDefaultSearch,
      setLoadList,
      resetSelect,
      setResetSelect,
      listNew,
      setListNew,
      listPending,
      setListPending,
      listCompleted,
      setListCompleted,
      totalNew,
      totalPending,
      totalCompleted,
    ];
  }

  public useImport<TFilter extends ModelFilter, T extends Model>(
    onImport: (file: File, filter: TFilter) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    filter?: TFilter,
  ): [
      (event: React.ChangeEvent<HTMLInputElement>) => void,
      T[],
      Dispatch<SetStateAction<T[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      string,
      React.MutableRefObject<HTMLInputElement>,
    ] {
    const [translate] = useTranslation();
    const [contents, setContents] = React.useState<any>([]);
    const [errVisible, setErrVisible] = React.useState<boolean>(false);
    const [errorModel, setErrorModel] = React.useState<string>();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleImport = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
          const file: File = event.target.files[0];
          setLoading(true);
          onImport(file, filter)
            .then(event => {
              setContents(event);
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
            })
            .catch((error: AxiosError<any>) => {
              setErrorModel(error.response.data);
              setErrVisible(true);
            })
            .finally(() => {
              setLoading(false);
              if (inputRef.current) inputRef.current.value = null;
            });
        }
    }, [filter, onImport, setLoading, translate]);

    return [
      handleImport,
      contents,
      setContents,
      errVisible,
      setErrVisible,
      errorModel,
      inputRef,
    ];
  }

  public useExport<T extends Model>(
    exportFile: (t: T) => Promise<AxiosResponse<any>>,
    t: T,
  ): [() => void, boolean, Dispatch<SetStateAction<boolean>>] {
    const [isError, setIsError] = React.useState<boolean>(false);

    const handleExport = () => {
      exportFile(t)
        .then((response: AxiosResponse<any>) => {
          const fileName = response.headers['content-disposition']
            .split(';')
            .find((n: any) => n.includes('filename='))
            .replace('filename=', '')
            .trim();
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: 'application/octet-stream',
            }),
          );
          saveAs(url, fileName);
        })
        .catch((error: AxiosError<any>) => {
          if (error.response && error.response.status === 400) {
            setIsError(true);
          }
        });
    };
    return [handleExport, isError, setIsError];
  }
}

export const eRouteOwnerService: ERouteOwnerService = new ERouteOwnerService();
