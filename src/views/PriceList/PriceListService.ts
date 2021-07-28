import { Modal } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { SorterResult, TableRowSelection } from 'antd/lib/table';
import { generalLanguageKeys } from 'config/consts';
import { DEFAULT_TAKE } from 'core/config';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { getOrderType, setOrderType } from 'helpers/ant-design/table';
import { PriceList } from 'models/priceList/PriceList';
import {
  Dispatch,
  Reducer,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  RefObject,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import { AxiosError, AxiosResponse } from 'axios';
import { notification } from '../../helpers/notification';
import { priceListRepository } from './PriceListRepository';

export class PriceListService {
  usePriceListMappingTable<
    TMapping extends Model, // Eg: PriceListStoreMappings
    TMapper extends Model, // Eg: Store
    TMappingFilter extends ModelFilter
  >(
    MappingFilterClass: new () => TMappingFilter,
    model: PriceList,
    setModel: Dispatch<SetStateAction<PriceList>>,
    mappingField: string,
    mapperField: string,
    mapper: (model: TMapping) => TMapping,
    isPreview?: boolean,
  ) {
    const [translate] = useTranslation();

    /* priceListMapping filter eg PriceListStoreMappingFilter or PriceListItemMappingFilter */
    const [filter, setFilter] = useState<TMappingFilter>(
      new MappingFilterClass(),
    );

    /* content and setContent, TMapping eg PriceListStoreMappings or PriceListItemMappings */
    const [content, setContent] = crudService.useContentTable<
      PriceList,
      TMapping
    >(model, setModel, mappingField);

    /* list for row selection in table, TMapper eg Store or Item */
    const [selectedList, setSelectedList] = useState<TMapper[]>(
      content.length > 0 ? content.map(item => item[mapperField]) : [],
    );

    /* delete content in content table and selectedList which affects mapping modal */
    const handleDeleteContent = useCallback(
      (contentItem: TMapping, index: number) => {
        return () => {
          const newSelectedList = selectedList.filter(
            item => item.id !== contentItem[`${mapperField}Id`],
          );
          setSelectedList([...newSelectedList]);
          // delete content by index
          content.splice(index, 1);
          // update table index of each content
          setContent([
            ...content.map((content, index) => ({
              ...content,
              tableIndex: index,
            })),
          ]);
        };
      },
      [content, mapperField, selectedList, setContent],
    );

    /* selected Content for rowSelection in content table */
    const [selectedContent, setSelectedContent] = useState<TMapping[]>([]);

    /* rowSelection for table */
    const rowSelection: TableRowSelection<TMapping> = crudService.useContentModalList<
      TMapping
    >(selectedContent, setSelectedContent, isPreview);

    /* table services */
    const [
      dataSource,
      pagination,
      ,
      handleTableChange,
      handleFilter,
    ] = tableService.useLocalTable<TMapping, TMappingFilter>(
      transformMethod(content, mapper), // transform content to dynamic searchable content
      filter,
      setFilter,
    );

    const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
      TMapping
    >(content, setContent);

    /* bulk delete */
    const handleBulkDelete = useCallback(() => {
      Modal.confirm({
        title: translate(generalLanguageKeys.delete.title),
        content: translate(generalLanguageKeys.delete.content),

        onOk() {
          const ids = selectedContent.map(model => model[`${mapperField}Id`]); // storeIds or itemIds which are deleted
          // setSelectedContent to []
          setSelectedContent([]);
          // filter selectedList not in ids
          setSelectedList(
            selectedList.filter(model => !ids.includes(model.id)),
          );
          // filter content not in ids
          setContent(
            content.filter(model => !ids.includes(model[`${mapperField}Id`])),
          );
        },
      });
    }, [
      content,
      mapperField,
      selectedContent,
      selectedList,
      setContent,
      translate,
    ]);

    /* decide when we can trigger bulkDelete */
    const hasSelect = useMemo(() => {
      return selectedContent?.length > 0;
    }, [selectedContent]);

    /* Modal service */
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /* trigger fetch data in modal */
    const [loadList, setLoadList] = useState<boolean>(false);

    /* openModal method */
    const handleOpenModal = useCallback(() => {
      // trigger open
      setIsOpen(true);
      // trigger loadlist
      setLoadList(true);
    }, []);

    /* closeModal method */
    const handleCloseModal = useCallback(() => {
      // trigger close
      setIsOpen(false);
      // trigger loadlist
      setLoadList(false);
      setSelectedList(
        content.length > 0 ? content.map(item => item[mapperField]) : [],
      );
    }, [content, mapperField]);

    return {
      translate,
      content,
      setContent,
      dataSource,
      pagination,
      handleTableChange,
      handleFilter,
      handleBulkDelete,
      handleOpenModal,
      handleCloseModal,
      isOpen,
      loadList,
      setLoadList,
      selectedList,
      setSelectedList,
      rowSelection,
      hasSelect,
      handleDeleteContent,
      filter,
      setFilter,
      handleChangeListSimpleField,
    };
  }

  usePreview() {
    const [model, setModel] = useState<PriceList>(new PriceList());
    const [previewLoading, setPreviewLoading] = useState<boolean>(false);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const handleOpenPreview = useCallback((id: number | string) => {
      return () => {
        setModel(new PriceList());
        setPreviewLoading(true);
        setPreviewVisible(true);
        priceListRepository
          .get(+id)
          .then((model: PriceList) => {
            setModel(model);
          })
          .finally(() => {
            setPreviewLoading(false);
          });
      };
    }, []);

    const handleClosePreview = useCallback(() => {
      setPreviewVisible(false);
      setModel(new PriceList());
    }, []);

    return {
      model,
      setModel,
      previewLoading,
      previewVisible,
      handleOpenPreview,
      handleClosePreview,
    };
  }

  useSimpleMappingTable<
    TMapping extends Model,
    TMapper extends Model,
    TMapperFilter extends ModelFilter
  >(
    MappingClass: new () => TMapping,
    MapperFilterClass: new () => TMapperFilter,
    model: PriceList,
    setModel: Dispatch<SetStateAction<PriceList>>,
    mappingField: string,
    mapperField: string,
    getList: (filter: TMapperFilter) => Promise<TMapper[]>,
    isPreview?: boolean,
  ) {
    const [translate] = useTranslation();
    /* content and setContent, TMapping eg PriceListStoreMappings or PriceListItemMappings */
    const [content, setContent] = crudService.useContentTable<
      PriceList,
      TMapping
    >(model, setModel, mappingField);

    const [list, setList] = useState<TMapper[]>([]);
    const [filter] = useState<TMapperFilter>(new MapperFilterClass());
    const [loadList, setLoadList] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      let isCancelled = false;
      if (loadList) {
        setLoading(true);
        getList(filter)
          .then((items: TMapper[]) => {
            if (!isCancelled) {
              setList([...items]);
            }
          })
          .finally(() => {
            setLoading(false);
            setLoadList(false);
          });
      }
      return () => {
        isCancelled = true;
      };
    }, [filter, getList, loadList]);

    /* selected Content for rowSelection in content table */
    const [selectedList, setSelectedList] = useState<TMapper[]>(
      model[mappingField]?.length > 0
        ? model[mappingField].map(item => item[mapperField])
        : [],
    );

    const removeDuplicate = useMemo(() => {
      return (mergeList: any[]) => {
        return mergeList.filter(
          (item, index) =>
            mergeList
              .map(i => (i.id ? i.id : i.key))
              .indexOf(item.id ? item.id : item.key) === index,
        );
      };
    }, []);

    /* rowSelection for table */
    const rowSelection: TableRowSelection<TMapper> = useMemo(
      () => ({
        onSelect: (record: TMapper, selected: boolean) => {
          if (selected) {
            // if item is selected, add rowkey
            const newContent = new MappingClass();
            (newContent as any)[`${mapperField}`] = record;
            (newContent as any)[`${mapperField}Id`] = record.id;
            content.push(newContent);
            selectedList.push(record);
            setContent([...content]);
            setSelectedList([...selectedList]);
            return;
          }
          setContent([
            ...content.filter(
              item => (item as any)[`${mapperField}Id`] !== record.id,
            ),
          ]);
          setSelectedList([
            ...selectedList.filter(item => item.id !== record.id),
          ]);
        },
        onChange: (...[, selectedRows]) => {
          /* if selectedRows === 0, set empty array, else set all */

          if (selectedRows.length === 0) {
            setSelectedList([]);
            setContent([]);
            return;
          }
          /* filter list by remove duplicate */
          const newContents = selectedRows.map(item => {
            const newContent = new MappingClass();
            (newContent as any)[`${mapperField}`] = item;
            (newContent as any)[`${mapperField}Id`] = item.id;
            return newContent;
          });
          const mergeList = [...selectedList, ...selectedRows];
          setSelectedList([...removeDuplicate(mergeList)]);
          setContent([...newContents]);
        },
        getCheckboxProps: () => ({ disabled: isPreview ? true : false }),
        selectedRowKeys: selectedList.map((t: TMapper) =>
          t.id ? t.id : t.key,
        ),
      }),
      [
        MappingClass,
        content,
        isPreview,
        mapperField,
        removeDuplicate,
        selectedList,
        setContent,
      ],
    );

    // useEffect(() => {
    //   console.log(`content: `, content);
    // }, [content]);

    // useEffect(() => {
    //   console.log(`selectedList: `, selectedList);
    // }, [selectedList]);

    return {
      translate,
      list,
      loading,
      rowSelection,
    };
  }

  useSimpleModal<TMapper extends Model>() {
    /* Modal service */
    const [isOpen, setIsOpen] = useState<boolean>(false);
    /* trigger fetch data in modal */
    const [loadList, setLoadList] = useState<boolean>(false);
    /* itemId */
    const [itemId, setItemId] = useState<number>(undefined);
    /* openModal method */
    const handleOpenModal = useCallback((id: number) => {
      return () => {
        setItemId(id);
        // trigger open
        setIsOpen(true);
        // trigger loadlist
        setLoadList(true);
      };
    }, []);
    /* closeModal method */
    const handleCloseModal = useCallback(() => {
      // trigger close
      setIsOpen(false);
      // trigger loadlist
      setLoadList(false);
    }, []);
    const [selectedList, setSelectedList] = useState<TMapper[]>([]);
    return {
      isOpen,
      loadList,
      setLoadList,
      handleOpenModal,
      handleCloseModal,
      selectedList,
      setSelectedList,
      itemId,
    };
  }

  usePriceListMappingModal<
    TMapper extends Model,
    TMapperFilter extends ModelFilter
  >(
    ModelFilter: new () => TMapperFilter,
    loadList: boolean,
    setLoadList: Dispatch<SetStateAction<boolean>>,
    onSave: (list: TMapper[]) => void,
    onClose: () => void,
    getList: (filter: TMapperFilter) => Promise<TMapper[]>,
    getTotal: (filter: TMapperFilter) => Promise<number>,
    defaultState: PriceListMappingModalState<TMapper, TMapperFilter>,
    selectedList?: TMapper[],
    setSelectedList?: Dispatch<SetStateAction<TMapper[]>>,
    customerFilter?: (filter: TMapperFilter) => TMapperFilter,
    firstLoad?: React.MutableRefObject<boolean>,
  ) {
    const [translate] = useTranslation();

    const [{ loading, list, filter, total }, dispatch] = useReducer<
      Reducer<
        PriceListMappingModalState<TMapper, TMapperFilter>,
        PriceListMappingModalAction<TMapper, TMapperFilter>
      >
    >(masterReducer, defaultState);

    const [isReset, setIsReset] = useState<boolean>(false);

    const rowSelection: TableRowSelection<TMapper> = crudService.useContentModalList<
      TMapper
    >(selectedList, setSelectedList);

    useEffect(() => {
      if (loadList) {
        setLoadList(false);
        let newFilter = filter;
        if (typeof customerFilter === 'function') {
          newFilter = customerFilter(filter);
          dispatch({
            type: SET_FILTER,
            payload: { filter: newFilter },
          });
        }
        dispatch({ type: LOADING }); // dispatch loading
        Promise.all([getList(newFilter), getTotal(newFilter)]).then(
          ([list, total]) => {
            dispatch({
              type: SET_LIST,
              payload: { list, total, loading: false },
            }); // dispatch setList
          },
        );
      }
    }, [
      ModelFilter,
      customerFilter,
      filter,
      getList,
      getTotal,
      loadList,
      setLoadList,
    ]);

    const handleFilter = useCallback(
      (field: string) => {
        return (f: any) => {
          dispatch({
            type: SET_FILTER,
            payload: {
              filter: { ...filter, [field]: f, skip: 0, take: DEFAULT_TAKE },
            },
          });
          setLoadList(true);
        };
      },
      [filter, setLoadList],
    );

    const handleClose = useCallback(() => {
      dispatch({
        type: RESET_FILTER,
        payload: {
          filter: { ...new ModelFilter(), skip: 0, take: DEFAULT_TAKE },
        },
      });
      if (firstLoad) {
        firstLoad.current = true;
      } // setfirstLoad to true
      if (typeof onClose === 'function') {
        onClose();
      }
    }, [ModelFilter, onClose, firstLoad]);

    const handleSave = useCallback(() => {
      if (typeof onSave === 'function') {
        onSave(selectedList);
      }
      handleClose();
    }, [handleClose, onSave, selectedList]);

    const handleSearch = useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    const handleDefaultSearch = useCallback(() => {
      dispatch({
        type: DEFAULT_FILTER,
      });
      setLoadList(true);
    }, [setLoadList]);

    const handleReset = useCallback(() => {
      setIsReset(true);
      dispatch({
        type: RESET_FILTER,
        payload: {
          filter: { ...new ModelFilter(), skip: 0, take: DEFAULT_TAKE },
        },
      });
      setLoadList(true);
    }, [ModelFilter, setLoadList]);

    const pagination: PaginationProps = useMemo(() => {
      const { take, skip } = filter;
      return {
        total,
        current: skip / take + 1,
        pageSize: take,
        showSizeChanger: true,
      };
    }, [filter, total]);

    const sorter: SorterResult<TMapper> = useMemo(
      () =>
        ({
          field: filter.orderBy,
          order: getOrderType(filter),
        } as SorterResult<TMapper>),
      [filter],
    );

    const handleTableChange = useCallback(
      (
        newPagination: PaginationProps,
        filters: Record<string, any>,
        newSorter: SorterResult<TMapper>,
      ) => {
        const { field, order } = sorter;
        if (newSorter.field !== field || newSorter.order !== order) {
          const newFilter: TMapperFilter = {
            ...filter,
            orderBy: newSorter.field,
            skip: 0,
          };
          setOrderType(newFilter, newSorter.order);
          dispatch({ type: SET_FILTER, payload: { filter: newFilter } });

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
          dispatch({
            type: SET_FILTER,
            payload: {
              filter: {
                ...filter,
                take: pageSize,
                skip: (current - 1) * pageSize,
              },
            },
          });
          handleSearch();
          return;
        }
        dispatch({
          type: SET_FILTER,
          payload: {
            filter: {
              ...filter,
              ...filters,
            },
          },
        });
        handleSearch();
      },
      [filter, handleSearch, pagination, sorter],
    );

    return {
      translate,
      handleSave,
      handleClose,
      loading,
      list,
      filter,
      isReset,
      setIsReset,
      handleFilter,
      handleDefaultSearch,
      handleReset,
      rowSelection,
      pagination,
      handleTableChange,
      dispatch,
    };
  }

  useImportContentHandler<
    TContent extends Model,
    TMapper extends Model,
    TFilter extends ModelFilter
  >(
    ModelFilter: new () => TFilter,
    setContent: Dispatch<SetStateAction<TContent[]>>,
    setSelectedList: Dispatch<SetStateAction<TMapper[]>>,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    mapperField: string,
  ) {
    // set new Content return from BE
    const handleSuccess = useCallback(
      (list: TContent[]) => {
        setContent(list);
        setSelectedList(list.map(model => model[mapperField]));
        setFilter({ ...new ModelFilter() });
      },
      [ModelFilter, mapperField, setContent, setFilter, setSelectedList],
    );

    return {
      handleSuccess,
    };
  }

  useImport<TContent extends Model>(
    onImport: (file: File, priceListId: number) => Promise<TContent[]>,
    priceListId: number,
    onImportSuccess?: (list: TContent[]) => void,
  ) {
    const [translate] = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const ref: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [errVisible, setErrVisible] = useState<boolean>(false);
    const [errorModel, setErrorModel] = useState<string>();

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
          const file: File = event.target.files[0];
          setLoading(true);
          onImport(file, priceListId)
            .then((list: TContent[]) => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
              // if success, update content from BE
              if (typeof onImportSuccess === 'function') {
                onImportSuccess(list);
              }
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
      [onImport, onImportSuccess, priceListId, translate],
    );

    const handleClick = useCallback(() => {
      ref.current.value = null;
    }, []);

    return {
      handleChange,
      handleClick,
      ref,
      errVisible,
      setErrVisible,
      errorModel,
      loading,
    };
  }

  useExport(
    onExport: (model?: PriceList) => Promise<any>,
    onExportTemplate: (id: number | string) => Promise<any>,
    model: PriceList,
  ) {
    const handleExport = () => {
      onExport(model).then((response: AxiosResponse<any>) => {
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
      });
    };

    const handleExportTemplate = () => {
      onExportTemplate(model.id).then((response: AxiosResponse<any>) => {
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
        return;
      });
    };

    return { handleExport, handleExportTemplate };
  }
}

