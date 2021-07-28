import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { crudService } from 'core/services/CRUDService';
import { Filter } from 'core/filters';

export class NewProductService {
  public useProductContentMaster(
    getList: (filter: ProductFilter) => Promise<Product[]>,
    count: (filter: ProductFilter) => Promise<number>,
  ): [
    ProductFilter,
    Dispatch<SetStateAction<ProductFilter>>,
    Product[],
    Dispatch<SetStateAction<Product[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<ProductFilter>(
      new ProductFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
          });
      }
    }, [count, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
    ];
  }
  // for master page
  public useNewProductMaster(
    count: (filter: ProductFilter) => Promise<number>,
    getList: (filter: ProductFilter) => Promise<Product[]>,
    getDetail: (id: number | string) => Promise<Product>,
  ): [
    ProductFilter,
    Dispatch<SetStateAction<ProductFilter>>,
    Product[],
    Dispatch<SetStateAction<Product[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    number,
    boolean,
    boolean,
    Product,
    (id: string | number) => () => void,
    () => void,
    <TF extends Filter>(field: string) => (f: TF) => void,
    () => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [filter, setFilter] = crudService.useQuery<ProductFilter>(
      ProductFilter,
    );
    const [list, setList] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [previewModel, setPreviewModel] = React.useState<Product>(
      new Product(),
    );
    const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
    const [previewLoading, setPreviewLoading] = React.useState<boolean>(false);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    const [resetSelect, setResetSelect] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (loadList) {
        setLoading(true);
        Promise.all([getList(filter), count(filter)])
          .then(([list, total]) => {
            setList(list);
            setTotal(total);
          })
          .finally(() => {
            setLoadList(false);
            setLoading(false);
            setResetSelect(true);
          });
      }
    }, [count, filter, getList, loadList]);

    const handleOpenPreview = React.useCallback(
      (id: number | string) => {
        return () => {
          setPreviewModel(new Product());
          setPreviewLoading(true);
          setPreviewVisible(true);
          getDetail(id)
            .then((tDetail: Product) => {
              setPreviewModel(tDetail);
            })
            .finally(() => {
              setPreviewLoading(false);
            });
        };
      },
      [getDetail],
    );

    const handleClosePreview = React.useCallback(() => {
      setPreviewVisible(false);
      setPreviewModel(new Product());
    }, []);

    const handleFilter = React.useCallback(
      <TF extends Filter>(field: string) => {
        return (f: TF) => {
          const { skip, take } = ProductFilter.clone<ProductFilter>(
            new ProductFilter(),
          );
          setFilter(
            ProductFilter.clone<ProductFilter>({
              ...filter,
              [field]: f,
              skip,
              take,
            }),
          );
          setLoadList(true);
        };
      },
      [filter, setFilter],
    );

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, []);

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take } = ProductFilter.clone<ProductFilter>(
        new ProductFilter(),
      );
      setFilter(
        ProductFilter.clone<ProductFilter>({
          ...filter,
          skip,
          take,
        }),
      );
      setLoadList(true);
    }, [filter, setFilter]);

    const handleReset = React.useCallback(() => {
      setFilter(ProductFilter.clone<ProductFilter>(new ProductFilter()));
      setLoadList(true);
      setIsReset(true);
    }, [setFilter, setIsReset]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      total,
      previewLoading,
      previewVisible,
      previewModel,
      handleOpenPreview,
      handleClosePreview,
      handleFilter,
      handleSearch,
      handleReset,
      isReset,
      setIsReset,
      handleDefaultSearch,
      setLoadList,
      resetSelect,
      setResetSelect,
    ];
  }
}

export const newProductService: NewProductService = new NewProductService();
