import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps, PaginationConfig, TableRowSelection } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Role } from 'models/Role';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import Modal, { ModalProps } from 'reactstrap/lib/Modal';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';

const { Item: FormItem } = Form;

export interface RoleAppUserMappingModalProps<T extends Model> extends ModalProps {
  title: string;

  selectedList: T[];

  setSelectedList: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: T[], currentItem) => void;

  currentItem?: Role;

  total: number;

  getList?: (appUserFilter: AppUserFilter) => Promise<AppUser[]>;

  count?: (appUserFilter: AppUserFilter) => Promise<number>;

  onClose?: (event) => void;

}

function RoleAppUserMappingModal<T extends Model>
  (props: RoleAppUserMappingModalProps<T>) {
  const [translate] = useTranslation();

  const {
    toggle,
    isOpen,
    loading,
    list,
    selectedList,
    setSelectedList,
    onSave,
    currentItem,
    total,
    getList,
    count,
  } = props;

  const rowSelection: TableRowSelection<AppUser> = crudService.useContentModalList<
    T
  >(selectedList, setSelectedList);

  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [totalAppUser, setTotal] = React.useState<number>(0);

  const [loadingAppUser, setLoading] = React.useState<boolean>(loading);

  React.useEffect(() => {
    setListAppUser(list);
    setTotal(totalAppUser);
    setLoading(false);
  }, [setListAppUser, setTotal, setLoading, list, totalAppUser]);

  // const handleSearch = React.useCallback(() => {
  //   setLoading(true);
  // }, []);

  const handleChangeFilter = React.useCallback(() => {
    Promise.all([getList(appUserFilter), count(appUserFilter)])
      .then(([listAppUser, totalAppUser]) => {
        setListAppUser(listAppUser);
        setTotal(totalAppUser);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getList, appUserFilter, count]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setAppUserFilter(newFilter);
    setListAppUser(list);
  }, [list]);

  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
        rowSelection.selectedRowKeys = null;
      }
    },
    [props, rowSelection.selectedRowKeys],
  );

  const [pagination] = tableService.useMasterTable(
    appUserFilter,
    setAppUserFilter,
    total,
  );
  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => {
      return [
        {
          title: translate('roles.appUser.username'),
          key: nameof(list[0].username),
          dataIndex: nameof(list[0].username),
        },
        {
          title: translate('roles.appUser.displayName'),
          key: nameof(list[0].displayName),
          dataIndex: nameof(list[0].displayName),
        },
        {
          title: translate('roles.appUser.phone'),
          key: nameof(list[0].phone),
          dataIndex: nameof(list[0].phone),
        },
        {
          title: translate('roles.appUser.email'),
          key: nameof(list[0].email),
          dataIndex: nameof(list[0].email),
        },
      ];
    },
    [list, translate],
  );
  return (
    <Modal
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
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.username.contain)}
                    filter={appUserFilter.username}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.username')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.phone.contain)}
                    filter={appUserFilter.phone}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.phone')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.email.contain)}
                    filter={appUserFilter.email}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.email')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={8}>
                <FormItem
                  className="mb-0"
                  label={translate('roles.appUser.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(appUserFilter.displayName.contain)}
                    filter={appUserFilter.displayName}
                    onChange={handleChangeFilter}
                    placeholder={translate('roles.appUser.placeholder.displayName')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleChangeFilter}
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
          columns={columns}
          dataSource={listAppUser}
          loading={loadingAppUser}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listAppUser[0].id)}
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <div>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onSave(selectedList, currentItem)}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
              <button
                className="btn btn-sm btn-outline-primary ml-2"
                onClick={handleCancel}
              >
                <i className="fa mr-2 fa-times-circle" />
                {translate(generalLanguageKeys.actions.cancel)}
              </button>
            </div>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default RoleAppUserMappingModal;