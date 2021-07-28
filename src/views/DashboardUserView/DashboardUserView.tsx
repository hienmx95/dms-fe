import { Card, Col, Row, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE } from 'config/route-consts';
import { GlobalState } from 'core/config';
import { formatCurrencyUnit, formatNumber } from 'core/helpers/number';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { StatusFilter } from 'models/StatusFilter';
import { TopSaleEmployeeFilter } from 'models/TopSaleEmployeeFilter';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'reactn';
import nameof from 'ts-nameof.macro';
import dashboardUserRepository from './DashboardUserRepository';
import { dashboardUserService } from './DashboardUserService';
import './DashboardUserView.scss';

function DashboardUserView() {
  const [translate] = useTranslation();
  const [user] = useGlobal<GlobalState>('user');
  const [avatar, setAvatar] = React.useState<string>();
  const [displayName, setDisplayName] = React.useState<string>();

  React.useEffect(() => {
    if (user && user !== null) {
      const userTmp = user as AppUser;
      setAvatar(userTmp?.avatar);
      setDisplayName(userTmp?.displayName);
    }
  }, [user]);

  /*SUM */
  const [filter, setFilter] = React.useState<TopSaleEmployeeFilter>(
    new TopSaleEmployeeFilter(),
  );

  const [listIndirectSalesOrder, setListIndirectSalesOrder] = React.useState<
    IndirectSalesOrder[]
  >([]);
  const [listComment, setListComment] = React.useState<IndirectSalesOrder[]>(
    [],
  );

  const [
    salesQuantity,
    storeChecking,
    revenue,
    statisticIndirectSalesOrder,
    setLoadingSum,
  ] = dashboardUserService.useDataSum(
    filter,
    dashboardUserRepository.salesQuantity,
    dashboardUserRepository.storeChecking,
    dashboardUserRepository.revenue,
    dashboardUserRepository.statisticIndirectSalesOrder,
  );

  const [loading, setLoading] = React.useState<boolean>(true);

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  React.useEffect(() => {
    if (loading) {
      dashboardUserRepository
        .listIndirectSalesOrder()
        .then(res => {
          setListIndirectSalesOrder(res);
        })
        .finally(() => {
          setLoading(false);
        });
      dashboardUserRepository
        .listComment()
        .then(res => {
          setListComment(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, setLoading]);

  const columns: ColumnProps<IndirectSalesOrder>[] = React.useMemo(
    () => {
      return [
        {
          title: '#',
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<IndirectSalesOrder>(),
        },
        {
          title: translate('dashboardUser.code'),
          key: nameof(listIndirectSalesOrder[0].code),
          dataIndex: nameof(listIndirectSalesOrder[0].code),
          ellipsis: true,
          render(code) {
            return (
              <a
                className="code-indirect"
                href={INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE + '/' + code}
              >
                {code}
              </a>
            );
          },
        },
        {
          title: translate('dashboardUser.buyerStore'),
          key: nameof(listIndirectSalesOrder[0].buyerStore),
          dataIndex: nameof(listIndirectSalesOrder[0].buyerStore),
          render(...[buyerStore]) {
            return buyerStore?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('dashboardUser.sellerStore'),
          key: nameof(listIndirectSalesOrder[0].sellerStore),
          dataIndex: nameof(listIndirectSalesOrder[0].sellerStore),
          render(...[sellerStore]) {
            return sellerStore?.name;
          },
          ellipsis: true,
        },
        {
          title: translate('dashboardUser.indirectSalesOrderStatus'),
          key: nameof(listIndirectSalesOrder[0].requestState),
          dataIndex: nameof(listIndirectSalesOrder[0].requestState),
          render(...[requestState]) {
            return (
              <>
                {requestState && requestState?.id === 1 && (
                  <div className="new-state">{requestState?.name}</div>
                )}
                {requestState && requestState?.id === 2 && (
                  <div className="pending-state">{requestState?.name}</div>
                )}
                {requestState && requestState?.id === 3 && (
                  <div className="approved-state">{requestState?.name}</div>
                )}
                {requestState && requestState?.id === 4 && (
                  <div className="rejected-state">{requestState?.name}</div>
                )}
              </>
            );
          },
        },

        {
          title: translate('dashboardUser.total'),
          key: nameof(listIndirectSalesOrder[0].total),
          dataIndex: nameof(listIndirectSalesOrder[0].total),
          render(...[total]) {
            return formatNumber(total);
          },
          ellipsis: true,
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [listIndirectSalesOrder, translate],
  );

  const handleFilter = React.useCallback(
    event => {
      filter.time.equal = event?.equal;
      setFilter(filter);
      setLoadingSum(true);
    },
    [filter, setFilter, setLoadingSum],
  );
  return (
    <div className="dashboard-user">
      <Row className="mt-1">
        <Col lg={8} className="col-dashboard-left">
          <Card className="card-dashboard card-profile">
            <div className="icon-avatar mt-5 ml-4">
              {avatar && <img src={avatar} alt="" />}
            </div>
            <div className="dashboard-display-name ml-4 mt-3">
              <div>{translate('dashboardUser.welcome')},</div>
              <div className="name">{displayName}</div>
            </div>
            <div className="dashboard-comment ml-5 mr-3 mt-5">
              <div className="comment mb-3">
                {translate('dashboardUser.comment')}
              </div>
              {listComment && listComment.length > 0 ?
                listComment.map((comment, index) => (
                  <div className="item-comment mb-3" key={index}>
                    <div className="d-flex algin-items-center">
                      <div className="avatar-comment">
                        <img
                          src={comment?.avatar}
                          alt=""
                          width={38}
                          height={38}
                        />
                      </div>
                      <div className="user mt-3">
                        <div className="display">
                          <span className="name">{comment?.appUserName}</span>
                          <div className="time mr-1 d-flex justify-content-end">
                            {moment(comment?.createdAt).fromNow(true)}
                          </div>
                        </div>
                        <div className="content">{comment?.content}</div>
                      </div>
                    </div>
                  </div>
                )) :
                <div className="no-data-group">
                  <img src="/dms/assets/img/no-data.png" alt="nodata" />
                  <span className="no-data-title">{translate('dashboardUser.noDataTitle')} :(!</span>
                  <span className="no-data-description">{translate('dashboardUser.noDataDescription')} :D!</span>
                </div>
              }
            </div>
          </Card>
        </Col>
        <Col lg={16} className="col-dashboard-right">
          <Row>
            <Col lg={6} className="select">
              <div className="single-list-status">
                <AdvancedIdFilter
                  filter={filter.time}
                  filterType={nameof(filter.time.equal)}
                  value={Number(filter.time.equal)}
                  onChange={handleFilter}
                  modelFilter={statusFilter}
                  setModelFilter={setStatusFilter}
                  getList={dashboardUserRepository.filterListTime}
                  searchType={nameof(statusFilter.name.contain)}
                  searchField={nameof(statusFilter.name)}
                  placeholder={translate('general.placeholder.title')}
                  allowClear={false}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={6} className="col-top-right">
              <Card className="card-dashboard">
                <div className="dashboard-icon">
                  <div className="row">
                    <div className="col-6">
                      <div className="report ">
                        <div className="sell-number-report">
                          {translate('dashboardUser.sellNumber')}
                        </div>
                        <div className="text-statistical">
                          <Tooltip title={formatNumber(salesQuantity)}>
                            {formatCurrencyUnit(salesQuantity)}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex justify-content-end">
                        <div className="dashboard-sell-number">
                          <i className="tio-layers" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={6} className="col-top-right">
              <Card className="card-dashboard">
                <div className="dashboard-icon">
                  <div className="row">
                    <div className="col-6">
                      <div className="report ">
                        <div className="visits-report">
                          {translate('dashboardUser.visits')}
                        </div>
                        <div className="text-statistical">
                          <Tooltip title={formatNumber(storeChecking)}>
                            {formatCurrencyUnit(storeChecking)}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex justify-content-end">
                        <div className="dashboard-visits">
                          <i className="tio-running" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={6} className="col-top-right">
              <Card className="card-dashboard">
                <div className="dashboard-icon">
                  <div className="row">
                    <div className="col-6">
                      <div className="report ">
                        <div className="revenue-report">
                          {translate('dashboardUser.revenue')}
                        </div>
                        <div className="text-statistical">
                          <Tooltip title={formatNumber(revenue)}>
                            {formatCurrencyUnit(revenue)}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex justify-content-end">
                        <div className="dashboard-revenue">
                          <i className="tio-dollar" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="card-dashboard">
                <div className="dashboard-icon">
                  <div className="row">
                    <div className="col-6">
                      <div className="report ">
                        <div className="indirect-report">
                          {translate('dashboardUser.indirect')}
                        </div>
                        <div className="text-statistical">
                          <Tooltip
                            title={formatNumber(statisticIndirectSalesOrder)}
                          >
                            {formatCurrencyUnit(statisticIndirectSalesOrder)}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className=" d-flex justify-content-end">
                        <div className="dashboard-indirect">
                          <i className="tio-shopping_cart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Card className="card-dashboard card-list-indirect">
              <div className="table-title mb-3 mt-3 ml-3">
                {translate('dashboardUser.title.newOrders')}
              </div>
              <div className="table-dashboard ml-3 mr-3">
                <Table
                  key={nameof(listIndirectSalesOrder[0].id)}
                  tableLayout="fixed"
                  bordered={false}
                  columns={columns}
                  dataSource={listIndirectSalesOrder}
                  pagination={false}
                  rowKey={nameof(listIndirectSalesOrder[0].id)}
                />
              </div>
            </Card>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardUserView;
