import { Popconfirm } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { Product } from 'models/Product';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeProductMapping } from 'models/PromotionCodeProductMapping';
import { PromotionCodeProductMappingFilter } from 'models/PromotionCodeProductMappingFilter';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import nameof from 'ts-nameof.macro';
import { promotionCodeService } from 'views/PromotionCodeView/PromotionCodeService';
import PromotionProductMappingModal from './PromotionProductMappingModal';

export interface PromotionProductMappingTabProps {
  model: PromotionCode;
  setModel: Dispatch<SetStateAction<PromotionCode>>;
  isPreview?: boolean;
}

export default function PromotionProductMappingTable(
  props: PromotionProductMappingTabProps,
) {
  const { model, setModel, isPreview } = props;

  const {
    translate,
    dataSource,
    pagination,
    handleTableChange,
    handleBulkDelete,
    handleOpenModal,
    handleCloseModal,
    isOpen,
    loadList,
    setLoadList,
    selectedList,
    setSelectedList,
    rowSelection,
    hasSelect,
    handleDeleteContent,
    content,
    setContent,
  } = promotionCodeService.usePromotionCodeMappingTable<
    PromotionCodeProductMapping,
    Product,
    PromotionCodeProductMappingFilter
  >(
    PromotionCodeProductMappingFilter,
    model,
    setModel,
    nameof(model.promotionCodeProductMappings),
    nameof(model.promotionCodeProductMappings[0].product),
    mapper,
    isPreview,
  );

  /* saveModal method, filter noteSelectedIds and create new Contents */
  const handleSaveModal = useCallback(
    (list: Product[]) => {
      if (list?.length > 0) {
        if (content.length > 0) {
          const listIds = list.map(item => item.id);
          const selectedIds = content.map(item => item.productId);
          // merge old and new content
          list
            .filter((product: Product) => !selectedIds.includes(product.id))
            .forEach((product: Product) => {
              content.push(mapper(product));
            });
          // remove contents which id not included in list ids
          const newContent = content.filter(
            (item: PromotionCodeProductMapping) =>
              listIds.includes(item.productId),
          );
          setContent([...newContent]);
          return;
        }
        const newContents = list.map((product: Product) => mapper(product));

        setContent([...newContents]);
        return;
      }
      // if list empty, setContent to []
      setContent([]);
    },
    [content, setContent],
  );

  const columns: ColumnProps<PromotionCodeProductMapping>[] = useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PromotionCodeProductMapping>(pagination),
      },
      {
        title: translate('promotionCodes.product.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].product),
        ellipsis: true,
        render(item: Product) {
          return item?.code;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('promotionCodes.product.name')}</div>
          </>
        ),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].product),
        ellipsis: true,
        render(item: Product) {
          return item?.name;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('promotionCodes.product.salePrice')}</div>
          </>
        ),
        key: nameof(dataSource[0].salePrice),
        dataIndex: nameof(dataSource[0].product),
        ellipsis: true,
        render(item: Product) {
          return formatNumber(item?.salePrice);
        },
      },

      !isPreview
        ? {
          title: () => <>{translate(generalLanguageKeys.actions.label)}</>,
          key: nameof(generalLanguageKeys.actions),
          width: generalColumnWidths.actions,
          render(
            ...params: [
              PromotionCodeProductMapping,
              PromotionCodeProductMapping,
              number,
            ]
          ) {
            return (
              <div className="button-action-table">
                {/* {validAction('create') && ( */}
                <Popconfirm
                  placement="left"
                  title={translate('general.delete.content')}
                  onConfirm={handleDeleteContent(
                    params[1],
                    params[1].tableIndex, // just reserving indexIn Content for deleting exactly
                  )}
                  okText={translate('general.actions.delete')}
                  cancelText={translate('general.actions.cancel')}
                >
                  <button className="btn btn-link mr-2">
                    <i className="tio-delete_outlined" />
                  </button>
                </Popconfirm>
                {/* )} */}
              </div>
            );
          },
        }
        : {
          width: 0,
        },
    ],
    [dataSource, handleDeleteContent, isPreview, pagination, translate],
  );

  return (
    <>
      {/* ProductTable */}
      <Table
        pagination={pagination}
        rowKey={nameof(dataSource[0].key)}
        dataSource={dataSource}
        rowSelection={rowSelection}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        className="table-content-item-mapping ml-3"
        scroll={{ y: 700 }}
        title={() => (
          <>
            {!isPreview && (
              <div className="d-flex justify-content-between button-table">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {/* {validAction('listItem') && ( */}
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenModal}
                      disabled={
                        model.used
                      }
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate('general.actions.addNew')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      onClick={handleBulkDelete}
                      disabled={!hasSelect || model.used}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  </>
                </div>
              </div>
            )}
          </>
        )}
      />

      {/* ProductModal */}
      <PromotionProductMappingModal
        model={model} // pass model to filter orgUnit by model.orgUnit path
        isOpen={isOpen}
        onSave={handleSaveModal}
        onClose={handleCloseModal}
        loadList={loadList}
        setLoadList={setLoadList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
    </>
  );
}

function mapper(
  model: PromotionCodeProductMapping | Product,
): PromotionCodeProductMapping {
  if (model.hasOwnProperty('product')) {
    const { product } = model;
    return {
      ...model,
      productId: product?.id,
      product,
    };
  }
  return mapper({ ...new PromotionCodeProductMapping(), product: model });
}
