import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { Model, ModelFilter } from 'core/models';
import { Filter } from 'core/filters';

export const modalService = {
  useModal<T extends Model, TFilter extends ModelFilter>(
    filteClass: new () => TFilter,
    defaultFitler?: TFilter,
  ) {
    const [loadList, setLoadList] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<T[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<TFilter>(
      defaultFitler ? defaultFitler : new filteClass(),
    );
    const handleOpenModal = useCallback(() => {
      setIsOpen(true);
      setLoadList(true);
    }, []);

    const handleCloseModal = useCallback(() => {
      setIsOpen(false);
    }, []); // onClose

    const handleSave = useCallback(
      (callback?: (list: T[]) => void) => {
        return (list: T[]) => {
          handleCloseModal();
          if (typeof callback === 'function') callback(list);
        };
      },
      [handleCloseModal],
    ); // onClose

    return {
      loadList,
      setLoadList,
      handleOpenModal,
      handleCloseModal,
      handleSave,
      isOpen,
      setIsOpen,
      selectedList,
      setSelectedList,
      filter,
      setFilter,
    };
  }, // for controller component
  useMasterModal<T extends Model, TFilter extends ModelFilter = any>(
    modelFilterClass: new () => TFilter,
    filter: TFilter,
    setFilter: Dispatch<SetStateAction<TFilter>>,
    getList: (filter: TFilter) => Promise<T[]>,
    getTotal: (filter: TFilter) => Promise<number>,
    loadList: boolean,
    setLoadList: Dispatch<SetStateAction<boolean>>,
    onSave?: (list?: T[]) => void,
    onClose?: () => void,
  ) {
    const [list, setList] = useState<T[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isReset, setIsReset] = useState<boolean>(false); // for control advanceIdFilter

    useEffect(() => {
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), getTotal(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [filter, loadList, getList, getTotal, setLoadList]);

    const handleFilter = useCallback(
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
      [filter, modelFilterClass, setFilter, setLoadList],
    );

    const handleSearch = useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    const handleDefaultSearch = useCallback(() => {
      setFilter({ ...filter, skip: 0 });
      handleSearch();
    }, [handleSearch, filter, setFilter]);

    const handleResetFilter = useCallback(() => {
      setFilter({ ...new modelFilterClass(), skip: 0 });
      setIsReset(true); // setIsReset === true for reseting all advanceFilter
      handleSearch();
    }, [handleSearch, modelFilterClass, setFilter]);

    const handleClose = useCallback(() => {
      if (typeof onClose === 'function') {
        onClose();
        handleResetFilter();
      }
    }, [handleResetFilter, onClose]);

    const handleSave = useCallback(
      (selectedList: T[]) => {
        if (typeof onSave === 'function') {
          onSave(selectedList);
          handleResetFilter();
        }
      },
      [onSave, handleResetFilter],
    );

    return {
      list,
      total,
      setList,
      loading,
      setLoading,
      loadList,
      setLoadList,
      handleFilter,
      handleDefaultSearch,
      handleSearch,
      handleResetFilter,
      handleSave,
      handleClose,
      isReset,
      setIsReset,
      filter,
      setFilter,
    };
  }, // for modal component
};
