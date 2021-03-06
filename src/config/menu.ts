import {
  API_BRAND_ROUTE,
  API_CATEGORY_ROUTE,
  API_PRODUCT_GROUPING_ROUTE,
  API_PRODUCT_ROUTE,
  API_PRODUCT_TYPE_ROUTE,
  API_SUPPLIER_ROUTE,
  API_TAX_TYPE_ROUTE,
  API_UNIT_OF_MEASURE_GROUPING_ROUTE,
  API_UNIT_OF_MEASURE_ROUTE,
} from 'config/api-consts';
import {
  ACCOUNT_ROOT_ROUTE,
  ALBUM_MONITOR,
  ALBUM_ROUTE,
  APP_USER_ROUTE,
  BANNER_ROUTE,
  BRAND_ROUTE,
  CATEGORY_ROUTE,
  DASHBOARD_DIRECTOR_ROUTE,
  DASHBOARD_STORE_INFORMATION_ROUTE,
  DASHBOARD_USER_ROUTE,
  DIRECT_SALES_ORDER_OWNER_ROUTE,
  EXPORT_TEMPLATE_ROUTE,
  E_ROUTE_OWNER_ROUTE,
  E_ROUTE_ROUTE,
  INDIRECT_SALES_ORDER_OWNER_ROUTE,
  INDIRECT_SALES_ORDER_ROUTE,
  KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
  KPI_GENERAL_PERIOD_REPORT_ROUTE,
  KPI_GENERAL_ROUTE,
  KPI_ITEM_REPORT_ROUTE,
  KPI_ITEM_ROUTE,
  KPI_PRODUCT_GROUPING_ROUTE,
  KPI_PRODUCT_GROUPING_REPORT_ROUTE,
  LOCATION_ROOT_ROUTE,
  LUCKY_NUMBER_ROUTE,
  MONITOR_ROOT_ROUTE,
  NEW_PRODUCT_ROUTE,
  NOTIFICATION_ROUTE,
  ORGANIZATION_ROUTE,
  PARTNER_ROOT_ROUTE,
  POSM_REPORT_ROOT_ROUTE,
  POSM_ROOT_ROUTE,
  PRICELIST_OWNER_ROUTE,
  PRODUCT_CATEGORY_ROUTE,
  PRODUCT_GROUPING_ROUTE,
  PRODUCT_ROUTE,
  PRODUCT_TYPE_ROUTE,
  PROMOTION_CODE_ROUTE,
  ROLE_ROUTE,
  ROUTE_ROOT_ROUTE,
  SALESMAN_MONITOR,
  SALES_ROOT_ROUTE,
  ORDER_ROOT_ROUTE,
  SHOWING_CATEGORY_ROUTE,
  SHOWING_ITEM_ROOT_ROUTE,
  SHOWING_ITEM_ROUTE,
  SHOWING_ORDER_ROUTE,
  SHOWING_ORDER_WITHDRAW_ROUTE,
  SHOWING_WAREHOUSE_ROUTE,
  STORE_CHECKED_REPORT_ROUTE,
  STORE_CHECKER_MONITOR,
  STORE_GROUPING_ROUTE,
  STORE_IMAGES_MONITOR,
  STORE_PROBLEMS_MONITOR,
  STORE_ROUTE,
  STORE_SCOUTING_ROUTE,
  STORE_SCOUTING_TYPE_ROUTE,
  STORE_STATE_CHANGE_REPORT_ROOT_ROUTE,
  STORE_TYPE_ROUTE,
  STORE_UN_CHECKED_REPORT_ROUTE,
  // SUPPLIER_ROUTE,
  SURVEY_ROUTE,
  TAX_TYPE_ROUTE,
  UNIT_OF_MEASURE_GROUPING_ROUTE,
  UNIT_OF_MEASURE_ROUTE,
  WAREHOUSE_ROUTE,
} from 'config/route-consts';
import { translate } from 'core/helpers/internationalization';
import { RouteConfig } from 'react-router-config';
import {
  DASHBOARD_ROUTE,
  DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  DIRECT_SALES_ORDER_GENERAL_ROUTE,
  DIRECT_SALES_ORDER_ROUTE,
  DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
  INDIRECT_SALES_ORDER_GENERAL_ROUTE,
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  KPI_MANAGEMENT_ROUTE,
  KPI_TRACKING_REPORT_ROUTE,
  PROBLEM_TYPE_ROUTE,
  SALEPRICE_PROMOTION_ROUTE,
  SALEPRICE_ROUTE,
  STATISTIC_PROBLEM_REPORT_ROUTE,
  STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
  STORE_CHECKED_REPORT_ROOT_ROUTE,
  STORE_GENERAL_REPORT_ROUTE,
  STORE_REPORT,
  SYSTEM_CONFIGURATION_ROUTE,
  WORKFLOW_DEFINITION_ROUTE,
  WORKFLOW_DIRECTION_ROUTE,
  WORKFLOW_PARAMETER_ROUTE,
  WORKFLOW_ROOT_ROUTE,
  WORKFLOW_STEP_ROUTE,
} from './route-consts';
export const menu: RouteConfig[] = [
  {
    notTitle: false,
    name: translate('menu.dashboard'),
    path: DASHBOARD_ROUTE,
    key: 'dashboard',
    icon: 'tio-dashboard_outlined',
    children: [
      {
        name: translate('menu.dashboardUser'),
        path: DASHBOARD_USER_ROUTE,
        key: DASHBOARD_USER_ROUTE,
        icon: 'tio-tablet_phone',
      },
      // {
      //   name: translate('menu.dashboardMonitor'),
      //   path: DASHBOARD_MONITOR_ROUTE,
      //   key: DASHBOARD_MONITOR_ROUTE,
      //   icon: 'tio-tablet_phone',
      // },
      {
        name: translate('menu.dashboardDirector'),
        path: DASHBOARD_DIRECTOR_ROUTE,
        key: DASHBOARD_DIRECTOR_ROUTE,
        icon: 'tio-tablet_phone',
      },
      {
        name: translate('menu.dashboardStoreInfo'),
        path: DASHBOARD_STORE_INFORMATION_ROUTE,
        key: DASHBOARD_STORE_INFORMATION_ROUTE,
        icon: 'tio-tablet_phone',
      },
    ],
  },

  {
    notTitle: true,
    name: translate('menu.user'),
    path: '/title-system',
    checkVisible: checkVisible(ACCOUNT_ROOT_ROUTE),
  },
  {
    notTitle: false,
    name: translate('menu.accounts'),
    path: ACCOUNT_ROOT_ROUTE,
    key: ACCOUNT_ROOT_ROUTE,
    icon: 'tio-account_circle',
    children: [
      {
        name: translate('menu.appUsers'),
        path: APP_USER_ROUTE,
        key: APP_USER_ROUTE,
        icon: 'tio-user_add',
      },
      {
        name: translate('menu.roles'),
        path: ROLE_ROUTE,
        key: ROLE_ROUTE,
        icon: 'tio-group_equal',
      },
      {
        name: translate('menu.organization'),
        path: ORGANIZATION_ROUTE,
        key: ORGANIZATION_ROUTE,
        icon: 'tio-category_outlined',
      },
    ],
  },
  {
    notTitle: true,
    name: translate('menu.category'),
    path: '/title-category',
    checkVisible: checkVisible(
      PRODUCT_CATEGORY_ROUTE,
      PARTNER_ROOT_ROUTE,
      LOCATION_ROOT_ROUTE,
      ALBUM_ROUTE,
      PROBLEM_TYPE_ROUTE,
      STORE_SCOUTING_TYPE_ROUTE,
    ),
  },
  {
    notTitle: false,
    name: translate('menu.products'),
    path: PRODUCT_CATEGORY_ROUTE,
    icon: 'tio-light_on',
    key: PRODUCT_CATEGORY_ROUTE,
    visible: true,
    checkVisible: checkVisible(
      `/${`${API_PRODUCT_ROUTE}`}/list`,
      `/${`${API_CATEGORY_ROUTE}`}/list`,
      `/${`${API_PRODUCT_GROUPING_ROUTE}`}/list`,
      `/${`${API_PRODUCT_TYPE_ROUTE}`}/list`,
      `/${`${API_UNIT_OF_MEASURE_ROUTE}`}/list`,
      `/${`${API_UNIT_OF_MEASURE_GROUPING_ROUTE}`}/list`,
      `/${NEW_PRODUCT_ROUTE}`,
      `/${`${API_TAX_TYPE_ROUTE}`}/list`,
    ),
    children: [
      {
        key: PRODUCT_ROUTE,
        name: translate('menu.product'),
        path: PRODUCT_ROUTE,
        icon: 'tio-format_bullets',
        validPath: `/${`${API_PRODUCT_ROUTE}`}/list`,
      },
      {
        name: translate('menu.category'),
        path: CATEGORY_ROUTE,
        key: CATEGORY_ROUTE,
        icon: 'tio-notice_outlined',
        validPath: `/${`${API_CATEGORY_ROUTE}`}/list`,
      }, // used
      {
        key: PRODUCT_GROUPING_ROUTE,
        name: translate('menu.productGroupings'),
        path: PRODUCT_GROUPING_ROUTE,
        icon: 'tio-layers_outlined',
        validPath: `/${`${API_PRODUCT_GROUPING_ROUTE}`}/list`,
      },
      {
        key: PRODUCT_TYPE_ROUTE,
        name: translate('menu.productTypes'),
        path: PRODUCT_TYPE_ROUTE,
        icon: 'tio-clock',
        validPath: `/${`${API_PRODUCT_TYPE_ROUTE}`}/list`,
      },
      {
        key: UNIT_OF_MEASURE_ROUTE,
        name: translate('menu.unitOfMeasures'),
        path: UNIT_OF_MEASURE_ROUTE,
        icon: 'tio-devices_1',
        validPath: `/${`${API_UNIT_OF_MEASURE_ROUTE}`}/list`,
      },
      {
        key: UNIT_OF_MEASURE_GROUPING_ROUTE,
        name: translate('menu.unitOfMeasureGroupings'),
        path: UNIT_OF_MEASURE_GROUPING_ROUTE,
        icon: 'tio-shuffle',
        validPath: `/${`${API_UNIT_OF_MEASURE_GROUPING_ROUTE}`}/list`,
      },
      {
        key: NEW_PRODUCT_ROUTE,
        name: translate('menu.newProduct'),
        path: NEW_PRODUCT_ROUTE,
        icon: 'tio-premium_outlined',
      },
      {
        key: TAX_TYPE_ROUTE,
        name: translate('menu.taxType'),
        path: TAX_TYPE_ROUTE,
        icon: 'tio-document_text_outlined',
        validPath: `/${`${API_TAX_TYPE_ROUTE}`}/list`,
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.partners'),
    path: PARTNER_ROOT_ROUTE,
    key: PARTNER_ROOT_ROUTE,
    icon: 'tio-briefcase_outlined',
    checkVisible: checkVisible(
      `/${`${API_SUPPLIER_ROUTE}`}/list`,
      `/${`${API_BRAND_ROUTE}`}/list`,
    ),
    visible: true,
    children: [
      // {
      //   key: SUPPLIER_ROUTE,
      //   name: translate('menu.suppliers'),
      //   path: SUPPLIER_ROUTE,
      //   icon: 'tio-devices_1',
      //   validPath: `/${`${API_SUPPLIER_ROUTE}`}/list`,
      // },
      {
        key: BRAND_ROUTE,
        name: translate('menu.brands'),
        path: BRAND_ROUTE,
        icon: 'tio-label_outlined',
        validPath: `/${`${API_BRAND_ROUTE}`}/list`,
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.store'),
    path: LOCATION_ROOT_ROUTE,
    key: LOCATION_ROOT_ROUTE,
    icon: 'tio-shop_outlined',
    children: [
      {
        name: translate('menu.stores'),
        path: STORE_ROUTE,
        key: STORE_ROUTE,
        icon: 'tio-format_bullets',
      },
      {
        name: translate('menu.storeTypes'),
        path: STORE_TYPE_ROUTE,
        key: STORE_TYPE_ROUTE,
        icon: 'tio-home_vs_2_outlined',
      },
      {
        name: translate('menu.storeGroupings'),
        path: STORE_GROUPING_ROUTE,
        key: STORE_GROUPING_ROUTE,
        icon: 'tio-free_transform',
      },
      {
        name: translate('menu.storeScouting'),
        path: STORE_SCOUTING_ROUTE,
        key: STORE_SCOUTING_ROUTE,
        icon: 'tio-flag_outlined',
      },
    ],
  },
  {
    name: translate('menu.album'),
    path: ALBUM_ROUTE,
    key: ALBUM_ROUTE,
    icon: 'tio-photo_gallery_outlined',
  },

  {
    name: translate('menu.problemType'),
    path: PROBLEM_TYPE_ROUTE,
    key: PROBLEM_TYPE_ROUTE,
    icon: 'tio-receipt_outlined',
  },
  {
    name: translate('menu.storeScoutingType'),
    path: STORE_SCOUTING_TYPE_ROUTE,
    key: STORE_SCOUTING_TYPE_ROUTE,
    icon: 'tio-flag_cross_1',
  },
  {
    notTitle: true,
    name: translate('menu.warehouses'),
    path: '/title-warehouse',
    checkVisible: checkVisible(WAREHOUSE_ROUTE),
  },
  {
    name: translate('menu.warehouse'),
    path: WAREHOUSE_ROUTE,
    key: WAREHOUSE_ROUTE,
    icon: 'tio-cube',
  },
  {
    notTitle: true,
    name: translate('menu.sales'),
    path: '/title-sales',
    checkVisible: checkVisible(SALES_ROOT_ROUTE, SALEPRICE_PROMOTION_ROUTE),
  },
  {
    notTitle: false,
    name: translate('menu.sales'),
    path: SALES_ROOT_ROUTE,
    key: SALES_ROOT_ROUTE,
    icon: 'tio-shopping_cart_outlined',
    children: [
      {
        name: translate('menu.indirectSalesOrder'),
        path: INDIRECT_SALES_ORDER_ROUTE,
        key: INDIRECT_SALES_ORDER_ROUTE,
        icon: 'tio-swap_horizontal',
      },
      {
        name: translate('menu.indirectSalesOrderOwner'),
        path: INDIRECT_SALES_ORDER_OWNER_ROUTE,
        key: INDIRECT_SALES_ORDER_OWNER_ROUTE,
        icon: 'tio-swap_horizontal',
      },
      {
        name: translate('menu.directSalesOrder'),
        path: DIRECT_SALES_ORDER_ROUTE,
        key: DIRECT_SALES_ORDER_ROUTE,
        icon: 'tio-swap_horizontal',
      },
      {
        name: translate('menu.directSalesOrderOwner'),
        path: DIRECT_SALES_ORDER_OWNER_ROUTE,
        key: DIRECT_SALES_ORDER_OWNER_ROUTE,
        icon: 'tio-swap_horizontal',
      },
    ],
  },
  {
    name: translate('menu.discount'),
    path: SALEPRICE_PROMOTION_ROUTE,
    key: SALEPRICE_PROMOTION_ROUTE,
    icon: 'tio-labels_outlined',
    children: [
      {
        name: translate('menu.priceList'),
        path: SALEPRICE_ROUTE,
        key: 'discount-price-list',
        icon: 'tio-label_outlined',
      },
      {
        name: translate('menu.priceListOwner'),
        path: PRICELIST_OWNER_ROUTE,
        key: 'price-list-owner',
        icon: 'tio-label_outlined',
      },
      {
        name: translate('menu.promotionCode'),
        path: PROMOTION_CODE_ROUTE,
        key: 'promotion-code',
        icon: 'tio-label_outlined',
      },
      {
        name: translate('menu.luckyNumber'),
        path: LUCKY_NUMBER_ROUTE,
        key: 'lucky-number',
        icon: 'tio-label_outlined',
      },
    ],
  },
  {
    notTitle: true,
    name: translate('menu.eRouteMaster'),
    path: '/title-route',
    checkVisible: checkVisible(ROUTE_ROOT_ROUTE, MONITOR_ROOT_ROUTE),
  },
  {
    notTitle: false,
    name: translate('menu.eRouteMaster'),
    path: ROUTE_ROOT_ROUTE,
    key: ROUTE_ROOT_ROUTE,
    icon: 'tio-node_multiple',
    children: [
      {
        name: translate('menu.eRouteMaster'),
        path: E_ROUTE_ROUTE,
        key: E_ROUTE_ROUTE,
        icon: 'tio-swap_vs',
      },
      {
        name: translate('menu.eRouteOwnerMaster'),
        path: E_ROUTE_OWNER_ROUTE,
        key: E_ROUTE_OWNER_ROUTE,
        icon: 'tio-swap_vs',
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.monitor'),
    path: MONITOR_ROOT_ROUTE,
    key: MONITOR_ROOT_ROUTE,
    icon: 'tio-flag_outlined',
    children: [
      {
        name: translate('menu.salesmanMonitor'),
        path: SALESMAN_MONITOR,
        key: SALESMAN_MONITOR,
        icon: 'tio-poi_user',
      },
      {
        name: translate('menu.storeCheckerMonitor'),
        path: STORE_CHECKER_MONITOR,
        key: STORE_CHECKER_MONITOR,
        icon: 'tio-running',
      },
      {
        name: translate('menu.storeImages'),
        path: STORE_IMAGES_MONITOR,
        key: STORE_IMAGES_MONITOR,
        icon: 'tio-mms_outlined',
      },
      {
        name: translate('menu.storeProblems'),
        path: STORE_PROBLEMS_MONITOR,
        key: STORE_PROBLEMS_MONITOR,
        icon: 'tio-sms_chat_outlined',
      },
      {
        name: translate('menu.album'),
        path: ALBUM_MONITOR,
        key: ALBUM_MONITOR,
        icon: 'tio-message_failed_outlined',
      },
    ],
  },
  {
    notTitle: true,
    name: translate('menu.kpiManagement'),
    path: '/title-kpi',
    checkVisible: checkVisible(KPI_MANAGEMENT_ROUTE, KPI_TRACKING_REPORT_ROUTE),
  },
  {
    notTitle: false,
    name: translate('menu.kpi'),
    path: KPI_MANAGEMENT_ROUTE,
    key: KPI_MANAGEMENT_ROUTE,
    icon: 'tio-trending_up',
    children: [
      {
        name: translate('menu.generalKpi'),
        path: KPI_GENERAL_ROUTE,
        icon: 'tio-chart_bar_3',
        key: KPI_GENERAL_ROUTE,
      },
      {
        name: translate('menu.productFocusKpi'),
        path: KPI_ITEM_ROUTE,
        icon: 'tio-checkmark_circle_outlined',
        key: KPI_ITEM_ROUTE,
      },
      {
        name: translate('menu.productGroupingFocusKpi'),
        path: KPI_PRODUCT_GROUPING_ROUTE,
        icon: 'tio-checkmark_circle_outlined',
        key: KPI_PRODUCT_GROUPING_ROUTE,
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.trackingKpi'),
    path: KPI_TRACKING_REPORT_ROUTE,
    icon: 'tio-tune',
    key: KPI_TRACKING_REPORT_ROUTE,
    children: [
      {
        name: translate('menu.reportPreodicKpi'),
        path: KPI_GENERAL_PERIOD_REPORT_ROUTE,
        key: KPI_GENERAL_PERIOD_REPORT_ROUTE,
        icon: 'tio-appointment',
      },
      {
        name: translate('menu.reportEmployeeKpi'),
        path: KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
        key: KPI_GENERAL_EMPLOYEE_REPORT_ROUTE,
        icon: 'tio-group_senior',
      },
      {
        name: translate('menu.reportProductFocusKpi'),
        path: KPI_ITEM_REPORT_ROUTE,
        icon: 'tio-voice_line',
        key: KPI_ITEM_REPORT_ROUTE,
      },

      // ?????i th??m c??i route ??? b??n back end
      {
        name: translate('menu.reportProductGroupingKpi'),
        path: KPI_PRODUCT_GROUPING_REPORT_ROUTE,
        icon: 'tio-voice_line',
        key: KPI_PRODUCT_GROUPING_REPORT_ROUTE,
      },
    ],
  },
  {
    notTitle: true,
    name: translate('menu.posm'),
    path: '/title/posm',
    checkVisible: checkVisible(SHOWING_ITEM_ROOT_ROUTE),
  },
  {
    notTitle: false,
    name: translate('menu.showingItem'),
    path: POSM_ROOT_ROUTE,
    key: POSM_ROOT_ROUTE,
    icon: 'tio-account_circle',
    children: [
      {
        name: translate('menu.showingItem'),
        path: SHOWING_ITEM_ROUTE,
        key: SHOWING_ITEM_ROUTE,
        icon: 'tio-group_equal',
      },
      {
        name: translate('menu.showingCategory'),
        path: SHOWING_CATEGORY_ROUTE,
        key: SHOWING_CATEGORY_ROUTE,
        icon: 'tio-group_equal',
      },
      {
        name: translate('menu.showingWarehouse'),
        path: SHOWING_WAREHOUSE_ROUTE,
        key: SHOWING_WAREHOUSE_ROUTE,
        icon: 'tio-group_equal',
      },
    ],
  },

  {
    notTitle: false,
    name: translate('menu.posmManagement'),
    path: ORDER_ROOT_ROUTE,
    key: ORDER_ROOT_ROUTE,
    icon: 'tio-photo_gallery_outlined',
    children: [
      {
        name: translate('menu.showingOrder'),
        path: SHOWING_ORDER_ROUTE,
        key: SHOWING_ORDER_ROUTE,
        icon: 'tio-group_equal',
      },
      {
        name: translate('menu.showingOrderWithDraw'),
        path: SHOWING_ORDER_WITHDRAW_ROUTE,
        key: SHOWING_ORDER_WITHDRAW_ROUTE,
        icon: 'tio-group_equal',
      },
    ],
  },

  {
    name: translate('menu.posmReport'),
    path: POSM_REPORT_ROOT_ROUTE,
    key: POSM_REPORT_ROOT_ROUTE,
    icon: 'tio-photo_gallery_outlined',
  },
  {
    notTitle: true,
    name: translate('menu.notificationCenter'),
    path: '/title-notification',
    checkVisible: checkVisible(NOTIFICATION_ROUTE, SURVEY_ROUTE, BANNER_ROUTE),
  },

  {
    name: translate('menu.notification'),
    path: NOTIFICATION_ROUTE,
    key: NOTIFICATION_ROUTE,
    icon: 'tio-notice_outlined',
  },
  {
    name: translate('menu.survey'),
    path: SURVEY_ROUTE,
    key: SURVEY_ROUTE,
    icon: 'tio-survey',
  },
  {
    name: translate('menu.banner'),
    path: BANNER_ROUTE,
    key: BANNER_ROUTE,
    icon: 'tio-vibrations',
  },
  {
    notTitle: true,
    name: translate('menu.report'),
    path: '/report',
    checkVisible: checkVisible(
      STORE_CHECKED_REPORT_ROOT_ROUTE,
      INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
      DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
      STORE_REPORT,
    ),
  },
  {
    notTitle: false,
    name: translate('menu.ckeckingReport'),
    path: STORE_CHECKED_REPORT_ROOT_ROUTE,
    key: STORE_CHECKED_REPORT_ROOT_ROUTE,
    icon: 'tio-chart_pie_1',
    children: [
      {
        name: translate('menu.storeCheckerReport'),
        path: STORE_CHECKED_REPORT_ROUTE,
        key: STORE_CHECKED_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.storeUncheckerReport'),
        path: STORE_UN_CHECKED_REPORT_ROUTE,
        key: STORE_UN_CHECKED_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.indirectSalesOrderReport'),
    path: INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
    key: INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
    icon: 'tio-chart_pie_1',
    children: [
      {
        name: translate('menu.salesOrderByEmployeeAndItemReport'),
        path: INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        key: INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.salesOrderByStoreAndItemsReport'),
        path: INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        key: INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.salesOrderByItemsReport'),
        path: INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        key: INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.salesOrderGeneral'),
        path: INDIRECT_SALES_ORDER_GENERAL_ROUTE,
        key: INDIRECT_SALES_ORDER_GENERAL_ROUTE,
        icon: 'tio-record_outlined',
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.directsalesOrderReport'),
    path: DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
    key: DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
    icon: 'tio-chart_pie_1',
    children: [
      {
        name: translate('menu.directsalesOrderByEmployeeAndItemReport'),
        path: DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        key: DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.directSalesOrderByStoreAndItemReport'),
        path: DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        key: DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.directSalesOrderByItemReport'),
        path: DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        key: DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },

      {
        name: translate('menu.directsalesOrderGeneral'),
        path: DIRECT_SALES_ORDER_GENERAL_ROUTE,
        key: DIRECT_SALES_ORDER_GENERAL_ROUTE,
        icon: 'tio-record_outlined',
      },
    ],
  },
  {
    notTitle: false,
    name: translate('menu.storeReport'),
    path: STORE_REPORT,
    key: STORE_REPORT,
    icon: 'tio-chart_pie_1',
    children: [
      {
        name: translate('menu.storeGeneralReport'),
        path: STORE_GENERAL_REPORT_ROUTE,
        key: STORE_GENERAL_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.statisticStoreScoutingReport'),
        path: STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
        key: STATISTIC_STORE_SCOUTING_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.statisticProblemReport'),
        path: STATISTIC_PROBLEM_REPORT_ROUTE,
        key: STATISTIC_PROBLEM_REPORT_ROUTE,
        icon: 'tio-record_outlined',
      },
      {
        name: translate('menu.storeStateChangeReport'),
        path: STORE_STATE_CHANGE_REPORT_ROOT_ROUTE,
        key: STORE_STATE_CHANGE_REPORT_ROOT_ROUTE,
        icon: 'tio-record_outlined',
      },
    ],
  },

  {
    notTitle: true,
    name: translate('menu.admin'),
    path: '/admin',
    checkVisible: checkVisible(
      SYSTEM_CONFIGURATION_ROUTE,
      WORKFLOW_ROOT_ROUTE,
      EXPORT_TEMPLATE_ROUTE,
    ),
  },
  {
    name: translate('menu.systemConfiguration'),
    path: SYSTEM_CONFIGURATION_ROUTE,
    key: SYSTEM_CONFIGURATION_ROUTE,
    icon: 'tio-settings_outlined',
  },
  {
    name: translate('menu.exportTemplate'),
    path: EXPORT_TEMPLATE_ROUTE,
    key: EXPORT_TEMPLATE_ROUTE,
    icon: 'tio-settings_outlined',
  },
  {
    notTitle: false,
    name: translate('menu.workflow'),
    path: WORKFLOW_ROOT_ROUTE,
    icon: 'tio-node_outlined',
    key: 'workflow',
    children: [
      {
        name: translate('menu.workflowDefinition'),
        path: WORKFLOW_DEFINITION_ROUTE,
        key: WORKFLOW_DEFINITION_ROUTE,
        icon: 'tio-repeat',
      },
      {
        name: translate('menu.workflowDirection'),
        path: WORKFLOW_DIRECTION_ROUTE,
        key: WORKFLOW_DIRECTION_ROUTE,
        icon: 'tio-node_multiple_outlined',
      },
      {
        name: translate('menu.workflowStep'),
        path: WORKFLOW_STEP_ROUTE,
        key: WORKFLOW_STEP_ROUTE,
        icon: 'tio-stairs_up',
      },
      {
        name: translate('menu.workflowParameter'),
        path: WORKFLOW_PARAMETER_ROUTE,
        key: WORKFLOW_PARAMETER_ROUTE,
        icon: 'tio-parking_outlined',
      },
    ],
  },
];

function checkVisible(
  ...urls: string[]
): (object: Record<string, number>) => boolean {
  return (object: Record<string, number>) => {
    let display = false;
    if (urls.length > 0) {
      urls.forEach(item => {
        if (object.hasOwnProperty(item)) display = true;
      });
    }
    return display;
  };
} // check whether title is visible or not
