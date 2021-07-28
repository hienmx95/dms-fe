import { API_SHOWING_CATEGORY_ROUTE } from 'config/api-consts';
import { SHOWING_CATEGORY_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { Category, CategoryFilter } from 'models/Category';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import { showingCategoryRepository } from '../ShowingCategoryRepository';
export default function useShowingCategoryMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'showing-category',
    API_SHOWING_CATEGORY_ROUTE,
  );

  const [
    filter,
    ,
    list,
    setList,
    loading,
    setLoading,
    ,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    ,
    ,
    handleDefaultSearch,
  ] = crudService.useMaster<Category, CategoryFilter>(
    Category,
    CategoryFilter,
    showingCategoryRepository.count,
    showingCategoryRepository.list,
    showingCategoryRepository.get,
  );

  const [
    handleCreate,
    handleGoDetail,
    handleGoCreate,
  ] = routerService.useMasterNavigation(SHOWING_CATEGORY_DETAIL_ROUTE);

  const [handleDelete] = tableService.useDeleteHandler<Category>(
    showingCategoryRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const handleActive = React.useCallback(
    (node: Category) => {
      setCurrentItem(node);
    },
    [setCurrentItem],
  );

  /**
   * If export
   */

  const [handleExport] = crudService.useExport(
    showingCategoryRepository.export,
    filter,
  );

  return {
    translate,
    validAction,
    filter,
    list,
    setList,
    loading,
    setLoading,
    handleDefaultSearch,
    handleCreate,
    handleGoDetail,
    handleGoCreate,
    handleDelete,
    handleActive,
    currentItem,
    handleExport,
    previewModel,
    previewVisible,
    previewLoading,
    handleOpenPreview,
    handleClosePreview,
  };
}
