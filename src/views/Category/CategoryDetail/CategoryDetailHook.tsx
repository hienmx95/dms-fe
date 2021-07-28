import React from 'react';
import { crudService, routerService } from 'core/services';
import { useTranslation } from 'react-i18next';
import { CATEGORY_ROUTE } from 'config/route-consts';
import { categoryRepository } from '../CategoryRepository';
import { Status } from 'models/Status';
import { CategoryFilter, Category } from 'models/Category';
import { API_CATEGORY_ROUTE } from 'config/api-consts';
export function useCategoryDetail() {
  const [translate] = useTranslation();

  const [handleGoBack] = routerService.useGoBack(CATEGORY_ROUTE); // Service goback

  const { validAction } = crudService.useAction('category', API_CATEGORY_ROUTE, 'mdm');

  const [
    category,
    setCategory,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Category,
    categoryRepository.get,
    categoryRepository.save,
  ); // detail service

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Category>(category, setCategory);

  const [statusList] = crudService.useEnumList<Status>(
    categoryRepository.singleListStatus,
  );

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );


  return {
    translate,
    handleGoBack,
    loading,
    isDetail,
    handleSave,
    handleChangeSimpleField,
    handleChangeObjectField,
    statusList,
    category,
    setCategory,
    categoryFilter,
    setCategoryFilter,
    validAction,
  };
}
