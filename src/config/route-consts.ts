import { join } from 'path';

export const ROOT_ROUTE: string = '/dms';

export const DASHBOARD_ROUTE: string = '/dms/dashboards';
export const DASHBOARD_MONITOR_ROUTE: string = join(DASHBOARD_ROUTE, 'monitor');
export const DASHBOARD_USER_ROUTE: string = join(DASHBOARD_ROUTE, 'user');
export const DASHBOARD_DIRECTOR_ROUTE: string = join(
  DASHBOARD_ROUTE,
  'director',
);
export const DASHBOARD_STORE_INFORMATION_ROUTE: string = join(
  DASHBOARD_ROUTE,
  'store-information',
);

/* system routes */
export const SYSTEM_ROUTE: string = '/dms/system-management-master';

/* account routes */
export const ACCOUNT_ROOT_ROUTE: string = '/dms/account';

export const APP_USER_ROUTE: string = join(
  ACCOUNT_ROOT_ROUTE,
  'app-user/app-user-master',
);

export const ROLE_ROOT_ROUTE: string = join('/dms/account/role');

export const ROLE_ROUTE: string = join(ROLE_ROOT_ROUTE, 'role-master');

export const ROLE_DETAIL_ROUTE: string = join(ROLE_ROOT_ROUTE, 'role-detail');

export const ORGANIZATION_ROUTE: string = join(
  ACCOUNT_ROOT_ROUTE,
  'organization/organization-master',
);

/* workflow routes */
export const WORKFLOW_ROOT_ROUTE: string = '/dms/workflow';

/* workflow definition routes */
export const WORKFLOW_DEFINITION: string = join(
  WORKFLOW_ROOT_ROUTE,
  'workflow-definition',
);

export const WORKFLOW_DEFINITION_ROUTE: string = join(
  WORKFLOW_DEFINITION,
  'workflow-definition-master',
);

export const WORKFLOW_DEFINITION_DETAIL_ROUTE: string = join(
  WORKFLOW_DEFINITION,
  'workflow-definition-detail',
);

export const WORKFLOW_DEFINITION_PREVIEW_ROUTE: string = join(
  WORKFLOW_DEFINITION,
  'workflow-definition-preview',
);

/* workflow direction routes */

export const WORKFLOW_DIRECTION: string = join(
  WORKFLOW_ROOT_ROUTE,
  'workflow-direction',
);
export const WORKFLOW_DIRECTION_ROUTE: string = join(
  WORKFLOW_DIRECTION,
  'workflow-direction-master',
);
export const WORKFLOW_DIRECTION_DETAIL_ROUTE: string = join(
  WORKFLOW_DIRECTION,
  'workflow-direction-detail',
);

/*workflow parameter*/

export const WORKFLOW_PARAMETER: string = join(
  WORKFLOW_ROOT_ROUTE,
  'workflow-parameter',
);
export const WORKFLOW_PARAMETER_ROUTE: string = join(
  WORKFLOW_PARAMETER,
  'workflow-parameter-master',
);

/*workflow step: : :*/

export const WORKFLOW_STEP: string = join(WORKFLOW_ROOT_ROUTE, 'workflow-step');

export const WORKFLOW_STEP_ROUTE: string = join(
  WORKFLOW_STEP,
  'workflow-step-master',
);
export const WORKFLOW_STEP_DETAIL_ROUTE: string = join(
  WORKFLOW_STEP,
  'workflow-step-detail',
);

/* product routes */
export const PRODUCT_CATEGORY_ROUTE: string = '/dms/product-category';

export const PRODUCT_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'product',
);

export const PRODUCT_ROUTE: string = join(PRODUCT_ROOT_ROUTE, 'product-master');

export const PRODUCT_DETAIL_ROUTE: string = join(
  PRODUCT_ROOT_ROUTE,
  'product-detail',
);

export const PRODUCT_GROUPING_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'product-grouping',
);

