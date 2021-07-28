import { Place } from 'components/GoogleMap/CustomGoogleMap';
import { Model } from 'core/models/Model';
import { DashboardDirectorFilter } from 'models/DashboardDirectorFilter';
import { TopSaleEmployeeFilter } from 'models/TopSaleEmployeeFilter';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

export class DashboardManagerService {
  public useStatistical<T extends Model>(
    getStatisticToday: (filter?: DashboardDirectorFilter) => Promise<T>,
    getStatisticYestoday: (filter?: DashboardDirectorFilter) => Promise<T>,
    filter?: DashboardDirectorFilter,
  ): [T, T, Dispatch<SetStateAction<boolean>>] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [statisticToday, setStatisticToday] = React.useState<T>();
    const [statisticYestoday, setStatisticYestoday] = React.useState<T>();
    React.useEffect(() => {
      if (loading) {
        getStatisticToday(filter)
          .then(res => {
            setStatisticToday(res);
          })
          .finally(() => {
            setLoading(false);
          });
        getStatisticYestoday(filter)
          .then(res => {
            setStatisticYestoday(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [getStatisticToday, getStatisticYestoday, loading, filter]);

    return [statisticToday, statisticYestoday, setLoading];
  }

  public useTopRevenueByProduct<T extends Model>(
    filter?: DashboardDirectorFilter,
    getTopRevenueByProduct?: (filter: DashboardDirectorFilter) => Promise<T>,
  ): [string[], string, Dispatch<SetStateAction<boolean>>] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);
    const handleConfigData = React.useCallback(
      topRevenueByProduct => {
        const labelTmp = [];
        const dataTmp = [];
        if (topRevenueByProduct && topRevenueByProduct?.length > 0) {
          setConfigData(false);
          setLoading(false);
          if (configData === false) {
            topRevenueByProduct.forEach(item => {
              labelTmp.push(item?.productName);
              dataTmp.push(item?.revenue);
            });
            setConfigData(true);
            setLables(labelTmp);
            setData(dataTmp);
          }
        } else {
          setConfigData(false);
          if (configData === false) {
            setConfigData(true);
            setLables([]);
            setData([]);
          }
        }
      },
      [configData],
    );
    React.useEffect(() => {
      if (loading) {
        getTopRevenueByProduct(filter)
          .then(res => {
            handleConfigData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [filter, getTopRevenueByProduct, handleConfigData, loading, translate]);

    return [lables, JSON.stringify(data), setLoading];
  }

  public useTop5RevenueByEmployee<T extends Model>(
    filter?: DashboardDirectorFilter,
    getTopRevenueByEmployee?: (filter: DashboardDirectorFilter) => Promise<T>,
  ): [string[], string, Dispatch<SetStateAction<boolean>>] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);
    const handleConfigData = React.useCallback(
      topRevenueByEmployee => {
        const labelTmp = [];
        const dataTmp = [];
        if (topRevenueByEmployee && topRevenueByEmployee?.length > 0) {
          setConfigData(false);
          if (configData === false) {
            topRevenueByEmployee.forEach(item => {
              labelTmp.push(item?.employeeName);
              dataTmp.push(item?.revenue);
            });
            setConfigData(true);
            setLables(labelTmp);
            setData(dataTmp);
          }
        } else {
          setConfigData(false);
          if (configData === false) {
            setConfigData(true);
            setLables([]);
            setData([]);
          }
        }
      },
      [configData],
    );
    React.useEffect(() => {
      if (loading) {
        getTopRevenueByEmployee(filter)
          .then(res => {
            handleConfigData(res);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [filter, getTopRevenueByEmployee, handleConfigData, loading, translate]);

    return [lables, JSON.stringify(data), setLoading];
  }

  public useRevenueFluctuation<T extends Model>(
    filter?: DashboardDirectorFilter,
    getRevenueFluctuation?: (filter: DashboardDirectorFilter) => Promise<T>,
  ): [string[], string, Dispatch<SetStateAction<boolean>>] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);
    const handleConfigData = React.useCallback(
      revenueFluctuation => {
        const labelTmp = [];
        const dataTmp = [];
        if (revenueFluctuation) {
          setConfigData(false);
          if (configData === false) {
            if (revenueFluctuation?.revenueFluctuationByMonths) {
              revenueFluctuation?.revenueFluctuationByMonths.forEach(item => {
                labelTmp.push(item?.day);
                dataTmp.push(item?.revenue);
              });
            }
            if (revenueFluctuation?.revenueFluctuationByQuaters) {
              revenueFluctuation?.revenueFluctuationByQuaters.forEach(item => {
                labelTmp.push(item?.month);
                dataTmp.push(item?.revenue);
              });
            }
            if (revenueFluctuation?.revenueFluctuationByYears) {
              revenueFluctuation?.revenueFluctuationByYears.forEach(item => {
                labelTmp.push(item?.month);
                dataTmp.push(item?.revenue);
              });
            }

            setConfigData(true);
            setLables(labelTmp);
            setData(dataTmp);
          }
        } else {
          setConfigData(false);
          if (configData === false) {
            setConfigData(true);
            setLables([]);
            setData([]);
          }
        }
      },
      [configData],
    );
    React.useEffect(() => {
      if (loading) {
        getRevenueFluctuation(filter)
          .then(res => {
            handleConfigData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [filter, getRevenueFluctuation, handleConfigData, loading, translate]);

    return [lables, JSON.stringify(data), setLoading];
  }

  public useSaledItemFluctuation<T extends Model>(
    filter?: TopSaleEmployeeFilter,
    getSaledItemFluctuation?: (filter: TopSaleEmployeeFilter) => Promise<T>,
  ): [string[], string, Dispatch<SetStateAction<boolean>>] {
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(saledItemFluctuation => {
      const labelTmp = [];
      const dataTmp = [];
      if (saledItemFluctuation) {
        if (saledItemFluctuation?.saledItemFluctuationByMonths) {
          saledItemFluctuation?.saledItemFluctuationByMonths.forEach(item => {
            labelTmp.push(item?.day);
            dataTmp.push(item?.saledItemCounter);
          });
        }
        if (saledItemFluctuation?.saledItemFluctuationByQuaters) {
          saledItemFluctuation?.saledItemFluctuationByQuaters.forEach(item => {
            labelTmp.push(item?.month);
            dataTmp.push(item?.saledItemCounter);
          });
        }
        if (saledItemFluctuation?.saledItemFluctuationByYears) {
          saledItemFluctuation?.saledItemFluctuationByYears.forEach(item => {
            labelTmp.push(item?.month);
            dataTmp.push(item?.saledItemCounter);
          });
        }

        setLables(labelTmp);
        setData(dataTmp);
      } else {
        setLables([]);
        setData([]);
      }
    }, []);
    React.useEffect(() => {
      if (loading) {
        if (typeof filter.time.equal === 'undefined') {
          filter.time.equal = '2';
        }
        getSaledItemFluctuation(filter)
          .then(res => {
            setLoading(false);
            handleConfigData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [filter, getSaledItemFluctuation, handleConfigData, loading, translate]);

    return [lables, JSON.stringify(data), setLoading];
  }

  public useIndirectSalesOrderFluctuation<T extends Model>(
    filter?: DashboardDirectorFilter,
    getIndirectSalesOrderFluctuation?: (
      filter: DashboardDirectorFilter,
    ) => Promise<T>,
  ): [string[], string, Dispatch<SetStateAction<boolean>>] {
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(saledItemFluctuation => {
      const labelTmp = [];
      const dataTmp = [];
      if (saledItemFluctuation) {
        if (saledItemFluctuation?.indirectSalesOrderFluctuationByMonths) {
          saledItemFluctuation?.indirectSalesOrderFluctuationByMonths.forEach(
            item => {
              labelTmp.push(item?.day);
              dataTmp.push(item?.indirectSalesOrderCounter);
            },
          );
        }
        if (saledItemFluctuation?.indirectSalesOrderFluctuationByQuaters) {
          saledItemFluctuation?.indirectSalesOrderFluctuationByQuaters.forEach(
            item => {
              labelTmp.push(item?.month);
              dataTmp.push(item?.indirectSalesOrderCounter);
            },
          );
        }
        if (saledItemFluctuation?.indirectSalesOrderFluctuationByYears) {
          saledItemFluctuation?.indirectSalesOrderFluctuationByYears.forEach(
            item => {
              labelTmp.push(item?.month);
              dataTmp.push(item?.indirectSalesOrderCounter);
            },
          );
        }

        setLables(labelTmp);
        setData(dataTmp);
      } else {
        setLables([]);
        setData([]);
      }
    }, []);
    React.useEffect(() => {
      if (loading) {
        getIndirectSalesOrderFluctuation(filter)
          .then(res => {
            setLoading(false);
            handleConfigData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [
      filter,
      getIndirectSalesOrderFluctuation,
      handleConfigData,
      loading,
      translate,
    ]);

    return [lables, JSON.stringify(data), setLoading];
  }

  public useDataTotal(
    getIndirectSalesOrderCounter: (
      filter?: DashboardDirectorFilter,
    ) => Promise<number>,
    getRevenueTotal: (filter?: DashboardDirectorFilter) => Promise<number>,
    getStoreHasCheckedCounter: (
      filter?: DashboardDirectorFilter,
    ) => Promise<number>,
    getStoreCheckingCounter: (
      filter?: DashboardDirectorFilter,
    ) => Promise<number>,
    getCountStore: (filter?: DashboardDirectorFilter) => Promise<number>,

    filter?: DashboardDirectorFilter,
    filterHaveTime?: DashboardDirectorFilter,
  ): [
    number,
    number,
    number,
    number,
    number,
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [loadData, setLoadData] = React.useState<boolean>(true);
    const [
      indirectSalesOrderCounter,
      setIndirectSalesOrderCounter,
    ] = React.useState<number>(0);
    const [revenueTotal, setRevenueTotal] = React.useState<number>(0);
    const [storeHasCheckedCounter, setStoreHasCheckedCounter] = React.useState<
      number
    >(0);
    const [storeCheckingCounter, setStoreCheckingCounter] = React.useState<
      number
    >(0);
    const [countStore, setCountStore] = React.useState<number>(0);

    React.useEffect(() => {
      if (loadData) {
        const isCancelled = false;
        if (typeof filterHaveTime.time.equal === 'undefined') {
          filterHaveTime.time.equal = 1;
        }
        try {
          const fetch = async () => {
            const indirectSalesOrderCounter = await getIndirectSalesOrderCounter(
              filterHaveTime,
            );
            const revenueTotal = await getRevenueTotal(filterHaveTime);
            const storeHasCheckedCounter = await getStoreHasCheckedCounter(
              filterHaveTime,
            );
            const storeCheckingCounter = await getStoreCheckingCounter(
              filterHaveTime,
            );
            const countStore = await getCountStore(filter);

            if (!isCancelled) {
              await setIndirectSalesOrderCounter(indirectSalesOrderCounter);
              await setRevenueTotal(revenueTotal);
              await setStoreHasCheckedCounter(storeHasCheckedCounter);
              await setStoreCheckingCounter(storeCheckingCounter);
              await setCountStore(countStore);
            }
            await setLoadData(false);
          };
          fetch();
        } catch (ex) {
          // tslint:disable-next-line:no-console
          console.log(`ex:`, ex);
        }
      }
    }, [
      loadData,
      getIndirectSalesOrderCounter,
      getCountStore,
      getStoreHasCheckedCounter,
      getRevenueTotal,
      getStoreCheckingCounter,
      filter,
      filterHaveTime,
    ]);

    return [
      indirectSalesOrderCounter,
      revenueTotal,
      storeHasCheckedCounter,
      storeCheckingCounter,
      countStore,
      setLoadData,
    ];
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
}

export const dashboardManagerService: DashboardManagerService = new DashboardManagerService();
