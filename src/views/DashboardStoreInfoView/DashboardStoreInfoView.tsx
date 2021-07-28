import { Card, Col, Form, Progress, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import classNames from 'classnames';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import { formatNumber } from 'core/helpers/number';
import { crudService } from 'core/services';
import { BrandFilter } from 'models/BrandFilter';
import { DashboardStoreInfoFilter } from 'models/DashboardStoreInfoFilter';
import { DashboardTopBrandFilter } from 'models/DashboardTopBrandFilter';
import { DistrictFilter } from 'models/DistrictFilter';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StoreInfomation } from 'models/report/StoreInfomation';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { v4 as uuidv4 } from 'uuid';
import dashboardStoreInfoRepository from './DashboardStoreInfoRepository';
import { dashboardStoreInfoService } from './DashboardStoreInfoService';
import './DashboardStoreInfoView.scss';
import StoreCoverageMap from './StoreMap';

const { Item: FormItem } = Form;
function DashboardStoreInfoView() {
  const [translate] = useTranslation();

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );
  const [resetDistrict, setResetDistrict] = React.useState<boolean>(false);
  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );
  const [isReset, setIsReset] = React.useState<boolean>(false);

  const [filter, setFilter] = React.useState<DashboardStoreInfoFilter>(
    new DashboardStoreInfoFilter(),
  );

  const [filterTopBrand, setFilterTopBrand] = React.useState<
    DashboardTopBrandFilter
  >(new DashboardTopBrandFilter());

  const [loadMap, setLoadMap] = React.useState<boolean>(true);
  const [to1pActive, setTop1Active] = React.useState<boolean>(true);
  const [top2Active, setTop2Active] = React.useState<boolean>(false);
  const [top3Active, setTop3Active] = React.useState<boolean>(false);

  const [dataSurvey, setLoadingDataSurvey] = dashboardStoreInfoService.useData(
    dashboardStoreInfoRepository.storeCounter,
    filter,
  );

  const [databrand, setLoadingDataBrand] = dashboardStoreInfoService.useData(
    dashboardStoreInfoRepository.brandStatistics,
    filter,
  );

  const [
    brandUnStatistics,
    setLoadingbrandUnStatistics,
  ] = dashboardStoreInfoService.useData(
    dashboardStoreInfoRepository.brandUnStatistics,
    filter,
  );

  const [
    productGroupingStatistics,
    setLoadingProductGrouping,
  ] = dashboardStoreInfoService.useData(
    dashboardStoreInfoRepository.productGroupingStatistics,
    filter,
  );

  const [topBrand, setLoadingTopBrand] = dashboardStoreInfoService.useData(
    dashboardStoreInfoRepository.topBrand,
    filterTopBrand,
  );

  const [currentBrandFilter, setCurrentBrandFilter] = React.useState<
    DashboardStoreInfoFilter
  >(new DashboardStoreInfoFilter());

  React.useEffect(() => {
    if (typeof filterTopBrand.top.equal === 'undefined') {
      setFilterTopBrand(filerTmp => ({
        ...filerTmp,
        top: { equal: 1 },
      }));
      setTop1Active(true);
      setLoadingTopBrand(true);
    }
  }, [filterTopBrand.top.equal, setLoadingTopBrand]);

  const dataSource: any[] = React.useMemo(() => {
    let listBrand = [];
    if (productGroupingStatistics && productGroupingStatistics?.length > 0) {
      listBrand = productGroupingStatistics.map(item => (item.key = uuidv4()));
    }

    return listBrand;
  }, [productGroupingStatistics]);

  const dataSourceTopBrand: any[] = React.useMemo(() => {
    let listBrand = [];
    if (topBrand && topBrand?.length > 0) {
      listBrand = topBrand.map(item => (item.key = uuidv4()));
    }

    return listBrand;
  }, [topBrand]);

  const handleChangeFilter = React.useCallback(
    field => {
      return value => {
        filter[field].equal = value?.equal;
        filterTopBrand[field].equal = value?.equal;
        setFilter({ ...filter });
        setFilterTopBrand({ ...filterTopBrand });
        setLoadingDataSurvey(true);
        setLoadingDataBrand(true);
        setLoadingbrandUnStatistics(true);
        setLoadingProductGrouping(true);
        setLoadingTopBrand(true);
        setLoadMap(true);
      };
    },
    [
      filter,
      filterTopBrand,
      setLoadingDataBrand,
      setLoadingDataSurvey,
      setLoadingProductGrouping,
      setLoadingTopBrand,
      setLoadingbrandUnStatistics,
    ],
  );

  const handleFilterProvince = React.useCallback(
    event => {
      const provinceId = event.equal;
      if (districtFilter.provinceId.equal !== provinceId) {
        filter.provinceId.equal = provinceId;
        filter.districtId.equal = undefined;
        filterTopBrand.provinceId.equal = provinceId;
        filterTopBrand.districtId.equal = undefined;
        setFilter({ ...filter });
        setResetDistrict(true);
        setFilterTopBrand({ ...filterTopBrand });
        setLoadingDataSurvey(true);
        setLoadingDataBrand(true);
        setLoadingbrandUnStatistics(true);
        setLoadingProductGrouping(true);
        setLoadingTopBrand(true);
        setLoadMap(true);
      }
      districtFilter.provinceId.equal = provinceId;
    },
    [
      districtFilter.provinceId.equal,
      filter,
      filterTopBrand,
      setLoadingDataBrand,
      setLoadingDataSurvey,
      setLoadingProductGrouping,
      setLoadingTopBrand,
      setLoadingbrandUnStatistics,
      setFilter,
    ],
  );

  const [handleExportBrandStatistics] = crudService.useExport(
    dashboardStoreInfoRepository.exportBrandStatistics,
    currentBrandFilter,
  );
  const [handleExportBrandUnStatistics] = crudService.useExport(
    dashboardStoreInfoRepository.exportBrandUnStatistics,
    currentBrandFilter,
  );

  const handleExportBrand = React.useCallback(
    brandid => {
      currentBrandFilter.brandId.equal = brandid;
      setCurrentBrandFilter({ ...currentBrandFilter });
      handleExportBrandStatistics();
    },
    [handleExportBrandStatistics, currentBrandFilter],
  );
  const handleExportUnBrand = React.useCallback(
    brandid => {
      currentBrandFilter.brandId.equal = brandid;
      setCurrentBrandFilter({ ...currentBrandFilter });
      handleExportBrandUnStatistics();
    },
    [handleExportBrandUnStatistics, currentBrandFilter],
  );

  const columns: ColumnProps<StoreInfomation>[] = React.useMemo(() => {
    return [
      {
        title() {
          return (
            <div className="ml-3">
              {translate('dashboardStoreInfo.brandName')}
            </div>
          );
        },
        key: nameof(productGroupingStatistics[0].brandName),
        dataIndex: nameof(productGroupingStatistics[0].brandName),
        ellipsis: true,
        render(...[brandName]) {
          return <div className="ml-3 brand-name">{brandName}</div>;
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping8'),
        key: nameof(productGroupingStatistics[0].value8),
        dataIndex: nameof(productGroupingStatistics[0].value8),
        ellipsis: true,
        render(...[value8, content]) {
          return (
            <>
              <div className="">{value8}</div>
              <div className="number-bottom">{content?.rate8}%</div>
            </>
          );
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping7'),
        key: nameof(productGroupingStatistics[0].value7),
        dataIndex: nameof(productGroupingStatistics[0].value7),
        ellipsis: true,
        render(...[value7, content]) {
          return (
            <>
              <div className="">{value7}</div>
              <div className="number-bottom">{content?.rate7}%</div>
            </>
          );
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping6'),
        key: nameof(productGroupingStatistics[0].value6),
        dataIndex: nameof(productGroupingStatistics[0].value6),
        ellipsis: true,
        render(...[value6, content]) {
          return (
            <>
              <div className="">{value6}</div>
              <div className="number-bottom">{content?.rate6}%</div>
            </>
          );
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping5'),
        key: nameof(productGroupingStatistics[0].value5),
        dataIndex: nameof(productGroupingStatistics[0].value5),
        ellipsis: true,
        render(...[value5, content]) {
          return (
            <>
              <div className="">{value5}</div>
              <div className="number-bottom">{content?.rate5}%</div>
            </>
          );
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping4'),
        key: nameof(productGroupingStatistics[0].value4),
        dataIndex: nameof(productGroupingStatistics[0].value4),
        ellipsis: true,
        render(...[value4, content]) {
          return (
            <>
              <div className="">{value4}</div>
              <div className="number-bottom">{content?.rate4}%</div>
            </>
          );
        },
      },
      {
        title: translate('dashboardStoreInfo.productGrouping3'),
        key: nameof(productGroupingStatistics[0].value3),
        dataIndex: nameof(productGroupingStatistics[0].value3),
        ellipsis: true,
        render(...[value3, content]) {
          return (
            <>
              <div className="">{value3}</div>
              <div className="number-bottom">{content?.rate3}%</div>
            </>
          );
        },
      },
    ];
  }, [productGroupingStatistics, translate]);

  const columnsBrand: ColumnProps<StoreInfomation>[] = React.useMemo(() => {
    return [
      {
        title() {
          return (
            <div className="ml-3">
              {translate('dashboardStoreInfo.brandName')}
            </div>
          );
        },
        key: nameof(dataSourceTopBrand[0].brandName),
        dataIndex: nameof(dataSourceTopBrand[0].brandName),
        ellipsis: true,
        render(...[brandName]) {
          return <div className="ml-3 brand-name">{brandName}</div>;
        },
      },
      {
        title: translate('dashboardStoreInfo.index'),
        key: nameof(dataSourceTopBrand[0].value),
        dataIndex: nameof(dataSourceTopBrand[0].value),
        ellipsis: true,
        align: 'right',
        render(...[value, content]) {
          return (
            <>
              <div className="">{value}</div>
              <div className="number-bottom">{content?.rate}%</div>
            </>
          );
        },
      },
    ];
  }, [dataSourceTopBrand, translate]);

  const handleChangeType = React.useCallback(
    value => {
      filterTopBrand.top.equal = value;
      setFilterTopBrand({ ...filterTopBrand });
      setLoadingTopBrand(true);
      if (value === 1) {
        setTop1Active(true);
        setTop2Active(false);
        setTop3Active(false);
      }
      if (value === 2) {
        setTop1Active(false);
        setTop2Active(true);
        setTop3Active(false);
      }
      if (value === 3) {
        setTop1Active(false);
        setTop2Active(false);
        setTop3Active(true);
      }
    },
    [filterTopBrand, setLoadingTopBrand],
  );
  return (
    <div className="dashboard-store-infomation">
      <div className="dashboard-title pl-1">
        {translate('dashboardStoreInfo.title')}
      </div>
      <Row className="mt-3">
        <Col className="pl-1" span={4}>
          <FormItem className="mb-1" labelAlign="left">
            <AdvancedTreeFilter
              filter={filter.organizationId}
              filterType={nameof(filter.organizationId.equal)}
              value={filter.organizationId.equal}
              onChange={handleChangeFilter(nameof(filter.organizationId))}
              getList={dashboardStoreInfoRepository.filterListOrganization}
              modelFilter={organizationFilter}
              setModelFilter={setOrganizationFilter}
              placeholder={translate('dashboardStoreInfo.placeholder.org')}
              mode="single"
            />
          </FormItem>
        </Col>
        <Col className="pl-1" span={4}>
          <FormItem className="mb-1" labelAlign="left">
            <AdvancedIdFilter
              filter={filter.provinceId}
              filterType={nameof(filter.provinceId.equal)}
              value={filter.provinceId.equal}
              onChange={handleFilterProvince}
              getList={dashboardStoreInfoRepository.filterListProvince}
              modelFilter={provinceFilter}
              setModelFilter={setProvinceFilter}
              searchField={nameof(provinceFilter.name)}
              searchType={nameof(provinceFilter.name.contain)}
              isReset={isReset}
              setIsReset={setIsReset}
              placeholder={translate('dashboardStoreInfo.placeholder.province')}
            />
          </FormItem>
        </Col>
        <Col className="pl-1" span={4}>
          <FormItem className="mb-1" labelAlign="left">
            <AdvancedIdFilter
              filter={filter.districtId}
              filterType={nameof(filter.districtId.equal)}
              value={filter.districtId.equal}
              onChange={handleChangeFilter(nameof(filter.districtId))}
              getList={dashboardStoreInfoRepository.filterListDistrict}
              modelFilter={districtFilter}
              setModelFilter={setDistrictFilter}
              searchField={nameof(districtFilter.name)}
              searchType={nameof(districtFilter.name.contain)}
              isReset={resetDistrict}
              setIsReset={setResetDistrict}
              disabled={filter.provinceId.equal === undefined ? true : false}
              placeholder={translate('dashboardStoreInfo.placeholder.district')}
            />
          </FormItem>
        </Col>
        <Col className="pl-1" span={4}>
          <FormItem className="mb-1" labelAlign="left">
            <AdvancedIdFilter
              filter={filter.brandId}
              filterType={nameof(filter.brandId.equal)}
              value={filter.brandId.equal}
              onChange={handleChangeFilter(nameof(filter.brandId))}
              getList={dashboardStoreInfoRepository.filterListBrand}
              modelFilter={brandFilter}
              setModelFilter={setBrandFilter}
              searchField={nameof(brandFilter.name)}
              searchType={nameof(brandFilter.name.contain)}
              isReset={isReset}
              setIsReset={setIsReset}
              placeholder={translate('dashboardStoreInfo.placeholder.brand')}
            />
          </FormItem>
        </Col>
      </Row>

      <div className="flex-container flex-row">
        <div className="flex-item flex-item-1 mr-3">
          <div className="survey-card">
            <Card>
              <div className="survey d-flex align-items-center">
                <div className="survey-number ml-3">
                  <div className="survey-number-top mt-3 mb-4 pl-4">
                    <span className="number-top pl-1 pr-1">
                      {formatNumber(dataSurvey?.surveyedStoreCounter)}
                    </span>

                    <span>{translate('dashboardStoreInfo.surveyNumber')}</span>
                  </div>

                  <div className="survey-number-bottom mt-3 mb-3 pl-4">
                    <span className="title-detail pl-1 pr-1">
                      {translate('dashboardStoreInfo.surveyNumberBottom')}
                    </span>

                    <span className="number-bottom">
                      {formatNumber(dataSurvey?.storeCounter)}
                      <span className="pl-1">
                        {translate('dashboardStoreInfo.store')}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="survey-chart mr-4 mt-3 mb-3">
                  <Progress
                    type="circle"
                    percent={dataSurvey?.rate}
                    strokeColor={'#BC2C3D'}
                    width={100}
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="brand-statistics-card mt-3">
            <Card>
              <div className="card-title">
                {translate('dashboardStoreInfo.brand.title')}
              </div>
              <div className="brand-chart">
                {databrand &&
                  databrand?.length > 0 &&
                  databrand?.map((brand, index) => (
                    <div className="mt-3" key={index}>
                      <div className="brand-info">
                        <span
                          className="brand-name"
                          onClick={() => handleExportBrand(brand?.brandId)}
                        >
                          {brand?.brandName}
                        </span>
                        <div className="brand-number">
                          <span className="pl-1">{brand?.value}</span>
                          <span>~</span>
                          <span className="pr-1">{brand?.rate}% </span>
                        </div>
                      </div>
                      <Progress
                        strokeColor={'#499960'}
                        percent={brand?.rate}
                        showInfo={false}
                      />
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          <div className="brand-statistics-card brand-un-statistics-card mt-3">
            <Card>
              <div className="card-title">
                {translate('dashboardStoreInfo.unbrand.title')}
              </div>
              <div className="brand-chart">
                {brandUnStatistics &&
                  brandUnStatistics?.length > 0 &&
                  brandUnStatistics?.map((brand, index) => (
                    <div className="mt-3" key={index}>
                      <div className="brand-info">
                        <div
                          className="brand-name"
                          onClick={() => handleExportUnBrand(brand?.brandId)}
                        >
                          {brand?.brandName}
                        </div>

                        <div className="brand-number">
                          <span className="pl-1">{brand?.value}</span>
                          <span>~</span>
                          <span className="pr-1">{brand?.rate}% </span>
                        </div>
                      </div>
                      <Progress
                        key={index}
                        strokeColor={'#BC2C3D'}
                        percent={brand?.rate}
                        showInfo={false}
                      />
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
        <div className="flex-item flex-item-2">
          {useMemo(
            () => (
              <StoreCoverageMap
                getList={dashboardStoreInfoRepository.storeCoverage}
                getFilterList={
                  dashboardStoreInfoRepository.filterListOrganization
                }
                filter={filter}
                loadMap={loadMap}
                setLoadMap={setLoadMap}
              />
            ),
            [filter, loadMap],
          )}
        </div>
      </div>
      <div className="flex-container flex-row">
        <div className="flex-item flex-item-2 mr-3">
          <Card className="card-product-grouping">
            <div className="card-title card-top-brand-title mb-3">
              {translate('dashboardStoreInfo.productGrouping.title')}
            </div>
            <Table
              dataSource={productGroupingStatistics}
              columns={columns}
              size="small"
              tableLayout="fixed"
              pagination={false}
              className="table-product-grouping mt-4"
              scroll={{ y: 380 }}
              key={uuidv4()}
              rowKey={nameof(dataSource[0].key)}
            />
          </Card>
        </div>
        <div className="flex-item flex-item-1">
          <Card className="card-product-grouping">
            <div className="d-flex card-top-brand">
              <div className="card-title mb-3 card-product-grouping-title">
                {translate('dashboardStoreInfo.topBrand.title')}
              </div>
              <div className="d-flex mr-3">
                <button
                  onClick={() => handleChangeType(1)}
                  className={classNames('btn btn-sm btn-top', {
                    'btn-top-active': to1pActive,
                    '': !to1pActive,
                  })}
                >
                  {translate('dashboardStoreInfo.top1')}
                </button>
                <button
                  onClick={() => handleChangeType(2)}
                  className={classNames('btn btn-sm btn-top', {
                    'btn-top-active': top2Active,
                    '': !top2Active,
                  })}
                >
                  {translate('dashboardStoreInfo.top2')}
                </button>
                <button
                  onClick={() => handleChangeType(3)}
                  className={classNames('btn btn-sm btn-top', {
                    'btn-top-active': top3Active,
                    '': !top3Active,
                  })}
                >
                  {translate('dashboardStoreInfo.top3')}
                </button>
              </div>
            </div>
            <Table
              dataSource={topBrand}
              columns={columnsBrand}
              size="small"
              tableLayout="fixed"
              pagination={false}
              className="table-product-grouping mt-2"
              scroll={{ y: 380 }}
              rowKey={nameof(dataSourceTopBrand[0].key)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
export default DashboardStoreInfoView;