export const PRODUCT_GROUPING_ROUTE: string = join(
  PRODUCT_GROUPING_ROOT_ROUTE,
  'product-grouping-master',
);
export const PRODUCT_TYPE_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'product-type',
);
export const PRODUCT_TYPE_ROUTE: string = join(
  PRODUCT_TYPE_ROOT_ROUTE,
  'product-type-master',
);
export const UNIT_OF_MEASURE_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'unit-of-measure',
);
export const UNIT_OF_MEASURE_ROUTE: string = join(
  UNIT_OF_MEASURE_ROOT_ROUTE,
  'unit-of-measure-master',
);
export const UNIT_OF_MEASURE_GROUPING_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'unit-of-measure-grouping',
);
export const UNIT_OF_MEASURE_GROUPING_ROUTE: string = join(
  UNIT_OF_MEASURE_GROUPING_ROOT_ROUTE,
  'unit-of-measure-grouping-master',
);
export const UNIT_OF_MEASURE_GROUPING_DETAIL_ROUTE: string = join(
  UNIT_OF_MEASURE_GROUPING_ROOT_ROUTE,
  'unit-of-measure-grouping-detail',
);
export const NEW_PRODUCT_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  'new-product',
);
export const NEW_PRODUCT_ROUTE: string = join(
  NEW_PRODUCT_ROOT_ROUTE,
  'new-product-master',
);
export const TAX_TYPE_ROOT_ROUTE: string = join(
  PRODUCT_CATEGORY_ROUTE,
  '/tax-type',
);
export const TAX_TYPE_ROUTE: string = join(
  TAX_TYPE_ROOT_ROUTE,
  '/tax-type-master',
);

/* partner routes */
export const PARTNER_ROOT_ROUTE: string = '/dms/partner';

export const BRAND_ROOT_ROUTE: string = '/dms/partner/brand';

export const BRAND_ROUTE: string = join(BRAND_ROOT_ROUTE, 'brand-master');

export const BRAND_DETAIL_ROUTE: string = join(
  PARTNER_ROOT_ROUTE,
  'brand-detail',
);

export const SUPPLIER_ROOT_ROUTE: string = '/dms/partner/supplier';

export const SUPPLIER_ROUTE: string = join(
  SUPPLIER_ROOT_ROUTE,
  'supplier-master',
);

export const SUPPLIER_DETAIL_ROUTE: string = join(
  SUPPLIER_ROOT_ROUTE,
  'supplier-detail',
);

/* store routes */
export const LOCATION_ROOT_ROUTE: string = '/dms/location';

export const STORE_ROOT_ROUTE: string = '/dms/location/store';

export const STORE_ROUTE: string = join(STORE_ROOT_ROUTE, 'store-master');

export const STORE_DETAIL_ROUTE: string = join(
  STORE_ROOT_ROUTE,
  'store-detail',
);

export const STORE_GROUPING_ROOT_ROUTE: string = '/dms/location/store-grouping';

export const STORE_GROUPING_ROUTE: string = join(
  STORE_GROUPING_ROOT_ROUTE,
  'store-grouping-master',
);

export const STORE_TYPE_ROOT_ROUTE: string = '/dms/location/store-type';

export const STORE_TYPE_ROUTE: string = join(
  STORE_TYPE_ROOT_ROUTE,
  'store-type-master',
);

export const STORE_SCOUTING_ROOT_ROUTE: string = '/dms/location/store-scouting';
export const STORE_SCOUTING_ROUTE: string = join(
  STORE_SCOUTING_ROOT_ROUTE,
  'store-scouting-master',
);

/* albumn routes */
export const ALBUM_ROOT_ROUTE = '/dms/gallery';
export const ALBUM_ROUTE: string = join(ALBUM_ROOT_ROUTE, 'album/album-master');

/* warehouse routes */

export const WAREHOUSE_ROOT_ROUTE = '/dms/inventory/warehouse';
export const WAREHOUSE_ROUTE: string = join(
  WAREHOUSE_ROOT_ROUTE,
  'warehouse-master',
);

