import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter, {
  AdvancedIdFilterType,
} from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { modalService } from 'core/services/ModalService';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { storeRepository } from '../../../StoreView/StoreRepository';
import { API_STORE_ROUTE } from 'config/api-consts';
export interface StoreModalIProps extends ModalProps {
  selectedList: Store[];
  setSelectedList: Dispatch<SetStateAction<Store[]>>;
  modelFilterClass: new () => StoreFilter;
  filter: StoreFilter;
  setFilter: Dispatch<SetStateAction<StoreFilter>>;
  loadList: boolean;
  setLoadList: Dispatch<SetStateAction<boolean>>;
  onSave?: (selectedList: Store[]) => void;
  getList?: (storeFilter?: StoreFilter) => Promise<Store[]>;
  count?: (storeFilter?: StoreFilter) => Promise<number>;
  onClose?: () => void;
}

export default function StoreModal(props: StoreModalIProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'showing-order',
    API_SHOWING_ORDER_ROUTE,
  );

  const { validAction: validActionStore } = crudService.useAction(
    'store',
    API_STORE_ROUTE,
  );
  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    modelFilterClass,
    loadList,
    setLoadList,
    onSave,
    getList,
    count,
    onClose,
    filter,
    setFilter,
  } = props;

  const {
    total,
    handleSearch,
    list,
    handleFilter,
    handleResetFilter,
    handleDefaultSearch,
    isReset,
    setIsReset,
    loading,
    handleClose,
    handleSave,
  } = modalService.useMasterModal<Store, StoreFilter>(
    modelFilterClass,
    filter,
    setFilter,
    getList,
    count,
    loadList,
    setLoadList,
    onSave,
    onClose,
  );

  const [storeTypeFilter, setStoreTypeFiler] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const rowSelection: TableRowSelection<Store> = crudService.useContentModalList<
    Store
  >(selectedList, setSelectedList);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const idFilterEnum = React.useMemo(
    () => [
      { id: 1, name: translate('general.placeholder.title') },
      { id: 2, name: translate('general.actions.filterSelected') },
      { id: 3, name: translate('general.actions.filterUnSelected') },
    ],
    [translate],
  ); // enum List

  const selectedIds = React.useMemo(
    () => (selectedList.length > 0 ? selectedList.map(item => item.id) : []),
    [selectedList],
  );
  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 80,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        title: translate('showingOrders.stores.codeDraft'),
      },
      {
        key: nameof(list[0].codeDraft),
        dataIndex: nameof(list[0].codeDraft),
        title: translate('showingOrders.stores.code'),
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('showingOrders.stores.name'),
        ellipsis: true,
        render(...[, store]) {
          return store?.name;
        },
      },
      {
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        title: translate('showingOrders.stores.address'),
        ellipsis: true,
        render(...[, store]) {
          return store?.address;
        },
      },
      {
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        title: translate('showingOrders.stores.organization'),
        render(organization) {
          return organization?.name;
        },
      },
      {
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        title: translate('showingOrders.stores.storeType'),
        render(storeType) {
          return storeType?.name;
        },
      },
      {
        key: nameof(list[0].storeGrouping),
        dataIndex: nameof(list[0].storeGrouping),
        title: translate('showingOrders.stores.storeGrouping'),
        render(storeGrouping) {
          return storeGrouping?.name;
        },
      },
    ];
  }, [list, pagination, translate]);
  return (
    <Modal
      size="xl"
      unmountOnClose={true}
      backdrop="static"
      toggle={toggle}
      isOpen={isOpen}
    >
      <ModalBody>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrders.stores.codeDraft')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter('code')}
                    placeholder={translate(
                      'showingOrders.stores.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrders.stores.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.codeDraft.contain)}
                    filter={filter.codeDraft}
                    onChange={handleFilter('codeDraft')}
                    placeholder={translate(
                      'showingOrders.stores.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrders.stores.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter('name')}
                    placeholder={translate(
                      'showingOrders.stores.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('showingOrders.stores.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.address.contain)}
                    filter={filter.address}
                    onChange={handleFilter('address')}
                    placeholder={translate(
                      'showingOrders.stores.placeholder.address',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validActionStore('singleListStoreType') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('showingOrders.stores.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilter('storeTypeId')}
                      getList={storeRepository.singleListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFiler}
                      searchField={nameof(setStoreTypeFiler.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'showingOrders.stores.placeholder.storeType',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              {validActionStore('singleListStoreGrouping') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('showingOrders.stores.storeGrouping')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeGroupingId}
                      filterType={nameof(filter.storeGroupingId.equal)}
                      value={filter.storeGroupingId.equal}
                      onChange={handleFilter('storeGroupingId')}
                      getList={storeRepository.singleListStoreGrouping}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFiler}
                      searchField={nameof(setStoreTypeFiler.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'showingOrders.stores.placeholder.storeGrouping',
                      )}
                    />
                  </FormItem>
                </Col>
              )}

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('general.selection')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={(filter as any).id}
                    onChange={handleFilter('id')}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    type={AdvancedIdFilterType.SELECTION}
                    selectedIds={selectedIds}
                    list={idFilterEnum}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          {/* button area */}
          <div className="d-flex justify-content-start mt-3 mb-3 ml-1">
            {validAction('listStore') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleResetFilter}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
          className="ml-3"
        />
        <div className=" d-flex justify-content-end mt-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleSave(selectedList)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={handleClose}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
