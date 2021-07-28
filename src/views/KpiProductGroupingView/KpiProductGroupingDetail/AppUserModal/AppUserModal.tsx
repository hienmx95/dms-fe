import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'reactn';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiItemRepository } from 'views/KpiProductGroupingView/KpiProductGroupingRepository';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { API_KPI_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
export interface AppUserModalProps extends ModalProps {
  title: string;

  selectedList?: AppUser[];

  setSelectedList?: Dispatch<SetStateAction<AppUser[]>>;

  onSave?: (selectedList: AppUser[]) => void;

  currentKpiYear: KpiYear;

  onClose?: (selectedList: AppUser[]) => void;

  filter?: AppUserFilter;

  setFilter?: Dispatch<SetStateAction<AppUserFilter>>;

  handleFilter?: (field: string) => (f: any) => void;

  loadList?: boolean;
  setloadList?: Dispatch<SetStateAction<boolean>>;

  visible?: boolean;

  setVisible?: Dispatch<SetStateAction<boolean>>;

  kpiItemTypeId?: number;
}

function AppUserModal(props: AppUserModalProps) {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'kpi-product-grouping',
    API_KPI_PRODUCT_GROUPING_ROUTE,
  );
  const {
    selectedList,
    onSave,
    onClose,
    filter,
    setFilter,
    isOpen,
    loadList,
    setloadList,
    toggle,
    visible,
    setVisible,
  } = props;

  const {
    list,
    loading,
    total,
    handleFilter,
    handleSearch,
    handleReset,
    handleSave,
    handleClose,
  } = useModalMaster(
    filter,
    setFilter,
    loadList,
    setloadList,
    kpiItemRepository.listAppUser,
    kpiItemRepository.countAppUser,
    onSave,
    onClose,
  );

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [selectedListAppUser, setSelectedListAppUser] = React.useState<
    AppUser[]
  >(selectedList);
  React.useEffect(() => {
    if (visible) {
      setSelectedListAppUser([...selectedList]);
      setVisible(false);
    }
  }, [selectedList, selectedListAppUser, setVisible, visible]);

  const rowSelection: TableRowSelection<AppUser> = crudService.useContentModalList<
    AppUser
  >(selectedListAppUser, setSelectedListAppUser);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 70,
        render: renderMasterIndex<AppUser>(pagination),
      },

      {
        title: translate('kpiItems.appUser.username'),
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
      },
      {
        title: translate('kpiItems.appUser.displayName'),
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
      },
      {
        title: translate('kpiItems.appUser.email'),
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
      },
      {
        title: translate('kpiItems.appUser.phone'),
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
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
      className="modal-content-org"
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
                  label={translate('kpiItems.appUser.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.displayName.contain)}
                    filter={filter.displayName}
                    onChange={handleFilter(nameof(filter.displayName))}
                    placeholder={translate(
                      'kpiItems.appUser.placeholder.displayName',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('kpiItems.appUser.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.username.contain)}
                    filter={filter.username}
                    onChange={handleFilter(nameof(filter.username))}
                    placeholder={translate(
                      'kpiItems.appUser.placeholder.username',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('kpiItems.appUser.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={filter.organizationId}
                    filterType={nameof(filter.organizationId.equal)}
                    value={filter.organizationId.equal}
                    onChange={handleFilter(nameof(filter.organizationId))}
                    getList={kpiItemRepository.filterListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    placeholder={translate(
                      'kpiItems.appUser.placeholder.organization',
                    )}
                    mode="single"
                    className="w-100"
                    disabled={true}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('kpiItems.appUser.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.email.contain)}
                    filter={filter.email}
                    onChange={handleFilter(nameof(filter.email))}
                    placeholder={translate(
                      'kpiItems.appUser.placeholder.email',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('kpiItems.appUser.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.phone.contain)}
                    filter={filter.phone}
                    onChange={handleFilter(nameof(filter.phone))}
                    placeholder={translate(
                      'kpiItems.appUser.placeholder.phone',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
            {validAction('listAppUser') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleSearch}
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
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          key={list[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave(selectedListAppUser)}
          >
            <i className="fa mr-2 fa-save" />
            {translate(generalLanguageKeys.actions.save)}
          </button>

          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => handleClose(selectedListAppUser)}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

AppUserModal.defaultProps = {
  filter: new AppUserFilter(),
  loadList: false,
};

function useModalMaster(
  filter: AppUserFilter,
  setFilter: Dispatch<SetStateAction<AppUserFilter>>,
  loadList: boolean,
  setloadList: Dispatch<SetStateAction<boolean>>,
  getList: (filter: AppUserFilter) => Promise<AppUser[]>,
  getCount: (filter: AppUserFilter) => Promise<number>,
  onSave: (list: AppUser[]) => void,
  onClose: (list: AppUser[]) => void,
) {
  const [list, setList] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    let cancelled = false;
    if (loadList) {
      const fetch = async () => {
        await setLoading(true);
        const list = await getList(filter);
        const total = await getCount(filter);
        if (!cancelled) {
          await setList([...list]);
          await setTotal(total);
        }
        await setloadList(false);
        await setLoading(false);
      };
      fetch();
    }
    return () => {
      cancelled = true;
    };
  }, [filter, getCount, getList, loadList, setloadList]);

  /* handle filter appUser modal */
  const handleFilter = useCallback(
    (field: string) => {
      return f => {
        setFilter({ ...filter, [field]: f });
        setloadList(true);
      };
    },
    [filter, setFilter, setloadList],
  );

  /* handle search appUser modal */
  const handleSearch = useCallback(() => {
    setloadList(true);
  }, [setloadList]);

  /* handle reset search appUser modal */
  const handleReset = useCallback(() => {
    setFilter({
      ...new AppUserFilter(),
      organizationId: filter.organizationId,
    });
    setloadList(true);
  }, [filter.organizationId, setFilter, setloadList]);

  const handleSave = useCallback(
    (selectedList: AppUser[]) => {
      return () => {
        if (typeof onSave === 'function') {
          onSave(selectedList);
          handleReset();
        }
      };
    },
    [handleReset, onSave],
  );

  const handleClose = useCallback(
    (selectedList: AppUser[]) => {
      if (typeof onClose === 'function') {
        onClose(selectedList);
        handleReset();
      }
    },
    [handleReset, onClose],
  );

  return {
    list,
    loading,
    total,
    handleFilter,
    handleSearch,
    handleReset,
    handleSave,
    handleClose,
  };
}

export default AppUserModal;
