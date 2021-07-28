import React from 'react';
import { useTranslation } from 'react-i18next';
import { crudService, routerService } from 'core/services';
import { tableService } from 'services';
import { API_CATEGORY_ROUTE } from 'config/api-consts';
import { Category, CategoryFilter } from 'models/Category';
import { categoryRepository } from '../CategoryRepository';
import { CATEGORY_DETAIL_ROUTE } from 'config/route-consts';
export default function useCategoryMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('category', API_CATEGORY_ROUTE, 'mdm');

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
    categoryRepository.count,
    categoryRepository.list,
    categoryRepository.get,
  );

  const [
    handleCreate,
    handleGoDetail,
    handleGoCreate,
  ] = routerService.useMasterNavigation(CATEGORY_DETAIL_ROUTE);

  const [handleDelete] = tableService.useDeleteHandler<Category>(
    categoryRepository.delete,
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
    categoryRepository.export,
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
