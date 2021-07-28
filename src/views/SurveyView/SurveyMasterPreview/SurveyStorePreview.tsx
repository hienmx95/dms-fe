import { Col, Input, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Survey/Store';
import { StoreFilter } from 'models/Survey/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { surveyRepository } from '../SurveyRepository';
import './SurveyMasterPreview.scss';
import { surveyPreiviewService } from './SurveyPreviewService';
import { v4 as uuidv4 } from 'uuid';

export interface SurveyStorePreviewIPops extends ModalProps {
  model: any;
  setModel: Dispatch<SetStateAction<any>>;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  count?: number;
  title?: string;
}

export default function SurveyStorePreview(props: SurveyStorePreviewIPops) {
  const { visible, onClose, model, setModel, title } = props;
  const [translate] = useTranslation();
  const [storeFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [
    ,
    ,
    dataSource,
    pagination,
    handleTableChange,
  ] = surveyPreiviewService.useStoreList(
    model,
    setModel,
    nameof(model.storeResults),
    storeFilter,
    setStoreFilter,
  );
  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      storeFilter[field].contain = ev.target.value.toLocaleLowerCase();
      storeFilter.skip = 0;
      setStoreFilter({
        ...storeFilter,
      });
    },
    [storeFilter],
  );

  const handleIdFilter = React.useCallback(
    (field: string) => ev => {
      storeFilter.skip = 0;
      storeFilter[field].equal = ev.equal;
      setStoreFilter({
        ...storeFilter,
      });
    },
    [storeFilter],
  );
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);
  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<Store>(),
      },
      {
        key: nameof(dataSource[0].storeCode),
        dataIndex: nameof(dataSource[0].storeCode),
        title: translate('stores.code'),
      },
      {
        key: nameof(dataSource[0].storeName),
        dataIndex: nameof(dataSource[0].storeName),
        title: translate('stores.name'),
        ellipsis: true,
      },
      {
        key: nameof(dataSource[0].organizationName),
        dataIndex: nameof(dataSource[0].organizationName),
        title: translate('stores.organization'),
      },
    ];
  }, [dataSource, translate]);

  return (
    <MasterPreview
      isOpen={visible}
      onClose={handleClose}
      size="xl"
      title={title}
      className="preview"
    >
      <Row className="row-preview">
        <Col className="pl-1" span={8}>
          <FormItem
            className="mb-0"
            label={translate('stores.code')}
            labelAlign="left"
          >
            <Input
              type="text"
              onChange={handleValueFilter(nameof(storeFilter.storeCode))}
              className="form-control form-control-sm mb-2"
              placeholder={translate('stores.placeholder.code')}
            />
          </FormItem>
        </Col>
        <Col className="pl-1" span={8}>
          <FormItem
            className="mb-0"
            label={translate('stores.name')}
            labelAlign="left"
          >
            <Input
              type="text"
              onChange={handleValueFilter(nameof(storeFilter.storeName))}
              className="form-control form-control-sm mb-2"
              placeholder={translate('stores.placeholder.name')}
            />
          </FormItem>
        </Col>

        <Col className="pl-1" span={8}>
          <FormItem
            className="mb-0"
            label={translate('stores.organization')}
            labelAlign="left"
          >
            <AdvancedTreeFilter
              filter={storeFilter.organizationId}
              filterType={nameof(storeFilter.organizationId.equal)}
              value={storeFilter.organizationId.equal}
              onChange={handleIdFilter(nameof(storeFilter.organizationId))}
              getList={surveyRepository.filterListOrganization}
              modelFilter={organizationFilter}
              setModelFilter={setOrganizationFilter}
              placeholder={translate('general.placeholder.title')}
              mode="single"
              className="mt-1"
            />
          </FormItem>
        </Col>
      </Row>
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        key={uuidv4()}
        className="ml-3"
        onChange={handleTableChange}
      />
    </MasterPreview>
  );
}