export const WAREHOUSE_DETAIL_ROUTE: string = join(
  WAREHOUSE_ROOT_ROUTE,
  'warehouse-detail',
);

/* Sale routes*/
export const SALES_ROOT_ROUTE: string = '/dms/sale-order';

export const INDIRECT_SALES_ORDER_ROOT_ROUTE: string =
  '/dms/sale-order/indirect-sales-order';

export const INDIRECT_SALES_ORDER_ROUTE: string = join(
  INDIRECT_SALES_ORDER_ROOT_ROUTE,
  'indirect-sales-order-master',
);

export const INDIRECT_SALES_ORDER_DETAIL_ROUTE: string = join(
  INDIRECT_SALES_ORDER_ROOT_ROUTE,
  'indirect-sales-order-detail',
);

export const INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE: string =
  '/dms/sale-order/indirect-sales-order-owner';

export const INDIRECT_SALES_ORDER_OWNER_ROUTE: string = join(
  INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  'indirect-sales-order-owner-master',
);

export const INDIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE: string = join(
  INDIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  'indirect-sales-order-owner-detail',
);

/* Direct sales order*/

export const DIRECT_SALES_ORDER_ROOT_ROUTE: string =
  '/dms/sale-order/direct-sales-order';
export const DIRECT_SALES_ORDER_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROOT_ROUTE,
  'direct-sales-order-master',
);

export const DIRECT_SALES_ORDER_DETAIL_ROUTE: string = join(
  DIRECT_SALES_ORDER_ROOT_ROUTE,
  'direct-sales-order-detail',
);

export const DIRECT_SALES_ORDER_OWNER_ROOT_ROUTE: string =
  '/dms/sale-order/direct-sales-order-owner';
export const DIRECT_SALES_ORDER_OWNER_ROUTE: string = join(
  DIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  'direct-sales-order-owner-master',
);

export const DIRECT_SALES_ORDER_OWNER_DETAIL_ROUTE: string = join(
  DIRECT_SALES_ORDER_OWNER_ROOT_ROUTE,
  'direct-sales-order-owner-detail',
);

/* discount routes*/

/* eroute routes*/
export const ROUTE_ROOT_ROUTE: string = '/dms/route';

export const E_ROUTE_ROOT_ROUTE: string = '/dms/route/e-route';

export const E_ROUTE_ROUTE: string = join(E_ROUTE_ROOT_ROUTE, 'e-route-master');

export const E_ROUTE_DETAIL_ROUTE: string = join(
  E_ROUTE_ROOT_ROUTE,
  'e-route-detail',
);
export const E_ROUTE_OWNER_OWNER_ROOT_ROUTE: string =
  '/dms/route/e-route-owner';

export const E_ROUTE_OWNER_ROUTE: string = join(
  E_ROUTE_OWNER_OWNER_ROOT_ROUTE,
  'e-route-owner-master',
);

export const E_ROUTE_OWNER_DETAIL_ROUTE: string = join(
  E_ROUTE_OWNER_OWNER_ROOT_ROUTE,
  'e-route-owner-detail',
);

export const E_ROUTE_CHANGE_REQUEST_ROOT_ROUTE: string =
  '/dms/route/e-route-change-request';

export const E_ROUTE_CHANGE_REQUEST_ROUTE: string = join(
  E_ROUTE_CHANGE_REQUEST_ROOT_ROUTE,
  'e-route-change-request-master',
);
export const E_ROUTE_CHANGE_REQUEST_DETAIL_ROUTE: string = join(
  E_ROUTE_CHANGE_REQUEST_ROOT_ROUTE,
  'e-route-change-request-detail',
);

