import { Col, Input, Row } from 'antd';
import Form from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import TextEditor from 'components/RichTextEditor/RichTextEditor';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { Banner } from 'models/Banner';
import { BannerFilter } from 'models/BannerFilter';
import { Image } from 'models/Image';
import { ProductType } from 'models/ProductType';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { bannerRepository } from 'views/BannerView/BannerRepository';
import './BannerDetail.scss';
import { AppUserFilter } from 'models/AppUserFilter';
import { EditorConfig } from 'core/models/EditorConfig';
import { API_BANNER_ROUTE } from 'config/api-consts';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { OrganizationFilter } from 'models/OrganizationFilter';

export interface BannerDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListBanner?: (filter: TFilter) => Promise<T[]>;
  setListBanner?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function BannerDetail<T extends Model, TFilter extends ModelFilter>(
  props: BannerDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListBanner,
    setListBanner,
    setLoadList,
  } = props;

  const [config] = React.useState<EditorConfig>(
    new EditorConfig(
      '100%',
      500,
      'undo redo | image | fontselect fontsizeselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat  | help' as string,
      false,
      true,
      setup,
      '',
      [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools',
      ],
      bannerRepository.uploadImage,
    ),
  );

  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('banner', API_BANNER_ROUTE);

  const [banner, setBanner, , , handleSave] = crudService.usePopupDetail(
    Banner,
    BannerFilter,
    isDetail,
    currentItem,
    setVisible,
    bannerRepository.get,
    bannerRepository.save,
    getListBanner,
    setListBanner,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ProductType>(banner, setBanner);

  const [statusList] = crudService.useEnumList<Status>(
    bannerRepository.singleListStatus,
  );

  const [images, setImages] = React.useState<Image[]>([]);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  React.useEffect(() => {
    const images = [];
    if (banner.images && banner.images.length > 0) {
      banner.images.map((image: Image) => {
        return images.push(image);
      });
      setImages(images);
    }
  }, [banner.images]);
  const handleChangeImages = React.useCallback(
    (items: Image[]) => {
      setImages(items);
      const image = [];
      const imageId: number = items[0].id;
      if (items && items.length > 0) {
        items.forEach(item => {
          image.push({
            image: item,
            imageId: item.id,
          });
        });
      }
      const errors = banner.errors;
      if (typeof errors !== 'undefined' && errors !== null) {
        errors.image = null;
      }
      setBanner({
        ...banner,
        images,
        imageId,
        errors,
      });
    },
    [setBanner, banner, images],
  );

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );
  const handleChangeContent = React.useCallback(
    content => {
      setBanner(prebanner => ({
        ...prebanner,
        content,
      }));
    },
    [setBanner],
  );
  return (
    <>
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
        size="xl"
      >
        <ModalHeader>
          {isDetail === false
            ? translate('banners.detail.addNode')
            : translate('banners.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form className="banner-detail">
            <Row className="under-header-detail">
              {validAction('saveImage') && (
                <Col span={11} className="pl-2">
                  <div>
                    <span className="label-input mr-3 mb-3">
                      {translate('banners.image')}
                      <span className="text-danger">*</span>
                    </span>
                  </div>
                  <div>
                    <ImageUpload
                      defaultItems={images}
                      limit={1}
                      aspectRatio={1}
                      onUpload={bannerRepository.uploadImage}
                      onChange={handleChangeImages}
                    />
                    {banner.errors?.image && (
                      <span className="ant-form-explain explain-image">
                        {banner.errors?.image}
                      </span>
                    )}
                  </div>
                </Col>
              )}
              <Col span={2}></Col>
              <Col span={11} className="pl-2">
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Banner>(
                    banner.errors,
                    nameof(banner.title),
                  )}
                  help={banner.errors?.title}
                >
                  <span className="label-input mr-3">
                    {translate('banners.title')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={banner.title}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(banner.title))}
                    placeholder={translate('banners.placeholder.title')}
                  />
                </FormItem>

                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Banner>(
                    banner.errors,
                    nameof(banner.organization),
                  )}
                  help={banner.errors?.organization}
                >
                  <span className="label-input mr-3">
                    {translate('banners.organization')}
                    <span className="text-danger"> *</span>
                  </span>
                  <TreeSelectDropdown
                    defaultValue={banner.organization?.id}
                    value={banner.organization?.id}
                    mode="single"
                    onChange={handleChangeObjectField(
                      nameof(banner.organization),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={bannerRepository.singleListOrganization}
                    searchField={nameof(organizationFilter.id)}
                    placeholder={translate('banners.placeholder.organization')}
                    disabled={banner.used}
                  />
                </FormItem>
                {validAction('singleListStatus') && (
                  <FormItem className="mb-3">
                    <span className="label-input mr-3">
                      {translate('banners.status')}
                    </span>
                    <Switch
                      checked={banner.statusId === 1}
                      list={statusList}
                      onChange={handleChangeObjectField(nameof(banner.status))}
                    />
                  </FormItem>
                )}
                <FormItem className="mb-3">
                  <span className="label-input mr-3">
                    {translate('banners.priority')}
                  </span>
                  <Input
                    type="text"
                    value={banner.priority}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(banner.priority))}
                    placeholder={translate('banners.placeholder.priority')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <span className="label-input mb-3 mt-3 banner-content">
                {translate('banners.content')}
              </span>
              <TextEditor
                value={banner.content || ''}
                onChange={handleChangeContent}
                editorConfig={config}
                className="editor"
              />
            </Row>
            <div className="d-flex justify-content-end mt-4">
              {isDetail && validAction('update') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              {!isDetail && validAction('create') && (
                <button className="btn btn-sm btn-primary" onClick={handleSave}>
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
const setup = editor => {
  editor.ui.registry.addAutocompleter('autocompleter-flags', {
    ch: '@',
    minChars: 2,
    columns: 1,
    fetch: pattern => {
      const filter = {
        ...new AppUserFilter(),
        displayName: { contain: pattern },
      };
      return new Promise(resolver => {
        bannerRepository.singleListAppUser(filter).then(list => {
          const results = list.map(item => ({
            ...item,
            value: `${item.username};${item.id}`,
            text: item.username,
          }));
          resolver(results);
        });
      });
    },
    onAction: (autocompleteApi, rng, value) => {
      /* inject html input with user data-id */
      const detail = value.split(';');
      const el = `<span class="editor-tag-name"><Input type="hidden" data-id="${detail[1]}" />${detail[0]} </span><span>&#8203</span>`;
      editor.selection.setRng(rng);
      editor.insertContent(el);
      autocompleteApi.hide();
    },
  });
};

export default BannerDetail;
