import { Col, Form, Popconfirm, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import Table, {
  ColumnProps,
  PaginationConfig,
  TableRowSelection,
} from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { Model } from 'core/models';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ModalContent, { ModalProps } from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import { tableService } from 'services/ant-design/TableService';
import nameof from 'ts-nameof.macro';
export interface ContentModalProps<T extends Model> extends ModalProps {
  selectedList?: T[];

  setSelectedList?: Dispatch<SetStateAction<T[]>>;

  list: T[];

  loading?: boolean;

  pagination?: PaginationConfig;

  isSave?: boolean;

  onSave?: (selectedList: AppUser[]) => void;

  total?: number;

  getList?: (AppUserFilter?: AppUserFilter) => Promise<AppUser[]>;

  count?: (AppUserFilter?: AppUserFilter) => Promise<number>;

  onClose?: () => void;

  isChangeSelectedList?: boolean;

  // setIsChangeSelectedList?: Dispatch<SetStateAction<boolean>>;
  filter?: AppUserFilter;

  setFilter?: Dispatch<SetStateAction<AppUserFilter>>;
  loadList?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}
function useItemContentMaster(
  filter: AppUserFilter,
  getList: (filter: AppUserFilter) => Promise<AppUser[]>,
  count: (filter: AppUserFilter) => Promise<number>,
  loadList,
  setLoadList,
): [
    AppUser[],
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [list, setList] = React.useState<AppUser[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  React.useEffect(() => {
    if (loadList) {
      setLoading(true);
      Promise.all([getList(filter), count(filter)])
        .then(([list, total]) => {
          setList(list);
          setTotal(total);
        })
        .finally(() => {
          setLoadList(false);
          setLoading(false);
        });
    }
  }, [count, filter, getList, loadList, setLoadList]);

  const handleSearch = React.useCallback(() => {
    setLoadList(true);
  }, [setLoadList]);

  return [
    list,
    loading,
    setLoading,
    handleSearch,
    total,
  ];
}

export default function ChooseAppUserModal<T extends Model>(
  props: ContentModalProps<T>,
) {
  const [translate] = useTranslation();
  const {
    toggle,
    isOpen,
    onSave,
    getList,
    count,
    onClose,
    isChangeSelectedList,
    setIsChangeSelectedList,
    filter,
    setFilter,
    loadList,
    setLoadList,
    // setSelectedList,
    // selectedList,
  } = props;
  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);
  const [selectedList, setSelectedList] = React.useState<AppUser[]>([]);
  const [totalAppUser, setTotal] = React.useState<number>(0);

  const [
    list,
    loading,
    setLoading,
    handleSearch,
    total,
  ] = useItemContentMaster(filter, getList, count, loadList, setLoadList);

  const [pagination, , handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const handleChangeFilter = React.useCallback(() => {
    filter.skip = 0;
    Promise.all([getList(filter), count(filter)])
      .then(([listAppUser, totalAppUser]) => {
        setListAppUser(listAppUser);
        setTotal(totalAppUser);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter, getList, count, handleSearch, setLoading]);

  // Ban đầu sẽ gán cái selectedList cho 1 bảng tạm
  // Nếu close thì gán lại selectedList cho bảng tạm đó
  // const [selectedListTemp] = React.useState<AppUser[]>(selectedList)
  // const handleCloseModal =  React.useCallback(() => {

  // }, []);

  React.useEffect(() => {
    setListAppUser(list);
    setTotal(totalAppUser);
    setLoading(false);
    if (isChangeSelectedList === true) {
      setSelectedList([]);
      setIsChangeSelectedList(false);
      const filterAppUser = new AppUserFilter();
      setFilter(filterAppUser);
      handleChangeFilter();
    }
  }, [setListAppUser, setTotal, list, setLoading, totalAppUser, isChangeSelectedList, handleChangeFilter, setFilter, setIsChangeSelectedList]);

  const rowSelection: TableRowSelection<AppUser> = crudService.useContentModalList<
    AppUser
  >(selectedList, setSelectedList);

  const handleDefaultSearch = React.useCallback(() => {
    handleChangeFilter();
  }, [handleChangeFilter]);

  const handleReset = React.useCallback(() => {
    const newFilter = new AppUserFilter();
    setFilter(newFilter);
    setListAppUser(list);
    handleSearch();
  }, [setFilter, list, handleSearch]);
  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: 180,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        title: translate('appUsers.username'),
        key: nameof(listAppUser[0].username),
        dataIndex: nameof(listAppUser[0].username),
      },
      {
        title: translate('appUsers.displayName'),
        key: nameof(listAppUser[0].displayNamme),
        dataIndex: nameof(listAppUser[0].displayName),
      },
      {
        title: translate('appUsers.email'),
        key: nameof(listAppUser[0].email),
        dataIndex: nameof(listAppUser[0].email),
      },
      {
        title: translate('appUsers.phone'),
        key: nameof(listAppUser[0].phone),
        dataIndex: nameof(listAppUser[0].phone),
      },
    ];
  }, [listAppUser, pagination, translate]);

  const handleDeleteAppUser = React.useCallback(
    index => {
      if (index > -1) {
        selectedList.splice(index, 1);
      }
      setSelectedList([...selectedList]);
    },
    [selectedList],
  );
  const columnsSelected: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.indexSelected),
        width: 180,
        render: renderMasterIndex<AppUser>(),
      },
      {
        title: translate('appUsers.username'),
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
      },
      {
        title: translate('appUsers.displayName'),
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
      },
      {
        title: translate('appUsers.email'),
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
      },
      {
        title: translate('appUsers.phone'),
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(selectedList[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center">
              <Popconfirm
                placement="top"
                title={translate('general.delete.content')}
                onConfirm={() => handleDeleteAppUser(index)}
                okText={translate('general.actions.delete')}
                cancelText={translate('general.actions.cancel')}
              >
                <button className="btn btn-sm btn-link">
                  <i className="fa fa-trash" />
                </button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [handleDeleteAppUser, list, selectedList, translate]);

  // React.useEffect(() =>
  // {
  //   console.log(listAppUser)
  // },[listAppUser]
  // )
  return (
    <ModalContent
      size="xl"
      isOpen={isOpen}
      backdrop="static"
      toggle={toggle}
      unmountOnClose={true}
    >
      {/* <ModalHeader>{title}</ModalHeader> */}
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
                  label={translate('appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.displayName.contain)}
                    filter={filter.displayName}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'appUsers.placeholder.displayName',
                    )}
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
                    filterType={nameof(filter.username.contain)}
                    filter={filter.username}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'organizations.appUsers.placeholder.username',
                    )}
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
                    filterType={nameof(filter.email.contain)}
                    filter={filter.email}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'organizations.appUsers.placeholder.email',
                    )}
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
                    filterType={nameof(filter.phone.contain)}
                    filter={filter.phone}
                    onChange={handleChangeFilter}
                    placeholder={translate(
                      'organizations.appUsers.placeholder.phone',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3">
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
          key={nameof(listAppUser[0].id)}
          tableLayout="fixed"
          columns={columns}
          dataSource={listAppUser}
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={nameof(listAppUser[0].id)}
          onChange={handleTableChange}
          className="ml-3 mr-3"
        />
        <div className="title-table mb-3 mt-3">
          <span className="text-table">
            {translate('appUsers.selectedTable')}
          </span>
        </div>
        <Table
          scroll={{ y: 240 }}
          tableLayout="fixed"
          columns={columnsSelected}
          dataSource={selectedList}
          loading={loading}
          rowKey={nameof(selectedList[0].id)}
          pagination={false}
          className="ml-3 mr-3"
        />
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end mt-4 mr-3">
          {props.isSave === true && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onSave(selectedList)}
            >
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={onClose}
          // onClick = {handleCloseModal}
          >
            <i className="fa mr-2 fa-times-circle" />
            {translate(generalLanguageKeys.actions.cancel)}
          </button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
}
