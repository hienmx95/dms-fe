import { Modal } from 'antd';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderFilter } from 'models/Direct/DirectSalesOrderFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

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
            setLoadList(false);
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
    const [translate] = useTranslation();
    const [filterItem, setFilterItem] = React.useState<ItemFilter>(
      new ItemFilter(),
    );
    const [loadList, setLoadList] = React.useState<boolean>(false);
    const [firstTime, setFirstTime] = React.useState<boolean>(true);

    /* handle Open appUser modal */

    const handleOpenModal = React.useCallback(() => {
      setFilterItem({
        ...filterItem,
        storeId: { equal: currentStore?.id ||  model?.buyerStoreId },
        salesEmployeeId: { equal: model?.saleEmployeeId },
        skip: 0,
        id: {},
      });
      setFirstTime(true);
      if (typeof model.saleEmployeeId === 'undefined') {
        Modal.warning({
          title: '',
          content: translate('directSalesOrders.errors.saleEmployee'),
        });
      } else if (typeof model.buyerStoreId === 'undefined') {
        Modal.warning({
          title: '',
          content: translate('directSalesOrders.errors.buyerStore'),
        });
      } else {
        setLoadList(true);
        setVisible(true);
      }
    }, [filterItem, currentStore, model, translate, setVisible]);

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
      firstTime,
      setFirstTime,
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
    React.useEffect(() => {
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
    const handleSearch = React.useCallback(() => {
      setloadList(true);
    }, [setloadList]);

    /* handle filter appUser modal */

    const handleChangeFilter = React.useCallback(() => {
      filter.skip = 0;
      Promise.all([getList(filter), getCount(filter)])
        .then(([listItem, totalItem]) => {
          setList(listItem);
          setTotal(totalItem);
          handleSearch();
        })
        .finally(() => {
          setLoading(false);
        });
    }, [
      getList,
      filter,
      getCount,
      setList,
      setTotal,
      handleSearch,
      setLoading,
    ]);

    /* handle reset search appUser modal */
    const handleReset = React.useCallback(() => {
       const newFilter = new ItemFilter();
      newFilter.storeId.equal = filter.storeId?.equal;
      newFilter.salesEmployeeId.equal = filter.salesEmployeeId?.equal;
      setFilter(newFilter);
      setloadList(true);
    }, [filter.salesEmployeeId, filter.storeId, setFilter, setloadList]);

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
      handleReset,
      handleSave,
    };
  }
}
export const directSalesOrderService: DirectSalesOrderService = new DirectSalesOrderService();
