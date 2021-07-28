import React, { Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { Form, Row, Col } from 'antd';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import { ModalBody, ModalFooter } from 'reactstrap/lib';

import {
  PriceListItemHistory,
  PriceListItemHistoryFilter,
} from 'models/priceList/PriceList';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import AdvancedDateFilter from 'components/AdvancedDateFilter/AdvancedDateFilter';
import Table, { ColumnProps } from 'antd/lib/table';
import { formatDateTime } from 'core/helpers/date-time';
import { Moment } from 'moment';
import { formatNumber } from 'core/helpers/number';
import { AppUser } from 'models/AppUser';
import nameof from 'ts-nameof.macro';
import { IdFilter } from 'core/filters';
import { priceListOwnerRepository } from 'views/PriceListOwner/PriceListOwnerRepository';
import { PriceListMappingModalState, priceListOwnerService } from 'views/PriceListOwner/PriceListOwnerService';

export interface PriceListItemHistoryModalProps extends ModalProps {
  modelId: number;
  itemId?: number;
  loadList?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  selectedList?: PriceListItemHistory[];
  setSelectedList?: Dispatch<SetStateAction<PriceListItemHistory[]>>;
}

type PriceListStoreMappingModalState = PriceListMappingModalState<
  PriceListItemHistory,
  PriceListItemHistoryFilter
>;

export default function PriceListItemHistoryModal(
  props: PriceListItemHistoryModalProps,
) {
  const {
    isOpen,
    toggle,
    loadList,
    setLoadList,
    onSave,
    onClose,
    selectedList,
    setSelectedList,
    modelId,
    itemId,
  } = props;

  const defaultState = useMemo(
    () => ({
      list: [],
      filter: {
        ...new PriceListItemHistoryFilter(),
        priceListId: { ...new IdFilter(), equal: modelId },
      },
      loading: false,
    }),
    [modelId],
  );

  const historyFilter = useCallback(
    (filter: PriceListItemHistoryFilter) => ({
      ...filter,
      priceListId: { ...new IdFilter(), equal: modelId },
      itemId: { ...new IdFilter(), equal: itemId },
    }),
    [itemId, modelId],
  );

  const {
    translate,
    handleClose,
    loading,
    list,
    filter,
    handleFilter,
    pagination,
    handleTableChange,
  } = priceListOwnerService.usePriceListMappingModal<
    PriceListItemHistory,
    PriceListItemHistoryFilter
  >(
    PriceListItemHistoryFilter,
    loadList,
    setLoadList,
    onSave,
    onClose,
    priceListOwnerRepository.listPriceListItemHistory,
    priceListOwnerRepository.countPriceListItemHistory,
    defaultState,
    selectedList,
    setSelectedList,
    historyFilter,
  );

  const columns: ColumnProps<PriceListItemHistory>[] = useMemo(
    () => [
      {
        title: translate('priceLists.history.updateAt'),
        key: nameof(list[0].updateAt),
        dataIndex: nameof(list[0].updateAt),
        width: 200,
        render(updateAt: Moment) {
          return formatDateTime(updateAt);
        },
        ellipsis: true,
      },
      {
        title: (
          <div className="text-right">
            {translate('priceLists.history.oldPrice')}
          </div>
        ),
        key: nameof(list[0].oldPrice),
        dataIndex: nameof(list[0].oldPrice),
        width: 200,
        render(oldPrice: number) {
          return <div className={'text-right'}>{formatNumber(oldPrice)}</div>;
        },
        ellipsis: true,
      },
      {
        title: () => (
          <div className="text-right">
            {translate('priceLists.history.newPrice')}
          </div>
        ),
        key: nameof(list[0].newPrice),
        dataIndex: nameof(list[0].newPrice),
        width: 200,
        render(newPrice: number) {
          return <div className={'text-right'}>{formatNumber(newPrice)}</div>;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.history.modifier'),
        key: nameof(list[0].modifier),
        dataIndex: nameof(list[0].modifier),
        width: 200,
        render(modifier: AppUser) {
          return modifier?.displayName;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.history.source'),
        key: nameof(list[0].source),
        dataIndex: nameof(list[0].source),
        width: 200,
        render(source: string) {
          return source;
        },
        ellipsis: true,
      },
    ],
    [list, translate],
  );

  return (
    <>
      <ModalContent
        size="xl"
        isOpen={isOpen}
        backdrop="static"
        toggle={toggle}
        unmountOnClose={true}
      >
        <ModalBody>
          <CollapsibleCard
            className="head-borderless mb-3"
            title={translate('priceLists.priceListHistoryModal')}
          >
            <Form>
              <Row className="mr-3">
                <Col span={11}>
                  <AdvancedDateFilter
                    filter={filter.updatedAt}
                    filterType={nameof(filter.updatedAt.greaterEqual)}
                    onChange={handleFilter(nameof(filter.updatedAt))}
                    className="w-100"
                    placeholder={translate('banners.placeholder.createAt')}
                  />
                </Col>
              </Row>
            </Form>
          </CollapsibleCard>
          <Table
            bordered={false}
            dataSource={list}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(list[0].id)}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            {/* closeModal */}
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleClose}
            >
              <i className="fa mr-2 fa-times-circle" />
              {translate(generalLanguageKeys.actions.cancel)}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </>
  );
}
