import {
  ALBUM_MONITOR,
  ALBUM_ROUTE,
  APP_USER_ROUTE,
  BANNER_MOBILE_ROUTE,
  BANNER_ROUTE,
  BRAND_ROUTE,
  CATEGORY_DETAIL_ROUTE,
  CATEGORY_ROOT_ROUTE,
  CATEGORY_ROUTE,
  DASHBOARD_DIRECTOR_ROUTE,
  DASHBOARD_MONITOR_ROUTE,
  DASHBOARD_STORE_INFORMATION_ROUTE,
  DASHBOARD_USER_ROUTE,
  DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_DETAIL_ROUTE,
  DIRECT_SALES_ORDER_GENERAL_ROUTE,
  DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE,
  DIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  DIRECT_SALES_ORDER_OWNER_ROUTE,
  DIRECT_SALES_ORDER_ROOT_ROUTE,
  DIRECT_SALES_ORDER_ROUTE,
  EXPORT_ROOT_ROUTE,
  EXPORT_TEMPLATE_DETAIL_ROUTE,
  EXPORT_TEMPLATE_ROUTE,
  E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE,
  E_ROUTE_CHANGE_REQUEST_ROOT_ROUTE,
  E_ROUTE_CHANGE_REQUEST_ROUTE,
  E_ROUTE_DETAIL_ROUTE,
  E_ROUTE_OWNER_DETAIL_ROUTE,
  E_ROUTE_OWNER_OWNER_ROOT_ROUTE,
  E_ROUTE_OWNER_ROUTE,
  E_ROUTE_ROOT_ROUTE,
  E_ROUTE_ROUTE,
  FORBIDENT_ROUTE,
  INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_DETAIL_ROUTE,
  INDIRECT_SALES_ORDER_GENERAL_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_ROUTE,
  INDIRECT_SALES_ORDER_ROOT_ROUTE,
  INDIRECT_SALES_ORDER_ROUTE,
  KPI_GENERAL_DETAIL_ROUTE,
  KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
  KPI_GENERAL_PERIOD_REPORT_ROUTE,
  KPI_GENERAL_ROOT_ROUTE,
  KPI_GENERAL_ROUTE,
  KPI_ITEM_DETAIL_ROUTE,
  KPI_ITEM_REPORT_ROUTE,
  KPI_ITEM_ROOT_ROUTE,
  KPI_ITEM_ROUTE,
  KPI_PRODUCT_GROUPING_ROOT_ROUTE,
  KPI_PRODUCT_GROUPING_ROUTE,
  KPI_PRODUCT_GROUPING_DETAIL_ROUTE,
  KPI_PRODUCT_GROUPING_REPORT_ROUTE,
  LUCKY_NUMBER_ROOT_ROUTE,
  LUCKY_NUMBER_ROUTE,
  NEW_PRODUCT_ROUTE,
  NOTIFICATION_MOBILE_ROUTE,
  NOTIFICATION_ROUTE,
  NOT_FOUND_ROUTE,
  ORGANIZATION_ROUTE,
  POSM_REPORT_ROOT_ROUTE,
  PRICELIST_OWNER_DETAIL_ROUTE,
  PRICELIST_OWNER_ROOT_ROUTE,
  PRICELIST_OWNER_ROUTE,
  PROBLEM_TYPE_ROUTE,
  PRODUCT_DETAIL_ROUTE,
  PRODUCT_GROUPING_ROUTE,
  PRODUCT_ROOT_ROUTE,
  PRODUCT_ROUTE,
  PRODUCT_TYPE_ROUTE,
  PROMOTION_CODE_DETAIL_ROUTE,
  PROMOTION_CODE_PREVIEW_ROUTE,
  PROMOTION_CODE_ROUTE,
  PROMOTION_ROOT_ROUTE,
  ROLE_DETAIL_ROUTE,
  ROLE_ROOT_ROUTE,
  ROLE_ROUTE,
  ROOT_ROUTE,
  SALEPRICE_DETAIL_ROUTE,
  SALEPRICE_ROOT_ROUTE,
  SALEPRICE_ROUTE,
  SALESMAN_MONITOR,
  SHOWING_CATEGORY_DETAIL_ROUTE,
  SHOWING_CATEGORY_ROOT_ROUTE,
  SHOWING_CATEGORY_ROUTE,
  SHOWING_ITEM_DETAIL_ROUTE,
  SHOWING_ITEM_ROOT_ROUTE,
  SHOWING_ITEM_ROUTE,
  SHOWING_ORDER_DETAIL_ROUTE,
  SHOWING_ORDER_ROOT_ROUTE,
  SHOWING_ORDER_ROUTE,
  SHOWING_ORDER_WITHDRAW_DETAIL_ROUTE,
  SHOWING_ORDER_WITHDRAW_ROOT_ROUTE,
  SHOWING_ORDER_WITHDRAW_ROUTE,
  SHOWING_WAREHOUSE_DETAIL_ROUTE,
  SHOWING_WAREHOUSE_ROOT_ROUTE,
  SHOWING_WAREHOUSE_ROUTE,
  STATISTIC_PROBLEM_REPORT_ROUTE,
  STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
  STORE_CHECKED_REPORT_ROUTE,
  STORE_CHECKER_MONITOR,
  STORE_DETAIL_ROUTE,
  STORE_GENERAL_REPORT_ROUTE,
  STORE_GROUPING_ROUTE,
  STORE_IMAGES_MONITOR,
  STORE_PROBLEMS_MONITOR,
  STORE_ROOT_ROUTE,
  STORE_ROUTE,
  STORE_SCOUTING_ROOT_ROUTE,
  STORE_SCOUTING_ROUTE,
  STORE_SCOUTING_TYPE_ROUTE,
  STORE_STATE_CHANGE_REPORT_ROOT_ROUTE,
  STORE_TYPE_ROUTE,
  STORE_UN_CHECKED_REPORT_ROUTE,
  SUPPLIER_DETAIL_ROUTE,
  SUPPLIER_ROOT_ROUTE,
  SUPPLIER_ROUTE,
  SURVEY_DETAIL_ROUTE,
  SURVEY_FORM_ROUTE,
  SURVEY_ROOT_ROUTE,
  SURVEY_ROUTE,
  SYSTEM_CONFIGURATION_ROUTE,
  TAX_TYPE_ROUTE,
  UNIT_OF_MEASURE_GROUPING_DETAIL_ROUTE,
  UNIT_OF_MEASURE_GROUPING_ROOT_ROUTE,
  UNIT_OF_MEASURE_GROUPING_ROUTE,
  UNIT_OF_MEASURE_ROUTE,
  WAREHOUSE_DETAIL_ROUTE,
  WAREHOUSE_ROOT_ROUTE,
  WAREHOUSE_ROUTE,
  WORKFLOW_DEFINITION,
  WORKFLOW_DEFINITION_DETAIL_ROUTE,
  WORKFLOW_DEFINITION_PREVIEW_ROUTE,
  WORKFLOW_DEFINITION_ROUTE,
  WORKFLOW_DIRECTION,
  WORKFLOW_DIRECTION_DETAIL_ROUTE,
  WORKFLOW_DIRECTION_ROUTE,
  WORKFLOW_PARAMETER_ROUTE,
  WORKFLOW_STEP,
  WORKFLOW_STEP_DETAIL_ROUTE,
  WORKFLOW_STEP_ROUTE,
} from 'config/route-consts';
import WithAuth from 'core/components/App/WithAuth';
import DefaultLayout from 'layouts/DefaultLayout/DefaultLayout';
import { join } from 'path';
import React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import AlbumView, { AlbumDetail, AlbumMaster } from 'views/AlbumView/AlbumView';
import AppUserView, { AppUserMaster } from 'views/AppUserView/AppUserView';
import ATestMapView from 'views/ATestMapView/ATestMapView';
import BannerPreviewMobile from 'views/BannerPreviewMobile/BannerPreviewMobile';
import BannerView, {
  BannerDetail,
  BannerMaster,
} from 'views/BannerView/BannerView';
import BrandView, { BrandDetail, BrandMaster } from 'views/BrandView/BrandView';
import CategoryView, {
  CategoryDetail,
  CategoryMaster,
} from 'views/Category/CategoryView';
import DashboardManagerView from 'views/DashboardManagerView/DashboardManagerView';
import DashboardStoreInfoView from 'views/DashboardStoreInfoView/DashboardStoreInfoView';
import DashboardUserView from 'views/DashboardUserView/DashboardUserView';
import DashboardView from 'views/DashboardView/DashboardView';
import DirectSalesOrderOwnerView, {
  DirectSalesOrderOwnerDetail,
  DirectSalesOrderOwnerMaster,
} from 'views/DirectSalesOrderOwnerView/DirectSalesOrderOwnerView';
import DirectSalesOrderView, {
  DirectSalesOrderMaster,
} from 'views/DirectSalesOrderView/DirectSalesOrderView';
import ERouteChangeRequestView, {
  ERouteChangeRequestDetail,
  ERouteChangeRequestMaster,
} from 'views/ERouteChangeRequestView/ERouteChangeRequestView';
import ERouteOwnerView, {
  ERouteOwnerDetail,
  ERouteOwnerMaster,
} from 'views/ERouteOwnerView/ERouteOwnerView';
import ERouteView, {
  // ERouteDetail,

  ERouteMaster,
} from 'views/ERouteView/ERouteView';
import ExportTemplateView, {
  ExportTemplateDetail,
  ExportTemplateMaster,
} from 'views/ExportTemplateView/ExportTemplateView';
import ForbidentView from 'views/ForbidentView/ForbidentView';
import IndirectSalesOrderView, {
  IndirectSalesOrderMaster,
} from 'views/IndirectSalesOrderView/IndirectSalesOrderView';
import IndirectSalesOrderOwnerDetail from 'views/IndirectSalesOrderViewOwner/IndirectSalesOrderDetailOwner/IndirectSalesOrderOwnerDetail';
import IndirectSalesOrderOwnerMaster from 'views/IndirectSalesOrderViewOwner/IndirectSalesOrderOwnerMaster/IndirectSalesOrderOwnerMaster';
import IndirectSalesOrderOwnerView from 'views/IndirectSalesOrderViewOwner/IndirectSalesOrderOwnerView';
import KpiGeneralView, {
  KpiGeneralDetail,
  KpiGeneralMaster,
} from 'views/KpiGeneralView/KpiGeneralView';
import KpiItemView, {
  KpiItemDetail,
  KpiItemMaster,
} from 'views/KpiItemView/KpiItemView';
// test phần kpi nhóm sản phẩm
import KpiProductGroupingView, {
  KpiProductGroupingDetail,
  KpiProductGroupingMaster,
} from 'views/KpiProductGroupingView/KpiProductGroupingView';
import KpiGeneralEmployeeReport from 'views/KpiReport/KpiGeneralEmployeeReport/KpiGeneralEmployeeReport';
import KpiGeneralPeriodReport from 'views/KpiReport/KpiGeneralPeriodReport/KpiGeneralPeriodReport';
import KpiItemsReportView from 'views/KpiReport/KpiItemsReport/KpiItemsReportView';
import KpiProductGroupingsReportView from 'views/KpiReport/KpiProductGroupingsReport/KpiProductGroupingsReportView';
import LuckyNumberView, {
  LuckyNumberMaster,
} from 'views/LuckyNumber/LuckyView';
import AlbumMonitorView from 'views/MonitorView/AlbumMonitor/AlbumMonitorView';
import SalemansMonitorView from 'views/MonitorView/SalemansMonitor/SalemansMonitorView';
import StoreCheckerMonitorView from 'views/MonitorView/StoreCheckerMonitor/StoreCheckerMonitorView';
import StoreImagesMonitorView from 'views/MonitorView/StoreImagesMonitor/StoreImagesMonitorView';
import StoreProblemsMonitorView from 'views/MonitorView/StoreProblemsMonitor/StoreProblemsMonitorView';
import NewProductView, {
  NewProductMaster,
} from 'views/NewProductView/NewProductView';
import NotFoundView from 'views/NotFoundView/NotFoundView';
import NotificationMobileView from 'views/NotificationMobileView/NotificationMobileView';
import NotificationView, {
  NotificationDetail,
  NotificationMaster,
} from 'views/NotificationView/NotificationView';
import OrganizationTreeView, {
  OrganizationTreeMaster,
} from 'views/OrganizationTreeView/OrganizationTreeView';
import ShowingCategoryView, {
  ShowingCategoryDetail,
  ShowingCategoryMaster,
} from 'views/POSM/ShowingCategoryView/ShowingCategoryView';
import ShowingOrderView, {
  ShowingOrderDetail,
  ShowingOrderMaster,
} from 'views/POSM/ShowingOrderView/ShowingOrderView';

