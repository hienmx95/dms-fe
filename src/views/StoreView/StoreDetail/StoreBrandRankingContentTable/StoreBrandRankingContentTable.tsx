import Form from 'antd/lib/form';
import Tag from 'antd/lib/tag';
// import { Modal } from 'antd';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import TreePopup from 'components/TreePopup/TreePopup';
import InputNumber from 'components/InputNumber/InputNumber';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Store } from 'models/Store';
// import { StoreFilter } from 'models/StoreFilter';
// import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { BrandInStore } from 'models/BrandInStore';
import { BrandInStoreFilter } from 'models/BrandInStoreFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { storeRepository } from 'views/StoreView/StoreRepository';
import './StoreBrandRankingContentTable.scss';
// import { v4 as uuidv4 } from 'uuid';
import { API_STORE_ROUTE } from 'config/api-consts';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import _ from 'lodash';

const { Item: FormItem } = Form;

function StoreBrandRankingContentTable(
  props: ContentTableProps<Store, BrandInStore>,
) {
  const [translate] = useTranslation();
  const { model, setModel } = props;

  const { validAction } = crudService.useAction('store', API_STORE_ROUTE);

  const [visible, setVisible] = React.useState<boolean>(false);

  const [
    brandInStores,
    setBrandInStores,
    // handleDelete,
    ,
    ,
  ] = crudService.useContentTable<Store, BrandInStore>(
    model,
    setModel,
    nameof(model.brandInStores),
  );

  const [brandInStoreFilter, setBrandInStoreFilter] = React.useState<
    BrandInStoreFilter
  >(new BrandInStoreFilter());

  const [brandFilter, setBrandFilter] = React.useState<BrandFilter>(
    new BrandFilter(),
  );

  const [productGroupingFilter, setProductGroupingFilter] = React.useState<
    ProductGroupingFilter
  >(new ProductGroupingFilter());

  // const [handleChangeListSimpleField] = crudService.useListChangeHandlers<
  //   BrandInStore
  // >(brandInStores, setBrandInStores);

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    brandInStores,
    brandInStoreFilter,
    setBrandInStoreFilter,
  );

  const [selectedContents, setSelectedContents] = React.useState<
    BrandInStore[]
  >([]);

  const rowSelection: TableRowSelection<BrandInStore> = crudService.useContentModalList<
    BrandInStore
  >(selectedContents, setSelectedContents);
  //

  const [productGroupings, setProductGroupings] = React.useState<
    ProductGrouping[]
  >([]);

  const [
    currentIndexBrandInStore,
    setCurrentIndexBrandInStore,
  ] = React.useState<number>(0);

  const handleAdd = React.useCallback(() => {
    const newBrandInStore = new BrandInStore();

    brandInStores.push({
      ...newBrandInStore,
      brandInStoreProductGroupingMappings: [],
    });
    setBrandInStores([...brandInStores]);
  }, [brandInStores, setBrandInStores]);

  const handleChangeTreePopup = React.useCallback(
    (index: number) => (items: ProductGrouping[]) => {
      setVisible(false);
      setProductGroupings(items);
      setCurrentIndexBrandInStore(index);
      const brandInStoreProductGroupingMappings = [];
      if (items && items.length > 0) {
        items.forEach(item => {
          brandInStoreProductGroupingMappings.push({
            productGrouping: item,
            productGroupingId: item.id,
          });
        });
      }

      brandInStores[index] = BrandInStore.clone<BrandInStore>({
        ...brandInStores[index],
        brandInStoreProductGroupingMappings: [
          ...brandInStoreProductGroupingMappings,
        ],
        errors: {
          ...brandInStores[index].errors,
          brandInStoreProductGroupingMappings: null,
        },
      });

      setBrandInStores([...brandInStores]);
    },
    [setVisible, brandInStores, setBrandInStores],
  );

  const handleOpenModal = React.useCallback(
    (index: number) => {
      setCurrentIndexBrandInStore(index);

      setProductGroupings([
        ...brandInStores[index].brandInStoreProductGroupingMappings.map(
          (item: any) => {
            return item.productGrouping;
          },
        ),
      ]);
      setVisible(true);
    },
    [brandInStores],
  );

  const sortByRanking = React.useCallback((list: BrandInStore[]) => {
    return _.sortBy(list, [item => item.top]);
  }, []);
  const checkMissingField = React.useCallback(
    (field1: string, field2: string, field3: string) => {
      let isApplied = true;
      const newBrandInStores = brandInStores.map(
        (brandInStore: BrandInStore) => {
          let newBrandInStore = { ...brandInStore };
          if (
            brandInStore[field1] === undefined ||
            (brandInStore[field1] && brandInStore[field1].length === 0)
          ) {
            isApplied = false;
            newBrandInStore = {
              ...newBrandInStore,
              errors: {
                ...newBrandInStore.errors,
                [field1]: translate('storeBrandRankingContents.errors.brand'),
              },
            };
          }
          if (
            brandInStore[field2] === undefined ||
            (brandInStore[field2] && brandInStore[field2].length === 0)
          ) {
            isApplied = false;
            newBrandInStore = {
              ...newBrandInStore,
              errors: {
                ...newBrandInStore.errors,
                [field2]: translate(
                  'storeBrandRankingContents.errors.productGrouping',
                ),
              },
            };
          }
          if (
            brandInStore[field3] === undefined ||
            (brandInStore[field3] && brandInStore[field3].length === 0)
          ) {
            isApplied = false;
            newBrandInStore = {
              ...newBrandInStore,
              errors: {
                ...newBrandInStore.errors,
                [field3]: translate('storeBrandRankingContents.errors.ranking'),
              },
            };
          }
          return newBrandInStore;
        },
      );

      setBrandInStores([...newBrandInStores]);

      return isApplied;
    },
    [brandInStores, setBrandInStores, translate],
  );

  const handleCheckDuplicatedBrand = React.useCallback(() => {
    let isApplied = true;
    for (let i = brandInStores.length - 1; i >= 0; i--) {
      for (let j = 0; j < i; j++) {
        if (brandInStores[i].brandId === brandInStores[j].brandId) {
          brandInStores[i] = BrandInStore.clone<BrandInStore>({
            ...brandInStores[i],
            errors: {
              ...brandInStores[i].errors,
              brand: `Thương hiệu bị trùng lặp ở xếp hạng số ${j + 1}`,
            },
          });
          isApplied = false;
        }
      }
    }
    setBrandInStores([...brandInStores]);
    return isApplied;
  }, [brandInStores, setBrandInStores]);

  const handleApply = React.useCallback(() => {
    if (
      checkMissingField(
        'brand',
        'brandInStoreProductGroupingMappings',
        'top',
      ) &&
      handleCheckDuplicatedBrand()
    ) {
      setBrandInStores(sortByRanking(brandInStores));
    }
  }, [
    sortByRanking,
    brandInStores,
    setBrandInStores,
    checkMissingField,
    handleCheckDuplicatedBrand,
  ]);

  const productGroupingMappings = React.useMemo(() => {
    return productGroupings;
  }, [productGroupings]);

  const handleChangeBrand = React.useCallback(
    (index: number) => (brandId: number, brand: Brand) => {
      // let newSelectedBrand = [...selectedBrand];
      // newSelectedBrand.push(brand);
      // setSelectedBrand()
      brandInStores[index] = BrandInStore.clone<BrandInStore>({
        ...brandInStores[index],

        brandId,
        brand,

        errors: {
          ...brandInStores[index].errors,
          brandId: null,
          brand: null,
        },
      });
      setBrandInStores([...brandInStores]);
    },
    [brandInStores, setBrandInStores],
  );

  const handleChangeRanking = React.useCallback(
    (index: number) => (value: number) => {
      brandInStores[index] = BrandInStore.clone<BrandInStore>({
        ...brandInStores[index],

        top: value,

        errors: {
          ...brandInStores[index].errors,
          top: null,
        },
      });

      setBrandInStores([...brandInStores]);
    },
    [brandInStores, setBrandInStores],
  );

  const handleClearProductGroupingMappings = React.useCallback(
    (index: number, productGroupingIndex: number) => () => {
      brandInStores[index].brandInStoreProductGroupingMappings.splice(
        productGroupingIndex,
        1,
      );
      setBrandInStores([...brandInStores]);
    },
    [brandInStores, setBrandInStores],
  );

  const handleDelete = React.useCallback(() => {
    const selectedIds = selectedContents.map(item => item.key);
    const remainBrandInStore = brandInStores.filter(
      (brandInStore: BrandInStore) => {
        return !selectedIds.includes(brandInStore.key);
      },
    );

    setBrandInStores([...remainBrandInStore]);
  }, [brandInStores, selectedContents, setBrandInStores]);

  const columns: ColumnProps<BrandInStore>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<BrandInStore>(pagination),
      },
      {
        title: translate('storeBrandRankingContents.brand'),
        key: nameof(dataSource[0].brand),
        dataIndex: nameof(dataSource[0].brand),
        align: 'center',
        render(...[, content, index]) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<BrandInStore>(
                content.errors,
                nameof(content.brand),
              )}
              help={content.errors?.brand}
            >
              {validAction('singleListBrand') && (
                <SelectAutoComplete
                  value={content.brand?.id}
                  onChange={handleChangeBrand(index)}
                  getList={storeRepository.singleListBrand}
                  modelFilter={brandFilter}
                  setModelFilter={setBrandFilter}
                  searchField={nameof(brandFilter.name)}
                  searchType={nameof(brandFilter.name.contain)}
                  placeholder={translate(
                    'storeBrandRankingContents.placeholder.brandName',
                  )}
                  allowClear={false}
                />
              )}
            </FormItem>
          );
        },
      },

      {
        title: translate('storeBrandRankingContents.productGroupings'),
        align: 'center',
        render(...[, content, index]) {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 24,
              }}
            >
              <div
                className="tag__wrapper"
                onClick={() => handleOpenModal(index)}
              >
                <span className={'tag__placeholder'}>
                  {brandInStores[index].brandInStoreProductGroupingMappings
                    .length === 0
                    ? translate(
                        'storeBrandRankingContents.placeholder.productGroupings',
                      )
                    : null}
                </span>

                {brandInStores &&
                  brandInStores[index].brandInStoreProductGroupingMappings &&
                  brandInStores[index].brandInStoreProductGroupingMappings.map(
                    (
                      productGroupingMapping: any,
                      productGroupingIndex: number,
                    ) => {
                      return (
                        <Tag
                          className="tag"
                          closable
                          onClose={handleClearProductGroupingMappings(
                            index,
                            productGroupingIndex,
                          )}
                          key={productGroupingIndex}
                        >
                          {productGroupingMapping?.productGrouping?.name}
                        </Tag>
                      );
                    },
                  )}

                <i className="fa fa-list-alt input__icon"></i>
              </div>
              <FormItem
                validateStatus={formService.getValidationStatus<BrandInStore>(
                  content.errors,
                  nameof(content.brandInStoreProductGroupingMappings),
                )}
                help={content.errors?.brandInStoreProductGroupingMappings}
              ></FormItem>
            </div>
          );
        },
      },

      {
        title: translate('storeBrandRankingContents.ranking'),
        key: nameof(dataSource[0].top),
        dataIndex: nameof(dataSource[0].top),
        align: 'center',
        render(top: any, content: BrandInStore, index: number) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<BrandInStore>(
                content.errors,
                nameof(content.top),
              )}
              help={content.errors?.top}
            >
              <InputNumber
                className="form-control form-control-sm"
                placeholder={translate(
                  'storeBrandRankingContents.placeholder.ranking',
                )}
                defaultValue={top}
                onChange={handleChangeRanking(index)}
                allowNegative={false}
                min={1}
                max={5}
                onlyInteger={true}
              />
            </FormItem>
          );
        },
      },
    ],
    [
      dataSource,
      // dataSourceWithDefault,
      // defaultUOMList,
      // filter,
      // handleChangeListSimpleField,
      // handleChangeUOMInContent,
      // handleDelete,
      // model,
      pagination,
      // setFilter,
      translate,
      validAction,
      // isPreview,
      brandFilter,
      handleOpenModal,
      brandInStores,
      handleChangeBrand,
      handleClearProductGroupingMappings,
      handleChangeRanking,
    ],
  );

  const tableFooter = React.useCallback(
    () => (
      <>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
          disabled={brandInStores.length === 5}
        >
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.add)}
        </button>

        <button
          className="btn btn-sm btn-outline-primary ml-2 mr-2"
          onClick={handleDelete}
          disabled={selectedContents.length === 0}
        >
          <i className="fa fa-times-circle mr-2" />
          {translate(generalLanguageKeys.actions.delete)}
        </button>

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleApply}
        >
          <i className="fa fa-check mr-2" />
          {translate(generalLanguageKeys.actions.apply)}
        </button>
      </>
    ),
    [
      handleAdd,
      translate,
      handleApply,
      handleDelete,
      selectedContents,
      brandInStores,
    ],
  );

  return (
    <>
      <div className="brandInStore-table-content">
        <Table
          rowSelection={rowSelection}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          onChange={handleTableChange}
          tableLayout="fixed"
          size="small"
          footer={tableFooter}
          className="ml-24 table-content"
        />
      </div>
      <TreePopup
        visible={visible}
        getList={storeRepository.listProductGrouping}
        onClose={() => setVisible(false)}
        modelFilter={productGroupingFilter}
        setModelFilter={setProductGroupingFilter}
        onlyLeaf={true}
        onChange={handleChangeTreePopup(currentIndexBrandInStore)}
        selectedItems={productGroupingMappings}
      />
    </>
  );
}

export default StoreBrandRankingContentTable;