/* monitor routes */
export const MONITOR_ROOT_ROUTE: string = '/dms/monitor';
export const STORE_CHECKER_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-store-checker',
);
export const STORE_CHECKER_MONITOR: string = join(
  STORE_CHECKER_ROOT_ROUTE,
  'monitor-store-checker-master',
);
export const STORE_SALESMAN_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-salesman',
);
export const SALESMAN_MONITOR: string = join(
  STORE_SALESMAN_ROOT_ROUTE,
  'monitor-salesman-master',
);
export const STORE_IMAGES_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-store-image',
);
export const STORE_IMAGES_MONITOR: string = join(
  STORE_IMAGES_ROOT_ROUTE,
  'monitor-store-image-master',
);
export const STORE_PROBLEMS_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-store-problem',
);
export const STORE_PROBLEMS_MONITOR: string = join(
  STORE_PROBLEMS_ROOT_ROUTE,
  'monitor-store-problem-master',
);
export const STORE_COMPETITORS_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-store-competitor',
);
export const STORE_COMPETITORS_MONITOR: string = join(
  STORE_COMPETITORS_ROOT_ROUTE,
  'monitor-store-competitor-master',
);
export const ALBUM_MONITOR_ROOT_ROUTE: string = join(
  MONITOR_ROOT_ROUTE,
  'monitor-store-album',
);
export const ALBUM_MONITOR: string = join(
  ALBUM_MONITOR_ROOT_ROUTE,
  'monitor-store-album-master',
);
export const PROBLEM_TYPE_ROOT_ROUTE: string = '/dms/problem-type';

export const PROBLEM_TYPE_ROUTE: string = join(
  PROBLEM_TYPE_ROOT_ROUTE,
  'problem-type-master',
);

export const STORE_SCOUTING_TYPE_ROOT_ROUTE: string =
  '/dms/store-scouting-type';

export const STORE_SCOUTING_TYPE_ROUTE: string = join(
  STORE_SCOUTING_TYPE_ROOT_ROUTE,
  'store-scouting-type-master',
);

/* manage kpi routes */

export const KPI_MANAGEMENT_ROUTE: string = '/dms/kpi-management';
export const KPI_GENERAL_ROOT_ROUTE: string = join(
  KPI_MANAGEMENT_ROUTE,
  'kpi-general',
);
export const KPI_GENERAL_ROUTE: string = join(
  KPI_GENERAL_ROOT_ROUTE,
  'kpi-general-master',
);
export const KPI_GENERAL_DETAIL_ROUTE: string = join(
  KPI_GENERAL_ROOT_ROUTE,
  'kpi-general-detail',
);
export const KPI_ITEM_ROOT_ROUTE: string = join(
  KPI_MANAGEMENT_ROUTE,
  'kpi-item',
);

export const KPI_ITEM_ROUTE: string = join(
  KPI_ITEM_ROOT_ROUTE,
  'kpi-item-master',
);

export const KPI_ITEM_DETAIL_ROUTE: string = join(
  KPI_ITEM_ROOT_ROUTE,
  'kpi-item-detail',
);

export const KPI_PRODUCT_GROUPING_ROOT_ROUTE: string = join(
  KPI_MANAGEMENT_ROUTE,
  'kpi-product-grouping',
);

export const KPI_PRODUCT_GROUPING_ROUTE: string = join(
  KPI_PRODUCT_GROUPING_ROOT_ROUTE,
  'kpi-product-grouping-master',
);

export const KPI_PRODUCT_GROUPING_DETAIL_ROUTE: string = join(
  KPI_PRODUCT_GROUPING_ROOT_ROUTE,
  'kpi-product-grouping-detail',
);

