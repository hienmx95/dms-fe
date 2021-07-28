import { formatNumber } from 'core/helpers/number';
import { ColumnWidths, LanguageKeys } from 'react3l';
import { translate } from 'core/helpers/internationalization';
import { defaults } from 'react-chartjs-2';

defaults.global.defaultFontFamily = 'Montserrat';

export const projectCode = '/dms/';

export const generalColumnWidths: ColumnWidths = {
  index: 70,
  checkbox: 50,
  expand: 50,
  actions: 120,
  default: 200,
};

export const generalLanguageKeys: LanguageKeys = {
  actions: {
    label: translate('general.actions.label'),
    create: translate('general.actions.create'),
    close: translate('general.actions.close'),
    add: translate('general.actions.add'),
    update: translate('general.actions.update'),
    delete: translate('general.actions.delete'),
    search: translate('general.actions.search'),
    filter: translate('general.actions.filter'),
    import: translate('general.actions.import'),
    export: translate('general.actions.export'),
    exportTemplate: translate('general.actions.exportTemplate'),
    reset: translate('general.actions.reset'),
    save: translate('general.actions.save'),
    cancel: translate('general.actions.cancel'),
    approve: translate('general.actions.approve'),
    sendApprove: translate('general.actions.sendApprove'),
    reject: translate('general.actions.reject'),
    send: translate('general.actions.send'),
    view: translate('general.actions.view'),
    edit: translate('general.actions.edit'),
    history: translate('general.actions.history'),
    statistical: translate('general.actions.statistical'),
    print: translate('general.actions.print'),
    chat: translate('general.actions.chat'),
    apply: translate('general.actions.apply'),
  },
  columns: {
    index: translate('general.columns.index'),
  },
  delete: {
    title: translate('general.delete.title'),
    content: translate('general.delete.content'),
    success: translate('general.delete.success'),
    error: translate('general.delete.error'),
  },
  batchDelete: {
    title: translate('general.batchDelete.title'),
    content: translate('general.batchDelete.content'),
  },
  update: {
    success: translate('general.update.success'),
    error: translate('general.update.error'),
    requireRefresh: translate('general.update.requireRefresh'),
  },
  import: {
    success: translate('general.import.success'),
    error: translate('general.import.error'),
  },
  state: {
    new: translate('general.state.new'),
    pending: translate('general.state.pending'),
    approved: translate('general.state.approved'),
    rejected: translate('general.state.rejected'),
    handle: translate('general.state.handle'),
  },
};

export const listAspectRatio = [
  { id: 1, name: '343:206', value: 343 / 206 },
  { id: 2, name: '206:206', value: 206 / 206 },
  // {id:2, name: '16:9', value: 16/9},
  // {id:3, name: '4:3', value: 4/3},
];

export interface Project {
  name: string;
  code: string;
  path: string;
  icon?: string;
  imgSrc?: string;
}

export const projects: Project[] = [
  {
    name: 'DMS',
    code: 'dms',
    path: '/dms',
    imgSrc: '/assets/icons/dms.png',
  },
  {
    name: 'general.defaultHeader.report',
    code: 'report',
    path: '/report',
    imgSrc: '/assets/icons/report.png',
  },

  // {
  //   name: 'Inventory',
  //   code: 'inventory',
  //   path: '/inventory',
  //   imgSrc: '/assets/icons/inventory.svg',
  // },
  {
    name: 'CRM',
    code: 'crm',
    path: '/crm',
    imgSrc: '/assets/icons/crm.png',
  },
  {
    name: 'Admin Portal',
    code: 'portal',
    path: '/portal',
    imgSrc: '/assets/icons/Admin_Logo_0.png',
  },
];

export const MATTERMOST_TOKEN: string = process.env.MATTERMOST_TOKEN;
export const MATTERMOST_URL: string = process.env.MATTERMOST_URL;
export const MATTERMOST_WEBHOOK_URL: string =
  process.env.MATTERMOST_WEBHOOK_URL;
