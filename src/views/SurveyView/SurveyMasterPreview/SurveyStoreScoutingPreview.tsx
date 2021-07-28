import { Col, Input, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreScouting } from 'models/Survey/StoreScouting';
import { StoreScoutingFilter } from 'models/Survey/StoreScoutingFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import { surveyRepository } from '../SurveyRepository';
import './SurveyMasterPreview.scss';
import { surveyPreiviewService } from './SurveyPreviewService';

export interface SurveyStoreScoutingPreviewIPops extends ModalProps {
  model: any;
  setModel: Dispatch<SetStateAction<any>>;
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  count?: number;
  title?: string;
}

export default function SurveyStoreScoutingPreview(
  props: SurveyStoreScoutingPreviewIPops,
) {
  const { visible, onClose, model, setModel, title } = props;
  const [translate] = useTranslation();
  const [storeScoutingFilter, setStoreScoutingFilter] = React.useState<
    StoreScoutingFilter
  >(new StoreScoutingFilter());

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [
    ,
    ,
    dataSource,
    pagination,
    handleTableChange,
  ] = surveyPreiviewService.useStoreScoutingList(
    model,
    setModel,
    nameof(model.storeScoutingResults),
    storeScoutingFilter,
    setStoreScoutingFilter,
  );
  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      storeScoutingFilter[field].contain = ev.target.value.toLocaleLowerCase();
      storeScoutingFilter.skip = 0;
      setStoreScoutingFilter({
        ...storeScoutingFilter,
      });
    },
    [storeScoutingFilter],
  );

  const handleIdFilter = React.useCallback(
    (field: string) => ev => {
      storeScoutingFilter.skip = 0;
      storeScoutingFilter[field].equal = ev.equal;
      setStoreScoutingFilter({
        ...storeScoutingFilter,
      });
    },
    [storeScoutingFilter],
  );
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);
  const columns: ColumnProps<StoreScouting>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<StoreScouting>(),
      },
      {
        key: nameof(dataSource[0].storeScoutingCode),
        dataIndex: nameof(dataSource[0].storeScoutingCode),
        title: translate('storeScoutings.code'),
      },
      {
        key: nameof(dataSource[0].storeScoutingName),
        dataIndex: nameof(dataSource[0].storeScoutingName),
        title: translate('storeScoutings.name'),
        ellipsis: true,
      },
      {
        key: nameof(dataSource[0].organizationName),
        dataIndex: nameof(dataSource[0].organizationName),
        title: translate('storeScoutings.organization'),
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
            label={translate('storeScoutings.code')}
            labelAlign="left"
          >
            <Input
              type="text"
              onChange={handleValueFilter(
                nameof(storeScoutingFilter.storeScoutingCode),
              )}
              className="form-control form-control-sm mb-2"
              placeholder={translate('storeScoutings.placeholder.code')}
            />
          </FormItem>
        </Col>
        <Col className="pl-1" span={8}>
          <FormItem
            className="mb-0"
            label={translate('storeScoutings.name')}
            labelAlign="left"
          >
            <Input
              type="text"
              onChange={handleValueFilter(
                nameof(storeScoutingFilter.storeScoutingName),
              )}
              className="form-control form-control-sm mb-2"
              placeholder={translate('storeScoutings.placeholder.name')}
            />
          </FormItem>
        </Col>

        <Col className="pl-1" span={8}>
          <FormItem
            className="mb-0"
            label={translate('storeScoutings.organization')}
            labelAlign="left"
          >
            <AdvancedTreeFilter
              filter={storeScoutingFilter.organizationId}
              filterType={nameof(storeScoutingFilter.organizationId.equal)}
              value={storeScoutingFilter.organizationId.equal}
              onChange={handleIdFilter(
                nameof(storeScoutingFilter.organizationId),
              )}
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
