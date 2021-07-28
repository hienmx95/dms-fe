import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, {
  ColumnProps,
  RowSelectionType,
  TableRowSelection,
} from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { indirectSalesOrderRepository } from 'views/IndirectSalesOrderView/IndirectSalesOrderRepository';
import { indirectSalesOrderService } from 'views/IndirectSalesOrderView/IndirectSalesOrderService';

export interface ContentModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList?: T[];

  setSelectedList?: Dispatch<SetStateAction<T[]>>;

  list?: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  onSave?: (selectedList: T[]) => void;

  currentItem?: any;

  total?: number;

  getList?: (storetFilter?: StoreFilter) => Promise<Store[]>;

  count?: (storeFilter?: StoreFilter) => Promise<number>;

  onClose?: (currentItem) => void;

  resetFilter?: boolean;

  setResetFilter?: Dispatch<SetStateAction<boolean>>;
  saleEmployeeId?: any;
}

function StoreModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    title,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    getList,
    count,
    onClose,
    resetFilter,
    setResetFilter,
    saleEmployeeId,
  } = props;

  const [listStore, setListStore] = React.useState<Store[]>([]);

  const [totalStore, setTotal] = React.useState<number>(0);

  const [isReset, setIsReset] = React.useState<boolean>(false);

  const [
    filterStore,
    setFilterStore,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
    setLoadList,
  ] = indirectSalesOrderService.useStoreContentMaster(
    getList,
    count,
    saleEmployeeId,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterStore,
    setFilterStore,
    total,
    handleSearch,
  );

  const handleChangeFilter = React.useCallback(
    (field: string) => {
      return event => {
        filterStore.skip = 0;
        filterStore.saleEmployeeId.equal = saleEmployeeId;
        filterStore[field] = event;
        setFilterStore({ ...filterStore });
        setLoadList(true);
        setLoading(true);
      };
    },
    [setFilterStore, saleEmployeeId, filterStore, setLoadList, setLoading],
  );
  React.useEffect(() => {
    setListStore(list);
    setTotal(totalStore);
    setLoading(false);
    if (resetFilter) {
      setFilterStore(new StoreFilter());
      setResetFilter(false);
    }
  }, [
    setListStore,
    setTotal,
    list,
    setLoading,
    totalStore,
    setFilterStore,
    setResetFilter,
    resetFilter,
    handleChangeFilter,
  ]);

  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const rowSelectionType: RowSelectionType = 'radio';

  const rowSelection: TableRowSelection<Store> = {
    type: rowSelectionType,
    selectedRowKeys: selectedList?.map((t: T) => t?.id),
    onSelect: (record: T, selected: boolean) => {
      if (selected) {
        const selectedItem = [record];
        setSelectedList(selectedItem);
      }
    },
  };

  const handleDefaultSearch = React.useCallback(() => {
    setLoadList(true);
  }, [setLoadList]);

  const handleReset = React.useCallback(() => {
    const newFilter = new StoreFilter();
    setFilterStore(newFilter);
    setListStore(list);
    setIsReset(true);
    handleSearch();
  }, [list, setFilterStore, setListStore, handleSearch]);

  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 60,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        title: translate('indirectSalesOrders.stores.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate('indirectSalesOrders.stores.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrders.stores.address'),
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        width: 250,
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrders.stores.telephone'),
        key: nameof(list[0].telephone),
        dataIndex: nameof(list[0].telephone),
      },
      {
        title: translate('indirectSalesOrders.stores.storeGrouping'),
        key: nameof(list[0].storeGrouping),
        dataIndex: nameof(list[0].storeGrouping),
        render(storeGrouping: StoreGrouping) {
          return storeGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('indirectSalesOrders.stores.storeType'),
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        render(storeType: StoreType) {
          return storeType?.name;
        },
        ellipsis: true,
      },
    ];
  }, [list, pagination, translate]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      <ModalHeader>{title}</ModalHeader>
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
                  label={translate('indirectSalesOrders.stores.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.code.contain)}
                    filter={filterStore.code}
                    onChange={handleChangeFilter(nameof(filterStore.code))}
                    placeholder={translate(
                      'indirectSalesOrders.stores.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.name.contain)}
                    filter={filterStore.name}
                    onChange={handleChangeFilter(nameof(filterStore.name))}
                    placeholder={translate(
                      'indirectSalesOrders.stores.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.storeGrouping')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterStore.storeGroupingId}
                    filterType={nameof(filterStore.storeGroupingId.equal)}
                    value={filterStore.storeGroupingId.equal}
                    onChange={handleChangeFilter(
                      nameof(filterStore.storeGroupingId),
                    )}
                    getList={
                      indirectSalesOrderRepository.singleListStoreGrouping
                    }
                    modelFilter={storeGroupingFilter}
                    setModelFilter={setStoreGroupingFilter}
                    searchField={nameof(storeGroupingFilter.name)}
                    searchType={nameof(storeGroupingFilter.name.contain)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('indirectSalesOrders.storeType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterStore.storeTypeId}
                    filterType={nameof(filterStore.storeTypeId.equal)}
                    value={filterStore.storeTypeId.equal}
                    onChange={handleChangeFilter(
                      nameof(filterStore.storeTypeId),
                    )}
                    getList={indirectSalesOrderRepository.singleListStoreType}
                    modelFilter={storeTypeFilter}
                    setModelFilter={setStoreTypeFilter}
                    searchField={nameof(storeTypeFilter.name)}
                    searchType={nameof(storeTypeFilter.name.contain)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('eRoutes.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filterStore.organizationId}
                    filterType={nameof(filterStore.organizationId.equal)}
                    value={filterStore.organizationId.equal}
                    onChange={handleChangeFilter(
                      nameof(filterStore.organizationId),
                    )}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    getList={
                      indirectSalesOrderRepository.filterListOrganization
                    }
                    searchField={nameof(organizationFilter.name)}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleDefaultSearch}
            >
              <i className="tio-filter_outlined mr-2" />
              {translate(generalLanguageKeys.actions.filter)}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleReset}
            >
              <i className="tio-clear_circle_outlined mr-2" />
              {translate(generalLanguageKeys.actions.reset)}
            </button>
          </div>
        </CollapsibleCard>

        <Table
          key={listStore[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listStore}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listStore[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onSave(selectedList)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => onClose(currentItem)}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default StoreModal;
