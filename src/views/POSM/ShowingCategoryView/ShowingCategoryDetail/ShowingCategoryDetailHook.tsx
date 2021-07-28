import { API_SHOWING_CATEGORY_ROUTE } from 'config/api-consts';
import { SHOWING_CATEGORY_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { ShowingCategory } from 'models/posm/ShowingCategory';
import { ShowingCategoryFilter } from 'models/posm/ShowingCategoryFilter';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { showingCategoryRepository } from '../ShowingCategoryRepository';
export function useShowingCategoryDetail() {
  const [translate] = useTranslation();

  const [handleGoBack] = routerService.useGoBack(SHOWING_CATEGORY_ROUTE); // Service goback

  const { validAction } = crudService.useAction(
    'showing-category',
    API_SHOWING_CATEGORY_ROUTE,
  );

  const [
    showingCategory,
    setShowingCategory,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    ShowingCategory,
    showingCategoryRepository.get,
    showingCategoryRepository.save,
  ); // detail service

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ShowingCategory>(
    showingCategory,
    setShowingCategory,
  );

  const [statusList] = crudService.useEnumList<Status>(
    showingCategoryRepository.singleListStatus,
  );

  const [showingCategoryFilter, setShowingCategoryFilter] = React.useState<
    ShowingCategoryFilter
  >(new ShowingCategoryFilter());

  return {
    translate,
    handleGoBack,
    loading,
    isDetail,
    handleSave,
    handleChangeSimpleField,
    handleChangeObjectField,
    statusList,
    showingCategory,
    setShowingCategory,
    showingCategoryFilter,
    setShowingCategoryFilter,
    validAction,
  };
}
