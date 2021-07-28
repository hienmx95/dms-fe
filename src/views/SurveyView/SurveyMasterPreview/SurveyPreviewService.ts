import { PaginationConfig, PaginationProps } from 'antd/lib/pagination';
import { SorterResult } from 'antd/lib/table';
import { tableService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Answer } from 'models/Survey/Answer';
import { Store } from 'models/Survey/Store';
import { StoreFilter } from 'models/Survey/StoreFilter';
import { StoreScouting } from 'models/Survey/StoreScouting';
import { StoreScoutingFilter } from 'models/Survey/StoreScoutingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

export class SurveyPreviewService {
  public useStoreList(
    model: Answer,
    setModel: Dispatch<SetStateAction<Answer>>,
    field: string,
    storeFilter: StoreFilter,
    setStoreFilter: Dispatch<SetStateAction<StoreFilter>>,
  ): [
      Store[],
      (v: Store[]) => void,
      Store[],
      PaginationProps,
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<Store>,
      ) => void,
    ] {
    const stores: Store[] = React.useMemo(() => {
      if (model.storeResults) {
        model.storeResults?.forEach((t: Store, index: number) => {
          if (!t?.key) {
            t.key = uuidv4();
          }
          t.tableIndex = index;
        });
        return model.storeResults;
      }
      return [];
    }, [model]);

    const setStores = React.useCallback(
      (v: Store[]) => {
        setModel({
          ...model,
          [field]: v,
        });
      },
      [field, model, setModel],
    );
    const dataSource: Store[] = React.useMemo(() => {
      let data = [];
        const filteredStore = tableService
        .defaultFilterHandler(stores, storeFilter)
        .map((i: Store) => i.storeId);
       data = stores
        .map((i: Store) => ({ store: i }))
        .map(({ store }) => ({
          store,
          storeId: store.storeId,
        }))
        .filter(({ storeId }) => filteredStore.includes(storeId))
        .map(({ store }) => ({ ...store }));
      return data;
    },[stores, storeFilter]);



    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = storeFilter;

      const { length } = dataSource ?? [];
      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, storeFilter]);

    const handleTableChange = React.useCallback(
      (...[newPagination]) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== storeFilter.skip || take !== storeFilter.take) {
          setStoreFilter({
            ...storeFilter,
            skip,
            take,
          });
          return;
        }
      },
      [storeFilter, setStoreFilter],
    );
    return [
      stores,
      setStores,
      dataSource,
      pagination,
      handleTableChange,
    ];
  }

  public useStoreScoutingList(
    model: Answer,
    setModel: Dispatch<SetStateAction<Answer>>,
    field: string,
    storeScoutingFilter: StoreScoutingFilter,
    setStoreScoutingFilter: Dispatch<SetStateAction<StoreScoutingFilter>>,
  ): [
      StoreScouting[],
      (v: StoreScouting[]) => void,
      StoreScouting[],
      PaginationProps,
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<StoreScouting>,
      ) => void,
    ] {
    const storeScoutings: StoreScouting[] = React.useMemo(() => {
      if (model.storeScoutingResults) {
        model.storeScoutingResults?.forEach((t: StoreScouting, index: number) => {
          if (!t?.key) {
            t.key = uuidv4();
          }
          t.tableIndex = index;
        });
        return model.storeScoutingResults;
      }
      return [];
    }, [model]);

    const setStoreScoutings = React.useCallback(
      (v: Store[]) => {
        setModel({
          ...model,
          [field]: v,
        });
      },
      [field, model, setModel],
    );
    const dataSource: StoreScouting[] = React.useMemo(() => {


      const filteredStoreScouting = tableService
        .defaultFilterHandler(storeScoutings, storeScoutingFilter)
        .map((i: StoreScouting) => i.storeScoutingId);
      const dataSource = storeScoutings
        .map((i: StoreScouting) => ({ storeScouting: i }))
        .map(({ storeScouting }) => ({
          storeScouting,
          storeScoutingId: storeScouting.storeScoutingId,
        }))
        .filter(({ storeScoutingId }) => filteredStoreScouting.includes(storeScoutingId))
        .map(({ storeScouting }) => ({ ...storeScouting }));
      return dataSource;

    },[ storeScoutings, storeScoutingFilter]);

    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = storeScoutingFilter;

      const { length } = dataSource ?? [];
      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, storeScoutingFilter]);

    const handleTableChange = React.useCallback(
      (...[newPagination]) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== storeScoutingFilter.skip || take !== storeScoutingFilter.take) {
          setStoreScoutingFilter({
            ...storeScoutingFilter,
            skip,
            take,
          });
          return;
        }
      },
      [storeScoutingFilter, setStoreScoutingFilter],
    );
    return [
      storeScoutings,
      setStoreScoutings,
      dataSource,
      pagination,
      handleTableChange,
    ];
  }
  public useAppUserList(
    model: Answer,
    setModel: Dispatch<SetStateAction<Answer>>,
    field: string,
    appUserFilter: AppUserFilter,
    setAppUserFilter: Dispatch<SetStateAction<AppUserFilter>>,
    fieldFilter: string,
  ): [
      AppUser[],
      (v: AppUser[]) => void,
      AppUser[],
      PaginationProps,
      (
        newPagination: PaginationConfig,
        filters: Record<string, any>,
        newSorter: SorterResult<AppUser>,
      ) => void,
    ] {
    const appUsers: AppUser[] = React.useMemo(() => {
      if (model.otherResults) {
        model.otherResults?.forEach((t: AppUser, index: number) => {
          if (!t?.key) {
            t.key = uuidv4();
          }
          t.tableIndex = index;
        });
        return model.otherResults;
      }
      return [];
    }, [model]);

    const setAppUsers = React.useCallback(
      (v: AppUser[]) => {
        setModel({
          ...model,
          [field]: v,
        });
      },
      [field, model, setModel],
    );
    const dataSource: Store[] = React.useMemo(() => {
      let data = [];
      switch(fieldFilter){
        case 'displayName':{
          const filteredAppUser = tableService
          .defaultFilterHandler(appUsers, appUserFilter)
          .map((i: AppUser) => i?.displayName);
         data = appUsers
          .map((i: AppUser) => ({ appUser: i }))
          .map(({ appUser }) => ({
            appUser,
            displayName: appUser.displayName,
          }))
          .filter(({ displayName }) => filteredAppUser.includes(displayName))
          .map(({ appUser }) => ({ ...appUser }));
         return data;
        }
        case 'phone':{
          const filteredAppUser = tableService
          .defaultFilterHandler(appUsers, appUserFilter)
          .map((i: AppUser) => i?.phone);
         data = appUsers
          .map((i: AppUser) => ({ appUser: i }))
          .map(({ appUser }) => ({
            appUser,
            phone: appUser.phone,
          }))
          .filter(({ phone }) => filteredAppUser.includes(phone))
          .map(({ appUser }) => ({ ...appUser }));
          return data;
        }
        case 'email':{
          const filteredAppUser = tableService
          .defaultFilterHandler(appUsers, appUserFilter)
          .map((i: AppUser) => i?.email);
         data = appUsers
          .map((i: AppUser) => ({ appUser: i }))
          .map(({ appUser }) => ({
            appUser,
            email: appUser.email,
          }))
          .filter(({ email }) => filteredAppUser.includes(email))
          .map(({ appUser }) => ({ ...appUser }));
          return data;
        }
        default:{
          const filteredAppUser = tableService
          .defaultFilterHandler(appUsers, appUserFilter)
          .map((i: AppUser) => i?.id);
         data = appUsers
          .map((i: AppUser) => ({ appUser: i }))
          .map(({ appUser }) => ({
            appUser,
            id: appUser.id,
          }))
          .filter(({ id }) => filteredAppUser.includes(id))
          .map(({ appUser }) => ({ ...appUser }));
          return data;
        }
      }
    },[fieldFilter, appUsers, appUserFilter]);
    const pagination: PaginationProps = React.useMemo(() => {
      const { skip, take } = appUserFilter;

      const { length } = dataSource ?? [];
      return {
        current: skip / take + 1,
        pageSize: take,
        total: length,
      };
    }, [dataSource, appUserFilter]);

    const handleTableChange = React.useCallback(
      (...[newPagination]) => {
        const { pageSize: take } = newPagination;
        const skip: number =
          (newPagination.current - 1) * newPagination.pageSize;

        if (skip !== appUserFilter.skip || take !== appUserFilter.take) {
          setAppUserFilter({
            ...appUserFilter,
            skip,
            take,
          });
          return;
        }
      },
      [appUserFilter, setAppUserFilter],
    );
    return [
      appUsers,
      setAppUsers,
      dataSource,
      pagination,
      handleTableChange,
    ];
  }

}

export const surveyPreiviewService: SurveyPreviewService = new SurveyPreviewService();
