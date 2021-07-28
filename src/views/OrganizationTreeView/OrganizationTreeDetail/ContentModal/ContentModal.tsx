import { Col, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { PaginationConfig } from 'antd/lib/pagination';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { organizationService } from 'views/OrganizationTreeView/OrrganizationTreeService';
import './ContentModal.scss';

export interface ContentModalProps<T extends Model> extends ModalProps {

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: any;

  total?: number;

  getList?: (appUserFilter?: AppUserFilter) => Promise<AppUser[]>;

  count?: (appUserFilter?: AppUserFilter) => Promise<number>;

  onClose?: (currentItem) => void;
}


function ContentModal<T extends Model>(props: ContentModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    getList,
    count,
    onClose,
  } = props;
  const rowSelection: TableRowSelection<AppUser> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  // const [filterAppUser, setFilterAppUser] = React.useState<AppUserFilter>(
  //   new AppUserFilter(),
  // );
  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [totalAppUser, setTotal] = React.useState<number>(0);

  // const [loadingAppUser, setLoading] = React.useState<boolean>(loading);

  const [
    filterAppUser,
    setFilterAppUser,
    list,
    ,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = organizationService.useAppUserContentMaster(getList, count, currentItem);

  React.useEffect(() => {
    setListAppUser(list);
    setTotal(totalAppUser);
    setLoading(false);
  }, [setListAppUser, setTotal, setLoading, list, totalAppUser]);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filterAppUser,
    setFilterAppUser,
    total,
    handleSearch,
  );

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 180,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        title: translate('organizations.appUsers.username'),
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
      },
      {
        title: translate('organizations.appUsers.displayName'),
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
      },
      {
        title: translate('organizations.appUsers.email'),
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
      },
      {
        title: translate('organizations.appUsers.phone'),
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
      },
    ];
  }, [list, pagination, translate]);



  const handleChangeFilter = React.useCallback(() => {
    filterAppUser.skip = 0;
    Promise.all([getList(filterAppUser), count(filterAppUser)])
      .then(([listAppUser, totalAppUser]) => {
        setListAppUser(listAppUser);
        setTotal(totalAppUser);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    getList,
    filterAppUser,
    count,
    setListAppUser,
    setTotal,
    setLoading,
    handleSearch,
  ]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setFilterAppUser(newFilter);
    setListAppUser(list);
    handleSearch();
  }, [
    list,
    handleSearch,
    setFilterAppUser,
    setListAppUser,
  ]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
      className="modal-content-org"
    >
      {/* <ModalHeader>{title}</ModalHeader> */}
      <ModalBody>
        {/* <Card
          className="head-borderless mb-4"
          title={translate(generalLanguageKeys.actions.search)}
        >
          {children}

        </Card> */}
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('organizations.appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterAppUser.displayName.contain)}
                    filter={filterAppUser.displayName}
                    onChange={handleChangeFilter}
                    placeholder={translate('organizations.appUsers.placeholder.code')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('organizations.appUsers.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterAppUser.username.contain)}
                    filter={filterAppUser.username}
                    onChange={handleChangeFilter}
                    placeholder={translate('organizations.appUsers.placeholder.username')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('organizations.appUsers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterAppUser.email.contain)}
                    filter={filterAppUser.email}
                    onChange={handleChangeFilter}
                    placeholder={translate('organizations.appUsers.placeholder.email')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('organizations.appUsers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filterAppUser.phone.contain)}
                    filter={filterAppUser.phone}
                    onChange={handleChangeFilter}
                    placeholder={translate('organizations.appUsers.placeholder.phone')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
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
          </div>
        </CollapsibleCard>
        <Table
          key={listAppUser[0]?.id}
          tableLayout="fixed"
          bordered={true}
          columns={columns}
          dataSource={listAppUser}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listAppUser[0].id)}
          onChange={handleTableChange}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList, currentItem)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}

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

export default ContentModal;
