import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';

export class ERouteChangeRequestService {
  public useStoreContentMaster(
    getList: (filter: StoreFilter) => Promise<Store[]>,
    count: (filter: StoreFilter) => Promise<number>,
  ): [
      StoreFilter,
      Dispatch<SetStateAction<StoreFilter>>,
      Store[],
      Dispatch<SetStateAction<Store[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
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
    }, [count, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [filter, setFilter, list, setList, loading, setLoading, handleSearch, total];
  }

}

export const eRouteChangeRequestService: ERouteChangeRequestService = new ERouteChangeRequestService();