import ShowingOrderWithdrawView, {
  ShowingOrderWithdrawDetail,
  ShowingOrderWithdrawMaster,
} from 'views/POSM/ShowingOrderWithdrawView/ShowingOrderWithdrawView';

import ShowingInventories from 'views/POSM/ShowingWarehouseView/Inventories/ShowingInventories';
import ShowingWarehouseView, {
  ShowingWarehouseDetail,
  ShowingWarehouseMaster,
} from 'views/POSM/ShowingWarehouseView/ShowingWarehouseView';
import PriceListView, { PriceListMaster } from 'views/PriceList/PriceListView';
import PriceListOwnerView, {
  PriceListOwnerDetail,
  PriceListOwnerMaster,
} from 'views/PriceListOwner/PriceListOwnerView';
import ProblemTypeView, {
  ProblemTypeDetail,
  ProblemTypeMaster,
} from 'views/ProblemType/ProblemTypeView';
import ProductGroupingTreeView, {
  ProductGroupingTreeDetail,
  ProductGroupingTreeMaster,
} from 'views/ProductGroupingTreeView/ProductGroupingTreeView';
import ProductTypeView, {
  ProductTypeDetail,
  ProductTypeMaster,
} from 'views/ProductTypeView/ProductTypeView';
import ProductView, {
  ProductDetail,
  ProductMaster,
} from 'views/ProductView/ProductView';
import PromotionCodeMaster from 'views/PromotionCodeView/PromotionCodeMaster/PromotionCodeMaster';
import PromotionCodePreview from 'views/PromotionCodeView/PromotionCodeMaster/PromotionCodePreview';
import PromotionCodeView, {
  PromotionCodeDetail,
} from 'views/PromotionCodeView/PromotionCodeView';
import DirectSalesOrderByEmployeeAndItemReportView from 'views/Report/DirectSaleOrderReport/DirectSalesOrderByEmployeeAndItemReportView/DirectSalesOrderByEmployeeAndItemReportView';
import DirectSalesOrderGeneralReportView from 'views/Report/DirectSaleOrderReport/DirectSalesOrderGeneral/DirectSalesOrderGeneralReportView';
import DirectSalesOrderByItemReportView from 'views/Report/DirectSalesOrderByItemReportView/DirectSalesOrderByItemReportView';
import DirectSalesOrderByStoreAndItemsReportView from 'views/Report/DirectSalesOrderByStoreAndItemReportView/DirectSalesOrderByStoreAndItemReportView';
import POSMReportView from 'views/Report/POSMReport/POSMReportView';
import ReportStoreStateChangeView from 'views/Report/ReportStoreStateChangeView/ReportStoreStateChangeView';
import SalesOrderByEmpoyeeAndItemReportView from 'views/Report/SalesOrderByEmployeeAndItemReportView/SalesOrderByEmployeeAndItemReportView';
import SalesOrderByItemsReportView from 'views/Report/SalesOrderByItems/SalesOrderByItemsReportView';
import SalesOrderByStoreAndItemsReportView from 'views/Report/SalesOrderByStoreAndItems/SalesOrderByStoreAndItemsReportView';
import SalesOrderGeneralReportView from 'views/Report/SalesOrderGeneral/SalesOrderGeneralReportView';
import StatisticProblemReportView from 'views/Report/StatisticProblemReportView/StatisticProblemReportView';
import StatisticStoreScoutingReportView from 'views/Report/StatisticStoreScoutingReport/StatisticStoreScoutingReportView';
import StoreCheckerReportView from 'views/Report/StoreCheckerReport/StoreCheckerReportView';
import StoreGeneralReportView from 'views/Report/StoreGeneralReportView/StoreGeneralReportView';
import StoreUnCheckedReportView from 'views/Report/StoreUnCheckedReport/StoreUnCheckedReportView';
import RoleView, {
  AppUserRoleDetail,
  PermissionRoleDetail,
  RoleMaster,
} from 'views/RoleView/RoleView';
import ShowingItemView, {
  ShowingItemDetail,
  ShowingItemMaster,
} from 'views/ShowingItemView/ShowingItemView';
import StoreGroupingTreeView, {
  StoreGroupingTreeDetail,
  StoreGroupingTreeMaster,
} from 'views/StoreGroupingTreeView/StoreGroupingTreeView';
import StoreScoutingTypeDetail from 'views/StoreScoutingTypeView/StoreScoutingTypeDetail/StoreScoutingTypeDetail';
import StoreScoutingTypeView, {
  StoreScoutingTypeMaster,
} from 'views/StoreScoutingTypeView/StoreScoutingTypeView';
import StoreScoutingView, {
  StoreScoutingMaster,
} from 'views/StoreScoutingView/StoreScoutingView';
import StoreTypeView, {
  StoreTypeDetail,
  StoreTypeMaster,
} from 'views/StoreTypeView/StoreTypeView';
import StoreView, { StoreDetail, StoreMaster } from 'views/StoreView/StoreView';
import SupplierView, {
  SupplierDetail,
  SupplierMaster,
} from 'views/SupplierView/SupplierView';
import SurverQuestionnaire from 'views/SurveyQuestionnaire/SurveyQuestionnaire';
import SurveyView, {
  SurveyDetail,
  SurveyMaster,
} from 'views/SurveyView/SurveyView';
import SystemConfigurationView from 'views/SystemConfiguration/SystemConfigurationView';
import TaxTypeView, {
  TaxTypeDetail,
  TaxTypeMaster,
} from 'views/TaxTypeView/TaxTypeView';
import UnitOfMeasureGroupingView, {
  UnitOfMeasureGroupingDetail,
  UnitOfMeasureGroupingMaster,
} from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingView';
import UnitOfMeasureView, {
  UnitOfMeasureDetail,
  UnitOfMeasureMaster,
} from 'views/UnitOfMeasureView/UnitOfMeasureView';
import Inventories from 'views/WarehouseView/Inventories/Inventories';
import WarehouseView, {
  WarehouseDetail,
  WarehouseMaster,
} from 'views/WarehouseView/WarehouseView';
import WorkflowDefinitionView, {
  WorkflowDefinitionDetail,
  WorkflowDefinitionMaster,
  WorkflowDefinitionPreview,
} from 'views/WorkflowDefinitionView/WorkflowDefinitionView';
import WorkflowDirectionView, {
  WorkflowDirectionDetail,
  WorkflowDirectionMaster,
} from 'views/WorkflowDirectionView/WorkflowDirectionView';
import WorkflowParameterMaster from 'views/WorkflowParameterView/WorkflowParameterMaster';
import WorkflowStepView, {
  WorkflowStepDetail,
  WorkflowStepMaster,
} from 'views/WorkflowStepView/WorkflowStepView';
import {
  API_BRAND_ROUTE,
  API_CATEGORY_ROUTE,
  API_PRODUCT_GROUPING_ROUTE,
  API_PRODUCT_ROUTE,
  API_PRODUCT_TYPE_ROUTE,
  API_SHOWING_ITEM_ROUTE,
  API_SUPPLIER_ROUTE,
  API_TAX_TYPE_ROUTE,
  API_UNIT_OF_MEASURE_GROUPING_ROUTE,
  API_UNIT_OF_MEASURE_ROUTE,
} from './api-consts';
export const routes: RouteConfig[] = [
  {
    path: join(SURVEY_FORM_ROUTE, ':id'),
    exact: true,
    component: SurverQuestionnaire,
  },
  {
    path: join(BANNER_MOBILE_ROUTE, ':id'),
    exact: true,
    component: BannerPreviewMobile,
  },
  {
    path: join(NOTIFICATION_MOBILE_ROUTE, ':id'),
    exact: true,
    component: NotificationMobileView,
  },
  {
    path: NOT_FOUND_ROUTE,
    exact: true,
    component: NotFoundView,
  },
  {
    path: FORBIDENT_ROUTE,
    component: ForbidentView,
    exact: true,
  },
  {
    key: 'main',
    path: ROOT_ROUTE,
    component: DefaultLayout,
    routes: [
      {
        path: WORKFLOW_DEFINITION,
        component: WorkflowDefinitionView,
        children: [
          {
            path: join(WORKFLOW_DEFINITION_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              WorkflowDefinitionDetail,
              `${WORKFLOW_DEFINITION_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(WORKFLOW_DEFINITION_PREVIEW_ROUTE, ':id'),
            component: WithAuth(
              WorkflowDefinitionPreview,
              `${WORKFLOW_DEFINITION_PREVIEW_ROUTE}/*`,
            ),
          },
          {
            path: join(WORKFLOW_DEFINITION_ROUTE),
            component: WithAuth(
              WorkflowDefinitionMaster,
              `${WORKFLOW_DEFINITION_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: WORKFLOW_PARAMETER_ROUTE,
        component: WorkflowParameterMaster,
      },
      {
        path: WORKFLOW_DIRECTION,
        component: WorkflowDirectionView,
        children: [
          {
            path: join(WORKFLOW_DIRECTION_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              WorkflowDirectionDetail,
              `${WORKFLOW_DIRECTION_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(WORKFLOW_DIRECTION_ROUTE),
            component: WithAuth(
              WorkflowDirectionMaster,
              `${WORKFLOW_DIRECTION_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: WORKFLOW_STEP,
        component: WorkflowStepView,
        children: [
          {
            path: join(WORKFLOW_STEP_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              WorkflowStepDetail,
              `${WORKFLOW_STEP_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(WORKFLOW_STEP_ROUTE),
            component: WithAuth(WorkflowStepMaster, `${WORKFLOW_STEP_ROUTE}`),
          },
        ],
      },
      {
        path: APP_USER_ROUTE,
        component: AppUserView,
        children: [
          {
            path: join(APP_USER_ROUTE),
            component: WithAuth(AppUserMaster, `${APP_USER_ROUTE}`),
          },
        ],
      },
      {
        path: ORGANIZATION_ROUTE,
        component: OrganizationTreeView,
        children: [
          {
            path: join(ORGANIZATION_ROUTE),
            component: WithAuth(
              OrganizationTreeMaster,
              `${ORGANIZATION_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: ROLE_ROOT_ROUTE,
        component: RoleView,
        children: [
          {
            path: join(ROLE_DETAIL_ROUTE, 'assign-app-user/:id'),
            component: WithAuth(AppUserRoleDetail, `${ROLE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(ROLE_DETAIL_ROUTE, 'permission-role/:id'),
            component: WithAuth(PermissionRoleDetail, `${ROLE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(ROLE_DETAIL_ROUTE, ':id'),
            component: WithAuth(PermissionRoleDetail, `${ROLE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(ROLE_ROUTE),
            component: WithAuth(RoleMaster, `${ROLE_ROUTE}`),
          },
        ],
      },
      {
        path: BRAND_ROUTE,
        component: BrandView,
        children: [
          {
            path: join(BRAND_ROUTE, ':id'),
            component: BrandDetail,
          },
          {
            path: join(BRAND_ROUTE),
            component: WithAuth(BrandMaster, `/${`${API_BRAND_ROUTE}`}/list`),
          },
        ],
      },
      {
        path: SUPPLIER_ROOT_ROUTE,
        component: SupplierView,
        children: [
          {
            path: join(SUPPLIER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              SupplierDetail,
              `/${`${API_SUPPLIER_ROUTE}`}/list`,
            ),
          },
          {
            path: join(SUPPLIER_ROUTE),
            component: WithAuth(
              SupplierMaster,
              `/${`${API_SUPPLIER_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: SHOWING_ITEM_ROOT_ROUTE,
        component: ShowingItemView,
        children: [
          {
            path: join(SHOWING_ITEM_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ShowingItemDetail,
              `/${`${API_SHOWING_ITEM_ROUTE}`}/list`,
            ),
          },
          {
            path: join(SHOWING_ITEM_ROUTE),
            component: WithAuth(
              ShowingItemMaster,
              `/${`${API_SHOWING_ITEM_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: E_ROUTE_ROOT_ROUTE,
        component: ERouteView,
        children: [
          {
            path: join(E_ROUTE_DETAIL_ROUTE, ':id'),
            component: WithAuth(ERouteOwnerDetail, `${E_ROUTE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(E_ROUTE_ROUTE),
            component: WithAuth(ERouteMaster, `${E_ROUTE_ROUTE}`),
          },
        ],
      },
      {
        path: PRODUCT_ROOT_ROUTE,
        component: ProductView,
        children: [
          {
            path: join(PRODUCT_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ProductDetail,
              `/${`${API_PRODUCT_ROUTE}`}/list`,
            ),
          },
          {
            path: join(PRODUCT_ROUTE),
            component: WithAuth(
              ProductMaster,
              `/${`${API_PRODUCT_ROUTE}`}/list`,
            ),
          },
        ],
      },

      {
        path: PRODUCT_GROUPING_ROUTE,
        component: ProductGroupingTreeView,
        children: [
          {
            path: join(PRODUCT_GROUPING_ROUTE, ':id'),
            component: ProductGroupingTreeDetail,
          },
          {
            path: join(PRODUCT_GROUPING_ROUTE),
            component: WithAuth(
              ProductGroupingTreeMaster,
              `/${`${API_PRODUCT_GROUPING_ROUTE}`}/list`,
            ),
          },
        ],
      },

      {
        path: PRODUCT_TYPE_ROUTE,
        component: ProductTypeView,
        children: [
          {
            path: join(PRODUCT_TYPE_ROUTE, ':id'),
            component: ProductTypeDetail,
          },
          {
            path: join(PRODUCT_TYPE_ROUTE),
            component: WithAuth(
              ProductTypeMaster,
              `/${`${API_PRODUCT_TYPE_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: STORE_ROOT_ROUTE,
        component: StoreView,
        children: [
          {
            path: join(STORE_DETAIL_ROUTE, ':id'),
            component: WithAuth(StoreDetail, `${STORE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(STORE_ROUTE),
            component: WithAuth(StoreMaster, `${STORE_ROUTE}`),
          },
        ],
      },
      {
        path: STORE_TYPE_ROUTE,
        component: StoreTypeView,
        children: [
          {
            path: join(STORE_TYPE_ROUTE, ':id'),
            component: StoreTypeDetail,
          },
          {
            path: join(STORE_TYPE_ROUTE),
            component: WithAuth(StoreTypeMaster, `${STORE_TYPE_ROUTE}`),
          },
        ],
      },

      {
        path: STORE_GROUPING_ROUTE,
        component: StoreGroupingTreeView,
        children: [
          {
            path: join(STORE_GROUPING_ROUTE, ':id'),
            component: StoreGroupingTreeDetail,
          },
          {
            path: join(STORE_GROUPING_ROUTE),
            component: WithAuth(
              StoreGroupingTreeMaster,
              `${STORE_GROUPING_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: UNIT_OF_MEASURE_ROUTE,
        component: UnitOfMeasureView,
        children: [
          {
            path: join(UNIT_OF_MEASURE_ROUTE, ':id'),
            component: UnitOfMeasureDetail,
          },
          {
            path: join(UNIT_OF_MEASURE_ROUTE),
            component: WithAuth(
              UnitOfMeasureMaster,
              `/${`${API_UNIT_OF_MEASURE_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: UNIT_OF_MEASURE_GROUPING_ROOT_ROUTE,
        component: UnitOfMeasureGroupingView,
        children: [
          {
            path: join(UNIT_OF_MEASURE_GROUPING_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              UnitOfMeasureGroupingDetail,
              `/${`${API_UNIT_OF_MEASURE_GROUPING_ROUTE}`}/list`,
            ),
          },
          {
            path: join(UNIT_OF_MEASURE_GROUPING_ROUTE),
            component: WithAuth(
              UnitOfMeasureGroupingMaster,
              `/${`${API_UNIT_OF_MEASURE_GROUPING_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: WAREHOUSE_ROOT_ROUTE,
        component: WarehouseView,
        children: [
          {
            path: join(WAREHOUSE_DETAIL_ROUTE, 'inventories/:id'),
            component: WithAuth(Inventories, `${WAREHOUSE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(WAREHOUSE_DETAIL_ROUTE, ':id'),
            component: WithAuth(WarehouseDetail, `${WAREHOUSE_DETAIL_ROUTE}/*`),
          },
          {
            path: join(WAREHOUSE_ROUTE),
            component: WithAuth(WarehouseMaster, `${WAREHOUSE_ROUTE}`),
          },
        ],
      },
      {
        path: '/dms/test1',
        component: ATestMapView,
      },
      {
        path: INDIRECT_SALES_ORDER_ROOT_ROUTE,
        component: IndirectSalesOrderView,
        children: [
          {
            path: join(INDIRECT_SALES_ORDER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              IndirectSalesOrderOwnerDetail,
              `${INDIRECT_SALES_ORDER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(INDIRECT_SALES_ORDER_ROUTE),
            component: WithAuth(
              IndirectSalesOrderMaster,
              `${INDIRECT_SALES_ORDER_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
        component: IndirectSalesOrderOwnerView,
        children: [
          {
            path: join(INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              IndirectSalesOrderOwnerDetail,
              `${INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(INDIRECT_SALES_ORDER_OWNER_ROUTE),
            component: WithAuth(
              IndirectSalesOrderOwnerMaster,
              `${INDIRECT_SALES_ORDER_OWNER_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: DIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
        component: DirectSalesOrderOwnerView,
        children: [
          {
            path: join(DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              DirectSalesOrderOwnerDetail,
              `${DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(DIRECT_SALES_ORDER_OWNER_ROUTE),
            component: WithAuth(
              DirectSalesOrderOwnerMaster,
              `${DIRECT_SALES_ORDER_OWNER_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: DIRECT_SALES_ORDER_ROOT_ROUTE,
        component: DirectSalesOrderView,
        children: [
          {
            path: join(DIRECT_SALES_ORDER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              DirectSalesOrderOwnerDetail,
              `${DIRECT_SALES_ORDER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(DIRECT_SALES_ORDER_ROUTE),
            component: WithAuth(
              DirectSalesOrderMaster,
              `${DIRECT_SALES_ORDER_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: E_ROUTE_CHANGE_REQUEST_ROOT_ROUTE,
        component: ERouteChangeRequestView,
        children: [
          {
            path: join(E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ERouteChangeRequestDetail,
              `${E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(E_ROUTE_CHANGE_REQUEST_ROUTE),
            component: WithAuth(
              ERouteChangeRequestMaster,
              `${E_ROUTE_CHANGE_REQUEST_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: NEW_PRODUCT_ROUTE,
        component: NewProductView,
        children: [
          {
            path: join(NEW_PRODUCT_ROUTE),
            component: WithAuth(NewProductMaster, `${NEW_PRODUCT_ROUTE}`),
          },
        ],
      },
      {
        path: KPI_GENERAL_ROOT_ROUTE,
        component: KpiGeneralView,
        children: [
          {
            path: join(KPI_GENERAL_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              KpiGeneralDetail,
              `${KPI_GENERAL_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: KPI_GENERAL_ROUTE,
            component: WithAuth(KpiGeneralMaster, `${KPI_GENERAL_ROUTE}`),
          },
        ],
      },
      {
        path: TAX_TYPE_ROUTE,
        component: TaxTypeView,
        children: [
          {
            path: join(TAX_TYPE_ROUTE, ':id'),
            component: TaxTypeDetail,
          },
          {
            path: join(TAX_TYPE_ROUTE),
            component: WithAuth(
              TaxTypeMaster,
              `/${`${API_TAX_TYPE_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: E_ROUTE_CHANGE_REQUEST_ROUTE,
        component: ERouteChangeRequestView,
        children: [
          {
            path: join(E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ERouteChangeRequestDetail,
              `${E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(E_ROUTE_CHANGE_REQUEST_ROUTE),
            component: WithAuth(
              ERouteChangeRequestMaster,
              `${E_ROUTE_CHANGE_REQUEST_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: NOTIFICATION_ROUTE,
        component: NotificationView,
        children: [
          {
            path: join(NOTIFICATION_ROUTE, ':id'),
            component: NotificationDetail,
          },
          {
            path: join(NOTIFICATION_ROUTE),
            component: WithAuth(NotificationMaster, `${NOTIFICATION_ROUTE}`),
          },
        ],
      },
      {
        path: BANNER_ROUTE,
        component: BannerView,
        children: [
          {
            path: join(BANNER_ROUTE, ':id'),
            component: BannerDetail,
          },
          {
            path: join(BANNER_ROUTE),
            component: WithAuth(BannerMaster, `${BANNER_ROUTE}`),
          },
        ],
      },
      {
        path: SURVEY_ROOT_ROUTE,
        component: SurveyView,
        children: [
          {
            path: join(SURVEY_DETAIL_ROUTE, ':id'),
            component: SurveyDetail,
          },
          {
            path: join(SURVEY_ROUTE),
            component: WithAuth(SurveyMaster, `${SURVEY_ROUTE}`),
          },
        ],
      },
      {
        path: ALBUM_ROUTE,
        component: AlbumView,
        children: [
          {
            path: join(ALBUM_ROUTE, ':id'),
            component: AlbumDetail,
          },
          {
            path: join(ALBUM_ROUTE),
            component: WithAuth(AlbumMaster, `${ALBUM_ROUTE}`),
          },
        ],
      },
      {
        path: STORE_CHECKER_MONITOR,
        component: WithAuth(
          StoreCheckerMonitorView,
          `${STORE_CHECKER_MONITOR}`,
        ),
      },
      {
        path: SALESMAN_MONITOR,
        component: WithAuth(SalemansMonitorView, `${SALESMAN_MONITOR}`),
      },
      {
        path: STORE_IMAGES_MONITOR,
        component: WithAuth(StoreImagesMonitorView, `${STORE_IMAGES_MONITOR}`),
      },
      {
        path: STORE_PROBLEMS_MONITOR,
        component: WithAuth(
          StoreProblemsMonitorView,
          `${STORE_PROBLEMS_MONITOR}`,
        ),
      },
      {
        path: ALBUM_MONITOR,
        component: WithAuth(AlbumMonitorView, `${ALBUM_MONITOR}`),
      },
      {
        path: PROBLEM_TYPE_ROUTE,
        component: ProblemTypeView,
        children: [
          {
            path: join(PROBLEM_TYPE_ROUTE, ':id'),
            component: ProblemTypeDetail,
          },
          {
            path: join(PROBLEM_TYPE_ROUTE),
            component: WithAuth(ProblemTypeMaster, `${PROBLEM_TYPE_ROUTE}`),
          },
        ],
      },
      {
        path: STORE_SCOUTING_ROOT_ROUTE,
        component: StoreScoutingView,
        children: [
          {
            path: join(STORE_SCOUTING_ROUTE),
            component: WithAuth(StoreScoutingMaster, `${STORE_SCOUTING_ROUTE}`),
          },
        ],
      },
      {
        path: KPI_GENERAL_PERIOD_REPORT_ROUTE,
        component: WithAuth(
          KpiGeneralPeriodReport,
          `${KPI_GENERAL_PERIOD_REPORT_ROUTE}`,
        ),
      },
      {
        path: KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
        component: WithAuth(
          KpiGeneralEmployeeReport,
          `${KPI_GENERAL_EMPLOYEE_REPORT_ROUTE}`,
        ),
      },
      {
        path: KPI_ITEM_REPORT_ROUTE,
        component: WithAuth(KpiItemsReportView, `${KPI_ITEM_REPORT_ROUTE}`),
      },
      // test báo cáo kpi nhóm sản phẩm
      {
        path: KPI_PRODUCT_GROUPING_REPORT_ROUTE,
        component: WithAuth(
          KpiProductGroupingsReportView,
          `${KPI_PRODUCT_GROUPING_REPORT_ROUTE}`,
        ),
      },
      {
        path: DASHBOARD_MONITOR_ROUTE,
        component: WithAuth(DashboardView, `${DASHBOARD_MONITOR_ROUTE}`),
      },
      {
        path: DASHBOARD_USER_ROUTE,
        component: DashboardUserView,
      },
      {
        path: DASHBOARD_STORE_INFORMATION_ROUTE,
        component: DashboardStoreInfoView,
      },
      {
        path: DASHBOARD_DIRECTOR_ROUTE,
        component: WithAuth(
          DashboardManagerView,
          `${DASHBOARD_DIRECTOR_ROUTE}`,
        ),
      },
      {
        path: KPI_ITEM_ROOT_ROUTE,
        component: KpiItemView,
        children: [
          {
            path: join(KPI_ITEM_DETAIL_ROUTE, ':id'),
            component: WithAuth(KpiItemDetail, `${KPI_ITEM_DETAIL_ROUTE}/*`),
          },
          {
            path: join(KPI_ITEM_ROUTE),
            component: WithAuth(KpiItemMaster, `${KPI_ITEM_ROUTE}`),
          },
        ],
      },
      {
        path: KPI_PRODUCT_GROUPING_ROOT_ROUTE,
        component: KpiProductGroupingView,
        children: [
          {
            path: join(KPI_PRODUCT_GROUPING_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              KpiProductGroupingDetail,
              `${KPI_PRODUCT_GROUPING_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(KPI_PRODUCT_GROUPING_ROUTE),
            component: WithAuth(
              KpiProductGroupingMaster,
              `${KPI_PRODUCT_GROUPING_ROUTE}`,
            ),
          },
        ],
      },

      {
        path: STORE_CHECKED_REPORT_ROUTE,
        component: WithAuth(
          StoreCheckerReportView,
          `${STORE_CHECKED_REPORT_ROUTE}`,
        ),
      },
      {
        path: STORE_UN_CHECKED_REPORT_ROUTE,
        component: WithAuth(
          StoreUnCheckedReportView,
          `${STORE_UN_CHECKED_REPORT_ROUTE}`,
        ),
      },
      {
        path: INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        component: WithAuth(
          SalesOrderByEmpoyeeAndItemReportView,
          `${INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        component: WithAuth(
          SalesOrderByStoreAndItemsReportView,
          `${INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        component: WithAuth(
          SalesOrderByItemsReportView,
          `${INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: INDIRECT_SALES_ORDER_GENERAL_ROUTE,
        component: WithAuth(
          SalesOrderGeneralReportView,
          `${INDIRECT_SALES_ORDER_GENERAL_ROUTE}`,
        ),
      },
      {
        path: STORE_GENERAL_REPORT_ROUTE,
        component: WithAuth(
          StoreGeneralReportView,
          `${STORE_GENERAL_REPORT_ROUTE}`,
        ),
      },
      {
        path: SYSTEM_CONFIGURATION_ROUTE,
        component: WithAuth(
          SystemConfigurationView,
          `${SYSTEM_CONFIGURATION_ROUTE}`,
        ),
      },
      {
        path: STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
        component: WithAuth(
          StatisticStoreScoutingReportView,
          `${STATISTIC_STORE_SCOUTING_REPORT_ROUTE}`,
        ),
      },
      {
        path: STORE_STATE_CHANGE_REPORT_ROOT_ROUTE,
        component: WithAuth(
          ReportStoreStateChangeView,
          `${STORE_STATE_CHANGE_REPORT_ROOT_ROUTE}`,
        ),
      },
      {
        path: ROOT_ROUTE,
        exact: true,
        render() {
          return <Redirect to={DASHBOARD_USER_ROUTE} />;
        },
      },
      {
        path: SALEPRICE_ROOT_ROUTE,
        component: PriceListView,
        children: [
          {
            path: join(SALEPRICE_DETAIL_ROUTE, ':id'),
            component: PriceListOwnerDetail,
          },
          {
            path: SALEPRICE_ROUTE,
            component: PriceListMaster,
          },
        ],
      },
      {
        path: STATISTIC_PROBLEM_REPORT_ROUTE,
        component: WithAuth(
          StatisticProblemReportView,
          `${STATISTIC_PROBLEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        component: WithAuth(
          DirectSalesOrderByEmployeeAndItemReportView,
          `${DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: DIRECT_SALES_ORDER_GENERAL_ROUTE,
        component: WithAuth(
          DirectSalesOrderGeneralReportView,
          `${DIRECT_SALES_ORDER_GENERAL_ROUTE}`,
        ),
      },
      {
        path: DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        component: WithAuth(
          DirectSalesOrderByStoreAndItemsReportView,
          `${DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        component: WithAuth(
          DirectSalesOrderByItemReportView,
          `${DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE}`,
        ),
      },
      {
        path: STORE_SCOUTING_TYPE_ROUTE,
        component: StoreScoutingTypeView,
        children: [
          {
            path: join(STORE_SCOUTING_TYPE_ROUTE, ':id'),
            component: StoreScoutingTypeDetail,
          },
          {
            path: join(STORE_SCOUTING_TYPE_ROUTE),
            component: WithAuth(
              StoreScoutingTypeMaster,
              `${STORE_SCOUTING_TYPE_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: PROMOTION_ROOT_ROUTE,
        component: PromotionCodeView,
        children: [
          {
            path: join(PROMOTION_CODE_DETAIL_ROUTE, ':id'),
            component: PromotionCodeDetail,
          },
          {
            path: join(PROMOTION_CODE_ROUTE),
            component: WithAuth(PromotionCodeMaster, `${PROMOTION_CODE_ROUTE}`),
          },
          {
            path: join(PROMOTION_CODE_PREVIEW_ROUTE, ':id'),
            component: PromotionCodePreview,
          },
        ],
      },
      {
        path: E_ROUTE_OWNER_OWNER_ROOT_ROUTE,
        component: ERouteOwnerView,
        children: [
          {
            path: join(E_ROUTE_OWNER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ERouteOwnerDetail,
              `${E_ROUTE_OWNER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(E_ROUTE_OWNER_ROUTE),
            component: WithAuth(ERouteOwnerMaster, `${E_ROUTE_OWNER_ROUTE}`),
          },
        ],
      },
      {
        path: PRICELIST_OWNER_ROOT_ROUTE,
        component: PriceListOwnerView,
        children: [
          {
            path: join(PRICELIST_OWNER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              PriceListOwnerDetail,
              `${PRICELIST_OWNER_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: join(PRICELIST_OWNER_ROUTE),
            component: WithAuth(
              PriceListOwnerMaster,
              `${PRICELIST_OWNER_ROUTE}`,
            ),
          },
        ],
      },
      {
        path: LUCKY_NUMBER_ROOT_ROUTE,
        component: LuckyNumberView,
        children: [
          {
            path: join(LUCKY_NUMBER_ROUTE),
            // component: WithAuth(LuckyNumberMaster, `${LUCKY_NUMBER_ROUTE}`),
            component: LuckyNumberMaster,
          },
        ],
      },
      {
        path: CATEGORY_ROOT_ROUTE,
        component: CategoryView,
        children: [
          {
            path: CATEGORY_ROUTE,
            component: WithAuth(
              CategoryMaster,
              `/${`${API_CATEGORY_ROUTE}`}/list`,
            ),
          },
          {
            path: join(CATEGORY_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              CategoryDetail,
              `/${`${API_CATEGORY_ROUTE}`}/list`,
            ),
          },
        ],
      },
      {
        path: SHOWING_CATEGORY_ROOT_ROUTE,
        component: ShowingCategoryView,
        children: [
          {
            path: SHOWING_CATEGORY_ROUTE,
            component: WithAuth(
              ShowingCategoryMaster,
              `${SHOWING_CATEGORY_ROUTE}`,
            ),
          },
          {
            path: join(SHOWING_CATEGORY_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ShowingCategoryDetail,
              `${SHOWING_CATEGORY_DETAIL_ROUTE}/*`,
            ),
          },
        ],
      },
      {
        path: SHOWING_WAREHOUSE_ROOT_ROUTE,
        component: ShowingWarehouseView,
        children: [
          {
            path: join(SHOWING_WAREHOUSE_DETAIL_ROUTE, 'inventories/:id'),
            component: WithAuth(
              ShowingInventories,
              `${SHOWING_WAREHOUSE_DETAIL_ROUTE}/*`,
            ),
          },
          {
            path: SHOWING_WAREHOUSE_ROUTE,
            component: WithAuth(
              ShowingWarehouseMaster,
              `${SHOWING_WAREHOUSE_ROUTE}`,
            ),
          },
          {
            path: join(SHOWING_WAREHOUSE_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ShowingWarehouseDetail,
              `${SHOWING_WAREHOUSE_DETAIL_ROUTE}/*`,
            ),
          },
        ],
      },

      {
        path: SHOWING_ORDER_ROOT_ROUTE,
        component: ShowingOrderView,
        children: [
          {
            path: SHOWING_ORDER_ROUTE,
            component: WithAuth(ShowingOrderMaster, `${SHOWING_ORDER_ROUTE}`),
          },
          {
            path: join(SHOWING_ORDER_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ShowingOrderDetail,
              `${SHOWING_ORDER_DETAIL_ROUTE}/*`,
            ),
          },
        ],
      },

      {
        path: SHOWING_ORDER_WITHDRAW_ROOT_ROUTE,
        component: ShowingOrderWithdrawView,
        children: [
          {
            path: SHOWING_ORDER_WITHDRAW_ROUTE,
            component: WithAuth(
              ShowingOrderWithdrawMaster,
              `${SHOWING_ORDER_WITHDRAW_ROUTE}`,
            ),
          },
          {
            path: join(SHOWING_ORDER_WITHDRAW_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ShowingOrderWithdrawDetail,
              `${SHOWING_ORDER_WITHDRAW_DETAIL_ROUTE}/*`,
            ),
          },
        ],
      },

      {
        path: POSM_REPORT_ROOT_ROUTE,
        component: WithAuth(POSMReportView, `${POSM_REPORT_ROOT_ROUTE}`),
      },
      {
        path: EXPORT_ROOT_ROUTE,
        component: ExportTemplateView,
        children: [
          {
            path: EXPORT_TEMPLATE_ROUTE,
            component: WithAuth(
              ExportTemplateMaster,
              `${EXPORT_TEMPLATE_ROUTE}`,
            ),
          },
          {
            path: join(EXPORT_TEMPLATE_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              ExportTemplateDetail,
              `${EXPORT_TEMPLATE_DETAIL_ROUTE}/*`,
            ),
          },
        ],
      },
      {
        path: '/dms/:path',
        render() {
          return <Redirect to={NOT_FOUND_ROUTE} />;
        },
      },
    ],
  },
  {
    path: '/:path',
    render() {
      return <Redirect to={NOT_FOUND_ROUTE} />;
    },
  },
];
