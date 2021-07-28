import { Card, Col, Row, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import {
  generalColumnWidths,
  generalLanguageKeys,
  optionsHorizontalBar2,
  optionsLine,
} from 'config/consts';
import { INDIRECT_SALES_ORDER_ROUTE } from 'config/route-consts';
import { formatDate } from 'core/helpers/date-time';
import { formatCurrencyUnit } from 'core/helpers/number';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { StatusFilter } from 'models/StatusFilter';
import { TopSaleEmployeeFilter } from 'models/TopSaleEmployeeFilter';
import React, { useMemo } from 'react';
import { HorizontalBar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import StoreCheckingMap from 'views/DashboardManagerView/StoreCheckingMap';
import StoreCoverageMap from 'views/DashboardManagerView/StoreCoverageMap';
import dashboardRepository from './DashboardRepository';
import { dashboardService } from './DashboardService';
import './DashboardView.scss';

function DashboardView() {
  const [translate] = useTranslation();
  const [listIndirectSalesOrder, setListIndirectSalesOrder] = React.useState<
    IndirectSalesOrder[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filter, setFilter] = React.useState<TopSaleEmployeeFilter>(
    new TopSaleEmployeeFilter(),
  );

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  React.useEffect(() => {
    if (loading === true) {
      setLoading(true);
      dashboardRepository
        .listIndirectSalesOrder()
        .then((res: IndirectSalesOrder[]) => {
          setListIndirectSalesOrder(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, filter]);

  const [
    sumStoreChecking,
    lablesStoreChecking,
    dataStoreChecking,
  ] = dashboardService.useStoreChecking(dashboardRepository.storeChecking);

  const [
    sumImageStoreChecking,
    lablesImageStoreChecking,
    dataImageStoreChecking,
  ] = dashboardService.useImageStoreChecking(
    dashboardRepository.imageStoreChecking,
  );

  const [
    sumIndirectSalesOrder,
    lablesIndirectSalesOrder,
    dataIndirectSalesorder,
  ] = dashboardService.useIndirectSalesOrder(
    dashboardRepository.statisticIndirectSalesOrder,
  );

  const [
    lablesTopEmployee,
    dataTopEmployee,
    setLoadingTopEmployee,
  ] = dashboardService.useTopEmployee(
    filter,
    dashboardRepository.topSaleEmployeeStoreChecking,
  );

  const [
    sumSaleEmployeeOnline,
    lablesSaleEmployeeOnline,
    dataSaleEmployeeOnline,
  ] = dashboardService.useSaleEmpoyeeOnline(
    dashboardRepository.saleEmployeeOnline,
  );

  const dataVisits = useMemo(
    () => ({
      labels: lablesStoreChecking,
      datasets: [
        {
          label: translate('dashboard.visits'),
          fill: false,
          // lineTension: 1,
          backgroundColor: '#FFB822',
          borderColor: '#FFB822',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#FFB822',
          pointBackgroundColor: '#FFB822',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FFB822',
          pointHoverBorderColor: '#FFB822',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: JSON.parse(dataStoreChecking),
        },
      ],
    }),
    [dataStoreChecking, lablesStoreChecking, translate],
  );

  const dataSaleEmployees = useMemo(
    () => ({
      labels: lablesSaleEmployeeOnline,
      datasets: [
        {
          label: translate('dashboard.saleEmployees'),
          fill: false,
          backgroundColor: '#FC4C87',
          borderColor: '#FC4C87',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#FC4C87',
          pointBackgroundColor: '#FC4C87',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FC4C87',
          pointHoverBorderColor: '#FC4C87',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: JSON.parse(dataSaleEmployeeOnline),
        },
      ],
    }),
    [dataSaleEmployeeOnline, lablesSaleEmployeeOnline, translate],
  );
  const dataNewOrders = useMemo(
    () => ({
      labels: lablesIndirectSalesOrder,
      datasets: [
        {
          label: translate('dashboard.newOrders'),
          fill: false,
          backgroundColor: '#5D78FF',
          borderColor: '#5D78FF',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#5D78FF',
          pointBackgroundColor: '#5D78FF',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#5D78FF',
          pointHoverBorderColor: '#5D78FF',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: JSON.parse(dataIndirectSalesorder),
        },
      ],
    }),
    [dataIndirectSalesorder, lablesIndirectSalesOrder, translate],
  );

  const dataNewImages = useMemo(
    () => ({
      labels: lablesImageStoreChecking,
      datasets: [
        {
          label: translate('dashboard.newImages'),
          fill: false,
          backgroundColor: '#0ABB87',
          borderColor: '#0ABB87',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#0ABB87',
          pointBackgroundColor: '#0ABB87',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#0ABB87',
          pointHoverBorderColor: '#0ABB87',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: JSON.parse(dataImageStoreChecking),
        },
      ],
    }),
    [dataImageStoreChecking, lablesImageStoreChecking, translate],
  );

  const data = useMemo(
    () => ({
      labels: lablesTopEmployee,
      datasets: [
        {
          label: translate('dashboard.visits'),
          backgroundColor: '#a32f4a',
          borderColor: '#a32f4a',
          borderWidth: 1,
          hoverBackgroundColor: '#a32f4a',
          hoverBorderColor: '#a32f4a',
          barPercentage: 0.5,
          barThickness: 10,
          data: JSON.parse(dataTopEmployee),
        },
      ],
    }),
    [lablesTopEmployee, dataTopEmployee, translate],
  );

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
          title: translate('indirectSalesOrders.code'),
          key: nameof(listIndirectSalesOrder[0].code),
          dataIndex: nameof(listIndirectSalesOrder[0].code),
          ellipsis: true,
          render(code) {
            return (
              <a
                className="code-indirect"
                href={INDIRECT_SALES_ORDER_ROUTE + '#' + code}
              >
                {code}
              </a>
            );
          },
        },
        {
          title: translate('indirectSalesOrders.orderDate'),
          key: nameof(listIndirectSalesOrder[0].orderDate),
          dataIndex: nameof(listIndirectSalesOrder[0].orderDate),
          render(...[orderDate]) {
            return formatDate(orderDate);
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.indirectSalesOrderStatus'),
          key: nameof(listIndirectSalesOrder[0].requestState),
          dataIndex: nameof(listIndirectSalesOrder[0].requestState),
          render(...[requestState]) {
            return (
              <div className="status">
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
              </div>
            );
          },
        },
        {
          title: translate('dashboard.employee'),
          key: nameof(listIndirectSalesOrder[0].saleEmployee),
          dataIndex: nameof(listIndirectSalesOrder[0].saleEmployee),
          render(...[saleEmployee]) {
            return saleEmployee?.username;
          },
          ellipsis: true,
        },
        {
          title: translate('indirectSalesOrders.total'),
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
      setLoadingTopEmployee(true);
    },
    [filter, setFilter, setLoadingTopEmployee],
  );

  return (
    <div className="dashboard">
      <Row>
        <Col lg={6} className="col-dashboard-left">
          <Card className="card-dashboard">
            <div className="count">
              <Tooltip title={formatNumber(sumStoreChecking || 0)}>
                {formatCurrencyUnit(sumStoreChecking || 0)}
              </Tooltip>
            </div>
            <div className="chart-title-line">
              {translate('dashboard.title.visits')}
            </div>
            <div className="chart-line pt-3">
              <Line
                width={150}
                height={120}
                data={dataVisits}
                options={optionsLine}
              />
            </div>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="card-dashboard">
            <div className="count">
              <Tooltip title={formatNumber(sumSaleEmployeeOnline || 0)}>
                {formatCurrencyUnit(sumSaleEmployeeOnline || 0)}
              </Tooltip>
            </div>
            <div className="chart-title-line">
              {translate('dashboard.title.saleEmployee')}
            </div>
            <div className="chart-line pt-3">
              <Line
                width={150}
                height={120}
                data={dataSaleEmployees}
                options={optionsLine}
              />
            </div>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="card-dashboard">
            <div className="count">
              <Tooltip title={formatNumber(sumIndirectSalesOrder || 0)}>
                {formatCurrencyUnit(sumIndirectSalesOrder || 0)}
              </Tooltip>
            </div>
            <div className="chart-title-line">
              {translate('dashboard.title.newOrders')}
            </div>
            <div className="chart-line pt-3">
              <Line
                width={150}
                height={120}
                data={dataNewOrders}
                options={optionsLine}
              />
            </div>
          </Card>
        </Col>
        <Col lg={6} className="col-dashboard-right">
          <Card className="card-dashboard">
            <div className="count">
              <Tooltip title={formatNumber(sumImageStoreChecking || 0)}>
                {formatCurrencyUnit(sumImageStoreChecking || 0)}
              </Tooltip>
            </div>
            <div className="chart-title-line">
              {translate('dashboard.title.newImgaes')}
            </div>
            <div className="chart-line pt-3">
              <Line
                width={150}
                height={120}
                data={dataNewImages}
                options={optionsLine}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12} className="col-dashboard-left">
          {useMemo(
            () => (
              <StoreCoverageMap
                getList={dashboardRepository.storeCoverage}
                getFilterList={dashboardRepository.filterListOrganization}
              />
            ),
            [],
          )}
        </Col>
        <Col lg={12} className="col-dashboard-right">
          {useMemo(
            () => (
              <StoreCheckingMap
                getList={dashboardRepository.saleEmployeeLocation}
                getFilterList={dashboardRepository.filterListOrganization}
              />
            ),
            [],
          )}
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="col-dashboard-left">
          <Card className="card-dashboard card-bottom">
            <div className="table-title mb-3 mt-3">
              {translate('dashboard.title.newOrders')}
            </div>
            <div className="table-dashboard">
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
        </Col>
        <Col lg={12} className="col-dashboard-right">
          <Card className="card-dashboard card-bottom">
            <div className="row mt-3">
              <div className="col top-sale-employee ml-3">
                {translate('dashboard.title.topSaleaEmployee')}
              </div>
              <div className="col mr-3">
                <div className="single-list-status">
                  <AdvancedIdFilter
                    filter={filter.time}
                    filterType={nameof(filter.time.equal)}
                    value={filter.time.equal}
                    onChange={handleFilter}
                    getList={dashboardRepository.filterListTime}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    searchType={nameof(statusFilter.name.contain)}
                    placeholder={translate('general.placeholder.title')}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <HorizontalBar
                height={400}
                data={data}
                options={optionsHorizontalBar2}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default DashboardView;
