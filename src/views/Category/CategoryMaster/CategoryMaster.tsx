import React from 'react';
import useCategoryMaster from './CategoryMasterHook';
import { Card, Col } from 'antd';
import TreeMaster from 'components/TreeMaster/TreeMaster';
import CategoryPreview from './CategoryPreview';
import { Category } from 'models/Category';
export default function CategoryMaster() {
  const {
    translate,
    validAction,
    list,
    handleCreate,
    handleGoDetail,
    handleGoCreate,
    handleDelete,
    handleActive,
    currentItem,
    previewModel,
    previewVisible,
    previewLoading,
    handleOpenPreview,
    handleClosePreview,
  } = useCategoryMaster();

  return (
    <div className="page master-page">
      <Card
        className="category-master"
        title={translate('categories.master.title')}
      >
        <Col lg={12}>
          <div className="org-grouping">
            {validAction('create') && (
              <div className="mb-3">
                <span className="title-org">
                  {translate('categories.master.grouping.title')}
                </span>
                <i
                  role="button"
                  className="tio-add  ml-2 color-primary"
                  onClick={handleCreate}
                />
              </div>
            )}
            <TreeMaster
              tree={list}
              onPreview={handleOpenPreview}
              onAdd={handleGoCreate}
              onEdit={handleGoDetail}
              onDelete={handleDelete}
              onActive={handleActive}
              currentItem={currentItem}
              checkDeleteCondition={(node: Category) => !node.used}
            />
          </div>
        </Col>
      </Card>
      {previewVisible && (
        <CategoryPreview
          visible={previewVisible}
          previewLoading={previewLoading}
          onCancel={handleClosePreview}
          model={previewModel}
        />
      )}
    </div>
  );
}