/* tracking kpi routes */
export const KPI_TRACKING_REPORT_ROUTE: string = '/dms/kpi-tracking';
export const KPI_GENERAL_PERIOD_REPORT_ROOT_ROUTE: string = join(
  KPI_TRACKING_REPORT_ROUTE,
  'kpi-general-period-report',
);
export const KPI_GENERAL_PERIOD_REPORT_ROUTE: string = join(
  KPI_GENERAL_PERIOD_REPORT_ROOT_ROUTE,
  'kpi-general-period-report-master',
);
export const KPI_GENERAL_EMPLOYEE_REPORT_ROOT_ROUTE: string = join(
  KPI_TRACKING_REPORT_ROUTE,
  'kpi-general-employee-report',
);
export const KPI_GENERAL_EMPLOYEE_REPORT_ROUTE: string = join(
  KPI_GENERAL_EMPLOYEE_REPORT_ROOT_ROUTE,
  'kpi-general-employee-report-master',
);
export const KPI_ITEM_REPORT_ROOT_ROUTE: string = join(
  KPI_TRACKING_REPORT_ROUTE,
  'kpi-item-report',
);
export const KPI_ITEM_REPORT_ROUTE: string = join(
  KPI_ITEM_REPORT_ROOT_ROUTE,
  'kpi-item-report-master',
);
export const KPI_PRODUCT_GROUPING_REPORT_ROOT_ROUTE: string = join(
  KPI_TRACKING_REPORT_ROUTE,
  'kpi-product-grouping-report',
);
export const KPI_PRODUCT_GROUPING_REPORT_ROUTE: string = join(
  KPI_PRODUCT_GROUPING_REPORT_ROOT_ROUTE,
  'kpi-product-grouping-report-master',
);

/* notification routes */
export const NOTIFICATION_ROUTE: string = join(
  '/dms/alert',
  'notification/notification-master',
);
export const SURVEY_ROOT_ROUTE: string = join('/dms/knowledge', 'survey');

export const SURVEY_DETAIL_ROUTE: string = join(
  '/dms/knowledge',
  'survey/survey-detail',
);
export const SURVEY_ROUTE: string = join(
  '/dms/knowledge',
  'survey/survey-master',
);

export const BANNER_ROUTE: string = join(
  '/dms/application-banner',
  'banner/banner-master',
);

/* reports */
export const STORE_CHECKED_REPORT_ROOT_ROUTE: string =
  '/dms/store-checking-report';
export const STORE_CHECKED_REPORT_ROUTE: string = join(
  STORE_CHECKED_REPORT_ROOT_ROUTE,
  'store-checked-report-master',
);
export const STORE_UN_CHECKED_REPORT_ROUTE: string = join(
  STORE_CHECKED_REPORT_ROOT_ROUTE,
  'store-unchecked-report-master',
);

/* indirect sale order report*/
export const INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE: string =
  '/dms/indirect-sales-order-report';
export const INDIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE: string = join(
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'indirect-sales-order-by-store-and-items-report-master',
);
export const INDIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE: string = join(
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'indirect-sales-order-by-employee-and-items-report-master',
);
export const INDIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE: string = join(
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'indirect-sales-order-by-items-report-master',
);

export const INDIRECT_SALES_ORDER_GENERAL_ROUTE: string = join(
  INDIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'indirect-sales-order-general-report-master',
);
export const STORE_REPORT: string = '/dms/store-report';

/* Store state change */

export const STORE_STATE_CHANGE_REPORT_ROOT_ROUTE: string = join(
  STORE_REPORT,
  'report-store-state-change-master',
);

/* direct sales order report*/
export const DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE: string =
  '/dms/direct-sales-order-report';
export const DIRECT_SALES_ORDER_BY_EMPLOYEE_AND_ITEM_REPORT_ROUTE: string = join(
  DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'direct-sales-order-by-employee-and-items-report-master',
);

export const DIRECT_SALES_ORDER_GENERAL_ROUTE: string = join(
  DIRECT_SALE_ORDER_REPORT_ROOT_ROUTE,
  'direct-sales-order-general-report-master',
);

export const STORE_GENERAL_REPORT_ROUTE: string = join(
  STORE_REPORT,
  'store-general-report-master',
);

export const STATISTIC_STORE_SCOUTING_REPORT_ROUTE: string = join(
  STORE_REPORT,
  'statistic-store-scouting-report-master',
);
export const STATISTIC_PROBLEM_REPORT_ROUTE: string = join(
  STORE_REPORT,
  'statistic-problem-report-master',
);

//  direct sales order report report
export const DIRECT_SALES_ORDER_REPORT_ROOT_ROUTE: string =
  '/dms/direct-sales-order-report';

