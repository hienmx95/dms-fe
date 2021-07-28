import { Modal } from 'antd';
import { generalLanguageKeys } from 'config/consts';
import { SPECIAL_CHARACTERS_VARIATION } from 'core/config';
import { ChangePriceHistory } from 'models/ChangePriceHistory';
import { ChangePriceHistoryFilter } from 'models/ChangePriceHistoryFilter';
import { Item } from 'models/Item';
import { Product } from 'models/Product';
import { Variation } from 'models/Variation';
import { VariationGrouping } from 'models/VariationGrouping';
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelFilter } from '../../../core/models/ModelFilter';

export class ProductService {
  public useChangePriceHistoryMaster(
    getList: (
      filter: ChangePriceHistoryFilter,
    ) => Promise<ChangePriceHistory[]>,
    count: (filter: ChangePriceHistoryFilter) => Promise<number>,
    currentItem: Product,
  ): [
    ChangePriceHistoryFilter,
    Dispatch<SetStateAction<ChangePriceHistoryFilter>>,
    ChangePriceHistory[],
    Dispatch<SetStateAction<ChangePriceHistory[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
    () => void,
  ] {
    const [filter, setFilter] = React.useState<ChangePriceHistoryFilter>(
      new ChangePriceHistoryFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<ChangePriceHistory[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    // setList and count
    React.useEffect(() => {
      if (loadList && currentItem) {
        filter.productId.equal = currentItem.id;
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
    }, [count, currentItem, filter, filter.productId.equal, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take } = ChangePriceHistoryFilter.clone<
        ChangePriceHistoryFilter
      >(new ChangePriceHistoryFilter());
      setFilter(
        ModelFilter.clone<ChangePriceHistoryFilter>({
          ...filter,
          skip,
          take,
        }),
      );
      setLoadList(true);
    }, [filter]);
    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
      handleDefaultSearch,
    ];
  }
  permutations(choices, callback, prefix = []) {
    if (!choices.length) {
      return callback(prefix);
    }
    // tslint:disable-next-line:prefer-for-of
    for (let c = 0; c < choices[0].variations?.length; c++) {
      this.permutations(
        choices.slice(1),
        callback,
        prefix.concat(choices[0].variations[c]),
      );
    }
  }

  usePrice(
    product: Product,
    setProduct: Dispatch<SetStateAction<Product>>,
  ): [
    // number,
    // Dispatch<SetStateAction<number>>,
    // number,
    // Dispatch<SetStateAction<number>>,
    () => void,
    boolean,
    (index: number) => (value?: string) => void,
    (index: number) => () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] {
    // const [retailPrice, setRetailPrice] = React.useState<number>(0);
    // const [salePrice, setSalePrice] = React.useState<number>(0);
    const [combine, setCombine] = React.useState<boolean>(true);

    const addable: boolean =
      typeof product.variationGroupings === 'object'
        ? !(product.variationGroupings?.length >= 4)
        : true;

    const handleAddVariation = React.useCallback(() => {
      if (addable) {
        setCombine(true);
        setProduct(
          Product.clone<Product>({
            ...product,
            variationGroupings: [
              ...(product.variationGroupings ?? []),
              new VariationGrouping(),
            ],
          }),
        );
      }
    }, [addable, product, setProduct, setCombine]);

    const handleChangeVariationGroupingName = React.useCallback(
      (index: number) => {
        return (value?: string) => {
          setCombine(true);
          product.variationGroupings[index].name = value;
          setProduct(
            Product.clone<Product>({
              ...product,
            }),
          );
        };
      },
      [product, setProduct, setCombine],
    );

    const handleRemoveVariationGrouping = React.useCallback(
      (index: number) => {
        return () => {
          setCombine(true);
          product.variationGroupings?.splice(index, 1);
          setProduct(
            Product.clone<Product>({
              ...product,
            }),
          );
        };
      },
      [product, setProduct, setCombine],
    );

    return [
      // retailPrice,
      // setRetailPrice,
      // salePrice,
      // setSalePrice,
      handleAddVariation,
      addable,
      handleChangeVariationGroupingName,
      handleRemoveVariationGrouping,
      combine,
      setCombine,
    ];
  }

  useVariationGrouping(
    product: Product,
    setProduct: Dispatch<SetStateAction<Product>>,
    onSave: (product: Product) => Promise<Product>,
    items: Item[],
    setItems: Dispatch<SetStateAction<Item[]>>,
    price: number,
    retailPrice: number,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setCombine?: Dispatch<SetStateAction<boolean>>,
    onCancel?: () => void,
  ): [
    boolean,
    boolean,
    Variation,
    VariationGrouping,
    (index: number) => () => void,
    () => void,
    () => void,
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => void,
    (index: number) => string[],
    () => void,
    (groupIndex: number) => (itemIndex: number) => void,
    (index: number) => () => void,
    (index: number) => () => void,
  ] {
    const [translate] = useTranslation();
    const [visible, setVisible] = React.useState<boolean>(false);
    const [
      currentVariationGrouping,
      setCurrentVariationGrouping,
    ] = React.useState<VariationGrouping>(null);
    const [currentVariation, setCurrentVariation] = React.useState<Variation>(
      null,
    );
    const [visibleErrorCode, setVisibleErrorCode] = React.useState<boolean>(
      false,
    );
    const [currentIndex, setCurrentIndex] = React.useState<number>(-1);
    const [saveProduct, setSaveProduct] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (saveProduct) {
        setLoading(true);
        // setSaveProduct(false);
        onSave(product)
          .then(() => {
            setProduct({ ...product });
          })
          .finally(() => {
            setLoading(false);
            setSaveProduct(false);
          });
      }
    }, [onSave, product, saveProduct, setLoading, setProduct]);

    const handleOpenModal = React.useCallback(
      (index: number) => {
        return () => {
          setCurrentIndex(index);
          const currentVariation: Variation = new Variation();
          setCurrentVariation(currentVariation);
          setCurrentVariationGrouping(product.variationGroupings[index]);
          setVisible(true);
        };
      },
      [product.variationGroupings],
    );
    const handleChangeCurrentVariation = React.useCallback(
      (field: string) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
          setCombine(true);
          if (field === 'code') {
            if (SPECIAL_CHARACTERS_VARIATION.test(event?.target?.value)) {
              setVisibleErrorCode(true);
            } else {
              setVisibleErrorCode(false);
            }
          }
          setCurrentVariation({
            ...currentVariation,
            [field]: event?.target?.value,
          });
        };
      },
      [currentVariation, setCombine],
    );
    const handleUpdateVariationGrouping = React.useCallback(() => {
      setCombine(true);
      const { variations = [] } = currentVariationGrouping;
      product.variationGroupings[currentIndex].variations = [
        ...variations,
        currentVariation,
      ];
      setProduct(
        Product.clone<Product>({
          ...product,
          variationGroupings: [...product.variationGroupings],
        }),
      );
      setVisible(false);
    }, [
      currentIndex,
      currentVariation,
      currentVariationGrouping,
      product,
      setProduct,
      setCombine,
    ]);

    /* remove variation in variation list and its related items, save product */
    const handleRemoveVariation = React.useCallback(
      (groupindex: number) => {
        return (itemIndex: number) => {
          setCombine(true);
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,

            onOk() {
              // remove variation from indexed list
              const variationList =
                product.variationGroupings[groupindex].variations;
              const removedVariation = variationList[itemIndex];
              variationList.splice(itemIndex, 1);
              product.variationGroupings[groupindex].variations = variationList;
              // remove items of deleted variation
              const newItems = items.filter(
                (item: Item) =>
                  !item.name.trim().includes(removedVariation.name.trim()),
              );
              setProduct(
                Product.clone<Product>({
                  ...product,
                  variationGroupings: [...product.variationGroupings],
                  items: [...newItems],
                }),
              );
              // save item to database
              setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, product, setProduct, translate, setCombine],
    );

    const handleRemoveVariationGrouping = React.useCallback(
      (index: number) => {
        return () => {
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,

            onOk() {
              const removedGrouping = product.variationGroupings[index];
              // remove variationGrouping from indexed list
              product.variationGroupings?.splice(index, 1);
              if (removedGrouping) {
                const variations = removedGrouping?.variations?.map(
                  v => v.name,
                );
                // find items match
                if (items.length > 0) {
                  const newItems = items.filter((item: Item) => {
                    let match = true;
                    variations.forEach(v => {
                      if (v.trim().includes(item.name.trim())) {
                        match = false;
                      }
                    });
                    return match;
                  });
                  setItems(newItems);
                  setCombine(true);
                }
              }
              setProduct(
                Product.clone<Product>({
                  ...product,
                }),
              );
              // save item to database
              // setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, product, setItems, setProduct, translate, setCombine],
    );

    const handleCloseModal = React.useCallback(() => {
      setCurrentVariationGrouping(null);
      setVisibleErrorCode(false);
      setVisible(false);
    }, []);
    const getDisplayValue: (index: number) => string[] = React.useCallback(
      index => {
        return product.variationGroupings[index].variations
          ?.filter((v: Variation) => {
            return typeof v.name === 'string' && v.name !== '';
          })
          .map((v: Variation) => v.name);
      },
      [product.variationGroupings],
    );

    const handleCombineVariations = React.useCallback(() => {
      const { variationGroupings } = product;
      const result: { [key: string]: Item } = {};
      const currentItems: Item[] = product.items;
      const currentItemKeys: { [key: number]: Item } = {};
      currentItems?.forEach((item: Item) => {
        currentItemKeys[item.id] = item;
      });
      this.permutations(variationGroupings, prefix => {
        const key: string = prefix.map((v: Variation) => v.code).join('-');
        const newItem: Item = Item.clone<Item>({
          key,
          productId: product.id,
          product,
          name: `${product.name} - ${prefix
            .map((v: Variation) => v.name)
            .join(' - ')}`,
          code: `${product.code}-${prefix
            .map((v: Variation) => v.code)
            .join('-')}`,
          scanCode: product.scanCode,
          salePrice: price,
          retailPrice,
          images: [],
          canDelete: true,
        });
        result[key] = newItem;
        return newItem;
      });
      // add new Items to list
      const newItems = [...Object.values(result)];
      setProduct(
        Product.clone<Product>({
          ...product,
          items: newItems,
        }),
      );
      setCombine(false);
      // setSaveProduct(true);
    }, [price, product, retailPrice, setProduct, setCombine]);

    const handleDeleteItem = React.useCallback(
      (index: number) => {
        return () => {
          Modal.confirm({
            title: translate(generalLanguageKeys.delete.title),
            content: translate(generalLanguageKeys.delete.content),
            onCancel,

            onOk() {
              setLoading(true);
              items.splice(index, 1);
              setItems([...items]);
              setSaveProduct(true);
            },
          });
        };
      },
      [items, onCancel, setItems, setLoading, translate],
    );

    return [
      visible,
      visibleErrorCode,
      currentVariation,
      currentVariationGrouping,
      handleOpenModal,
      handleCloseModal,
      handleUpdateVariationGrouping,
      handleChangeCurrentVariation,
      getDisplayValue,
      handleCombineVariations,
      handleRemoveVariation,
      handleDeleteItem,
      handleRemoveVariationGrouping,
    ];
  }
}

export const productService: ProductService = new ProductService();
