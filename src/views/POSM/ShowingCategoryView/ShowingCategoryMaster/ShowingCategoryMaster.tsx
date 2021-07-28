import { Card, Col } from 'antd';
import TreeMaster from 'components/TreeMaster/TreeMaster';
import { ShowingCategory } from 'models/posm/ShowingCategory';
import React from 'react';
import useShowingCategoryMaster from './ShowingCategoryMasterHook';
import ShowingCategoryPreview from './ShowingCategoryPreview';
export default function ShowingCategoryMaster() {
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
  } = useShowingCategoryMaster();

  return (
    <div className="page master-page">
      <Card
        className="category-master"
        title={translate('showingCategories.master.title')}
      >
        <Col lg={12}>
          <div className="org-grouping">
            {validAction('create') && (
              <div className="mb-3">
                <span className="title-org">
                  {translate('showingCategories.master.grouping.title')}
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
              checkDeleteCondition={(node: ShowingCategory) => !node.used}
            />
          </div>
        </Col>
      </Card>
      {previewVisible && (
        <ShowingCategoryPreview
          visible={previewVisible}
          previewLoading={previewLoading}
          onCancel={handleClosePreview}
          model={previewModel}
        />
      )}
    </div>
  );
}
