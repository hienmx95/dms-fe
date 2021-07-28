import { Card, Col, Form, Modal } from 'antd';
import { AxiosError } from 'axios';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { organizationRepository } from 'views/OrganizationTreeView/OrganizationRepository';
import OrganizationTree from './OrganizationTree/OrganizationTree';
import { notification } from 'helpers/notification';
import './OrganizationTreeMaster.scss';

function OrganizationTreeMaster() {
  const [translate] = useTranslation();

  const [
    filter,
    ,
    list,
    ,
    loading,
    setLoading,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    setLoadList,
  ] = crudService.useMaster<Organization, OrganizationFilter>(
    Organization,
    OrganizationFilter,
    organizationRepository.count,
    organizationRepository.list,
    organizationRepository.get,
  );

  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );

  const [filterAppUserExport, setAppUserFilterExport] = React.useState<
    AppUserFilter
  >(new AppUserFilter());

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(listAppUser, appUserFilter, setAppUserFilter);

  /**
   * If export
   */

  const [handleExport] = crudService.useExport(
    organizationRepository.exportAppUser,
    filterAppUserExport,
  );
  const listFilterType: any[] = React.useMemo(() => {
    return [
      {
        id: 1,
        name: translate('organizations.filter.all'),
      },
      {
        id: 2,
        name: translate('organizations.filter.parent'),
      },
      {
        id: 3,
        name: translate('organizations.filter.children'),
      },
    ];
  }, [translate]);
  const [filterTypeFilter, setFilterTypeFilter] = React.useState<number>(1);

  const handleGetDetail = React.useCallback(
    (id: number, filterType: number) => {
      const listAppUser = [];
      organizationRepository
        .get(id, filterType)
        .then(res => {
          if (res && res.appUsers && res.appUsers.length > 0) {
            res.appUsers.forEach(appUser => {
              listAppUser.push(appUser);
            });
            setListAppUser(listAppUser);
          } else {
            setListAppUser([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setListAppUser],
  );

  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },

      {
        title: translate('organizations.master.appUser.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.email'),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.phone'),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
      },
    ];
  }, [dataSource, pagination, translate]);

  const handleActive = React.useCallback(
    (node: AppUser) => {
      setCurrentItem(node);

      filterAppUserExport.organizationId.equal = node.id;
      setAppUserFilterExport(filterAppUserExport);
      if (node.appUsers !== null) {
        setListAppUser(node.appUsers);
      } else {
        setListAppUser([]);
      }
      handleGetDetail(node.id, filterTypeFilter);
    },
    [
      setCurrentItem,
      setListAppUser,
      handleGetDetail,
      filterTypeFilter,
      filterAppUserExport,
      setAppUserFilterExport,
    ],
  );

  // change dis play of organization
  const handleChangeIsDisplay = React.useCallback(
    (node: Organization) => () => {
      if (node?.parent && !node?.parent?.isDisplay) {
        Modal.warning({
          title: '',
          content: translate('organizations.errors.changeDisplay'),
        });
      } else {
        const newOrganization = { ...node };
        node.isDisplay = !newOrganization.isDisplay;
        organizationRepository
          .updateIsDisplay(node)
          .then(() => {
            setLoadList(true);

            notification.success({
              message: translate(generalLanguageKeys.update.success),
            });
          })
          .catch((error: AxiosError<Organization>) => {
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      }
    },
    [translate, setLoadList],
  );

  const handleFilterAppUser = React.useCallback(
    event => {
      currentItem.filterType = Number(event.equal);
      handleGetDetail(currentItem?.id, currentItem.filterType);
      setFilterTypeFilter(currentItem.filterType);
    },
    [currentItem, handleGetDetail],
  );
  return (
    <div className="page master-page">
      <Card
        className="organization-master"
        title={translate('organizations.master.title')}
      >
        <Col lg={12}>
          <div className="org-grouping">
            <OrganizationTree
              tree={list}
              onActive={handleActive}
              currentItem={currentItem}
              onChangeDisplay={handleChangeIsDisplay}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className="flex-shrink-1 d-flex align-items-center">
            {currentItem && currentItem?.id && (
              <>
                <Form.Item
                  labelAlign="left"
                  className="mb-1 select"
                  label={translate('organizations.appUser')}
                >
                  <AdvancedIdFilter
                    filter={filter.filterType}
                    filterType={nameof(filter.filterType.equal)}
                    value={filterTypeFilter}
                    onChange={handleFilterAppUser}
                    allowClear={false}
                    list={listFilterType}
                  />
                </Form.Item>

                <button
                  className="btn btn-sm btn-outline-primary mt-4 mr-2 "
                  onClick={handleExport}
                >
                  <i className="tio-file_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.export)}
                </button>
              </>
            )}
          </div>

          <div className="table-app-user">
            <div className="mb-3 title-org">
              {translate('organizations.master.appUser.title')}
            </div>
            <Table
              className="content-app-user"
              key={listAppUser[0]?.id}
              dataSource={listAppUser}
              columns={columns}
              bordered
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(dataSource[0].id)}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </div>
        </Col>
      </Card>
    </div>
  );
}

export default OrganizationTreeMaster;
