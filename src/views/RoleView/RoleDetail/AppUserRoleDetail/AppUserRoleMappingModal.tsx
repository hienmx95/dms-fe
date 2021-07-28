import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { tableService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal, ModalBody, ModalProps } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';

export interface AppUserRoleMappingModalProps extends ModalProps {
  loading: boolean;
  modelFilter: AppUserFilter;
  setModelFilter: Dispatch<SetStateAction<AppUserFilter>>;
  rowSelection: TableRowSelection<AppUser>;
  list: AppUser[];
  getList: (filter: AppUserFilter) => Promise<AppUser[]>;
  setList: Dispatch<SetStateAction<AppUser[]>>;
  total: number;
  onClose: () => void;
  isChangeSelectedList?: boolean;
  setIsChangeSelectedList?: Dispatch<SetStateAction<boolean>>;

}

function AppUserRoleMappingModal(props: AppUserRoleMappingModalProps) {
  const [translate] = useTranslation();
  const {
    isOpen,
    toggle,
    onClose,
    list,
    getList,
    setList,
    loading,
    rowSelection,
    modelFilter,
    setModelFilter,
    total,
    isChangeSelectedList,
    setIsChangeSelectedList,
  } = props;

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    modelFilter,
    setModelFilter,
    total,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const handleFilter = React.useCallback(
    (field: string) => {
      return (f: any) => {
        const { skip, take } = AppUserFilter.clone<AppUserFilter>(new AppUserFilter());
        setModelFilter({
          ...modelFilter,
          [field]: f,
          skip,
          take,
        });
      };
    },
    [modelFilter, setModelFilter],
  );

  const handleDefaultSearch = React.useCallback(() => {
    // reset detfault filter
    const { skip, take } = new AppUserFilter();
    setModelFilter({ ...modelFilter, skip, take });
    // reload appUser list
    getList(modelFilter).then((list: AppUser[]) => {
      setList(list);
    });
  }, [getList, modelFilter, setList, setModelFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setModelFilter({ ...newFilter });
    getList(newFilter).then((list: AppUser[]) => {
      setList(list);
    });
  }, [getList, setList, setModelFilter]);
  React.useEffect(() => {
    if (isChangeSelectedList) {
      handleReset();
      setIsChangeSelectedList(false);
    }
  }, [handleReset, isChangeSelectedList, setIsChangeSelectedList]);

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        key: generalLanguageKeys.columns.index,
        title: translate(generalLanguageKeys.columns.index),
        width: 60,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].username), sorter),
        title: translate('appUsers.username'),
        render(...[, appUser]) {
          return appUser?.username;
        },
      },
      {
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].displayName), sorter),
        title: translate('appUsers.displayName'),
        render(...[, appUser]) {
          return appUser?.displayName;
        },
      },
      {
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].organization), sorter),
        title: translate('appUsers.organization'),
        render(...[, appUser]) {
          return appUser?.organization?.name;
        },
      },
      {
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].phone), sorter),
        title: translate('appUsers.phone'),
        render(...[, appUser]) {
          return appUser?.phone;
        },
      },
      {
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
        sorter: true,
        sortOrder: getOrderTypeForTable(nameof(list[0].email), sorter),
        title: translate('appUsers.email'),
        render(...[, appUser]) {
          return appUser?.email;
        },
      },
    ];
  }, [list, pagination, sorter, translate]);
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
                  label={translate('appUsers.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.username.contain)}
                    filter={modelFilter.username}
                    onChange={handleFilter(nameof(modelFilter.username))}
                    placeholder={translate('appUsers.placeholder.username')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.phone.contain)}
                    filter={modelFilter.phone}
                    onChange={handleFilter(nameof(modelFilter.phone))}
                    placeholder={translate('appUsers.placeholder.phone')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.email.contain)}
                    filter={modelFilter.email}
                    onChange={handleFilter(nameof(modelFilter.email))}
                    placeholder={translate('appUsers.placeholder.email')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(modelFilter.displayName.contain)}
                    filter={modelFilter.displayName}
                    onChange={handleFilter(nameof(modelFilter.displayName))}
                    placeholder={translate('appUsers.placeholder.displayName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.organization')}
                  labelAlign="left"
                >
                  <AdvancedTreeFilter
                    filter={modelFilter.organizationId}
                    filterType={nameof(modelFilter.organizationId.equal)}
                    value={modelFilter.organizationId.equal}
                    onChange={handleFilter(nameof(modelFilter.organizationId))}
                    getList={roleRepository.singleListOrganization}
                    modelFilter={organizationFilter}
                    setModelFilter={setOrganizationFilter}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>

            </Row>
          </Form>
          {/* button area */}
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
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
          dataSource={list}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(list[0].id)}
          onChange={handleTableChange}
        />
        <div className=" d-flex justify-content-end mt-3">
          <button className="btn btn-sm btn-primary" onClick={onClose}>
            {translate(generalLanguageKeys.actions.close)}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default AppUserRoleMappingModal;
