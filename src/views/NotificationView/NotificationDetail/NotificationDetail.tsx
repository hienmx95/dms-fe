import { Input, Modal } from 'antd';
import Form from 'antd/lib/form';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import TextEditor from 'components/RichTextEditor/RichTextEditor';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { API_NOTIFICATION } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { defaultContentStyle, EditorConfig } from 'core/models/EditorConfig';
import { crudService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUserFilter } from 'models/AppUserFilter';
import { Notification } from 'models/Notification';
import { NotificationFilter } from 'models/NotificationFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import ModalPopup from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';
import { notification } from '../../../helpers/notification';
import { notificationRepository } from '../NotificationRepository';
import './NotificationDetail.scss';

const { Item: FormItem } = Form;

export interface NotificationDetailIProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListNotification?: (filter: TFilter) => Promise<T[]>;
  setListNotification?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function NotificationDetail<T extends Model, TFilter extends ModelFilter>(
  props: NotificationDetailIProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListNotification,
    setListNotification,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'notification',
    API_NOTIFICATION,
  );

  const [config] = React.useState<EditorConfig>(
    new EditorConfig(
      '100%',
      240,
      true,
      true,
      true,
      setup,
      defaultContentStyle,
      [],
      undefined,
      'raw',
    ),
  );
  // Hooks, useDetail, useChangeHandler
  const [noti, setNoti, , , handleSave] = crudService.usePopupDetail(
    Notification,
    NotificationFilter,
    isDetail,
    currentItem,
    setVisible,
    notificationRepository.get,
    notificationRepository.save,
    getListNotification,
    setListNotification,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Notification>(noti, setNoti);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------
  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  const handleSend = React.useCallback(() => {
    Modal.confirm({
      title: translate('notifications.confirm'),
      content: translate(generalLanguageKeys.delete.content),
      zIndex: 2000, // assign to 2000 because default is 1000, it will lie behind add noti modal

      className: 'modal-confirm',
      onOk() {
        notificationRepository
          .send(noti)
          .then(() => {
            notification.success({
              message: translate(generalLanguageKeys.update.success),
            });
            setVisible(false);
            setLoadList(true);
          })
          .catch((error: Error) => {
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      },
    });
  }, [setLoadList, setVisible, translate, noti]);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const handleChangeContent = React.useCallback(
    content => {
      setNoti({
        ...noti,
        content,
      });
    },
    [noti, setNoti],
  );
  return (
    <>
      <ModalPopup
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail notification-modal-view"
        size="xl"
      >
        <div className="d-flex justify-content-between modal-header">
          <h5 className="d-flex align-items-center header-popup ">
            {isDetail === false
              ? translate('notifications.detail.title')
              : translate('notifications.detail.edit')}
          </h5>

          <div className="d-flex justify-content-end">
            {validAction('send') && (
              <button
                className="btn btn-sm btn-primary float-right "
                onClick={handleSend}
              >
                <i className="fa fa-paper-plane mr-2"></i>
                {translate('notifications.send')}
              </button>
            )}
            {isDetail && validAction('update') && (
              <button
                className="btn btn-sm btn-primary ml-2 float-right "
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate('notifications.save')}
              </button>
            )}
            {!isDetail && validAction('update') && (
              <button
                className="btn btn-sm btn-primary ml-2 float-right "
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate('notifications.save')}
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-primary ml-2 float-right "
              onClick={handleCancel}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </div>
        <ModalBody>
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Notification>(
                    noti.errors,
                    nameof(noti.title),
                  )}
                  help={noti.errors?.title}
                >
                  <span className="label-input ml-3">
                    {translate('notifications.title')}
                    <span className="text-danger">*</span>
                  </span>
                  <Input
                    type="text"
                    value={noti.title}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(noti.title))}
                    placeholder={translate('notifications.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col span={2} />
              <Col span={11}>
                {validAction('singleListOrganization') && (
                  <FormItem
                    className="mb-3"
                    validateStatus={formService.getValidationStatus<
                      Notification
                    >(noti.errors, nameof(noti.organization))}
                    help={noti.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('notifications.organization')}
                    </span>
                    <TreeSelectDropdown
                      defaultValue={noti.organization?.id}
                      value={noti.organization?.id}
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(noti.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={notificationRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'notifications.placeholder.organization',
                      )}
                    />
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <FormItem
                className="notification-editor mt-2 mb-3"
                validateStatus={formService.getValidationStatus<Notification>(
                  noti.errors,
                  nameof(noti.content),
                )}
                help={noti.errors?.content}
              >
                <div className="label ml-3 mr-2">
                  {translate('notifications.content')}
                </div>
                <TextEditor
                  value={noti.content || ''}
                  editorConfig={config}
                  onChange={handleChangeContent}
                  className="editorr"
                />
              </FormItem>
            </Row>
          </Form>
        </ModalBody>
      </ModalPopup>
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
        notificationRepository.singleListAppUser(filter).then(list => {
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
      const el = `<span class="editor-tag-name"><input type="hidden" data-id="${detail[1]}" />${detail[0]} </span><span>&#8203</span>`;
      editor.selection.setRng(rng);
      editor.insertContent(el);
      autocompleteApi.hide();
    },
  });
};
export default NotificationDetail;