export interface PriceListMappingModalState<
  TMapper extends Model,
  TMapperFilter extends ModelFilter
> {
  loading?: boolean;
  list?: TMapper[];
  filter?: TMapperFilter;
  total?: number;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
  pagination?: PaginationProps;
}

export interface PriceListMappingModalAction<
  TMapper extends Model,
  TMapperFilter extends ModelFilter
> {
  type: string;
  payload?: PriceListMappingModalState<TMapper, TMapperFilter>;
}

export function masterReducer<
  TMapper extends Model,
  TMapperFilter extends ModelFilter
>(
  state: PriceListMappingModalState<TMapper, TMapperFilter>,
  action: PriceListMappingModalAction<TMapper, TMapperFilter>,
) {
  switch (action.type) {
    case SET_LIST: {
      return {
        ...state,
        list: action.payload?.list,
        total: action.payload?.total,
        loading: action.payload?.loading,
      };
    }
    case LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SET_FILTER: {
      return {
        ...state,
        filter: action.payload?.filter,
      };
    }
    // reset filter to new modelFilter, set isReset to true
    case RESET_FILTER: {
      return {
        ...state,
        filter: action.payload?.filter,
        isReset: true,
      };
    }
    // maintain props of filter except skip and take
    case DEFAULT_FILTER: {
      return {
        ...state,
        filter: { ...state.filter, skip: 0, take: DEFAULT_TAKE },
      };
    }
  }
}

/* transform content for local filter, in case BE does not save that content in DB */
function transformMethod<TMapping extends Model>(
  content: TMapping[],
  mapper: (model: TMapping) => TMapping,
): TMapping[] {
  return content.map((model: TMapping) => mapper(model));
}

export const SET_LIST = 'SET_LIST';
export const SET_FILTER = 'SET_FILTER';
export const RESET_FILTER = 'RESET_FILTER';
export const DEFAULT_FILTER = 'DEFAULT_FILTER';
export const LOADING = 'LOADING';
export const SET_PAGINATION = 'SET_PAGINATION';

export const priceListService = new PriceListService();
