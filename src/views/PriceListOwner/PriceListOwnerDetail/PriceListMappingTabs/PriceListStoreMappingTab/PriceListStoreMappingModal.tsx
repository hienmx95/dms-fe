import { Col, Form, Row } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { ModalBody, ModalFooter } from 'reactstrap/lib';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import nameof from 'ts-nameof.macro';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import { PriceList } from 'models/priceList/PriceList';
import { IdFilter, StringFilter } from 'core/filters';
import { priceListOwnerService } from 'views/PriceListOwner/PriceListOwnerService';
import { priceListOwnerRepository } from 'views/PriceListOwner/PriceListOwnerRepository';

const { Item: FormItem } = Form;

export interface PriceListStoreMappingModalProps extends ModalProps {
  model?: PriceList;
  loadList?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
  onSave?: (list: Store[]) => void;
  onClose?: () => void;
  selectedList?: Store[];
  setSelectedList?: Dispatch<SetStateAction<Store[]>>;
}

export default function PriceListStoreMappingModal(
  props: PriceListStoreMappingModalProps,
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
    model,
  } = props;
  const firstLoad = useRef<boolean>(true);

  const defaultState = useMemo(
    () => ({
      list: [],
      filter: new StoreFilter(),
      loading: false,
    }),
    [],
  );

  const customFilter = useCallback(
    (filter: StoreFilter) => {
      if (loadList && firstLoad.current) {
        firstLoad.current = false;
        return {
          ...filter,
          organizationId: { ...new IdFilter(), equal: model?.organizationId },
        };
      }
      return filter;
    },
    [loadList, model],
  );

  const {
    translate,
    handleSave,
    handleClose,
    loading,
    list,
    filter,
    isReset,
    setIsReset,
    handleFilter,
    handleDefaultSearch,
    handleReset,
    rowSelection,
    pagination,
    handleTableChange,
  } = priceListOwnerService.usePriceListMappingModal<Store, StoreFilter>(
    StoreFilter,
    loadList,
    setLoadList,
    onSave,
    onClose,
    priceListOwnerRepository.listStore,
    priceListOwnerRepository.countStore,
    defaultState,
    selectedList,
    setSelectedList,
    customFilter,
    firstLoad,
  );

  const {
    orgUnitFilter,
    setOrganizationFilter,
    storeTypeFilter,
    setStoreTypeFilter,
  } = useModalFilter(model);

  const columns: ColumnProps<Store>[] = useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Store>(pagination),
      },
      {
        title: translate('priceLists.store.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        render(code: string) {
          return code;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.store.codeDraft'),
        key: nameof(list[0].codeDraft),
        dataIndex: nameof(list[0].codeDraft),
        render(codeDraft: string) {
          return codeDraft;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.store.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        render(name: string) {
          return name;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.store.address'),
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        render(address: string) {
          return address;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.store.storeType'),
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        render(storeType: StoreType) {
          return storeType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('priceLists.store.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        render(organization: Organization) {
          return organization?.name;
        },
        ellipsis: true,
      },
    ],
    [list, pagination, translate],
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
            title={translate('priceLists.priceListStoreMappingModal')}
          >
            <Form>
              <Row className="ml-2 mr-3">
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.code')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.code.contain)}
                      filter={filter.code}
                      onChange={handleFilter(nameof(filter.code))}
                      placeholder={translate(
                        'priceLists.store.placeholder.code',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.codeDraft')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.codeDraft.contain)}
                      filter={filter.codeDraft}
                      onChange={handleFilter(nameof(filter.codeDraft))}
                      placeholder={translate(
                        'priceLists.store.placeholder.code',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row className="ml-2 mr-3">
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={priceListOwnerRepository.singleListOrganization}
                      modelFilter={orgUnitFilter}
                      setModelFilter={setOrganizationFilter}
                      mode="single"
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.name')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.name.contain)}
                      filter={filter.name}
                      onChange={handleFilter(nameof(filter.name))}
                      placeholder={translate(
                        'priceLists.store.placeholder.name',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row className="ml-2 mr-3">
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.address')}
                    labelAlign="left"
                  >
                    <AdvancedStringFilter
                      filterType={nameof(filter.address.contain)}
                      filter={filter.address}
                      onChange={handleFilter(nameof(filter.address))}
                      placeholder={translate(
                        'priceLists.store.placeholder.address',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      className="w-100"
                    />
                  </FormItem>
                </Col>
                <Col span={2} />
                <Col className="pl-1" span={11}>
                  <FormItem
                    className="mb-0"
                    label={translate('priceLists.store.storeType')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.storeTypeId}
                      filterType={nameof(filter.storeTypeId.equal)}
                      value={filter.storeTypeId.equal}
                      onChange={handleFilter(nameof(filter.storeTypeId))}
                      getList={priceListOwnerRepository.singleListStoreType}
                      modelFilter={storeTypeFilter}
                      setModelFilter={setStoreTypeFilter}
                      searchField={nameof(storeTypeFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className="d-flex justify-content-end mt-3 mb-3 ml-2">
              <button
                className="btn btn-sm btn-primary mr-2 ml-1"
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
            bordered={false}
            dataSource={list}
            columns={columns}
            size="small"
            tableLayout="fixed"
            loading={loading}
            rowKey={nameof(list[0].id)}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={handleTableChange}
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end mt-4 mr-3">
            {/* saveModal */}
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
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

function useModalFilter(model: PriceList) {
  const [organizationFilter, setOrganizationFilter] = useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const orgUnitFilter = useMemo(
    () => ({
      ...organizationFilter,
      path: {
        ...new StringFilter(),
        startWith: model?.organization?.path,
      },
    }),
    [model, organizationFilter],
  );

  const [storeTypeFilter, setStoreTypeFilter] = useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );
  return {
    orgUnitFilter,
    organizationFilter,
    setOrganizationFilter,
    storeTypeFilter,
    setStoreTypeFilter,
  };
}

PriceListStoreMappingModal.defaultProps = {
  loadList: false,
  selectedList: [],
};
