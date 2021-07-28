import Form from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService, formService } from 'core/services';
import { ProblemType } from 'models/ProblemType';
import { ProblemTypeFilter } from 'models/ProblemTypeFilter';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { problemTypeRepository } from 'views/ProblemType/ProblemTypeRepository';
import './ProblemTypeDetail.scss';
import { API_PROBLEM_TYPE_ROUTE } from 'config/api-consts';
import { Input } from 'antd';
export interface ProblemTypeDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListProblemType?: (filter: TFilter) => Promise<T[]>;
  setListProblemType?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function ProblemTypeDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: ProblemTypeDetailProps<T, TFilter>) {

  const { validAction } = crudService.useAction(
    'problem-type',
    API_PROBLEM_TYPE_ROUTE,
  );

  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListProblemType,
    setListProblemType,
    setLoadList,
  } = props;

  const [translate] = useTranslation();

  const [
    problemType,
    setProblemType,
    ,
    ,
    handleSave,
  ] = crudService.usePopupDetail(
    ProblemType,
    ProblemTypeFilter,
    isDetail,
    currentItem,
    setVisible,
    problemTypeRepository.get,
    problemTypeRepository.save,
    getListProblemType,
    setListProblemType,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<ProblemType>(
    problemType,
    setProblemType,
  );

  const [statusList] = crudService.useEnumList<Status>(
    problemTypeRepository.singleListStatus,
  );

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );

  return (
    <>
      <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
        <ModalHeader className="title-header-popup">
          {isDetail === false
            ? translate('problemTypes.detail.addNode')
            : translate('problemTypes.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form >
            <Col>
              <FormItem className="mb-3"
                validateStatus={formService.getValidationStatus<ProblemType>(
                  problemType.errors,
                  nameof(problemType.code),
                )}
                help={problemType.errors?.code}
              >
                <span className="label-input mr-3">
                  {translate('problemTypes.code')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={problemType.code}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(problemType.code))}
                  placeholder={translate('problemTypes.placeholder.code')}
                />
              </FormItem>
              <FormItem className="mb-3"
                validateStatus={formService.getValidationStatus<ProblemType>(
                  problemType.errors,
                  nameof(problemType.name),
                )}
                help={problemType.errors?.name}
              >
                <span className="label-input mr-3">
                  {translate('problemTypes.name')}
                  <span className="text-danger"> *</span>
                </span>
                <Input
                  type="text"
                  value={problemType.name}
                  className="form-control form-control-sm"
                  onChange={handleChangeSimpleField(nameof(problemType.name))}
                  placeholder={translate('problemTypes.placeholder.name')}
                />
              </FormItem>
              <FormItem className="mb-3"
              >
                <span className="label-input mr-3">
                  {translate('problemTypes.status')}
                </span>
                {validAction('singleListStatus') && (
                  <Switch
                    checked={
                      // typeof problemType.status?.id === 'number' &&
                      problemType.statusId === statusList[1]?.id
                    }
                    list={statusList}
                    onChange={handleChangeObjectField(nameof(problemType.status))}
                  />
                )}
              </FormItem>
            </Col>
            <div className="d-flex justify-content-end mt-4 mr-3">
              {!isDetail && validAction('create') && <button
                className="btn btn-sm btn-primary float-right"
                onClick={handleSave}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
              }

              {isDetail && validAction('update') &&
                <button
                  className="btn btn-sm btn-primary float-right"
                  onClick={handleSave}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.actions.save)}
                </button>
              }
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

export default ProblemTypeDetail;
