import { flatten, unflatten } from 'core/helpers/json';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { translate } from 'core/helpers/internationalization';
import { Modal } from 'antd';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderFilter } from 'models/Direct/DirectSalesOrderFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { Model, ModelFilter } from 'core/models';
import { Filter } from 'core/filters';
import queryString from 'query-string';
import { DEFAULT_TAKE, STANDARD_DATE_TIME_FORMAT } from 'core/config';
import { isDateTimeValue } from 'core/helpers/date-time';
import moment from 'moment';
import nameof from 'ts-nameof.macro';

export class DirectSalesOrderService {
  public useStoreContentMaster(
    getList: (filter: StoreFilter) => Promise<Store[]>,
    count: (filter: StoreFilter) => Promise<number>,
    saleEmployeeId: any,
    // currentItem: StoreGrouping,
  ): [
    StoreFilter,
    Dispatch<SetStateAction<StoreFilter>>,
    Store[],
    Dispatch<SetStateAction<Store[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
    Dispatch<SetStateAction<boolean>>,
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
      }
    }, [count, filter, getList, loadList, saleEmployeeId]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
      setLoadList,
    ];
  }

  public useItemContentMaster(
    getList: (filter: ItemFilter) => Promise<Item[]>,
    count: (filter: ItemFilter) => Promise<number>,
    currentStore: Store,
  ): [
    ItemFilter,
    Dispatch<SetStateAction<ItemFilter>>,
    Item[],
    Dispatch<SetStateAction<Item[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<ItemFilter>(new ItemFilter());
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Item[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [modelFilter, setModelFilter] = React.useState<
      DirectSalesOrderFilter
    >(new DirectSalesOrderFilter());
    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        if (currentStore) {
          modelFilter.storeId.equal = currentStore.id;
          setModelFilter({ ...modelFilter });
        }
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, currentStore, filter, getList, loadList, modelFilter]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
    ];
  }

  public useItemModal(
    currentStore: Store,
    setVisible: Dispatch<SetStateAction<boolean>>,
    model: DirectSalesOrder,
  ) {
    const [filterItem, setFilterItem] = React.useState<ItemFilter>(
      new ItemFilter(),
    );
    const [loadList, setLoadList] = React.useState<boolean>(false);

    /* handle Open appUser modal */

    const handleOpenModal = React.useCallback(() => {
      setFilterItem({
        ...filterItem,
        storeId: { equal: currentStore?.id || model?.buyerStoreId },
        salesEmployeeId: { equal: model?.saleEmployeeId },
        skip: 0,
      });
      if (typeof model.saleEmployeeId === 'undefined') {
        Modal.warning({
          title: '',
          content: translate('indirectSalesOrders.errors.saleEmployee'),
        });
      } else if (typeof model.buyerStoreId === 'undefined') {
        Modal.warning({
          title: '',
          content: translate('indirectSalesOrders.errors.buyerStore'),
        });
      } else {
        setLoadList(true);
        setVisible(true);
      }
    }, [currentStore, filterItem, setVisible, model]);

    /* handle close appUser modal */
    const handleCloseModal = React.useCallback(() => {
      setVisible(false);
    }, [setVisible]);
    return {
      filterItem,
      setFilterItem,
      handleCloseModal,
      handleOpenModal,
      loadList,
      setLoadList,
    };
  }
  public useModalMaster(
    filter: ItemFilter,
    setFilter: Dispatch<SetStateAction<ItemFilter>>,
    loadList: boolean,
    setloadList: Dispatch<SetStateAction<boolean>>,
    getList: (filter: ItemFilter) => Promise<Item[]>,
    getCount: (filter: ItemFilter) => Promise<number>,
    onSave: (list: Item[]) => void,
  ) {
    const [list, setList] = React.useState<Item[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [total, setTotal] = React.useState<number>(0);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    React.useEffect(() => {
      if (loadList) {
        // console.log('co vao day');
        setLoading(true);
        Promise.all([getList(filter), getCount(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setloadList(false);
            setLoading(false);
          });
      }
    }, [filter, getCount, getList, loadList, setloadList]);

    /* handle search appUser modal */
    const handleSearch = React.useCallback(() => {
      setloadList(true);
    }, [setloadList]);

    const handleDefaultSearch = React.useCallback(() => {
      setFilter({ ...filter, skip: 0 }); // reset skip
      setloadList(true);
    }, [setloadList, filter, setFilter]);

    /* handle filter appUser modal */

    const handleChangeFilter = React.useCallback(
      (field: string) => {
        return (f: any) => {
          setFilter({ ...filter, [field]: f, skip: 0 }); // reset skip
          setloadList(true);
        };
      },
      [setFilter, setloadList, filter],
    );

    /* handle reset search appUser modal */
    const handleReset = React.useCallback(() => {
      const newFilter = new ItemFilter();
      newFilter.storeId.equal = filter.storeId?.equal;
      newFilter.salesEmployeeId.equal = filter.salesEmployeeId?.equal;
      setFilter(newFilter);
      setloadList(true);
      setIsReset(true);
    }, [filter, setFilter, setloadList]);

    const handleSave = React.useCallback(
      (selectedList: Item[]) => {
        return () => {
          if (typeof onSave === 'function') {
            onSave(selectedList);
          }
        };
      },
      [onSave],
    );

    return {
      list,
      loading,
      total,
      handleChangeFilter,
      handleSearch,
      handleDefaultSearch,
      handleReset,
      handleSave,
      isReset,
      setIsReset,
    };
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

  public useMasterDirect<T extends Model, TFilter extends ModelFilter>(
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
}
export const directSalesOrderOwnerService: DirectSalesOrderService = new DirectSalesOrderService();
