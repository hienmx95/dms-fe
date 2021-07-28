import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { Form, Col } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useTranslation } from 'react-i18next';
import { Category } from 'models/Category';
import { generalLanguageKeys } from 'config/consts';

export interface ShowingCategoryPreviewProps {
  visible?: boolean;
  previewLoading?: boolean;
  onCancel?: () => void;
  model?: Category;
}

export default function ShowingCategoryPreview(
  props: ShowingCategoryPreviewProps,
) {
  const [translate] = useTranslation();
  const { visible, onCancel, model } = props;
  return (
    <Modal isOpen={visible} toggle={onCancel} className="form-modal-detail">
      <ModalBody>
        <Form className="ml-2">
          <Col>
            <FormItem className="mb-3">
              <span className="label-input mr-3">
                {translate('categories.code')}
              </span>
              <span>{model?.code}</span>
            </FormItem>
          </Col>
        </Form>
        <Form className="ml-2">
          <Col>
            <FormItem className="mb-3">
              <span className="label-input mr-3">
                {translate('categories.name')}
              </span>
              <span>{model?.name}</span>
            </FormItem>
          </Col>
        </Form>
        <Form className="ml-2">
          <Col>
            <FormItem className="mb-3">
              <span className="label-input mr-3">
                {translate('categories.parent')}
              </span>
              <span>{model?.parent?.name}</span>
            </FormItem>
          </Col>
        </Form>
        <Form className="ml-2">
          <Col>
            <FormItem className="mb-3">
              <span className="label-input mr-3">
                {translate('categories.description')}
              </span>
              <span>{model?.description}</span>
            </FormItem>
          </Col>
        </Form>
        <Form className="ml-2">
          <Col>
            <FormItem className="mb-3">
              <span className="label-input mr-3">
                {translate('categories.image')}
              </span>
              <span>
                <div
                  style={{
                    width: 240,
                    height: 170,
                    background: `#e8e8e8 center / auto 100% no-repeat url('${model?.image?.url}')`,
                  }}
                ></div>
              </span>
            </FormItem>
          </Col>
        </Form>
        <div className="d-flex justify-content-end mt-4 ">
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={onCancel}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
