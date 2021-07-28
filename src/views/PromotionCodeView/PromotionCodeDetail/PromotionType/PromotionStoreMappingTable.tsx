import { Popconfirm } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeStoreMapping } from 'models/PromotionCodeStoreMapping';
import { PromotionCodeStoreMappingFilter } from 'models/PromotionCodeStoreMappingFilter';
import { Store } from 'models/Store';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import nameof from 'ts-nameof.macro';
import { promotionCodeService } from 'views/PromotionCodeView/PromotionCodeService';
import PromotionCodeStoreMappingModal from './PromotionStoreMappingModal';

export interface PromotionCodeStoreMappingTabProps {
  model: PromotionCode;
  setModel: Dispatch<SetStateAction<PromotionCode>>;
  isPreview?: boolean;
}

export default function PromotionCodeStoreMappingTable(
  props: PromotionCodeStoreMappingTabProps,
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
    PromotionCodeStoreMapping,
    Store,
    PromotionCodeStoreMappingFilter
  >(
    PromotionCodeStoreMappingFilter,
    model,
    setModel,
    nameof(model.promotionCodeStoreMappings),
    nameof(model.promotionCodeStoreMappings[0].store),
    mapper,
    isPreview,
  );


  /* saveModal method, filter noteSelectedIds and create new Contents */
  const handleSaveModal = useCallback(
    (list: Store[]) => {
      if (list?.length > 0) {
        if (content.length > 0) {
          const listIds = list.map(item => item.id);
          const selectedIds = content.map(item => item.storeId);
          // merge old and new content
          list
            .filter((store: Store) => !selectedIds.includes(store.id))
            .forEach((store: Store) => {
              content.push(mapper(store));
            });
          // remove contents which id not included in list ids
          const newContent = content.filter((item: PromotionCodeStoreMapping) =>
            listIds.includes(item.storeId),
          );
          setContent([...newContent]);
          return;
        }
        const newContents = list.map((store: Store) => mapper(store));
        setContent([...newContents]);
        return;
      }
      // if list empty, setContent to []
      setContent([]);
    },
    [content, setContent],
  );


  const columns: ColumnProps<PromotionCodeStoreMapping>[] = useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PromotionCodeStoreMapping>(pagination),
      },
      {
        title: translate('promotionCodes.store.code'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].store),
        ellipsis: true,
        render(item: Store) {
          return item?.code;
        },
      },
      {
        title: translate('promotionCodes.store.codeDraft'),
        key: nameof(dataSource[0].codeDraft),
        dataIndex: nameof(dataSource[0].store),
        ellipsis: true,
        render(item: Store) {
          return item?.codeDraft;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('promotionCodes.store.name')}</div>
          </>
        ),

        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].store),
        ellipsis: true,
        render(item: Store) {
          return item?.name;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('promotionCodes.store.address')}</div>
          </>
        ),

        key: nameof(dataSource[0].address),
        dataIndex: nameof(dataSource[0].store),
        ellipsis: true,
        render(item: Store) {
          return item?.address;
        },
      },
      !isPreview
        ? {
          title: () => <>{translate(generalLanguageKeys.actions.label)}</>,
          key: nameof(generalLanguageKeys.actions),
          width: generalColumnWidths.actions,
          render(
            ...params: [
              PromotionCodeStoreMapping,
              PromotionCodeStoreMapping,
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
    [
      dataSource,
      handleDeleteContent,
      isPreview,
      pagination,
      translate,
    ],
  );


  return (
    <>
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

      {/* StoreModal */}
      <PromotionCodeStoreMappingModal
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

function mapper(model: PromotionCodeStoreMapping | Store): PromotionCodeStoreMapping {
  if (model.hasOwnProperty('store')) {
    const { store } = model;
    return {
      ...model,
      storeId: store?.id,
    };
  }
  return mapper({ ...new PromotionCodeStoreMapping(), store: model });
}
