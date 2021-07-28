import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter, { AdvancedIdFilterType } from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_E_ROUTE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { modalService } from 'core/services/ModalService';
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
import { eRouteRepository } from 'views/ERouteView/ERouteRepository';

export interface ERouteContentStoreMappingModalIProps extends ModalProps {
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
  saleEmployeeId?: number;
}

export default function ERouteContentStoreMappingModal(
  props: ERouteContentStoreMappingModalIProps,
) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('e-route', API_E_ROUTE_ROUTE);
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

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
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

  const handleResetAllFilter = React.useCallback(() => {
    const newFilter = new StoreFilter();
    newFilter.saleEmployeeId.equal = props?.saleEmployeeId;
    setFilter({ ...newFilter, skip: 0 });
    handleSearch();
  }, [props, setFilter, handleSearch]);
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
        title: translate('eRouteContents.store.code'),
        render(...[, store]) {
          return store?.code;
        },
      },
      {
        key: nameof(list[0].codeDraft),
        dataIndex: nameof(list[0].codeDraft),
        title: translate('eRouteContents.store.codeDraft'),
        render(...[, store]) {
          return store?.codeDraft;
        },
      },
      {
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        title: translate('eRouteContents.store.name'),
        ellipsis: true,
        render(...[, store]) {
          return store?.name;
        },
      },
      {
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        title: translate('eRouteContents.store.address'),
        ellipsis: true,
        render(...[, store]) {
          return store?.address;
        },
      },
      {
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        title: translate('eRouteContents.store.organization'),
        render(...[, store]) {
          return store?.organization?.name;
        },
      },
      {
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        title: translate('eRouteContents.store.storeType'),
        render(...[, store]) {
          return store?.storeType?.name;
        },
      },
      {
        key: nameof(list[0].hasEroute),
        dataIndex: nameof(list[0].hasEroute),
        title: translate('eRouteContents.store.status'),
        render(hasEroute: string) {
          return hasEroute ? (
            <span>{translate('eRouteContents.store.eroute')}</span>
          ) : (
              <span>{translate('eRouteContents.store.notEroute')}</span>
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
                  label={translate('eRouteContents.store.codeDraft')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.codeDraft.contain)}
                    filter={filter.code}
                    onChange={handleFilter('codeDraft')}
                    placeholder={translate(
                      'eRouteContents.store.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteContents.store.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter('name')}
                    placeholder={translate(
                      'eRouteContents.store.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('singleListOrganization') && (
                <Col className="pl-1" span={8}>
                  <FormItem
                    className="mb-0"
                    label={translate('eRouteContents.store.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter('organizationId')}
                      getList={eRouteRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      placeholder={translate('general.placeholder.title')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('eRouteContents.store.address')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.address.contain)}
                    filter={filter.address}
                    onChange={handleFilter('address')}
                    placeholder={translate(
                      'eRouteContents.store.placeholder.address',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('singleListStoreType') && (
                <Col className="pl-1" span={8}>
                  <FormItem
                    className="mb-0"
                    label={translate('eRouteContents.store.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilter('storeTypeId')}
                      getList={eRouteRepository.singleListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFiler}
                      searchField={nameof(setStoreTypeFiler.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate(
                        'eRouteContents.store.placeholder.storeType',
                      )}
                    />
                  </FormItem>
                </Col>
              )}
              <Col className="pl-1" span={8}>
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
                  onClick={handleResetAllFilter}
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
          <button className="btn btn-sm btn-primary" onClick={() => handleSave(selectedList)}>
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
