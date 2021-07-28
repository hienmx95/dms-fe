import { Input } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps } from 'antd/lib/table';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import InputNumber from 'components/InputNumber/InputNumber';
import { API_WAREHOUSE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Inventory } from 'models/Inventory';
import { InventoryFilter } from 'models/InventoryFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { ProductFilter } from 'models/ProductFilter';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Warehouse } from 'models/Warehouse';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import nameof from 'ts-nameof.macro';
import { warehouseRepository } from 'views/WarehouseView/WarehouseRepository';
import { warehouseService } from '../../WarehouseService';
import InventoryHistoryModal from '../InventoryHistoryModal/InventoryHistoryModal';
import './InventoryTable.scss';

const { Item: FormItem } = Form;

function InventoryTable(props: ContentTableProps<Warehouse, Inventory>) {
  const { validAction } = crudService.useAction(
    'warehouse',
    API_WAREHOUSE_ROUTE,
  );
  const [translate] = useTranslation();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const { model, setModel } = props;

  // UOM filter
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const [productFilter, setProductFilter] = React.useState<ProductFilter>(
    new ProductFilter(),
  );
  const [itemFilter, setItemFilter] = React.useState<ItemFilter>(
    new ItemFilter(),
  );

  const [handleFilterUOM, setHandleFilterUOM] = React.useState<boolean>(false);

  const [inventoryFilter] = React.useState<InventoryFilter>(
    new InventoryFilter(),
  );
  const [
    inventories,
    setInventories,
    dataSource,
    pagination,
    handleTableChange,
  ] = warehouseService.useInventoryLocalTable(
    model,
    setModel,
    nameof(model.inventories),
    productFilter,
    setProductFilter,
    itemFilter,
    handleFilterUOM,
    unitOfMeasureFilter,
  );

  React.useEffect(() => {
    inventoryFilter.id.equal = model.id;
  }, [inventoryFilter.id.equal, model.id]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [
    handleImport,
    importInventories,
    setImportInventories,
    errVisible,
    setErrVisible,
    errModel,
  ] = warehouseService.useImport(
    warehouseRepository.import,
    setLoading,
    inventoryFilter,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    warehouseRepository.export,
    inventoryFilter,
  );
  const [handleExportTemplate] = crudService.useExport(
    warehouseRepository.exportTemplate,
    inventoryFilter,
  );

  const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
    Inventory
  >(inventories, setInventories);

  React.useEffect(() => {
    if (importInventories && importInventories.length > 0) {
      setInventories(importInventories);
      setImportInventories([]);
    }
  }, [setInventories, importInventories, setImportInventories]);

  const handleViewHistory = React.useCallback(
    (inventory: Inventory) => {
      setVisible(true);
      setCurrentItem(inventory);
    },
    [setVisible, setCurrentItem],
  );

  const handleClose = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      setHandleFilterUOM(false);
      itemFilter[field].contain = ev.target.value.toLocaleLowerCase();
      // unitOfMeasureFilter[field].contain = (ev.target.value).toLocaleLowerCase();
      productFilter.skip = 0;
      setItemFilter({
        ...itemFilter,
      });
      setProductFilter({
        ...productFilter,
      });
    },
    [itemFilter, productFilter],
  );

  const handleIdFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      unitOfMeasureFilter[field].contain = ev.target.value.toLocaleLowerCase();
      productFilter.skip = 0;
      setHandleFilterUOM(true);
      setProductFilter({
        ...productFilter,
      });
      setUnitOfMeasureFilter({
        ...unitOfMeasureFilter,
      });
    },
    [productFilter, unitOfMeasureFilter],
  );

  const columns: ColumnProps<Inventory>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.columns.index)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Inventory>(pagination),
      },

      {
        title: () => (
          <>
            <div>{translate('warehouses.item.code')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(itemFilter.codeLower))}
              className="form-control form-control-sm mt-2 mb-2"
              placeholder={translate('warehouses.placeholder.codeItem')}
            />
          </>
        ),
        key: nameof(dataSource[0].itemCode),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('warehouses.item.name')}</div>
            <Input
              type="text"
              onChange={handleValueFilter(nameof(itemFilter.nameLower))}
              className="form-control form-control-sm mt-2 mb-2"
              placeholder={translate('warehouses.placeholder.nameItem')}
            />
          </>
        ),
        key: nameof(dataSource[0].itemName),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
      },
      {
        title: () => (
          <div className="table-title-header ml-3">
            {translate('warehouses.saleStock')}
          </div>
        ),
        key: nameof(dataSource[0].inventories.saleStock),
        dataIndex: nameof(dataSource[0].inventories.saleStock),
        render(saleStock: number, inventory: Inventory) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Inventory>(
                inventory.errors,
                nameof(inventory.saleStock),
              )}
              help={inventory.errors?.saleStock}
            >
              <InputNumber
                type="text"
                className="form-control form-control-sm"
                name={nameof(saleStock)}
                defaultValue={inventory.saleStock}
                onChange={handleChangeListSimpleField(
                  nameof(saleStock),
                  inventory.tableIndex,
                )}
                onlyInteger={true}
                allowNegative={false}
                min={0}
              />
            </FormItem>
          );
        },
      },
      {
        title: () => (
          <div className="table-title-header ml-3">
            {translate('warehouses.accountingStock')}
          </div>
        ),
        key: nameof(dataSource[0].accountingStock),
        dataIndex: nameof(dataSource[0].accountingStock),
        render(accountingStock: number, inventory: Inventory) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Inventory>(
                inventory.errors,
                nameof(inventory.accountingStock),
              )}
              help={inventory.errors?.accountingStock}
            >
              <InputNumber
                type="text"
                className="form-control form-control-sm"
                name={nameof(accountingStock)}
                defaultValue={inventory.accountingStock}
                onChange={handleChangeListSimpleField(
                  nameof(accountingStock),
                  inventory.tableIndex,
                )}
                onlyInteger={true}
                allowNegative={false}
                min={0}
              />
            </FormItem>
          );
        },
      },
      {
        // title: translate('warehouses.item.unitOfMeasure'),
        title: () => (
          <>
            <div className="mb-2">
              {translate('warehouses.item.unitOfMeasure')}
            </div>
            <Input
              type="text"
              onChange={handleIdFilter(nameof(unitOfMeasureFilter.nameLower))}
              className="form-control form-control-sm mt-2 mb-2"
              placeholder={translate('warehouses.placeholder.unitOfMeasure')}
            />
          </>
        ),
        key: nameof(dataSource[0].item),
        width: 250,
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.product?.unitOfMeasure?.name;
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [Inventory, Inventory, number]) {
          return (
            <>
              {validAction('listHistory') && (
                <button
                  className="btn btn-link mr-2"
                  onClick={() => handleViewHistory(params[1])}
                >
                  <i className="fa fa-history" aria-hidden="true" />
                </button>
              )}
            </>
          );
        },
      },
    ],
    [
      pagination,
      dataSource,
      translate,
      handleValueFilter,
      itemFilter.codeLower,
      itemFilter.nameLower,
      handleChangeListSimpleField,
      handleIdFilter,
      unitOfMeasureFilter.nameLower,
      handleViewHistory,
      validAction,
    ],
  );

  return (
    <>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        className="local-table"
        loading={loading}
        title={() => (
          <>
            <div className="d-flex justify-content-between">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('import') && (
                  <label
                    className="btn btn-sm btn-outline-primary mr-2 ml-2 mb-0"
                    htmlFor="master-import"
                  >
                    <i className="tio-file_add_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                )}
                <input
                  type="file"
                  className="hidden"
                  id="master-import"
                  onChange={handleImport}
                />
                {validAction('export') && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                )}
                {validAction('exportTemplate') && (
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      />

      {visible && (
        <InventoryHistoryModal
          title={translate('warehouses.master.inventoryHistory')}
          isOpen={visible}
          currentItem={currentItem}
          getList={warehouseRepository.listHistory}
          count={warehouseRepository.countHistory}
          handleClose={handleClose}
        />
      )}
      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </>
  );
}
export default InventoryTable;
