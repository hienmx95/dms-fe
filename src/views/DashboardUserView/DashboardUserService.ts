import { TopSaleEmployeeFilter } from './../../models/TopSaleEmployeeFilter';
import React, { Dispatch, SetStateAction } from 'react';

export class DashboardUserService {
  public useDataSum(
    filter?: TopSaleEmployeeFilter,
    getSalesQuantity?: (filter: TopSaleEmployeeFilter) => Promise<number>,
    getStoreChecking?: (filter: TopSaleEmployeeFilter) => Promise<number>,
    getRevenue?: (filter: TopSaleEmployeeFilter) => Promise<number>,
    getStatisticIndirectSalesOrder?: (
      filter: TopSaleEmployeeFilter,
    ) => Promise<number>,
  ): [number, number, number, number, Dispatch<SetStateAction<boolean>>] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [salesQuantity, setSalesQuantity] = React.useState<number>(0);
    const [storeChecking, setStoreChecking] = React.useState<number>(0);
    const [revenue, setRevenue] = React.useState<number>(0);
    const [
      statisticIndirectSalesOrder,
      setStatisticIndirectSalesOrder,
    ] = React.useState<number>(0);
    React.useEffect(() => {
      if (loading) {
        if (typeof filter.time.equal === 'undefined') {
          filter.time.equal = '0';
        }
        getSalesQuantity(filter)
          .then(res => {
            setSalesQuantity(res);
          })
          .finally(() => {
            setLoading(false);
          });
        getStoreChecking(filter)
          .then(res => {
            setStoreChecking(res);
          })
          .finally(() => {
            setLoading(false);
          });
        getRevenue(filter)
          .then(res => {
            setRevenue(res);
          })
          .finally(() => {
            setLoading(false);
          });
        getStatisticIndirectSalesOrder(filter)
          .then(res => {
            setStatisticIndirectSalesOrder(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [
      loading,
      getSalesQuantity,
      getStoreChecking,
      getRevenue,
      getStatisticIndirectSalesOrder,
      filter,
    ]);

    return [
      salesQuantity,
      storeChecking,
      revenue,
      statisticIndirectSalesOrder,
      setLoading,
    ];
  }
}

export const dashboardUserService: DashboardUserService = new DashboardUserService();