export const DIRECT_SALES_ORDER_BY_STORE_AND_ITEM_REPORT_ROUTE: string = join(
  DIRECT_SALES_ORDER_REPORT_ROOT_ROUTE,
  'direct-sales-order-by-store-and-items-report-master',
);

export const DIRECT_SALES_ORDER_BY_ITEM_REPORT_ROUTE: string = join(
  DIRECT_SALES_ORDER_REPORT_ROOT_ROUTE,
  'direct-sales-order-by-items-report-master',
);
/* priceList route */
export const SALEPRICE_PROMOTION_ROUTE = '/dms/price-list-and-promotion';
export const SALEPRICE_ROOT_ROUTE = '/dms/price-list-and-promotion/price-list';
export const SALEPRICE_ROUTE = join(SALEPRICE_ROOT_ROUTE, 'price-list-master');
export const SALEPRICE_DETAIL_ROUTE = join(
  SALEPRICE_ROOT_ROUTE,
  'price-list-detail',
);

/* priceListOwner route */
export const PRICELIST_OWNER_ROOT_ROUTE =
  '/dms/price-list-and-promotion/price-list-owner';

export const PRICELIST_OWNER_ROUTE = join(
  PRICELIST_OWNER_ROOT_ROUTE,
  'price-list-owner-master',
);
export const PRICELIST_OWNER_DETAIL_ROUTE = join(
  PRICELIST_OWNER_ROOT_ROUTE,
  'price-list-owner-detail',
);

/* PROMOTION*/

export const PROMOTION_ROOT_ROUTE =
  '/dms/price-list-and-promotion/promotion-code';

export const PROMOTION_CODE_ROUTE: string = join(
  PROMOTION_ROOT_ROUTE,
  'promotion-code-master',
);
export const PROMOTION_CODE_DETAIL_ROUTE = join(
  PROMOTION_ROOT_ROUTE,
  'promotion-code-detail',
);
export const PROMOTION_CODE_PREVIEW_ROUTE: string = join(
  PROMOTION_ROOT_ROUTE,
  'promotion-code-preview',
);

/* Lucky number */
export const LUCKY_NUMBER_ROOT_ROUTE =
  '/dms/price-list-and-promotion/lucky-number';

export const LUCKY_NUMBER_ROUTE =
  '/dms/price-list-and-promotion/lucky-number/lucky-number-master';

/* others */
export const PORTAL_FORBIDENT_ROUTE: string = '/403';
export const FORBIDENT_ROUTE: string = '/dms/403';

export const LANGUAGE_ROUTE: string = '/dms/i18n';

export const LOGIN_ROUTE: string = '/login';

export const LANDING_PAGE_ROUTE: string = '/landing-page';

export const NOT_FOUND_ROUTE: string = '/dms/404';

export const IMAGE_ROUTE: string = '/dms/image';

export const ITEM_ROUTE: string = '/dms/item';

export const UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE: string =
  '/dms/unit-of-measure-grouping-content';

export const VARIATION_ROUTE: string = '/dms/variation';

export const CREATE_KPI_ROUTE: string = '/dms/create-kpi';
export const MANAGE_KPI_ROUTE: string = '/dms/manage-kpi';
export const REPORT_KPI_EMPLOYEE: string = '/dms/report-kpi-employee';
export const REPORT_KPI_PREODIC: string = '/dms/report-kpi-preodic';
export const PROFILE_ROUTE: string = '/portal/profile';
export const CHANGE_PASSWORD_ROUTE: string = '/portal/profile/change-password';
export const USER_NOTIFICATION_ROUTE: string = '/portal/user-notification';
export const SURVEY_FORM_ROUTE: string = '/dms/survey-form';

export const BANNER_MOBILE_ROUTE: string = '/dms/mobile/get-banner';

export const SYSTEM_CONFIGURATION_ROUTE: string =
  '/dms/system-configuration/system-configuration-master';
