import { Filter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import React, { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { notification } from 'helpers';
import { INFINITE_SCROLL_TAKE } from 'core/config';
export class KpiGeneralReportService {
  public useKpiReportMaster<T extends Model, TFilter extends ModelFilter>(
    modelFilterClass: new () => TFilter,
    getList: (filter: TFilter) => Promise<T[]>,
    count: (filter: TFilter) => Promise<number>,
    requireField1?: string,
    requireField2?: string,
    requireField3?: string,
  ): [
    TFilter,
    Dispatch<SetStateAction<TFilter>>,
    T[],
    Dispatch<SetStateAction<T[]>>,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<SetStateAction<boolean>>,
    number,
    boolean,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    <TF extends Filter>(field: string) => (f: TF) => void,
    () => void,
  ] {
    const [filter, setFilter] = crudService.useQuery<TFilter>(modelFilterClass);
    const [list, setList] = React.useState<T[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [isReset, setIsReset] = React.useState<boolean>(true);
    const ref = useRef<number>(0);
    React.useEffect(() => {
      if (loadList) {
        setLoadList(false);
        let scrollFilter = filter;
        if (ref.current === 0) {
          scrollFilter = { ...filter, skip: 0, take: INFINITE_SCROLL_TAKE };
          ref.current = ref.current + 1; // decide next load is not the first load
          setFilter(scrollFilter); // update filter skip to 0 when force reload
        } // if the first load has skip > 0, set it to 0 and return
        if (typeof requireField1 !== 'undefined') {
          if (typeof filter[`${requireField1}`].equal === 'undefined') {
            return;
          }
        }
        if (typeof requireField2 !== 'undefined') {
          if (typeof filter[`${requireField2}`].equal === 'undefined') {
            return;
          }
        }
        if (requireField3 && typeof requireField3 !== 'undefined') {
          if (typeof filter[`${requireField3}`].equal === 'undefined') {
            return;
          }
        }
        setLoading(true);
        Promise.all([getList(scrollFilter), count(scrollFilter)])
          .then(([newList, total]) => {
            newList = newList.map(item => ({ ...item, key: uuidv4() }));
            setList([...newList]);
            setTotal(total);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [
      count,
      filter,
      getList,
      list,
      loadList,
      requireField1,
      requireField2,
      setFilter,
      requireField3,
    ]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take } = ModelFilter.clone<TFilter>(new modelFilterClass());
      setFilter(
        ModelFilter.clone<TFilter>({
          ...filter,
          skip,
          take,
        }),
      );
      setLoadList(true);
    }, [filter, modelFilterClass, setFilter]);

    const handleFilter = React.useCallback(
      <TF extends Filter>(field: string) => {
        return (f: TF) => {
          const { skip, take } = ModelFilter.clone<TFilter>(
            new modelFilterClass(),
          );
          setFilter(
            ModelFilter.clone<TFilter>({
              ...filter,
              [field]: f,
              skip,
              take,
            }),
          );
          setLoadList(true);
        };
      },
      [filter, modelFilterClass, setFilter],
    );

    const handleReset = React.useCallback(() => {
      setFilter(ModelFilter.clone<TFilter>(new modelFilterClass()));
      setLoadList(true);
      setIsReset(true);
    }, [modelFilterClass, setFilter]);

    return [
      filter,
      setFilter,
      list,
      setList,
      setLoadList,
      setLoading,
      total,
      loading,
      handleSearch,
      isReset,
      setIsReset,
      handleReset,
      handleFilter,
      handleDefaultSearch,
    ];
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

  public useSearchKpi(
    onSearch: () => void,
    requireFieldId1?: number | undefined,
    requireFieldId2?: number | undefined,
    message1?: string,
    message2?: string,
    requireFieldId3?: number | undefined,
    message3?: string,
  ) {
    return useCallback(() => {
      if (typeof requireFieldId1 === 'undefined') {
        notification.error({
          message: message1,
        });
        // return;
      }
      if (typeof requireFieldId2 === 'undefined') {
        notification.error({
          message: message2,
        });
        // return;
      }
      if (typeof requireFieldId3 === 'undefined') {
        notification.error({
          message: message3,
        });
        // return;
      }
      if (typeof onSearch === 'function') {
        onSearch();
      }
    }, [
      message1,
      message2,
      onSearch,
      requireFieldId1,
      requireFieldId2,
      requireFieldId3,
      message3,
    ]);
  }
}

export const kpiGeneralReportService: KpiGeneralReportService = new KpiGeneralReportService();
