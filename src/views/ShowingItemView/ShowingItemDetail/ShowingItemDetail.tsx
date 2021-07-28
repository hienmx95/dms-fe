import { Col, Input, Row } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import Spin from 'antd/lib/spin';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import InputNumber from 'components/InputNumber/InputNumber';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_SHOWING_ITEM_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { SHOWING_ITEM_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Image } from 'models/Image';
import { ShowingCategoryFilter } from 'models/posm/ShowingCategoryFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemImageMapping } from 'models/posm/ShowingItemImageMapping';
import { Status } from 'models/Status';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import nameof from 'ts-nameof.macro';
import { showingItemRepository } from 'views/ShowingItemView/ShowingItemRepository';
import { notification } from 'helpers/notification';
import { AxiosError } from 'axios';
import './ShowingItemDetail.scss';
const { Item: FormItem } = Form;

function ShowingItemDetail() {
  const [translate] = useTranslation();
  const [handleGoBack] = routerService.useGoBack(SHOWING_ITEM_ROUTE);
  const history = useHistory();
  const { validAction } = crudService.useAction(
    'showing-item',
    API_SHOWING_ITEM_ROUTE,
  );
  const [
    showingItem,
    setShowingItem,
    loading,
    setLoading,
    isDetail,
    // handleSave,
  ] = crudService.useDetail(
    ShowingItem,
    showingItemRepository.get,
    showingItemRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ShowingItem>(showingItem, setShowingItem);

  const [statusList] = crudService.useEnumList<Status>(
    showingItemRepository.singleListStatus,
  );

  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [showingCategoryFilter, setShowingCategoryFilter] = React.useState<
    ShowingCategoryFilter
  >(new ShowingCategoryFilter());

  const [
    showingItemImageMappings,
    setShowingItemImageMappings,
  ] = React.useState<Image[]>([]);

  React.useEffect(() => {
    const images = [];
    if (
      showingItem.showingItemImageMappings &&
      showingItem.showingItemImageMappings.length > 0
    ) {
      showingItem.showingItemImageMappings.map(
        (showingItemImageMapping: ShowingItemImageMapping) => {
          return images.push(showingItemImageMapping.image);
        },
      );
      setShowingItemImageMappings(images);
    }
  }, [showingItem.showingItemImageMappings]);

  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setShowingItemImageMappings(items);
      const showingItemImageMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          showingItemImageMappings.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      setShowingItem({
        ...showingItem,
        showingItemImageMappings,
      });
    },
    [setShowingItem, showingItem],
  );

  const handleSave = React.useCallback(() => {
    setLoading(true);
    showingItemRepository
      .save(showingItem)
      .then(() => {
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
        history.goBack();
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error: AxiosError<ShowingItem>) => {
        if (error.response && error.response.status === 400) {
          if (
            error.response?.data?.salePrice === 0 &&
            error.response?.data?.errors?.salePrice
          ) {
            setShowingItem({ ...error.response?.data, salePrice: null });
          } else setShowingItem(error.response?.data);
        }
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [history, setLoading, setShowingItem, showingItem, translate]);

  return (
    <div className="page detail-page showing-item-detail">
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
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.code),
                  )}
                  help={showingItem.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('showingItems.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={showingItem.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(showingItem.code))}
                    placeholder={translate('showingItems.placeholder.code')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.name),
                  )}
                  help={showingItem.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('showingItems.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={showingItem.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(showingItem.name))}
                    placeholder={translate('showingItems.placeholder.name')}
                    // pattern=".{0,255}"
                    maxLength={255}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.showingCategory),
                  )}
                  help={showingItem.errors?.showingCategory}
                >
                  <span className="label-input ml-3">
                    {translate('showingItems.showingCategory')}
                    <span className="text-danger">*</span>
                  </span>
                  <TreeSelectDropdown
                    defaultValue={
                      isDetail ? showingItem.showingCategory?.id : null
                    }
                    value={showingItem.showingCategory?.id}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(showingItem.showingCategory),
                    )}
                    modelFilter={showingCategoryFilter}
                    setModelFilter={setShowingCategoryFilter}
                    getList={showingItemRepository.singleListShowingCategory}
                    searchField={nameof(showingCategoryFilter.id)}
                    placeholder={translate(
                      'showingItems.placeholder.showingCategory',
                    )}
                    onlyLeaf={true}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.unitOfMeasure),
                  )}
                  help={showingItem.errors?.unitOfMeasure}
                >
                  <span className="label-input ml-3">
                    {translate('showingItems.unitOfMeasure')}
                    <span className="text-danger">*</span>
                  </span>
                  <SelectAutoComplete
                    value={showingItem?.unitOfMeasure?.id}
                    onChange={handleChangeObjectField(
                      nameof(showingItem.unitOfMeasure),
                    )}
                    getList={showingItemRepository.singleListUnitOfMeasure}
                    modelFilter={unitOfMeasureFilter}
                    setModelFilter={setUnitOfMeasureFilter}
                    searchField={nameof(unitOfMeasureFilter.name)}
                    searchType={nameof(unitOfMeasureFilter.name.contain)}
                    placeholder={translate(
                      'showingItems.placeholder.unitOfMeasure',
                    )}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.erpCode),
                  )}
                  help={showingItem.errors?.erpCode}
                >
                  <span className="label-input ml-3">
                    {translate('products.eRPCode')}
                  </span>
                  <Input
                    type="text"
                    value={showingItem.erpCode}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(showingItem.erpCode),
                    )}
                    placeholder={translate('products.placeholder.eRPCode')}
                    // pattern=".{0,255}"
                    maxLength={255}
                  />
                </FormItem>

                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.status),
                  )}
                  help={showingItem.errors?.status}
                >
                  <span className="label-input ml-3">
                    {translate('showingItems.status')}
                  </span>

                  <SwitchStatus
                    checked={
                      showingItem.statusId === statusList[1]?.id ? true : false
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(
                      nameof(showingItem.status),
                    )}
                  />
                </FormItem>
              </Col>
              <Col lg={2}></Col>
              <Col lg={11}>
                {validAction('saveImage') && (
                  <FormItem>
                    <label className="label-input label-image">
                      {translate('showingItems.images')}
                    </label>

                    <ImageUpload
                      defaultItems={showingItemImageMappings}
                      limit={15}
                      aspectRatio={1}
                      onUpload={showingItemRepository.saveImage}
                      onChange={handleChangeImages}
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={formService.getValidationStatus<ShowingItem>(
                    showingItem.errors,
                    nameof(showingItem.salePrice),
                  )}
                  help={showingItem.errors?.salePrice}
                >
                  <span className="label-input">
                    {translate('showingItems.salePrice')}
                    <span className="text-danger">*</span>
                  </span>
                  <InputNumber
                    value={showingItem.salePrice}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(showingItem.salePrice),
                    )}
                    placeholder={translate(
                      'showingItems.placeholder.salePrice',
                    )}
                    min={0}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={24}>
                <FormItem>
                  <label className="label-input label-description ml-3">
                    {translate('showingItems.description')}
                  </label>
                  <TextArea
                    rows={5}
                    value={showingItem.description}
                    onChange={handleChangeSimpleField(
                      nameof(showingItem.description),
                    )}
                    placeholder={translate(
                      'showingItems.placeholder.description',
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

export default ShowingItemDetail;
