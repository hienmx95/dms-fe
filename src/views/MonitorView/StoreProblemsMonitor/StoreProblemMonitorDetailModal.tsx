import { Col, Row } from 'antd';
import Card from 'antd/lib/card';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import ChatBox from 'components/ChatBox/ChatBox';
import ImageView from 'components/ImageView/ImageView';
import { API_STORE_PROBLEMS_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { formatDateTime } from 'core/helpers/date-time';
import { crudService } from 'core/services';
import { AppUser } from 'models/AppUser';
import {
  ProblemStatus,
  StoreProblemsMonitor,
} from 'models/monitor/StoreProblemsMonitor';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import { Modal, ModalBody, ModalProps } from 'reactstrap';
import { notification } from '../../../helpers/notification';
import { storeProblemsRepository } from './StoreProblemsRepository';

export interface StoreProblemMonitorDetailModalProps extends ModalProps {
  onSave?: () => void;
  onClose?: () => void;
  currentItem: StoreProblemsMonitor;
  setCurrentItem?: Dispatch<SetStateAction<StoreProblemsMonitor>>;
  posts?: Post[];
  problemId?: number;
}

function StoreProblemMonitorModal(props: StoreProblemMonitorDetailModalProps) {
  const [translate] = useTranslation();
  const {
    onClose,
    toggle,
    isOpen,
    currentItem,
    setCurrentItem,
  } = props;

  const { validAction } = crudService.useAction(
    'monitor-store-problem',
    API_STORE_PROBLEMS_ROUTE,
  );

  const [user] = useGlobal<AppUser>('user');

  const [visibleChat, setVisibleChat] = React.useState<boolean>(false);


  /* change status of storeProblem */

  const handleChangeStatus = React.useCallback(() => {
    let statusId = 0;
    switch (currentItem.problemStatus?.id) {
      case 1: {
        statusId = 2;
        break;
      }
      case 2: {
        statusId = 3;
        break;
      }
    }
    if (statusId > 0 && statusId < 4) {
      storeProblemsRepository
        .update({
          ...currentItem,
          problemStatusId: statusId,
          problemStatus: { ...new ProblemStatus(), id: 2 },
        })
        .then(item => {
          setCurrentItem({ ...item });
          setTimeout(() => {
            notification.success({
              message: translate(generalLanguageKeys.update.success),
            });
          }, 0);
        });
    }
  }, [currentItem, setCurrentItem, translate]);

  const handleVisibleChat = React.useCallback(() => {
    setVisibleChat(!visibleChat);
  }, [setVisibleChat, visibleChat]);

  const handleClose = React.useCallback(() => {
    setVisibleChat(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);


  return (
    <Modal size="xl" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
      <ModalBody>
        <Card
          title={
            <>
              {currentItem.code}
              <button
                className="btn btn-sm btn-outline-primary float-right "
                onClick={handleClose}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
              {/* render changeStatus button */}
              {currentItem.problemStatus?.id === 1 && validAction('update') && (
                <button
                  className="btn btn-sm btn-warning float-right mr-2"
                  onClick={handleChangeStatus}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.state.handle)}
                </button>
              )}
              {currentItem.problemStatus?.id === 2 && validAction('update') && (
                <button
                  className="btn btn-sm btn-success float-right mr-2"
                  onClick={handleChangeStatus}
                >
                  <i className="fa mr-2 fa-save" />
                  {translate(generalLanguageKeys.state.approved)}
                </button>
              )}
              <button className="btn btn-sm btn-primary btn-comment float-right mr-2" onClick={handleVisibleChat}>
                {/* <i className=" mr-2 tio-archive" /> */}
                {translate(generalLanguageKeys.actions.chat)}
              </button>
            </>
          }
          className="problem-monitor"
        >
          {/* organization */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.organization')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <input
                  type="text"
                  defaultValue={currentItem.organization?.name}
                  className="form-control form-control-sm"
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* creator */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.creator')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <input
                  type="text"
                  defaultValue={currentItem.creator?.displayName}
                  className="form-control form-control-sm"
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* noteAt */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.noteAt')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <input
                  type="text"
                  defaultValue={formatDateTime(currentItem.noteAt)}
                  className="form-control form-control-sm"
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* store code */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.storeCode')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <input
                  type="text"
                  defaultValue={currentItem.store?.code}
                  className="form-control form-control-sm"
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* store */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.store')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <input
                  type="text"
                  defaultValue={currentItem.store?.name}
                  className="form-control form-control-sm"
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* content */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.content')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem >
                <TextArea
                  rows={4}
                  value={currentItem.content}
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {/* status */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.problemStatus')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <>
                {currentItem.problemStatus?.id === 1 && (
                  <div className="new-state">
                    {currentItem.problemStatus?.name}
                  </div>
                )}
                {currentItem.problemStatus?.id === 2 && (
                  <div className="pending-state">
                    {currentItem.problemStatus?.name}
                  </div>
                )}
                {currentItem.problemStatus?.id === 3 && (
                  <div className="approved-state">
                    {currentItem.problemStatus?.name}
                  </div>
                )}
                {currentItem.problemStatus?.id === 4 && (
                  <div className="rejected-state">
                    {currentItem.problemStatus?.name}
                  </div>
                )}
              </>
            </Col>
            <Col span={4} />
          </Row>
          {/* images */}
          <Row className="mb-2">
            <Col span={4} />
            <Col span={6}>
              <FormItem>
                <span className="label-input">
                  {translate('storeProblemMonitors.images')}
                </span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                <>
                  <ImageView
                    list={currentItem.problemImageMappings}
                    className="store-images-grid"
                    type="thumb"
                    colSpan={6}
                  />
                </>
              </FormItem>
            </Col>
            <Col span={4} />
          </Row>
          {
            visibleChat &&
            <Card
              title={
                <div style={{ fontSize: 12 }}>
                  {translate('general.actions.discuss')}
                </div>
              }
              className="card-chatbox"
            >
              <div className="sale-order-chat-box mt-3">
                <ChatBox
                  userInfo={user as AppUser || AppUser}
                  discussionId={currentItem.rowId}
                  getMessages={storeProblemsRepository.listPost}
                  classFilter={PostFilter}
                  postMessage={storeProblemsRepository.createPost}
                  countMessages={storeProblemsRepository.countPost}
                  deleteMessage={storeProblemsRepository.deletePost}
                  attachFile={storeProblemsRepository.saveFile}
                  suggestList={storeProblemsRepository.singleListAppUser}
                />
              </div>
            </Card>
          }
        </Card>

      </ModalBody>
    </Modal>
  );
}



export default StoreProblemMonitorModal;
