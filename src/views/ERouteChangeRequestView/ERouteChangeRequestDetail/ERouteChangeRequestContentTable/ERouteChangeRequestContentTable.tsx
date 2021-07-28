import { Checkbox, Modal, Popconfirm } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import InputNumber from 'components/InputNumber/InputNumber';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import { renderMasterIndex, indexInContent } from 'helpers/ant-design/table';
import { ERouteChangeRequest } from 'models/ERouteChangeRequest';
import { ERouteChangeRequestContent } from 'models/ERouteChangeRequestContent';
import { ERouteChangeRequestContentFilter } from 'models/ERouteChangeRequestContentFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { eRouteChangeRequestRepository } from 'views/ERouteChangeRequestView/ERouteChangeRequestRepository';
import ERouteChangeRequestContentStoreMappingModal from './ERouteChangeRequestContentStoreMappingModal';
import './ERouteChangeRequestContentTable.scss';

export interface ERouteChangeRequestContentTableProps {
  model: ERouteChangeRequest;
  setModel: Dispatch<SetStateAction<ERouteChangeRequest>>;
}
function ERouteChangeRequestContentTable(props: ERouteChangeRequestContentTableProps) {
  const [translate] = useTranslation();

  const {
    model,
    setModel,
  } = props;

  const [
    eRouteChangeRequestContents,
    setERouteChangeRequestContents,
  ] = crudService.useContentTable<ERouteChangeRequest, ERouteChangeRequestContent>(
    model,
    setModel,
    nameof(model.eRouteChangeRequestContents),
  );

  const [selectedContents, setSelectedContents] = React.useState<
    ERouteChangeRequestContent[]
  >([]);

  const rowSelection: TableRowSelection<ERouteChangeRequestContent> = crudService.useContentModalList<
    ERouteChangeRequestContent
  >(selectedContents, setSelectedContents);
  const [
    eRouteChangeRequestContentFilter,
    setERouteChangeRequestContentFilter,
  ] = React.useState<ERouteChangeRequestContentFilter>(
    new ERouteChangeRequestContentFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
    ,
    ,
    ,
  ] = tableService.useLocalTable(
    eRouteChangeRequestContents,
    eRouteChangeRequestContentFilter,
    setERouteChangeRequestContentFilter,
  );

  const [
    loadingStore,
    visibleStore,
    setVisibleStore,
    listStore,
    totalStore,
  ] = crudService.useContentModal(
    eRouteChangeRequestRepository.listStore,
    eRouteChangeRequestRepository.countStore,
    StoreFilter,
  );



  const [
    handleChangeListSimpleField,
  ] = crudService.useListChangeHandlers<ERouteChangeRequestContent>(
    eRouteChangeRequestContents,
    setERouteChangeRequestContents,
  );
  const handleGoCreate = React.useCallback(
    () => {
      setVisibleStore(true);
      setERouteChangeRequestContents(eRouteChangeRequestContents);
    },
    [eRouteChangeRequestContents, setERouteChangeRequestContents, setVisibleStore],
  );

  const handleCloseStore = React.useCallback(
    () => {
      setVisibleStore(false);
    },
    [setVisibleStore],
  );

  const handleDeleteItem = React.useCallback(
    index => {
      if (index > -1) {
        eRouteChangeRequestContents.splice(index, 1);
      }
      setERouteChangeRequestContents([...eRouteChangeRequestContents]);
    },
    [eRouteChangeRequestContents, setERouteChangeRequestContents],
  );
  const handleSaveStoreModal = React.useCallback(
    (selectedStores: Store[]) => {
      return () => {
        if (eRouteChangeRequestContents) {
          if (eRouteChangeRequestContents.length > 0) {
            const contentStoreIds = eRouteChangeRequestContents.map((item: ERouteChangeRequestContent) => item.storeId);
            if (selectedStores && selectedStores.length > 0) {
              const usedStoreIds = selectedStores.map((item: Store) => item.id);
              // add new content by new stores
              selectedStores.forEach((i: Store) => {
                if (!contentStoreIds.includes(i.id)) {
                  const content = new ERouteChangeRequestContent();
                  content.store = i;
                  content.storeId = i?.id;
                  eRouteChangeRequestContents.push(content);
                }
              });
              // remove content by removed stores
              const newContents = eRouteChangeRequestContents.filter(content => usedStoreIds.includes(content.storeId));
              setERouteChangeRequestContents([...newContents]);
            }
          } else {
            if (selectedStores && selectedStores.length > 0) {
              selectedStores.forEach((i: Store) => {
                const content = new ERouteChangeRequestContent();
                content.store = i;
                content.storeId = i?.id;
                eRouteChangeRequestContents.push(content);
              });
              setERouteChangeRequestContents([...eRouteChangeRequestContents]);
            }
          }
        }
        setVisibleStore(false);
      };
    },
    [eRouteChangeRequestContents, setERouteChangeRequestContents, setVisibleStore],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map((content: ERouteChangeRequestContent) => content.storeId);
          // const remainContents = eRouteChangeRequestContents.filter((content: ERouteContent) => selectedContents.includes(content));
          const remainContents = eRouteChangeRequestContents.filter((content: ERouteChangeRequestContent) => {
            if (selectedStoreIds.includes(content.storeId)) {
              return false;
            }
            return true;
          });
          setERouteChangeRequestContents([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [eRouteChangeRequestContents, selectedContents, setERouteChangeRequestContents, translate]);

  const handleChangeCheckbox = React.useCallback(
    (field, index) => {
      return (ev: CheckboxChangeEvent) => {
        // find content which need modify
        const content = eRouteChangeRequestContents[index];
        // modify value of content field
        content[field] = ev.target?.checked;
        // setList
        setERouteChangeRequestContents([...eRouteChangeRequestContents]);
      };
    },
    [eRouteChangeRequestContents, setERouteChangeRequestContents],
  );

  const columns: ColumnProps<ERouteChangeRequestContent>[] = React.useMemo(
    () => {
      return [
        {
          title: '',
          children: [
            {
              title: translate(generalLanguageKeys.columns.index),
              key: nameof(generalLanguageKeys.index),
              width: generalColumnWidths.index,
              render: renderMasterIndex<ERouteChangeRequestContent>(pagination),
            },
            {
              title: translate('eRouteChangeRequestContents.store.code'),
              key: nameof(dataSource[0].store.code),
              dataIndex: nameof(dataSource[0].store),
              width: 100,
              ellipsis: true,
              render(store: Store) {
                return store?.code;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.store.name'),
              key: nameof(dataSource[0].store.name),
              dataIndex: nameof(dataSource[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.name;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.store.address'),
              key: nameof(dataSource[0].store.address),
              dataIndex: nameof(dataSource[0].store),
              ellipsis: true,
              render(store: Store) {
                return store?.address;
              },
            },
            {
              title: translate('eRouteChangeRequestContents.orderNumber'),
              key: nameof(dataSource[0].orderNumber),
              dataIndex: nameof(dataSource[0].orderNumber),
              width: 100,
              render(...[orderNumber, , index]) {
                return (
                  <>
                    <InputNumber
                      className="form-control form-control-sm"
                      defaultValue={orderNumber}
                      min={0}
                      allowNegative={false}
                      onChange={handleChangeListSimpleField(
                        nameof(orderNumber),
                        indexInContent(index, pagination),
                      )}
                    />
                  </>
                );
              },
            },
          ],
        },
        {
          title: translate('eRouteChangeRequestContents.frequency'),
          children: [
            {
              title: translate('eRouteChangeRequestContents.monday'),
              key: nameof(dataSource[0].monday),
              dataIndex: nameof(dataSource[0].monday),
              width: 50,
              render(...[monday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={monday}
                    onChange={handleChangeCheckbox(nameof(monday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.tuesday'),
              key: nameof(dataSource[0].tuesday),
              dataIndex: nameof(dataSource[0].tuesday),
              width: 50,
              render(...[tuesday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={tuesday}
                    onChange={handleChangeCheckbox(nameof(tuesday), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.wednesday'),
              key: nameof(dataSource[0].wednesday),
              dataIndex: nameof(dataSource[0].wednesday),
              width: 50,
              render(...[wednesday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={wednesday}
                    onChange={handleChangeCheckbox(nameof(wednesday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.thursday'),
              key: nameof(dataSource[0].thursday),
              dataIndex: nameof(dataSource[0].thursday),
              width: 50,
              render(...[thursday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={thursday}
                    onChange={handleChangeCheckbox(nameof(thursday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.friday'),
              key: nameof(dataSource[0].friday),
              dataIndex: nameof(dataSource[0].friday),
              width: 50,
              render(...[friday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={friday}
                    onChange={handleChangeCheckbox(nameof(friday), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.saturday'),
              key: nameof(dataSource[0].saturday),
              dataIndex: nameof(dataSource[0].saturday),
              width: 50,
              render(...[saturday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={saturday}
                    onChange={handleChangeCheckbox(nameof(saturday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.sunday'),
              key: nameof(dataSource[0].sunday),
              dataIndex: nameof(dataSource[0].sunday),
              width: 50,
              render(...[sunday, , index]) {
                return (
                  <Checkbox
                    defaultChecked={sunday}
                    onChange={handleChangeCheckbox(nameof(sunday), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week1'),
              key: nameof(dataSource[0].week1),
              dataIndex: nameof(dataSource[0].week1),
              width: 50,
              render(...[week1, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week1}
                    onChange={handleChangeCheckbox(nameof(week1), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week2'),
              key: nameof(dataSource[0].week2),
              dataIndex: nameof(dataSource[0].week2),
              width: 50,
              render(...[week2, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week2}
                    onChange={handleChangeCheckbox(nameof(week2), index)}
                  />
                );
              },
            },

            {
              title: translate('eRouteChangeRequestContents.week3'),
              key: nameof(dataSource[0].week3),
              width: 50,
              dataIndex: nameof(dataSource[0].week3),
              render(...[week3, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week3}
                    onChange={handleChangeCheckbox(nameof(week3), index)}
                  />
                );
              },
            },
            {
              title: translate('eRouteChangeRequestContents.week4'),
              key: nameof(dataSource[0].week4),
              dataIndex: nameof(dataSource[0].week4),
              width: 50,
              render(...[week4, , index]) {
                return (
                  <Checkbox
                    defaultChecked={week4}
                    onChange={handleChangeCheckbox(nameof(week4), index)}
                  />
                );
              },
            },
          ],
        },
        {
          title: '',
          children: [{
            title: translate(generalLanguageKeys.actions.label),
            key: nameof(generalLanguageKeys.columns.actions),
            dataIndex: nameof(dataSource[0].id),
            width: 50,
            align: 'center',
            render(...[, , index]) {
              return (
                <div className="button-action-table">
                  <Popconfirm
                    placement="top"
                    title={translate('general.delete.content')}
                    onConfirm={() => handleDeleteItem(index)}
                    okText={translate('general.actions.delete')}
                    cancelText={translate('general.actions.cancel')}
                  >
                    <button className="btn btn-sm btn-link">
                      <i className="tio-delete_outlined" />
                    </button>
                  </Popconfirm>
                </div>
              );
            },
          }],

        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [dataSource, handleChangeCheckbox, handleChangeListSimpleField, handleDeleteItem, pagination, translate],
  );


  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        tableLayout="fixed"
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        className="table-content"
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleGoCreate}
                >
                  <i className="fa mr-2 fa-plus" />
                  {translate('eRouteChangeRequestContents.create')}
                </button>
                <button
                  className="btn btn-sm btn-danger mr-2"
                  disabled={!selectedContents.length}
                  onClick={handleBulkDelete}
                >
                  <i className="fa mr-2 fa-trash" />
                  {translate(generalLanguageKeys.actions.delete)}
                </button>
              </div>
              <div className="flex-shrink-1 d-flex align-items-center mr-2">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination?.total,
                })}
              </div>
            </div>
          </>
        )}
      />
      <ERouteChangeRequestContentStoreMappingModal
        selectedList={eRouteChangeRequestContents}
        setSelectedList={setERouteChangeRequestContents}
        list={listStore}
        total={totalStore}
        isOpen={visibleStore}
        loading={loadingStore}
        toggle={handleCloseStore}
        onClose={handleCloseStore}
        onSave={handleSaveStoreModal}
        isSave={true}
        pagination={pagination}
        dataSource={dataSource}
        getList={eRouteChangeRequestRepository.listStore}
        count={eRouteChangeRequestRepository.countStore}
      />
    </>
  );
}
export default ERouteChangeRequestContentTable;
