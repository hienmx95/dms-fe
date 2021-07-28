import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { Organization } from 'models/Organization';

export class OrganizationService {
  public useAppUserContentMaster(
    getList: (filter: AppUserFilter) => Promise<AppUser[]>,
    count: (filter: AppUserFilter) => Promise<number>,
    currentItem: Organization,
  ): [
      AppUserFilter,
      Dispatch<SetStateAction<AppUserFilter>>,
      AppUser[],
      Dispatch<SetStateAction<AppUser[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      () => void,
      number,
    ] {
    const [filter, setFilter] = React.useState<AppUserFilter>(
      new AppUserFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<AppUser[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    React.useEffect(() => {
      if (currentItem) {
        const newFilter = new AppUserFilter();
        newFilter.organizationId.equal = currentItem.id;
        setFilter(newFilter);
      }
    }, [currentItem]);
    // setList and count
    React.useEffect(() => {
      if (loadList && currentItem) {
        const newFilter = new AppUserFilter();
        newFilter.organizationId.equal = currentItem.id;
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
    }, [count, currentItem, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [filter, setFilter, list, setList, loading, setLoading, handleSearch, total];
  }

}

export const organizationService: OrganizationService = new OrganizationService();
