import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { KpiProductGrouping } from 'models/kpi/KpiProductGrouping';
import { KpiProductGroupingContent } from 'models/kpi/KpiProductGroupingContent';
import { Organization } from 'models/Organization';
import React, { Dispatch, SetStateAction } from 'react';

export class KpiItemService {
  public useEmployeeContentMaster(
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
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [filter, setFilter] = React.useState<AppUserFilter>(
      new AppUserFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<AppUser[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    React.useEffect(() => {
      if (loadList && currentItem) {
        filter.organizationId.equal = currentItem.id;
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

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
      setLoadList,
    ];
  }

  public useItemContentMaster(
    getList: (filter: ItemFilter) => Promise<Item[]>,
    count: (filter: ItemFilter) => Promise<number>,
  ): [
    ItemFilter,
    Dispatch<SetStateAction<ItemFilter>>,
    Item[],
    Dispatch<SetStateAction<Item[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<ItemFilter>(new ItemFilter());
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Item[]>([]);
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

  // public useTranformData(
  //   content: KpiItemContent,
  // ): [
  //     (kpiItemContentKpiCriteriaItemMappings: KpiItemContentKpiCriteriaItemMapping) => void
  //   ] {
  //   const tranformKpiCriteria = React.useCallback(
  //     (kpiItemContentKpiCriteriaItemMappings: KpiItemContentKpiCriteriaItemMapping[]) => {
  //       Object.keys(kpiItemContentKpiCriteriaItemMappings).forEach(mappingKey => {
  //         switch (mappingKey.toString()) {
  //           case '1': {
  //             content.indirectOutput = kpiItemContentKpiCriteriaItemMappings['1'];
  //             return;
  //           }
  //           case '2': {
  //             content.indirectSales = kpiItemContentKpiCriteriaItemMappings['2'];
  //             return;
  //           }
  //           case '3': {
  //             content.indirectOrders = kpiItemContentKpiCriteriaItemMappings['3'];
  //             return;
  //           }
  //           case '4': {
  //             content.indirectStores = kpiItemContentKpiCriteriaItemMappings['4'];
  //             return;
  //           }
  //         }
  //       },
  //       );
  //     }, [
  //     content.indirectOrders,
  //     content.indirectOutput,
  //     content.indirectSales,
  //     content.indirectStores,
  //   ]);

  //   return [tranformKpiCriteria];
  // }

  public useKpiContentTable(
    changeContent?: boolean,
    setChangeContent?: Dispatch<SetStateAction<boolean>>,
    kpiItemContents?: KpiProductGroupingContent[],
    setKpiItemContents?: (v: KpiProductGroupingContent[]) => void,
  ) {
    React.useEffect(() => {
      if (changeContent) {
        if (kpiItemContents?.length > 0) {
          const editableContent = kpiItemContents.map(
            (content: KpiProductGroupingContent) => {
              if (
                typeof content?.kpiProductGroupingContentCriteriaMappings ===
                'object'
              ) {
                const item = content?.kpiProductGroupingContentCriteriaMappings;
                Object.keys(item).forEach(mappingKey => {
                  switch (mappingKey.toString()) {
                    case '1': {
                      content.indirectQuantity = item['1'];
                      return;
                    }
                    case '2': {
                      content.indirectRevenue = item['2'];
                      return;
                    }
                    case '3': {
                      content.indirectAmount = item['3'];
                      return;
                    }
                    case '4': {
                      content.indirectStore = item['4'];
                      return;
                    }
                    case '5': {
                      content.directQuantity = item['5'];
                      return;
                    }
                    case '6': {
                      content.directRevenue = item['6'];
                      return;
                    }
                    case '7': {
                      content.directAmount = item['7'];
                      return;
                    }
                    case '8': {
                      content.directStore = item['8'];
                      return;
                    }
                  }
                });
              }
              return content;
            },
          );
          setKpiItemContents([...editableContent]);
          setChangeContent(false);
        }
      }
    }, [changeContent, kpiItemContents, setChangeContent, setKpiItemContents]);

    return [kpiItemContents];
  }

  public useAppUserModal(
    currentKpiItem: KpiProductGrouping,
    setCurrentKpiItem: Dispatch<SetStateAction<KpiProductGrouping>>,
    selectedList: AppUser[],
    setSelectedList: Dispatch<SetStateAction<AppUser[]>>,
    setVisible: Dispatch<SetStateAction<boolean>>,
  ) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<AppUserFilter>(
      new AppUserFilter(),
    );
    const [loadList, setLoadList] = React.useState<boolean>(false);
    /* handle Open appUser modal */

    const handleOpenModal = React.useCallback(() => {
      setFilter({
        ...filter,
        organizationId: { equal: currentKpiItem?.organizationId },
        kpiYearId: { equal: currentKpiItem?.kpiYearId },
        kpiPeriodId: { equal: currentKpiItem?.kpiPeriod?.id },
        kpiProductGroupingTypeId: {
          equal: currentKpiItem?.kpiProductGroupingType?.id,
        },
        skip: 0,
      });
      setLoadList(true);
      setIsOpen(true);
      setVisible(true);
    }, [filter, setVisible, currentKpiItem]);

    /* handle save appUser modal */
    const handleSaveModal = React.useCallback(
      (list: AppUser[]) => {
        const errors = currentKpiItem.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.employeeIds = null;
        }
        if (list && list.length > 0) {
          setSelectedList(list);

          // const ids = list.map(item => item.id);
          setCurrentKpiItem({
            ...currentKpiItem,
            employees: list,
            errors,
          });
        }
        setIsOpen(false);
      },
      [currentKpiItem, setCurrentKpiItem, setSelectedList],
    );

    /* handle close appUser modal */
    const handleCloseModal = React.useCallback(
      (list: AppUser[]) => {
        setIsOpen(false);
        setSelectedList(list);
      },
      [setSelectedList],
    );
    //
    const handleDeleteSelectedUser = React.useCallback(
      (index: number) => {
        return () => {
          if (selectedList && selectedList.length > 0) {
            selectedList.splice(index, 1);
            const ids = selectedList.map(item => item.id);
            setCurrentKpiItem({
              ...currentKpiItem,
              employeeIds: [...ids],
            });
          }
          setSelectedList([...selectedList]);
        };
      },
      [selectedList, setSelectedList, setCurrentKpiItem, currentKpiItem],
    );
    return {
      filter,
      setFilter,
      isOpen,
      handleSaveModal,
      handleCloseModal,
      handleOpenModal,
      handleDeleteSelectedUser,
      loadList,
      setLoadList,
    };
  }
}

export const kpiItemService: KpiItemService = new KpiItemService();
