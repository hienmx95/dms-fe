import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { indexInContent } from 'helpers/ant-design/table';
import { KpiCriteriaGeneral } from 'models/kpi/KpiCriteriaGeneral';
import { KpiGeneral } from 'models/kpi/KpiGeneral';
import { KpiGeneralContent } from 'models/kpi/KpiGeneralContent';
import { KpiGeneralContentFilter } from 'models/kpi/KpiGeneralContentFilter';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { kpiGeneralRepository } from 'views/KpiGeneralView/KpiGeneralRepository';
import './KpiGeneralContentTable.scss';
import InputNumber from 'components/InputNumber/InputNumber';
import SwitchStatus from 'components/Switch/Switch';
import { kpiGenralService } from 'views/KpiGeneralView/KpiGeneralService';

const { Item: FormItem } = Form;

export interface KpiGeneralContentTableProps {
  model: KpiGeneral;
  setModel: Dispatch<SetStateAction<KpiGeneral>>;
  mode: number;
}

function KpiGeneralContentTable(props: KpiGeneralContentTableProps) {
  const [translate] = useTranslation();

  const { model, setModel, mode } = props;

  const [
    kpiGeneralContents,
    setKpiGeneralContents,
  ] = crudService.useContentTable<KpiGeneral, KpiGeneralContent>(
    model,
    setModel,
    nameof(model.kpiGeneralContents),
  );

  const [kpiGeneralContentFilter, setKpiGeneralContentFilter] = React.useState<
    KpiGeneralContentFilter
  >(new KpiGeneralContentFilter());

  /* transform old contents to new contents */
  const [newContents] = kpiGenralService.useKpiContentTable(
    kpiGeneralContents,
    setKpiGeneralContents,
  );

  /* dateSource and table service */
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    newContents,
    kpiGeneralContentFilter,
    setKpiGeneralContentFilter,
  );

  const [statusList] = crudService.useEnumList<Status>(
    kpiGeneralRepository.singleListStatus,
  );

  const handleChangevalue = React.useCallback(
    (index, field: string) => {
      return value => {
        const errors = model.errors;
        if (typeof errors !== 'undefined' && errors !== null) {
          errors.employeeIds = null;
        }
        newContents[index] = {
          ...newContents[index],
          [`${field}`]: value,
        };
        setKpiGeneralContents([...newContents]);
        setModel({
          ...model,
          errors,
        });
      };
    },
    [newContents, setKpiGeneralContents, setModel, model],
  );

  const handleChangeStatus = React.useCallback(
    index => {
      return (statusId, status) => {
        if (statusId === 0) {
          if (newContents[index].janStatus === true) {
            newContents[index].jan = null;
          }
          if (newContents[index].febStatus === true) {
            newContents[index].feb = null;
          }
          if (newContents[index].marStatus === true) {
            newContents[index].mar = null;
          }
          if (newContents[index].aprStatus === true) {
            newContents[index].apr = null;
          }
          if (newContents[index].mayStatus === true) {
            newContents[index].may = null;
          }
          if (newContents[index].julStatus === true) {
            newContents[index].jul = null;
          }
          if (newContents[index].junStatus === true) {
            newContents[index].jun = null;
          }
          if (newContents[index].augStatus === true) {
            newContents[index].aug = null;
          }
          if (newContents[index].sepStatus === true) {
            newContents[index].sep = null;
          }
          if (newContents[index].octStatus === true) {
            newContents[index].oct = null;
          }
          if (newContents[index].novStatus === true) {
            newContents[index].nov = null;
          }
          if (newContents[index].decStatus === true) {
            newContents[index].dec = null;
          }
          if (newContents[index].q1Status === true) {
            newContents[index].q1 = null;
          }
          if (newContents[index].q2Status === true) {
            newContents[index].q2 = null;
          }
          if (newContents[index].q3Status === true) {
            newContents[index].q3 = null;
          }
          if (newContents[index].q4Status === true) {
            newContents[index].q4 = null;
          }
          if (newContents[index].yearStatus === true) {
            newContents[index].year = null;
          }
        }
        newContents[index] = {
          ...newContents[index],
          statusId,
          status,
        };
        setKpiGeneralContents([...newContents]);
      };
    },
    [newContents, setKpiGeneralContents],
  );

  const columns: ColumnProps<KpiGeneralContent>[] = React.useMemo(() => {
    if (mode === 1) {
      return [
        {
          title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
          key: nameof(dataSource[0].kpiCriteriaGeneral),
          dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
          render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
            return kpiCriteriaGeneral?.name;
          },
          width: 250,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: translate('kpiGeneralContents.jan'),
          key: nameof(dataSource[0].jan),
          dataIndex: nameof(dataSource[0].jan),
          align: 'right',
          width: 150,
          render(jan: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.jan}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(jan)}
                  value={jan}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'jan',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.janStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.feb'),
          key: nameof(dataSource[0].feb),
          dataIndex: nameof(dataSource[0].feb),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.feb}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'feb',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.febStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.mar'),
          key: nameof(dataSource[0].mar),
          dataIndex: nameof(dataSource[0].mar),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.mar}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'mar',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.marStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.apr'),
          key: nameof(dataSource[0].apr),
          dataIndex: nameof(dataSource[0].apr),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.apr}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'apr',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.aprStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.may'),
          key: nameof(dataSource[0].may),
          dataIndex: nameof(dataSource[0].may),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.may}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'may',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.mayStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.jun'),
          key: nameof(dataSource[0].jun),
          dataIndex: nameof(dataSource[0].jun),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.jun}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'jun',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.junStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.jul'),
          key: nameof(dataSource[0].jul),
          dataIndex: nameof(dataSource[0].jul),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.jul}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'jul',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.julStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.aug'),
          key: nameof(dataSource[0].aug),
          dataIndex: nameof(dataSource[0].aug),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.aug}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'aug',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.augStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.sep'),
          key: nameof(dataSource[0].sep),
          dataIndex: nameof(dataSource[0].sep),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.sep}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'sep',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.sepStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.oct'),
          key: nameof(dataSource[0].oct),
          dataIndex: nameof(dataSource[0].oct),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.oct}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'oct',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.octStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.nov'),
          key: nameof(dataSource[0].nov),
          dataIndex: nameof(dataSource[0].nov),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.nov}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'nov',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.novStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.dec'),
          key: nameof(dataSource[0].dec),
          dataIndex: nameof(dataSource[0].dec),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.dec}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'dec',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.decStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.q1'),
          key: nameof(dataSource[0].q1),
          dataIndex: nameof(dataSource[0].q1),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.q1}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'q1',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q1Status === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.q2'),
          key: nameof(dataSource[0].q2),
          dataIndex: nameof(dataSource[0].q2),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.q2}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'q2',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q2Status === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.q3'),
          key: nameof(dataSource[0].q3),
          dataIndex: nameof(dataSource[0].q3),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.q3}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'q3',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q3Status === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.q4'),
          key: nameof(dataSource[0].q4),
          dataIndex: nameof(dataSource[0].q4),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.q4}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'q4',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q4Status === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate('kpiGeneralContents.year'),
          key: nameof(dataSource[0].year),
          dataIndex: nameof(dataSource[0].year),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.year}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'year',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.yearStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(dataSource[0].status),
          dataIndex: nameof(dataSource[0].status),
          fixed: 'right',
          align: 'center',
          render(...params) {
            return (
              <FormItem
                validateStatus={formService.getValidationStatus<
                  KpiGeneralContent
                >(params[1].errors, nameof(params[1].status))}
                help={params[1].errors?.status}
              >
                <SwitchStatus
                  checked={params[1].statusId === statusList[1]?.id}
                  list={statusList}
                  onChange={handleChangeStatus(params[2])}
                />
              </FormItem>
            );
          },
        },
      ];
    } else if (mode === 2) {
      if (model?.currentMonth?.id === 101) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.jan'),
            key: nameof(dataSource[0].jan),
            dataIndex: nameof(dataSource[0].jan),
            align: 'right',
            width: 150,
            render(jan: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.jan}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(jan)}
                    value={jan}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'jan',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.janStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 102) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.feb'),
            key: nameof(dataSource[0].feb),
            dataIndex: nameof(dataSource[0].feb),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.feb}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'feb',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.febStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 103) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.mar'),
            key: nameof(dataSource[0].mar),
            dataIndex: nameof(dataSource[0].mar),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.mar}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'mar',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.marStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 104) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.apr'),
            key: nameof(dataSource[0].apr),
            dataIndex: nameof(dataSource[0].apr),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.apr}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'apr',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.aprStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 105) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.may'),
            key: nameof(dataSource[0].may),
            dataIndex: nameof(dataSource[0].may),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.may}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'may',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.mayStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 106) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.jun'),
            key: nameof(dataSource[0].jun),
            dataIndex: nameof(dataSource[0].jun),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.jun}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'jun',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.junStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 107) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.jul'),
            key: nameof(dataSource[0].jul),
            dataIndex: nameof(dataSource[0].jul),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.jul}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'jul',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.julStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 108) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.aug'),
            key: nameof(dataSource[0].aug),
            dataIndex: nameof(dataSource[0].aug),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.aug}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'aug',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.augStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 109) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.sep'),
            key: nameof(dataSource[0].sep),
            dataIndex: nameof(dataSource[0].sep),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.sep}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'sep',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.sepStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 110) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.oct'),
            key: nameof(dataSource[0].oct),
            dataIndex: nameof(dataSource[0].oct),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.oct}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'oct',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.octStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 111) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.nov'),
            key: nameof(dataSource[0].nov),
            dataIndex: nameof(dataSource[0].nov),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.nov}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'nov',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.novStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentMonth?.id === 112) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.dec'),
            key: nameof(dataSource[0].dec),
            dataIndex: nameof(dataSource[0].dec),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.dec}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'dec',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.decStatus === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
    } else if (mode === 3) {
      if (model?.currentQuarter?.id === 201) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.q1'),
            key: nameof(dataSource[0].q1),
            dataIndex: nameof(dataSource[0].q1),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.q1}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'q1',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q1Status === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentQuarter?.id === 202) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.q2'),
            key: nameof(dataSource[0].q2),
            dataIndex: nameof(dataSource[0].q2),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.q2}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'q2',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q2Status === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentQuarter?.id === 203) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.q3'),
            key: nameof(dataSource[0].q3),
            dataIndex: nameof(dataSource[0].q3),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.q3}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'q3',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q3Status === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
      if (model?.currentQuarter?.id === 204) {
        return [
          {
            title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
            key: nameof(dataSource[0].kpiCriteriaGeneral),
            dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
            render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
              return kpiCriteriaGeneral?.name;
            },
            width: 250,
            ellipsis: true,
            fixed: 'left',
          },
          {
            title: translate('kpiGeneralContents.q4'),
            key: nameof(dataSource[0].q4),
            dataIndex: nameof(dataSource[0].q4),
            align: 'right',
            width: 150,
            render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
              return (
                <FormItem help={kpiGeneralContent.errors?.q4}>
                  <InputNumber
                    min={0}
                    allowNegative={false}
                    className="form-control form-control-sm"
                    name={nameof(item)}
                    value={item}
                    onChange={handleChangevalue(
                      indexInContent(index, pagination),
                      'q4',
                    )}
                    disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.q4Status === false}
                  />
                </FormItem>
              );
            },
          },
          {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(dataSource[0].status),
            dataIndex: nameof(dataSource[0].status),
            fixed: 'right',
            align: 'center',
            render(...params) {
              return (
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    KpiGeneralContent
                  >(params[1].errors, nameof(params[1].status))}
                  help={params[1].errors?.status}
                >
                  <SwitchStatus
                    checked={params[1].statusId === statusList[1]?.id}
                    list={statusList}
                    onChange={handleChangeStatus(params[2])}
                  />
                </FormItem>
              );
            },
          },
        ];
      }
    } else if (mode === 4) {
      return [
        {
          title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
          key: nameof(dataSource[0].kpiCriteriaGeneral),
          dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
          render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
            return kpiCriteriaGeneral?.name;
          },
          width: 250,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: translate('kpiGeneralContents.year'),
          key: nameof(dataSource[0].year),
          dataIndex: nameof(dataSource[0].year),
          align: 'right',
          width: 150,
          render(item: any, kpiGeneralContent: KpiGeneralContent, index) {
            return (
              <FormItem help={kpiGeneralContent.errors?.year}>
                <InputNumber
                  min={0}
                  allowNegative={false}
                  className="form-control form-control-sm"
                  name={nameof(item)}
                  value={item}
                  onChange={handleChangevalue(
                    indexInContent(index, pagination),
                    'year',
                  )}
                  disabled={kpiGeneralContent?.statusId === 0 || kpiGeneralContent?.yearStatus === false}
                />
              </FormItem>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(dataSource[0].status),
          dataIndex: nameof(dataSource[0].status),
          fixed: 'right',
          align: 'center',
          render(...params) {
            return (
              <FormItem
                validateStatus={formService.getValidationStatus<
                  KpiGeneralContent
                >(params[1].errors, nameof(params[1].status))}
                help={params[1].errors?.status}
              >
                <SwitchStatus
                  checked={params[1].statusId === statusList[1]?.id}
                  list={statusList}
                  onChange={handleChangeStatus(params[2])}
                />
              </FormItem>
            );
          },
        },
      ];
    }
  }, [
    dataSource,
    handleChangeStatus,
    handleChangevalue,
    mode,
    model,
    pagination,
    statusList,
    translate,
  ]);

  return (
    <>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        scroll={mode === 1 ? { x: 2400 } : { x: false }}
        className="table-scroll mr-3 ml-3"
      />
    </>
  );
}
export default KpiGeneralContentTable;
