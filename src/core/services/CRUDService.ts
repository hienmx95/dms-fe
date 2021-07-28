import { TableRowSelection } from 'antd/lib/table';
import { AxiosError, AxiosResponse } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { NOT_FOUND_ROUTE } from 'config/route-consts';
import { ActionContext } from 'core/components/App/AppContext';
import {
  DEFAULT_TAKE,
  STANDARD_DATE_TIME_FORMAT,
  INFINITE_SCROLL_TAKE,
  INF_CONTAINER_HEIGHT,
} from 'core/config';
import { Filter } from 'core/filters';
import { isDateTimeValue } from 'core/helpers/date-time';
import { debounce } from 'core/helpers/debounce';
import { flatten, unflatten } from 'core/helpers/json';
import { Model, ModelFilter } from 'core/models';
import { saveAs } from 'file-saver';
import _, { kebabCase } from 'lodash';
import moment, { Moment } from 'moment';
import queryString from 'query-string';
import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { notification } from '../../helpers/notification';
export class CRUDService {
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

          default:
            if (
              modelFilter.hasOwnProperty(key) &&
              typeof modelFilter[key] === 'object' &&
              modelFilter[key] !== null &&
              typeof value === 'object' &&
              value !== null
            ) {
              Object.entries(value).forEach(([filterKey, filterValue]) => {
                if (filterKey === 'in') {
                  modelFilter[key][filterKey] = Object.keys(
                    filterValue,
                  ).map(item => Number(filterValue[item]));
                } else if (isDateTimeValue(filterValue as any)) {
                  modelFilter[key][filterKey] = moment(
                    new Date(filterValue as string),
                  );
                } else {
                  modelFilter[key][filterKey] = filterValue;
                }
              });
            } else if (typeof modelFilter[key] !== 'object') {
              modelFilter[key] = value as any;
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
    count: (filter: TFilter) => Promise<number>,
    getList: (filter: TFilter) => Promise<T[]>,
    getDetail: (id: number | string) => Promise<T>,
  ): [
    TFilter,
    Dispatch<SetStateAction<TFilter>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    number,
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
    Dispatch<SetStateAction<T>>,
  ] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [filter, setFilter] = this.useQuery<TFilter>(modelFilterClass);
    const [list, setList] = React.useState<T[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [previewModel, setPreviewModel] = React.useState<T>(new modelClass());
    const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
    const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    const [resetSelect, setResetSelect] = React.useState<boolean>(false);

    React.useEffect(() => {
      let isCancelled = false;
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            if (!isCancelled) {
              setList(list);
              setTotal(total);
            }
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
            setResetSelect(true);
          });
      }
      return () => {
        isCancelled = true;
      };
    }, [count, filter, getList, loadList]);

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
          const { skip, take } = ModelFilter.clone<TFilter>(
            new modelFilterClass(),
          );
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
              skip,
              take,
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
      const { skip, take } = ModelFilter.clone<TFilter>(new modelFilterClass());
      setFilter(
        ModelFilter.clone<TFilter>({
          ...filter,
          skip,
          take,
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
      list,
      setList,
      loading,
      setLoading,
      total,
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
      setPreviewModel,
    ];
  }

  public useEnumList<T extends Model>(
    handleList: () => Promise<T[]>,
  ): [T[], Dispatch<SetStateAction<T[]>>] {
    const [list, setList] = React.useState<T[]>([]);

    React.useEffect(() => {
      handleList().then((list: T[]) => {
        setList(list);
      });
    }, [handleList]);

    return [list, setList];
  }

  public useImport<TFilter extends ModelFilter>(
    onImport: (file: File, filter: TFilter) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    filter?: TFilter,
  ): [
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void,
    RefObject<HTMLInputElement>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    string,
  ] {
    const [translate] = useTranslation();
    const ref: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
      null,
    );
    const [errVisible, setErrVisible] = React.useState<boolean>(false);
    const [errorModel, setErrorModel] = React.useState<string>();

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
          const file: File = event.target.files[0];
          setLoading(true);
          onImport(file, filter)
            .then(() => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
              notification.success({
                message: translate(generalLanguageKeys.update.requireRefresh),
              });
            })
            .catch((error: AxiosError<any>) => {
              setErrorModel(error.response.data);
              setErrVisible(true);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      [filter, onImport, setLoading, translate],
    );

    const handleClick = React.useCallback(() => {
      ref.current.value = null;
    }, []);

    return [
      handleChange,
      handleClick,
      ref,
      errVisible,
      setErrVisible,
      errorModel,
    ];
  }

  public useExport<TFilter extends ModelFilter>(
    exportFile: (filter: TFilter) => Promise<AxiosResponse<any>>,
    filter: TFilter,
  ): [() => void, boolean, Dispatch<SetStateAction<boolean>>] {
    const [isError, setIsError] = React.useState<boolean>(false);

    const handleExport = () => {
      exportFile(filter)
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

  public useDetail<T extends Model>(
    modelClass: new () => T,
    handleGet: (id: number | string) => Promise<T>,
    onSave: (t: T) => Promise<T>,
    onSend?: (t: T) => Promise<T>,
    onApprove?: (t: T) => Promise<T>,
    onReject?: (t: T) => Promise<T>,
  ): [
    T,
    Dispatch<SetStateAction<T>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    () => void,
    () => void,
    () => void,
    () => void,
  ] {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [t, setT] = React.useState<T>(new modelClass());
    const { id } = useParams();
    const history = useHistory();
    const [translate] = useTranslation();
    const isCancelled = React.useRef<boolean>(false);

    let isDetail: boolean = false;
    if (id === 'create') {
      isDetail = false;
    } else if (id.match(/^[0-9]+$/)) {
      isDetail = true;
    } else {
      window.location.href = NOT_FOUND_ROUTE;
    }

    React.useEffect(() => {
      isCancelled.current = false;
      if (isDetail) {
        setLoading(true);
        handleGet(id)
          .then((t: T) => {
            setT(t);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      return () => {
        isCancelled.current = true;
      };
    }, [handleGet, id, isDetail]);

    const handleSave = React.useCallback(() => {
      setLoading(true);
      onSave(t)
        .then((t: T) => {
          if (!isCancelled.current) setT(t);
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.goBack();
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error: AxiosError<T>) => {
          if (error.response && error.response.status === 400) {
            setT(error.response?.data);
          }

          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }, [onSave, t, translate, history]);

    const handleApprove = React.useCallback(() => {
      setLoading(true);
      onApprove(t)
        .then((t: T) => {
          setT(t);
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.goBack();
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error: AxiosError<T>) => {
          if (error.response && error.response.status === 400) {
            setT(error.response?.data);
          }
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }, [onApprove, t, translate, history]);

    const handleReject = React.useCallback(() => {
      setLoading(true);
      onReject(t)
        .then((t: T) => {
          setT(t);
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.goBack();
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error: AxiosError<T>) => {
          if (error.response && error.response.status === 400) {
            setT(error.response?.data);
          }
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }, [onReject, t, translate, history]);
    const handleSend = React.useCallback(() => {
      setLoading(true);
      onSend(t)
        .then((t: T) => {
          setT(t);
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
          history.goBack();
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error: AxiosError<T>) => {
          if (error.response && error.response.status === 400) {
            setT(error.response?.data);
          }
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }, [onSend, t, translate, history]);

    return [
      t,
      setT,
      loading,
      setLoading,
      isDetail,
      handleSave,
      handleSend,
      handleApprove,
      handleReject,
    ];
  }

  public useChangeHandlers<T extends Model>(
    model?: T,
    setModel?: (t: T) => void,
  ): [
    (field: string) => (value) => void,
    (field: string) => (value) => void,
    (field: string) => (value) => void,
  ] {
    const handleSetInputValue = React.useCallback(
      (field: string, value?: string | number | boolean | null) => {
        setModel(
          Model.clone<T>({
            ...model,
            [field]: value,
            errors: {
              ...model.errors,
              [field]: null,
            },
          }),
        );
      },
      [model, setModel],
    );

    const handleDebounceInputValue = React.useCallback(
      debounce(handleSetInputValue),
      [handleSetInputValue],
    );

    const handleChangeSimpleField = React.useCallback(
      (field: string, debounce: boolean = false) => {
        return (
          event:
            | React.ChangeEvent<HTMLInputElement>
            | number
            | string
            | boolean,
        ) => {
          if (typeof event === 'object' && event !== null) {
            if ('target' in event) {
              if (debounce) {
                return handleDebounceInputValue(field, event.target.value);
              }
              return handleSetInputValue(field, event.target.value);
            }
            if ('format' in event) {
              setModel(
                Model.clone<T>({
                  ...model,
                  [field]: event,
                }),
              );
            }
          }
          if (debounce) {
            return handleDebounceInputValue(field, event);
          }
          return handleSetInputValue(field, event as string | number | boolean);
        };
      },
      [handleDebounceInputValue, handleSetInputValue, model, setModel],
    );

    const handleUpdateDateField = React.useCallback(
      (field: string) => {
        return (moment: Moment) => {
          setModel(
            Model.clone<T>({
              ...model,
              [field]: moment,
              errors: {
                ...model.errors,
                [field]: null,
              },
            }),
          );
        };
      },
      [model, setModel],
    );

    const handleChangeObjectField = React.useCallback(
      (field: string) => {
        return (id?: number | string | null, t?: T) => {
          setModel(
            Model.clone<T>({
              ...model,
              [field]: t,
              [`${field}Id`]: id,
              errors: {
                ...model.errors,
                [field]: null,
                [`${field}Id`]: null,
              },
            }),
          );
        };
      },
      [model, setModel],
    );
    return [
      handleChangeSimpleField,
      handleChangeObjectField,
      handleUpdateDateField,
    ];
  }

  public useListChangeHandlers<T extends Model>(
    list?: T[],
    setList?: (t: T[]) => void,
  ): [
    (field: string, index: number) => (value) => void,
    (field: string, index: number) => (value) => void,
    (field: string, index: number) => (value) => void,
  ] {
    const handleSetInputValue = React.useCallback(
      (
        field: string,
        index: number,
        value?: string | number | boolean | null,
      ) => {
        const model: T = list[index];
        (model as any)[field] = value;
        setList([...list]);
      },
      [list, setList],
    );

    const handleDebounceInputValue = React.useCallback(
      debounce(handleSetInputValue),
      [handleSetInputValue],
    );

    const handleChangeListSimpleField = React.useCallback(
      (field: string, index: number, debounce: boolean = false) => {
        return (
          event:
            | React.ChangeEvent<HTMLInputElement>
            | number
            | string
            | boolean,
        ) => {
          const model: T = list[index];
          if (typeof event === 'object' && event !== null) {
            if ('target' in event) {
              if (debounce) {
                return handleDebounceInputValue(field, event.target.value);
              }
              return handleSetInputValue(field, index, event.target.value);
            }
            if ('format' in event) {
              (model as any)[field] = event;
              return setList([...list]);
            }
          }
          if (debounce) {
            return handleDebounceInputValue(field, index, event);
          }
          return handleSetInputValue(
            field,
            index,
            event as string | number | boolean,
          );
        };
      },
      [handleDebounceInputValue, handleSetInputValue, list, setList],
    );

    const handleUpdateDateField = React.useCallback(
      (field: string, index: number) => {
        return (moment: Moment) => {
          const model: T = list[index];
          (model as any)[field] = moment;
          setList([...list]);
        };
      },
      [list, setList],
    );

    const handleChangeObjectField = React.useCallback(
      (field: string, index: number) => {
        return (id?: number | string | null, t?: T) => {
          list[index] = Model.clone<T>({
            ...list[index],
            [field]: t,
            [`${field}Id`]: id,
          });
          setList([...list]);
        };
      },
      [list, setList],
    );
    return [
      handleChangeListSimpleField,
      handleChangeObjectField,
      handleUpdateDateField,
    ];
  }

  public useContentTable<T extends Model, TContent extends Model>(
    model: T,
    setModel: (t: T) => void,
    field: string,
  ): [
    TContent[],
    (v: TContent[]) => void,
    () => void,
    (id: number) => () => void,
  ] {
    const value: TContent[] = React.useMemo(() => {
      if (model[field]) {
        model[field]?.forEach((t: TContent, index: number) => {
          if (!t?.key) {
            if (t?.id) {
              t.key = t.id;
            } else {
              t.key = uuidv4();
            }
            t.tableIndex = index;
          }
        });
        return model[field];
      }
      return [];
    }, [field, model]);

    const setValue = React.useCallback(
      (v: TContent[]) => {
        setModel(
          Model.clone<T>({
            ...model,
            [field]: v,
          }),
        );
      },
      [field, model, setModel],
    );

    const handleDelete = React.useCallback(
      (index: number) => {
        return () => {
          value.splice(index, 1);
          setValue([...value]);
        };
      },
      [value, setValue],
    );

    const handleAdd = React.useCallback(() => {
      const newContent: TContent = new Model() as TContent;
      newContent.key = uuidv4();
      if (value instanceof Array) {
        setValue([...value, newContent]);
      } else {
        setValue([newContent]);
      }
    }, [setValue, value]);

    return [value, setValue, handleAdd, handleDelete];
  }

  public useBulkModal<T extends Model, TModelFilter extends ModelFilter>(
    modelFilterClass: new () => TModelFilter,
    getList: (filter: TModelFilter) => Promise<T[]>,
    count: (filter: TModelFilter) => Promise<number>,
  ): [
    TModelFilter,
    Dispatch<SetStateAction<TModelFilter>>,
    boolean,
    boolean,
    T[],
    number,
    () => void,
    () => void,
  ] {
    const [visible, setVisible] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<TModelFilter>(
      new modelFilterClass(),
    );
    const [list, setList] = React.useState<T[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    const handleOpenModal = React.useCallback(() => {
      setVisible(true);
      setLoading(true);
      Promise.all([getList(filter), count(filter)])
        .then(([list, total]) => {
          setList(list);
          setTotal(total);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [count, filter, getList]);

    const handleCloseModal = React.useCallback(() => {
      setVisible(false);
    }, []);

    return [
      filter,
      setFilter,
      visible,
      loading,
      list,
      total,
      handleOpenModal,
      handleCloseModal,
    ];
  }

  public useDefaultSelectedRowKeys<T extends Model>(list: T[]): number[] {
    return React.useMemo(
      () =>
        list
          .filter((t: T) => typeof t.id === 'number' && !Number.isNaN(t.id))
          .map((t: T) => t.id),
      [list],
    );
  }

  public useDefaultList<T extends Model>(t: T): T[] {
    return React.useMemo(() => {
      if (typeof t === 'object' && t !== null) {
        return [t];
      }
      return [];
    }, [t]);
  }

  public useContentModal<T extends Model, TFilter extends ModelFilter>(
    getList: (tFilter: TFilter) => Promise<T[]>,
    count: (tFilter: TFilter) => Promise<number>,
    filterClass: new () => TFilter,
  ): [
    boolean,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    T[],
    number,
    () => void,
    () => void,
    TFilter,
    Dispatch<SetStateAction<TFilter>>,
    Dispatch<SetStateAction<T[]>>,
  ] {
    const [visible, setVisible] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<TFilter>(new filterClass());
    const [list, setList] = React.useState<T[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    const handleOpen = React.useCallback(() => {
      setVisible(true);
    }, []);

    const handleClose = React.useCallback(() => {
      setVisible(false);
    }, []);

    React.useEffect(() => {
      if (visible) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [count, filter, getList, visible]);

    return [
      loading,
      visible,
      setVisible,
      list,
      total,
      handleOpen,
      handleClose,
      filter,
      setFilter,
      setList,
    ];
  }

  public useContentModalList<T extends Model>(
    list: T[],
    setList: Dispatch<SetStateAction<T[]>>,
    isPreview?: boolean,
  ): TableRowSelection<T> {
    const selectedRowKeys = useMemo(() => {
      return list.map((t: T) => (t.id ? t.id : t.key)); // fix for bug missing item
    }, [list]);

    return React.useMemo(
      () => ({
        onSelect: (record: T, selected: boolean) => {
          if (selected) {
            list.push(record);
            setList([...list]);
          } else {
            setList(
              list.filter((t: T) => {
                return t.id ? t.id !== record.id : t.key !== record.key;
              }),
            );
          }
        },
        onChange: (...[selectedRowKeys, selectedRows]) => {
          // if list empty, add all selectedRows to list
          if (list?.length === 0) {
            setList([...selectedRows]);
            return;
          }
          // create mapper from filter
          const mapper: Record<any, number> = {};
          selectedRowKeys.forEach((key: string | number, index: number) => {
            mapper[key] = index;
          });
          // filter List which contained in mapper
          const mergeList = [...list, ...selectedRows]; // merge old list with new selectedRows
          const filterList = mergeList
            .filter(
              (item, index) =>
                mergeList
                  .map(i => (i.id ? i.id : i.key))
                  .indexOf(item.id ? item.id : item.key) === index,
            ) // remove duplicates item
            .filter(item => {
              const key = typeof item.id !== 'undefined' ? item.id : item.key;
              return mapper.hasOwnProperty(key);
            }); // filter item which its key contained in selectedRowKeys
          setList([...filterList]);
        },
        getCheckboxProps: () => ({ disabled: isPreview ? true : false }),
        selectedRowKeys,
      }),
      [selectedRowKeys, list, setList, isPreview],
    );
  }

  public usePopupDetail<T extends Model, TFilter extends ModelFilter>(
    modelClass: new () => T,
    modelFilterClass: new () => TFilter,
    isDetail: boolean,
    currentItem: T,
    setVisible: Dispatch<SetStateAction<boolean>>,
    handleGet: (id: number | string) => Promise<T>,
    onSave: (t: T) => Promise<T>,
    getListGroup: (filter: TFilter) => Promise<T[]>,
    setListGroup: Dispatch<SetStateAction<T[]>>,
    setLoadList: Dispatch<SetStateAction<boolean>>,
  ): [
    T,
    Dispatch<SetStateAction<T>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
  ] {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [t, setT] = React.useState<T>(new modelClass());
    const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);
    const [filter] = this.useQuery<TFilter>(modelFilterClass);
    const [translate] = useTranslation();

    React.useEffect(() => {
      if (isDetail) {
        handleGet(currentItem.id).then((item: T) => {
          setT(item);
        });
      }
    }, [setT, currentItem, handleGet, isDetail]);

    React.useEffect(() => {
      if (saveSuccess) {
        getListGroup(filter).then((t: T[]) => {
          setListGroup(t);
          setSaveSuccess(false);
          setLoadList(true);
          notification.success({
            message: translate(generalLanguageKeys.update.success),
          });
        });
      }
    }, [
      saveSuccess,
      getListGroup,
      setListGroup,
      filter,
      setLoadList,
      translate,
    ]);

    const handleSave = React.useCallback(() => {
      onSave(t)
        .then((item: T) => {
          setT(item);
          setSaveSuccess(true);
          setVisible(false);
          setLoading(true);
        })
        .catch((error: AxiosError<T>) => {
          if (error.response && error.response.status === 400) {
            setT(error.response?.data);
          }
          notification.error({
            message: translate(generalLanguageKeys.update.error),
            description: error.message,
          });
        });
    }, [onSave, t, setVisible, translate]);

    return [t, setT, loading, setLoading, handleSave];
  }

  public useTreeMaster<T extends Model, TFilter extends ModelFilter>(
    modelClass: new () => T,
    modelFilterClass: new () => TFilter,
    getList: (filter: TFilter) => Promise<T[]>,
    getDetail: (id: number | string) => Promise<T>,
  ): [
    T[],
    Dispatch<SetStateAction<T[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    boolean,
    T,
    (node: T) => () => void,
    () => void,
    <TF extends Filter>(field: string) => (f: TF) => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    T,
    Dispatch<SetStateAction<T>>,
    () => void,
    (node: T) => () => void,
    (node: T) => () => void,
    () => void,
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [filter, setFilter] = this.useQuery<TFilter>(modelFilterClass);
    const [previewModel, setPreviewModel] = React.useState<T>(new modelClass());
    const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
    const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
    const [list, setList] = React.useState<T[]>([]);
    const [currentItem, setCurrentItem] = React.useState<T>(new modelClass());
    const [isDetail, setIsDetail] = React.useState<boolean>(false);
    const [visible, setVisible] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        getList(filter)
          .then(list => {
            setList(list);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [filter, getList, loadList]);

    const handleOpenPreview = React.useCallback(
      (node: any) => {
        return () => {
          setPreviewModel(new modelClass());
          setPreviewLoading(true);
          setPreviewVisible(true);
          setIsDetail(true);
          getDetail(node.id)
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
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
            }),
          );
          setLoadList(true);
        };
      },
      [filter, setFilter],
    );

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, []);

    const handleAddDefaultTreeNode = React.useCallback(() => {
      setVisible(true);
      setIsDetail(false);
      setCurrentItem(null);
    }, [setVisible, setIsDetail]);

    const handleAddChildTreeNode = React.useCallback(
      (node: T) => {
        return () => {
          setCurrentItem(node);
          setVisible(true);
          setIsDetail(false);
        };
      },
      [setCurrentItem, setVisible, setIsDetail],
    );

    const handleEdit = React.useCallback(
      (node: any) => {
        return () => {
          setCurrentItem(node);
          setVisible(true);
          setIsDetail(true);
        };
      },
      [setCurrentItem, setVisible, setIsDetail],
    );

    const handlePopupCancel = React.useCallback(() => {
      setVisible(false);
      // setCurrentItem(null);
    }, [setVisible]);

    return [
      list,
      setList,
      loading,
      setLoading,
      previewLoading,
      previewVisible,
      previewModel,
      handleOpenPreview,
      handleClosePreview,
      handleFilter,
      handleSearch,
      isDetail,
      setIsDetail,
      visible,
      setVisible,
      currentItem,
      setCurrentItem,
      handleAddDefaultTreeNode,
      handleAddChildTreeNode,
      handleEdit,
      handlePopupCancel,
      setLoadList,
    ];
  }
  // TMapping là Product, T là ProductGrouping (map từng ds sản phẩm vào productgrouping)
  public useMappingContent<T extends Model, TMapping extends Model>(
    handleGet: (id: number | string) => Promise<T>,
    field: string,
    mappingField: string,
    key: string,
    keyMapping: string,
    objectKeyMapping: string,
  ): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    TMapping[],
    Dispatch<SetStateAction<TMapping[]>>,
    (id: number | string) => void,
    (listMapping: TMapping[], currentItems: T) => any[],
    number,
  ] {
    const [listMapping, setListMapping] = React.useState<TMapping[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleGetDetail = React.useCallback(
      (id: number) => {
        const list = [];
        setLoading(true);
        handleGet(id)
          .then(res => {
            if (res && res[field] && res[field].length > 0) {
              res[field].forEach(item => {
                list.push(item[mappingField]);
              });
              setListMapping(list);
            } else {
              setListMapping([]);
            }
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      [field, handleGet, mappingField],
    );

    const handleMapping = React.useCallback(
      (listMapping: TMapping[], currentItems: T) => {
        const list = [];
        listMapping.forEach(item => {
          list.push({
            [keyMapping]: item?.id,
            [key]: currentItems.id,
            [objectKeyMapping]: item,
          });
        });
        return list;
      },
      [key, keyMapping, objectKeyMapping],
    );

    return [
      loading,
      setLoading,
      listMapping,
      setListMapping,
      handleGetDetail,
      handleMapping,
      listMapping.length,
    ];
  }

  public useTableScroll<T extends Model, TFilter extends ModelFilter>(
    list: T[],
    setList: Dispatch<SetStateAction<T[]>>,
    filter: TFilter,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    getList: (filter: TFilter) => Promise<T[]>,
    total?: number,
    setLoadList?: Dispatch<SetStateAction<boolean>>,
    loading?: boolean, // decide whether display loadMore button when scrollHeight of container less than scrollContainerHeight
  ): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    (callback?: any) => void,
    <TF extends Filter>(field: string, callback?: any) => (f: TF) => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    React.MutableRefObject<any>,
    boolean,
    (
      filterField: string,
      dependField: string,
      dependFilter: any,
      setDependFilter: Dispatch<SetStateAction<any>>,
      callback?: any,
    ) => (f: any) => void,
    (onReset: () => void, callback?: any) => void,
  ] {
    const [translate] = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const [isCount, setIsCount] = React.useState<boolean>(true);
    const [displayLoadMore, setDisplayLoadMore] = React.useState<boolean>(
      false,
    );
    useEffect(() => {
      if (!loading && typeof loading !== 'undefined') {
        if (
          ref?.current?.scrollHeight <= INF_CONTAINER_HEIGHT &&
          filter.skip + INF_CONTAINER_HEIGHT < total
        ) {
          setDisplayLoadMore(true); // set loadMore button visibly
          return;
        }
        setDisplayLoadMore(false); // else hidden loadMoreButton
      }
    }, [filter.skip, loading, total]);

    const scrollToTop = () => {
      ref?.current?.scrollIntoView({ behavior: 'auto' });
    }; // scroll to Top when handleFilter, handleSearch

    const handleInfiniteOnLoad = React.useCallback(
      debounce(() => {
        if (filter.skip >= total) {
          setLoading(false);
          setHasMore(false);
          notification.info({
            message: translate('general.info.reachEnd'),
            description: translate('general.info.reachEnd'),
          });
          return;
        }
        setLoading(true);
        getList({
          ...filter,
          skip: filter.skip + INFINITE_SCROLL_TAKE,
          take: INFINITE_SCROLL_TAKE,
        })
          .then(newList => {
            newList = newList.map(item => ({ ...item, key: uuidv4() }));
            setList([...list, ...newList]);
            setFilter({
              ...filter,
              skip: filter.skip + INFINITE_SCROLL_TAKE,
              take: INFINITE_SCROLL_TAKE,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }),
      [filter, getList, list, setFilter, setList, setLoading, total, translate],
    );

    const handleSearch = React.useCallback(
      (callback?: any) => {
        setHasMore(true);
        setFilter(
          ModelFilter.clone<TFilter>({
            ...filter,
            skip: 0,
            take: INFINITE_SCROLL_TAKE,
          }),
        );
        setLoadList(true);
        setIsCount(true);
        scrollToTop();
        if (typeof callback === 'function') {
          callback();
        }
      },
      [filter, setFilter, setLoadList],
    );

    const handleResetScroll = React.useCallback(
      (onReset: () => void, callback?: any) => {
        onReset();
        scrollToTop();
        if (typeof callback === 'function') {
          callback();
        }
      },
      [],
    );

    const handleFilterScroll = React.useCallback(
      <TF extends Filter>(field: string, callback?: any) => {
        return (f: TF) => {
          setHasMore(true);
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
              skip: 0,
              take: INFINITE_SCROLL_TAKE,
            }),
          );
          setLoadList(true);
          scrollToTop();
          if (typeof callback === 'function') {
            callback();
          }
        };
      },
      [filter, setFilter, setLoadList],
    );

    const handleIndepentFilter = React.useCallback(
      (
        filterField: string, // Eg: organizationId
        dependField: string, // Eg: appUserId
        dependFilter: any,
        setDependFilter: Dispatch<SetStateAction<any>>,
        callback?: any,
      ) => {
        return (f: any) => {
          setHasMore(true); // allow load
          setFilter({
            ...filter,
            [dependField]: undefined,
            [filterField]: f,
            skip: 0,
            take: INFINITE_SCROLL_TAKE,
          }); // setRootFilter
          setDependFilter({ ...dependFilter, [filterField]: f }); // setDependFilter
          setLoadList(true);
          scrollToTop();
          if (typeof callback === 'function') {
            callback(f);
          }
        };
      },
      [filter, setFilter, setLoadList],
    );

    return [
      hasMore,
      setHasMore,
      handleInfiniteOnLoad,
      handleSearch,
      handleFilterScroll,
      isCount,
      setIsCount,
      ref,
      displayLoadMore,
      handleIndepentFilter,
      handleResetScroll,
    ];
  }

  public useLocalTableScroll<T extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    source: T[],
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    reLoad: boolean,
    setReload: Dispatch<SetStateAction<boolean>>,
    hasMore: boolean,
    setHasMore: Dispatch<SetStateAction<boolean>>,
    ref: MutableRefObject<HTMLDivElement>,
  ) {
    // need ref container, hasMore, handleInfiniteOnLoad, displayLoadMore
    const [translate] = useTranslation();
    const [list, setList] = React.useState<T[]>([]);
    const [displayLoadMore, setDisplayLoadMore] = React.useState<boolean>(
      false,
    );

    const mockRemoteSource = useMemo(
      () =>
        new Promise(resolve => {
          resolve(
            _.chain(source)
              .drop(filter?.skip ? filter.skip : 0)
              .take(filter?.take ? filter.take : INFINITE_SCROLL_TAKE) // take
              .value(),
          );
        }),
      [filter, source],
    );

    const getListFromSource = useCallback(
      (firstLoad: boolean = false) => {
        setLoading(true);
        mockRemoteSource
          .then((newList: T[]) => {
            if (newList.length > 0) {
              newList = newList.map(item => ({ ...item, key: uuidv4() }));
              firstLoad
                ? setList([...newList])
                : setList([...list, ...newList]);
              setFilter({
                ...filter,
                skip: filter.skip + INFINITE_SCROLL_TAKE,
                take: INFINITE_SCROLL_TAKE,
              });
              return;
            }
            if (firstLoad) setList([]);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      [filter, list, mockRemoteSource, setFilter, setLoading],
    ); // mock getList from server

    useEffect(() => {
      if (!loading && typeof loading !== 'undefined') {
        if (
          ref?.current?.scrollHeight <= INF_CONTAINER_HEIGHT &&
          filter.skip + INF_CONTAINER_HEIGHT < source.length
        ) {
          setDisplayLoadMore(true); // set loadMore button visibly
          return;
        }
        setDisplayLoadMore(false); // else hidden loadMoreButton
      }
    }, [filter.skip, loading, source.length, ref]);

    useEffect(() => {
      if (reLoad) {
        getListFromSource(true); // loadList
        setReload(false);
      }
    }, [getListFromSource, filter, setFilter, reLoad, setReload]); // preLoad default item

    const handleInfiniteOnLoad = React.useCallback(
      debounce(() => {
        if (filter.skip >= source.length) {
          setLoading(false);
          setHasMore(false);
          notification.info({
            message: translate('general.info.reachEnd'),
            description: translate('general.info.reachEnd'),
          });
          return;
        }
        getListFromSource();
      }),
      [filter, source, setLoading, source.length, translate, getListFromSource],
    );

    return {
      list,
      ref,
      hasMore,
      handleInfiniteOnLoad,
      displayLoadMore,
    };
  }

  public usePopupQuery(handleOpenPopup) {
    const [loading, setLoading] = React.useState<boolean>(true);
    React.useEffect(() => {
      if (loading) {
        const url = document.URL;
        const temp = url.split('#');
        const id = Number(temp[1]);
        if (url.includes('#') && typeof handleOpenPopup === 'function') {
          handleOpenPopup(id);
          setLoading(false);
        }
      }
    }, [handleOpenPopup, loading]);
  }

  /* useAction to validate api return from BE */

  public useAction(module: string, baseAction: string, baseSite?: string) {
    const actionContext = useContext<string[]>(ActionContext);
    const [actionMapper, setActionMapper] = useState<Record<string, number>>(
      {},
    );
    useEffect(() => {
      let base: string = null;
      if (!baseSite) {
        base = 'dms';
      } else {
        base = baseSite;
      }

      const mapper: Record<string, number> = {};
      const regex = new RegExp(`^(rpc/${base}/${module})/`, 'i');
      actionContext.forEach((item: string, index: number) => {
        if (item.match(regex)) {
          mapper[item] = index;
        }
      });
      setActionMapper(mapper);
    }, [actionContext, module, baseSite]);

    const buildAction = useCallback(
      (action: string) => {
        return `${baseAction}/${kebabCase(action)}`;
      },
      [baseAction],
    );

    const validAction = useMemo(() => {
      return (action: string) => {
        if (
          !_.isEmpty(actionMapper) &&
          actionMapper.hasOwnProperty(buildAction(action))
        ) {
          return true;
        }
        return false;
      };
    }, [actionMapper, buildAction]);

    return { validAction };
  }
}

export const crudService: CRUDService = new CRUDService();
