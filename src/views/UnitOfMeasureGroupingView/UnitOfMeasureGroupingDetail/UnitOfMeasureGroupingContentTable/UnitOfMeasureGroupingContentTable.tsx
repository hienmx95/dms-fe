import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import InputNumber from 'components/InputNumber/InputNumber';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex, indexInContent } from 'helpers/ant-design/table';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingContentFilter } from 'models/UnitOfMeasureGroupingContentFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { unitOfMeasureGroupingRepository } from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingRepository';
import './UnitOfMeasureGroupingContentTable.scss';
import { v4 as uuidv4 } from 'uuid';
import { API_UNIT_OF_MEASURE_GROUPING_ROUTE } from 'config/api-consts';
export interface UnitOfMeasureGroupingContentTableProps
  extends ContentTableProps<
    UnitOfMeasureGrouping,
    UnitOfMeasureGroupingContent
  > {
  filter?: UnitOfMeasureFilter;
  unitOfMeasureGrouping?: UnitOfMeasureGrouping;
  setFilter?: Dispatch<SetStateAction<UnitOfMeasureFilter>>;
  isPreview?: boolean;
}
const { Item: FormItem } = Form;

function UnitOfMeasureGroupingContentTable(
  props: UnitOfMeasureGroupingContentTableProps,
) {
  const [translate] = useTranslation();
  const { model, setModel, filter, setFilter, isPreview } = props;

  const { validAction } = crudService.useAction(
    'unit-of-measure-grouping',
    API_UNIT_OF_MEASURE_GROUPING_ROUTE,
    'mdm',
  );

  const [
    unitOfMeasureGroupingContents,
    setUnitOfMeasureGroupingContents,
    ,
    handleDelete,
  ] = crudService.useContentTable<
    UnitOfMeasureGrouping,
    UnitOfMeasureGroupingContent
  >(model, setModel, nameof(model.unitOfMeasureGroupingContents));

  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    UnitOfMeasureGroupingContent
  >(unitOfMeasureGroupingContents, setUnitOfMeasureGroupingContents);

  const [
    unitOfMeasureGroupingContentFilter,
    setUnitOfMeasureGroupingContentFilter,
  ] = React.useState<UnitOfMeasureGroupingContentFilter>(
    new UnitOfMeasureGroupingContentFilter(),
  );

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    unitOfMeasureGroupingContents,
    unitOfMeasureGroupingContentFilter,
    setUnitOfMeasureGroupingContentFilter,
  );

  const [dataSourceWithDefault, setDataSourceWithDefault] = React.useState<
    UnitOfMeasureGroupingContent[]
  >([]);

  const defaultUOMList = React.useMemo(() => {
    return (content: UnitOfMeasureGroupingContent) => {
      const unit = content.unitOfMeasure;
      if (unit) {
        return [unit];
      }
      return [];
    };
  }, []);

  React.useEffect(() => {
    if (model.unitOfMeasure) {
      if (model) {
        if (dataSource.length > 0) {
          const staticContent = dataSource
            .filter(item => item.unitOfMeasure)
            .find(item => item.unitOfMeasure.id === model.unitOfMeasure.id);
          if (staticContent) {
            dataSource[0] = staticContent;
          } else {
            const defaultContent = {
              ...new UnitOfMeasureGroupingContent(),
              key: uuidv4(),
              factor: 1,
              unitOfMeasure: model.unitOfMeasure,
            };
            dataSource.splice(0, 0, defaultContent);
          }
        } else {
          const defaultContent = {
            ...new UnitOfMeasureGroupingContent(),
            key: uuidv4(),
            factor: 1,
            unitOfMeasure: model.unitOfMeasure,
          };
          dataSource.splice(0, 0, defaultContent);
        }
        setDataSourceWithDefault([...dataSource]);
      }
    }
  }, [dataSource, model]);

  /* update initial selectedIds */
  React.useEffect(() => {
    if (model) {
      const Ids = [];
      if (model.unitOfMeasure) {
        Ids.push(model.unitOfMeasure.id);
      }
      if (model?.unitOfMeasureGroupingContents?.length > 0) {
        model.unitOfMeasureGroupingContents.forEach(content => {
          if (content.unitOfMeasure?.id) {
            Ids.push(content.unitOfMeasure?.id);
          }
        });
      }
      setSelectedIds([...Ids]);
      const newFilter = new UnitOfMeasureFilter();
      newFilter.id.notIn = Ids;
      setFilter({
        ...newFilter,
      });
    }
  }, [model, setFilter]);

  const handleChangeUOMInContent = React.useCallback(
    (unitOfMeasure: UnitOfMeasure, index: number) => {
      return (id: number | string | null, t: UnitOfMeasure) => {
        unitOfMeasureGroupingContents[index] = {
          ...unitOfMeasureGroupingContents[index],
          unitOfMeasure: t,
          unitOfMeasureId: +id,
        };
        setUnitOfMeasureGroupingContents([...unitOfMeasureGroupingContents]);
        // update selected Ids when chosing new UOM
        selectedIds.filter(id => id !== unitOfMeasure?.id).push(+id);
        setSelectedIds([...selectedIds]);
        // update filter
        filter.id.notIn = [...selectedIds];
        setFilter(filter);
      };
    },
    [
      filter,
      selectedIds,
      setFilter,
      setUnitOfMeasureGroupingContents,
      unitOfMeasureGroupingContents,
    ],
  );

  const handleAdd = React.useCallback(() => {
    if (model) {
      const { productGroupingId } = model;
      const newContent = {
        ...new UnitOfMeasureGroupingContent(),
        key: uuidv4(),
        productGroupingId,
      };
      unitOfMeasureGroupingContents.splice(
        unitOfMeasureGroupingContents.length,
        0,
        newContent,
      );
      setUnitOfMeasureGroupingContents([...unitOfMeasureGroupingContents]);
    }
  }, [model, setUnitOfMeasureGroupingContents, unitOfMeasureGroupingContents]);

  const columns: ColumnProps<UnitOfMeasureGroupingContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<UnitOfMeasureGroupingContent>(pagination),
      },
      {
        title: translate('unitOfMeasureGroupingContents.number'),
        align: 'center',
        render() {
          return <div>1</div>;
        },
      },
      {
        title: translate('unitOfMeasureGroupingContents.unitOfMeasureChange'),
        key: nameof(dataSource[0].unitOfMeasureGroupingContents.unitOfMeasure),
        dataIndex: nameof(
          dataSource[0].unitOfMeasureGroupingContents.unitOfMeasure,
        ),
        align: 'center',
        render(
          unitOfMeasure: UnitOfMeasure,
          content: UnitOfMeasureGroupingContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                UnitOfMeasureGroupingContent
              >(content.errors, nameof(content.unitOfMeasure))}
              help={content.errors?.unitOfMeasure}
            >
              {validAction('singleListUnitOfMeasure') && (
                <SelectAutoComplete
                  value={content.unitOfMeasure?.id}
                  onChange={handleChangeUOMInContent(unitOfMeasure, index - 1)}
                  getList={
                    unitOfMeasureGroupingRepository.singleListUnitOfMeasure
                  }
                  list={defaultUOMList(content)}
                  modelFilter={filter}
                  setModelFilter={setFilter}
                  searchField={nameof(filter.name)}
                  searchType={nameof(filter.name.contain)}
                  placeholder={translate(
                    'unitOfMeasureGroupingContents.placeholder.unitOfMeasure',
                  )}
                  allowClear={false}
                  disabled={
                    dataSourceWithDefault.indexOf(content) === 0
                      ? true
                      : false || isPreview
                  }
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: translate('unitOfMeasureGroupingContents.equal'),
        align: 'center',
        render() {
          return <div>=</div>;
        },
      },
      {
        title: translate('unitOfMeasureGroupingContents.factor'),
        key: nameof(dataSource[0].factor),
        dataIndex: nameof(dataSource[0].factor),
        align: 'center',
        render(
          factor: any,
          content: UnitOfMeasureGroupingContent,
          index: number,
        ) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                UnitOfMeasureGroupingContent
              >(content.errors, nameof(content.factor))}
              help={content.errors?.factor}
            >
              <InputNumber
                className="form-control form-control-sm"
                defaultValue={factor}
                onChange={handleChangeListSimpleField(
                  nameof(factor),
                  indexInContent(index, pagination) - 1,
                )}
                allowNegative={false}
                disabled={
                  dataSourceWithDefault.indexOf(content) === 0
                    ? true
                    : false || isPreview
                }
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('unitOfMeasureGroupingContents.unitOfMeasure'),
        key: nameof(dataSource[0].unitOfMeasureGrouping.unitOfMeasure.name),
        dataIndex: nameof(
          dataSource[0].unitOfMeasureGrouping.unitOfMeasure.name,
        ),
        align: 'center',
        ellipsis: true,
        render() {
          return (
            <>
              <div className="text-center">{model?.unitOfMeasure?.name}</div>
            </>
          );
        },
      },

      !isPreview
        ? {
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(generalLanguageKeys.actions),
            width: generalColumnWidths.actions,
            align: 'center',
            render(
              ...params: [
                UnitOfMeasureGroupingContent,
                UnitOfMeasureGroupingContent,
                number,
              ]
            ) {
              return (
                <div className="button-action-table">
                  {validAction('update') && (
                    <button
                      className="btn btn-link mr-2"
                      onClick={handleDelete(params[2] - 1)}
                      disabled={
                        dataSourceWithDefault.indexOf(params[1]) === 0
                          ? true
                          : false
                      }
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  )}
                </div>
              );
            },
          }
        : {
            width: 0,
          },
    ],
    [
      dataSource,
      dataSourceWithDefault,
      defaultUOMList,
      filter,
      handleChangeListSimpleField,
      handleChangeUOMInContent,
      handleDelete,
      model,
      pagination,
      setFilter,
      translate,
      validAction,
      isPreview,
    ],
  );

  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAdd}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAdd, translate],
  );

  return (
    <div className="uom-table-content">
      <Table
        pagination={pagination}
        dataSource={dataSourceWithDefault}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        footer={!isPreview && tableFooter}
        className="ml-24 table-content"
      />
    </div>
  );
}
export default UnitOfMeasureGroupingContentTable;
