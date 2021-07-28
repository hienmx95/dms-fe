import { KpiYear } from './../../models/kpi/KpiYear';
import { Organization } from './../../models/Organization';
import React, { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiGeneralContent } from 'models/kpi/KpiGeneralContent';
import { KpiGeneral } from 'models/kpi/KpiGeneral';

export class KpiGenralService {
  public useAppUserContentMaster(
    getList: (filter: AppUserFilter) => Promise<AppUser[]>,
    count: (filter: AppUserFilter) => Promise<number>,
    currentItem: Organization,
    currentKpiYear: KpiYear,
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
      if (loadList && currentItem && currentKpiYear) {
        const newFilter = new AppUserFilter();
        newFilter.organizationId.equal = currentItem.id;
        newFilter.kpiYearId.equal = currentKpiYear.id;
        setLoading(true);

        Promise.all([getList(newFilter), count(newFilter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, currentItem, currentKpiYear, filter, getList, loadList]);

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

  public useKpiContentTable(
    kpiGeneralContents?: KpiGeneralContent[],
    setKpiGeneralContents?: (v: KpiGeneralContent[]) => void,
  ) {
    React.useEffect(() => {
      if (
        kpiGeneralContents?.length > 0 &&
        typeof kpiGeneralContents[0]?.janStatus === 'undefined'
      ) {
        const editableContent = kpiGeneralContents.map(
          (content: KpiGeneralContent) => {
            if (
              typeof content?.kpiGeneralContentKpiPeriodMappings === 'object' &&
              typeof content?.kpiGeneralContentKpiPeriodMappingEnables ===
                'object'
            ) {
              const item = content?.kpiGeneralContentKpiPeriodMappings;
              const itemEnables =
                content?.kpiGeneralContentKpiPeriodMappingEnables;
              Object.keys(item).forEach(mappingKey => {
                switch (mappingKey.toString()) {
                  case '101': {
                    content.jan = item['101'];
                    return;
                  }
                  case '102': {
                    content.feb = item['102'];
                    return;
                  }
                  case '103': {
                    content.mar = item['103'];
                    return;
                  }
                  case '104': {
                    content.apr = item['104'];
                    return;
                  }
                  case '105': {
                    content.may = item['105'];
                    return;
                  }
                  case '106': {
                    content.jun = item['106'];
                    return;
                  }
                  case '107': {
                    content.jul = item['107'];
                    return;
                  }
                  case '108': {
                    content.aug = item['108'];
                    return;
                  }
                  case '109': {
                    content.sep = item['109'];
                    return;
                  }
                  case '110': {
                    content.oct = item['110'];
                    return;
                  }
                  case '111': {
                    content.nov = item['111'];
                    return;
                  }
                  case '112': {
                    content.dec = item['112'];
                    return;
                  }
                  case '201': {
                    content.q1 = item['201'];
                    return;
                  }
                  case '202': {
                    content.q2 = item['202'];
                    return;
                  }
                  case '203': {
                    content.q3 = item['203'];
                    return;
                  }
                  case '204': {
                    content.q4 = item['204'];
                    return;
                  }
                  case '401': {
                    content.year = item['401'];
                    return;
                  }
                }
              });
              Object.keys(itemEnables).forEach(mappingKey => {
                switch (mappingKey.toString()) {
                  case '101': {
                    content.janStatus = itemEnables['101'];
                    return;
                  }
                  case '102': {
                    content.febStatus = itemEnables['102'];
                    return;
                  }
                  case '103': {
                    content.marStatus = itemEnables['103'];
                    return;
                  }
                  case '104': {
                    content.aprStatus = itemEnables['104'];
                    return;
                  }
                  case '105': {
                    content.mayStatus = itemEnables['105'];
                    return;
                  }
                  case '106': {
                    content.junStatus = itemEnables['106'];
                    return;
                  }
                  case '107': {
                    content.julStatus = itemEnables['107'];
                    return;
                  }
                  case '108': {
                    content.augStatus = itemEnables['108'];
                    return;
                  }
                  case '109': {
                    content.sepStatus = itemEnables['109'];
                    return;
                  }
                  case '110': {
                    content.octStatus = itemEnables['110'];
                    return;
                  }
                  case '111': {
                    content.novStatus = itemEnables['111'];
                    return;
                  }
                  case '112': {
                    content.decStatus = itemEnables['112'];
                    return;
                  }
                  case '201': {
                    content.q1Status = itemEnables['201'];
                    return;
                  }
                  case '202': {
                    content.q2Status = itemEnables['202'];
                    return;
                  }
                  case '203': {
                    content.q3Status = itemEnables['203'];
                    return;
                  }
                  case '204': {
                    content.q4Status = itemEnables['204'];
                    return;
                  }
                  case '401': {
                    content.yearStatus = itemEnables['401'];
                    return;
                  }
                }
              });
            }
            return content;
          },
        );
        setKpiGeneralContents([...editableContent]);
      }
    }, [kpiGeneralContents, setKpiGeneralContents]);

    return [kpiGeneralContents];
  }

  public useAppUserModal(
    currentKpiItem: KpiGeneral,
    setCurrentKpiItem: Dispatch<SetStateAction<KpiGeneral>>,
    selectedList: AppUser[],
    setSelectedList: Dispatch<SetStateAction<AppUser[]>>,
    currentOrg: Organization,
    currentKpiYear: KpiYear,
    setVisible: Dispatch<SetStateAction<boolean>>,
  ) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<AppUserFilter>(new AppUserFilter());
    const [loadList, setLoadList] = useState<boolean>(false);

    /* handle Open appUser modal */
    const handleOpenModal = useCallback(() => {
      setFilter({
        ...filter,
        organizationId: { equal: currentOrg?.id },
        kpiYearId: { equal: currentKpiYear?.id },
        skip: 0,
      });
      setLoadList(true);
      setIsOpen(true);
      setVisible(true);
    }, [filter, currentOrg, currentKpiYear, setVisible]);
    /* handle save appUser modal */
    const handleSaveModal = useCallback(
      (list: AppUser[]) => {
        const errors = currentKpiItem.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.employeeIds = null;
        }
        if (list && list.length > 0) {
          setSelectedList(list);
          const ids = list.map(item => item.id);
          setCurrentKpiItem({
            ...currentKpiItem,
            employeeIds: [...ids],
            errors,
          });
        } else {
          setSelectedList([]);
        }
        setIsOpen(false);
      },
      [currentKpiItem, setCurrentKpiItem, setSelectedList],
    );
    /* handle close appUser modal */
    const handleCloseModal = useCallback(() => {
      setIsOpen(false);
      setSelectedList([...selectedList]);
    }, [selectedList, setSelectedList]);

    const handleDeleteSelectedUser = useCallback(
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

export const kpiGenralService: KpiGenralService = new KpiGenralService();
