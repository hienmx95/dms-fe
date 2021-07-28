import { PaginationProps, PaginationConfig } from 'antd/lib/pagination';
import { Inventory } from 'models/Inventory';

import { Item } from 'models/Item';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { Warehouse } from 'models/Warehouse';
import React, { Dispatch, SetStateAction } from 'react';
import { tableService } from 'core/services';
import { v4 as uuidv4 } from 'uuid';
import { SorterResult } from 'antd/lib/table';
import { ProductGrouping } from 'models/ProductGrouping';

export class ProductGroupingService {
  public useProductContentMaster(
    getList: (filter: ProductFilter) => Promise<Product[]>,
    count: (filter: ProductFilter) => Promise<number>,
    currentItem: ProductGrouping,
  ): [
    ProductFilter,
    Dispatch<SetStateAction<ProductFilter>>,
    Product[],
    Dispatch<SetStateAction<Product[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<ProductFilter>(
      new ProductFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    // React.useEffect(() => {
    //   if (currentItem) {
    //     const newFilter = new ProductFilter();
    //     newFilter.productGroupingId.equal = currentItem.id;
    //     setFilter(newFilter);
    //   }
    // }, [currentItem]);
    // setList and count
    React.useEffect(() => {
      if (loadList && currentItem) {
        // const newFilter = new ProductFilter();
        // newFilter.productGroupingId.equal = currentItem.id;
        setLoading(true);
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
    }, [count, currentItem, filter, getList, loadList]);

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

  public useInventoryLocalTable(
    model: Warehouse,
    setModel: Dispatch<SetStateAction<Warehouse>>,
    field: string,
    productFilter: ProductFilter,
    setProductFilter: Dispatch<SetStateAction<ProductFilter>>,
  ): [
    Inventory[],
    (v: Inventory[]) => void,
    Inventory[],
    PaginationProps,
    (
      newPagination: PaginationConfig,
      filters: Record<string, any>,
      newSorter: SorterResult<Inventory>,
    ) => void,
  ] {
    // add key to each inventory
    const inventories: Inventory[] = React.useMemo(() => {
      if (model.inventories) {
        model.inventories?.forEach((t: Inventory) => {
          if (!t?.key) {
            t.key = uuidv4();
          }
        });
        return model.inventories;
      }
      return [];
    }, [model]);

    const setInventories = React.useCallback(
      (v: Inventory[]) => {
        setModel({
          ...model,
          [field]: v,
        });
      },
      [field, model, setModel],
    );

    const dataSource: Inventory[] = React.useMemo(() => {
      // product list
      const productList = inventories
        .map((i: Inventory) => i.item)
        .map((i: Item) => i.product);
      // filter product list
      const filteredProductIds = tableService
        .defaultFilterHandler(productList, productFilter)
        .map((i: Product) => i.id);

      // dataSource
      const dataSource = inventories
        .map((i: Inventory) => ({ inventory: i, item: i.item }))
        .map(({ inventory, item }) => ({
          inventory,
          productId: item.product.id,
        }))
        .filter(({ productId }) => filteredProductIds.includes(productId))
        .map(({ inventory }) => ({ ...inventory }));

      return dataSource;
    }, [inventories, productFilter]);

    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = productFilter;

      const { length } = dataSource ?? [];
      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, productFilter]);

    const handleTableChange = React.useCallback(
      (...[newPagination]) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== productFilter.skip || take !== productFilter.take) {
          setProductFilter({
            ...productFilter,
            skip,
            take,
          });
          return;
        }
      },
      [productFilter, setProductFilter],
    );

    return [
      inventories,
      setInventories,
      dataSource,
      pagination,
      handleTableChange,
    ];
  }
}

export const productGroupingService: ProductGroupingService = new ProductGroupingService();