export const NOTIFICATION_MOBILE_ROUTE: string = '/dms/mobile/get-notification';

/* category routes */
export const CATEGORY_ROOT_ROUTE = join(PRODUCT_CATEGORY_ROUTE, 'category');
export const CATEGORY_ROUTE = join(CATEGORY_ROOT_ROUTE, 'category-master');
export const CATEGORY_DETAIL_ROUTE: string = join(
  CATEGORY_ROOT_ROUTE,
  'category-detail',
);

/* POSM */

export const POSM_ROOT_ROUTE = '/dms/posm';

/* Showing item*/

export const SHOWING_ITEM_ROOT_ROUTE: string = join(
  POSM_ROOT_ROUTE,
  'showing-item',
);

export const SHOWING_ITEM_ROUTE: string = join(
  SHOWING_ITEM_ROOT_ROUTE,
  'showing-item-master',
);
export const SHOWING_ITEM_DETAIL_ROUTE = join(
  SHOWING_ITEM_ROOT_ROUTE,
  'showing-item-detail',
);

/* Showing category */

export const SHOWING_CATEGORY_ROOT_ROUTE: string = join(
  POSM_ROOT_ROUTE,
  'showing-category',
);

export const SHOWING_CATEGORY_ROUTE: string = join(
  SHOWING_CATEGORY_ROOT_ROUTE,
  'showing-category-master',
);
export const SHOWING_CATEGORY_DETAIL_ROUTE = join(
  SHOWING_CATEGORY_ROOT_ROUTE,
  'showing-category-detail',
);

/* Showing warehouse */

export const SHOWING_WAREHOUSE_ROOT_ROUTE: string = join(
  POSM_ROOT_ROUTE,
  'showing-warehouse',
);

export const SHOWING_WAREHOUSE_ROUTE: string = join(
  SHOWING_WAREHOUSE_ROOT_ROUTE,
  'showing-warehouse-master',
);
export const SHOWING_WAREHOUSE_DETAIL_ROUTE = join(
  SHOWING_WAREHOUSE_ROOT_ROUTE,
  'showing-warehouse-detail',
);

/* Showing order */

export const ORDER_ROOT_ROUTE: string = '/dms/posm-order';

export const SHOWING_ORDER_ROOT_ROUTE: string = join(
  ORDER_ROOT_ROUTE,
  'showing-order',
);

export const SHOWING_ORDER_ROUTE: string = join(
  SHOWING_ORDER_ROOT_ROUTE,
  'showing-order-master',
);
export const SHOWING_ORDER_DETAIL_ROUTE = join(
  SHOWING_ORDER_ROOT_ROUTE,
  'showing-order-detail',
);

export const SHOWING_ORDER_WITHDRAW_ROOT_ROUTE: string = join(
  ORDER_ROOT_ROUTE,
  'showing-order-with-draw',
);

export const SHOWING_ORDER_WITHDRAW_ROUTE: string = join(
  SHOWING_ORDER_WITHDRAW_ROOT_ROUTE,
  'showing-order-with-draw-master',
);
export const SHOWING_ORDER_WITHDRAW_DETAIL_ROUTE = join(
  SHOWING_ORDER_WITHDRAW_ROOT_ROUTE,
  'showing-order-with-draw-detail',
);

// /* POSM report */

export const POSM_REPORT_ROOT_ROUTE: string =
  '/dms/posm-report/posm-report-master';

/* Showing order */

export const EXPORT_ROOT_ROUTE: string = '/dms/export';

export const EXPORT_TEMPLATE_ROOT_ROUTE: string = join(
  EXPORT_ROOT_ROUTE,
  'export-template',
);

export const EXPORT_TEMPLATE_ROUTE: string = join(
  EXPORT_TEMPLATE_ROOT_ROUTE,
  'export-template-master',
);
export const EXPORT_TEMPLATE_DETAIL_ROUTE = join(
  EXPORT_TEMPLATE_ROOT_ROUTE,
  'export-template-detail',
);
// dms/export/export-template/export-template-detail
