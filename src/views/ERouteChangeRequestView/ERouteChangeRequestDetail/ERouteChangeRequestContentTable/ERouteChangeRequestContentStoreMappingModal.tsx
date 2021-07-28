import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, {
  ColumnProps,
  PaginationConfig,
  TableRowSelection,
} from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteChangeRequestService } from 'views/ERouteChangeRequestView/ERouteChangeRequestService';
import { eRouteChangeRequestRepository } from 'views/ERouteChangeRequestView/ERouteChangeRequestRepository';
export interface ERouteContentStoreMappingModalIProps<T extends Model>
  extends ModalProps {
  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[]) => () => void;

  currentItem?: any;

  total?: number;

  getList?: (storeFilter?: StoreFilter) => Promise<Store[]>;

  count?: (storeFilter?: StoreFilter) => Promise<number>;

  onClose?: () => void;
}

export default function ERouteChangeRequestContentStoreMappingModal<
  T extends Model
>(props: ERouteContentStoreMappingModalIProps<T>) {
  const [translate] = useTranslation();
  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    onSave,
    getList,
    count,
    onClose,
  } = props;

  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [listStore, setListStore] = React.useState<Store[]>([]);
  const [totalStore, setTotal] = React.useState<number>(0);
  const [organizationFilter, setOriganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [storeTypeFilter, setStoreTypeFiler] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );
  const [selectedStores, setSelectedStores] = React.useState<T[]>([]);

  const [
    filterStore,
    setFilerStore,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = eRouteChangeRequestService.useStoreContentMaster(getList, count);

  React.useEffect(() => {
    setListStore(list);
    setTotal(totalStore);
    setLoading(false);
  }, [setLoading, list, totalStore]);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterStore,
    setFilerStore,
    total,
    handleSearch,
  );

  React.useEffect(() => {
    if (selectedList) {
      if (selectedList.length > 0) {
        const selected = selectedList.map((item: any) => item?.store);
        setSelectedStores([...selected]);
      } else {
        setSelectedStores([]);
      }
    }
  }, [selectedList, setSelectedList]);

  const rowSelection: TableRowSelection<Store> = crudService.useContentModalList<
    T
  >(selectedStores, setSelectedStores);

  const handleChangeFilter = React.useCallback(() => {
    filterStore.skip = 0;
    Promise.all([getList(filterStore), count(filterStore)])
      .then(([listStore, totalStore]) => {
        setListStore(listStore);
        setTotal(totalStore);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filterStore, getList, count, handleSearch, setLoading]);

  const handleReset = React.useCallback(() => {
    const newFilter = new StoreFilter();
    setFilerStore(newFilter);
    setListStore(list);
    setIsReset(true);
    handleSearch();
  }, [setFilerStore, list, handleSearch, setListStore]);
  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);
  const columns: ColumnProps<Store>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        title: translate('eRouteChangeRequestContents.store.code'),
        render(...[, store]) {
          return store?.code;
        },
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('eRouteChangeRequestContents.store.name'),
        ellipsis: true,
        render(...[, store]) {
          return store?.name;
        },
      },
      {
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        title: translate('eRouteChangeRequestContents.store.address'),
        ellipsis: true,
        render(...[, store]) {
          return store?.address;
        },
      },
      {
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        title: translate('eRouteChangeRequestContents.store.organization'),
        render(...[, store]) {
          return store?.organization?.name;
        },
      },
      {
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        title: translate('eRouteChangeRequestContents.store.storeType'),
        render(...[, store]) {
          return store?.storeType?.name;
        },
      },
      {
        key: nameof(list[0].hasEroute),
        dataIndex: nameof(list[0].hasEroute),
        title: translate('eRouteChangeRequestContents.store.status'),
        render(hasEroute: boolean) {
          return hasEroute ? (
            <span>
              {translate('eRouteChangeRequestContents.store.hasEroute')}
            </span>
          ) : (
            <span>
              {translate('eRouteChangeRequestContents.store.notEroute')}
            </span>
          );
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
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequestContents.store.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.code.contain)}
                    filter={filterStore.code}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'eRouteChangeRequestContents.store.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequestContents.store.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.name.contain)}
                    filter={filterStore.name}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'eRouteChangeRequestContents.store.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate(
                    'eRouteChangeRequestContents.store.organization',
                  )}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterStore.organizationId}
                    filterType={nameof(filterStore.organizationId.equal)}
                    value={filterStore.organizationId.equal}
                    onChange={handleChangeFilter}
                    getList={
                      eRouteChangeRequestRepository.singleListOrganization
                    }
                    modelFilter={organizationFilter}
                    setModelFilter={setOriganizationFilter}
                    searchField={nameof(organizationFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'eRouteChangeRequestContents.store.placeholder.organization',
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteChangeRequestContents.store.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterStore.address.contain)}
                    filter={filterStore.address}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'eRouteChangeRequestContents.store.placeholder.address',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate(
                    'eRouteChangeRequestContents.store.storeType',
                  )}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filterStore.storeTypeId}
                    filterType={nameof(filterStore.storeTypeId.equal)}
                    value={filterStore.storeTypeId.equal}
                    onChange={handleChangeFilter}
                    getList={eRouteChangeRequestRepository.singleListStoreType}
                    modelFilter={storeTypeFilter}
                    setModelFilter={setStoreTypeFiler}
                    searchField={nameof(setStoreTypeFiler.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'eRouteChangeRequestContents.store.placeholder.storeType',
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          {/* button area */}
          <div className="d-flex justify-content-start mt-3 mb-3 ml-1">
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
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listStore}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listStore[0].id)}
          onChange={handleTableChange}
          className="ml-3"
        />
        <div className=" d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={onSave(selectedStores)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => onClose()}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
