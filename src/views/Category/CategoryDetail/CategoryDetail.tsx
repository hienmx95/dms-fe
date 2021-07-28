import React from 'react';
import { Spin, Card, Row, Col, Form } from 'antd';
import { useCategoryDetail } from './CategoryDetailHook';
import { generalLanguageKeys } from 'config/consts';
import { formService } from 'core/services';
import { Category } from 'models/Category';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { categoryRepository } from '../CategoryRepository';
import nameof from 'ts-nameof.macro';
import CategoryImageUploader from './CategoryImageUploader';
import { IImage } from './CategoryImageUploader';

const { Item: FormItem } = Form;

export default function CategoryDetail() {
  const {
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
  } = useCategoryDetail();

  const handleChangeImage = React.useCallback(
    (value: IImage) => {
      if (value) {
        setCategory({
          ...category,
          image: value,
          imageId: value?.id,
        });
      }
    },
    [category, setCategory],
  );
  React.useEffect(() => {
    const id = window.location.href.split('=')[1]; // split to get parentId from url
    if (!category.parentId && +id) setCategory({ ...category, parentId: +id }); // set parentId for pre-create category
  }, [category, setCategory]);

  return (
    <div className="page detail-page category-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('general.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {isDetail && validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
                {!isDetail && validAction('create') && (
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Category>(
                    category.errors,
                    nameof(category.code),
                  )}
                  help={category.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('categories.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={category.code}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(nameof(category.code))}
                    placeholder={translate('categories.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Category>(
                    category.errors,
                    nameof(category.name),
                  )}
                  help={category.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('categories.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={category.name}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(nameof(category.name))}
                    placeholder={translate('categories.placeholder.name')}
                  />
                </FormItem>
                {validAction('singleListStatus') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Category>(
                      category.errors,
                      nameof(category.status),
                    )}
                    help={category.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('categories.status')}
                    </span>
                    <SwitchStatus
                      checked={category.statusId === statusList[1]?.id}
                      list={statusList}
                      onChange={handleChangeObjectField(
                        nameof(category.status),
                      )}
                    />
                  </FormItem>
                )}
                {validAction('singleListCategory') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<Category>(
                      category.errors,
                      nameof(category.parent),
                    )}
                    help={category.errors?.parent}
                  >
                    <span className="label-input ml-3">
                      {translate('categories.parent')}
                    </span>
                    <TreeSelectDropdown
                      defaultValue={isDetail ? category.parentId : undefined}
                      value={category.parentId || undefined}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(category.parent),
                      )}
                      modelFilter={categoryFilter}
                      setModelFilter={setCategoryFilter}
                      getList={categoryRepository.singleListCategory}
                      searchField={nameof(categoryFilter.id)}
                      placeholder={translate('categories.placeholder.parent')}
                    />
                  </FormItem>
                )}
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('categories.image')}
                  </span>
                  <CategoryImageUploader
                    onUpload={categoryRepository.saveImage}
                    defaultValue={category?.image}
                    onChange={handleChangeImage}
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('categories.description')}
                  </span>
                  <input
                    type="text"
                    defaultValue={category.description}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(
                      nameof(category.description),
                    )}
                    placeholder={translate(
                      'categories.placeholder.description',
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
