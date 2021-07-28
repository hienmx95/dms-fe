import { Card, Col, Form, Row, Spin } from 'antd';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys } from 'config/consts';
import { formService } from 'core/services';
import { ShowingCategory } from 'models/posm/ShowingCategory';
import React from 'react';
import nameof from 'ts-nameof.macro';
import { showingCategoryRepository } from '../ShowingCategoryRepository';
import { useShowingCategoryDetail } from './ShowingCategoryDetailHook';
import CategoryImageUploader, { IImage } from './ShowingCategoryImageUploader';

const { Item: FormItem } = Form;

export default function ShowingCategoryDetail() {
  const {
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
  } = useShowingCategoryDetail();

  const handleChangeImage = React.useCallback(
    (value: IImage) => {
      if (value) {
        setShowingCategory({
          ...showingCategory,
          image: value,
          imageId: value?.id,
        });
      }
    },
    [showingCategory, setShowingCategory],
  );
  React.useEffect(() => {
    const id = window.location.href.split('=')[1]; // split to get parentId from url
    if (!showingCategory.parentId && +id)
      setShowingCategory({ ...showingCategory, parentId: +id }); // set parentId for pre-create showingCategory
  }, [showingCategory, setShowingCategory]);

  return (
    <div className="page detail-page showingCategory-detail">
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
                  validateStatus={formService.getValidationStatus<
                    ShowingCategory
                  >(showingCategory.errors, nameof(showingCategory.code))}
                  help={showingCategory.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('showingCategories.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={showingCategory.code}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(
                      nameof(showingCategory.code),
                    )}
                    placeholder={translate(
                      'showingCategories.placeholder.code',
                    )}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    ShowingCategory
                  >(showingCategory.errors, nameof(showingCategory.name))}
                  help={showingCategory.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('showingCategories.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={showingCategory.name}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(
                      nameof(showingCategory.name),
                    )}
                    placeholder={translate(
                      'showingCategories.placeholder.name',
                    )}
                  />
                </FormItem>

                {validAction('singleListShowingCategory') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingCategory
                    >(showingCategory.errors, nameof(showingCategory.parent))}
                    help={showingCategory.errors?.parent}
                  >
                    <span className="label-input ml-3">
                      {translate('showingCategories.parent')}
                    </span>
                    <TreeSelectDropdown
                      defaultValue={
                        isDetail ? showingCategory.parentId : undefined
                      }
                      value={showingCategory.parentId || undefined}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(showingCategory.parent),
                      )}
                      modelFilter={showingCategoryFilter}
                      setModelFilter={setShowingCategoryFilter}
                      getList={
                        showingCategoryRepository.singleListShowingCategory
                      }
                      searchField={nameof(showingCategoryFilter.id)}
                      placeholder={translate(
                        'showingCategories.placeholder.parent',
                      )}
                    />
                  </FormItem>
                )}
                {validAction('singleListStatus') && (
                  <FormItem
                    validateStatus={formService.getValidationStatus<
                      ShowingCategory
                    >(showingCategory.errors, nameof(showingCategory.status))}
                    help={showingCategory.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('showingCategories.status')}
                    </span>
                    <SwitchStatus
                      checked={showingCategory.statusId === statusList[1]?.id}
                      list={statusList}
                      onChange={handleChangeObjectField(
                        nameof(showingCategory.status),
                      )}
                    />
                  </FormItem>
                )}
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('showingCategories.image')}
                  </span>
                  <CategoryImageUploader
                    onUpload={showingCategoryRepository.saveImage}
                    defaultValue={showingCategory?.image}
                    onChange={handleChangeImage}
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3">
                    {translate('showingCategories.description')}
                  </span>
                  <input
                    type="text"
                    defaultValue={showingCategory.description}
                    className="form-control form-control-sm"
                    onBlur={handleChangeSimpleField(
                      nameof(showingCategory.description),
                    )}
                    placeholder={translate(
                      'showingCategories.placeholder.description',
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
