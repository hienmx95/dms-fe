import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';

export class ERouteService {
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
    const [filter, setFilter] = React.useState<StoreFilter>(
      new StoreFilter(),
    );
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
    }, [
      getList,
      filter,
      count,
      setList,
      setTotal,
      handleSearch,
      setLoading,
    ]);



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


}

export const eRouteService: ERouteService = new ERouteService();
