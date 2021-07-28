import { AxiosError } from 'axios';
import { Place } from 'components/GoogleMap/CustomGoogleMap';
import { INFINITE_SCROLL_TAKE } from 'core/config';
import { Model, ModelFilter } from 'core/models';
import { notification } from 'helpers';
import { DashboardStoreInfoFilter } from 'models/DashboardStoreInfoFilter';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

export class DashboardStoreInfoService {
  public useData(
    getData: (filter?: DashboardStoreInfoFilter) => Promise<any>,
    filter?: DashboardStoreInfoFilter,
  ): [any, Dispatch<SetStateAction<boolean>>] {
    const [loadData, setLoadData] = React.useState<boolean>(true);
    const [data, setData] = React.useState<any>(null);

    React.useEffect(() => {
      if (loadData) {
        const isCancelled = false;
        try {
          const fetch = async () => {
            const counter = await getData(filter);

            if (!isCancelled) {
              await setData(counter);
            }
            await setLoadData(false);
          };
          fetch();
        } catch (ex) {
          // tslint:disable-next-line:no-console
          console.log(`ex:`, ex);
        }
      }
    }, [loadData, filter, getData]);

    return [data, setLoadData];
  }

  public useMap(getPlace: () => Promise<Place[]>) {
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [places, setPlaces] = useState<Place[]>([]);
    const [hasPlaces, setHasPlaces] = useState<boolean>(false);

    const center = useMemo(() => {
      return () => ({
        lat: 21.027763,
        lng: 105.83416,
      });
    }, []);

    useEffect(() => {
      const isCancelled = false;
      if (isLoad) {
        try {
          const fetch = async () => {
            const list = await getPlace();
            if (!isCancelled) {
              await setPlaces([...list]);
            }
            await setIsLoad(false);
          };
          fetch();
        } catch (ex) {
          // tslint:disable-next-line:no-console
          console.log(`ex:`, ex);
        }
      }
    }, [getPlace, isLoad]);

    useEffect(() => {
      if (places.length) {
        setHasPlaces(true);
      }
    }, [places.length]);

    const handleLoad = useCallback(
      (map: any) => {
        const bounds = new window.google.maps.LatLngBounds();

        if (hasPlaces) {
          places
            .map((place: Place) => ({
              lat: place.latitude,
              lng: place.longitude,
            }))
            .forEach(coord => {
              const { lat, lng } = coord;
              if (!isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null) {
                // extends bound to contain that point
                bounds.extend(coord);
              }
            });
        }
        map.fitBounds(bounds);
      },
      [hasPlaces, places],
    );

    return {
      center,
      places,
      hasPlaces,
      handleLoad,
    };
  }

  public useMasterDataSource<T extends Model, TDataTable extends Model>(
    list: T[],
    transformMethod: (item: T) => TDataTable[],
  ): [TDataTable[]] {
    const [dataSource, setDataSource] = React.useState<TDataTable[]>([]);

    React.useEffect(() => {
      let tableData = [];
      tableData =
        list && list.length
          ? list.map((itemList: T) => transformMethod(itemList))
          : [];
      let index = 0;
      /* [[], [], []] => [] */
      const dataList =
        tableData.length > 0
          ? tableData.flat(1).map(data => {
              if (!data.title) {
                if (data.rowSpan !== 0) {
                  index = index + 1;
                }
              }
              return { ...data, indexInTable: index };
            })
          : [];
      setDataSource([...dataList]);
    }, [list, setDataSource, transformMethod]);
    /* return dataSource */
    return [dataSource];
  }

  public useReportMaster<T extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    getList: (filter: TFilter) => Promise<T[]>,
  ): [
    T[],
    Dispatch<SetStateAction<T[]>>,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [list, setList] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [isReset, setIsReset] = React.useState<boolean>(true);

    const ref = useRef<number>(0);

    React.useEffect(() => {
      let scrollFilter = {
        ...filter,
        take: INFINITE_SCROLL_TAKE,
      };
      if (ref.current === 0) {
        scrollFilter = { ...scrollFilter, skip: 0 };
        ref.current = ref.current + 1; // decide next load is not the first load
      } // if the first load has skip > 0, set it to 0 and return

      if (loadList) {
        setLoadList(false);
        setLoading(true);
        Promise.all([getList(scrollFilter)])
          .then(([newList]) => {
            newList = newList.map(item => ({ ...item, key: uuidv4() }));
            setList([...newList]);
          })
          .catch((error: AxiosError<any>) => {
            if (error && error.response && error.response.data) {
              notification.error({
                message: error?.response?.data?.message,
              });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [filter, getList, list, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    // const handleDefaultSearch = React.useCallback(() => {
    //   const { skip, take } = ModelFilter.clone<TFilter>(new StoreInfomationDataTable());
    //   setFilter(
    //     ModelFilter.clone<TFilter>({
    //       ...filter,
    //       skip,
    //       take,
    //     }),
    //   );
    //   setLoadList(true);
    // }, [filter, modelFilterClass, setFilter]);

    // const handleFilter = React.useCallback(
    //   <TF extends Filter>(field: string) => {
    //     return (f: TF) => {
    //       const { skip, take } = ModelFilter.clone<TFilter>(
    //         new modelFilterClass(),
    //       );
    //       setFilter(
    //         ModelFilter.clone<TFilter>({
    //           ...filter,
    //           [field]: f,
    //           skip,
    //           take,
    //         }),
    //       );
    //       setLoadList(true);
    //     };
    //   },
    //   [filter, modelFilterClass, setFilter],
    // );

    // const handleReset = React.useCallback(() => {
    //   setFilter(
    //     ModelFilter.clone<TFilter>({
    //       ...new modelFilterClass(),
    //       take: INFINITE_SCROLL_TAKE,
    //     }),
    //   );
    //   setLoadList(true);
    //   setIsReset(true);
    // }, [modelFilterClass, setFilter]);

    return [
      list,
      setList,
      setLoadList,
      setLoading,
      loading,
      handleSearch,
      isReset,
      setIsReset,
    ];
  }
}

export const dashboardStoreInfoService: DashboardStoreInfoService = new DashboardStoreInfoService();
