import { PaginationConfig, PaginationProps } from 'antd/lib/pagination';
import { SorterResult } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { tableService } from 'core/services';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { ProductFilter } from 'models/ProductFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';

import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { translate } from 'core/helpers/internationalization';
import { notification } from 'helpers';
import { ShowingWarehouse } from 'models/posm/ShowingWarehouse';
import { ShowingInventoryHistoryFilter } from 'models/posm/ShowingInventoryHistoryFilter';
import { ShowingInventoryHistory } from 'models/posm/ShowingInventoryHistory';
import { ShowingInventory } from 'models/posm/ShowingInventory';
export class ShowingWarehouseService {
  public useShowingInventoryHistoryMaster(
    getList: (
      filter: ShowingInventoryHistoryFilter,
    ) => Promise<ShowingInventoryHistory[]>,
    count: (filter: ShowingInventoryHistoryFilter) => Promise<number>,
    currentItem: ShowingInventory,
  ): [
      ShowingInventoryHistoryFilter,
      Dispatch<SetStateAction<ShowingInventoryHistoryFilter>>,
      ShowingInventoryHistory[],
      Dispatch<SetStateAction<ShowingInventoryHistory[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      () => void,
      number,
      () => void,
    ] {
    const [filter, setFilter] = React.useState<ShowingInventoryHistoryFilter>(
      new ShowingInventoryHistoryFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<ShowingInventoryHistory[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    // setList and count
    React.useEffect(() => {
      if (loadList && currentItem) {
        filter.showingInventoryId.equal = currentItem.id;
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

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take } = ShowingInventoryHistoryFilter.clone<
        ShowingInventoryHistoryFilter
      >(new ShowingInventoryHistoryFilter());
      setFilter(
        ModelFilter.clone<ShowingInventoryHistoryFilter>({
          ...filter,
          skip,
          take,
        }),
      );
      setLoadList(true);
    }, [filter]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
      handleDefaultSearch,
    ];
  }

  public useShowingInventoryLocalTable(
    model: ShowingWarehouse,
    setModel: Dispatch<SetStateAction<ShowingWarehouse>>,
    field: string,
    productFilter: ProductFilter,
    setProductFilter: Dispatch<SetStateAction<ProductFilter>>,
    itemFilter: ItemFilter,
    handleFilterUOM: boolean,
    unitOfMeasureFilter?: UnitOfMeasureFilter,
  ): [
      ShowingInventory[],
      (v: ShowingInventory[]) => void,
      ShowingInventory[],
      PaginationProps,
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<ShowingInventory>,
      ) => void,
    ] {
    // add key to each inventory
    const inventories: ShowingInventory[] = React.useMemo(() => {
      if (model.showingInventories) {
        model.showingInventories?.forEach((t: ShowingInventory, index: number) => {
          if (!t?.key) {
            t.key = uuidv4();
          }
          t.tableIndex = index;
        });
        return model.showingInventories;
      }
      return [];
    }, [model]);

    const setInventories = React.useCallback(
      (v: ShowingInventory[]) => {
        setModel({
          ...model,
          [field]: v,
        });
      },
      [field, model, setModel],
    );

    const dataSource: ShowingInventory[] = React.useMemo(() => {
      if (handleFilterUOM) {
        // product list
        const uomList = inventories
          .map((i: ShowingInventory) => i.item)
          .map((i: Item) => i?.product?.unitOfMeasure);
        // filter product list
        const filteredProductIds = tableService
          .defaultFilterHandler(uomList, unitOfMeasureFilter)
          .map((i: UnitOfMeasure) => i?.id);
        // dataSource
        const dataSource = inventories
          .map((i: ShowingInventory) => ({ inventory: i, item: i?.item }))
          .map(({ inventory, item }) => ({
            inventory,
            unitOfMeasureId: item?.product?.unitOfMeasureId,
          }))
          .filter(({ unitOfMeasureId }) =>
            filteredProductIds.includes(unitOfMeasureId),
          )
          .map(({ inventory }) => ({ ...inventory }));
        // debugger
        return dataSource;
      } else {
        // item list
        const itemList = inventories.map((i: ShowingInventory) => i.item);
        // filter item list
        const filteredItemIds = tableService
          .defaultFilterHandler(itemList, itemFilter)
          .map((i: Item) => i?.id);
        // dataSource
        const dataSource = inventories
          .map((i: ShowingInventory) => ({ inventory: i, item: i?.item }))
          .map(({ inventory, item }) => ({
            inventory,
            itemId: item?.id,
          }))
          .filter(({ itemId }) => filteredItemIds.includes(itemId))
          .map(({ inventory }) => ({ ...inventory }));
        return dataSource;
      }
    }, [handleFilterUOM, inventories, itemFilter, unitOfMeasureFilter]);

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

  public useShowingWarehouseMasterNavigation(
    baseRoute: string,
  ): [() => void, (id: number) => () => void, (id: number) => () => void] {
    const history = useHistory();

    const handleGoCreate = React.useCallback(() => {
      history.push(
        path.join(baseRoute, nameof(generalLanguageKeys.actions.create)),
      );
    }, [baseRoute, history]);

    const handleGoDetail = React.useCallback(
      (warehouseId: number) => {
        return () => {
          history.push(path.join(baseRoute, `${warehouseId}`));
        };
      },
      [baseRoute, history],
    );

    const handleGoShowingInventory = React.useCallback(
      (warehouseId: number) => {
        return () => {
          history.push(path.join(baseRoute, `inventories/${warehouseId}`));
        };
      },
      [baseRoute, history],
    );

    return [handleGoCreate, handleGoDetail, handleGoShowingInventory];
  }

  public useImport<TFilter extends ModelFilter, T extends Model>(
    onImport: (file: File, filter: TFilter) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    filter?: TFilter,
  ): [
      (event: React.ChangeEvent<HTMLInputElement>) => void,
      T[],
      Dispatch<SetStateAction<T[]>>,
      boolean,
      Dispatch<SetStateAction<boolean>>,
      string,
    ] {
    const [inventories, setInventories] = React.useState<any>([]);
    const [errVisible, setErrVisible] = React.useState<boolean>(false);
    const [errorModel, setErrorModel] = React.useState<string>();

    return [
      React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.files.length > 0) {
            const file: File = event.target.files[0];
            setLoading(true);
            onImport(file, filter)
              .then(event => {
                setInventories(event);
                notification.success({
                  message: translate(generalLanguageKeys.update.success),
                });
                notification.success({
                  message: translate(generalLanguageKeys.update.requireRefresh),
                });
              })
              .catch((error: AxiosError<any>) => {
                setErrorModel(error.response.data);
                setErrVisible(true);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        },
        [filter, onImport, setLoading, setInventories],
      ),
      inventories,
      setInventories,
      errVisible,
      setErrVisible,
      errorModel,
    ];
  }
}

export const showingWarehouseService: ShowingWarehouseService = new ShowingWarehouseService();
