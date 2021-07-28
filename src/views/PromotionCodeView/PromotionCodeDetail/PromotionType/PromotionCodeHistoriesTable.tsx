import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { formatNumber } from 'core/helpers/number';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeHistory } from 'models/PromotionCodeHistory';
import { PromotionCodeHistoryFilter } from 'models/PromotionCodeHistoryFilter';
import { Store } from 'models/Store';
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';
import nameof from 'ts-nameof.macro';
import { promotionCodeService } from 'views/PromotionCodeView/PromotionCodeService';

export interface PromotionCodeStoreMappingTabProps {
  model: PromotionCode;
  setModel: Dispatch<SetStateAction<PromotionCode>>;
  isPreview?: boolean;
}

export default function PromotionCodeHistoriesTable(
  props: PromotionCodeStoreMappingTabProps,
) {
  // const [translate] = useTranslation();
  const { model, setModel, isPreview } = props;
  const [list, setList] = React.useState<DirectSalesOrder[]>([]);

  const {
    translate,
    dataSource,
    pagination,
    handleTableChange,
    loadList,
    setLoadList,
    filter: storeMappingsFilter,
    handleFilter,
    content,
  } = promotionCodeService.usePromotionCodeMappingTable<
    PromotionCodeHistory,
    Store,
    PromotionCodeHistoryFilter
  >(
    PromotionCodeHistoryFilter,
    model,
    setModel,
    nameof(model.promotionCodeHistories),
    nameof(model.promotionCodeHistories[0].directSalesOrder),
    mapper,
    isPreview,
  );

  React.useEffect(() => {
    if (loadList) {
      if (model && model.promotionCodeHistories && model.promotionCodeHistories.length > 0) {
        model.promotionCodeHistories.forEach((element: PromotionCodeHistory) => {
          list.push(element.directSalesOrder);
        });
        setList([...list]);
      }
      setLoadList(false);
    }

  }, [setList, list, model, setLoadList, loadList]);

  const columns: ColumnProps<PromotionCodeHistory>[] = useMemo(
    () => {
      return [
        {
          title: () => <>{translate(generalLanguageKeys.columns.index)}</>,
          children: [
            {
              title: '',
              key: nameof(generalLanguageKeys.columns.index),
              width: generalColumnWidths.index,
              render: renderMasterIndex<PromotionCodeHistory>(pagination),
            },
          ],
        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.directSalesOrderCode')}</div>
            </>
          ),
          children: [
            {
              title: () => (
                <AdvancedStringFilter
                  filterType={nameof(
                    storeMappingsFilter.code.contain,
                  )}
                  filter={storeMappingsFilter.code}
                  onChange={handleFilter(
                    nameof(storeMappingsFilter.code),
                  )}
                  className="w-100"
                  placeholder={translate('promotionCodes.placeholder.directSalesOrderCode')}
                />
              ),
              key: nameof(dataSource[0].directSalesOrder),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return directSalesOrder?.code;
              },
            },
          ],

        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.store.code')}</div>
            </>
          ),
          children: [
            {
              title: () => (
                <AdvancedStringFilter
                  filterType={nameof(
                    storeMappingsFilter.storeCode.contain,
                  )}
                  filter={storeMappingsFilter.storeCode}
                  onChange={handleFilter(
                    nameof(storeMappingsFilter.storeCode),
                  )}
                  className="w-100"
                  placeholder={translate('stores.placeholder.code')}
                />
              ),
              key: nameof(dataSource[0].code),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return directSalesOrder?.buyerStore?.code;
              },
            },
          ],

        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.store.name')}</div>
            </>
          ),
          children: [
            {
              title: () => (
                <AdvancedStringFilter
                  filterType={nameof(
                    storeMappingsFilter.storeName.contain,
                  )}
                  filter={storeMappingsFilter.storeName}
                  onChange={handleFilter(
                    nameof(storeMappingsFilter.storeName),
                  )}
                  className="w-100"
                  placeholder={translate('stores.placeholder.name')}
                />
              ),
              key: nameof(dataSource[0].name),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return directSalesOrder?.buyerStore?.name;
              },
            },
          ],
        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.store.address')}</div>
            </>
          ),
          children: [
            {
              title: () => (
                <AdvancedStringFilter
                  filterType={nameof(
                    storeMappingsFilter.storeAddress.contain,
                  )}
                  filter={storeMappingsFilter.storeAddress}
                  onChange={handleFilter(
                    nameof(storeMappingsFilter.storeAddress),
                  )}
                  className="w-100"
                  placeholder={translate('stores.placeholder.address')}
                />
              ),
              key: nameof(dataSource[0].address),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return directSalesOrder?.buyerStore?.address;
              },
            },
          ],
        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.totalAfterTax')}</div>
            </>
          ),
          children: [
            {
              key: nameof(dataSource[0].totalAfterTax),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return formatNumber(directSalesOrder.totalAfterTax);
              },
              align: 'right',
            },
          ],
          align: 'right',
        },
        {
          title: () => (
            <>
              <div>{translate('promotionCodes.promotionValue')}</div>
            </>
          ),
          children: [
            {
              key: nameof(dataSource[0].promotionValue),
              dataIndex: nameof(dataSource[0].directSalesOrder),
              ellipsis: true,
              render(...[directSalesOrder]) {
                return formatNumber(directSalesOrder.promotionValue);
              },
              align: 'right',
            },
          ],
          align: 'right',
        },
      ];
    },
    [
      handleFilter,
      storeMappingsFilter,
      dataSource,
      pagination,
      translate,
    ],
  );


  return (
    <>
      <Table
        pagination={pagination}
        rowKey={nameof(content[0].key)}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        className="table-content-item-mapping ml-3 mr-3"
      />
    </>
  );
}

function mapper(model: PromotionCodeHistory | DirectSalesOrder): PromotionCodeHistory {

  if (model.hasOwnProperty('directSalesOrder')) {
    const { directSalesOrder } = model;

    return {
      directSalesOrder,
      code: directSalesOrder?.code,
      storeCode: directSalesOrder?.buyerStore?.code,
      storeName: directSalesOrder?.buyerStore?.name,
      storeAddress: directSalesOrder?.buyerStore?.address,
      key: model.key,
    };
  }
  return mapper({ ...new PromotionCodeHistory(), store: model });
}

