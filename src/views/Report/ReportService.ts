import { notification } from 'helpers';
import { AxiosError } from 'axios';
import { DateFilter, Filter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INFINITE_SCROLL_TAKE } from 'core/config';
export class ReportService {
  public useReportMaster<T extends Model, TFilter extends ModelFilter>(
    modelFilterClass: new () => TFilter,
    getList: (filter: TFilter) => Promise<T[]>,
    count: (filter: TFilter) => Promise<number>,
    requireField1?: string,
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
    DateFilter,
    Dispatch<SetStateAction<DateFilter>>,
  ] {
    const [filter, setFilter] = crudService.useQuery<TFilter>(modelFilterClass);
    const [list, setList] = React.useState<T[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [isReset, setIsReset] = React.useState<boolean>(true);
    const [dateFilter, setDateFilter] = React.useState<DateFilter>(
      new DateFilter(),
    );

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
      if (typeof requireField1 !== 'undefined') {
        if (typeof filter[requireField1].lessEqual === 'undefined') {
          // return;
          const date: Date = moment()
            .startOf('day')
            .toDate();
          scrollFilter= {...scrollFilter, [requireField1]: {
            greaterEqual: moment(date.getTime()),
            lessEqual: moment(
              date.getTime() + 86399999,
            ),
          }};
          setFilter({...scrollFilter});
          setDateFilter({ ...scrollFilter[requireField1] });
        }
      }
      if (loadList) {
        setLoadList(false);
        setLoading(true);
        Promise.all([getList(scrollFilter), count(scrollFilter)])
          .then(([newList, total]) => {
            newList = newList.map(item => ({ ...item, key: uuidv4() }));
            setList([...newList]);
            setTotal(total);
          })
          .catch((error: AxiosError<any>) => {
            if (error && error.response && error.response.data
            ) {
              notification.error({
                message: error?.response?.data?.message,
              });
            }
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
      setFilter,
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
      setFilter(ModelFilter.clone<TFilter>({...new modelFilterClass(), take: INFINITE_SCROLL_TAKE}));
      setLoadList(true);
      setIsReset(true);
      setDateFilter(new DateFilter());
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
      dateFilter,
      setDateFilter,
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
  public getTitleNumber<T extends Model, TFilter extends ModelFilter>(
    // modelFilterClass: new () => TFilter,
    filter: TFilter,
    getTotal: (filter: TFilter) => Promise<T>,
    isCount: boolean,
    setIsCount: Dispatch<SetStateAction<boolean>>,
  ): [T] {
    const [totalCount, setTotalCount] = React.useState<T>();

    React.useEffect(() => {
      if (isCount) {
        getTotal(filter).then(data => {
          setTotalCount({ ...data, isTotal: true, key: uuidv4() });
        });
        if (typeof setIsCount === 'function') {
          setIsCount(false);
        }
        return;
      }
      getTotal(filter).then(data => {
        setTotalCount({ ...data, isTotal: true, key: uuidv4() });
      });
    }, [filter, getTotal, setIsCount, isCount]);

    return [totalCount];
  }

  public addTotalCount<T extends Model>(list: T[], totalCount?: T): [T[]] {
    const [dataList, setDataList] = React.useState<T[]>([]);
    React.useEffect(() => {
      if (typeof totalCount !== 'undefined') {
        if (list[0]?.isTotal) {
          list.shift();
        }
        list.splice(0, 0, { ...totalCount });
        setDataList([...list]);
      }
    }, [list, totalCount]);

    return [dataList];
  }
}
export const reportService: ReportService = new ReportService();
