import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalProps } from 'reactstrap';
import Card from 'antd/lib/card';
import { AlbumTableData } from 'models/monitor/AlbumMonitor';
import { Col, Row } from 'antd/lib/grid';
import FormItem from 'antd/lib/form/FormItem';
import { formatDateTime } from 'core/helpers/date-time';

export interface AlbumMonitorModalProps extends ModalProps {
  isOpen?: boolean;
  item?: AlbumTableData;
  setItem?: Dispatch<SetStateAction<AlbumTableData>>;
  onClose?: () => void;
  onSave?: (id: number) => () => void;
}
function AlbumMonitorModal(props: AlbumMonitorModalProps) {
  const [translate] = useTranslation();
  const { toggle, isOpen, item } = props;
  return (
    <Modal size="m" unmountOnClose={true} toggle={toggle} isOpen={isOpen}>
      <ModalBody>
        <Card>
          {/* image */}
          <Row className="mb-2">
            <Col span={24}>
              <img src={item?.url} alt="noimage" />
            </Col>
          </Row>
          {/* store */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.store')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {item?.storeName}
                </span>
              </FormItem>
            </Col>
          </Row>
          {/* delivery Address */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.deliveryAddress')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {item?.deliveryAddress}
                </span>
              </FormItem>
            </Col>
          </Row>
          {/* delivery shooting */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.deliveryAddress')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {item?.deliveryAddress}
                </span>
              </FormItem>
            </Col>
          </Row>
          {/* employee */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.creatorName')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {item?.creatorName}
                </span>
              </FormItem>
            </Col>
          </Row>
          {/* shootingAt */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.shootingAt')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {formatDateTime(item?.shootingAt)}
                </span>
              </FormItem>
            </Col>
          </Row>
          {/* shootingAt */}
          <Row className="mb-2">
            <Col span={6}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {translate('albumMonitors.shootingAt')}
                </span>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem>
                <span className="label-input mr-3 text-right">
                  {formatDateTime(item?.shootingAt)}
                </span>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </ModalBody>
    </Modal>
  );
}

export default AlbumMonitorModal;
