import { Col, Form, Modal, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedIdFilter, { AdvancedIdFilterType } from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { formService } from 'core/services/FormService';
import { modalService } from 'core/services/ModalService';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import './Modal.scss';

export interface ContentModalProps<T extends Model, TFilter extends ModelFilter> extends ModalProps {
  selectedList: T[];
  setSelectedList: Dispatch<SetStateAction<T[]>>;
  modelFilterClass: new () => TFilter;
  loadList: boolean;
  setLoadList: Dispatch<SetStateAction<boolean>>;
  filter: TFilter;
  setFilter: Dispatch<SetStateAction<TFilter>>;
  model?: T;
  onSave?: (selectedList: T[]) => void;
  getList?: (storeFilter?: TFilter) => Promise<T[]>;
  count?: (storeFilter?: TFilter) => Promise<number>;
  onClose?: () => void;
}

function ChangeERouteScopeModal<T extends Model, TFilter extends ModelFilter>(props: ContentModalProps<T, TFilter>) {
  const [translate] = useTranslation();

  const {
    model,
    toggle,
    onSave,
    getList,
    count,
    onClose,
    selectedList,
    setSelectedList,
    modelFilterClass,
    loadList,
    setLoadList,
    isOpen,
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
  } = modalService.useMasterModal<T, TFilter>(
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



  const [storeTypeFilter, setStoreTypeFilter] = React.useState<StoreTypeFilter>(
    new StoreTypeFilter(),
  );

  const [storeGroupingFilter, setStoreGroupingFilter] = React.useState<
    StoreGroupingFilter
  >(new StoreGroupingFilter());

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const rowSelection: TableRowSelection<T> = crudService.useContentModalList<
    T
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
    // error comes from here
  const handleSaveModal = React.useCallback(() => {
    if (typeof onSave === 'function') {
      if (selectedList && selectedList?.length > 0) {
        onSave(selectedList);
      } else {
        onClose();
        Modal.confirm({
          content: translate('appUsers.noti.content'),

          onOk() {
            onSave(selectedList);
            handleResetFilter();
            handleClose();
          },
        });
      }
    }
  }, [handleResetFilter, onSave, selectedList, translate, handleClose, onClose]);

  const columns: ColumnProps<T>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 70,
        render: renderMasterIndex<T>(pagination),
      },
      {
        title: translate('stores.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        ellipsis: true,
      },
      {
        title: translate('stores.codeDraft'),
        key: nameof(list[0].codeDraft),
        dataIndex: nameof(list[0].codeDraft),

        ellipsis: true,
      },
      {
        title: translate('stores.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        ellipsis: true,
      },
      {
        title: translate('stores.storeGrouping'),
        key: nameof(list[0].storeGrouping),
        dataIndex: nameof(list[0].storeGrouping),
        width: 200,
        render(storeGrouping: StoreGrouping) {
          return storeGrouping?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('stores.storeType'),
        key: nameof(list[0].storeType),
        dataIndex: nameof(list[0].storeType),
        render(storeType: StoreType) {
          return storeType?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('stores.organization'),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        render(organization: Organization) {
          return organization?.name;
        },
        ellipsis: true,
      },
      {
        title: translate('stores.address1'),
        key: nameof(list[0].address),
        dataIndex: nameof(list[0].address),
        ellipsis: true,
      },
    ];
  }, [list, pagination, translate]);

  return (
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
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row className="ml-2 mr-3">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={'contain'}
                    filter={(filter as any).code}
                    onChange={handleFilter('code')}
                    placeholder={translate('stores.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.codeDraft')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={'contain'}
                    filter={(filter as any).codeDraft}
                    onChange={handleFilter('codeDraft')}
                    placeholder={translate('stores.placeholder.codeDraft')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('stores.storeGrouping')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={(filter as any).storeGroupingId}
                    filterType={'equal'}
                    value={(filter as any).storeGroupingId?.equal}
                    onChange={handleFilter('storeGroupingId')}
                    getList={appUserRepository.singleListStoreGrouping}
                    modelFilter={storeGroupingFilter}
                    setModelFilter={setStoreGroupingFilter}
                    searchField={nameof(storeGroupingFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'eRouteContents.store.placeholder.storeType',
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row className="ml-2 mr-3">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('stores.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={(filter as any).organizationId}
                    filterType={'equal'}
                    value={(filter as any).organizationId?.equal}
                    onChange={handleFilter('organizationId')}
                    getList={appUserRepository.singleListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={'contain'}
                    filter={(filter as any).name}
                    onChange={handleFilter('name')}
                    placeholder={translate('stores.placeholder.name')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-1"
                  label={translate('stores.storeType')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={(filter as any).storeTypeId}
                    filterType={'equal'}
                    value={(filter as any).storeTypeId?.equal}
                    onChange={handleFilter('storeTypeId')}
                    getList={appUserRepository.singleListStoreType}
                    modelFilter={storeTypeFilter}
                    setModelFilter={setStoreTypeFilter}
                    searchField={nameof(storeTypeFilter.name)}
                    searchType={nameof(storeTypeFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>


            </Row>
            <Row className="ml-2 mr-3">
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('stores.address1')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={'contain'}
                    filter={(filter as any).address}
                    onChange={handleFilter('address')}
                    placeholder={translate('stores.placeholder.address')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
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
          <div className="d-flex justify-content-start mt-3 mb-3 ml-2">
            <button
              className="btn btn-sm btn-primary mr-2 ml-1"
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
          </div>
        </CollapsibleCard>

        <Table
          key={list[0]?.id}
          tableLayout="fixed"
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
          className="ml-4 mr-4"
          title={() => (
            <>
              <div className="d-flex justify-content-end">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total,
                })}
              </div>
            </>
          )}
        />

        {selectedList.length <= 0 && (
          <FormItem
            validateStatus={formService.getValidationStatus<AppUser>(
              model.errors,
              nameof(model.appUserStoreMappings),
            )}
            help={model.errors?.appUserStoreMappings}
            className="noti-error"
          />
        )}

      </ModalBody>

      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          <>
            <button className="btn btn-sm btn-primary" onClick={handleSaveModal}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </>

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
  );
}

export default ChangeERouteScopeModal;
