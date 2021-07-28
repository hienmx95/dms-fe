import { AxiosError, AxiosResponse } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import React from 'react';
import { Model, ModelFilter } from 'core/models';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { ShowingOrder } from 'models/posm/ShowingOrder';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { notification } from 'helpers';
import { useTranslation } from 'react-i18next';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingOrderContent } from 'models/posm/ShowingOrderContent';

export class ShowingOrderService {
  useModal<T extends Model, TFilter extends ModelFilter>(
    filteClass: new () => TFilter,
    defaultFitler?: TFilter,
  ) {
    const [loadList, setLoadList] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<T[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filterStore, setFilterStore] = useState<TFilter>(
      defaultFitler ? defaultFitler : new filteClass(),
    );
    const handleOpenStoreModal = useCallback(() => {
      setIsOpen(true);
      setLoadList(true);
    }, []);

    const handleCloseStoreModal = useCallback(() => {
      setIsOpen(false);
    }, []); // onClose

    const handleSaveStore = useCallback(
      (callback?: (list: T[]) => void) => {
        return (list: T[]) => {
          handleCloseStoreModal();
          if (typeof callback === 'function') callback(list);
        };
      },
      [handleCloseStoreModal],
    ); // onClose

    return {
      loadList,
      setLoadList,
      handleOpenStoreModal,
      handleCloseStoreModal,
      handleSaveStore,
      isOpen,
      setIsOpen,
      selectedList,
      setSelectedList,
      filterStore,
      setFilterStore,
    };
  } // for controller component

  public useStoreContentMaster(
    getList: (filter: StoreFilter) => Promise<Store[]>,
    count: (filter: StoreFilter) => Promise<number>,
    organizationId: any,
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
    const [filter, setFilter] = useState<StoreFilter>(new StoreFilter());
    const [loading, setLoading] = useState<boolean>(true);
    const [loadList, setLoadList] = useState<boolean>(true);
    const [list, setList] = useState<Store[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
      if (loadList) {
        setLoading(true);
        filter.organizationId.equal = organizationId;
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
            setLoadList(false);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, filter, getList, loadList, organizationId]);

    const handleSearch = useCallback(() => {
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

  public useItemModal(
    setVisible: Dispatch<SetStateAction<boolean>>,
    model: ShowingOrder,
  ) {
    const [filter, setFilter] = useState<ShowingItemFilter>(
      new ShowingItemFilter(),
    );
    const [loadList, setLoadList] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<ShowingItem[]>([]);

    /* handle Open appUser modal */

    const handleOpenModal = useCallback(() => {
      setFilter({
        ...filter,
        showingWarehouseId: { equal: model?.showingWarehouse?.id },
        skip: 0,
      });

      if (
        model?.showingOrderContents &&
        model?.showingOrderContents?.length > 0
      ) {
        const selectedShowingItem = model.showingOrderContents.map(
          (content: ShowingOrderContent) => {
            return content.showingItem;
          },
        );
        setSelectedList([...selectedShowingItem]);
      }

      setLoadList(true);
      setVisible(true);
    }, [filter, model, setVisible]);

    /* handle close appUser modal */
    const handleCloseModal = useCallback(() => {
      setVisible(false);
    }, [setVisible]);
    return {
      filter,
      setFilter,
      handleCloseModal,
      handleOpenModal,
      loadList,
      setLoadList,
      selectedList,
      setSelectedList,
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
    const [list, setList] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [isReset, setIsReset] = useState<boolean>(false);
    useEffect(() => {
      if (loadList) {
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
    const handleSearch = useCallback(() => {
      setloadList(true);
    }, [setloadList]);

    const handleDefaultSearch = useCallback(() => {
      setFilter({ ...filter, skip: 0 }); // reset skip
      setloadList(true);
    }, [setloadList, filter, setFilter]);

    /* handle filter appUser modal */

    const handleChangeFilter = useCallback(
      (field: string) => {
        return (f: any) => {
          setFilter({ ...filter, [field]: f, skip: 0 }); // reset skip
          setloadList(true);
        };
      },
      [setFilter, setloadList, filter],
    );

    /* handle reset search appUser modal */
    const handleReset = useCallback(() => {
      setFilter({
        ...new ItemFilter(),
        storeId: filter.buyerStoreId,
      });
      setloadList(true);
      setIsReset(true);
    }, [filter.buyerStoreId, setFilter, setloadList]);

    const handleSave = useCallback(
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
      },
      [filter, onImport, setLoading, translate],
    );

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

export const showingOrderService: ShowingOrderService = new ShowingOrderService();
