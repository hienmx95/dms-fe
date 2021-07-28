import { Model } from 'core/models';
import { DashboardStoreInfoFilter } from 'models/DashboardStoreInfoFilter';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useDashboardMap<T extends Model>(
  getPlace: (filter: DashboardStoreInfoFilter) => Promise<T[]>,
  filter?: DashboardStoreInfoFilter,
  loadMap?: boolean,
  setLoadMap?: Dispatch<SetStateAction<boolean>>,
) {
  const [translate] = useTranslation();
  const [places, setPlaces] = useState<T[]>([]);
  // const [filter, setFilter] = useState<TFilter>(new FilterClass());
  // const [childFilter, setChildFilter] = useState<TFilter2>(
  //   new ChildFilterClass(),
  // );
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(true);
  const [loadMarker, setLoadMarker] = useState<boolean>(true);

  useEffect(() => {
    if (loadMap) {
      setIsLoad(true);
      setLoadMap(false);
    }
  }, [loadMap, setIsLoad, setLoadMap]);
  useEffect(() => {
    const isCancelled = false;
    if (isLoad) {
      try {
        setLoading(true);
        const fetch = async () => {
          const list = await getPlace(filter);
          if (!isCancelled) {
            await setPlaces([...list]);
          }
          await setIsLoad(false);
          await setLoading(false);
          await setLoadMarker(true);
        };
        fetch();
      } catch (ex) {
        // tslint:disable-next-line:no-console
        console.log(`ex:`, ex);
      }
    }
  }, [filter, getPlace, isLoad, setIsLoad]);

  // const handleFilter = useCallback(
  //   (field: string) => {
  //     return (f: any) => {
  //       setFilter({
  //         ...filter,
  //         [field]: f,
  //       });
  //       setIsLoad(true);
  //       return;
  //     };
  //   },
  //   [filter],
  // );

  return {
    translate,
    filter,
    isLoad,
    setIsLoad,
    // childFilter,
    // setChildFilter,
    places,
    loading,
    loadMarker,
    setLoadMarker,
  };
}
