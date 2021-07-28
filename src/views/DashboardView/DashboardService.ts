import { TopSaleEmployeeFilter } from './../../models/TopSaleEmployeeFilter';
import { IndirectSalesOrder } from './../../models/IndirectSalesOrder';
import { StoreChecking } from 'models/monitor/StoreChecking';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TopSaleEmployee } from 'models/TopSaleEmployee';

export class DashboardService {
  public useStoreChecking(
    getStoreChecking: () => Promise<StoreChecking>,
  ): [number, string[], string] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [sum, setSum] = React.useState<number>(null);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(
      (storeChecking: StoreChecking) => {
        if (
          storeChecking &&
          storeChecking?.storeCheckingHours &&
          storeChecking?.storeCheckingHours?.length > 0
        ) {
          setConfigData(false);
          if (configData === false && lables?.length === 0) {
            storeChecking?.storeCheckingHours.map(storeCheckingHour => {
              lables.push(storeCheckingHour?.hour + 'h');
              data.push(storeCheckingHour?.counter);
            });
          }
        }
        setConfigData(true);
        setLables([...lables]);
        setData([...data]);
      },
      [configData, data, lables],
    );
    React.useEffect(() => {
      if (loading) {
        getStoreChecking()
          .then(res => {
            setLoading(false);
            handleConfigData(res);
            setSum(res?.sum);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [getStoreChecking, handleConfigData, loading, translate]);

    return [sum, lables, JSON.stringify(data)];
  }

  public useImageStoreChecking(
    getImageStoreChecking: () => Promise<StoreChecking>,
  ): [number, string[], string] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [sum, setSum] = React.useState<number>(null);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(
      (storeChecking: StoreChecking) => {
        if (
          storeChecking &&
          storeChecking?.storeCheckingImageMappingHours &&
          storeChecking?.storeCheckingImageMappingHours?.length > 0
        ) {
          setConfigData(false);
          if (configData === false && lables?.length === 0) {
            storeChecking?.storeCheckingImageMappingHours.map(
              storeCheckingImageMappingHour => {
                lables.push(storeCheckingImageMappingHour?.hour + 'h');
                data.push(storeCheckingImageMappingHour?.counter);
              },
            );
          }
        }
        setConfigData(true);
        setLables([...lables]);
        setData([...data]);
      },
      [configData, data, lables],
    );
    React.useEffect(() => {
      if (loading) {
        getImageStoreChecking()
          .then(res => {
            setLoading(false);
            handleConfigData(res);
            setSum(res?.sum);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [getImageStoreChecking, handleConfigData, loading, translate]);

    return [sum, lables, JSON.stringify(data)];
  }

  public useSaleEmpoyeeOnline(
    getSaleEmpoyeeOnline: () => Promise<StoreChecking>,
  ): [number, string[], string] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [sum, setSum] = React.useState<number>(null);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(
      (storeChecking: StoreChecking) => {
        if (
          storeChecking &&
          storeChecking?.saleEmployeeOnlineHours &&
          storeChecking?.saleEmployeeOnlineHours?.length > 0
        ) {
          setConfigData(false);
          if (configData === false && lables?.length === 0) {
            storeChecking?.saleEmployeeOnlineHours.map(
              saleEmployeeOnlineHour => {
                lables.push(saleEmployeeOnlineHour?.hour + 'h');
                data.push(saleEmployeeOnlineHour?.counter);
              },
            );
          }
        }
        setConfigData(true);
        setLables([...lables]);
        setData([...data]);
      },
      [configData, data, lables],
    );
    React.useEffect(() => {
      if (loading) {
        getSaleEmpoyeeOnline()
          .then(res => {
            setLoading(false);
            handleConfigData(res);
            setSum(res?.sum);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [getSaleEmpoyeeOnline, handleConfigData, loading, translate]);

    return [sum, lables, JSON.stringify(data)];
  }
  public useIndirectSalesOrder(
    getIndirectSalesOrder: () => Promise<IndirectSalesOrder>,
  ): [number, string[], string] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [sum, setSum] = React.useState<number>(null);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(true);

    const handleConfigData = React.useCallback(
      (indirectSalesOrder: IndirectSalesOrder) => {
        if (
          indirectSalesOrder &&
          indirectSalesOrder?.statisticIndirectSalesOrderHours &&
          indirectSalesOrder?.statisticIndirectSalesOrderHours?.length > 0
        ) {
          setConfigData(false);
          if (configData === false && lables?.length === 0) {
            indirectSalesOrder?.statisticIndirectSalesOrderHours.map(
              indirectSalesOrderHour => {
                lables.push(indirectSalesOrderHour?.hour + 'h');
                data.push(indirectSalesOrderHour?.counter);
              },
            );
          }
        }
        setConfigData(true);
        setLables([...lables]);
        setData([...data]);
      },
      [configData, data, lables],
    );
    React.useEffect(() => {
      if (loading) {
        getIndirectSalesOrder()
          .then(res => {
            setLoading(false);
            handleConfigData(res);
            setSum(res?.sum);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [getIndirectSalesOrder, handleConfigData, loading, translate]);

    return [sum, lables, JSON.stringify(data)];
  }

  public useTopEmployee(
    filter?: TopSaleEmployeeFilter,
    getTopEmployee?: (
      filter: TopSaleEmployeeFilter,
    ) => Promise<TopSaleEmployee>,
  ): [
      string[],
      string,
      Dispatch<SetStateAction<boolean>>,
    ] {
    const [configData, setConfigData] = React.useState<boolean>(false);
    const [lables, setLables] = React.useState<string[]>([]);
    const [data, setData] = React.useState<number[]>([]);
    const [translate] = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleConfigData = React.useCallback(
      topSaleEmployee => {

        const labelTmp = [];
        const dataTmp = [];
        if (topSaleEmployee && topSaleEmployee?.length > 0) {
          setConfigData(false);

          if (configData === false) {
            topSaleEmployee.forEach(item => {
              labelTmp.push(item?.displayName);
              dataTmp.push(item?.counter);
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
        if (typeof filter.time.equal === 'undefined') {
            filter.time.equal = '0';
        }
          getTopEmployee(filter).then(res => {
              handleConfigData(res);
            })
            .finally(() => {
              setLoading(false);
            });
        }
    }, [filter, getTopEmployee, handleConfigData, loading, translate]);
    return [lables, JSON.stringify(data), setLoading];
  }
}

export const dashboardService: DashboardService = new DashboardService();