export const SIGNALR_CHANNEL: string = 'Receive';
export const DEFAULT_IMAGE_FALLBACK: string = '/assest/img/brand/fallback.svg';
export const optionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  layout: {
    padding: 10,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  tooltips: {
    enabled: true,
    displayColors: false,
    followPointer: true,
    // caretSize: 0,
    // titleFontSize: 9,
    // bodyFontSize: 9,
    // bodySpacing: 0,
    // titleSpacing: 0,
    // xPadding: 2,
    // yPadding: 2,
    // cornerRadius: 2,
    // titleMarginBottom: 2,
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false,
          // max: 62
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};

export const optionsLineFull = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  layout: {
    padding: 30,
  },
  tooltips: {
    enabled: true,
    displayColors: false,
    followPointer: true,
    callbacks: {
      label: (tooltipItem, data) => {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += formatNumber(Math.round(tooltipItem.yLabel * 100) / 100);
        return label;
      },
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          // drawBorder: false,
          display: false,
        },
        ticks: {
          min: 0,
          stepSize: 1,
          beginAtZero: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },

        ticks: {
          beginAtZero: true,
          callback: value => {
            return formatNumber(value);
          },
        },
        display: true,
        position: 'left',
      },
    ],
  },
};
export const optionsHorizontalBar = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },

  layout: {
    padding: 20,
    // paddingBottom: 12,
  },
  // beginAtZero: true,
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: value => {
            const characterLimit = 15;
            if (value?.length >= characterLimit) {
              return (
                value
                  .slice(0, value.length)
                  .substring(0, characterLimit - 1)
                  .trim() + '...'
              );
            }
            return value;
          },
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          beginAtZero: true,
          // Include a dollar sign in the ticks
          callback: value => {
            return formatNumber(value);
          },
        },
      },
    ],
  },
  tooltips: {
    enabled: true,
    displayColors: false,
    callbacks: {
      label: (tooltipItem, data) => {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += formatNumber(Math.round(tooltipItem.xLabel * 100) / 100);
        return label;
      },
    },
  },
};

export const optionsHorizontalBar2 = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },

  layout: {
    padding: 40,
    // paddingBottom: 12,
  },
  // beginAtZero: true,
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: value => {
            const characterLimit = 15;
            if (value.length >= characterLimit) {
              return (
                value
                  .slice(0, value.length)
                  .substring(0, characterLimit - 1)
                  .trim() + '...'
              );
            }
            return value;
          },
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          beginAtZero: true,
          // Include a dollar sign in the ticks
          callback: value => {
            return formatNumber(value);
          },
        },
      },
    ],
  },
  tooltips: {
    enabled: true,
    displayColors: false,
    callbacks: {
      label: (tooltipItem, data) => {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += formatNumber(Math.round(tooltipItem.xLabel * 100) / 100);
        return label;
      },
    },
  },
};

export const optionsBar = {
  responsive: true,
  // maintainAspectRatio: false,
  legend: {
    display: false,
  },

  layout: {
    padding: 30,
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          // display: false,
        },
        ticks: {
          min: 0,
          beginAtZero: false,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          // drawBorder: false,
          display: false,
        },
        ticks: {
          min: 0,
          beginAtZero: false,
        },
      },
    ],
  },
  tooltips: {
    enabled: true,
    displayColors: false,
  },
};

export const optionsBarLablesY = {
  responsive: true,
  // maintainAspectRatio: false,
  legend: {
    display: false,
  },

  layout: {
    padding: 30,
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          min: 0,
          // Include a dollar sign in the ticks
          callback: value => {
            return formatNumber(value);
          },
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          // drawBorder: false,
          display: false,
        },
        ticks: {
          min: 0,
          beginAtZero: false,
        },
      },
    ],
  },
  tooltips: {
    enabled: true,
    displayColors: false,
    callbacks: {
      label: (tooltipItem, data) => {
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label += formatNumber(Math.round(tooltipItem.yLabel * 100) / 100);
        return label;
      },
    },
  },
};

export const normalStoreIcon: string = '/dms/assets/icons/red-dot.svg';

export const flaggedStoreIconUrl: string = '/dms/assets/icons/beachflag.svg';

export const draffStoreIconUrl: string = '/dms/assets/icons/green-dot.svg';

export const storeIcon: string = '/dms/assets/icons/store-logo.svg';

export const googleMapScriptBuilder: (apiKey: string) => string = (
  apiKey: string,
) => `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

export enum storeStatusIdEnums {
  ALL = 1,
  DRAFT,
  OFFICIAL,
}

/**
 * url constants
 */

export const MENU_URL_REGEX = /^(dms)/;
export const ACTION_URL_REGEX = /^(rpc)/;
export const MDM_URL_REGEX = /^(mdm)/;
