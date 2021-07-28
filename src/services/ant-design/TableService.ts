import { Modal } from 'antd';
import { PaginationConfig, PaginationProps } from 'antd/lib/pagination';
import { SorterResult, TableRowSelection } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE } from 'core/config';
import {
  DateFilter,
  Filter,
  GuidFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import {
  getOrderType,
  getOrderTypeForTable,
  setOrderType,
} from 'helpers/ant-design/table';
import { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { BatchId, FilterHandlerType } from 'react3l';
import React from 'reactn';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { notification } from 'helpers/notification';

const crudDefaultSelectedRowKeys: string[] | number[] = [];

export class TableService {
  public useRowSelection<T extends Model>(
    defaultSelectedRowKeys: string[] | number[] = crudDefaultSelectedRowKeys,
    onChange?: (
      selectedRowKeys: string[] | number[],
      selectedRows: T[],
    ) => void,
    resetSelect?: boolean,
    setResetSelect?: Dispatch<SetStateAction<boolean>>,
  ): [TableRowSelection<T>, boolean] {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<
      string[] | number[]
    >(defaultSelectedRowKeys);

    const handleChange = React.useCallback(
      (selectedRowKeys: string[] | number[], selectedRows: T[]) => {
        setSelectedRowKeys(selectedRowKeys);
        if (typeof setResetSelect === 'function') {
          setResetSelect(false);
        }
        if (typeof onChange === 'function') {
          onChange(selectedRowKeys, selectedRows);
        }
      },
      [onChange, setResetSelect],
    );
    const handleGetCheckboxProps = React.useCallback(
      (record: T) => ({
        disabled: record.used === true,
      }),
      [],
    );

    const rowSelection: TableRowSelection<T> = React.useMemo(
      () => ({
        onChange: handleChange,
        selectedRowKeys: resetSelect ? [] : selectedRowKeys,
        getCheckboxProps: handleGetCheckboxProps,
      }),
      [handleChange, handleGetCheckboxProps, resetSelect, selectedRowKeys],
    );

    return [rowSelection, selectedRowKeys.length > 0];
  }

  public useMasterTable<T extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    total: number,
    handleSearch?: () => void,
  ): [
    PaginationProps,
    SorterResult<T>,
    (
      pagination: PaginationProps,
      filters: Record<string, any>,
      newSorter: SorterResult<T>,
    ) => void,
    (
      pagination: PaginationProps,
      filters: Record<string, any>,
      newSorter: SorterResult<T>,
    ) => void,
  ] {
    const pagination: PaginationProps = React.useMemo(() => {
      const { take, skip } = filter;

      return {
        total,
        current: skip / take + 1,
        pageSize: take,
        showSizeChanger: true,
      };
    }, [filter, total]);

    const sorter: SorterResult<T> = React.useMemo(
      () =>
        ({
          field: filter.orderBy,
          order: getOrderType(filter),
        } as SorterResult<T>),
      [filter],
    );

    const handleTableChange = React.useCallback(
      (
        newPagination: PaginationProps,
        filters: Record<string, any>,
        newSorter: SorterResult<T>,
      ) => {
        const { field, order } = sorter;
        if (newSorter.field !== field || newSorter.order !== order) {
          const newFilter: TFilter = ModelFilter.clone<TFilter>({
            ...filter,
            orderBy: newSorter.field,
            skip: 0,
          });
          setOrderType(newFilter, newSorter.order);
          setFilter(newFilter);
          if (typeof handleSearch === 'function') {
            handleSearch();
          }
          return;
        }
        const {
          current = 1,
          pageSize = DEFAULT_TAKE,
          total = 0,
        } = newPagination;
        if (
          pagination.current !== current ||
          pagination.pageSize !== pageSize ||
          pagination.total !== total
        ) {
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              take: pageSize,
              skip: (current - 1) * pageSize,
            }),
          );
          if (typeof handleSearch === 'function') {
            handleSearch();
          }
          return;
        }
        setFilter(
          ModelFilter.clone<TFilter>({
            ...filter,
            ...filters,
          }),
        );
        if (typeof handleSearch === 'function') {
          handleSearch();
        }
      },
      [sorter, pagination, setFilter, filter, handleSearch],
    );

    const newHandleTableChange = React.useCallback(
      (
        newPagination: PaginationProps,
        filters: Record<string, any>,
        newSorter: SorterResult<T>,
      ) => {
        let newFilter = { ...filter }; // clone filter
        const { field, order } = sorter; // destructure field and order
        const {
          current = 1,
          pageSize = DEFAULT_TAKE,
          total = 0,
        } = newPagination; // destructure current page, pageSize and total
        if (newSorter.field !== field || newSorter.order !== order) {
          newFilter = {
            ...filter,
            orderBy: newSorter.field,
            skip: 0,
          }; // update newFilter orderType
          setOrderType(newFilter, newSorter.order);
        } // change order and orderType
        if (
          pagination.current !== current ||
          pagination.pageSize !== pageSize ||
          pagination.total !== total
        ) {
          newFilter = {
            ...filter,
            take: pageSize,
            skip: (current - 1) * pageSize,
          }; // update newFilter skip, take
        }
        setFilter({ ...newFilter, ...filters }); // update filter
        if (typeof handleSearch === 'function') handleSearch();
      },
      [filter, handleSearch, pagination, setFilter, sorter],
    );

    return [pagination, sorter, handleTableChange, newHandleTableChange];
  }

  public useDeleteHandler<T extends Model>(
    onDelete: (t: T) => Promise<T>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    list?: T[],
    setList?: Dispatch<SetStateAction<T[]>>,
    handleLoadList?: () => void,
    setT?: Dispatch<SetStateAction<T>>,
    onSuccess?: () => void,
    onError?: (error: AxiosError<T> | Error) => void,
    onCancel?: () => void,
  ): [(t: T) => () => void] {
    const [translate] = useTranslation();
    return [
      React.useCallback(
        (t: T) => {
          return () => {
            Modal.confirm({
              title: translate(generalLanguageKeys.delete.title),
              content: translate(generalLanguageKeys.delete.content),
              onCancel,
              onOk() {
                setLoading(true);
                onDelete(t)
                  .then(() => {
                    if (typeof handleLoadList === 'function') {
                      handleLoadList();
                    }
                    if (typeof onSuccess === 'function') {
                      onSuccess();
                    }
                    notification.success({
                      message: translate(generalLanguageKeys.delete.success),
                    });
                  })
                  .catch((error: AxiosError<T> | Error) => {
                    if (typeof onError === 'function') {
                      onError(error);
                      return;
                    }
                    if ('response' in error) {
                      if (
                        typeof list === 'object' &&
                        list instanceof Array &&
                        typeof setList === 'function'
                      ) {
                        setList(
                          list.map((listItem: T) => {
                            if (listItem.id === t.id) {
                              listItem.errors = error.response?.data;
                            }
                            return listItem;
                          }),
                        );
                        return;
                      }
                      if (
                        typeof t === 'object' &&
                        t !== null &&
                        typeof setT === 'function'
                      ) {
                        t.errors = error.response?.data;
                        setT(Model.clone<T>(t));
                        return;
                      }
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
            });
          };
        },
        [
          handleLoadList,
          list,
          onCancel,
          onDelete,
          onError,
          onSuccess,
          setList,
          setLoading,
          setT,
          translate,
        ],
      ),
    ];
  }

  public useBulkDeleteHandler(
    selectedRowKeys: number[] | string[],
    onDelete: (idList: BatchId) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    handleLoadList?: () => void,
    onSuccess?: () => void,
    onError?: (error: AxiosError<any> | Error) => void,
    onCancel?: () => void,
  ): [() => void] {
    const [translate] = useTranslation();
    return [
      React.useCallback(() => {
        Modal.confirm({
          title: translate(generalLanguageKeys.batchDelete.title),
          content: translate(generalLanguageKeys.batchDelete.content),
          onCancel,

          onOk() {
            setLoading(true);
            onDelete(selectedRowKeys)
              .then(() => {
                if (typeof handleLoadList === 'function') {
                  handleLoadList();
                }
                if (typeof onSuccess === 'function') {
                  onSuccess();
                }
              })
              .catch(onError)
              .finally(() => {
                setLoading(false);
              });
          },
        });
      }, [
        handleLoadList,
        onCancel,
        onDelete,
        onError,
        onSuccess,
        selectedRowKeys,
        setLoading,
        translate,
      ]),
    ];
  }

  public useLocalTable<T extends Model, TModelFilter extends ModelFilter>(
    list: T[],
    search: TModelFilter,
    setModelFilter: (search: TModelFilter) => void,
    filterHandler: FilterHandlerType<TModelFilter> = this.defaultFilterHandler,
  ): [
    T[],
    PaginationProps,
    SorterResult<TModelFilter>,
    (
      newPagination: PaginationConfig,
      filters: Record<string, any>,
      newSorter: SorterResult<T>,
    ) => void,
    (field: string) => (filter: Filter) => void,
    () => void,
    () => void,
  ] {
    const sorter: SorterResult<TModelFilter> = React.useMemo(
      () => ({
        field: search.orderBy,
        order: getOrderType(search),
        columnKey: search.orderBy,
        column: undefined,
      }),
      [search],
    );

    const dataSource: T[] = React.useMemo(() => {
      return filterHandler(list, search);
    }, [filterHandler, list, search]);

    const handleSearch = React.useCallback(() => {
      setModelFilter(ModelFilter.clone<TModelFilter>(search));
    }, [search, setModelFilter]);

    const handleReset = React.useCallback(() => {
      const newModelFilter: TModelFilter = ModelFilter.clone<TModelFilter>(
        search,
      );
      Object.entries(newModelFilter).forEach(([key, value]) => {
        switch (key) {
          case nameof(newModelFilter.skip):
            newModelFilter.skip = 0;
            break;

          case nameof(newModelFilter.take):
            newModelFilter.take = DEFAULT_TAKE;
            break;

          case nameof(newModelFilter.orderBy):
            newModelFilter.orderBy = undefined;
            break;

          case nameof(newModelFilter.orderType):
            newModelFilter.orderBy = undefined;
            break;

          default:
            if (typeof value === 'object' && value !== null) {
              Object.entries(value).forEach(([filterKey]) => {
                value[filterKey] = undefined;
              });
              newModelFilter[key] = { ...value };
            }
            break;
        }
      });
      setModelFilter(newModelFilter);
    }, [search, setModelFilter]);

    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = search;

      const { length } = dataSource ?? [];

      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, search]);

    const handleTableChange = React.useCallback(
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<T>,
      ) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== search.skip || take !== search.take) {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...search,
              skip,
              take,
            }),
          );
          return;
        }

        const { field, order } = sorter;

        if (newSorter.field !== field || newSorter.order !== order) {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...search,
              orderBy: newSorter.field,
              orderType: getOrderTypeForTable<T>(newSorter.field, newSorter),
            }),
          );
          return;
        }

        setModelFilter(
          ModelFilter.clone<TModelFilter>({
            ...search,
            ...filters,
          }),
        );
      },
      [search, setModelFilter, sorter],
    );

    const handleFilter = React.useCallback(
      (field: string) => {
        return (filter: Filter) => {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...search,
              [field]: filter,
            }),
          );
        };
      },
      [search, setModelFilter],
    );

    return [
      dataSource,
      pagination,
      sorter,
      handleTableChange,
      handleFilter,
      handleSearch,
      handleReset,
    ];
  }

  public defaultFilterHandler<T extends Model, TSearch extends ModelFilter>(
    list: T[],
    search?: TSearch,
  ) {
    if (typeof search === 'object' && search !== null) {
      Object.entries<
        StringFilter | DateFilter | NumberFilter | IdFilter | GuidFilter
      >(search as any).forEach(([key, value]) => {
        switch (key) {
          case nameof(search.skip):
            // Do nothing
            break;

          case nameof(search.take):
            // Do nothing
            break;

          case nameof(search.orderBy):
            // Do nothing
            break;

          case nameof(search.orderType):
            // Do nothing
            break;

          default:
            if (value instanceof StringFilter) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (typeof filterValue === 'string' && filterValue !== '') {
                  filterValue = filterValue.toLowerCase();
                  switch (filterKey) {
                    case nameof(value.startWith):
                      list = list.filter((t: T) => {
                        if (!t[key]) return false;
                        return t[key]
                          .toString()
                          .toLowerCase()
                          ?.startsWith(filterValue);
                      });
                      break;

                    case nameof(value.endWith):
                      list = list.filter((t: T) => {
                        if (!t[key]) return false;
                        return t[key]
                          .toString()
                          .toLowerCase()
                          ?.endsWith(filterValue);
                      });
                      break;

                    case nameof(value.contain):
                      list = list.filter((t: T) => {
                        if (!t[key]) return false;
                        return (
                          t[key]
                            .toString()
                            .toLowerCase()
                            ?.indexOf(filterValue) >= 0
                        );
                      });
                      break;

                    default:
                      // Do nothing
                      break;
                  }
                }
              });
              break;
            }
            if (value instanceof NumberFilter) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (filterKey === nameof(value.range)) {
                  list = list.filter((t: T) => {
                    const v: number = t[key] as number;
                    if (typeof v === 'number') {
                      let result: boolean = true;
                      if (filterValue instanceof Array) {
                        if (typeof filterValue[0] === 'number') {
                          result = result && v >= filterValue[0];
                        }
                        if (typeof filterValue[1] === 'number') {
                          result = result && v <= filterValue[1];
                        }
                      }
                      return result;
                    }
                    return true;
                  });
                } else {
                  if (
                    typeof filterValue === 'number' &&
                    !Number.isNaN(filterValue)
                  ) {
                    switch (filterKey) {
                      case nameof(value.equal):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v === filterValue;
                          }
                          return true;
                        });
                        break;

                      case nameof(value.notEqual):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v !== filterValue;
                          }
                          return true;
                        });
                        break;

                      case nameof(value.less):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v < filterValue;
                          }
                          return true;
                        });
                        break;

                      case nameof(value.greater):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v > filterValue;
                          }
                          return true;
                        });
                        break;

                      case nameof(value.lessEqual):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v <= filterValue;
                          }
                          return true;
                        });
                        break;

                      case nameof(value.greaterEqual):
                        list = list.filter((t: T) => {
                          const v: number = t[key] as number;
                          if (
                            typeof v === 'number' &&
                            typeof filterValue === 'number'
                          ) {
                            return v >= filterValue;
                          }
                          return true;
                        });
                        break;

                      default:
                        // Do nothing
                        break;
                    }
                  }
                }
              });
              break;
            }
            if (value instanceof DateFilter) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (filterKey === nameof(value.range)) {
                  list = list.filter((t: T) => {
                    const v: number = (t[key] as Moment)?.toDate().getTime();
                    if (typeof v === 'number') {
                      const [minValue, maxValue] = (filterValue ?? []) as [
                        Moment,
                        Moment,
                      ];
                      let result: boolean = true;
                      if (minValue !== null && typeof minValue === 'object') {
                        const minTimeValue: number = minValue
                          .toDate()
                          .getTime();
                        result = result && minTimeValue <= v;
                      }
                      if (maxValue !== null && typeof maxValue === 'object') {
                        const maxTimeValue: number = maxValue
                          .toDate()
                          .getTime();
                        result = result && maxTimeValue >= v;
                      }
                      return result;
                    }
                    return true;
                  });
                } else {
                  switch (filterKey) {
                    case nameof(value.equal):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v === comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    case nameof(value.notEqual):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v !== comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    case nameof(value.less):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v < comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    case nameof(value.greater):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v > comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    case nameof(value.lessEqual):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v <= comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    case nameof(value.greaterEqual):
                      list = list.filter((t: T) => {
                        const v: number = (t[key] as Moment)
                          ?.toDate()
                          .getTime();
                        if (
                          typeof v === 'number' &&
                          typeof filterValue === 'object' &&
                          filterValue !== null
                        ) {
                          const comparisonValue: number = (filterValue as Moment)
                            ?.toDate()
                            .getTime();
                          if (typeof comparisonValue === 'number') {
                            return v >= comparisonValue;
                          }
                          return true;
                        }
                        return true;
                      });
                      break;

                    default:
                      // Do nothing
                      break;
                  }
                }
              });
              break;
            }
            if (value instanceof IdFilter || value instanceof GuidFilter) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (
                  (typeof filterValue === 'string' && filterValue !== '') ||
                  (typeof filterValue === 'number' &&
                    !Number.isNaN(filterValue))
                ) {
                  switch (filterKey) {
                    case nameof(value.equal):
                      list = list.filter((t: T) => {
                        const v: number = t[key] as number;
                        if (
                          (typeof v === 'number' ||
                            typeof value === 'string') &&
                          (typeof filterValue === 'number' ||
                            typeof filterValue === 'string')
                        ) {
                          return v === +filterValue;
                        }
                        return false;
                      });
                      break;

                    case nameof(value.notEqual):
                      list = list.filter((t: T) => {
                        const v: number = t[key] as number;
                        if (
                          (typeof v === 'number' ||
                            typeof value === 'string') &&
                          (typeof filterValue === 'number' ||
                            typeof filterValue === 'string')
                        ) {
                          return v !== filterValue;
                        }
                        return false;
                      });
                      break;

                    case nameof(value.in):
                      list = list.filter((t: T) => {
                        const v: number = t[key] as number;
                        if (
                          (typeof v === 'number' ||
                            typeof value === 'string') &&
                          (filterValue as any) instanceof Array
                        ) {
                          return (filterValue as any).includes(v);
                        }
                        return false;
                      });
                      break;

                    case nameof(value.notIn):
                      list = list.filter((t: T) => {
                        const v: number = t[key] as number;
                        if (
                          (typeof v === 'number' ||
                            typeof value === 'string') &&
                          (filterValue as any) instanceof Array
                        ) {
                          return !(filterValue as any).includes(v);
                        }
                        return false;
                      });
                      break;

                    default:
                      // Do nothing
                      break;
                  }
                }
              });
              break;
            }
        }
      });
      return list;
    }
    return list;
  }

  public useModalRowSelection<T extends Model, TMapping extends Model>(
    rootId: string | number,
    rootFieldName: string,
    fieldName: string,
    currentList?: TMapping[],
    setCurrentList?: Dispatch<SetStateAction<TMapping[]>>,
  ): TableRowSelection<T> {
    const handleChange = React.useCallback(
      (selectedRowKeys: string[] | number[], selectedRows?: T[]) => {
        let list: TMapping[] = [...currentList];
        const newKeys = {};
        selectedRowKeys.forEach((id: number | string) => {
          newKeys[id] = true;
        });
        list = list.filter((tMapping: TMapping) => {
          return newKeys[tMapping[`${fieldName}Id`]];
        });
        const oldKeys = {};
        list.forEach((t: TMapping) => {
          oldKeys[t[`${fieldName}Id`]] = t;
        });
        selectedRows.forEach((t: T) => {
          if (!oldKeys[t.id]) {
            const newMapping: TMapping = Model.clone<TMapping>({
              [`${rootFieldName}Id`]: rootId,
              [`${fieldName}Id`]: t.id,
              [`${fieldName}`]: t,
            } as any);
            list = [...list, newMapping];
          }
        });
        if (typeof setCurrentList === 'function') {
          setCurrentList(list);
        }
      },
      [currentList, fieldName, rootFieldName, rootId, setCurrentList],
    );

    const defaultSelectedKeys: number[] | string[] = React.useMemo(() => {
      if (
        typeof currentList === 'object' &&
        currentList !== null &&
        currentList instanceof Array
      ) {
        return currentList.map((t: TMapping) => {
          return t[`${fieldName}Id`] as string;
        });
      }
      return [];
    }, [currentList, fieldName]);

    return {
      selectedRowKeys: defaultSelectedKeys,
      onChange: handleChange,
    };
  }

  public usePaginationAndSorter<TFilter extends ModelFilter>(
    modelFilter: TFilter,
    total,
  ): [PaginationConfig, SorterResult<TFilter>] {
    const pagination: PaginationConfig = React.useMemo(() => {
      return {
        total,
        pageSize: modelFilter.take,
        page: modelFilter.skip / modelFilter.take + 1,
        size: 'small',
      };
    }, [modelFilter.skip, modelFilter.take, total]);

    const sorter: SorterResult<TFilter> = {
      column: null,
      columnKey: modelFilter.orderBy,
      field: modelFilter.orderBy,
      order: getOrderType(modelFilter),
    };

    return [pagination, sorter];
  }

  public useLocalMappingTreeTable<
    T extends Model,
    TMapping extends Model,
    TModelFilter extends ModelFilter
  >(
    list: TMapping[],
    setList: Dispatch<SetStateAction<TMapping[]>>,
    search: TModelFilter,
    setModelFilter: (search: TModelFilter) => void,
    field: string,
    handleMapping: (listMapping: TMapping[], currentItems: T) => any[],
    handleUpdate: (item: T) => Promise<T>,
    setVisibleProduct?: Dispatch<SetStateAction<boolean>>,
    filterHandler: FilterHandlerType<TModelFilter> = this.defaultFilterHandler,
  ): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    T[],
    PaginationProps,
    (
      newPagination: PaginationConfig,
      filters: Record<string, any>,
      newSorter: SorterResult<T>,
    ) => void,
    (mappingItem: TMapping, currentItem: T) => void,
  ] {
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const sorter: SorterResult<TModelFilter> = React.useMemo(
      () => ({
        field: search.orderBy,
        order: getOrderType(search),
        columnKey: search.orderBy,
        column: undefined,
      }),
      [search],
    );
    const handleSearch = React.useCallback(() => {
      setModelFilter(ModelFilter.clone<TModelFilter>(search));
    }, [search, setModelFilter]);
    const dataSource: T[] = React.useMemo(() => {
      const listItems = filterHandler(list, search);
      listItems.map(item => (item.key = uuidv4()));
      return listItems;
    }, [filterHandler, list, search]);

    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = search;

      const { length } = dataSource ?? [];

      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, search]);

    const handleTableChange = React.useCallback(
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<T>,
      ) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== search.skip || take !== search.take) {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...search,
              skip,
              take,
            }),
          );
          return;
        }

        const { field, order } = sorter;

        if (newSorter.field !== field || newSorter.order !== order) {
          setModelFilter(
            ModelFilter.clone<TModelFilter>({
              ...search,
              orderBy: newSorter.field,
              orderType: getOrderTypeForTable<T>(newSorter.field, newSorter),
            }),
          );
          return;
        }

        setModelFilter(
          ModelFilter.clone<TModelFilter>({
            ...search,
            ...filters,
          }),
        );
      },
      [search, setModelFilter, sorter],
    );

    const handleDeleteProduct = React.useCallback(
      (mappingItem: TMapping, currentItem: T) => {
        Modal.confirm({
          title: translate(generalLanguageKeys.delete.title),
          content: translate(generalLanguageKeys.delete.content),

          onOk() {
            setLoading(true);
            const index = list.indexOf(mappingItem);
            list.splice(index, 1);
            setList(list);
            const mappingList = handleMapping(list, currentItem);
            (currentItem as any)[field] = mappingList;
            handleUpdate(currentItem).then(res => {
              if (res) {
                setVisibleProduct(false);
                setLoading(false);
                handleSearch();
              }
            });
          },
        });
      },
      [
        list,
        setList,
        handleMapping,
        field,
        handleUpdate,
        setVisibleProduct,
        handleSearch,
        translate,
      ],
    );

    return [
      loading,
      setLoading,
      dataSource,
      pagination,
      handleTableChange,
      handleDeleteProduct,
    ];
  }
}

export const tableService: TableService = new TableService();
